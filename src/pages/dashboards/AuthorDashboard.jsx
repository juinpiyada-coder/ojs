import React, { useState, useEffect } from 'react';
import { apiFetch, resolveFileUrl } from '../../utils/api';
import { toast } from 'react-toastify';
import { 
  FaFilePdf, 
  FaSearch, 
  FaCheckCircle, 
  FaClock, 
  FaEdit, 
  FaEye, 
  FaTimes, 
  FaInfoCircle, 
  FaBookOpen, 
  FaDownload,
  FaFileUpload,
  FaShieldAlt,
  FaHistory,
  FaSquareRootAlt
} from 'react-icons/fa';
import LatexEditorModal from '../../components/LatexEditorModal';

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

const AuthorDashboard = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [activeLatexArticle, setActiveLatexArticle] = useState(null);

  // Submit Modal State
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', abstract: '', keywords: '', status: 'submitted' });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Status Tracking Modal State
  const [trackingArticle, setTrackingArticle] = useState(null);

  const user = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    fetchArticles();
  }, [user.user_id]);

  const fetchArticles = async () => {
    try {
      if (!user.user_id) return;
      const res = await apiFetch(`/articles?author_id=${user.user_id}`);
      setArticles(res.data || []);
    } catch (err) {
      toast.error('Failed to load manuscripts');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSubmitModal = () => {
    setFormData({ title: '', abstract: '', keywords: '', status: 'submitted' });
    setFile(null);
    setShowSubmitModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && formData.status === 'submitted') {
      toast.error('Please select a manuscript file (.doc, .docx, .pdf) to upload');
      return;
    }
    
    setSubmitting(true);
    
    try {
      let docId = null;
      if (file) {
        const fileData = new FormData();
        fileData.append('file', file);
        fileData.append('uploaded_by', user.user_id || 1);
        
        const uploadRes = await apiFetch('/docs', { method: 'POST', body: fileData });
        docId = uploadRes.data.doc_id;
      }

      const payload = {
        author_user_id: user.user_id || 1,
        manuscript_pdf_id: docId || 1,
        title: formData.title,
        abstract: formData.abstract,
        keywords: formData.keywords,
        status: formData.status || 'submitted'
      };

      await apiFetch('/articles', { method: 'POST', body: payload });
      toast.success(formData.status === 'incomplete' ? 'Draft saved successfully!' : 'Manuscript submitted successfully!');
      setShowSubmitModal(false);
      fetchArticles();
    } catch (err) {
      toast.error('Submission failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider">Published</span>;
      case 'accepted':
        return <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full uppercase tracking-wider">Accepted for Publication</span>;
      case 'copyediting':
        return <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full uppercase tracking-wider">Copyediting / Proofreading</span>;
      case 'under_review':
      case 'in_review':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full uppercase tracking-wider">Under Peer Review</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full uppercase tracking-wider">Declined / Revisions</span>;
      case 'incomplete':
        return <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded-full uppercase tracking-wider">Incomplete Draft</span>;
      case 'submitted':
      default:
        return <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full uppercase tracking-wider">Submitted</span>;
    }
  };

  const filteredArticles = articles.filter(art => {
    const matchesSearch = 
      art.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.abstract?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.keywords?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedStatusFilter === 'ALL') return matchesSearch;
    if (selectedStatusFilter === 'REVIEW') return matchesSearch && ['under_review', 'in_review'].includes(art.status);
    return matchesSearch && art.status === selectedStatusFilter;
  });

  return (
    <div className="space-y-8">
      
      {/* 1. Header & Summary Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 font-sans tracking-tight">
            Author Manuscripts & Publication Lifecycle
          </h2>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            Track real-time progress through peer review, copywriting, proofreading, and journal publication.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={() => setActiveLatexArticle({ id: null, title: 'New LaTeX Manuscript Draft', latex: '' })}
            className="px-5 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-xs"
          >
            <FaSquareRootAlt /> LaTeX & Math Editor
          </button>
          <button 
            onClick={handleOpenSubmitModal} 
            className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-xs"
          >
            <FaFileUpload /> + Submit New Manuscript
          </button>
        </div>
      </div>

      {/* 2. Stat Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div 
          onClick={() => setSelectedStatusFilter('ALL')} 
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${selectedStatusFilter === 'ALL' ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white border-gray-100 hover:border-gray-400'}`}
        >
          <p className="text-xs font-bold uppercase tracking-wider opacity-80">All Papers</p>
          <p className="text-2xl font-bold mt-1">{articles.length}</p>
        </div>

        <div 
          onClick={() => setSelectedStatusFilter('incomplete')} 
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${selectedStatusFilter === 'incomplete' ? 'bg-orange-600 text-white border-orange-600 shadow-md' : 'bg-white border-gray-100 hover:border-orange-400'}`}
        >
          <p className="text-xs font-bold uppercase tracking-wider opacity-80">Incomplete</p>
          <p className="text-2xl font-bold mt-1 text-orange-600 group-hover:text-orange-700">
            {articles.filter(a => a.status === 'incomplete').length}
          </p>
        </div>

        <div 
          onClick={() => setSelectedStatusFilter('submitted')} 
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${selectedStatusFilter === 'submitted' ? 'bg-amber-600 text-white border-amber-600 shadow-md' : 'bg-white border-gray-100 hover:border-amber-400'}`}
        >
          <p className="text-xs font-bold uppercase tracking-wider opacity-80">Submitted</p>
          <p className="text-2xl font-bold mt-1 text-amber-700">
            {articles.filter(a => a.status === 'submitted').length}
          </p>
        </div>

        <div 
          onClick={() => setSelectedStatusFilter('REVIEW')} 
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${selectedStatusFilter === 'REVIEW' ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white border-gray-100 hover:border-blue-400'}`}
        >
          <p className="text-xs font-bold uppercase tracking-wider opacity-80">Under Review</p>
          <p className="text-2xl font-bold mt-1 text-blue-600">
            {articles.filter(a => ['under_review', 'in_review'].includes(a.status)).length}
          </p>
        </div>

        <div 
          onClick={() => setSelectedStatusFilter('copyediting')} 
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${selectedStatusFilter === 'copyediting' ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white border-gray-100 hover:border-purple-400'}`}
        >
          <p className="text-xs font-bold uppercase tracking-wider opacity-80">Copyediting</p>
          <p className="text-2xl font-bold mt-1 text-purple-600">
            {articles.filter(a => a.status === 'copyediting').length}
          </p>
        </div>

        <div 
          onClick={() => setSelectedStatusFilter('published')} 
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${selectedStatusFilter === 'published' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white border-gray-100 hover:border-emerald-400'}`}
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
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, keyword, or abstract..."
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
          />
          <FaSearch className="absolute left-3 top-3.5 text-gray-400 text-xs" />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-400">
          <span>Filter Status:</span>
          {['ALL', 'submitted', 'under_review', 'copyediting', 'published'].map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${selectedStatusFilter === st ? 'bg-gray-900 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-900'}`}
            >
              {st === 'ALL' ? 'All' : st.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Manuscripts List with Visual Stepper */}
      <div className="space-y-6">
        {loading ? (
          <div className="bg-white p-12 text-center text-gray-500 font-bold rounded-2xl border border-gray-200">
            Loading your manuscripts...
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 space-y-3">
            <FaBookOpen className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-lg font-bold text-gray-900">No Manuscripts Found</h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              You haven't submitted any manuscripts matching this status filter yet. Submit a paper to start tracking its editorial review lifecycle.
            </p>
            <button
              onClick={handleOpenSubmitModal}
              className="mt-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-xs hover:bg-gray-800 transition-all"
            >
              + Submit New Manuscript
            </button>
          </div>
        ) : (
          filteredArticles.map(article => {
            const currentStepIdx = getStepIndex(article.status);
            const isRejected = article.status === 'rejected';

            return (
              <div 
                key={article.article_id}
                className="bg-white border border-gray-200 hover:border-gray-400/60 rounded-xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-all space-y-6"
              >
                {/* Card Top: Title, Status Badge, & Metadata */}
                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {getStatusBadge(article.status)}
                      <span className="text-xs text-gray-500 font-medium">
                        Submitted: {new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      {article.volume_number && article.issue_number && (
                        <span className="px-2.5 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-xs font-bold">
                          Vol {article.volume_number}, Issue {article.issue_number}
                        </span>
                      )}
                      {article.doi && (
                        <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-mono font-semibold">
                          DOI: {article.doi}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 font-sans leading-snug">
                      {article.title}
                    </h3>

                    {article.abstract && (
                      <p className="text-xs text-gray-600 line-clamp-2 font-sans italic">
                        "{article.abstract}"
                      </p>
                    )}

                    {/* Keywords */}
                    {article.keywords && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {article.keywords.split(',').map((kw, i) => kw.trim() && (
                          <span key={i} className="inline-block text-[10px] font-semibold bg-gray-50 text-gray-500 border border-gray-200 px-2.5 py-0.5 rounded-full">
                            #{kw.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap md:flex-col gap-2 shrink-0 self-end md:self-start">
                    <button
                      onClick={() => setTrackingArticle(article)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                    >
                      <FaHistory /> Track Lifecycle
                    </button>
                    {article.manuscript_url && (
                      <a
                        href={resolveFileUrl(article.manuscript_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200 rounded-xl text-xs font-semibold transition-all"
                      >
                        <FaFilePdf className="text-red-600" /> View PDF
                      </a>
                    )}
                    <button
                      onClick={() => setActiveLatexArticle({
                        id: article.article_id,
                        title: article.title,
                        latex: article.latex_source || ''
                      })}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-semibold transition-all"
                    >
                      <FaSquareRootAlt className="text-emerald-600" /> LaTeX Source
                    </button>
                  </div>
                </div>

                {/* Card Middle: 5-Stage Stepper Progress Tracker */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3">
                    Publication Workflow Progress
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 relative">
                    {statusSteps.map((step, sIdx) => {
                      const isPast = sIdx < currentStepIdx;
                      const isCurrent = sIdx === currentStepIdx;
                      
                      let stepBg = "bg-gray-50 border-gray-100 text-gray-400";
                      if (isPast) stepBg = "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold";
                      if (isCurrent) {
                        stepBg = isRejected 
                          ? "bg-red-50 border-red-400 text-red-800 font-bold shadow-xs" 
                          : "bg-amber-50 border-amber-400 text-amber-900 font-bold shadow-xs";
                      }

                      return (
                        <div 
                          key={step.key}
                          className={`p-3 rounded-2xl border text-center transition-all flex flex-col justify-between ${stepBg}`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-mono font-bold">0{sIdx + 1}</span>
                            {isPast && <FaCheckCircle className="text-emerald-600 text-xs" />}
                            {isCurrent && <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>}
                          </div>
                          <p className="text-xs font-bold truncate">{step.label}</p>
                          <span className="text-[10px] opacity-80 mt-1">
                            {isCurrent ? (isRejected ? 'Declined' : 'Active Stage') : (isPast ? 'Completed' : 'Upcoming')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Card Bottom: Quick Notes Preview if available */}
                {(article.editor_notes || article.copyedit_notes) && (
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs space-y-1.5">
                    {article.editor_notes && (
                      <p className="text-gray-600">
                        <strong className="text-gray-900">Editorial Note:</strong> {article.editor_notes}
                      </p>
                    )}
                    {article.copyedit_notes && (
                      <p className="text-gray-600">
                        <strong className="text-purple-800">Copyediting / Proofreading:</strong> {article.copyedit_notes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 5. Manuscript Lifecycle Tracking Modal */}
      {trackingArticle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-gray-50 border-2 border-gray-400 rounded-xl max-w-3xl w-full max-h-[92vh] shadow-lg flex flex-col overflow-hidden animate-scaleUp">
            
            {/* Modal Header */}
            <div className="bg-gray-900 text-white p-6 flex justify-between items-center border-b border-gray-700">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-gray-900/30 rounded-xl text-amber-300">
                  <FaHistory className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold font-sans leading-tight">
                    Manuscript Tracking & Journal Lifecycle
                  </h3>
                  <p className="text-xs text-gray-300">ID #{trackingArticle.article_id} • Status: {trackingArticle.status?.replace('_', ' ').toUpperCase()}</p>
                </div>
              </div>

              <button
                onClick={() => setTrackingArticle(null)}
                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-white">
              <div>
                <h4 className="text-xl font-bold font-sans text-gray-900 mb-2">
                  {trackingArticle.title}
                </h4>
                <div className="flex flex-wrap gap-2 items-center text-xs text-gray-400">
                  <span>Submitted on {new Date(trackingArticle.created_at).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Author: {user.display_name || 'You'}</span>
                  {trackingArticle.volume_number && (
                    <>
                      <span>•</span>
                      <span className="text-amber-800 font-bold">Vol {trackingArticle.volume_number}, Iss {trackingArticle.issue_number}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Status Stepper in Modal */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500">Current Stage Status</h5>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {statusSteps.map((step, idx) => {
                    const activeIdx = getStepIndex(trackingArticle.status);
                    const isDone = idx < activeIdx;
                    const isCurrent = idx === activeIdx;

                    return (
                      <div 
                        key={step.key} 
                        className={`p-3 rounded-xl border text-center text-xs ${isCurrent ? 'bg-gray-900 text-white border-gray-900 font-bold shadow' : isDone ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold' : 'bg-white text-gray-400 border-gray-200'}`}
                      >
                        <p className="font-bold">{step.label}</p>
                        <span className="text-[10px] block mt-1 opacity-80">
                          {isCurrent ? 'In Progress' : isDone ? 'Passed' : 'Pending'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Editorial Feedback & Review Comments */}
              <div className="space-y-4">
                <h5 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <FaInfoCircle className="text-gray-500" /> Editorial Feedback & Lifecycle Notes
                </h5>

                {/* Editor Notes */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Editor's Assessment & Instructions</span>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    {trackingArticle.editor_notes || "Your manuscript is currently undergoing editorial evaluation. You will receive updates and peer review feedback directly through this dashboard."}
                  </p>
                </div>

                {/* Copyediting Section */}
                <div className="bg-purple-50/60 p-4 rounded-xl border border-purple-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-900">Copywriting, Proofreading & Formatting</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-200 text-purple-800 rounded">
                      {trackingArticle.status === 'copyediting' ? 'Active' : trackingArticle.status === 'published' ? 'Completed' : 'Upcoming'}
                    </span>
                  </div>
                  <p className="text-xs text-purple-950 leading-relaxed">
                    {trackingArticle.copyedit_notes || "Our copyediting team standardizes typography, in-text citations (APA format), equations, and page layouts prior to publication."}
                  </p>
                  {trackingArticle.copyedit_url && (
                    <div className="pt-2">
                      <a
                        href={resolveFileUrl(trackingArticle.copyedit_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                      >
                        <FaDownload className="text-xs" /> Download Copyedited Document
                      </a>
                    </div>
                  )}
                </div>

                {/* Blind Peer Review Feedback Summary */}
                <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                      <FaShieldAlt /> Double-Blind Peer Review Status
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-200 text-blue-800 rounded">
                      {['under_review', 'in_review'].includes(trackingArticle.status) ? 'Under Review' : trackingArticle.status === 'published' ? 'Peer Reviewed & Accepted' : 'In Queue'}
                    </span>
                  </div>
                  <p className="text-xs text-blue-950 leading-relaxed">
                    Double-blind peer review is carried out by independent subject experts. Author and reviewer identities remain strictly confidential throughout the evaluation.
                  </p>
                  {trackingArticle.reviews && trackingArticle.reviews.length > 0 && (
                    <div className="pt-2 space-y-2">
                      <span className="text-xs font-bold text-blue-950">Reviewer Notes:</span>
                      {trackingArticle.reviews.map((rev, rIdx) => (
                        <div key={rIdx} className="bg-white p-3 rounded-lg border border-blue-100 text-xs text-gray-700 space-y-1">
                          <div className="flex justify-between font-bold text-blue-900">
                            <span>Reviewer {rIdx + 1} Recommendation:</span>
                            <span className="uppercase">{rev.recommendation?.replace('_', ' ')}</span>
                          </div>
                          {rev.review_comments && <p className="italic">"{rev.review_comments}"</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              {trackingArticle.manuscript_url ? (
                <a
                  href={resolveFileUrl(trackingArticle.manuscript_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50"
                >
                  <FaFilePdf className="text-red-600" /> Download Submitted PDF
                </a>
              ) : <div />}

              <button
                onClick={() => setTrackingArticle(null)}
                className="px-6 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800"
              >
                Close Tracking
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 6. Submit New Manuscript Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 sm:p-8 shadow-lg border border-gray-200 my-8 animate-scaleUp">
            
            <div className="flex justify-between items-center pb-5 border-b border-gray-200">
              <div>
                <h3 className="text-2xl font-bold font-sans text-gray-900">
                  Submit New Manuscript
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Submit an original manuscript for blind peer-review or save as an incomplete draft.
                </p>
              </div>
              <button 
                onClick={() => setShowSubmitModal(false)}
                className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-black/5"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 pt-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Manuscript Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Cognitive Ecologies and Post-Humanist Narratives in Contemporary South Asian Cinema"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Structured Abstract *
                </label>
                <textarea
                  rows="4"
                  required
                  value={formData.abstract}
                  onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                  placeholder="Provide a 150-250 word structured abstract summarizing the objectives, methodology, and key arguments of your research..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Keywords / Research Topics (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="e.g. Cognitive Ecology, Digital Humanities, Eco-Criticism, Film Theory"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-gray-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Submission Mode
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-gray-400"
                  >
                    <option value="submitted">Ready for Review (Submit)</option>
                    <option value="incomplete">Incomplete Draft (Save for Later)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Manuscript File (.pdf, .doc, .docx)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-gray-200 file:text-gray-900 hover:file:bg-gray-300 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <FaShieldAlt className="mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Blind Review Notice:</strong> Please ensure author names and institutional affiliations are removed from the submitted document to preserve anonymity during peer review.
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all shadow disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : formData.status === 'incomplete' ? 'Save Draft' : 'Submit Manuscript'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* 6. Interactive LaTeX Manuscript & Math Editor with Double-Blind Sanitizer */}
      <LatexEditorModal
        isOpen={!!activeLatexArticle}
        onClose={() => setActiveLatexArticle(null)}
        articleId={activeLatexArticle?.id}
        articleTitle={activeLatexArticle?.title}
        initialLatex={activeLatexArticle?.latex}
        readOnly={false}
        onSaved={(newCode) => {
          fetchArticles();
        }}
      />

    </div>
  );
};

export default AuthorDashboard;
