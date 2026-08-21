import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../utils/api';
import { toast } from 'react-toastify';
import ExcelDataSheet from '../../../components/ExcelDataSheet';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/audit-logs');
      setLogs(res.data || []);
    } catch (err) {
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const auditColumns = [
    { key: 'log_id', label: 'Log ID', width: 'w-16', render: (v) => <span className="font-mono font-bold text-slate-700">#{v}</span> },
    { key: 'created_at', label: 'Timestamp', render: (v) => <span className="font-mono text-slate-600 text-[11px]">{new Date(v).toLocaleString()}</span> },
    { key: 'user_name', label: 'Operator User', render: (v, r) => <span className="font-bold text-slate-800">{v || 'System'} {r.user_id ? `(#${r.user_id})` : ''}</span> },
    { key: 'action_type', label: 'Action Executed', render: (v) => <span className="font-mono font-bold text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-300 uppercase text-slate-900">{v}</span> },
    { key: 'table_name', label: 'Target Table & ID', render: (v, r) => <span className="font-mono text-[11px] text-slate-700">{v} [ID: {r.record_id}]</span> },
    { key: 'ip_address', label: 'IP Address', render: (v) => <span className="font-mono text-slate-500 text-[11px]">{v || '127.0.0.1'}</span> }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">System Audit Trail Data Sheet</h2>
            <span className="px-2 py-0.5 bg-[#107C41] text-white text-[10px] font-mono font-bold rounded">
              EXCEL_LOG_VIEW
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Immutable audit logs of all journal modifications, reviews, and assignments</p>
        </div>
      </div>

      {/* Excel Sheet Data Grid */}
      <ExcelDataSheet
        sheetName="Audit_Trail"
        workbookName="OJS_Audit_Logs.xlsx"
        columns={auditColumns}
        data={logs}
        loading={loading}
        onRefresh={fetchLogs}
        formulaText={`=AUDIT_LOGS!A1:F${logs.length} [ORDER_BY=TIMESTAMP_DESC]`}
        emptyMessage="No audit logs found in database sheet."
      />
    </div>
  );
};

export default AuditLogs;
