import React, { useState, useEffect } from 'react';
import { apiFetch, resolveFileUrl } from '../../../utils/api';
import { toast } from 'react-toastify';
import { 
  FaEdit, 
  FaTrash, 
  FaBookOpen, 
  FaUserCheck, 
  FaUserShield, 
  FaFilePdf, 
  FaSearch, 
  FaCheckCircle, 
  FaClock, 
  FaShieldAlt, 
  FaUpload, 
  FaDownload, 
  FaTimes,
  FaLayerGroup,
  FaHistory,
  FaPlusCircle,
  FaFileAlt
} from 'react-icons/fa';
import AutoAssignRedactorModal from '../../../components/AutoAssignRedactorModal';
import Pagination from '../../../components/Pagination';

const ITEMS_PER_PAGE = 10;

const statusSteps = [
  { key: 'submission', label: '1. Submission', statuses: ['incomplete', 'submitted'] },
  { key: 'review', label: '2. Peer Review', statuses: ['under_review', 'in_review'] },
  { key: 'copyediting', label: '3. Copyediting / Proofing', statuses: ['copyediting'] },
  { key: 'decision', label: '4. Decision / Accepted', statuses: ['accepted', 'rejected'] },
  { key: 'published', label: '5. Published', statuses: ['published'] }
];

const getStepIndex = (status) => {
  switch (status) {
    case 'incomplete': return 0;
    case 'submitted': return 0;
    case 'under_review':
    case 'in_review': return 1;
    case 'copyediting': return 2;
    case 'accepted': return 3;
    case 'rejected': return 3;
    case 'published': return 4;
    default: return 0;
  }
};

const PaperSubmissions = () => {
  const [articles, setArticles] = useState([]);
  const [users, setUsers] = useState([]);
  const [volumes, setVolumes] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  // New / Edit Basic Submission Modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    article_id: '',
    title: '',
    abstract: '',
    keywords: '',
    author_user_id: '',
    assigned_editor_id: '',
    issue_id: '',
    page_range: '',
    manuscript_pdf_id: '',
    status: 'submitted',
    doi: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Manage Workflow & Assignment Modal
  const [managingArticle, setManagingArticle] = useState(null);
  const [workflowData, setWorkflowData] = useState({
    status: 'submitted',
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
  const [workflowLoading, setWorkflowLoading] = useState(false);

  // File Viewer Modal
  const [viewingDocUrl, setViewingDocUrl] = useState(null);
  const [redactorArticle, setRedactorArticle] = useState(null);

  const user = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [articlesData, usersData, volumesData, issuesData] = await Promise.all([
        apiFetch('/articles'),
        apiFetch('/users'),
        apiFetch('/volumes?with_issues=true'),
        apiFetch('/issues')
      ]);
      setArticles(articlesData.data || []);
      setUsers(usersData.data || []);
      setVolumes(volumesData.data || []);
      setIssues(issuesData.data || []);
    } catch (err) {
      toast.error('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtered lists of editors and reviewers
  const editorUsers = users.filter(u => 
    ['editor', 'assistant editor', 'admin'].includes(u.role_name?.toLowerCase())
  );
  const reviewerUsers = users.filter(u => 
    ['reviewer', 'editor', 'assistant editor', 'admin'].includes(u.role_name?.toLowerCase())
  );

  // 1. Basic New / Edit Modal
  const openModal = (article = null) => {
    setSelectedFile(null);
    if (article) {
      setIsEditing(true);
      setFormData({
        article_id: article.article_id,
        title: article.title || '',
        abstract: article.abstract || '',
        keywords: article.keywords || '',
        author_user_id: article.author_user_id || (users.length > 0 ? users[0].user_id : ''),
        author_name: article.author_name || '',
        author_email: article.author_email || '',
        assigned_editor_id: article.assigned_editor_id || '',
        issue_id: article.issue_id || '',
        page_range: article.page_range || '',
        manuscript_pdf_id: article.manuscript_pdf_id || article.published_pdf_id || '',
        manuscript_url: article.manuscript_url || article.published_url || '',
        status: article.status || 'submitted',
        doi: article.doi || ''
      });
    } else {
      setIsEditing(false);
      setFormData({
        article_id: '',
        title: '',
        abstract: '',
        keywords: '',
        author_user_id: users.length > 0 ? users[0].user_id : '',
        author_name: '',
        author_email: '',
        assigned_editor_id: '',
        issue_id: '',
        page_range: '',
        manuscript_pdf_id: '',
        manuscript_url: '',
        status: 'submitted',
        doi: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      toast.error('Article title is required.');
      return;
    }

    setFormLoading(true);

    let finalPdfId = formData.manuscript_pdf_id;

    try {
      if (selectedFile) {
        const docPayload = new FormData();
        docPayload.append('uploaded_by', formData.author_user_id || users[0]?.user_id || 1);
        docPayload.append('file', selectedFile);
        docPayload.append('folder', 'manuscripts');
        
        const docRes = await apiFetch('/docs', {
          method: 'POST',
          body: docPayload
        });
        
        if (docRes && docRes.data && docRes.data.doc_id) {
          finalPdfId = docRes.data.doc_id;
        }
      }
      
      if (!finalPdfId && !isEditing) {
        toast.error('A manuscript document is required.');
        setFormLoading(false);
        return;
      }

      const payload = { 
        title: formData.title.trim(),
        abstract: formData.abstract?.trim() || '',
        keywords: formData.keywords?.trim() || null,
        author_user_id: formData.author_user_id ? parseInt(formData.author_user_id) : (users[0]?.user_id || 1),
        author_name: formData.author_name?.trim() || null,
        author_email: formData.author_email?.trim() || null,
        assigned_editor_id: formData.assigned_editor_id ? parseInt(formData.assigned_editor_id) : null,
        issue_id: formData.issue_id ? parseInt(formData.issue_id) : null,
        page_range: formData.page_range?.trim() || null,
        doi: formData.doi?.trim() || null,
        status: formData.status || 'submitted',
        manuscript_pdf_id: finalPdfId ? parseInt(finalPdfId) : null
      };

      if (isEditing) {
        await apiFetch(`/articles?id=${formData.article_id}`, {
          method: 'PUT',
          body: payload
        });
        toast.success('Submission updated successfully!');
      } else {
        await apiFetch('/articles', {
          method: 'POST',
          body: payload
        });
        toast.success('Submission created successfully!');
      }
      
      await fetchData();
      closeModal();
    } catch (err) {
      console.error('Submission save error:', err);
      toast.error(err.message || 'Failed to save submission');
    } finally {
      setFormLoading(false);
    }
  };

  // 2. Manage Workflow & Assignment Modal
  const openWorkflowModal = (article) => {
    setManagingArticle(article);
    setWorkflowData({
      status: article.status || 'submitted',
      assigned_editor_id: article.assigned_editor_id || '',
      editor_notes: article.editor_notes || '',
      copyedit_notes: article.copyedit_notes || '',
      volume_id: article.volume_id || '',
      issue_id: article.issue_id || '',
      doi: article.doi || '',
      page_range: article.page_range || '',
      reviewer_user_id: '',
      review_due_date: '',
      copyeditFile: null
    });
  };

  const handleSaveWorkflow = async (e) => {
    e.preventDefault();
    if (!managingArticle) return;

    setWorkflowLoading(true);
    try {
      let copyeditDocId = managingArticle.copyedit_doc_id;

      // 1. Upload copyedit document if provided
      if (workflowData.copyeditFile) {
        const uploadForm = new FormData();
        uploadForm.append('file', workflowData.copyeditFile);
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

      // 2. Patch Article with Assigned Editor, Status, Notes, Volume/Issue, DOI
      const payload = {
        status: workflowData.status,
        assigned_editor_id: workflowData.assigned_editor_id ? parseInt(workflowData.assigned_editor_id) : null,
        editor_notes: workflowData.editor_notes,
        copyedit_notes: workflowData.copyedit_notes,
        copyedit_doc_id: copyeditDocId,
        issue_id: workflowData.issue_id ? parseInt(workflowData.issue_id) : null,
        doi: workflowData.doi ? workflowData.doi.trim() : null,
        page_range: workflowData.page_range ? workflowData.page_range.trim() : null
      };

      await apiFetch(`/articles?id=${managingArticle.article_id}`, {
        method: 'PATCH',
        body: payload
      });

      // 3. Assign Reviewer if selected
      if (workflowData.reviewer_user_id) {
        await apiFetch('/reviews', {
          method: 'POST',
          body: {
            article_id: managingArticle.article_id,
            reviewer_user_id: parseInt(workflowData.reviewer_user_id),
            due_date: workflowData.review_due_date || null,
            status: 'assigned'
          }
        });
        toast.success('Peer reviewer assigned successfully!');
      }

      toast.success('Paper status, editor, and review assignments updated!');
      setManagingArticle(null);
      await fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to update workflow');
    } finally {
      setWorkflowLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to remove this reviewer assignment?')) return;
    try {
      await apiFetch(`/reviews?id=${reviewId}`, { method: 'DELETE' });
      toast.success('Reviewer assignment removed');
      await fetchData();
      // Refresh current managing article modal
      const refreshedArt = (await apiFetch(`/articles?id=${managingArticle.article_id}`)).data;
      setManagingArticle(refreshedArt);
    } catch (err) {
      toast.error('Failed to remove review: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      toast.error('Invalid submission ID');
      return;
    }
    if (window.confirm('Are you sure you want to delete this submission? This will permanently delete the manuscript and associated peer reviews.')) {
      try {
        await apiFetch(`/articles?id=${id}`, { method: 'DELETE' });
        toast.success('Submission deleted successfully');
        setArticles(prev => prev.filter(a => String(a.article_id) !== String(id)));
        await fetchData();
      } catch (err) {
        console.error('Failed to delete submission:', err);
        toast.error('Failed to delete: ' + (err.message || 'Server error'));
      }
    }
  };

  const isPdfDoc = (url) => {
    if (!url) return false;
    const clean = url.split('?')[0].split('#')[0].toLowerCase();
    return clean.endsWith('.pdf') || url.toLowerCase().includes('.pdf') || url.includes('/stream') || url.includes('/docs/');
  };

  const renderFileViewer = () => {
    if (!viewingDocUrl) return null;
    
    if (isPdfDoc(viewingDocUrl)) {
      return (
        <div className="w-full h-full flex flex-col bg-slate-900">
          <iframe 
            src={`${viewingDocUrl}#toolbar=1&navpanes=0&scrollbar=1`} 
            title="Document Viewer" 
            className="w-full h-full border-0 bg-white" 
          />
        </div>
      );
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].some(ext => viewingDocUrl.toLowerCase().includes(`.${ext}`))) {
      return (
        <div className="w-full h-full flex items-center justify-center p-4 bg-slate-900/90">
          <img src={viewingDocUrl} alt="Document" className="max-w-full max-h-full object-contain shadow-2xl rounded-lg border border-slate-700" />
        </div>
      );
    } else {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-slate-900 text-white">
          <div className="w-20 h-20 bg-blue-500/20 border border-blue-500/40 text-blue-400 rounded-3xl flex items-center justify-center mb-4 shadow-lg">
            <FaFileAlt className="w-10 h-10" />
          </div>
          <h4 className="text-xl font-bold text-white mb-1">Author Manuscript Document</h4>
          <p className="text-slate-400 max-w-md mb-6 text-xs font-mono break-all bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            {viewingDocUrl}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a 
              href={viewingDocUrl} 
              download
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow text-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <FaDownload /> Download Original File
            </a>
            <a 
              href={`https://docs.google.com/viewer?url=${encodeURIComponent(viewingDocUrl)}&embedded=true`} 
              target="_blank" 
              rel="noreferrer" 
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl transition-all text-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <FaExternalLinkAlt /> Open in Online Viewer
            </a>
          </div>
        </div>
      );
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

  // Filtered Articles
  const filteredArticles = articles.filter(art => {
    const matchesSearch = 
      art.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.abstract?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.author_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.author_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.editor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.keywords?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (art.reviews && art.reviews.some(r => r.reviewer_name?.toLowerCase().includes(searchTerm.toLowerCase())));

    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'REVIEW') return matchesSearch && ['under_review', 'in_review'].includes(art.status);
    return matchesSearch && art.status === statusFilter;
  });

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = filteredArticles.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const availableIssuesInForm = workflowData.volume_id
    ? issues.filter(i => String(i.volume_id) === String(workflowData.volume_id))
    : issues;

  return (
    <div className="space-y-8">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 font-sans tracking-tight">
            Paper Submissions & Lifecycle Management
          </h2>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            Oversee all author submissions, assign Editors & Reviewers, monitor progress, and manage publications.
          </p>
        </div>
        <button 
          onClick={() => openModal()}
          className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow hover:shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <FaPlusCircle /> + New Submission
        </button>
      </div>

      {/* 2. Status Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div 
          onClick={() => setStatusFilter('ALL')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${statusFilter === 'ALL' ? 'bg-gray-900 text-white shadow-md' : 'bg-white border-gray-100 hover:border-gray-400'}`}
        >
          <p className="text-xs font-bold uppercase tracking-wider opacity-80">All Papers</p>
          <p className="text-2xl font-bold mt-1">{articles.length}</p>
        </div>

        <div 
          onClick={() => setStatusFilter('submitted')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${statusFilter === 'submitted' ? 'bg-amber-600 text-white shadow-md' : 'bg-white border-gray-100 hover:border-amber-400'}`}
        >
          <p className="text-xs font-bold uppercase tracking-wider opacity-80">Screening</p>
          <p className="text-2xl font-bold mt-1 text-amber-700">
            {articles.filter(a => a.status === 'submitted').length}
          </p>
        </div>

        <div 
          onClick={() => setStatusFilter('REVIEW')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${statusFilter === 'REVIEW' ? 'bg-blue-600 text-white shadow-md' : 'bg-white border-gray-100 hover:border-blue-400'}`}
        >
          <p className="text-xs font-bold uppercase tracking-wider opacity-80">Under Review</p>
          <p className="text-2xl font-bold mt-1 text-blue-600">
            {articles.filter(a => ['under_review', 'in_review'].includes(a.status)).length}
          </p>
        </div>

        <div 
          onClick={() => setStatusFilter('copyediting')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${statusFilter === 'copyediting' ? 'bg-purple-600 text-white shadow-md' : 'bg-white border-gray-100 hover:border-purple-400'}`}
        >
          <p className="text-xs font-bold uppercase tracking-wider opacity-80">Copyediting</p>
          <p className="text-2xl font-bold mt-1 text-purple-600">
            {articles.filter(a => a.status === 'copyediting').length}
          </p>
        </div>

        <div 
          onClick={() => setStatusFilter('accepted')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${statusFilter === 'accepted' ? 'bg-green-600 text-white shadow-md' : 'bg-white border-gray-100 hover:border-green-400'}`}
        >
          <p className="text-xs font-bold uppercase tracking-wider opacity-80">Accepted</p>
          <p className="text-2xl font-bold mt-1 text-green-700">
            {articles.filter(a => a.status === 'accepted').length}
          </p>
        </div>

        <div 
          onClick={() => setStatusFilter('published')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${statusFilter === 'published' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white border-gray-100 hover:border-emerald-400'}`}
        >
          <p className="text-xs font-bold uppercase tracking-wider opacity-80">Published</p>
          <p className="text-2xl font-bold mt-1 text-emerald-600">
            {articles.filter(a => a.status === 'published').length}
          </p>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="Search by title, author, editor, reviewer, keyword..."
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
          />
          <FaSearch className="absolute left-3 top-3.5 text-gray-400 text-xs" />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500">
          <span>Filter:</span>
          {['ALL', 'submitted', 'under_review', 'copyediting', 'accepted', 'published', 'rejected'].map(st => (
            <button
              key={st}
              onClick={() => { setStatusFilter(st); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${statusFilter === st ? 'bg-gray-900 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-900'}`}
            >
              {st === 'ALL' ? 'All' : st.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Submissions Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden w-full">
        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900">All Submissions</h3>
          <span className="text-xs text-slate-500 font-medium">Showing {filteredArticles.length} total entries</span>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs table-auto">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-3 py-3 font-bold text-slate-600 uppercase tracking-wider w-8 text-center">#</th>
                <th className="px-3 py-3 font-bold text-slate-600 uppercase tracking-wider">Title & Topics</th>
                <th className="px-3 py-3 font-bold text-slate-600 uppercase tracking-wider">Author</th>
                <th className="px-2 py-3 font-bold text-slate-600 uppercase tracking-wider text-center">Editor</th>
                <th className="px-2 py-3 font-bold text-slate-600 uppercase tracking-wider text-center">Reviewer(s)</th>
                <th className="px-2 py-3 font-bold text-slate-600 uppercase tracking-wider text-center">Issue</th>
                <th className="px-2 py-3 font-bold text-slate-600 uppercase tracking-wider text-center">PDF</th>
                <th className="px-2 py-3 font-bold text-slate-600 uppercase tracking-wider text-center">Status</th>
                <th className="px-3 py-3 font-bold text-slate-600 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-500">Loading submissions...</td>
                </tr>
              ) : filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400 italic">No submissions matching filter criteria.</td>
                </tr>
              ) : (
                paginatedArticles.map((article, rIdx) => {
                  const pdfUrl = article.published_url || article.manuscript_url || article.anonymous_pdf_url;
                  return (
                    <tr key={article.article_id} className={`hover:bg-slate-50 transition-colors ${rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                      <td className="px-3 py-3 font-bold text-slate-500 text-center">{(currentPage - 1) * ITEMS_PER_PAGE + rIdx + 1}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-start gap-1.5 max-w-sm xl:max-w-md">
                          <span className="font-mono font-bold text-[10px] text-slate-500 bg-slate-100 px-1 py-0.2 rounded border border-slate-200 shrink-0 mt-0.5">#{article.article_id}</span>
                          <p className="font-bold text-slate-900 line-clamp-2 text-xs leading-snug">{article.title}</p>
                        </div>
                        {article.keywords && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {article.keywords.split(',').slice(0, 4).map((kw, i) => kw.trim() && (
                              <span key={i} className="inline-block text-[9px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.2 rounded">
                                #{kw.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <p className="font-bold text-slate-800 text-xs truncate max-w-[140px]">{article.author_name || `User #${article.author_user_id}`}</p>
                        {article.author_email && <p className="text-[10px] text-slate-500 truncate max-w-[140px]">{article.author_email}</p>}
                      </td>
                      <td className="px-2 py-3 text-center">
                        {article.editor_name ? (
                          <span className="font-bold text-slate-900 text-xs">{article.editor_name}</span>
                        ) : (
                          <button type="button" onClick={() => openWorkflowModal(article)} className="text-[10px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2 py-0.5 rounded cursor-pointer">+ Editor</button>
                        )}
                      </td>
                      <td className="px-2 py-3 text-center">
                        {article.reviews && article.reviews.length > 0 ? (
                          <div className="space-y-1">
                            {article.reviews.map((rev, rIdx2) => (
                              <div key={rIdx2} className="text-[11px] font-medium text-slate-700">
                                <span className="truncate max-w-[70px] inline-block align-middle">{rev.reviewer_name}</span>:
                                <span className="font-bold uppercase text-[9px] bg-blue-50 text-blue-800 px-1 py-0.2 rounded border border-blue-200 ml-1">{rev.recommendation}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <button type="button" onClick={() => openWorkflowModal(article)} className="text-[10px] font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-300 px-2 py-0.5 rounded cursor-pointer">+ Reviewer</button>
                        )}
                      </td>
                      <td className="px-2 py-3 text-center whitespace-nowrap">
                        {article.volume_number && article.issue_number ? (
                          <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300 font-bold">Vol {article.volume_number}, Iss {article.issue_number}</span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Unassigned</span>
                        )}
                      </td>
                      <td className="px-2 py-3 text-center whitespace-nowrap">
                        {pdfUrl ? (
                          <button type="button" onClick={() => setViewingDocUrl(resolveFileUrl(pdfUrl))} className="text-red-700 hover:text-red-900 bg-red-50 hover:bg-red-100 border border-red-200 px-2 py-1 rounded font-bold text-[11px] cursor-pointer">View PDF</button>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">No File</span>
                        )}
                      </td>
                      <td className="px-2 py-3 text-center whitespace-nowrap">{getStatusBadge(article.status)}</td>
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button type="button" onClick={() => openModal(article)} className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 rounded text-xs font-bold cursor-pointer">Edit</button>
                          <button type="button" onClick={() => handleDelete(article.article_id)} className="px-2 py-0.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 rounded text-xs font-bold cursor-pointer">Delete</button>
                          <button type="button" onClick={() => openWorkflowModal(article)} className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-bold cursor-pointer">Workflow</button>
                          <button type="button" onClick={() => setRedactorArticle(article)} className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded text-xs font-bold cursor-pointer">Redact</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={filteredArticles.length}
        />
      </div>

      {/* 5. Manage Workflow, Assign Editor & Reviewers Modal */}
      {managingArticle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 sm:p-8 shadow-lg border border-gray-200 my-8 animate-scaleUp max-h-[92vh] overflow-y-auto">
            
            <div className="flex justify-between items-center pb-5 border-b border-gray-200">
              <div>
                <h3 className="text-2xl font-bold font-sans text-gray-900">
                  Assign Roles, Manage Workflow & Status
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xl">
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

            <form onSubmit={handleSaveWorkflow} className="space-y-6 pt-5">
              
              {/* Change Lifecycle Status */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Paper Lifecycle Status *
                </label>
                <select
                  value={workflowData.status}
                  onChange={(e) => setWorkflowData({ ...workflowData, status: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:border-gray-400"
                >
                  <option value="incomplete">Incomplete Draft (Pending Author Files)</option>
                  <option value="submitted">Submitted (Awaiting Editorial Screening)</option>
                  <option value="under_review">Under Peer Review (Active Double-Blind Evaluation)</option>
                  <option value="copyediting">Copyediting & Proofreading (Revising Typography / Formatting)</option>
                  <option value="accepted">Accepted for Publication (Queued for Issue)</option>
                  <option value="published">Published in Issue</option>
                  <option value="rejected">Declined / Needs Major Revisions</option>
                </select>
              </div>

              {/* Assign Editor */}
              <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
                  <FaUserShield /> Assign Managing Editor
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-950 mb-1">Select Editor</label>
                  <select
                    value={workflowData.assigned_editor_id}
                    onChange={(e) => setWorkflowData({ ...workflowData, assigned_editor_id: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-amber-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-amber-500"
                  >
                    <option value="">-- No Assigned Editor --</option>
                    {editorUsers.map(e => (
                      <option key={e.user_id} value={e.user_id}>
                        {e.display_name} ({e.email}) [{e.role_name}]
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Assign Peer Reviewers */}
              <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-200 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-900">
                  <FaShieldAlt /> Assign Peer Reviewers
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-blue-950 mb-1">Select Reviewer</label>
                    <select
                      value={workflowData.reviewer_user_id}
                      onChange={(e) => setWorkflowData({ ...workflowData, reviewer_user_id: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-blue-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-500"
                    >
                      <option value="">-- No New Reviewer --</option>
                      {reviewerUsers.map(r => (
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
                      value={workflowData.review_due_date}
                      onChange={(e) => setWorkflowData({ ...workflowData, review_due_date: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-blue-200 rounded-xl text-xs text-gray-900"
                    />
                  </div>
                </div>

                {/* Currently Assigned Reviewers */}
                {managingArticle.reviews && managingArticle.reviews.length > 0 && (
                  <div className="pt-2 border-t border-blue-200 space-y-2">
                    <span className="text-xs font-bold text-blue-950">Currently Assigned Reviewers:</span>
                    {managingArticle.reviews.map((rev, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-blue-100 text-xs flex justify-between items-center">
                        <div>
                          <strong className="text-blue-900">{rev.reviewer_name}</strong>
                          <span className="text-gray-500 ml-2">Status: {rev.status}</span>
                          <span className="font-bold uppercase text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded ml-2">
                            {rev.recommendation}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(rev.review_id)}
                          className="text-red-500 hover:text-red-700 font-bold text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Editorial Notes / Author Instructions */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Editorial Notes & Author Feedback
                </label>
                <textarea
                  rows="3"
                  value={workflowData.editor_notes}
                  onChange={(e) => setWorkflowData({ ...workflowData, editor_notes: e.target.value })}
                  placeholder="Notes explaining editorial decisions, revision guidance, or scheduling..."
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
                    Copyediting Instructions
                  </label>
                  <textarea
                    rows="2"
                    value={workflowData.copyedit_notes}
                    onChange={(e) => setWorkflowData({ ...workflowData, copyedit_notes: e.target.value })}
                    placeholder="Details regarding stylistic changes, citations (APA format), typography..."
                    className="w-full px-4 py-2 bg-white border border-purple-200 rounded-xl text-xs text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-purple-950 mb-1">
                    Upload Copyedited File (.pdf, .doc, .docx)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setWorkflowData({ ...workflowData, copyeditFile: e.target.files[0] })}
                    className="w-full text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-200 file:text-purple-900 cursor-pointer"
                  />
                  {managingArticle.copyedit_url && (
                    <p className="text-xs text-purple-800 mt-1">
                      Current: <a href={resolveFileUrl(managingArticle.copyedit_url)} target="_blank" rel="noopener noreferrer" className="underline font-bold">Download Current Copyedited File</a>
                    </p>
                  )}
                </div>
              </div>

              {/* Assign Volume & Issue */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Target Volume
                  </label>
                  <select
                    value={workflowData.volume_id}
                    onChange={(e) => setWorkflowData({ ...workflowData, volume_id: e.target.value, issue_id: '' })}
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
                    value={workflowData.issue_id}
                    onChange={(e) => setWorkflowData({ ...workflowData, issue_id: e.target.value })}
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
                    value={workflowData.doi}
                    onChange={(e) => setWorkflowData({ ...workflowData, doi: e.target.value })}
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
                    value={workflowData.page_range}
                    onChange={(e) => setWorkflowData({ ...workflowData, page_range: e.target.value })}
                    placeholder="pp. 1-15"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900"
                  />
                </div>
              </div>

              {/* Footer CTA */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const art = managingArticle;
                      setManagingArticle(null);
                      openModal(art);
                    }}
                    className="px-3 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <FaEdit /> Edit Details
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const aid = managingArticle.article_id;
                      setManagingArticle(null);
                      handleDelete(aid);
                    }}
                    className="px-3 py-2 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-300 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setManagingArticle(null)}
                    className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={workflowLoading}
                    className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all shadow disabled:opacity-50 cursor-pointer"
                  >
                    {workflowLoading ? 'Saving...' : 'Save Workflow'}
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 6. Basic Form Modal (Create / Edit Article) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl flex flex-col relative my-auto">
            
            <div className="px-8 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-2xl shrink-0">
              <h3 className="text-xl font-bold text-gray-900">{isEditing ? 'Edit Submission' : 'New Submission'}</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-900 text-2xl font-light leading-none">×</button>
            </div>
            
            <div className="p-8">
              <form id="articleForm" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Title *</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400 transition-all bg-gray-50 focus:bg-white" placeholder="Paper title..." />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Abstract *</label>
                  <textarea required value={formData.abstract} onChange={e => setFormData({...formData, abstract: e.target.value})} rows="4" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400 transition-all bg-gray-50 focus:bg-white" placeholder="Brief summary of the paper..." />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Keywords / Research Topics (Comma-separated)</label>
                  <input type="text" value={formData.keywords} onChange={e => setFormData({...formData, keywords: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400 transition-all bg-gray-50 focus:bg-white" placeholder="e.g. Comparative Literature, Digital Humanities, Cognitive Ecology" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Author *</label>
                    <select required value={formData.author_user_id} onChange={e => setFormData({...formData, author_user_id: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400 bg-gray-50 focus:bg-white transition-all">
                      <option value="">Select Author</option>
                      {formData.author_user_id && !users.some(u => String(u.user_id) === String(formData.author_user_id)) && (
                        <option value={formData.author_user_id}>{formData.author_name || `Author #${formData.author_user_id}`} ({formData.author_email || 'Author'})</option>
                      )}
                      {users.map(u => (
                        <option key={u.user_id} value={u.user_id}>{u.display_name} ({u.email})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Assigned Editor</label>
                    <select value={formData.assigned_editor_id} onChange={e => setFormData({...formData, assigned_editor_id: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400 bg-gray-50 focus:bg-white transition-all">
                      <option value="">Unassigned</option>
                      {editorUsers.map(u => (
                        <option key={u.user_id} value={u.user_id}>{u.display_name} ({u.email})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Issue / Volume</label>
                    <select value={formData.issue_id} onChange={e => setFormData({...formData, issue_id: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400 bg-gray-50 focus:bg-white transition-all">
                      <option value="">Unassigned</option>
                      {issues.map(iss => (
                        <option key={iss.issue_id} value={iss.issue_id}>
                          Volume {iss.volume_number || '?'}, Issue {iss.issue_number} ({iss.publication_year || iss.publication_date?.substring(0,4) || 'Current'}) {iss.issue_title ? `- ${iss.issue_title}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Page Range (Optional)</label>
                    <input type="text" value={formData.page_range} onChange={e => setFormData({...formData, page_range: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400 transition-all bg-gray-50 focus:bg-white" placeholder="e.g. pp. 1-15" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400 bg-gray-50 focus:bg-white transition-all">
                      <option value="incomplete">Incomplete Draft</option>
                      <option value="submitted">Submitted</option>
                      <option value="under_review">Under Review</option>
                      <option value="copyediting">Copyediting & Proofreading</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                      <option value="published">Published</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">DOI (Optional)</label>
                    <input type="text" value={formData.doi} onChange={e => setFormData({...formData, doi: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400 transition-all bg-gray-50 focus:bg-white" placeholder="10.xxxx/xxxxx" />
                  </div>
                </div>
                
                {/* File Upload Section */}
                <div className="pt-2">
                  <label className="block text-sm font-bold text-gray-600 mb-2">
                    Manuscript Document <span className="text-red-500">*</span>
                  </label>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <input 
                      type="file" 
                      accept=".doc,.docx,.pdf"
                      onChange={handleFileChange}
                      className="w-full sm:w-auto text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gray-200 file:text-gray-900 hover:file:bg-gray-300 cursor-pointer" 
                    />
                    {isEditing && !selectedFile && formData.manuscript_pdf_id && (
                      <div className="text-sm text-gray-500 border border-gray-200 px-3 py-2 rounded-lg bg-gray-50 flex items-center gap-2">
                        <span>Current:</span> 
                        {formData.manuscript_url ? (
                          <button type="button" onClick={() => setViewingDocUrl(resolveFileUrl(formData.manuscript_url))} className="text-blue-600 font-bold underline">Download / View</button>
                        ) : (
                          <span className="italic">Doc ID {formData.manuscript_pdf_id}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Accepted formats: .doc, .docx, .pdf</p>
                </div>
              </form>
            </div>

            <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-between items-center shrink-0">
              {isEditing ? (
                <button
                  type="button"
                  onClick={() => {
                    const id = formData.article_id;
                    closeModal();
                    handleDelete(id);
                  }}
                  className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <FaTrash /> Delete Submission
                </button>
              ) : <div />}
              <div className="flex space-x-3">
                <button type="button" onClick={closeModal} className="px-5 py-2 text-gray-600 hover:bg-gray-200 rounded-xl text-xs font-bold transition-colors cursor-pointer">Cancel</button>
                <button type="submit" form="articleForm" disabled={formLoading} className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all shadow disabled:opacity-50 cursor-pointer">
                  {formLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Submission'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 7. File Viewer Modal */}
      {viewingDocUrl && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-4 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-5xl h-[85vh] flex flex-col relative overflow-hidden border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 shrink-0">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-red-100 text-red-700 rounded-lg">
                  <FaFilePdf className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Document Preview</h3>
                  <p className="text-[11px] text-gray-500 font-mono truncate max-w-lg">{viewingDocUrl}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={viewingDocUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold bg-white hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-300 inline-flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Open PDF in new tab"
                >
                  <FaDownload className="text-xs" /> Open Tab
                </a>
                <button 
                  onClick={() => setViewingDocUrl(null)} 
                  className="text-gray-500 hover:text-gray-900 text-2xl font-light leading-none p-1 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  &times;
                </button>
              </div>
            </div>
            
            <div className="flex-1 bg-gray-100 overflow-hidden relative">
              {renderFileViewer()}
            </div>
          </div>
        </div>
      )}

      {/* 7. Automated Double-Blind Peer Reviewer Assignment & Redactor Modal */}
      {redactorArticle && (
        <AutoAssignRedactorModal
          isOpen={!!redactorArticle}
          onClose={() => setRedactorArticle(null)}
          article={redactorArticle}
          reviewers={users.filter(u => ['reviewer', 'editor', 'assistant editor', 'admin'].includes(u.role_name?.toLowerCase()))}
          onAssigned={fetchData}
        />
      )}

    </div>
  );
};

export default PaperSubmissions;
