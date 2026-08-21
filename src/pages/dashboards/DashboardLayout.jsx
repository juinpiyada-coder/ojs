import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaUsers, FaCog, FaPaintBrush, FaClipboardList, FaBullhorn, FaSignOutAlt, FaFileAlt, FaLayerGroup, FaArchive } from 'react-icons/fa';
import { apiFetch, resolveImageUrl } from '../../utils/api';

const DashboardLayout = ({ title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || {});
  const isAdmin = user.role_name === 'Admin';
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user')) || {};
        if (!storedUser.user_id) return;
        const res = await apiFetch(`/users?id=${storedUser.user_id}`);
        if (res && res.data) {
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        }
      } catch (err) {
        console.error('Failed to refresh user profile:', err);
      }
    };
    fetchUserProfile();
  }, [location.pathname]);

  const getDashboardPrefix = () => {
    const roleStr = (user.role_name || '').toLowerCase();
    if (roleStr.includes('admin')) return '/admin/dashboard';
    if (roleStr.includes('assistant')) return '/assistant-editor/dashboard';
    if (roleStr.includes('editor')) return '/editor/dashboard';
    if (roleStr.includes('reviewer')) return '/reviewer/dashboard';
    return '/user/dashboard';
  };
  const dashPrefix = getDashboardPrefix();

  const [brand, setBrand] = useState({
    journal_title: 'OJS',
    admin_dash_bg_hex: '#FFFFFF',
    admin_dash_accent_hex: '#8E7C68'
  });

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const res = await apiFetch('/branding');
        if (res.data && res.data.length > 0) {
          setBrand(res.data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch branding context', err);
      }
    };
    fetchBranding();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div 
      className="min-h-screen flex bg-white font-sans relative"
      style={{
        '--brand-sidebar-bg': brand.admin_dash_bg_hex,
        '--brand-accent': brand.admin_dash_accent_hex
      }}
    >
      <style>{`
        .brand-sidebar { background-color: var(--brand-sidebar-bg) !important; }
        .brand-link:hover { background-color: #E5E7EB !important; color: #111827 !important; }
        .brand-link.active { background-color: #E5E7EB !important; color: #111827 !important; font-weight: 600; }
        .brand-text-accent { color: var(--brand-accent) !important; }
      `}</style>
      
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#FAFAFA] border-r border-gray-200 flex flex-col transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-5 py-5 flex items-center border-b border-gray-200">
          <Link to="/" className="text-sm font-bold tracking-tight text-gray-900 hover:opacity-70 transition-opacity">
            {brand.journal_title.substring(0, 20)}
          </Link>
        </div>
        
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <Link to={dashPrefix} className="flex items-center px-3 py-2 bg-gray-200/70 text-gray-900 font-semibold text-sm rounded-md transition-all duration-150">
            <FaHome className="w-4 h-4 mr-3 text-gray-500" />
            Dashboard
          </Link>
          <Link to={`${dashPrefix}/profile`} className="brand-link flex items-center px-3 py-2 text-gray-600 font-medium text-sm rounded-md transition-all duration-150">
            <FaUser className="w-4 h-4 mr-3 text-gray-400" />
            My Profile
          </Link>
          
          {isAdmin && (
            <>
              <div className="pt-4 pb-1.5">
                <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Content</p>
              </div>
              
              <Link to="/admin/dashboard/volumes-issues" className="brand-link flex items-center px-3 py-2 text-gray-600 font-medium text-sm rounded-md transition-all duration-150">
                <FaLayerGroup className="w-4 h-4 mr-3 text-gray-400" />
                Volumes & Issues
              </Link>
              
              <Link to="/admin/dashboard/archives" className="brand-link flex items-center px-3 py-2 text-gray-600 font-medium text-sm rounded-md transition-all duration-150">
                <FaArchive className="w-4 h-4 mr-3 text-gray-400" />
                Archives
              </Link>

              <Link to="/admin/dashboard/submissions" className="brand-link flex items-center px-3 py-2 text-gray-600 font-medium text-sm rounded-md transition-all duration-150">
                <FaFileAlt className="w-4 h-4 mr-3 text-gray-400" />
                Submissions
              </Link>

              <div className="pt-4 pb-1.5">
                <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">System</p>
              </div>
              
              <Link to="/admin/dashboard/users" className="brand-link flex items-center px-3 py-2 text-gray-600 font-medium text-sm rounded-md transition-all duration-150">
                <FaUsers className="w-4 h-4 mr-3 text-gray-400" />
                Users
              </Link>
              <Link to="/admin/dashboard/settings" className="brand-link flex items-center px-3 py-2 text-gray-600 font-medium text-sm rounded-md transition-all duration-150">
                <FaCog className="w-4 h-4 mr-3 text-gray-400" />
                Settings
              </Link>
              <Link to="/admin/dashboard/branding" className="brand-link flex items-center px-3 py-2 text-gray-600 font-medium text-sm rounded-md transition-all duration-150">
                <FaPaintBrush className="w-4 h-4 mr-3 text-gray-400" />
                Branding
              </Link>
              <Link to="/admin/dashboard/audit-logs" className="brand-link flex items-center px-3 py-2 text-gray-600 font-medium text-sm rounded-md transition-all duration-150">
                <FaClipboardList className="w-4 h-4 mr-3 text-gray-400" />
                Audit Logs
              </Link>
              <Link to="/admin/dashboard/announcements" className="brand-link flex items-center px-3 py-2 text-gray-600 font-medium text-sm rounded-md transition-all duration-150">
                <FaBullhorn className="w-4 h-4 mr-3 text-gray-400" />
                Announcements
              </Link>
            </>
          )}
        </nav>
        
        <div className="p-3 border-t border-gray-200 mt-auto">
          <button onClick={handleLogout} className="flex items-center w-full px-3 py-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200/50 rounded-md transition-all duration-150 font-medium text-sm group">
            <FaSignOutAlt className="w-4 h-4 mr-3 group-hover:-translate-x-0.5 transition-transform duration-150" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4 sm:px-8 shrink-0 z-10">
          <div className="flex items-center">
            <button 
              className="md:hidden mr-3 p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <h1 className="text-base font-semibold text-gray-900 tracking-tight truncate max-w-[200px] sm:max-w-none">{title}</h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
               <p className="text-xs font-semibold text-gray-900">{user.display_name || 'User'}</p>
               <p className="text-[10px] text-gray-400">{user.email || ''}</p>
            </div>
            {user.avatar_url ? (
              <img 
                src={resolveImageUrl(user.avatar_url)} 
                alt="Profile" 
                onClick={() => navigate(`${dashPrefix}/profile`)}
                className="w-8 h-8 rounded-full object-cover border border-gray-200 hover:opacity-80 transition-opacity cursor-pointer" 
              />
            ) : (
              <div 
                onClick={() => navigate(`${dashPrefix}/profile`)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-900 text-white text-[10px] font-bold hover:opacity-80 transition-opacity cursor-pointer"
              >
                {(user.display_name || 'U').substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-6 relative bg-gray-50/50">
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
