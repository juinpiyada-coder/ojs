import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { toast } from 'react-toastify';

const AuthorDashboard = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', abstract: '' });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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

  const handleOpenModal = () => {
    setFormData({ title: '', abstract: '' });
    setFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a manuscript file (.doc, .docx, .pdf) to upload');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // 1. Upload Document
      const fileData = new FormData();
      fileData.append('file', file);
      fileData.append('uploaded_by', user.user_id);
      
      const uploadRes = await apiFetch('/docs', { method: 'POST', body: fileData });
      const docId = uploadRes.data.doc_id;

      // 2. Submit Article
      const payload = {
        author_user_id: user.user_id,
        manuscript_pdf_id: docId,
        title: formData.title,
        abstract: formData.abstract,
        status: 'submitted'
      };

      await apiFetch('/articles', { method: 'POST', body: payload });
      toast.success('Manuscript submitted successfully!');
      setShowModal(false);
      fetchArticles();
    } catch (err) {
      toast.error('Submission failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'accepted': return 'bg-emerald-100 text-emerald-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status) => {
    if (!status) return 'Submitted';
    return status.replace('_', ' ');
  };

  return (
    <div className="space-y-6 relative">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#2C2C2C] tracking-tight">My Manuscripts</h2>
          <p className="text-[#8E7C68] mt-1 font-semibold">Track and manage your journal submissions</p>
        </div>
        <button onClick={handleOpenModal} className="px-6 py-3 bg-[#2C2C2C] hover:bg-[#4A4A4A] text-white font-bold rounded-xl shadow-md transition-all">
          + Submit New Manuscript
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E5E0D8] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#E5E0D8]">
          <thead className="bg-[#FAF9F6]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-[#8E7C68] uppercase tracking-wider">Title</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-[#8E7C68] uppercase tracking-wider">Submitted Date</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-[#8E7C68] uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-[#8E7C68] uppercase tracking-wider">File</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#E5E0D8]">
            {loading ? (
              <tr><td colSpan="4" className="px-6 py-8 text-center text-[#8E7C68]">Loading manuscripts...</td></tr>
            ) : articles.length > 0 ? (
              articles.map(article => (
                <tr key={article.article_id} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="px-6 py-5 max-w-sm">
                    <p className="text-sm font-bold text-[#2C2C2C] truncate" title={article.title}>{article.title}</p>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-[#5C5446]">
                    {new Date(article.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full ${getStatusStyle(article.status)}`}>
                      {getStatusText(article.status)}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    {article.manuscript_url ? (
                      <a href={article.manuscript_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm font-bold underline">View Document</a>
                    ) : (
                      <span className="text-gray-400 text-xs italic">N/A</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="px-6 py-8 text-center text-[#8E7C68]">You haven't submitted any manuscripts yet.</td></tr>
            )}
          </tbody>
          </table>
        </div>
      </div>

      {/* Submission Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col relative my-auto">
            <div className="px-8 py-5 border-b border-[#E5E0D8] flex justify-between items-center bg-[#FAF9F6] rounded-t-2xl shrink-0">
              <h3 className="text-xl font-bold text-[#2C2C2C]">Submit New Manuscript</h3>
              <button onClick={() => setShowModal(false)} className="text-[#8E7C68] hover:text-[#2C2C2C] text-2xl font-light leading-none">✕</button>
            </div>
            
            <div className="p-8 overflow-y-auto">
              <form id="submissionForm" onSubmit={handleSubmit} className="space-y-4">
                
                <div>
                  <label className="block text-sm font-bold text-[#5C5446] mb-1.5">Manuscript Title *</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 border border-[#E5E0D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8E7C68]/30 focus:border-[#8E7C68]" placeholder="Enter the title of your paper..." />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-[#5C5446] mb-1.5">Abstract *</label>
                  <textarea required value={formData.abstract} onChange={e => setFormData({...formData, abstract: e.target.value})} rows="5" className="w-full px-4 py-3 border border-[#E5E0D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8E7C68]/30 focus:border-[#8E7C68]" placeholder="Write a short abstract summarizing your manuscript..." />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#5C5446] mb-1.5">Upload Document (.doc, .docx, .pdf) *</label>
                  <input required type="file" accept=".pdf,.doc,.docx" onChange={e => setFile(e.target.files[0])} className="w-full px-3 py-2 border border-[#E5E0D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8E7C68]/30 focus:border-[#8E7C68] text-sm text-[#5C5446] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FAF9F6] file:text-[#8E7C68] hover:file:bg-[#E5E0D8]" />
                  <p className="text-xs text-[#8E7C68] mt-2 font-medium">Please ensure author names are removed from the document for blind review.</p>
                </div>

              </form>
            </div>

            <div className="px-8 py-5 border-t border-[#E5E0D8] bg-[#FAF9F6] flex justify-end space-x-4 rounded-b-2xl shrink-0">
              <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 text-[#5C5446] hover:bg-[#E5E0D8] rounded-lg font-bold transition-colors">Cancel</button>
              <button type="submit" form="submissionForm" disabled={submitting} className="px-8 py-2.5 bg-[#2C2C2C] text-white rounded-lg font-bold hover:bg-[#4A4A4A] transition-colors disabled:opacity-50">
                {submitting ? 'Submitting...' : 'Submit Manuscript'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorDashboard;
