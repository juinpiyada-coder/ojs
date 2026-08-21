import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../utils/api';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div className="p-8 text-gray-500 text-sm">Loading...</div>;
  if (error) return <div className="p-8 text-red-500 text-sm">Error: {error}</div>;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Announcements</h2>
          <p className="text-xs text-gray-500 mt-0.5">Manage global announcements</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          + New Announcement
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map(ann => (
          <div key={ann.announcement_id} className="p-5 border border-gray-200 rounded-lg relative group hover:border-gray-200 transition-colors">
            <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
              <button onClick={() => openModal(ann)} className="text-blue-600 hover:text-blue-800 text-xs font-semibold bg-white px-2.5 py-1 rounded-md border border-gray-200 inline-flex items-center gap-1"><FaEdit /> Edit</button>
              <button onClick={() => handleDelete(ann.announcement_id)} className="text-red-500 hover:text-red-700 text-xs font-semibold bg-white px-2.5 py-1 rounded-md border border-gray-200 inline-flex items-center gap-1"><FaTrash /> Delete</button>
            </div>

            <h3 className="text-base font-bold text-gray-900 mb-2 pr-24">{ann.title}</h3>
            <p className="text-gray-600 text-sm mb-4 whitespace-pre-wrap">{ann.content}</p>
            
            {ann.doc_url && (
              <div className="mb-4">
                <a href={ann.doc_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-blue-100">
                  <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                  View Attachment
                </a>
              </div>
            )}
            
            <div className="text-xs text-gray-500 flex items-center space-x-4 border-t border-gray-200 pt-3 mt-3">
              <span className={`px-2 py-0.5 rounded font-semibold ${ann.is_published ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                {ann.is_published ? 'Published' : 'Draft'}
              </span>
              <span>By: {ann.admin_name || 'Admin'}</span>
              {ann.published_at && <span>{new Date(ann.published_at).toLocaleDateString()}</span>}
            </div>
          </div>
        ))}
        {announcements.length === 0 && <p className="text-gray-500 text-sm text-center py-8">No announcements found.</p>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-sm w-full max-w-xl relative">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-base font-bold text-gray-900">{isEditing ? 'Edit Announcement' : 'Create Announcement'}</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-600 text-lg leading-none">&times;</button>
            </div>
            
            <div className="p-6">
              <form id="announcementForm" onSubmit={handleSubmit} className="space-y-4">
                
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Title *</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200" placeholder="Announcement title..." />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Content *</label>
                  <textarea required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} rows="5" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 resize-none" placeholder="Announcement body..." />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Attachment (Optional)</label>
                  <input type="file" accept=".pdf,image/*,.doc,.docx" onChange={e => setFile(e.target.files[0])} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
                  {formData.doc_id && !file && <p className="text-[11px] text-blue-600 mt-1 font-semibold">Existing attachment will be replaced if you upload a new one.</p>}
                </div>

                <div className="flex items-center space-x-2.5 pt-1">
                  <input 
                    type="checkbox" 
                    id="is_published"
                    checked={formData.is_published == 1} 
                    onChange={e => setFormData({...formData, is_published: e.target.checked ? 1 : 0})} 
                    className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                  />
                  <label htmlFor="is_published" className="text-sm font-semibold text-gray-900 cursor-pointer">
                    Publish immediately
                  </label>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors">Cancel</button>
              <button type="submit" form="announcementForm" disabled={formLoading} className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50">
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
