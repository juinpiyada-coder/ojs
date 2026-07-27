import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

const DashboardLayout = ({ title }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-[#F9F6F0] font-sans">
      
      {/* Sidebar - Soft Charcoal */}
      <aside className="w-64 bg-[#2C2C2C] text-[#F9F6F0] flex flex-col shadow-2xl z-20 transition-all duration-300">
        <div className="p-6 flex items-center justify-center border-b border-[#3A3A3A]">
          <Link to="/" className="text-3xl font-bold tracking-tight uppercase hover:text-[#8E7C68] transition-colors duration-300">
            OJS
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-3">
          <Link to="#" className="flex items-center px-4 py-3 bg-[#FAF9F6] text-[#2C2C2C] font-bold rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            Overview
          </Link>
          <Link to="#" className="flex items-center px-4 py-3 text-[#A89F91] hover:text-[#F9F6F0] hover:bg-[#3A3A3A] font-semibold rounded-lg transition-all duration-300">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Manuscripts
          </Link>
          <Link to="#" className="flex items-center px-4 py-3 text-[#A89F91] hover:text-[#F9F6F0] hover:bg-[#3A3A3A] font-semibold rounded-lg transition-all duration-300">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t border-[#3A3A3A] mt-auto">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-[#A89F91] hover:text-[#F9F6F0] hover:bg-[#3A3A3A] rounded-lg transition-all duration-300 font-bold group">
            <svg className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-[0_4px_24px_-4px_rgba(44,44,44,0.05)] border-b border-[#E5E0D8] h-20 flex items-center justify-between px-8 shrink-0 z-10 transition-all duration-300">
          <h1 className="text-[1.6rem] font-bold text-[#2C2C2C] tracking-tight">{title}</h1>
          <div className="flex items-center space-x-5">
            <div className="text-right hidden sm:block">
               <p className="text-sm font-bold text-[#2C2C2C]">System Admin</p>
               <p className="text-xs font-semibold text-[#8E7C68]">admin@ojs.local</p>
            </div>
            <div className="w-12 h-12 bg-[#2C2C2C] rounded-full flex items-center justify-center text-[#F9F6F0] font-bold shadow-md border-2 border-white hover:scale-105 transition-transform cursor-pointer">
              SA
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-8 relative z-0">
           {/* Subtle background decoration */}
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#8E7C68] opacity-[0.03] rounded-full blur-3xl -z-10 transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
           <Outlet />
        </div>
      </main>
      
    </div>
  );
};

export default DashboardLayout;
