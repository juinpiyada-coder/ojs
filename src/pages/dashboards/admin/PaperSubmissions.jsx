import React, { useState, useEffect } from 'react';
import { apiFetch, resolveFileUrl } from '../../../utils/api';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';

const PaperSubmissions = () => {
  const [articles, setArticles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    article_id: '',
    title: '',
    abstract: '',
    author_user_id: '',
    assigned_editor_id: '',
    manuscript_pdf_id: '',
    status: 'submitted',
    doi: ''
  });
  
  // File State
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewingDocUrl, setViewingDocUrl] = useState(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [articlesData, usersData] = await Promise.all([
        apiFetch('/articles'),
        apiFetch('/users')
      ]);
      setArticles(articlesData.data || []);
      setUsers(usersData.data || []);
    } catch (err) {
      toast.error('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (article = null) => {
    setSelectedFile(null);
    if (article) {
      setIsEditing(true);
      setFormData({
        article_id: article.article_id,
        title: article.title,
        abstract: article.abstract,
        author_user_id: article.author_user_id,
        assigned_editor_id: article.assigned_editor_id || '',
        manuscript_pdf_id: article.manuscript_pdf_id || '',
        manuscript_url: article.manuscript_url || '',
        status: article.status || 'submitted',
        doi: article.doi || ''
      });
    } else {
      setIsEditing(false);
      setFormData({
        article_id: '',
        title: '',
        abstract: '',
        author_user_id: users.length > 0 ? users[0].user_id : '',
        assigned_editor_id: '',
        manuscript_pdf_id: '',
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
    setFormLoading(true);

    let finalPdfId = formData.manuscript_pdf_id;

    try {
      // 1. If there's a new file selected, upload it via /api/docs first to get a doc_id
      if (selectedFile) {
        // We use FormData to send the physical file
        const docPayload = new FormData();
        docPayload.append('uploaded_by', formData.author_user_id || users[0]?.user_id || 1);
        docPayload.append('file', selectedFile);
        
        const docRes = await apiFetch('/docs', {
          method: 'POST',
          body: docPayload
        });
        
        finalPdfId = docRes.data.doc_id;
      }
      
      // Validation
      if (!finalPdfId) {
        toast.error('A manuscript document is required.');
        setFormLoading(false);
        return;
      }

      const payload = { 
        ...formData, 
        manuscript_pdf_id: finalPdfId 
      };
      
      if (!payload.assigned_editor_id) delete payload.assigned_editor_id;
      if (!payload.doi) delete payload.doi;

      // 2. Save the Article
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
      toast.error(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        await apiFetch(`/articles?id=${id}`, { method: 'DELETE' });
        toast.success('Submission deleted successfully');
        await fetchData();
      } catch (err) {
        toast.error('Failed to delete: ' + err.message);
      }
    }
  };

  const getFileExtension = (url) => {
    if (!url) return '';
    return url.split('.').pop().toLowerCase();
  };

  const renderFileViewer = () => {
    if (!viewingDocUrl) return null;
    
    const ext = getFileExtension(viewingDocUrl);
    
    if (ext === 'pdf') {
      return <iframe src={viewingDocUrl} title="Document Viewer" className="w-full h-full border-0" />;
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
      return (
        <div className="w-full h-full flex items-center justify-center p-4">
          <img src={viewingDocUrl} alt="Document" className="max-w-full max-h-full object-contain shadow-lg" />
        </div>
      );
    } else if (['doc', 'docx'].includes(ext)) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
          <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
          <h4 className="text-2xl font-bold text-[#2C2C2C] mb-2">Word Document</h4>
          <p className="text-[#5C5446] max-w-md mb-8">
            Live preview for Office documents is unavailable on local servers. Please download the file to view its contents.
          </p>
          <a href={viewingDocUrl} download target="_blank" rel="noreferrer" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg">
            Download File
          </a>
        </div>
      );
    } else {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
          <p className="text-[#5C5446] mb-4">No preview available for this file type.</p>
          <a href={viewingDocUrl} download target="_blank" rel="noreferrer" className="px-6 py-3 bg-[#2C2C2C] text-white font-bold rounded-xl">
            Download
          </a>
        </div>
      );
    }
  };

  if (loading && articles.length === 0) return <div className="p-8 text-[#8E7C68] font-bold">Loading submissions...</div>;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E5E0D8]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#2C2C2C]">Paper Submissions</h2>
          <p className="text-[#8E7C68] text-sm mt-1">Manage manuscripts and review statuses</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="px-5 py-2.5 bg-[#8E7C68] text-white rounded-lg font-bold hover:bg-[#7a6a57] transition-all shadow-sm hover:shadow"
        >
          + New Submission
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#E5E0D8]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF9F6] border-b border-[#E5E0D8] text-[#5C5446] text-sm">
              <th className="py-4 px-6 text-left font-bold text-[#8E7C68] uppercase text-xs tracking-wider">Title</th>
              <th className="py-4 px-6 text-left font-bold text-[#8E7C68] uppercase text-xs tracking-wider">Submitted By</th>
              <th className="py-4 px-6 text-left font-bold text-[#8E7C68] uppercase text-xs tracking-wider">Submission Date</th>
              <th className="py-4 px-6 text-left font-bold text-[#8E7C68] uppercase text-xs tracking-wider">Editor</th>
              <th className="py-4 px-6 font-bold uppercase tracking-wider text-center">Document</th>
              <th className="py-4 px-6 font-bold uppercase tracking-wider text-center">Status</th>
              <th className="py-4 px-6 font-bold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EBE1]">
            {articles.map(article => (
              <tr key={article.article_id} className="hover:bg-[#FAF9F6] transition-colors">
                <td className="py-4 px-6">
                  <p className="text-[#2C2C2C] font-bold truncate">{article.title}</p>
                  <p className="text-xs text-[#8E7C68] mt-1 truncate">{article.abstract}</p>
                </td>
                <td className="py-4 px-6">
                  <p className="text-[#5C5446] font-medium">{article.author_name || article.author_user_id}</p>
                  {article.author_email && (
                    <p className="text-xs text-[#8E7C68] mt-1">{article.author_email}</p>
                  )}
                </td>
                <td className="py-4 px-6 text-[#5C5446] text-sm">
                  {new Date(article.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  <p className="text-xs text-[#8E7C68] mt-1">{new Date(article.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </td>
                <td className="py-4 px-6 text-[#5C5446] text-sm">{article.editor_name || 'Unassigned'}</td>
                <td className="py-4 px-6 text-center">
                  {article.manuscript_url ? (
                    <button onClick={() => setViewingDocUrl(resolveFileUrl(article.manuscript_url))} className="text-blue-600 hover:text-blue-800 font-bold text-sm underline flex items-center justify-center gap-1 mx-auto">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      View
                    </button>
                  ) : (
                    <span className="text-[#8E7C68] text-xs italic">Missing</span>
                  )}
                </td>
                <td className="py-4 px-6 text-center">
                  <span className={`px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wider
                    ${article.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 
                      article.status === 'in_review' ? 'bg-blue-100 text-blue-800' : 
                      article.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {article.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-4 px-6 text-right space-x-3 whitespace-nowrap">
                  <button onClick={() => openModal(article)} className="text-blue-600 hover:text-blue-800 font-bold transition-colors inline-flex items-center gap-1"><FaEdit /> Edit</button>
                  <button onClick={() => handleDelete(article.article_id)} className="text-red-500 hover:text-red-700 font-bold transition-colors inline-flex items-center gap-1"><FaTrash /> Delete</button>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan="6" className="py-8 text-center text-[#8E7C68] font-medium">No submissions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal - Fixed Alignment */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col relative my-auto">
            
            {/* Modal Header */}
            <div className="px-8 py-5 border-b border-[#E5E0D8] flex justify-between items-center bg-[#FAF9F6] rounded-t-2xl shrink-0">
              <h3 className="text-xl font-bold text-[#2C2C2C]">{isEditing ? 'Edit Submission' : 'New Submission'}</h3>
              <button onClick={closeModal} className="text-[#8E7C68] hover:text-[#2C2C2C] text-2xl font-light leading-none">×</button>
            </div>
            
            {/* Modal Body */}
            <div className="p-8">
              <form id="articleForm" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-[#5C5446] mb-2">Title *</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 border border-[#E5E0D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8E7C68]/30 focus:border-[#8E7C68] transition-all bg-[#FAF9F6] focus:bg-white" placeholder="Paper title..." />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-[#5C5446] mb-2">Abstract *</label>
                  <textarea required value={formData.abstract} onChange={e => setFormData({...formData, abstract: e.target.value})} rows="4" className="w-full px-4 py-3 border border-[#E5E0D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8E7C68]/30 focus:border-[#8E7C68] transition-all bg-[#FAF9F6] focus:bg-white" placeholder="Brief summary of the paper..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#5C5446] mb-2">Author *</label>
                    <select required value={formData.author_user_id} onChange={e => setFormData({...formData, author_user_id: e.target.value})} className="w-full px-4 py-3 border border-[#E5E0D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8E7C68]/30 focus:border-[#8E7C68] bg-[#FAF9F6] focus:bg-white transition-all">
                      <option value="">Select Author</option>
                      {users.map(u => (
                        <option key={u.user_id} value={u.user_id}>{u.display_name} ({u.email})</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-[#5C5446] mb-2">Assigned Editor</label>
                    <select value={formData.assigned_editor_id} onChange={e => setFormData({...formData, assigned_editor_id: e.target.value})} className="w-full px-4 py-3 border border-[#E5E0D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8E7C68]/30 focus:border-[#8E7C68] bg-[#FAF9F6] focus:bg-white transition-all">
                      <option value="">None</option>
                      {users.filter(u => ['editor', 'admin'].includes(u.role_name?.toLowerCase())).map(u => (
                        <option key={u.user_id} value={u.user_id}>{u.display_name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#5C5446] mb-2">Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-3 border border-[#E5E0D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8E7C68]/30 focus:border-[#8E7C68] bg-[#FAF9F6] focus:bg-white transition-all">
                      <option value="submitted">Submitted</option>
                      <option value="in_review">In Review</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                      <option value="published">Published</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#5C5446] mb-2">DOI (Optional)</label>
                    <input type="text" value={formData.doi} onChange={e => setFormData({...formData, doi: e.target.value})} className="w-full px-4 py-3 border border-[#E5E0D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8E7C68]/30 focus:border-[#8E7C68] transition-all bg-[#FAF9F6] focus:bg-white" placeholder="10.xxxx/xxxxx" />
                  </div>
                </div>
                
                {/* File Upload Section */}
                <div className="pt-2">
                  <label className="block text-sm font-bold text-[#5C5446] mb-2">
                    Manuscript Document <span className="text-red-500">*</span>
                  </label>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <input 
                      type="file" 
                      accept=".doc,.docx,.pdf"
                      onChange={handleFileChange}
                      className="w-full sm:w-auto text-sm text-[#5C5446] file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[#E5E0D8] file:text-[#2C2C2C] hover:file:bg-[#D5D0C8] cursor-pointer" 
                    />
                    {isEditing && !selectedFile && formData.manuscript_pdf_id && (
                      <div className="text-sm text-[#8E7C68] border border-[#E5E0D8] px-3 py-2 rounded-lg bg-[#FAF9F6] flex items-center gap-2">
                        <span>Current:</span> 
                        {formData.manuscript_url ? (
                          <button type="button" onClick={() => setViewingDocUrl(resolveFileUrl(formData.manuscript_url))} className="text-blue-600 font-bold underline">Download / View</button>
                        ) : (
                          <span className="italic">Doc ID {formData.manuscript_pdf_id}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-[#8E7C68] mt-2">Accepted formats: .doc, .docx, .pdf</p>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-[#E5E0D8] bg-[#FAF9F6] rounded-b-2xl flex justify-end space-x-4 shrink-0">
              <button type="button" onClick={closeModal} className="px-6 py-2.5 text-[#5C5446] hover:bg-[#E5E0D8] rounded-lg font-bold transition-colors">Cancel</button>
              <button type="submit" form="articleForm" disabled={formLoading} className="px-8 py-2.5 bg-[#2C2C2C] text-white rounded-lg font-bold tracking-wide hover:bg-[#4A4A4A] transition-all shadow-md disabled:opacity-50 hover:shadow-lg">
                {formLoading ? 'Saving...' : 'Save Submission'}
              </button>
            </div>
            
          </div>
        </div>
      )}

      {/* Fullscreen Document Viewer Modal */}
      {viewingDocUrl && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4 sm:p-8">
          <div className="bg-[#FAF9F6] rounded-2xl shadow-2xl w-full h-full max-w-6xl flex flex-col relative overflow-hidden border border-[#E5E0D8]">
            {/* Viewer Header */}
            <div className="px-6 py-4 border-b border-[#E5E0D8] flex justify-between items-center bg-white shrink-0">
              <h3 className="text-xl font-bold text-[#2C2C2C] flex items-center gap-2">
                <svg className="w-6 h-6 text-[#8E7C68]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                Document Viewer
              </h3>
              <div className="flex items-center gap-4">
                <a href={viewingDocUrl} download target="_blank" rel="noreferrer" className="px-4 py-2 bg-[#E5E0D8] hover:bg-[#D5D0C8] text-[#2C2C2C] font-bold rounded-lg transition-colors text-sm">Download File</a>
                <button onClick={() => setViewingDocUrl(null)} className="text-[#8E7C68] hover:text-[#2C2C2C] text-3xl font-light leading-none transition-colors">×</button>
              </div>
            </div>
            
            {/* Viewer Body */}
            <div className="flex-1 bg-[#E5E0D8] relative overflow-hidden">
              {renderFileViewer()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaperSubmissions;
