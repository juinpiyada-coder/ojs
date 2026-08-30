import React, { useState, useEffect, useMemo } from 'react';
import { apiFetch } from '../../../utils/api';
import { toast } from 'react-toastify';
import { 
  FaUserTie, 
  FaUserPlus, 
  FaEdit, 
  FaTrash, 
  FaBookOpen, 
  FaSearch, 
  FaFilter, 
  FaExchangeAlt, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock, 
  FaEnvelope, 
  FaUserShield,
  FaFileAlt,
  FaExternalLinkAlt
} from 'react-icons/fa';
import Pagination from '../../../components/Pagination';

const ITEMS_PER_PAGE = 8;

const EditorManagement = () => {
  const [editors, setEditors] = useState([]);
  const [articles, setArticles] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  // Editor Add / Edit Modal
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editorFormData, setEditorFormData] = useState({
    user_id: '',
    display_name: '',
    email: '',
    password: '',
    role_id: '',
    account_status: 'active'
  });
  const [formLoading, setFormLoading] = useState(false);

  // Workload / Assigned Articles Modal
  const [selectedEditor, setSelectedEditor] = useState(null);
  const [showWorkloadModal, setShowWorkloadModal] = useState(false);

  // Reassign Article Modal
  const [reassigningArticle, setReassigningArticle] = useState(null);
  const [targetEditorId, setTargetEditorId] = useState('');
  const [reassignLoading, setReassignLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, rolesRes, articlesRes] = await Promise.all([
        apiFetch('/users'),
        apiFetch('/roles'),
        apiFetch('/articles')
      ]);

      const allUsers = usersRes.data || [];
      const allRoles = rolesRes.data || [];
      const allArticles = articlesRes.data || [];

      // Filter users who are in editorial roles
      const editorList = allUsers.filter(u => {
        const rName = (u.role_name || '').toLowerCase();
        return rName.includes('editor') || rName.includes('admin');
      });

      setEditors(editorList);
      setRoles(allRoles.filter(r => {
        const rName = (r.role_name || '').toLowerCase();
        return rName.includes('editor') || rName.includes('admin');
      }));
      setArticles(allArticles);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load editorial team');
      setLoading(false);
    }
  };

  // Compute stats per editor
  const editorStats = useMemo(() => {
    const map = {};
    editors.forEach(ed => {
      const assigned = articles.filter(a => String(a.assigned_editor_id) === String(ed.user_id));
      const active = assigned.filter(a => ['submitted', 'under_review', 'copyediting'].includes(a.status));
      const completed = assigned.filter(a => ['published', 'accepted', 'rejected'].includes(a.status));
      
      map[ed.user_id] = {
        total: assigned.length,
        active: active.length,
        completed: completed.length,
        articles: assigned
      };
    });
    return map;
  }, [editors, articles]);

  // Filtered editors
  const filteredEditors = useMemo(() => {
    return editors.filter(ed => {
      const matchesSearch = 
        ed.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ed.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const rName = (ed.role_name || '').toLowerCase();
      const matchesRole = 
        roleFilter === 'ALL' ? true :
        roleFilter === 'Editor' ? (rName === 'editor') :
        roleFilter === 'Assistant Editor' ? (rName.includes('assistant')) :
        roleFilter === 'Admin' ? (rName.includes('admin')) : true;

      const matchesStatus = 
        statusFilter === 'ALL' ? true :
        (ed.account_status || 'active').toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [editors, searchTerm, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredEditors.length / ITEMS_PER_PAGE) || 1;
  const paginatedEditors = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEditors.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredEditors, currentPage]);

  const openEditorModal = (editor = null) => {
    if (editor) {
      setIsEditing(true);
      setEditorFormData({
        user_id: editor.user_id,
        display_name: editor.display_name,
        email: editor.email,
        password: '',
        role_id: editor.role_id,
        account_status: editor.account_status || 'active'
      });
    } else {
      setIsEditing(false);
      // Default to Editor role
      const editorRole = roles.find(r => r.role_name.toLowerCase() === 'editor') || roles[0];
      setEditorFormData({
        user_id: '',
        display_name: '',
        email: '',
        password: '',
        role_id: editorRole ? editorRole.role_id : '',
        account_status: 'active'
      });
    }
    setShowEditorModal(true);
  };

  const handleEditorSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (isEditing) {
        const payload = { ...editorFormData };
        if (!payload.password) delete payload.password;
        await apiFetch(`/users?id=${editorFormData.user_id}`, {
          method: 'PUT',
          body: payload
        });
        toast.success('Editor profile updated successfully!');
      } else {
        await apiFetch('/users', {
          method: 'POST',
          body: editorFormData
        });
        toast.success('New Editor account created successfully!');
      }
      setShowEditorModal(false);
      await fetchData();
    } catch (err) {
      toast.error(err.message || 'Error saving editor details');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteEditor = async (id, name) => {
    const assignedCount = editorStats[id]?.active || 0;
    if (assignedCount > 0) {
      toast.warning(`Warning: ${name} currently has ${assignedCount} active manuscript(s). Reassign them first if possible.`);
    }
    if (!window.confirm(`Are you sure you want to remove Editor "${name}"?`)) return;

    try {
      await apiFetch(`/users?id=${id}`, { method: 'DELETE' });
      toast.success('Editor account removed.');
      await fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete editor');
    }
  };

  const openWorkloadModal = (editor) => {
    setSelectedEditor(editor);
    setShowWorkloadModal(true);
  };

  const handleReassign = async (e) => {
    e.preventDefault();
    if (!reassigningArticle || !targetEditorId) return;
    setReassignLoading(true);
    try {
      await apiFetch(`/articles?id=${reassigningArticle.article_id}`, {
        method: 'PUT',
        body: { assigned_editor_id: targetEditorId }
      });
      toast.success('Manuscript reassigned successfully!');
      setReassigningArticle(null);
      await fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to reassign manuscript');
    } finally {
      setReassignLoading(false);
    }
  };

  const totalActiveManuscripts = useMemo(() => {
    return articles.filter(a => ['submitted', 'under_review', 'copyediting'].includes(a.status)).length;
  }, [articles]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
              <FaUserTie className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Managing Editor Dashboard</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Oversee all section editors, assign workloads, review active submissions, and manage editorial staff.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => openEditorModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#107C41] hover:bg-[#0E6E38] text-white text-xs font-semibold rounded-xl transition shadow-xs cursor-pointer shrink-0"
        >
          <FaUserPlus className="w-3.5 h-3.5" />
          <span>Add New Editor</span>
        </button>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Editorial Staff</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FaUserTie className="w-4 h-4" /></span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{editors.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Editors, Assistant Editors & Admin</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Workload</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg"><FaClock className="w-4 h-4" /></span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{totalActiveManuscripts}</p>
          <p className="text-[11px] text-amber-600 font-medium mt-0.5">Under review or copyediting</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Submissions</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><FaBookOpen className="w-4 h-4" /></span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{articles.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Across entire journal lifetime</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Editors</span>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-lg"><FaCheckCircle className="w-4 h-4" /></span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {editors.filter(e => e.account_status === 'active').length}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Ready to receive manuscript assignments</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search editors by name or email..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <FaFilter className="w-3 h-3 text-slate-400" />
            <span className="text-xs font-semibold text-slate-600">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-xs font-medium text-slate-700 outline-none cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="Editor">Editor</option>
              <option value="Assistant Editor">Assistant Editor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <span className="text-xs font-semibold text-slate-600">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-xs font-medium text-slate-700 outline-none cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Editors Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading editorial team...</span>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-rose-500 text-xs">{error}</div>
        ) : paginatedEditors.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            No editors found matching the current search filters.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600">
                  <tr>
                    <th className="px-5 py-3 font-semibold uppercase tracking-wider text-[11px]">Editor</th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px]">Role</th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px]">Status</th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px]">Active Queue</th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px]">Completed</th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px]">Total Assigned</th>
                    <th className="px-5 py-3 font-semibold uppercase tracking-wider text-[11px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedEditors.map(ed => {
                    const stats = editorStats[ed.user_id] || { active: 0, completed: 0, total: 0 };
                    return (
                      <tr key={ed.user_id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 shrink-0">
                              {ed.display_name?.charAt(0).toUpperCase() || 'E'}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">{ed.display_name}</div>
                              <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                                <FaEnvelope className="w-2.5 h-2.5 text-slate-400" />
                                {ed.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                            <FaUserShield className="w-2.5 h-2.5 text-slate-500" />
                            {ed.role_name || 'Editor'}
                          </span>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            ed.account_status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${ed.account_status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            {(ed.account_status || 'active').toUpperCase()}
                          </span>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className={`font-semibold px-2 py-0.5 rounded text-xs ${
                            stats.active > 0 ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'text-slate-400'
                          }`}>
                            {stats.active} active
                          </span>
                        </td>

                        <td className="px-4 py-3.5 font-medium text-slate-600">
                          {stats.completed}
                        </td>

                        <td className="px-4 py-3.5 font-bold text-slate-900 font-mono">
                          {stats.total}
                        </td>

                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openWorkloadModal(ed)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition cursor-pointer"
                              title="View assigned manuscripts"
                            >
                              <FaBookOpen className="w-3 h-3" />
                              <span>Workload ({stats.total})</span>
                            </button>

                            <button
                              onClick={() => openEditorModal(ed)}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-200 transition cursor-pointer"
                              title="Edit editor"
                            >
                              <FaEdit className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteEditor(ed.user_id, ed.display_name)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition cursor-pointer"
                              title="Remove editor"
                            >
                              <FaTrash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={filteredEditors.length}
            />
          </>
        )}
      </div>

      {/* Editor Add / Edit Modal */}
      {showEditorModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FaUserTie className="text-emerald-600" />
                {isEditing ? 'Edit Editor Profile' : 'Add New Editor Account'}
              </h3>
              <button 
                onClick={() => setShowEditorModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleEditorSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Dr. Jane Smith"
                  value={editorFormData.display_name}
                  onChange={(e) => setEditorFormData({ ...editorFormData, display_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  required
                  type="email"
                  placeholder="editor@journal.org"
                  value={editorFormData.email}
                  onChange={(e) => setEditorFormData({ ...editorFormData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isEditing ? 'Password (leave blank to keep current)' : 'Password *'}
                </label>
                <input
                  required={!isEditing}
                  type="password"
                  placeholder="••••••••"
                  value={editorFormData.password}
                  onChange={(e) => setEditorFormData({ ...editorFormData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Role *</label>
                  <select
                    required
                    value={editorFormData.role_id}
                    onChange={(e) => setEditorFormData({ ...editorFormData, role_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none bg-white"
                  >
                    <option value="">Select Role</option>
                    {roles.map(r => (
                      <option key={r.role_id} value={r.role_id}>{r.role_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Account Status</label>
                  <select
                    value={editorFormData.account_status}
                    onChange={(e) => setEditorFormData({ ...editorFormData, account_status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditorModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 bg-[#107C41] hover:bg-[#0E6E38] text-white rounded-lg text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                >
                  {formLoading ? 'Saving...' : isEditing ? 'Update Editor' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Editor Workload & Assigned Manuscripts Modal */}
      {showWorkloadModal && selectedEditor && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FaBookOpen className="text-emerald-600" />
                  Assigned Manuscripts: {selectedEditor.display_name}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {selectedEditor.email} • {editorStats[selectedEditor.user_id]?.active || 0} active, {editorStats[selectedEditor.user_id]?.completed || 0} completed
                </p>
              </div>
              <button 
                onClick={() => setShowWorkloadModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-3">
              {(!editorStats[selectedEditor.user_id]?.articles || editorStats[selectedEditor.user_id].articles.length === 0) ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No manuscripts currently assigned to this editor.
                </div>
              ) : (
                editorStats[selectedEditor.user_id].articles.map(art => (
                  <div key={art.article_id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-slate-500">#{art.article_id}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          art.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          art.status === 'under_review' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          art.status === 'copyediting' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          art.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {art.status.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{art.title}</h4>
                      <p className="text-[11px] text-slate-500">Author: {art.author_name || 'Anonymous'}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setReassigningArticle(art);
                          setTargetEditorId('');
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                      >
                        <FaExchangeAlt className="w-3 h-3 text-slate-400" />
                        <span>Reassign</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                onClick={() => setShowWorkloadModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reassign Manuscript Modal */}
      {reassigningArticle && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FaExchangeAlt className="text-emerald-600" />
                Reassign Manuscript #{reassigningArticle.article_id}
              </h3>
              <button 
                onClick={() => setReassigningArticle(null)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleReassign} className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <p className="font-semibold text-slate-800 line-clamp-2">{reassigningArticle.title}</p>
                <p className="text-[11px] text-slate-500 mt-1">Status: {reassigningArticle.status}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Select New Assigned Editor *</label>
                <select
                  required
                  value={targetEditorId}
                  onChange={(e) => setTargetEditorId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none bg-white"
                >
                  <option value="">-- Choose Editor --</option>
                  {editors.map(ed => (
                    <option key={ed.user_id} value={ed.user_id}>
                      {ed.display_name} ({ed.role_name || 'Editor'}) - {editorStats[ed.user_id]?.active || 0} active manuscripts
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReassigningArticle(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reassignLoading || !targetEditorId}
                  className="px-4 py-2 bg-[#107C41] hover:bg-[#0E6E38] text-white rounded-lg text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                >
                  {reassignLoading ? 'Reassigning...' : 'Confirm Reassignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default EditorManagement;
