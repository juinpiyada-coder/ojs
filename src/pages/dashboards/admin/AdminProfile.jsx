import React, { useState, useEffect } from 'react';
import { apiFetch, resolveImageUrl } from '../../../utils/api';
import { toast } from 'react-toastify';

const AdminProfile = () => {
  const [profile, setProfile] = useState({ display_name: '', email: '', avatar_doc_id: null, avatar_url: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const currentUser = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!currentUser.user_id) return;
        const res = await apiFetch(`/users?id=${currentUser.user_id}`);
        if (res.data) {
          setProfile({
            ...res.data,
            password: '' // Keep password blank initially
          });
          // Sync localStorage in case it's out of sync
          localStorage.setItem('user', JSON.stringify(res.data));
        }
      } catch (err) {
        toast.error('Failed to load profile');
      }
    };
    fetchUser();
  }, [currentUser.user_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let currentDocId = profile.avatar_doc_id;

      if (file) {
        const fileData = new FormData();
        fileData.append('file', file);
        fileData.append('uploaded_by', currentUser.user_id);
        const uploadRes = await apiFetch('/docs', { method: 'POST', body: fileData });
        currentDocId = uploadRes.data.doc_id;
      }

      const payload = {
        user_id: currentUser.user_id,
        display_name: profile.display_name,
        email: profile.email,
        avatar_doc_id: currentDocId
      };

      if (profile.password) {
        // We aren't doing password change in the backend PATCH securely right now if it requires hashing,
        // but if the backend handles 'password' field in patch we can send it.
        // The PATCH user allowed fields doesn't include 'password' currently.
        // We will just ignore password for now or you'd need to update backend.
        toast.warning('Password change is not enabled in this form.');
      }

      await apiFetch(`/users?id=${currentUser.user_id}`, { method: 'PATCH', body: payload });
      
      // Refetch to get the updated avatar_url and update local storage
      const res = await apiFetch(`/users?id=${currentUser.user_id}`);
      if (res.data) {
        setProfile({ ...res.data, password: '' });
        setFile(null);
        localStorage.setItem('user', JSON.stringify(res.data));
      }
      
      toast.success('Profile updated successfully!');
      
      // Reload page to reflect avatar in header
      setTimeout(() => window.location.reload(), 800);
      
    } catch (err) {
      toast.error('Failed to update profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E5E0D8] max-w-2xl">
      <h2 className="text-2xl font-bold text-[#2C2C2C] mb-6">My Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="flex items-center space-x-6 mb-6">
          {file ? (
            <img src={URL.createObjectURL(file)} alt="Avatar Preview" className="w-24 h-24 rounded-full object-cover shadow-sm border-2 border-[#8E7C68]" />
          ) : profile.avatar_url ? (
            <img src={resolveImageUrl(profile.avatar_url)} alt="Avatar" className="w-24 h-24 rounded-full object-cover shadow-sm border border-[#E5E0D8]" />
          ) : (
            <div className="w-24 h-24 rounded-full flex items-center justify-center bg-[#F9F6F0] text-[#2C2C2C] text-2xl font-bold shadow-sm border border-[#E5E0D8]">
              {(profile.display_name || 'U').substring(0, 2).toUpperCase()}
            </div>
          )}
          
          <div className="flex-1">
            <label className="block text-sm font-semibold text-[#5C5446] mb-2">Profile Image</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={e => setFile(e.target.files[0])}
              className="w-full text-sm text-[#5C5446] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FAF9F6] file:text-[#8E7C68] hover:file:bg-[#E5E0D8]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#5C5446] mb-2">Display Name</label>
          <input 
            type="text" 
            required
            value={profile.display_name} 
            onChange={e => setProfile({...profile, display_name: e.target.value})}
            className="w-full px-4 py-3 border border-[#E5E0D8] rounded focus:outline-none focus:border-[#8E7C68] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#5C5446] mb-2">Email Address</label>
          <input 
            type="email" 
            required
            value={profile.email} 
            onChange={e => setProfile({...profile, email: e.target.value})}
            className="w-full px-4 py-3 border border-[#E5E0D8] rounded focus:outline-none focus:border-[#8E7C68] transition-colors"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="px-6 py-3 bg-[#2C2C2C] text-white rounded font-bold tracking-wide hover:bg-[#4A4A4A] transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default AdminProfile;
