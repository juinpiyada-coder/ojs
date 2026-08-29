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
import { apiFetch, resolveFileUrl, resolveImageUrl } from '../../utils/api';
import { useBrand } from '../../context/BrandingContext';

const DashboardLayout = ({ title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { brand } = useBrand();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || {});
  const isAdmin = (user.role_name || '').toLowerCase() === 'admin';
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const stored = JSON.parse(localStorage.getItem('user')) || {};
        const targetId = stored.user_id;
        
        let freshUser = null;
        if (targetId) {
          try {
            const uRes = await apiFetch(`/users?id=${targetId}`);
            if (uRes && uRes.data) {
              freshUser = uRes.data;
            }
          } catch {}
        }
        
        if (!freshUser) {
          const res = await apiFetch('/profile');
          if (res && res.user_data) {
            freshUser = res.user_data;
          }
        }

        if (freshUser) {
          setUser(prev => ({ ...prev, ...freshUser }));
          localStorage.setItem('user', JSON.stringify({ ...stored, ...freshUser }));
        }
      } catch (err) {
        console.error('Failed to sync profile in DashboardLayout', err);
      }
    };
    fetchUserProfile();

    const handleUserUpdate = (e) => {
      if (e.detail) {
        setUser(prev => ({ ...prev, ...e.detail }));
      }
    };
    window.addEventListener('user-profile-updated', handleUserUpdate);
    return () => window.removeEventListener('user-profile-updated', handleUserUpdate);
  }, []);

  const getDashboardPrefix = () => {
    const roleStr = (user.role_name || '').toLowerCase();
    if (roleStr.includes('admin')) return '/admin/dashboard';
    if (roleStr.includes('editor') && !roleStr.includes('assistant')) return '/editor/dashboard';
    if (roleStr.includes('assistant') || roleStr.includes('sub_editor')) return '/assistant-editor/dashboard';
    if (roleStr.includes('reviewer')) return '/reviewer/dashboard';
    return '/user/dashboard';
  };
  const dashPrefix = getDashboardPrefix();

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

  const accentColor = brand?.admin_dash_accent_hex || '#107C41';
  const sidebarBg = brand?.admin_dash_bg_hex || '#FFFFFF';

  // Helper to compute optimal high-contrast text color (white or dark) for the accent background
  const getContrastColor = (hex) => {
    if (!hex || !hex.startsWith('#') || hex.length < 7) return '#FFFFFF';
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 160 ? '#1E2530' : '#FFFFFF';
  };

  const activeTextColor = getContrastColor(accentColor);

  const renderNavItem = (to, Icon, label) => {
    const active = isLinkActive(to);
    return (
      <Link
        to={to}
        onClick={() => setIsMobileMenuOpen(false)}
        style={active ? { backgroundColor: accentColor, color: activeTextColor } : {}}
        className={`flex items-center px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
          active
            ? 'shadow-xs font-bold'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
        }`}
      >
        <Icon 
          className="w-4 h-4 mr-3 transition-colors shrink-0" 
          style={active ? { color: activeTextColor } : { color: '#94A3B8' }}
        />
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
      <aside 
        style={{ backgroundColor: sidebarBg }}
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 flex flex-col transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} shadow-xs`}
      >
        
        {/* Brand Header */}
        <div 
          className="px-5 py-4.5 flex items-center justify-between border-b border-slate-100"
          style={{ backgroundColor: sidebarBg }}
        >
          <Link to="/" className="text-sm font-bold tracking-tight text-slate-900 hover:opacity-80 transition-opacity flex items-center gap-2.5 min-w-0">
            {brand?.logo_url ? (
              <img 
                src={resolveFileUrl(brand.logo_url)} 
                alt="Logo" 
                className="h-8 max-h-8 w-auto max-w-[130px] object-contain rounded shrink-0" 
              />
            ) : (
              <span 
                className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs" 
                style={{ backgroundColor: accentColor }}
              />
            )}
            <span className="truncate font-bold text-slate-900 text-sm tracking-tight" title={brand?.journal_title}>
              {brand?.journal_title || 'Open Journal System'}
            </span>
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
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

          {/* Editor & Assistant Editor Content Links */}
          {(userRole === 'editor' || userRole === 'assistant editor') && (
            <>
              <div className="pt-4 pb-1.5 px-3">
                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Editorial Workflows</p>
              </div>
              {renderNavItem(dashPrefix, FaFileAlt, 'Assigned Manuscripts')}
              {renderNavItem('/admin/dashboard/submissions', FaLayerGroup, 'All Submissions')}
              {renderNavItem('/archive', FaArchive, 'Published Archive')}
            </>
          )}
        </nav>
        
        {/* Logout Footer */}
        <div className="p-3 border-t border-slate-100" style={{ backgroundColor: sidebarBg }}>
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
            
            {(user.avatar_url || user.photoURL || user.photo_url) ? (
              <img 
                src={resolveImageUrl(user.avatar_url || user.photoURL || user.photo_url)} 
                alt={user.display_name || 'Profile'} 
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
