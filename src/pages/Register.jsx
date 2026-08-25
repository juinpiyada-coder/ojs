import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import { 
  FaUserEdit, 
  FaUserCheck, 
  FaUserShield, 
  FaEye, 
  FaEyeSlash, 
  FaCheckCircle, 
  FaArrowRight,
  FaShieldAlt,
  FaBookReader,
  FaGraduationCap
} from 'react-icons/fa';

const roles = [
  {
    key: 'Author',
    label: 'Author',
    icon: FaUserEdit,
    description: 'Submit research manuscripts, track peer review milestones & publish scholarly articles',
    badge: 'Standard Access'
  },
  {
    key: 'Reviewer',
    label: 'Peer Reviewer',
    icon: FaUserCheck,
    description: 'Conduct double-blind manuscript evaluations, provide feedback & submit recommendations',
    badge: 'Expert Reviewer'
  },
  {
    key: 'Editor',
    label: 'Editor',
    icon: FaUserShield,
    description: 'Screen submissions, coordinate peer review boards, copyediting & issue publications',
    badge: 'Editorial Board'
  }
];

const Register = () => {
  const [selectedRole, setSelectedRole] = useState('Author');
  const [title, setTitle] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const fullDisplayName = title ? `${title} ${displayName}` : displayName;
      const data = await apiFetch('/auth/signup', {
        method: 'POST',
        body: { 
          display_name: fullDisplayName.trim(), 
          email: email.trim(), 
          password,
          role_name: selectedRole 
        }
      });

      toast.success(`Account created successfully as ${selectedRole}! Please sign in.`);
      navigate('/login');
      
    } catch (err) {
      setError(err.message || 'Registration failed');
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setGoogleLoading(true);

    const { user, error: googleError } = await signInWithGoogle();
    if (googleError) {
      setError(googleError);
      setGoogleLoading(false);
      return;
    }

    try {
      const idToken = await user.getIdToken();
      const data = await apiFetch('/auth/google', {
        method: 'POST',
        body: {
          idToken,
          email: user.email,
          display_name: user.displayName,
          photo_url: user.photoURL,
          uid: user.uid,
          role_name: selectedRole
        }
      });

      toast.success(`Welcome! Signed in as ${data.data?.role_name || selectedRole}`);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      window.location.href = data.redirect_url || '/user/dashboard';
    } catch (err) {
      setError(err.message || 'Google registration failed');
      toast.error(err.message || 'Google registration failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex-grow flex items-center justify-center p-4 py-12 bg-[#F9F6F0]">
      <div className="w-full max-w-xl bg-white p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#E5E0D8] animate-fadeIn">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-[#1E2530] text-amber-300 rounded-2xl mb-3 shadow-xs">
            <FaGraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold text-[#1E2530] font-serif tracking-tight">Create an Account</h2>
          <p className="text-[#8E7C68] text-sm mt-1 font-medium">Select your portal role and join the scholarly journal system</p>
        </div>

        {/* Role Toggle Tabs */}
        <div className="mb-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443D] mb-3 text-center">
            Choose Your Primary Role
          </label>

          <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#FAF9F6] rounded-2xl border border-[#E5E0D8]">
            {roles.map(role => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.key;

              return (
                <button
                  key={role.key}
                  type="button"
                  onClick={() => {
                    setSelectedRole(role.key);
                    setError('');
                  }}
                  className={`py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-center relative ${
                    isSelected
                      ? 'bg-[#1E2530] text-white shadow-md'
                      : 'hover:bg-[#EAE5DD] text-[#5C5446]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-amber-300' : 'text-[#8E7C68]'}`} />
                  <span className="text-xs font-bold leading-tight">{role.label}</span>
                </button>
              );
            })}
          </div>

          {/* Role Description Card */}
          <div className="mt-3 p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/80 text-xs text-amber-950 flex items-start gap-2.5">
            <FaShieldAlt className="text-amber-700 w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <strong className="block font-bold text-amber-900 mb-0.5">
                Registering as: {selectedRole} ({roles.find(r => r.key === selectedRole)?.badge})
              </strong>
              <span>{roles.find(r => r.key === selectedRole)?.description}</span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          
          {/* Title & Full Name */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="w-full sm:w-1/3">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443D] mb-1.5" htmlFor="title">
                Title
              </label>
              <select
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-3 bg-[#FAF9F6] border border-[#E5E0D8] rounded-xl focus:outline-none focus:border-[#8E7C68] text-sm text-[#2C2C2C] font-medium"
              >
                <option value="">None</option>
                <option value="Dr.">Dr.</option>
                <option value="Prof.">Prof.</option>
                <option value="Mr.">Mr.</option>
                <option value="Ms.">Ms.</option>
                <option value="Mrs.">Mrs.</option>
              </select>
            </div>

            <div className="w-full sm:w-2/3">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443D] mb-1.5" htmlFor="displayName">
                Full Name *
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E5E0D8] rounded-xl focus:outline-none focus:border-[#8E7C68] focus:bg-white text-sm text-[#2C2C2C] font-medium transition-all"
                placeholder="Jane Doe"
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443D] mb-1.5" htmlFor="email">
              Institutional / Work Email Address *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E5E0D8] rounded-xl focus:outline-none focus:border-[#8E7C68] focus:bg-white text-sm text-[#2C2C2C] font-medium transition-all"
              placeholder="jane.doe@university.edu"
              required
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443D]" htmlFor="password">
                Password *
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-[#8E7C68] hover:text-[#1E2530] font-semibold flex items-center gap-1"
              >
                {showPassword ? <><FaEyeSlash className="text-[10px]" /> Hide</> : <><FaEye className="text-[10px]" /> Show</>}
              </button>
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E5E0D8] rounded-xl focus:outline-none focus:border-[#8E7C68] focus:bg-white text-sm text-[#2C2C2C] font-medium transition-all"
              placeholder="Minimum 6 characters"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443D] mb-1.5" htmlFor="confirmPassword">
              Confirm Password *
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E5E0D8] rounded-xl focus:outline-none focus:border-[#8E7C68] focus:bg-white text-sm text-[#2C2C2C] font-medium transition-all"
              placeholder="Re-enter password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3.5 px-6 bg-[#1E2530] hover:bg-[#2C384A] text-white font-bold rounded-xl shadow hover:shadow-md transition-all duration-300 disabled:opacity-50 flex justify-center items-center gap-2 text-sm tracking-wider uppercase"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Creating {selectedRole} Account...
              </span>
            ) : (
              <>Register as {selectedRole} <FaArrowRight className="text-xs" /></>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6 flex items-center gap-4">
          <div className="flex-grow h-px bg-[#E5E0D8]"></div>
          <span className="text-xs font-semibold text-[#8E7C68] uppercase tracking-wider">or continue with</span>
          <div className="flex-grow h-px bg-[#E5E0D8]"></div>
        </div>

        {/* Google Sign-Up Button */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={googleLoading}
          className="w-full mt-6 py-3.5 px-6 bg-white border-2 border-[#E5E0D8] text-[#1E2530] font-bold rounded-xl shadow-xs hover:bg-[#FAF9F6] hover:shadow transition-all duration-300 disabled:opacity-50 flex justify-center items-center gap-3 text-sm"
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
              Sign up with Google as {selectedRole}
            </>
          )}
        </button>
        
        {/* Footer Link */}
        <div className="mt-8 pt-6 border-t border-[#E5E0D8] text-center">
          <p className="text-xs text-[#8E7C68] font-medium">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#1E2530] hover:underline">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
};

export default Register;
