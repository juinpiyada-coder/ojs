import React, { useState, useEffect } from 'react';
import { apiFetch, resolveImageUrl } from '../../../utils/api';
import { toast } from 'react-toastify';
import { COUNTRIES } from '../../../data/countries';
import { 
  FaUser, 
  FaEnvelope, 
  FaShieldAlt, 
  FaUpload, 
  FaTrash, 
  FaCheckCircle, 
  FaIdBadge,
  FaKey,
  FaCamera,
  FaCircle,
  FaInfoCircle,
  FaBuilding,
  FaGlobe,
  FaIdCard,
  FaWhatsapp,
  FaVenusMars,
  FaUserTie
} from 'react-icons/fa';

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    user_id: '',
    display_name: '',
    email: '',
    role_name: '',
    account_status: 'active',
    avatar_doc_id: null,
    avatar_url: '',
    gender: '',
    citizenship: '',
    affiliation: '',
    whatsapp_number: '',
    institute_id_number: '',
    identity_proof_type: '',
    identity_proof_number: '',
    user_designation: '',
    password: ''
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
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
      if (selected.size > 5 * 1024 * 1024) {
        toast.error('Image is too large. Maximum size is 5MB.');
        return;
      }
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleRemoveAvatar = () => {
    setFile(null);
    setPreviewUrl(null);
    setProfile(prev => ({ ...prev, avatar_doc_id: null, avatar_url: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (showPasswordSection && newPassword) {
      if (newPassword !== confirmPassword) {
        toast.error('New passwords do not match!');
        return;
      }
      if (newPassword.length < 6) {
        toast.error('Password must be at least 6 characters long.');
        return;
      }
    }

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
        display_name: (profile.display_name || '').trim(),
        email: (profile.email || '').trim(),
        avatar_doc_id: currentDocId,
        gender: profile.gender ? profile.gender.trim() : null,
        citizenship: profile.citizenship ? profile.citizenship.trim() : null,
        affiliation: profile.affiliation ? profile.affiliation.trim() : null,
        whatsapp_number: profile.whatsapp_number ? profile.whatsapp_number.trim() : null,
        institute_id_number: profile.institute_id_number ? profile.institute_id_number.trim() : null,
        identity_proof_type: profile.identity_proof_type ? profile.identity_proof_type.trim() : null,
        identity_proof_number: profile.identity_proof_number ? profile.identity_proof_number.trim() : null,
        user_designation: profile.user_designation ? profile.user_designation.trim() : null
      };

      if (showPasswordSection && newPassword.trim()) {
        payload.password = newPassword.trim();
      }

      const patchRes = await apiFetch(`/users?id=${targetUserId}`, {
        method: 'PATCH',
        body: payload
      });

      const freshRes = await apiFetch(`/users?id=${targetUserId}`);
      const updatedUser = (freshRes && freshRes.data) ? freshRes.data : (patchRes && patchRes.data ? patchRes.data : null);
      if (updatedUser) {
        setProfile({ ...updatedUser, password: '' });
        setFile(null);
        setPreviewUrl(null);
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordSection(false);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.dispatchEvent(new CustomEvent('user-profile-updated', { detail: updatedUser }));
        window.dispatchEvent(new Event('storage'));
      }
      
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast.error('Failed to update profile: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading && !profile.display_name) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-semibold">Loading profile details...</span>
      </div>
    );
  }

  const roleName = profile.role_name || currentUser.role_name || 'Admin';

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      
      {/* Material Elevation Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)] relative overflow-hidden">
        
        {/* Top Decorative Color Accent Bar */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-500"></div>

        {/* Header Title + Role Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Account Profile</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Manage your personal credentials, identity photo, and academic details
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs">
              <FaShieldAlt className="text-emerald-400 text-[11px]" />
              <span>{roleName}</span>
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="pt-6 space-y-6">
          
          {/* Avatar Upload Card */}
          <div className="p-5 bg-slate-50/70 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-center sm:items-start gap-5 transition-all hover:bg-slate-50">
            
            {/* Avatar Circle with Badge */}
            <div className="relative group shrink-0">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-white shadow-md ring-2 ring-emerald-500/30" 
                />
              ) : profile.avatar_url ? (
                <img 
                  src={resolveImageUrl(profile.avatar_url)} 
                  alt="Avatar" 
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-white shadow-md ring-1 ring-slate-200" 
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-emerald-400 text-2xl font-extrabold shadow-md border-2 border-white">
                  {(profile.display_name || 'U').substring(0, 2).toUpperCase()}
                </div>
              )}

              <label 
                htmlFor="avatar-upload"
                className="absolute -bottom-2 -right-2 p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md cursor-pointer transition-transform hover:scale-110 flex items-center justify-center"
                title="Upload new picture"
              >
                <FaCamera className="w-3.5 h-3.5" />
                <input 
                  id="avatar-upload"
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Avatar Details & Controls */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Profile Photo</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Upload a clean JPG, PNG, or WebP headshot (Max 5MB)
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <label 
                  htmlFor="avatar-upload-btn"
                  className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 hover:border-slate-400 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer shadow-xs transition-all flex items-center gap-1.5"
                >
                  <FaUpload className="text-[10px] text-slate-500" />
                  <span>Choose Image</span>
                  <input 
                    id="avatar-upload-btn"
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
                    className="px-3.5 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <FaTrash className="text-[10px]" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Form Fields: Standard Input Fields */}
          <div className="space-y-4">
            
            {/* Section 1: Basic Information */}
            <div className="pb-1 border-b border-slate-100">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Basic Information</span>
            </div>

            {/* Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                  <input 
                    type="text" 
                    required
                    value={profile.display_name} 
                    onChange={e => setProfile({ ...profile, display_name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                    placeholder="e.g. Dr. Jane Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                  <input 
                    type="email" 
                    required
                    value={profile.email} 
                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                    placeholder="e.g. user@university.edu"
                  />
                </div>
              </div>
            </div>

            {/* Gender & Citizenship (Clean Inputs) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                  <FaVenusMars className="text-slate-400" /> Gender
                </label>
                <input 
                  type="text" 
                  value={profile.gender || ''} 
                  onChange={e => setProfile({ ...profile, gender: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                  placeholder="e.g. Male, Female, Prefer not to say..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                  <FaGlobe className="text-slate-400" /> Citizenship / Nationality
                </label>
                <select 
                  value={profile.citizenship || ''} 
                  onChange={e => setProfile({ ...profile, citizenship: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                >
                  <option value="">Select Country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Section 2: Academic & Institutional Details */}
            <div className="pt-3 pb-1 border-b border-slate-100">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Academic & Verification Details</span>
            </div>

            {/* Academic Designation & Affiliation (Clean Text Inputs) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                  <FaUserTie className="text-slate-400" /> Academic Designation / Status
                </label>
                <input 
                  type="text" 
                  value={profile.user_designation || ''} 
                  onChange={e => setProfile({ ...profile, user_designation: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                  placeholder="e.g. Research Scholar, Faculty, Student..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                  <FaBuilding className="text-slate-400" /> Affiliation / Institute Name
                </label>
                <input 
                  type="text" 
                  value={profile.affiliation || ''} 
                  onChange={e => setProfile({ ...profile, affiliation: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                  placeholder="e.g. Department of English, University of Delhi"
                />
              </div>
            </div>

            {/* WhatsApp Number & Institute ID Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                  <FaWhatsapp className="text-emerald-500" /> WhatsApp Number
                </label>
                <input 
                  type="tel" 
                  value={profile.whatsapp_number || ''} 
                  onChange={e => setProfile({ ...profile, whatsapp_number: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                  placeholder="e.g. +91 9876543210"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                  <FaIdBadge className="text-slate-400" /> Institute ID / Roll Number
                </label>
                <input 
                  type="text" 
                  value={profile.institute_id_number || ''} 
                  onChange={e => setProfile({ ...profile, institute_id_number: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                  placeholder="e.g. EMP10482 / ROLL2024"
                />
              </div>
            </div>

            {/* Identity Proof Type & Proof Number (Clean Text Inputs) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                  <FaIdCard className="text-slate-400" /> Identity Proof Type
                </label>
                <input 
                  type="text" 
                  value={profile.identity_proof_type || ''} 
                  onChange={e => setProfile({ ...profile, identity_proof_type: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                  placeholder="e.g. Aadhaar Card, PAN Card, Passport, ABC ID..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                  <FaIdBadge className="text-slate-400" /> Identity Proof Number / ID
                </label>
                <input 
                  type="text" 
                  value={profile.identity_proof_number || ''} 
                  onChange={e => setProfile({ ...profile, identity_proof_number: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                  placeholder="e.g. ID / Document Number"
                />
              </div>
            </div>

            {/* Security & Password Toggle Section */}
            <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaKey className="text-slate-400 text-xs" />
                  <span className="text-xs font-bold text-slate-800">Account Password</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPasswordSection(!showPasswordSection)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                >
                  {showPasswordSection ? 'Cancel Password Change' : 'Change Password'}
                </button>
              </div>

              {showPasswordSection && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">New Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Confirm Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Account Metadata Strip */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Account Status:</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 font-bold text-[11px] border border-emerald-200">
                <FaCircle className="w-1.5 h-1.5 text-emerald-500" />
                {(profile.account_status || 'ACTIVE').toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
              <span>System User ID:</span>
              <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                #{profile.user_id || currentUser.user_id || 1}
              </span>
            </div>
          </div>

          {/* Save Submit Button */}
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 bg-[#107C41] hover:bg-[#0E6E38] text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <FaCheckCircle className="text-sm" />
              <span>{loading ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default AdminProfile;
