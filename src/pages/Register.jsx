import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [title, setTitle] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const fullDisplayName = title ? `${title} ${displayName}` : displayName;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_name: fullDisplayName, email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok || data.status === 'error') {
        throw new Error(data.message || 'Registration failed');
      }

      // Automatically redirect to login page after successful registration
      navigate('/login');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow flex items-center justify-center p-4 py-12">
      {/* Japandi style minimal card */}
      <div className="w-full max-w-md bg-white p-10 rounded shadow-[0_4px_24px_-4px_rgba(44,44,44,0.08)] border border-[#E5E0D8]">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#2C2C2C] mb-2">Create Account</h2>
          <p className="text-[#8E7C68] italic font-serif">Join the Open Journal System</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="flex gap-4">
            <div className="w-1/3">
              <label className="block text-[1.05rem] font-bold text-[#2C2C2C] mb-1" htmlFor="title">Title</label>
              <select
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E5E0D8] rounded focus:outline-none focus:ring-1 focus:ring-[#8E7C68] focus:border-[#8E7C68] transition-all text-[1.1rem]"
              >
                <option value="">None</option>
                <option value="Mr.">Mr.</option>
                <option value="Ms.">Ms.</option>
                <option value="Dr.">Dr.</option>
                <option value="Prof.">Prof.</option>
              </select>
            </div>
            <div className="w-2/3">
              <label className="block text-[1.05rem] font-bold text-[#2C2C2C] mb-1" htmlFor="displayName">Full Name</label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E5E0D8] rounded focus:outline-none focus:ring-1 focus:ring-[#8E7C68] focus:border-[#8E7C68] transition-all text-[1.1rem]"
                placeholder="Jane Doe"
                required
              />
            </div>
          </div>

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
            <label className="block text-[1.05rem] font-bold text-[#2C2C2C]" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-3 bg-[#FAF9F6] border border-[#E5E0D8] rounded focus:outline-none focus:ring-1 focus:ring-[#8E7C68] focus:border-[#8E7C68] transition-all text-[1.1rem]"
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
            ) : 'Register'}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-[#E5E0D8] text-center">
           <p className="text-base text-[#8E7C68]">
             Already have an account? <Link to="/login" className="font-bold text-[#2C2C2C] hover:underline">Sign in</Link>
           </p>
        </div>
      </div>
    </main>
  );
};

export default Register;
