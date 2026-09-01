import React, { useState, useEffect } from 'react';
import { apiFetch, resolveFileUrl } from '../../../utils/api';
import { toast } from 'react-toastify';
import {
  FaFilePdf,
  FaCheckCircle,
  FaClock,
  FaEdit,
  FaTimes,
  FaShieldAlt,
  FaSearch,
  FaLock,
  FaSave,
  FaSquareRootAlt,
  FaExternalLinkAlt,
  FaDownload,
} from 'react-icons/fa';
import LatexEditorModal from '../../../components/LatexEditorModal';

const ReviewerDashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReviewModal, setActiveReviewModal] = useState(null);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [activeLatexArticle, setActiveLatexArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Modal Form State
  const [formData, setFormData] = useState({
    recommendation: 'revisions_required',
    score_originality: 4,
    score_methodology: 4,
    score_literature: 4,
    score_clarity: 4,
    review_comments: '',
    confidential_comments: '',
    reviewFile: null
  });
  const [submitting, setSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem('user')) || {};

  const fetchReviews = async () => {
    try {
      setLoading(true);
      if (!user.user_id) return;
      const res = await apiFetch(`/reviews?reviewer_id=${user.user_id}`);
      setReviews(res.data || []);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      toast.error('Failed to load review assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [user.user_id]);

  const handleOpenReviewModal = (rev) => {
    setActiveReviewModal(rev);
    setFormData({
      recommendation: rev.recommendation === 'pending' ? 'revisions_required' : rev.recommendation,
      score_originality: 4,
      score_methodology: 4,
      score_literature: 4,
      score_clarity: 4,
      review_comments: rev.review_comments || '',
      confidential_comments: rev.confidential_comments || '',
      reviewFile: null
    });
  };

  const handleSubmitReview = async (isDraft = false) => {
    if (!activeReviewModal) return;

    if (!isDraft && !formData.review_comments.trim()) {
      toast.error('Please provide detailed review comments before submitting your final evaluation.');
      return;
    }

    setSubmitting(true);
    try {
      let docId = activeReviewModal.review_doc_id;

      if (formData.reviewFile) {
        const fileForm = new FormData();
        fileForm.append('file', formData.reviewFile);
        fileForm.append('uploaded_by', user.user_id || 1);
        fileForm.append('folder', 'reviews');

        const uploadRes = await apiFetch('/docs', {
          method: 'POST',
          body: fileForm
        });
        if (uploadRes && uploadRes.data?.doc_id) {
          docId = uploadRes.data.doc_id;
        }
      }

      const statusToSet = isDraft ? 'in_progress' : 'completed';

      await apiFetch(`/reviews?id=${activeReviewModal.review_id}`, {
        method: 'PUT',
        body: {
          recommendation: formData.recommendation,
          review_comments: formData.review_comments,
          confidential_comments: formData.confidential_comments,
          review_doc_id: docId,
          status: statusToSet
        }
      });

      if (isDraft) {
        toast.info('Working draft comments saved successfully!');
      } else {
        toast.success('Double-blind peer review submitted successfully! Thank you for your contribution.');
        setActiveReviewModal(null);
      }
      await fetchReviews();
    } catch (err) {
      console.error('Error submitting review:', err);
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const getRecommendationBadge = (rec) => {
    switch (rec) {
      case 'accept':
        return <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase">Accept</span>;
      case 'revisions_required':
        return <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-full text-xs font-bold uppercase">Minor Revisions</span>;
      case 'resubmit_for_review':
        return <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs font-bold uppercase">Major Revisions</span>;
      case 'decline':
        return <span className="px-2.5 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-bold uppercase">Decline</span>;
      case 'pending':
      default:
        return <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-bold uppercase">Pending</span>;
    }
  };

  const filteredReviews = reviews.filter(rev => {
    const matchesSearch = 
      rev.article_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.article_abstract?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.article_keywords?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'ALL') return matchesSearch;
    return matchesSearch && rev.status === filterStatus;
  });

  return (
    <div className="space-y-8">
      
      {/* 1. Header with Double-Blind Shield Notice */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-3 py-1 bg-gray-900 text-amber-300 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs">
                <FaLock className="text-[10px]" /> Double-Blind Anonymization Active
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 font-sans tracking-tight">
              Peer Reviewer Workspace & Evaluations
            </h2>
            <p className="text-gray-500 text-sm font-medium mt-1">
              Author names and institutional affiliations are concealed to maintain rigorous, unbiased peer-review integrity.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => setFilterStatus('ALL')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${filterStatus === 'ALL' ? 'bg-gray-900 text-white shadow-md' : 'bg-white border-gray-100 hover:border-gray-400'}`}
        >
          <p className="text-xs font-bold uppercase tracking-wider opacity-80">Total Assigned Manuscripts</p>
          <p className="text-3xl font-bold mt-1">{reviews.length}</p>
        </div>

        <div 
          onClick={() => setFilterStatus('assigned')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${filterStatus === 'assigned' ? 'bg-amber-600 text-white shadow-md' : 'bg-white border-gray-100 hover:border-amber-400'}`}
        >
          <p className="text-xs font-bold uppercase tracking-wider opacity-80">Pending Evaluation Tasks</p>
          <p className="text-3xl font-bold mt-1 text-amber-700">
            {reviews.filter(r => r.status === 'assigned' || r.status === 'in_progress').length}
          </p>
        </div>

        <div 
          onClick={() => setFilterStatus('completed')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${filterStatus === 'completed' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white border-gray-100 hover:border-emerald-400'}`}
        >
          <p className="text-xs font-bold uppercase tracking-wider opacity-80">Completed Evaluations</p>
          <p className="text-3xl font-bold mt-1 text-emerald-600">
            {reviews.filter(r => r.status === 'completed').length}
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
            placeholder="Search manuscripts by title, topic..."
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
          />
          <FaSearch className="absolute left-3 top-3.5 text-gray-400 text-xs" />
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
          <span>Status:</span>
          {['ALL', 'assigned', 'completed'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${filterStatus === st ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}
            >
              {st === 'ALL' ? 'All' : st === 'assigned' ? 'Pending' : 'Completed'}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Assigned Manuscripts Review List */}
      <div className="space-y-6">
        {loading ? (
          <div className="bg-white p-12 text-center text-gray-500 font-bold rounded-2xl border border-gray-200">
            Loading assigned manuscripts...
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 space-y-3">
            <FaShieldAlt className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-lg font-bold text-gray-900">No Assigned Manuscripts</h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              You do not have any pending review assignments matching this filter.
            </p>
          </div>
        ) : (
          filteredReviews.map(rev => {
            const isCompleted = rev.status === 'completed';

            return (
              <div
                key={rev.review_id}
                className="bg-white border border-gray-200 hover:border-gray-400/60 rounded-xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-all space-y-5"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-2 flex-1">
                    
                    {/* Anonymity Banner & Status */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-gray-900 text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Blind Review ID #{rev.article_id || rev.review_id}
                      </span>
                      
                      <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-[10px] font-bold flex items-center gap-1 border border-gray-200">
                        <FaLock className="text-[9px] text-gray-500" /> Author Identity Concealed
                      </span>

                      {getRecommendationBadge(rev.recommendation)}

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isCompleted ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-900 border border-amber-200'}`}>
                        {isCompleted ? 'Evaluation Completed' : 'Pending Evaluation Task'}
                      </span>

                      {rev.due_date && (
                        <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                          <FaClock className="text-amber-600 text-xs" /> Due: {new Date(rev.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {/* Manuscript Title */}
                    <h3 className="text-xl font-bold font-sans text-gray-900 leading-snug">
                      {rev.article_title || 'Scholarly Manuscript'}
                    </h3>

                    {/* Abstract */}
                    {rev.article_abstract && (
                      <p className="text-xs text-gray-600 font-sans italic line-clamp-3 leading-relaxed">
                        "{rev.article_abstract}"
                      </p>
                    )}

                    {/* Keywords */}
                    {rev.article_keywords && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {rev.article_keywords.split(',').map((kw, i) => kw.trim() && (
                          <span key={i} className="inline-block text-[10px] font-semibold bg-gray-50 text-gray-500 border border-gray-200 px-2.5 py-0.5 rounded-full">
                            #{kw.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap md:flex-col gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => handleOpenReviewModal(rev)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                    >
                      <FaEdit /> {isCompleted ? 'View / Edit Evaluation' : 'Evaluate & Submit Review'}
                    </button>

                    <button
                      onClick={() => setViewingDoc({
                        url: resolveFileUrl(rev.anonymous_pdf_url || `/api/docs/stream?article_id=${rev.article_id}`),
                        streamUrl: resolveFileUrl(`/api/docs/stream?article_id=${rev.article_id}`),
                        title: rev.article_title,
                        id: rev.article_id,
                        latex: rev.latex_source || ''
                      })}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200 rounded-xl text-xs font-semibold transition-all"
                    >
                      <FaFilePdf className="text-red-600" /> Read Blind Manuscript
                    </button>
                    <button
                      onClick={() => setActiveLatexArticle({
                        id: rev.article_id,
                        title: rev.article_title,
                        latex: rev.latex_source || ''
                      })}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-semibold transition-all"
                    >
                      <FaSquareRootAlt className="text-emerald-600" /> LaTeX / Equations
                    </button>
                  </div>
                </div>

                {/* Submitted Review Comments Summary */}
                {rev.review_comments && (
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs space-y-1.5">
                    <div className="flex justify-between items-center text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                      <span className="flex items-center gap-1">
                        <FaCheckCircle className="text-emerald-600" /> Your Submitted Evaluation Comments:
                      </span>
                      <span>{rev.completed_at ? `Evaluated on ${new Date(rev.completed_at).toLocaleDateString()}` : 'Draft Saved'}</span>
                    </div>
                    <p className="text-gray-700 italic leading-relaxed">"{rev.review_comments}"</p>
                    {rev.confidential_comments && (
                      <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-500">
                        <strong>Confidential Note to Editor:</strong> {rev.confidential_comments}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 5. Document Viewer Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl h-[90vh] flex flex-col relative overflow-hidden border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-900 text-white shrink-0">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-amber-400/20 text-amber-300 rounded text-[10px] font-bold flex items-center gap-1">
                    <FaShieldAlt /> Double-Blind Mask Active
                  </span>
                  <span className="text-xs text-gray-400 font-mono">Manuscript ID #{viewingDoc.id}</span>
                </div>
                <h3 className="text-base font-bold font-sans truncate max-w-xl text-white">
                  {viewingDoc.title}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                <a
                  href={viewingDoc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all border bg-white/10 border-white/20 text-gray-200 hover:bg-white/20 flex items-center gap-1.5"
                >
                  <FaExternalLinkAlt /> Open in Tab
                </a>
                <button 
                  onClick={() => setViewingDoc(null)} 
                  className="text-gray-400 hover:text-white text-2xl font-light leading-none p-1"
                >
                  &times;
                </button>
              </div>
            </div>

            <div className="flex-1 bg-gray-900 overflow-hidden relative flex flex-col">
              <div className="flex-1 w-full h-full relative overflow-hidden bg-gray-100">
                <iframe 
                  src={viewingDoc.streamUrl || viewingDoc.url}
                  title="Double-Blind Manuscript Viewer" 
                  className="w-full h-full border-0 bg-white" 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Review Evaluation Modal */}
      {activeReviewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 sm:p-8 shadow-lg border border-gray-200 my-8 animate-scaleUp max-h-[92vh] overflow-y-auto">
            
            <div className="flex justify-between items-center pb-5 border-b border-gray-200">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 bg-gray-900 text-amber-300 rounded text-[10px] font-bold flex items-center gap-1">
                    <FaLock /> Blind Manuscript Review
                  </span>
                  <span className="text-xs text-gray-500">ID #{activeReviewModal.article_id || activeReviewModal.review_id}</span>
                </div>
                <h3 className="text-2xl font-bold font-sans text-gray-900">
                  Peer Review Evaluation Form
                </h3>
                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xl">
                  {activeReviewModal.article_title}
                </p>
              </div>
              <button 
                onClick={() => setActiveReviewModal(null)}
                className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-black/5"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmitReview(false); }} className="space-y-6 pt-5">
              
              {/* Double-Blind Author Notice */}
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-600 flex items-center justify-between">
                <div className="flex items-center gap-2 font-medium">
                  <FaShieldAlt className="text-gray-500" />
                  <span>Author: <strong>[Identity Shielded under Double-Blind Protocol]</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => setViewingDoc({
                    url: resolveFileUrl(activeReviewModal.manuscript_url || activeReviewModal.published_url || `/api/docs/stream?article_id=${activeReviewModal.article_id}`),
                    title: activeReviewModal.article_title,
                    id: activeReviewModal.article_id,
                    latex: activeReviewModal.latex_source || ''
                  })}
                  className="text-blue-600 hover:underline font-bold text-xs flex items-center gap-1"
                >
                  <FaFilePdf className="text-red-500" /> Read Manuscript
                </button>
              </div>

              {/* Recommendation Dropdown */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Final Editorial Recommendation *
                </label>
                <select
                  value={formData.recommendation}
                  onChange={(e) => setFormData({ ...formData, recommendation: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:border-gray-400"
                >
                  <option value="accept">Accept Without Revisions (Meets all scholarly standards)</option>
                  <option value="revisions_required">Minor Revisions Required (Conceptual / Citation refinements)</option>
                  <option value="resubmit_for_review">Major Revisions Required (Resubmit for re-evaluation)</option>
                  <option value="decline">Decline / Reject Manuscript</option>
                </select>
              </div>

              {/* Scoring Criteria Matrix */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Evaluation Criteria Scores (1 to 5)
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-900">Originality & Novelty:</span>
                    <select
                      value={formData.score_originality}
                      onChange={(e) => setFormData({ ...formData, score_originality: parseInt(e.target.value) })}
                      className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-900"
                    >
                      <option value="5">5 - Outstanding</option>
                      <option value="4">4 - Good</option>
                      <option value="3">3 - Average</option>
                      <option value="2">2 - Weak</option>
                      <option value="1">1 - Poor</option>
                    </select>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-900">Theoretical Rigor:</span>
                    <select
                      value={formData.score_methodology}
                      onChange={(e) => setFormData({ ...formData, score_methodology: parseInt(e.target.value) })}
                      className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-900"
                    >
                      <option value="5">5 - Rigorous</option>
                      <option value="4">4 - Competent</option>
                      <option value="3">3 - Acceptable</option>
                      <option value="2">2 - Needs Work</option>
                      <option value="1">1 - Deficient</option>
                    </select>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-900">Literature & Citations:</span>
                    <select
                      value={formData.score_literature}
                      onChange={(e) => setFormData({ ...formData, score_literature: parseInt(e.target.value) })}
                      className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-900"
                    >
                      <option value="5">5 - Comprehensive</option>
                      <option value="4">4 - Adequate</option>
                      <option value="3">3 - Moderate</option>
                      <option value="2">2 - Missing Key Works</option>
                      <option value="1">1 - Inadequate</option>
                    </select>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-900">Argument Clarity:</span>
                    <select
                      value={formData.score_clarity}
                      onChange={(e) => setFormData({ ...formData, score_clarity: parseInt(e.target.value) })}
                      className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-900"
                    >
                      <option value="5">5 - Lucid & Clear</option>
                      <option value="4">4 - Well Written</option>
                      <option value="3">3 - Readable</option>
                      <option value="2">2 - Unclear</option>
                      <option value="1">1 - Incoherent</option>
                    </select>
                  </div>

                </div>
              </div>

              {/* Review Comments */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Detailed Review Feedback (Shared with Author & Editor) *
                  </label>
                  <span className="text-[10px] text-gray-500 font-medium">Constructive academic feedback</span>
                </div>
                <textarea
                  rows="6"
                  required
                  value={formData.review_comments}
                  onChange={(e) => setFormData({ ...formData, review_comments: e.target.value })}
                  placeholder="Provide structured feedback covering scholarly contributions, theoretical strengths, and areas for revision..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-gray-400"
                />
              </div>

              {/* Confidential Comments */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Confidential Remarks (For Journal Editors Only)
                </label>
                <textarea
                  rows="3"
                  value={formData.confidential_comments}
                  onChange={(e) => setFormData({ ...formData, confidential_comments: e.target.value })}
                  placeholder="Private remarks to the editor regarding suitability for special issues or confidential reservations..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-gray-400"
                />
              </div>

              {/* Modal Footer CTA */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setActiveReviewModal(null)}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>

                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleSubmitReview(true)}
                    className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <FaSave /> Save Draft Notes
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all shadow disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <FaCheckCircle /> {submitting ? 'Submitting...' : 'Submit Final Evaluation'}
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 7. LaTeX Editor Modal */}
      <LatexEditorModal
        isOpen={!!activeLatexArticle}
        onClose={() => setActiveLatexArticle(null)}
        articleId={activeLatexArticle?.id}
        articleTitle={activeLatexArticle?.title}
        initialLatex={activeLatexArticle?.latex}
        readOnly={false}
        onSaved={() => {
          fetchReviews();
        }}
      />

    </div>
  );
};

export default ReviewerDashboard;
