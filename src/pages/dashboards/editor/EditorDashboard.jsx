import React, { useState, useEffect } from 'react';
import { apiFetch, resolveFileUrl } from '../../../utils/api';
import { toast } from 'react-toastify';
import {
  FaBookOpen,
  FaFilePdf,
  FaUserEdit,
  FaCheckCircle,
  FaSearch,
  FaTimes,
  FaEdit,
  FaUserCheck,
  FaLayerGroup,
  FaUpload,
  FaClipboardList,
  FaShieldAlt,
  FaHistory,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserShield,
  FaFilter,
  FaSquareRootAlt,
  FaExternalLinkAlt,
  FaDownload,
  FaUserSecret
} from 'react-icons/fa';
import LatexEditorModal from '../../../components/LatexEditorModal';

const EditorDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const isAdmin = (user.role_name || '').toLowerCase().includes('admin');

  const [articles, setArticles] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [editors, setEditors] = useState([]);
  const [volumes, setVolumes] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [scopeFilter, setScopeFilter] = useState(isAdmin ? 'ALL' : 'ASSIGNED_TO_ME');
  const [activeLatexArticle, setActiveLatexArticle] = useState(null);

  // Managing Action Modal State
  const [managingArticle, setManagingArticle] = useState(null);
  const [formData, setFormData] = useState({
    status: 'under_review',
    assigned_editor_id: '',
    editor_notes: '',
    copyedit_notes: '',
    volume_id: '',
    issue_id: '',
    doi: '',
    page_range: '',
    reviewer_user_id: '',
    review_due_date: '',
    copyeditFile: null
  });
  const [submitting, setSubmitting] = useState(false);

  // Document Viewer Modal State
  const [viewingDoc, setViewingDoc] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const articleEndpoint = isAdmin 
        ? '/articles' 
        : `/articles?assigned_editor_id=${user.user_id || 0}`;

      const [artRes, usersRes, volRes, issRes] = await Promise.all([
        apiFetch(articleEndpoint),
        apiFetch('/users'),
        apiFetch('/volumes?with_issues=true'),
        apiFetch('/issues')
      ]);

      const rawArticles = artRes.data || [];
      // Strictly enforce assigned papers only for editors
      const assignedOnly = isAdmin 
        ? rawArticles 
        : rawArticles.filter(a => String(a.assigned_editor_id) === String(user.user_id));

      setArticles(assignedOnly);
      if (usersRes.data) {
        setReviewers(usersRes.data.filter(u => ['reviewer', 'editor', 'assistant editor', 'admin'].includes(u.role_name?.toLowerCase())));
        setEditors(usersRes.data.filter(u => ['editor', 'assistant editor', 'admin'].includes(u.role_name?.toLowerCase())));
      }
      if (volRes.data) setVolumes(volRes.data);
      if (issRes.data) setIssues(issRes.data);
    } catch (err) {
      console.error('Failed to fetch editor data:', err);
      toast.error('Failed to load editorial data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.user_id]);

  const handleOpenManageModal = (art) => {
    setManagingArticle(art);
    setFormData({
      status: art.status || 'submitted',
      assigned_editor_id: art.assigned_editor_id || '',
      editor_notes: art.editor_notes || '',
      copyedit_notes: art.copyedit_notes || '',
      volume_id: art.volume_id || '',
      issue_id: art.issue_id || '',
      doi: art.doi || '',
      page_range: art.page_range || '',
      reviewer_user_id: '',
      review_due_date: '',
      copyeditFile: null
    });
  };

  const handleSaveEditorialAction = async (e) => {
    e.preventDefault();
    if (!managingArticle) return;

    setSubmitting(true);
    try {
      let copyeditDocId = managingArticle.copyedit_doc_id;

      // 1. Upload copyedit document if provided
      if (formData.copyeditFile) {
        const uploadForm = new FormData();
        uploadForm.append('file', formData.copyeditFile);
        uploadForm.append('uploaded_by', user.user_id || 1);
        uploadForm.append('folder', 'copyediting');

        const uploadRes = await apiFetch('/docs', {
          method: 'POST',
          body: uploadForm
        });
        if (uploadRes && uploadRes.data?.doc_id) {
          copyeditDocId = uploadRes.data.doc_id;
        }
      }

      // 2. Update Article Status, Assigned Editor, Notes, Issue, DOI
      const payload = {
        status: formData.status,
        assigned_editor_id: formData.assigned_editor_id ? parseInt(formData.assigned_editor_id) : (managingArticle.assigned_editor_id || user.user_id || null),
        editor_notes: formData.editor_notes,
        copyedit_notes: formData.copyedit_notes,
        copyedit_doc_id: copyeditDocId,
        issue_id: formData.issue_id ? parseInt(formData.issue_id) : null,
        doi: formData.doi ? formData.doi.trim() : null,
        page_range: formData.page_range ? formData.page_range.trim() : null
      };

      await apiFetch(`/articles?id=${managingArticle.article_id}`, {
        method: 'PATCH',
        body: payload
      });

      // 3. Assign Reviewer if selected
      if (formData.reviewer_user_id) {
        await apiFetch('/reviews', {
          method: 'POST',
          body: {
            article_id: managingArticle.article_id,
            reviewer_user_id: parseInt(formData.reviewer_user_id),
            due_date: formData.review_due_date || null,
            status: 'assigned'
          }
        });
        toast.success('Peer reviewer assigned successfully!');
      }

      toast.success('Editorial status and workflow updated successfully!');
      setManagingArticle(null);
      await fetchData();
    } catch (err) {
      console.error('Error updating editorial status:', err);
      toast.error(err.message || 'Failed to update editorial status');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full uppercase tracking-wider">Published</span>;
      case 'accepted':
        return <span className="px-2.5 py-0.5 bg-green-100 text-green-800 text-[11px] font-bold rounded-full uppercase tracking-wider">Accepted</span>;
      case 'copyediting':
        return <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 text-[11px] font-bold rounded-full uppercase tracking-wider">Copyediting</span>;
      case 'under_review':
      case 'in_review':
        return <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[11px] font-bold rounded-full uppercase tracking-wider">Under Review</span>;
      case 'rejected':
        return <span className="px-2.5 py-0.5 bg-red-100 text-red-800 text-[11px] font-bold rounded-full uppercase tracking-wider">Declined</span>;
      case 'incomplete':
        return <span className="px-2.5 py-0.5 bg-orange-100 text-orange-800 text-[11px] font-bold rounded-full uppercase tracking-wider">Incomplete</span>;
      case 'submitted':
      default:
        return <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 text-[11px] font-bold rounded-full uppercase tracking-wider">Submitted</span>;
    }
  };

  const filteredArticles = articles.filter(art => {
    const matchesSearch = 
      art.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.author_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.editor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.keywords?.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesScope = true;
    if (scopeFilter === 'ASSIGNED_TO_ME') {
      matchesScope = String(art.assigned_editor_id) === String(user.user_id);
    } else if (scopeFilter === 'UNASSIGNED') {
      matchesScope = !art.assigned_editor_id;
    }

    if (!matchesScope) return false;
    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'REVIEW') return matchesSearch && ['under_review', 'in_review'].includes(art.status);
    return matchesSearch && art.status === statusFilter;
  });

  const availableIssuesInForm = formData.volume_id
    ? issues.filter(i => String(i.volume_id) === String(formData.volume_id))
    : issues;

  return (
    <div className="space-y-8">
      
      {/* 1. Header & Anonymity Mode */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[11px] font-bold rounded-md uppercase tracking-wider">
              {isAdmin ? 'System Administrator Desk' : 'Assigned Editorial Desk'}
            </span>
            <span className="text-xs text-gray-500 font-medium">
              {user.display_name} ({user.email})
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 font-sans tracking-tight">
            {isAdmin ? 'Editorial Workflow & Lifecycle Management' : 'My Assigned Manuscripts'}
          </h2>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            {isAdmin 
              ? 'Screen incoming submissions, assign peer reviewers, coordinate copyediting, and manage issue publications.'
              : 'Managing only the scholarly manuscripts assigned to your editorial desk for peer review and decision handling.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border shadow-xs bg-gray-900 text-amber-300 border-gray-900">
            <FaLock className="text-amber-300" />
            <span>Double-Blind Protocol: STRICTLY ACTIVE & LOCKED</span>
          </div>
        </div>
      </div>

      {/* 2. Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div 
          onClick={() => { setStatusFilter('ALL'); setScopeFilter(isAdmin ? 'ALL' : 'ASSIGNED_TO_ME'); }}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${statusFilter === 'ALL' && scopeFilter !== 'UNASSIGNED' ? 'bg-gray-900 text-white shadow-md' : 'bg-white border-gray-100 hover:border-gray-400'}`}
        >
          <p className="text-xs font-bold uppercase tracking-wider opacity-80">{isAdmin ? 'All Papers' : 'My Assigned'}</p>
          <p className="text-2xl font-bold mt-1">{articles.length}</p>
        </div>

        {isAdmin && (
          <div 
            onClick={() => { setScopeFilter('ASSIGNED_TO_ME'); setStatusFilter('ALL'); }}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${scopeFilter === 'ASSIGNED_TO_ME' ? 'bg-gray-900 text-white shadow-md' : 'bg-white border-gray-100 hover:border-gray-400'}`}
          >
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">Assigned To Me</p>
            <p className="text-2xl font-bold mt-1 text-gray-500">
              {articles.filter(a => String(a.assigned_editor_id) === String(user.user_id)).length}
            </p>
          </div>
        )}

        <div 
          onClick={() => { setStatusFilter('submitted'); }}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${statusFilter === 'submitted' ? 'bg-amber-600 text-white shadow-md' : 'bg-white border-gray-100 hover:border-amber-400'}`}
        >
          <p className="text-xs font-bold uppercase tracking-wider opacity-80">Screening</p>
          <p className="text-2xl font-bold mt-1 text-amber-700">
            {articles.filter(a => a.status === 'submitted').length}
          </p>
        </div>

        <div 
          onClick={() => { setStatusFilter('REVIEW'); }}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${statusFilter === 'REVIEW' ? 'bg-blue-600 text-white shadow-md' : 'bg-white border-gray-100 hover:border-blue-400'}`}
        >
          <p className="text-xs font-bold uppercase tracking-wider opacity-80">In Review</p>
          <p className="text-2xl font-bold mt-1 text-blue-600">
            {articles.filter(a => ['under_review', 'in_review'].includes(a.status)).length}
          </p>
        </div>

        <div 
          onClick={() => { setStatusFilter('copyediting'); }}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${statusFilter === 'copyediting' ? 'bg-purple-600 text-white shadow-md' : 'bg-white border-gray-100 hover:border-purple-400'}`}
        >
          <p className="text-xs font-bold uppercase tracking-wider opacity-80">Copyediting</p>
          <p className="text-2xl font-bold mt-1 text-purple-600">
            {articles.filter(a => a.status === 'copyediting').length}
          </p>
        </div>

        <div 
          onClick={() => { setStatusFilter('published'); }}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${statusFilter === 'published' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white border-gray-100 hover:border-emerald-400'}`}
        >
          <p className="text-xs font-bold uppercase tracking-wider opacity-80">Published</p>
          <p className="text-2xl font-bold mt-1 text-emerald-600">
            {articles.filter(a => a.status === 'published').length}
          </p>
        </div>
      </div>

      {/* 3. Scope & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        {isAdmin ? (
          <div className="flex items-center gap-1.5 p-1 bg-gray-50 rounded-xl border border-gray-200 text-xs font-bold">
            <button
              onClick={() => setScopeFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${scopeFilter === 'ALL' ? 'bg-gray-900 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              All Submissions
            </button>
            <button
              onClick={() => setScopeFilter('ASSIGNED_TO_ME')}
              className={`px-3 py-1.5 rounded-lg transition-all ${scopeFilter === 'ASSIGNED_TO_ME' ? 'bg-gray-900 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Assigned to Me
            </button>
            <button
              onClick={() => setScopeFilter('UNASSIGNED')}
              className={`px-3 py-1.5 rounded-lg transition-all ${scopeFilter === 'UNASSIGNED' ? 'bg-amber-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Unassigned Queue
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-bold text-gray-700 bg-blue-50 px-3.5 py-2 rounded-xl border border-blue-200">
            <FaUserCheck className="text-blue-600" />
            <span>Assigned to Your Editorial Desk ({articles.length} Papers)</span>
          </div>
        )}

        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search manuscripts, authors, keywords..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400 text-xs" />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-gray-400">
          {['ALL', 'submitted', 'under_review', 'copyediting', 'accepted', 'published'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${statusFilter === st ? 'bg-gray-900 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-900'}`}
            >
              {st === 'ALL' ? 'All' : st.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Editorial Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider font-bold">
                <th className="py-4 px-6">Manuscript Title & Topics</th>
                <th className="py-4 px-6">Author</th>
                <th className="py-4 px-6">Assigned Editor</th>
                <th className="py-4 px-6">Current Status</th>
                <th className="py-4 px-6">Assigned Reviewers</th>
                <th className="py-4 px-6">Publication Target</th>
                <th className="py-4 px-6 text-right">Editorial Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-gray-500 font-bold">Loading assigned manuscripts...</td>
                </tr>
              ) : filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-gray-500 font-medium">No manuscripts found for this filter.</td>
                </tr>
              ) : (
                filteredArticles.map(article => (
                  <tr key={article.article_id} className="hover:bg-gray-50 transition-colors">
                    
                    {/* Title */}
                    <td className="py-4 px-6 max-w-xs">
                      <p className="font-bold text-gray-900 truncate">{article.title}</p>
                      {article.keywords && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {article.keywords.split(',').map((kw, idx) => kw.trim() && (
                            <span key={idx} className="inline-block text-[10px] font-semibold bg-gray-50 text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full">
                              #{kw.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Author */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-900 text-xs font-bold rounded-lg border border-amber-200 shadow-xs">
                        <FaLock className="text-[10px] text-amber-700" /> [Author Identity Redacted]
                      </span>
                    </td>

                    {/* Assigned Editor */}
                    <td className="py-4 px-6 text-xs">
                      {article.editor_name ? (
                        <div className="flex items-center gap-1.5 font-bold text-gray-900">
                          <FaUserShield className="text-gray-500" />
                          <span>{article.editor_name}</span>
                          {String(article.assigned_editor_id) === String(user.user_id) && (
                            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded text-[9px] font-bold">You</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 text-xs font-semibold">
                          Unassigned
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      {getStatusBadge(article.status)}
                    </td>

                    {/* Reviewers */}
                    <td className="py-4 px-6 text-xs">
                      {article.reviews && article.reviews.length > 0 ? (
                        <div className="space-y-1">
                          {article.reviews.map((rev, rIdx) => (
                            <div key={rIdx} className="flex items-center gap-1.5 font-medium text-gray-700">
                              <FaUserShield className="text-blue-600 text-xs flex-shrink-0" />
                              <span className="font-semibold text-gray-800">Reviewer #{rIdx + 1}:</span>
                              <span className="font-bold uppercase text-[10px] bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded border border-blue-100">
                                {rev.recommendation || rev.status || 'Pending'}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">No reviewers assigned</span>
                      )}
                    </td>

                    {/* Volume & Issue */}
                    <td className="py-4 px-6 text-xs">
                      {article.volume_number && article.issue_number ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg font-bold">
                          <FaLayerGroup className="text-amber-700 text-[10px]" />
                          <span>Vol {article.volume_number}, Iss {article.issue_number}</span>
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Unassigned</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenManageModal(article)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                      >
                        <FaEdit /> Manage Stage
                      </button>

                      <button
                        onClick={() => setViewingDoc({
                          url: resolveFileUrl(article.manuscript_url || `/api/docs/stream?article_id=${article.article_id}`),
                          streamUrl: resolveFileUrl(article.manuscript_url || `/api/docs/stream?article_id=${article.article_id}`),
                          title: article.title,
                          id: article.article_id,
                          latex: article.latex_source || ''
                        })}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded-lg text-xs font-semibold"
                        title="View Author Manuscript with Protected Anonymized Layer"
                      >
                        <FaFilePdf className="text-red-600" /> View Document
                      </button>

                      <button
                        onClick={() => setActiveLatexArticle({
                          id: article.article_id,
                          title: article.title,
                          latex: article.latex_source || ''
                        })}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition-all shadow-xs"
                        title="Open LaTeX Manuscript & Equation Editor"
                      >
                        <FaSquareRootAlt className="text-emerald-600" /> LaTeX
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Editorial Action Modal */}
      {managingArticle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 sm:p-8 shadow-lg border border-gray-200 my-8 animate-scaleUp max-h-[92vh] overflow-y-auto">
            
            <div className="flex justify-between items-center pb-5 border-b border-gray-200">
              <div>
                <h3 className="text-2xl font-bold font-sans text-gray-900">
                  Manage Manuscript Lifecycle & Stage
                </h3>
                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xl">
                  {managingArticle.title}
                </p>
              </div>
              <button 
                onClick={() => setManagingArticle(null)}
                className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-black/5"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditorialAction} className="space-y-6 pt-5">
              
              {/* Change Lifecycle Status */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Set Journal / Manuscript Lifecycle Stage *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:border-gray-400"
                >
                  <option value="incomplete">Incomplete Draft (Pending Author Files)</option>
                  <option value="submitted">Submitted (Awaiting Screening / Reviewer Assignment)</option>
                  <option value="under_review">Under Peer Review (Active Double-Blind Evaluation)</option>
                  <option value="copyediting">Copyediting & Proofreading (Revising Typography / Formatting)</option>
                  <option value="accepted">Accepted for Publication (Queued for Issue)</option>
                  <option value="published">Published in Issue</option>
                  <option value="rejected">Declined / Needs Major Revisions</option>
                </select>
              </div>

              {/* Assign / Claim Managing Editor */}
              <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
                  <FaUserShield /> Assigned Managing Editor
                </div>
                <div>
                  <select
                    value={formData.assigned_editor_id}
                    onChange={(e) => setFormData({ ...formData, assigned_editor_id: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-amber-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-amber-500"
                  >
                    <option value="">-- No Assigned Editor (Unassigned) --</option>
                    {editors.map(e => (
                      <option key={e.user_id} value={e.user_id}>
                        {e.display_name} ({e.email}) [{e.role_name}]
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Assign Peer Reviewer */}
              <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-200 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-900">
                  <FaShieldAlt /> Assign Peer Reviewer
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-blue-950 mb-1">Select Reviewer</label>
                    <select
                      value={formData.reviewer_user_id}
                      onChange={(e) => setFormData({ ...formData, reviewer_user_id: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-blue-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-500"
                    >
                      <option value="">-- No New Reviewer --</option>
                      {reviewers.map(r => (
                        <option key={r.user_id} value={r.user_id}>
                          {r.display_name} ({r.email}) [{r.role_name}]
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-blue-950 mb-1">Review Due Date</label>
                    <input
                      type="date"
                      value={formData.review_due_date}
                      onChange={(e) => setFormData({ ...formData, review_due_date: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-blue-200 rounded-xl text-xs text-gray-900"
                    />
                  </div>
                </div>

                {/* Existing Reviews Summary */}
                {managingArticle.reviews && managingArticle.reviews.length > 0 && (
                  <div className="pt-2 border-t border-blue-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-950">Peer Review Feedback & Recommendations:</span>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Double-Blind Anonymized
                      </span>
                    </div>
                    {managingArticle.reviews.map((rev, idx) => (
                      <div key={idx} className="bg-white p-3.5 rounded-xl border border-blue-100 text-xs space-y-1.5 shadow-xs">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1.5">
                            <FaUserShield className="text-blue-600 text-xs" />
                            <strong className="text-blue-900 font-bold">Reviewer #{idx + 1}</strong>
                            <span className="text-[10px] text-gray-400 font-medium">(Double-Blind Peer Reviewer)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-[11px]">Status: {rev.status}</span>
                            <span className="font-bold uppercase text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              {rev.recommendation || 'Pending'}
                            </span>
                          </div>
                        </div>
                        {rev.review_comments && (
                          <p className="text-gray-700 italic bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                            "{rev.review_comments}"
                          </p>
                        )}
                        {rev.confidential_comments && (
                          <p className="text-gray-500 text-[11px] bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                            <strong className="text-amber-900">Confidential Note:</strong> {rev.confidential_comments}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Editorial Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Editor Notes & Feedback to Author
                </label>
                <textarea
                  rows="3"
                  value={formData.editor_notes}
                  onChange={(e) => setFormData({ ...formData, editor_notes: e.target.value })}
                  placeholder="Notes visible to the author explaining review decisions, formatting revisions, or publication schedule..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-gray-400"
                />
              </div>

              {/* Copyediting Section */}
              <div className="bg-purple-50/50 p-5 rounded-2xl border border-purple-200 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-900 block">
                  Copywriting, Proofreading & Formatted File
                </span>

                <div>
                  <label className="block text-xs font-bold text-purple-950 mb-1">
                    Copyediting Instructions / Revisions
                  </label>
                  <textarea
                    rows="2"
                    value={formData.copyedit_notes}
                    onChange={(e) => setFormData({ ...formData, copyedit_notes: e.target.value })}
                    placeholder="Details about stylistic refinements, citation styling (APA 7th), grammar, or layout proofing..."
                    className="w-full px-4 py-2 bg-white border border-purple-200 rounded-xl text-xs text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-purple-950 mb-1">
                    Upload Copyedited / Proofread Document (.pdf, .doc, .docx)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setFormData({ ...formData, copyeditFile: e.target.files[0] })}
                    className="w-full text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-200 file:text-purple-900 cursor-pointer"
                  />
                  {managingArticle.copyedit_url && (
                    <p className="text-xs text-purple-800 mt-1">
                      Current: <a href={resolveFileUrl(managingArticle.copyedit_url)} target="_blank" rel="noopener noreferrer" className="underline font-bold">Download Current Copyedited File</a>
                    </p>
                  )}
                </div>
              </div>

              {/* Target Volume & Issue */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Target Volume
                  </label>
                  <select
                    value={formData.volume_id}
                    onChange={(e) => setFormData({ ...formData, volume_id: e.target.value, issue_id: '' })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900"
                  >
                    <option value="">-- No Volume (Unassigned) --</option>
                    {volumes.map(v => (
                      <option key={v.volume_id} value={v.volume_id}>
                        {v.volume_title || `Volume ${v.volume_number} (${v.publication_year})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Target Issue
                  </label>
                  <select
                    value={formData.issue_id}
                    onChange={(e) => setFormData({ ...formData, issue_id: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900"
                  >
                    <option value="">-- No Issue (Unassigned) --</option>
                    {availableIssuesInForm.map(i => (
                      <option key={i.issue_id} value={i.issue_id}>
                        {i.issue_title || `Issue ${i.issue_number}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* DOI and Page Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    DOI
                  </label>
                  <input
                    type="text"
                    value={formData.doi}
                    onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                    placeholder="10.xxxx/tls.2025.01"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Page Range
                  </label>
                  <input
                    type="text"
                    value={formData.page_range}
                    onChange={(e) => setFormData({ ...formData, page_range: e.target.value })}
                    placeholder="pp. 1-15"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900"
                  />
                </div>
              </div>

              {/* Footer CTA */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setManagingArticle(null)}
                  className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all shadow disabled:opacity-50 flex items-center gap-2"
                >
                  <FaCheckCircle />
                  <span>{submitting ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 6. Comprehensive Editorial Document & Manuscript Viewer */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-3 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[92vh] flex flex-col relative overflow-hidden border border-slate-700">
            
            {/* Header Toolbar */}
            <div className="px-6 py-3.5 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-950 text-white shrink-0">
              <div className="space-y-0.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <FaShieldAlt /> Editorial File Inspection
                  </span>
                  <span className="text-xs text-slate-400 font-mono">ID #{viewingDoc.id}</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold truncate text-white">
                  {viewingDoc.title}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                {viewingDoc.latex && (
                  <button
                    onClick={() => {
                      const lData = { id: viewingDoc.id, title: viewingDoc.title, latex: viewingDoc.latex };
                      setViewingDoc(null);
                      setActiveLatexArticle(lData);
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <FaSquareRootAlt /> Open LaTeX Editor
                  </button>
                )}

                <a
                  href={viewingDoc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all border bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 flex items-center gap-1.5"
                >
                  <FaDownload /> Download / Open Tab
                </a>

                <button 
                  onClick={() => setViewingDoc(null)} 
                  className="text-slate-400 hover:text-white text-2xl font-light leading-none p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Viewer Content Frame */}
            <div className="flex-1 bg-slate-900 overflow-hidden relative flex flex-col">
              {viewingDoc.url && viewingDoc.url.toLowerCase().endsWith('.docx') || viewingDoc.url.toLowerCase().endsWith('.doc') ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-slate-900 text-white">
                  <div className="w-20 h-20 bg-blue-500/20 border border-blue-500/40 text-blue-400 rounded-3xl flex items-center justify-center mb-4 shadow-lg">
                    <FaFileAlt className="w-10 h-10" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-1">Microsoft Word Manuscript (.docx)</h4>
                  <p className="text-slate-400 max-w-md mb-6 text-xs">
                    This manuscript was uploaded as an editable Word document. You can preview it via Office Web Viewer or download it directly to edit.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <a 
                      href={viewingDoc.url} 
                      download
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow text-xs inline-flex items-center gap-2"
                    >
                      <FaDownload /> Download Original Word Document
                    </a>
                    <a 
                      href={`https://docs.google.com/viewer?url=${encodeURIComponent(viewingDoc.url)}&embedded=true`} 
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl transition-all text-xs inline-flex items-center gap-2"
                    >
                      <FaExternalLinkAlt /> Open in Google Docs Viewer
                    </a>
                  </div>
                </div>
              ) : (
                <iframe 
                  src={`${viewingDoc.url}#toolbar=1&navpanes=0&scrollbar=1`} 
                  title="Manuscript PDF Viewer" 
                  className="w-full h-full border-0 bg-white" 
                />
              )}
            </div>

          </div>
        </div>
      )}

      {/* 7. LaTeX Modal */}
      <LatexEditorModal
        isOpen={!!activeLatexArticle}
        onClose={() => setActiveLatexArticle(null)}
        articleId={activeLatexArticle?.id}
        articleTitle={activeLatexArticle?.title}
        initialLatex={activeLatexArticle?.latex}
        readOnly={false}
        onSaved={() => {
          fetchData();
        }}
      />

    </div>
  );
};

export default EditorDashboard;
