import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token. Please request a new password reset link.');
    }
  }, [token]);

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:9090/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok || data.status === 'error') {
        throw new Error(data.message || 'Failed to reset password');
      }

      setMessage('Password successfully reset. You will be redirected to login.');
      setPassword('');
      setConfirmPassword('');
      
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-10 rounded shadow-[0_4px_24px_-4px_rgba(44,44,44,0.08)] border border-[#E5E0D8]">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#2C2C2C] mb-2">Create New Password</h2>
          <p className="text-[#8E7C68] italic font-serif">Enter your new secure password</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-semibold">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm font-semibold">
            {message}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-6">
          <div>
            <label className="block text-[1.05rem] font-bold text-[#2C2C2C] mb-1" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!token || message}
              className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E5E0D8] rounded focus:outline-none focus:ring-1 focus:ring-[#8E7C68] focus:border-[#8E7C68] transition-all text-[1.1rem] disabled:opacity-50"
              placeholder="author@journal.com"
              required
            />
          </div>

          <div>
            <label className="block text-[1.05rem] font-bold text-[#2C2C2C] mb-1" htmlFor="password">New Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!token || message}
              className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E5E0D8] rounded focus:outline-none focus:ring-1 focus:ring-[#8E7C68] focus:border-[#8E7C68] transition-all text-[1.1rem] disabled:opacity-50"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-[1.05rem] font-bold text-[#2C2C2C] mb-1" htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={!token || message}
              className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E5E0D8] rounded focus:outline-none focus:ring-1 focus:ring-[#8E7C68] focus:border-[#8E7C68] transition-all text-[1.1rem] disabled:opacity-50"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !token || message}
            className="w-full py-3.5 px-6 bg-[#2C2C2C] hover:bg-[#1A1A1A] text-[#F9F6F0] font-bold rounded shadow transition-all duration-300 disabled:opacity-50 flex justify-center items-center tracking-wide text-lg"
          >
            {loading ? (
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : 'Save Password'}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-[#E5E0D8] text-center">
           <Link to="/login" className="font-bold text-[#2C2C2C] hover:underline flex items-center justify-center">
             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
             Back to Login
           </Link>
        </div>
      </div>
    </main>
  );
};

export default ResetPassword;
