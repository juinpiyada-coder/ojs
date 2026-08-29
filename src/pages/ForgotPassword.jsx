import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { FaKey, FaEnvelope, FaLock, FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaEye, FaEyeSlash } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Please enter your account email address');
      return;
    }

    if (!password) {
      setError('Please enter a new password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // 1. First try direct password reset endpoint
      const res = await apiFetch('/auth/force-reset', {
        method: 'POST',
        body: { email: email.trim(), password }
      });

      setMessage(res?.message || 'Password has been successfully updated! Redirecting to login...');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      // 2. Fallback to forgot-password request if force-reset is restricted
      try {
        const fallbackRes = await apiFetch('/auth/forgot-password', {
          method: 'POST',
          body: { email: email.trim() }
        });
        setMessage(fallbackRes?.message || 'A password reset instruction has been sent to your email.');
      } catch (fallbackErr) {
        setError(err.message || fallbackErr.message || 'Failed to process password reset. Please check your email or contact system administration.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow flex items-center justify-center p-4 sm:p-6 bg-[#F9F6F0]">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-[#E5E0D8] animate-fadeIn">
        
        {/* Header Icon & Title */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-amber-50 text-amber-800 border border-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
            <FaKey className="text-xl" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2C2C2C] font-serif mb-1">Reset Password</h2>
          <p className="text-xs sm:text-sm text-[#8E7C68] font-serif">Enter your registered email and choose a new password</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <FaExclamationTriangle className="shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <FaCheckCircle className="shrink-0 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4A4237] mb-1.5" htmlFor="email">
              Email Address *
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F6] border border-[#E5E0D8] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8E7C68] focus:border-[#8E7C68] transition-all text-sm"
                placeholder="e.g. editor@ojs.local"
                required
              />
              <FaEnvelope className="absolute left-3.5 top-3.5 text-gray-400 text-xs" />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4A4237] mb-1.5" htmlFor="password">
              New Password *
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-[#FAF9F6] border border-[#E5E0D8] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8E7C68] focus:border-[#8E7C68] transition-all text-sm"
                placeholder="At least 6 characters"
                required
              />
              <FaLock className="absolute left-3.5 top-3.5 text-gray-400 text-xs" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4A4237] mb-1.5" htmlFor="confirmPassword">
              Confirm New Password *
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F6] border border-[#E5E0D8] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8E7C68] focus:border-[#8E7C68] transition-all text-sm"
                placeholder="Re-enter password"
                required
              />
              <FaLock className="absolute left-3.5 top-3.5 text-gray-400 text-xs" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-6 bg-[#1C2024] hover:bg-[#2C384A] text-[#FAF8F5] font-bold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex justify-center items-center gap-2 text-sm cursor-pointer"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span>Updating Password...</span>
              </span>
            ) : (
              <span>Reset & Update Password</span>
            )}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-[#E5E0D8] text-center">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1C2024] hover:text-[#B83327] transition-colors">
            <FaArrowLeft className="text-[10px]" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
