import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const navigate = useNavigate();
  const { signInWithGoogle, isAuthenticated } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: { email, password }
      });

      const roleStr = (data.data?.role_name || '').toLowerCase();
      let targetUrl = data.redirect_url;
      if (!targetUrl) {
        if (roleStr.includes('admin')) targetUrl = '/admin/dashboard';
        else if (roleStr.includes('assistant')) targetUrl = '/assistant-editor/dashboard';
        else if (roleStr.includes('editor')) targetUrl = '/editor/dashboard';
        else if (roleStr.includes('reviewer')) targetUrl = '/reviewer/dashboard';
        else targetUrl = '/user/dashboard';
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      window.location.href = targetUrl;
      
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    
    const { user, error: googleError } = await signInWithGoogle();
    
    if (googleError) {
      setError(googleError);
      setGoogleLoading(false);
      return;
    }

    // Send Firebase token to your backend to create/get user
    try {
      const idToken = await user.getIdToken();
      const data = await apiFetch('/auth/google', {
        method: 'POST',
        body: { 
          idToken,
          email: user.email,
          display_name: user.displayName,
          photo_url: user.photoURL,
          uid: user.uid
        }
      });

      const roleStr = (data.data?.role_name || '').toLowerCase();
      let targetUrl = data.redirect_url;
      if (!targetUrl) {
        if (roleStr.includes('admin')) targetUrl = '/admin/dashboard';
        else if (roleStr.includes('assistant')) targetUrl = '/assistant-editor/dashboard';
        else if (roleStr.includes('editor')) targetUrl = '/editor/dashboard';
        else if (roleStr.includes('reviewer')) targetUrl = '/reviewer/dashboard';
        else targetUrl = '/user/dashboard';
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      window.location.href = targetUrl;
      
    } catch (err) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex-grow flex items-center justify-center p-4">
      {/* Japandi style minimal card */}
      <div className="w-full max-w-md bg-white p-10 rounded shadow-[0_4px_24px_-4px_rgba(44,44,44,0.08)] border border-[#E5E0D8]">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#2C2C2C] mb-2">Welcome Back</h2>
          <p className="text-[#8E7C68] italic font-serif">Please sign in to your account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[1.05rem] font-bold text-[#2C2C2C] mb-1" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E5E0D8] rounded focus:outline-none focus:ring-1 focus:ring-[#8E7C68] focus:border-[#8E7C68] transition-all text-[1.1rem]"
              placeholder="author@journal.com"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[1.05rem] font-bold text-[#2C2C2C]" htmlFor="password">Password</label>
              <Link to="/forgot-password" className="text-sm font-semibold text-[#8E7C68] hover:text-[#2C2C2C] transition-colors">Forgot password?</Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E5E0D8] rounded focus:outline-none focus:ring-1 focus:ring-[#8E7C68] focus:border-[#8E7C68] transition-all text-[1.1rem]"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3.5 px-6 bg-[#2C2C2C] hover:bg-[#1A1A1A] text-[#F9F6F0] font-bold rounded shadow transition-all duration-300 disabled:opacity-50 flex justify-center items-center tracking-wide text-lg"
          >
            {loading ? (
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6 flex items-center gap-4">
          <div className="flex-grow h-px bg-[#E5E0D8]"></div>
          <span className="text-xs font-semibold text-[#8E7C68] uppercase tracking-wider">or</span>
          <div className="flex-grow h-px bg-[#E5E0D8]"></div>
        </div>

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full mt-6 py-3.5 px-6 bg-white border-2 border-[#E5E0D8] text-[#2C2C2C] font-bold rounded shadow-sm hover:bg-[#FAF9F6] hover:shadow transition-all duration-300 disabled:opacity-50 flex justify-center items-center gap-3 text-base"
        >
          {googleLoading ? (
            <svg className="animate-spin h-5 w-5 text-[#8E7C68]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </>
          )}
        </button>
        
        <div className="mt-8 pt-6 border-t border-[#E5E0D8] text-center">
           <p className="text-base text-[#8E7C68]">
             Don't have an account? <Link to="/register" className="font-bold text-[#2C2C2C] hover:underline">Register now</Link>
           </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
