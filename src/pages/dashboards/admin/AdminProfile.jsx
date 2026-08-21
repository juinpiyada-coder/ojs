import React, { useState, useEffect } from 'react';
import { apiFetch, resolveImageUrl } from '../../../utils/api';
import { toast } from 'react-toastify';
import { FaUserCircle, FaUpload, FaTrash, FaCheckCircle, FaShieldAlt } from 'react-icons/fa';

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    user_id: '',
    display_name: '',
    email: '',
    role_name: '',
    avatar_doc_id: null,
    avatar_url: ''
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const currentUser = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setInitialLoading(true);
        if (!currentUser.user_id) return;
        const res = await apiFetch(`/users?id=${currentUser.user_id}`);
        if (res && res.data) {
          setProfile({
            ...res.data,
            password: ''
          });
          localStorage.setItem('user', JSON.stringify(res.data));
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        toast.error('Failed to load profile details');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchUser();
  }, [currentUser.user_id]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleRemoveAvatar = async () => {
    setFile(null);
    setPreviewUrl(null);
    setProfile(prev => ({ ...prev, avatar_doc_id: null, avatar_url: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const targetUserId = profile.user_id || currentUser.user_id || 1;
      let currentDocId = profile.avatar_doc_id;

      if (file) {
        const fileData = new FormData();
        fileData.append('file', file);
        fileData.append('uploaded_by', targetUserId);
        fileData.append('folder', 'avatars');

        const uploadRes = await apiFetch('/docs', { method: 'POST', body: fileData });
        if (uploadRes && uploadRes.data?.doc_id) {
          currentDocId = uploadRes.data.doc_id;
        }
      }

      const payload = {
        display_name: profile.display_name.trim(),
        email: profile.email.trim(),
        avatar_doc_id: currentDocId
      };

      if (profile.password && profile.password.trim()) {
        payload.password = profile.password.trim();
      }

      const patchRes = await apiFetch(`/users?id=${targetUserId}`, {
        method: 'PATCH',
        body: payload
      });

      const updatedUser = patchRes.data || (await apiFetch(`/users?id=${targetUserId}`)).data;
      if (updatedUser) {
        setProfile({ ...updatedUser, password: '' });
        setFile(null);
        setPreviewUrl(null);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      toast.success('Profile updated successfully!');
      
      setTimeout(() => {
        window.location.reload();
      }, 700);
      
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast.error('Failed to update profile: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading && !profile.display_name) {
    return <div className="p-8 text-gray-500 text-sm">Loading profile...</div>;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-xl">
      
      <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Profile</h2>
          <p className="text-gray-500 text-xs mt-0.5">Manage your account details</p>
        </div>
        {profile.role_name && (
          <span className="px-2.5 py-1 bg-gray-900 text-gray-300 text-[10px] font-bold rounded-full flex items-center gap-1">
            <FaShieldAlt className="text-[9px]" /> {profile.role_name}
          </span>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="relative shrink-0">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-20 h-20 rounded-full object-cover border border-gray-200" 
              />
            ) : profile.avatar_url ? (
              <img 
                src={resolveImageUrl(profile.avatar_url)} 
                alt="Avatar" 
                className="w-20 h-20 rounded-full object-cover border border-gray-200" 
              />
            ) : (
              <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gray-200 text-gray-600 text-lg font-bold">
                {(profile.display_name || 'U').substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <label className="block text-xs font-semibold text-gray-600">
              Profile Picture
            </label>
            <p className="text-[11px] text-gray-500">
              JPEG, PNG, or WebP (Max 5MB)
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <label className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors inline-flex items-center gap-1.5">
                <FaUpload className="text-[9px]" /> Choose Image
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {(previewUrl || profile.avatar_url) && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1"
                >
                  <FaTrash className="text-[9px]" /> Remove
                </button>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Full Name *
          </label>
          <input 
            type="text" 
            required
            value={profile.display_name} 
            onChange={e => setProfile({ ...profile, display_name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
            placeholder="e.g. Dr. Jane Smith"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Email Address *
          </label>
          <input 
            type="email" 
            required
            value={profile.email} 
            onChange={e => setProfile({ ...profile, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
            placeholder="e.g. jane@university.edu"
          />
        </div>

        <div className="p-3 bg-gray-100/50 rounded-lg border border-gray-200 text-xs text-gray-500 flex justify-between items-center">
          <div>
            Status: <strong className="text-emerald-600 font-semibold uppercase">{profile.account_status || 'Active'}</strong>
          </div>
          <div>
            ID: <strong className="font-mono text-gray-600">#{profile.user_id || currentUser.user_id}</strong>
          </div>
        </div>
        
        <div className="pt-1">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <FaCheckCircle className="text-xs" /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AdminProfile;
