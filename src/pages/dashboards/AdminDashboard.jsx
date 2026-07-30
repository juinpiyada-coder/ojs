import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, articles: 0, issues: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, articlesRes, issuesRes] = await Promise.all([
          apiFetch('/users').catch(() => ({ data: [] })),
          apiFetch('/articles').catch(() => ({ data: [] })),
          apiFetch('/issues').catch(() => ({ data: [] }))
        ]);

        const usersData = usersRes.data || [];
        
        setStats({
          users: usersData.length,
          articles: (articlesRes.data || []).length,
          issues: (issuesRes.data || []).length
        });

        // Get the latest 4 users
        setRecentUsers(usersData.slice(0, 4));
        
        // Get the latest 5 submissions
        setRecentSubmissions((articlesRes.data || []).slice(0, 5));

      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-3xl shadow-sm border border-[#E5E0D8] relative overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#8E7C68]/20 to-transparent rounded-full blur-3xl -z-0 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-20 w-48 h-48 bg-gradient-to-tr from-[#2C2C2C]/10 to-transparent rounded-full blur-2xl -z-0 transform -translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-[#2C2C2C] tracking-tight mb-2">Welcome Back, Admin! 👋</h2>
          <p className="text-[#8E7C68] font-medium text-lg">Here's what's happening with your journal system today.</p>
        </div>
        <div className="relative z-10 flex space-x-3">
          <button className="px-6 py-3 bg-[#FAF9F6] text-[#2C2C2C] border border-[#E5E0D8] rounded-xl font-bold hover:bg-white hover:shadow-md transition-all">
            View Analytics
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-[#2C2C2C] to-[#1A1A1A] text-white rounded-xl font-bold shadow-lg shadow-[#2C2C2C]/20 hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            Publish Issue
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Submissions Card */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group cursor-pointer relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex items-center justify-between mb-6 relative">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner">
               <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-3 py-1.5 rounded-full backdrop-blur-sm">+12% this week</span>
          </div>
          <div className="relative">
            <p className="text-[#8E7C68] text-sm font-bold uppercase tracking-widest mb-2">Total Submissions</p>
            {loading ? (
              <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-5xl font-black text-[#2C2C2C] tracking-tighter">{stats.articles}</p>
            )}
          </div>
        </div>

        {/* Users Card */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group cursor-pointer relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex items-center justify-between mb-6 relative">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner">
               <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-100/80 px-3 py-1.5 rounded-full backdrop-blur-sm">Active</span>
          </div>
          <div className="relative">
            <p className="text-[#8E7C68] text-sm font-bold uppercase tracking-widest mb-2">Registered Users</p>
            {loading ? (
              <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-5xl font-black text-[#2C2C2C] tracking-tighter">{stats.users}</p>
            )}
          </div>
        </div>

        {/* Issues Card */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group cursor-pointer relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex items-center justify-between mb-6 relative">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner">
               <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-100/80 px-3 py-1.5 rounded-full backdrop-blur-sm">+1 Published</span>
          </div>
          <div className="relative">
            <p className="text-[#8E7C68] text-sm font-bold uppercase tracking-widest mb-2">Total Issues</p>
            {loading ? (
              <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-5xl font-black text-[#2C2C2C] tracking-tighter">{stats.issues}</p>
            )}
          </div>
        </div>
      </div>

      {/* Split Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content (2/3 width) - Recent Submissions Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E5E0D8] p-8 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#2C2C2C]">Recent Submissions</h3>
            <button className="px-4 py-2 text-sm font-bold text-[#8E7C68] bg-[#FAF9F6] rounded-lg hover:bg-[#E5E0D8] transition-colors">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF9F6] border-y border-[#E5E0D8] text-[#5C5446] text-sm">
                  <th className="py-4 px-4 font-bold uppercase tracking-wider">Paper Title</th>
                  <th className="py-4 px-4 font-bold uppercase tracking-wider">Submitted By</th>
                  <th className="py-4 px-4 font-bold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE1]">
                {loading ? (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-[#8E7C68]">Loading submissions...</td>
                  </tr>
                ) : recentSubmissions.length > 0 ? (
                  recentSubmissions.map(sub => (
                    <tr key={sub.article_id} className="hover:bg-[#FAF9F6] transition-colors">
                      <td className="py-4 px-4 max-w-[200px]">
                        <p className="text-[#2C2C2C] font-bold truncate">{sub.title}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-[#5C5446] font-medium">{sub.author_name}</p>
                        <p className="text-xs text-[#8E7C68]">{sub.author_email}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 text-[10px] rounded-full font-bold uppercase tracking-wider
                          ${sub.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 
                            sub.status === 'in_review' ? 'bg-blue-100 text-blue-800' : 
                            sub.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {sub.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-[#8E7C68]">No recent submissions.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Content (1/3 width) - Recent Users */}
        <div className="bg-[#2C2C2C] rounded-3xl shadow-xl border border-[#3A3A3A] p-8 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -z-0 transform translate-x-1/2 -translate-y-1/2"></div>
           
           <h3 className="text-xl font-bold mb-6 relative z-10">Recently Joined Users</h3>
           
           <div className="space-y-5 relative z-10">
             {loading ? (
               Array(4).fill(0).map((_, i) => (
                 <div key={i} className="flex items-center space-x-4 animate-pulse">
                   <div className="w-10 h-10 bg-white/10 rounded-full"></div>
                   <div className="flex-1">
                     <div className="h-4 bg-white/10 rounded w-1/2 mb-2"></div>
                     <div className="h-3 bg-white/10 rounded w-1/3"></div>
                   </div>
                 </div>
               ))
             ) : (
               recentUsers.map((user) => (
                 <div key={user.user_id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10">
                   <div className="flex items-center space-x-4">
                     <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#8E7C68] to-[#5C5446] flex items-center justify-center font-bold shadow-inner border border-white/20">
                       {user.display_name.charAt(0).toUpperCase()}
                     </div>
                     <div>
                       <p className="font-bold text-sm text-[#F9F6F0] line-clamp-1">{user.display_name}</p>
                       <p className="text-xs text-[#A89F91] line-clamp-1">{user.email}</p>
                     </div>
                   </div>
                   <div className="text-right pl-2">
                     <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold uppercase tracking-wider text-[#F9F6F0]">
                       {user.role_name || user.role_id}
                     </span>
                   </div>
                 </div>
               ))
             )}
             
             {!loading && recentUsers.length === 0 && (
               <p className="text-[#A89F91] text-sm text-center pt-4">No users found.</p>
             )}
           </div>

           <button className="w-full mt-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold transition-colors border border-white/10 text-sm">
             Manage All Users
           </button>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
