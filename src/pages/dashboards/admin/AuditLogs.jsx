import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../utils/api';
import { toast } from 'react-toastify';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await apiFetch('/audit-logs');
        setLogs(res.data || []);
      } catch (err) {
        toast.error('Failed to load audit logs');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E5E0D8]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#2C2C2C]">Audit Logs</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-[#E5E0D8] text-[#5C5446]">
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Table / Record</th>
              <th className="py-3 px-4">IP Address</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="py-4 text-center text-[#5C5446]">Loading logs...</td>
              </tr>
            ) : logs.length > 0 ? (
              logs.map(log => (
                <tr key={log.log_id} className="border-b border-[#F0EBE1] hover:bg-[#FAF9F6]">
                  <td className="py-3 px-4 whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="py-3 px-4">{log.user_name || 'System'} {log.user_id ? `(${log.user_id})` : ''}</td>
                  <td className="py-3 px-4 font-bold">{log.action_type}</td>
                  <td className="py-3 px-4">{log.table_name} - {log.record_id}</td>
                  <td className="py-3 px-4">{log.ip_address}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center text-[#5C5446]">No logs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogs;
