import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import { FaBook, FaLayerGroup, FaFileAlt, FaUsers, FaPlus } from 'react-icons/fa';
import Pagination from '../../components/Pagination';

const ITEMS_PER_PAGE = 5;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, articles: 0, issues: 0, volumes: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [submissionsPage, setSubmissionsPage] = useState(1);
  const [usersPage, setUsersPage] = useState(1);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [usersRes, articlesRes, issuesRes, volumesRes] = await Promise.all([
        apiFetch('/users').catch(() => ({ data: [] })),
        apiFetch('/articles').catch(() => ({ data: [] })),
        apiFetch('/issues').catch(() => ({ data: [] })),
        apiFetch('/volumes').catch(() => ({ data: [] }))
      ]);

      const usersData = usersRes.data || [];
      const articlesData = articlesRes.data || [];
      
      setStats({
        users: usersData.length,
        articles: articlesData.length,
        issues: (issuesRes.data || []).length,
        volumes: (volumesRes.data || []).length
      });

      setRecentUsers(usersData);
      setRecentSubmissions(articlesData);

    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const submissionsTotalPages = Math.ceil(recentSubmissions.length / ITEMS_PER_PAGE);
  const paginatedSubmissions = recentSubmissions.slice((submissionsPage - 1) * ITEMS_PER_PAGE, submissionsPage * ITEMS_PER_PAGE);

  const usersTotalPages = Math.ceil(recentUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = recentUsers.slice((usersPage - 1) * ITEMS_PER_PAGE, usersPage * ITEMS_PER_PAGE);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Overview</h2>
          <p className="text-slate-500 text-xs mt-1">Live data streams from the journal database.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/admin/dashboard/submissions')}
            className="px-4 py-2 bg-[#107C41] hover:bg-[#0E6E38] text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            All Papers
          </button>
          <button 
            onClick={() => navigate('/admin/dashboard/volumes-issues')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <FaPlus className="text-[10px]" />
            New Volume / Issue
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => navigate('/admin/dashboard/submissions')}
          className="bg-white p-4 rounded-xl border-2 border-slate-200 shadow-xs hover:border-emerald-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-emerald-50 text-emerald-700 rounded-lg flex items-center justify-center border border-emerald-200">
               <FaFileAlt className="text-sm" />
            </div>
          </div>
          <p className="text-slate-500 text-[11px] font-mono font-bold uppercase tracking-wider">Total Papers</p>
          <p className="text-2xl font-bold font-mono text-slate-900">{stats.articles}</p>
        </div>

        <div 
          onClick={() => navigate('/admin/dashboard/volumes-issues')}
          className="bg-white p-4 rounded-xl border-2 border-slate-200 shadow-xs hover:border-amber-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-amber-50 text-amber-700 rounded-lg flex items-center justify-center border border-amber-200">
               <FaBook className="text-sm" />
            </div>
          </div>
          <p className="text-slate-500 text-[11px] font-mono font-bold uppercase tracking-wider">Volumes</p>
          <p className="text-2xl font-bold font-mono text-slate-900">{stats.volumes}</p>
        </div>

        <div 
          onClick={() => navigate('/admin/dashboard/volumes-issues')}
          className="bg-white p-4 rounded-xl border-2 border-slate-200 shadow-xs hover:border-purple-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-purple-50 text-purple-700 rounded-lg flex items-center justify-center border border-purple-200">
               <FaLayerGroup className="text-sm" />
            </div>
          </div>
          <p className="text-slate-500 text-[11px] font-mono font-bold uppercase tracking-wider">Issues</p>
          <p className="text-2xl font-bold font-mono text-slate-900">{stats.issues}</p>
        </div>

        <div 
          onClick={() => navigate('/admin/dashboard/users')}
          className="bg-white p-4 rounded-xl border-2 border-slate-200 shadow-xs hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-blue-50 text-blue-700 rounded-lg flex items-center justify-center border border-blue-200">
               <FaUsers className="text-sm" />
            </div>
          </div>
          <p className="text-slate-500 text-[11px] font-mono font-bold uppercase tracking-wider">Total Users</p>
          <p className="text-2xl font-bold font-mono text-slate-900">{stats.users}</p>
        </div>
      </div>

      {/* Data Tables Section */}
      <div className="space-y-6">
        {/* Submissions Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900">Recent Submissions</h3>
            <button onClick={() => navigate('/admin/dashboard/submissions')} className="text-xs font-bold text-[#107C41] hover:underline">View All</button>
          </div>
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-sm">Loading...</div>
          ) : recentSubmissions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No submissions found.</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-bold text-slate-600 uppercase tracking-wider">ID</th>
                      <th className="px-4 py-3 font-bold text-slate-600 uppercase tracking-wider">Title</th>
                      <th className="px-4 py-3 font-bold text-slate-600 uppercase tracking-wider">Author</th>
                      <th className="px-4 py-3 font-bold text-slate-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedSubmissions.map(art => (
                      <tr key={art.article_id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-mono font-bold text-slate-700">#{art.article_id}</td>
                        <td className="px-4 py-3 font-bold text-slate-900 truncate max-w-xs">{art.title}</td>
                        <td className="px-4 py-3 text-slate-700">{art.author_name || art.author_user_id}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${
                            art.status === 'published' ? 'bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]' :
                            art.status === 'under_review' || art.status === 'in_review' ? 'bg-[#E8F0FE] text-[#1A73E8] border-[#D2E3FC]' :
                            'bg-[#F1F3F4] text-[#3C4043] border-[#DADCE0]'
                          }`}>
                            {String(art.status || '').toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={submissionsPage}
                totalPages={submissionsTotalPages}
                onPageChange={setSubmissionsPage}
                itemsPerPage={ITEMS_PER_PAGE}
                totalItems={recentSubmissions.length}
              />
            </>
          )}
        </div>

        {/* User Accounts Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900">User Accounts</h3>
            <button onClick={() => navigate('/admin/dashboard/users')} className="text-xs font-bold text-[#107C41] hover:underline">View All</button>
          </div>
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-sm">Loading...</div>
          ) : recentUsers.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No users found.</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-bold text-slate-600 uppercase tracking-wider">ID</th>
                      <th className="px-4 py-3 font-bold text-slate-600 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 font-bold text-slate-600 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 font-bold text-slate-600 uppercase tracking-wider">Role</th>
                      <th className="px-4 py-3 font-bold text-slate-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedUsers.map(u => (
                      <tr key={u.user_id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-mono font-bold text-slate-700">#{u.user_id}</td>
                        <td className="px-4 py-3 font-bold text-slate-900">{u.display_name}</td>
                        <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">{u.email}</td>
                        <td className="px-4 py-3 font-mono text-[10px] uppercase font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300 inline-block">{u.role_name || u.role_id}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${u.account_status === 'active' ? 'bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]' : 'bg-[#FCE8E6] text-[#C5221F] border-[#FAD2CF]'}`}>
                            {String(u.account_status || '').toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={usersPage}
                totalPages={usersTotalPages}
                onPageChange={setUsersPage}
                itemsPerPage={ITEMS_PER_PAGE}
                totalItems={recentUsers.length}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
