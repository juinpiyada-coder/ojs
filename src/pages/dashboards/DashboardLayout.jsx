import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaUser, 
  FaUsers, 
  FaCog, 
  FaPaintBrush, 
  FaClipboardList, 
  FaBullhorn, 
  FaSignOutAlt, 
  FaFileAlt, 
  FaLayerGroup, 
  FaArchive,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { apiFetch, resolveImageUrl } from '../../utils/api';

const DashboardLayout = ({ title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || {});
  const isAdmin = (user.role_name || '').toLowerCase() === 'admin';
  
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

  const [brand, setBrand] = useState(() => {
    try {
      const saved = localStorage.getItem('ojs_white_label');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      journal_title: 'The Literary Scientist',
      admin_dash_bg_hex: '#FFFFFF',
      admin_dash_accent_hex: '#1E2530'
    };
  });

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const res = await apiFetch('/branding');
        if (res.data && res.data.length > 0) {
          setBrand(res.data[0]);
          localStorage.setItem('ojs_white_label', JSON.stringify(res.data[0]));
        }
      } catch (err) {
        console.error('Failed to fetch branding context', err);
      }
    };
    fetchBranding();

    const handleBrandEvent = (e) => {
      if (e.detail) {
        setBrand(e.detail);
      } else {
        fetchBranding();
      }
    };
    window.addEventListener('brand-updated', handleBrandEvent);
    return () => window.removeEventListener('brand-updated', handleBrandEvent);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Helper to accurately determine active tab state
  const isLinkActive = (toPath) => {
    // Exact match for the root dashboard:
    if (toPath === dashPrefix) {
      return location.pathname === dashPrefix || location.pathname === `${dashPrefix}/`;
    }
    // Sub-route match
    return location.pathname === toPath || location.pathname.startsWith(`${toPath}/`);
  };

  const renderNavItem = (to, Icon, label) => {
    const active = isLinkActive(to);
    return (
      <Link
        to={to}
        onClick={() => setIsMobileMenuOpen(false)}
        className={`flex items-center px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
          active
            ? 'bg-[#1E2530] text-white shadow-xs font-bold'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
      >
        <Icon className={`w-4 h-4 mr-3 transition-colors ${active ? 'text-[#D4AF37]' : 'text-slate-400 group-hover:text-slate-600'}`} />
        <span className="truncate">{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans relative">
      
      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-xs"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} shadow-xs`}>
        
        {/* Brand Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100 bg-[#FAF9F6]">
          <Link to="/" className="text-sm font-bold tracking-tight text-slate-900 hover:opacity-80 transition-opacity flex items-center gap-2.5">
            {brand.logo_url ? (
              <img src={resolveFileUrl(brand.logo_url)} alt="Logo" className="h-6 w-auto object-contain rounded" />
            ) : (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            )}
            <span className="truncate">{brand.journal_title || 'Open Journal System'}</span>
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-600 p-1"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>
        
        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {renderNavItem(dashPrefix, FaHome, 'Dashboard')}
          {renderNavItem(`${dashPrefix}/profile`, FaUser, 'My Profile')}
          
          {isAdmin && (
            <>
              <div className="pt-4 pb-1.5 px-3">
                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Content Management</p>
              </div>
              
              {renderNavItem('/admin/dashboard/volumes-issues', FaLayerGroup, 'Volumes & Issues')}
              {renderNavItem('/admin/dashboard/archives', FaArchive, 'Archives')}
              {renderNavItem('/admin/dashboard/submissions', FaFileAlt, 'Submissions')}

              <div className="pt-4 pb-1.5 px-3">
                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">System Administration</p>
              </div>
              
              {renderNavItem('/admin/dashboard/users', FaUsers, 'Users')}
              {renderNavItem('/admin/dashboard/settings', FaCog, 'Settings')}
              {renderNavItem('/admin/dashboard/branding', FaPaintBrush, 'Branding')}
              {renderNavItem('/admin/dashboard/audit-logs', FaClipboardList, 'Audit Logs')}
              {renderNavItem('/admin/dashboard/announcements', FaBullhorn, 'Announcements')}
            </>
          )}
        </nav>
        
        {/* Logout Footer */}
        <div className="p-3 border-t border-slate-100 bg-[#FAF9F6]">
          <button 
            onClick={handleLogout} 
            className="flex items-center w-full px-3.5 py-2.5 text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all duration-150 font-semibold text-xs group cursor-pointer"
          >
            <FaSignOutAlt className="w-4 h-4 mr-3 group-hover:-translate-x-0.5 transition-transform duration-150 text-slate-400 group-hover:text-rose-600" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-8 shrink-0 z-10 shadow-2xs">
          <div className="flex items-center">
            <button 
              className="md:hidden mr-3 p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <FaBars className="w-4 h-4" />
            </button>
            <h1 className="text-base font-bold text-slate-900 tracking-tight truncate max-w-[200px] sm:max-w-none">{title}</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900">{user.display_name || user.email?.split('@')[0] || 'User'}</p>
              <p className="text-[10px] text-slate-400 font-mono uppercase">{user.role_name || 'Admin'}</p>
            </div>
            
            {user.avatar_url ? (
              <img 
                src={resolveImageUrl(user.avatar_url)} 
                alt="Profile" 
                onClick={() => navigate(`${dashPrefix}/profile`)}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200 hover:ring-[#1E2530] transition-all cursor-pointer shadow-xs" 
              />
            ) : (
              <div 
                onClick={() => navigate(`${dashPrefix}/profile`)}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-[#1E2530] text-[#FAF7F2] text-xs font-bold ring-2 ring-slate-200 hover:ring-[#1E2530] transition-all cursor-pointer shadow-xs"
              >
                {(user.display_name || user.email || 'A').substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        </header>

        {/* Page Body */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 relative bg-slate-50/70">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
