import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#2C2C2C] tracking-tight">System Overview</h2>
          <p className="text-[#8E7C68] font-serif italic mt-1">Monitor journal activity and configurations</p>
        </div>
        <button className="px-6 py-2.5 bg-[#2C2C2C] hover:bg-[#1A1A1A] text-[#F9F6F0] rounded shadow hover:shadow-md transition-all duration-300 font-semibold tracking-wide text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          Quick Action
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-xl border border-[#E5E0D8] shadow-[0_4px_24px_-4px_rgba(44,44,44,0.05)] hover:-translate-y-1 hover:shadow-[0_8px_32px_-8px_rgba(44,44,44,0.1)] transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#F9F6F0] text-[#8E7C68] group-hover:bg-[#2C2C2C] group-hover:text-[#F9F6F0] rounded-xl flex items-center justify-center transition-colors duration-300">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">+12%</span>
          </div>
          <p className="text-[#8E7C68] text-sm font-semibold uppercase tracking-wider mb-1">Total Submissions</p>
          <p className="text-4xl font-bold text-[#2C2C2C]">1,248</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-xl border border-[#E5E0D8] shadow-[0_4px_24px_-4px_rgba(44,44,44,0.05)] hover:-translate-y-1 hover:shadow-[0_8px_32px_-8px_rgba(44,44,44,0.1)] transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#F9F6F0] text-[#8E7C68] group-hover:bg-[#2C2C2C] group-hover:text-[#F9F6F0] rounded-xl flex items-center justify-center transition-colors duration-300">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">+3</span>
          </div>
          <p className="text-[#8E7C68] text-sm font-semibold uppercase tracking-wider mb-1">Published Issues</p>
          <p className="text-4xl font-bold text-[#2C2C2C]">42</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-xl border border-[#E5E0D8] shadow-[0_4px_24px_-4px_rgba(44,44,44,0.05)] hover:-translate-y-1 hover:shadow-[0_8px_32px_-8px_rgba(44,44,44,0.1)] transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#F9F6F0] text-[#8E7C68] group-hover:bg-[#2C2C2C] group-hover:text-[#F9F6F0] rounded-xl flex items-center justify-center transition-colors duration-300">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </div>
            <span className="text-sm font-bold text-[#8E7C68] bg-[#F9F6F0] px-2.5 py-1 rounded-full">Active</span>
          </div>
          <p className="text-[#8E7C68] text-sm font-semibold uppercase tracking-wider mb-1">Active Editors</p>
          <p className="text-4xl font-bold text-[#2C2C2C]">15</p>
        </div>
      </div>

      {/* Activity Table */}
      <div className="bg-white rounded-xl shadow-[0_4px_24px_-4px_rgba(44,44,44,0.05)] border border-[#E5E0D8] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#E5E0D8] bg-[#FAF9F6] flex justify-between items-center">
          <h3 className="text-lg font-bold text-[#2C2C2C]">Recent System Activity</h3>
          <button className="text-[#8E7C68] hover:text-[#2C2C2C] text-sm font-bold transition-colors">View All &rarr;</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#E5E0D8]">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#8E7C68] uppercase tracking-wider">Event</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#8E7C68] uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#8E7C68] uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#8E7C68] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#E5E0D8]">
              <tr className="hover:bg-[#FAF9F6] transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3"></div>
                    <span className="text-sm font-bold text-[#2C2C2C]">New Brand Colors Set</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8E7C68] font-medium">System Admin</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8E7C68]">2 mins ago</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">Success</span>
                </td>
              </tr>
              <tr className="hover:bg-[#FAF9F6] transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3"></div>
                    <span className="text-sm font-bold text-[#2C2C2C]">Editor Role Assigned</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8E7C68] font-medium">System Admin</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8E7C68]">1 hr ago</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">Success</span>
                </td>
              </tr>
              <tr className="hover:bg-[#FAF9F6] transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                    <span className="text-sm font-bold text-[#2C2C2C]">Database Backup</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8E7C68] font-medium">System</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8E7C68]">1 day ago</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">Completed</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
