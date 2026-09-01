import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch, resolveFileUrl } from '../../../utils/api';
import { toast } from 'react-toastify';
import {
  FaBookOpen,
  FaFilePdf,
  FaUserEdit,
  FaCheckCircle,
  FaSearch,
  FaTimes,
  FaEdit,
  FaUserCheck,
  FaLayerGroup,
  FaUpload,
  FaClipboardList,
  FaShieldAlt,
  FaHistory,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserShield,
  FaFilter,
  FaSquareRootAlt,
  FaExternalLinkAlt,
  FaDownload,
  FaUserSecret,
  FaUsers,
  FaCogs,
  FaPalette,
  FaBullhorn,
  FaArchive
} from 'react-icons/fa';
import LatexEditorModal from '../../../components/LatexEditorModal';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const [articles, setArticles] = useState([]);
  const [users, setUsers] = useState([]);
  const [volumes, setVolumes] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [activeLatexArticle, setActiveLatexArticle] = useState(null);
  const [viewingDoc, setViewingDoc] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [artRes, usersRes, volRes, issRes] = await Promise.all([
        apiFetch('/articles'),
        apiFetch('/users'),
        apiFetch('/volumes?with_issues=true'),
        apiFetch('/issues')
      ]);

      setArticles(artRes.data || []);
      setUsers(usersRes.data || []);
      setVolumes(volRes.data || []);
      setIssues(issRes.data || []);
    } catch (err) {
      console.error('Failed to fetch admin overview data:', err);
      toast.error('Failed to load system overview');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalManuscripts = articles.length;
  const publishedCount = articles.filter(a => a.status === 'published' || a.status === 'accepted').length;
  const inReviewCount = articles.filter(a => ['under_review', 'in_review'].includes(a.status)).length;
  const submittedCount = articles.filter(a => a.status === 'submitted').length;
  const totalUsers = users.length;
  const totalVolumes = volumes.length;

  const filteredArticles = articles.filter(art => {
    const matchesSearch = 
      art.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.author_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.keywords?.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'REVIEW') return matchesSearch && ['under_review', 'in_review'].includes(art.status);
    return matchesSearch && art.status === statusFilter;
  });

  return (
    <div className="space-y-8">
      
      {/* Super Admin Executive Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
                Super Admin Master Console
              </span>
              <span className="text-xs text-slate-400 font-mono">System v2.4</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight font-sans">
              Welcome, {user.display_name || 'System Administrator'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Complete oversight of journal publishing workflows, peer-review pipelines, volumes & issues, user rosters, and white-label branding configurations.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/admin/dashboard/submissions"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <FaLayerGroup />
              <span>Editorial Queue</span>
            </Link>
            <Link
              to="/admin/dashboard/volumes-issues"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <FaBookOpen />
              <span>Volumes & Issues</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Papers</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalManuscripts}</p>
        </div>

        <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50 shadow-xs">
          <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Screening</p>
          <p className="text-2xl font-extrabold text-amber-900 mt-1">{submittedCount}</p>
        </div>

        <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50 shadow-xs">
          <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">In Review</p>
          <p className="text-2xl font-extrabold text-blue-900 mt-1">{inReviewCount}</p>
        </div>

        <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 shadow-xs">
          <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Published</p>
          <p className="text-2xl font-extrabold text-emerald-900 mt-1">{publishedCount}</p>
        </div>

        <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/50 shadow-xs">
          <p className="text-[11px] font-bold text-purple-800 uppercase tracking-wider">Users Roster</p>
          <p className="text-2xl font-extrabold text-purple-900 mt-1">{totalUsers}</p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 shadow-xs">
          <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Volumes</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalVolumes}</p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/dashboard/users"
          className="p-5 bg-white border border-slate-200 hover:border-slate-400 rounded-2xl transition-all shadow-xs hover:shadow-md flex items-center gap-4 group"
        >
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <FaUsers className="text-xl" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">User Management</h4>
            <p className="text-xs text-slate-500 mt-0.5">Rosters, roles, credentials</p>
          </div>
        </Link>

        <Link
          to="/admin/dashboard/branding"
          className="p-5 bg-white border border-slate-200 hover:border-slate-400 rounded-2xl transition-all shadow-xs hover:shadow-md flex items-center gap-4 group"
        >
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <FaPalette className="text-xl" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">White-Label Branding</h4>
            <p className="text-xs text-slate-500 mt-0.5">Logo, title, colors & UI</p>
          </div>
        </Link>

        <Link
          to="/admin/dashboard/settings"
          className="p-5 bg-white border border-slate-200 hover:border-slate-400 rounded-2xl transition-all shadow-xs hover:shadow-md flex items-center gap-4 group"
        >
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <FaCogs className="text-xl" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">System Settings</h4>
            <p className="text-xs text-slate-500 mt-0.5">ISSN, maintenance & rules</p>
          </div>
        </Link>

        <Link
          to="/admin/dashboard/announcements"
          className="p-5 bg-white border border-slate-200 hover:border-slate-400 rounded-2xl transition-all shadow-xs hover:shadow-md flex items-center gap-4 group"
        >
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <FaBullhorn className="text-xl" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Announcements</h4>
            <p className="text-xs text-slate-500 mt-0.5">Call for papers & notices</p>
          </div>
        </Link>
      </div>

      {/* Submissions Overview Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Master Manuscripts Queue</h3>
            <p className="text-xs text-slate-500">Live feed of all scholarly manuscripts across all stages</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder="Search manuscripts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
              />
            </div>
            <Link
              to="/admin/dashboard/submissions"
              className="px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 shrink-0"
            >
              View All Queue ↗
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <th className="py-3.5 px-5">ID & Title</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Target Volume & Issue</th>
                <th className="py-3.5 px-5">Date</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400 font-semibold">Loading manuscripts...</td>
                </tr>
              ) : filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">No manuscripts matching criteria.</td>
                </tr>
              ) : (
                filteredArticles.slice(0, 8).map(art => (
                  <tr key={art.article_id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5 max-w-xs">
                      <p className="font-bold text-slate-900 truncate">{art.title}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID #{art.article_id}</p>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                        art.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                        art.status === 'copyediting' ? 'bg-purple-100 text-purple-800' :
                        ['under_review', 'in_review'].includes(art.status) ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {art.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      {art.volume_number && art.issue_number ? (
                        <span className="font-semibold text-slate-700">
                          Vol {art.volume_number}, Issue {art.issue_number}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-slate-500">
                      {art.created_at ? new Date(art.created_at).toLocaleDateString() : ''}
                    </td>
                    <td className="py-3.5 px-5 text-right space-x-1.5 whitespace-nowrap">
                      <Link
                        to="/admin/dashboard/submissions"
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold"
                      >
                        Manage
                      </Link>
                      {art.manuscript_url && (
                        <a
                          href={resolveFileUrl(art.manuscript_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold hover:bg-rose-100"
                        >
                          PDF
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
