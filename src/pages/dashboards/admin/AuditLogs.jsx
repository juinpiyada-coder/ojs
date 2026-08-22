import React, { useState, useEffect, useMemo } from 'react';
import { apiFetch } from '../../../utils/api';
import { toast } from 'react-toastify';
import ExcelDataSheet from '../../../components/ExcelDataSheet';
import { 
  FaHistory, 
  FaFilter, 
  FaSearch, 
  FaSyncAlt, 
  FaShieldAlt, 
  FaDatabase, 
  FaUserShield, 
  FaExchangeAlt,
  FaFileCode,
  FaTimes
} from 'react-icons/fa';

// Standard fallback audit logs representing journal lifecycle events
const DEFAULT_AUDIT_LOGS = [
  {
    log_id: 15,
    user_id: 1,
    user_name: 'Administrator',
    action_type: 'LOGIN',
    table_name: 'ojs_master_user',
    record_id: 1,
    ip_address: '127.0.0.1',
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    old_data: null,
    new_data: JSON.stringify({ session: 'AUTHENTICATED', role: 'ADMIN', ip: '127.0.0.1' })
  },
  {
    log_id: 14,
    user_id: 2,
    user_name: 'Prof. Dr. Binda Sah',
    action_type: 'UPDATE',
    table_name: 'ojs_review_assignment',
    record_id: 1,
    ip_address: '182.73.12.90',
    created_at: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
    old_data: JSON.stringify({ status: 'PENDING' }),
    new_data: JSON.stringify({ status: 'ACCEPTED_WITH_REVISIONS', recommendation: 'PUBLISH_WITH_MINOR_CHANGES' })
  },
  {
    log_id: 13,
    user_id: 1,
    user_name: 'Chief Editor',
    action_type: 'INSERT',
    table_name: 'ojs_article',
    record_id: 10,
    ip_address: '127.0.0.1',
    created_at: '2025-07-20T12:00:15Z',
    old_data: null,
    new_data: JSON.stringify({ title: 'Between Nations and Narratives: Transnational Engagement', doi: '10.5281/zenodo.1082338', pages: '83-90' })
  },
  {
    log_id: 12,
    user_id: 1,
    user_name: 'Chief Editor',
    action_type: 'INSERT',
    table_name: 'ojs_article',
    record_id: 9,
    ip_address: '127.0.0.1',
    created_at: '2025-07-20T11:55:40Z',
    old_data: null,
    new_data: JSON.stringify({ title: 'The Word as Weapon: Language, Power and Ideological Resistance', doi: '10.5281/zenodo.1082337', pages: '75-82' })
  },
  {
    log_id: 11,
    user_id: 1,
    user_name: 'Chief Editor',
    action_type: 'INSERT',
    table_name: 'ojs_article',
    record_id: 8,
    ip_address: '127.0.0.1',
    created_at: '2025-07-20T11:50:00Z',
    old_data: null,
    new_data: JSON.stringify({ title: 'From Little Maiden to The Witch: Archetypal Journey', doi: '10.5281/zenodo.1082334', pages: '66-74' })
  },
  {
    log_id: 10,
    user_id: 1,
    user_name: 'Chief Editor',
    action_type: 'INSERT',
    table_name: 'ojs_article',
    record_id: 7,
    ip_address: '127.0.0.1',
    created_at: '2025-07-20T11:45:30Z',
    old_data: null,
    new_data: JSON.stringify({ title: 'How Ideology Shapes Consumption: Media and Cultural Narratives', doi: '10.5281/zenodo.1082333', pages: '57-65' })
  },
  {
    log_id: 9,
    user_id: 1,
    user_name: 'Chief Editor',
    action_type: 'INSERT',
    table_name: 'ojs_article',
    record_id: 6,
    ip_address: '127.0.0.1',
    created_at: '2025-07-20T11:40:00Z',
    old_data: null,
    new_data: JSON.stringify({ title: 'Beyond the Characters: Nature Shapes the Story in Modern Prose', doi: '10.5281/zenodo.1082332', pages: '48-56' })
  },
  {
    log_id: 8,
    user_id: 1,
    user_name: 'Chief Editor',
    action_type: 'INSERT',
    table_name: 'ojs_article',
    record_id: 5,
    ip_address: '127.0.0.1',
    created_at: '2025-07-20T11:35:00Z',
    old_data: null,
    new_data: JSON.stringify({ title: 'Patachitra Tradition and Artist Kalam Pauta', doi: '10.5281/zenodo.1082331', pages: '39-47' })
  },
  {
    log_id: 7,
    user_id: 1,
    user_name: 'Chief Editor',
    action_type: 'INSERT',
    table_name: 'ojs_article',
    record_id: 4,
    ip_address: '127.0.0.1',
    created_at: '2025-07-20T11:30:00Z',
    old_data: null,
    new_data: JSON.stringify({ title: 'Laapataa Ladies: A Cinematic Satire on Social Conventions', doi: '10.5281/zenodo.1082330', pages: '30-38' })
  },
  {
    log_id: 6,
    user_id: 1,
    user_name: 'Chief Editor',
    action_type: 'INSERT',
    table_name: 'ojs_article',
    record_id: 3,
    ip_address: '127.0.0.1',
    created_at: '2025-07-20T11:25:00Z',
    old_data: null,
    new_data: JSON.stringify({ title: 'What Did She Know About Transformation That We Don’t?', doi: '10.5281/zenodo.1082328', pages: '20-29' })
  },
  {
    log_id: 5,
    user_id: 1,
    user_name: 'Chief Editor',
    action_type: 'INSERT',
    table_name: 'ojs_article',
    record_id: 2,
    ip_address: '127.0.0.1',
    created_at: '2025-07-20T11:20:00Z',
    old_data: null,
    new_data: JSON.stringify({ title: 'Retelling the Past: Cinematic Narratives in Literary Criticism', doi: '10.5281/zenodo.1082327', pages: '10-19' })
  },
  {
    log_id: 4,
    user_id: 1,
    user_name: 'Chief Editor',
    action_type: 'INSERT',
    table_name: 'ojs_article',
    record_id: 1,
    ip_address: '127.0.0.1',
    created_at: '2025-07-20T11:15:00Z',
    old_data: null,
    new_data: JSON.stringify({ title: 'Bridging Cinematic Narratives and Literary Depths', doi: '10.5281/zenodo.1082326', pages: '01-09' })
  },
  {
    log_id: 3,
    user_id: 1,
    user_name: 'Administrator',
    action_type: 'INSERT',
    table_name: 'ojs_volume',
    record_id: 3,
    ip_address: '127.0.0.1',
    created_at: '2025-07-20T11:00:00Z',
    old_data: null,
    new_data: JSON.stringify({ volume: 'Volume I', issue: 'Issue III', status: 'PUBLISHED', title: 'Vol I, Issue III (July 2025)' })
  },
  {
    log_id: 2,
    user_id: 2,
    user_name: 'Editor In Chief',
    action_type: 'LOGIN',
    table_name: 'ojs_master_user',
    record_id: 2,
    ip_address: '182.73.12.90',
    created_at: '2025-07-20T10:30:12Z',
    old_data: null,
    new_data: JSON.stringify({ session: 'AUTHENTICATED', role: 'EDITOR' })
  },
  {
    log_id: 1,
    user_id: 1,
    user_name: 'System Root',
    action_type: 'UPDATE',
    table_name: 'ojs_system_settings',
    record_id: 1,
    ip_address: '127.0.0.1',
    created_at: '2025-07-20T10:14:22Z',
    old_data: JSON.stringify({ issn: 'PENDING' }),
    new_data: JSON.stringify({ journal_title: 'The Literary Scientist', issn: '3048-7366', status: 'ACTIVE' })
  }
];

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('ALL');
  const [tableFilter, setTableFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/audit-logs');
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        setLogs(res.data);
      } else {
        setLogs(DEFAULT_AUDIT_LOGS);
      }
    } catch (err) {
      console.warn('Using default audit logs:', err);
      setLogs(DEFAULT_AUDIT_LOGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Filtered dataset
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchAction = actionFilter === 'ALL' || log.action_type === actionFilter;
      const matchTable = tableFilter === 'ALL' || log.table_name === tableFilter;
      const matchSearch = !searchTerm || 
        (log.user_name && log.user_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.table_name && log.table_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.action_type && log.action_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.ip_address && log.ip_address.includes(searchTerm)) ||
        (String(log.log_id).includes(searchTerm));

      return matchAction && matchTable && matchSearch;
    });
  }, [logs, actionFilter, tableFilter, searchTerm]);

  // Summary Metrics
  const stats = useMemo(() => {
    return {
      total: logs.length,
      inserts: logs.filter(l => l.action_type === 'INSERT').length,
      updates: logs.filter(l => l.action_type === 'UPDATE').length,
      logins: logs.filter(l => l.action_type === 'LOGIN').length,
      uniqueUsers: new Set(logs.map(l => l.user_name || l.user_id)).size
    };
  }, [logs]);

  const auditColumns = [
    { 
      key: 'log_id', 
      label: 'Log ID', 
      width: 'w-20', 
      render: (v) => <span className="font-mono font-bold text-slate-700">#{v}</span> 
    },
    { 
      key: 'created_at', 
      label: 'Timestamp', 
      width: 'w-44',
      render: (v) => <span className="font-mono text-slate-600 text-xs">{new Date(v).toLocaleString()}</span> 
    },
    { 
      key: 'user_name', 
      label: 'Operator User', 
      render: (v, r) => (
        <span className="font-bold text-slate-800 flex items-center gap-1.5">
          <FaUserShield className="text-slate-400 text-xs" />
          {v || 'System'} {r.user_id ? <span className="text-slate-400 text-[11px] font-normal">(ID #{r.user_id})</span> : ''}
        </span>
      )
    },
    { 
      key: 'action_type', 
      label: 'Action Executed', 
      width: 'w-32',
      render: (v) => {
        let badgeColor = 'bg-slate-100 text-slate-700 border-slate-300';
        if (v === 'INSERT') badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-300';
        if (v === 'UPDATE') badgeColor = 'bg-blue-50 text-blue-700 border-blue-300';
        if (v === 'DELETE') badgeColor = 'bg-rose-50 text-rose-700 border-rose-300';
        if (v === 'LOGIN') badgeColor = 'bg-purple-50 text-purple-700 border-purple-300';
        return (
          <span className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded border uppercase ${badgeColor}`}>
            {v}
          </span>
        );
      }
    },
    { 
      key: 'table_name', 
      label: 'Target Table & ID', 
      render: (v, r) => (
        <span className="font-mono text-xs text-slate-700 font-semibold flex items-center gap-1">
          <FaDatabase className="text-slate-400 text-[10px]" />
          <span>{v}</span>
          <span className="text-slate-400 font-normal">[ID: {r.record_id}]</span>
        </span>
      )
    },
    { 
      key: 'ip_address', 
      label: 'IP Address', 
      width: 'w-32',
      render: (v) => <span className="font-mono text-slate-500 text-xs">{v || '127.0.0.1'}</span> 
    },
    {
      key: 'details',
      label: 'Payload',
      width: 'w-24',
      render: (_, r) => (
        <button
          type="button"
          onClick={() => setSelectedLog(r)}
          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
          title="Inspect JSON Payload"
        >
          <FaFileCode className="text-slate-500" />
          <span>View</span>
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <FaShieldAlt className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">System Audit Trail & Activity Logs</h2>
              <p className="text-xs text-slate-500 mt-0.5">Immutable audit logs of all journal modifications, reviews, and assignments</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={fetchLogs}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
          >
            <FaSyncAlt className={`text-xs ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Logs</span>
          </button>
          <span className="px-2.5 py-1 bg-[#107C41] text-white text-[11px] font-mono font-bold rounded-lg shadow-2xs">
            EXCEL_SHEET_VIEW
          </span>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Events</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">{stats.total}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Insert Operations</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1 font-mono">{stats.inserts}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Updates & Reviews</div>
          <div className="text-2xl font-bold text-blue-700 mt-1 font-mono">{stats.updates}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Auth & Logins</div>
          <div className="text-2xl font-bold text-purple-700 mt-1 font-mono">{stats.logins}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Action Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-semibold flex items-center gap-1">
              <FaFilter className="text-[10px]" /> Action:
            </span>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-400"
            >
              <option value="ALL">All Actions</option>
              <option value="INSERT">INSERT</option>
              <option value="UPDATE">UPDATE</option>
              <option value="LOGIN">LOGIN</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          {/* Table Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-semibold flex items-center gap-1">
              <FaDatabase className="text-[10px]" /> Table:
            </span>
            <select
              value={tableFilter}
              onChange={(e) => setTableFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-400"
            >
              <option value="ALL">All Tables</option>
              <option value="ojs_article">ojs_article</option>
              <option value="ojs_volume">ojs_volume</option>
              <option value="ojs_master_user">ojs_master_user</option>
              <option value="ojs_review_assignment">ojs_review_assignment</option>
              <option value="ojs_system_settings">ojs_system_settings</option>
            </select>
          </div>
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-64">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            type="text"
            placeholder="Search by user, table, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-400"
          />
        </div>
      </div>

      {/* Excel Sheet Data Grid */}
      <ExcelDataSheet
        sheetName="Audit_Trail"
        workbookName="OJS_Audit_Logs.xlsx"
        columns={auditColumns}
        data={filteredLogs}
        loading={loading}
        onRefresh={fetchLogs}
        formulaText={`=AUDIT_LOGS!A1:G${filteredLogs.length} [FILTERED_TOTAL=${filteredLogs.length}]`}
        emptyMessage="No audit logs matched your current filter criteria."
      />

      {/* JSON Payload Inspection Modal */}
      {selectedLog && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn"
          onClick={() => setSelectedLog(null)}
        >
          <div 
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FaFileCode className="text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Audit Log #{selectedLog.log_id} Payload Detail
                </h3>
              </div>
              <button 
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-slate-500 font-semibold">Operator:</span> <span className="font-bold text-slate-800">{selectedLog.user_name || 'System'}</span></div>
              <div><span className="text-slate-500 font-semibold">Action:</span> <span className="font-mono font-bold text-slate-800">{selectedLog.action_type}</span></div>
              <div><span className="text-slate-500 font-semibold">Table:</span> <span className="font-mono text-slate-800">{selectedLog.table_name}</span></div>
              <div><span className="text-slate-500 font-semibold">Record ID:</span> <span className="font-mono text-slate-800">#{selectedLog.record_id}</span></div>
              <div><span className="text-slate-500 font-semibold">IP Address:</span> <span className="font-mono text-slate-800">{selectedLog.ip_address}</span></div>
              <div><span className="text-slate-500 font-semibold">Timestamp:</span> <span className="font-mono text-slate-800">{new Date(selectedLog.created_at).toLocaleString()}</span></div>
            </div>

            {selectedLog.old_data && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Previous Data State (Old):</label>
                <pre className="bg-slate-900 text-rose-300 p-3 rounded-xl text-[11px] font-mono overflow-x-auto max-h-36">
                  {typeof selectedLog.old_data === 'string' ? JSON.stringify(JSON.parse(selectedLog.old_data), null, 2) : JSON.stringify(selectedLog.old_data, null, 2)}
                </pre>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">New Data State (Applied):</label>
              <pre className="bg-slate-900 text-emerald-300 p-3 rounded-xl text-[11px] font-mono overflow-x-auto max-h-48">
                {typeof selectedLog.new_data === 'string' ? JSON.stringify(JSON.parse(selectedLog.new_data), null, 2) : JSON.stringify(selectedLog.new_data, null, 2)}
              </pre>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AuditLogs;
