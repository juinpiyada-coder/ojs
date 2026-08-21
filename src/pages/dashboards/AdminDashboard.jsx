import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import { FaBook, FaLayerGroup, FaFileAlt, FaUsers, FaPlus, FaArrowRight, FaFileExcel } from 'react-icons/fa';
import ExcelDataSheet from '../../components/ExcelDataSheet';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, articles: 0, issues: 0, volumes: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const submissionColumns = [
    { key: 'article_id', label: 'ID', width: 'w-16', render: (v) => <span className="font-mono font-bold text-slate-700">#{v}</span> },
    { key: 'title', label: 'Paper Title', render: (v) => <span className="font-bold text-slate-900 truncate block max-w-xs">{v}</span> },
    { key: 'author_name', label: 'Author', render: (v, r) => <span className="text-slate-700">{v || r.author_user_id}</span> },
    { key: 'volume_number', label: 'Vol / Issue', render: (_, r) => r.volume_number && r.issue_number ? <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300">Vol {r.volume_number}, Iss {r.issue_number}</span> : <span className="text-slate-400 italic">Unassigned</span> },
    { key: 'status', label: 'Status', render: (v) => {
      const isPub = v === 'published';
      const isRev = v === 'in_review' || v === 'under_review';
      const isRej = v === 'rejected';
      return (
        <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${
          isPub ? 'bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]' :
          isRev ? 'bg-[#E8F0FE] text-[#1A73E8] border-[#D2E3FC]' :
          isRej ? 'bg-[#FCE8E6] text-[#C5221F] border-[#FAD2CF]' :
          'bg-[#F1F3F4] text-[#3C4043] border-[#DADCE0]'
        }`}>
          {String(v || '').toUpperCase()}
        </span>
      );
    }}
  ];

  const userColumns = [
    { key: 'user_id', label: 'UID', width: 'w-16', render: (v) => <span className="font-mono font-bold text-slate-700">#{v}</span> },
    { key: 'display_name', label: 'Name', render: (v) => <span className="font-bold text-slate-900">{v}</span> },
    { key: 'email', label: 'Email', render: (v) => <span className="text-slate-600 font-mono text-[11px]">{v}</span> },
    { key: 'role_name', label: 'Role', render: (v, r) => <span className="font-mono text-[10px] uppercase font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300">{v || r.role_id}</span> },
    { key: 'account_status', label: 'Status', render: (v) => <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${v === 'active' ? 'bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]' : 'bg-[#FCE8E6] text-[#C5221F] border-[#FAD2CF]'}`}>{String(v || '').toUpperCase()}</span> }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Overview & Database Sheets</h2>
            <span className="px-2 py-0.5 bg-[#107C41] text-white text-[10px] font-mono font-bold rounded flex items-center gap-1">
              <FaFileExcel /> EXCEL_SHEET_OUTPUT
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-1">Live data streams formatted in spreadsheet grid style with instant CSV export.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/admin/dashboard/submissions')}
            className="px-4 py-2 bg-[#107C41] hover:bg-[#0E6E38] text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <FaFileExcel /> All Papers Sheet
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
            <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">SHEET_A</span>
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
            <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">SHEET_B</span>
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
            <span className="text-[10px] font-mono font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">SHEET_C</span>
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
            <span className="text-[10px] font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">SHEET_D</span>
          </div>
          <p className="text-slate-500 text-[11px] font-mono font-bold uppercase tracking-wider">Total Users</p>
          <p className="text-2xl font-bold font-mono text-slate-900">{stats.users}</p>
        </div>
      </div>

      {/* Spreadsheet Grids Section */}
      <div className="space-y-6">
        {/* 1. Submissions Spreadsheet Grid */}
        <ExcelDataSheet
          sheetName="Submissions_Master"
          workbookName="OJS_Manuscripts_Master.xlsx"
          columns={submissionColumns}
          data={recentSubmissions}
          loading={loading}
          onRefresh={fetchDashboardData}
          formulaText={`=SUBMISSIONS_DB!A1:E${recentSubmissions.length} [STATUS=ALL]`}
          emptyMessage="No paper submissions found in database."
        />

        {/* 2. User Accounts Spreadsheet Grid */}
        <ExcelDataSheet
          sheetName="User_Accounts"
          workbookName="OJS_User_Accounts.xlsx"
          columns={userColumns}
          data={recentUsers}
          loading={loading}
          onRefresh={fetchDashboardData}
          formulaText={`=USERS_DB!A1:E${recentUsers.length} [ROLES=ALL]`}
          emptyMessage="No user accounts found in database."
        />
      </div>
    </div>
  );
};

export default AdminDashboard;

