import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../utils/api';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    announcement_id: '',
    title: '',
    content: '',
    is_published: 0,
    doc_id: null
  });
  const [file, setFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const data = await apiFetch('/announcements');
      setAnnouncements(data.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const openModal = (ann = null) => {
    setFile(null);
    if (ann) {
      setIsEditing(true);
      setFormData({
        announcement_id: ann.announcement_id,
        title: ann.title,
        content: ann.content,
        is_published: ann.is_published,
        doc_id: ann.doc_id
      });
    } else {
      setIsEditing(false);
      setFormData({
        announcement_id: '',
        title: '',
        content: '',
        is_published: 0,
        doc_id: null
      });
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    const user = JSON.parse(localStorage.getItem('user')) || { user_id: 1 };
    
    let currentDocId = formData.doc_id;

    if (file) {
      const fileData = new FormData();
      fileData.append('file', file);
      fileData.append('uploaded_by', user.user_id);
      try {
        const uploadRes = await apiFetch('/docs', { method: 'POST', body: fileData });
        currentDocId = uploadRes.data.doc_id;
      } catch (err) {
        toast.error('File upload failed: ' + err.message);
        setFormLoading(false);
        return;
      }
    }

    const payload = {
      ...formData,
      doc_id: currentDocId,
      admin_id: user.user_id,
      published_at: formData.is_published == 1 ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null
    };

    try {
      if (isEditing) {
        await apiFetch(`/announcements?id=${formData.announcement_id}`, {
          method: 'PUT',
          body: payload
        });
        toast.success('Announcement updated!');
      } else {
        await apiFetch('/announcements', {
          method: 'POST',
          body: payload
        });
        toast.success('Announcement published!');
      }
      await fetchAnnouncements();
      closeModal();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await apiFetch(`/announcements?id=${id}`, { method: 'DELETE' });
        toast.success('Announcement deleted!');
        await fetchAnnouncements();
      } catch (err) {
        toast.error('Failed to delete: ' + err.message);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E5E0D8] relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#2C2C2C]">Global Announcements</h2>
        <button 
          onClick={() => openModal()}
          className="px-5 py-2 bg-[#8E7C68] text-white rounded font-bold hover:bg-[#7a6a57] transition-colors"
        >
          + New Announcement
        </button>
      </div>

      <div className="space-y-6">
        {announcements.map(ann => (
          <div key={ann.announcement_id} className="p-6 border border-[#E5E0D8] rounded-xl bg-[#FAF9F6] relative group">
            
            {/* Actions overlay */}
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-3">
              <button onClick={() => openModal(ann)} className="text-blue-600 hover:text-blue-800 font-semibold bg-white px-3 py-1.5 rounded-lg shadow-sm inline-flex items-center gap-1 border border-blue-100"><FaEdit /> Edit</button>
              <button onClick={() => handleDelete(ann.announcement_id)} className="text-red-600 hover:text-red-800 font-semibold bg-white px-3 py-1.5 rounded-lg shadow-sm inline-flex items-center gap-1 border border-red-100"><FaTrash /> Delete</button>
            </div>

            <h3 className="text-xl font-bold text-[#2C2C2C] mb-2 pr-24">{ann.title}</h3>
            <p className="text-[#5C5446] mb-4 whitespace-pre-wrap">{ann.content}</p>
            
            {ann.doc_url && (
              <div className="mb-4">
                <a href={ann.doc_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-blue-100">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                  View Attachment
                </a>
              </div>
            )}
            
            <div className="text-sm text-[#8E7C68] flex items-center space-x-4 border-t border-[#E5E0D8] pt-4 mt-4">
              <span className={`px-2 py-1 rounded font-bold text-xs ${ann.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {ann.is_published ? 'Published' : 'Draft'}
              </span>
              <span>By: {ann.admin_name || 'Admin'}</span>
              {ann.published_at && <span>Published: {new Date(ann.published_at).toLocaleDateString()}</span>}
            </div>
          </div>
        ))}
        {announcements.length === 0 && <p className="text-[#5C5446]">No announcements found.</p>}
      </div>

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col relative my-auto">
            <div className="px-8 py-5 border-b border-[#E5E0D8] flex justify-between items-center bg-[#FAF9F6] rounded-t-2xl shrink-0">
              <h3 className="text-xl font-bold text-[#2C2C2C]">{isEditing ? 'Edit Announcement' : 'Create Announcement'}</h3>
              <button onClick={closeModal} className="text-[#8E7C68] hover:text-[#2C2C2C] text-2xl font-light leading-none">✕</button>
            </div>
            
            <div className="p-8 overflow-y-auto">
              <form id="announcementForm" onSubmit={handleSubmit} className="space-y-4">
                
                <div>
                  <label className="block text-sm font-bold text-[#5C5446] mb-1.5">Title *</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8E7C68]/30 focus:border-[#8E7C68]" placeholder="Enter announcement title..." />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-[#5C5446] mb-1.5">Content *</label>
                  <textarea required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} rows="6" className="w-full px-3 py-2 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8E7C68]/30 focus:border-[#8E7C68]" placeholder="Write the announcement body here..." />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#5C5446] mb-1.5">Attachment (Optional PDF/Doc/Image)</label>
                  <input type="file" accept=".pdf,image/*,.doc,.docx" onChange={e => setFile(e.target.files[0])} className="w-full px-3 py-2 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8E7C68]/30 focus:border-[#8E7C68] text-sm text-[#5C5446] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FAF9F6] file:text-[#8E7C68] hover:file:bg-[#E5E0D8]" />
                  {formData.doc_id && !file && <p className="text-xs text-blue-600 mt-1 font-semibold">Has existing attachment. Uploading a new one will replace it.</p>}
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <input 
                    type="checkbox" 
                    id="is_published"
                    checked={formData.is_published == 1} 
                    onChange={e => setFormData({...formData, is_published: e.target.checked ? 1 : 0})} 
                    className="w-5 h-5 accent-[#8E7C68]"
                  />
                  <label htmlFor="is_published" className="font-bold text-[#2C2C2C] cursor-pointer">
                    Publish immediately
                  </label>
                </div>
              </form>
            </div>

            <div className="px-8 py-5 border-t border-[#E5E0D8] bg-[#FAF9F6] flex justify-end space-x-4 rounded-b-2xl shrink-0">
              <button type="button" onClick={closeModal} className="px-6 py-2.5 text-[#5C5446] hover:bg-[#E5E0D8] rounded-lg font-bold transition-colors">Cancel</button>
              <button type="submit" form="announcementForm" disabled={formLoading} className="px-8 py-2.5 bg-[#2C2C2C] text-white rounded-lg font-bold hover:bg-[#4A4A4A] transition-colors disabled:opacity-50">
                {formLoading ? 'Saving...' : 'Save Announcement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
