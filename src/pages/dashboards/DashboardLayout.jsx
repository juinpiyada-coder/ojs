import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaUsers, FaCog, FaPaintBrush, FaClipboardList, FaBullhorn, FaSignOutAlt, FaFileAlt } from 'react-icons/fa';
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
    switch (user.role_name) {
      case 'Admin': return '/admin/dashboard';
      case 'Editor': return '/editor/dashboard';
      case 'Assistant Editor': return '/assistant-editor/dashboard';
      case 'Author': return '/user/dashboard';
      default: return '/user/dashboard';
    }
  };
  const dashPrefix = getDashboardPrefix();

  const [brand, setBrand] = useState({
    journal_title: 'OJS',
    admin_dash_bg_hex: '#2C2C2C', // Default Sidebar
    admin_dash_accent_hex: '#8E7C68' // Default Accent
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

  // Helper styles based on branding
  const sidebarStyle = { backgroundColor: brand.admin_dash_bg_hex };
  const accentColor = brand.admin_dash_accent_hex;

  // We can inject a quick style tag to handle hover states for links if needed,
  // or just use inline style for simple elements. 
  // Let's use CSS variables on the wrapping div.
  return (
    <div 
      className="min-h-screen flex bg-[#F9F6F0] font-sans relative"
      style={{
        '--brand-sidebar-bg': brand.admin_dash_bg_hex,
        '--brand-accent': brand.admin_dash_accent_hex
      }}
    >
      <style>{`
        .brand-sidebar { background-color: var(--brand-sidebar-bg) !important; }
        .brand-link:hover { color: #F9F6F0 !important; background-color: rgba(255,255,255,0.1) !important; }
        .brand-link.active { background-color: #FAF9F6 !important; color: #2C2C2C !important; }
        .brand-text-accent { color: var(--brand-accent) !important; }
      `}</style>
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 text-[#F9F6F0] flex flex-col shadow-2xl transition-transform duration-300 md:relative md:translate-x-0 brand-sidebar ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-center border-b border-white/10">
          <Link to="/" className="text-3xl font-bold tracking-tight uppercase hover:opacity-80 transition-opacity duration-300">
            {brand.journal_title.substring(0, 15)}
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-3 overflow-y-auto">
          <Link to={dashPrefix} className="flex items-center px-4 py-3 bg-[#FAF9F6] text-[#2C2C2C] font-bold rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
            <FaHome className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link to={`${dashPrefix}/profile`} className="brand-link flex items-center px-4 py-3 text-[#A89F91] font-semibold rounded-lg transition-all duration-300">
            <FaUser className="w-5 h-5 mr-3" />
            My Profile
          </Link>
          
          {isAdmin && (
            <>
              <div className="pt-4 pb-2">
                <p className="px-4 text-xs font-bold brand-text-accent uppercase tracking-wider">--- CONTENT MANAGEMENT ---</p>
              </div>
              
              <Link to="/admin/dashboard/submissions" className="brand-link flex items-center px-4 py-3 text-[#A89F91] font-semibold rounded-lg transition-all duration-300">
                <FaFileAlt className="w-5 h-5 mr-3" />
                Paper Submissions
              </Link>

              <div className="pt-4 pb-2">
                <p className="px-4 text-xs font-bold brand-text-accent uppercase tracking-wider">--- SYSTEM MANAGEMENT ---</p>
              </div>
              
              <Link to="/admin/dashboard/users" className="brand-link flex items-center px-4 py-3 text-[#A89F91] font-semibold rounded-lg transition-all duration-300">
                <FaUsers className="w-5 h-5 mr-3" />
                User Management
              </Link>
              <Link to="/admin/dashboard/settings" className="brand-link flex items-center px-4 py-3 text-[#A89F91] font-semibold rounded-lg transition-all duration-300">
                <FaCog className="w-5 h-5 mr-3" />
                System Settings
              </Link>
              <Link to="/admin/dashboard/branding" className="brand-link flex items-center px-4 py-3 text-[#A89F91] font-semibold rounded-lg transition-all duration-300">
                <FaPaintBrush className="w-5 h-5 mr-3" />
                Branding & UI
              </Link>
              <Link to="/admin/dashboard/audit-logs" className="brand-link flex items-center px-4 py-3 text-[#A89F91] font-semibold rounded-lg transition-all duration-300">
                <FaClipboardList className="w-5 h-5 mr-3" />
                Audit Logs
              </Link>
              <Link to="/admin/dashboard/announcements" className="brand-link flex items-center px-4 py-3 text-[#A89F91] font-semibold rounded-lg transition-all duration-300">
                <FaBullhorn className="w-5 h-5 mr-3" />
                Announcements
              </Link>
            </>
          )}
        </nav>
        
        <div className="p-4 border-t border-white/10 mt-auto">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-[#A89F91] hover:text-[#F9F6F0] hover:bg-white/10 rounded-lg transition-all duration-300 font-bold group">
            <FaSignOutAlt className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform duration-300" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-[0_4px_24px_-4px_rgba(44,44,44,0.05)] border-b border-[#E5E0D8] h-20 flex items-center justify-between px-4 sm:px-8 shrink-0 z-10 transition-all duration-300">
          <div className="flex items-center">
            <button 
              className="md:hidden mr-4 p-2 text-[#2C2C2C] hover:bg-black/5 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <h1 className="text-xl sm:text-[1.6rem] font-bold text-[#2C2C2C] tracking-tight truncate max-w-[200px] sm:max-w-none">{title}</h1>
          </div>
          <div className="flex items-center space-x-5">
            <div className="text-right hidden sm:block">
               <p className="text-sm font-bold text-[#2C2C2C]">{user.display_name || 'System Admin'}</p>
               <p className="text-xs font-semibold brand-text-accent">{user.email || 'admin@ojs.local'}</p>
            </div>
            {user.avatar_url ? (
              <img 
                src={resolveImageUrl(user.avatar_url)} 
                alt="Profile" 
                onClick={() => navigate(`${dashPrefix}/profile`)}
                className="w-12 h-12 rounded-full object-cover shadow-md border-2 border-white hover:scale-105 transition-transform cursor-pointer" 
              />
            ) : (
              <div 
                onClick={() => navigate(`${dashPrefix}/profile`)}
                className="w-12 h-12 rounded-full flex items-center justify-center text-[#F9F6F0] font-bold shadow-md border-2 border-white hover:scale-105 transition-transform cursor-pointer brand-sidebar"
              >
                {(user.display_name || 'SA').substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 relative z-0">
           {/* Subtle background decoration */}
           <div 
             className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.03] rounded-full blur-3xl -z-10 transform translate-x-1/3 -translate-y-1/3 pointer-events-none"
             style={{ backgroundColor: brand.admin_dash_accent_hex }}
           ></div>
           <Outlet />
        </div>
      </main>
      
    </div>
  );
};

export default DashboardLayout;
