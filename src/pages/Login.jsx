import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:9090/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok || data.status === 'error') {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      window.location.href = data.redirect_url;
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
