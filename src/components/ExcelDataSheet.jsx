import React, { useState } from 'react';
import { FaFileExcel, FaCopy, FaSync, FaSearch, FaTable, FaCheck } from 'react-icons/fa';
import { exportToCsv, copyTableToClipboard } from '../utils/excelExport';
import { toast } from 'react-toastify';

const ExcelDataSheet = ({
  sheetName = "Sheet1",
  workbookName = "OJS_Admin_Database.xlsx",
  columns = [], // [{ key: 'id', label: 'ID', width: 'w-16', render: (val, row) => ... }]
  data = [],
  loading = false,
  onRefresh = null,
  actions = null,
  formulaText = "",
  emptyMessage = "No records found in spreadsheet."
}) => {
  const [selectedCell, setSelectedCell] = useState("A1");
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const columnLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P"];

  const filteredData = data.filter(row => {
    if (!searchTerm) return true;
    return Object.values(row).some(v => 
      String(v || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleExport = () => {
    const rawHeaders = columns.map(c => c.label);
    const exportRows = filteredData.map(row => {
      const obj = {};
      columns.forEach(c => {
        obj[c.label] = row[c.key] !== undefined ? row[c.key] : '';
      });
      return obj;
    });
    exportToCsv(sheetName.replace(/\s+/g, '_'), exportRows, rawHeaders);
    toast.success(`Exported ${filteredData.length} rows to CSV / Excel!`);
  };

  const handleCopy = () => {
    const rawHeaders = columns.map(c => c.label);
    const exportRows = filteredData.map(row => {
      const obj = {};
      columns.forEach(c => {
        obj[c.label] = row[c.key] !== undefined ? row[c.key] : '';
      });
      return obj;
    });
    copyTableToClipboard(exportRows, rawHeaders);
    setCopied(true);
    toast.info("Table copied to clipboard (TSV format)!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border-2 border-slate-300 rounded-lg shadow-sm overflow-hidden flex flex-col font-sans">
      
      {/* 1. Excel Green Ribbon Bar */}
      <div className="bg-[#107C41] text-white px-4 py-2 flex flex-wrap items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-2.5">
          <FaFileExcel className="text-white text-lg shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs tracking-wider uppercase">{workbookName}</span>
              <span className="bg-emerald-800/80 text-[10px] px-1.5 py-0.2 rounded font-mono">AutoSave: ON</span>
            </div>
            <p className="text-[10px] text-emerald-100 font-mono">Spreadsheet Output Grid • Live Database Sync</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={handleExport}
            className="px-2.5 py-1 bg-white/15 hover:bg-white/25 text-white rounded text-[11px] font-bold transition-all flex items-center gap-1 border border-white/20"
            title="Download formatted CSV spreadsheet"
          >
            <FaFileExcel className="text-emerald-200" /> Export CSV / .xlsx
          </button>
          
          <button
            onClick={handleCopy}
            className="px-2.5 py-1 bg-white/15 hover:bg-white/25 text-white rounded text-[11px] font-bold transition-all flex items-center gap-1 border border-white/20"
            title="Copy spreadsheet table to clipboard"
          >
            {copied ? <FaCheck className="text-emerald-300" /> : <FaCopy className="text-emerald-200" />}
            {copied ? 'Copied!' : 'Copy TSV'}
          </button>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1.5 bg-white/15 hover:bg-white/25 text-white rounded transition-all border border-white/20"
              title="Refresh Data Sheet"
            >
              <FaSync className="text-xs" />
            </button>
          )}

          {actions}
        </div>
      </div>

      {/* 2. Excel Formula Bar */}
      <div className="bg-[#F8F9FA] border-b border-slate-300 px-3 py-1.5 flex items-center gap-2 text-xs font-mono text-slate-700 select-none">
        <div className="bg-white border border-slate-300 px-2 py-0.5 rounded text-center w-14 font-bold text-slate-800 shadow-xs">
          {selectedCell}
        </div>
        <div className="text-slate-400 font-serif italic text-sm">fx</div>
        <div className="flex-1 bg-white border border-slate-300 px-2.5 py-0.5 rounded text-slate-800 flex items-center justify-between">
          <span className="truncate text-[11px] text-slate-600">
            {formulaText || `=QUERY(${sheetName}!A1:Z${filteredData.length}, "SELECT ALL")`}
          </span>
          <span className="text-[10px] text-emerald-700 font-bold ml-2 shrink-0">
            COUNT: {filteredData.length}
          </span>
        </div>

        {/* Quick Filter */}
        <div className="relative shrink-0 w-44">
          <input
            type="text"
            placeholder="Quick Search Sheet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-6 pr-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono focus:outline-none focus:border-emerald-600"
          />
          <FaSearch className="absolute left-2 top-1.5 text-slate-400 text-[10px]" />
        </div>
      </div>

      {/* 3. Excel Spreadsheet Data Grid */}
      <div className="overflow-x-auto overflow-y-auto max-h-[650px] bg-slate-100">
        <table className="w-full border-collapse text-left font-mono text-xs select-text">
          
          {/* Column Header Ribbon (A, B, C, D...) */}
          <thead>
            <tr className="bg-[#E9EDF4] border-b-2 border-slate-400 text-slate-700 sticky top-0 z-10 shadow-xs">
              <th className="w-10 text-center py-1.5 px-2 font-bold text-[11px] border-r border-slate-300 bg-[#DCE2EC] text-slate-600 select-none">
                #
              </th>
              {columns.map((col, cIdx) => (
                <th
                  key={cIdx}
                  className={`py-1.5 px-3 font-bold text-[11px] border-r border-slate-300 tracking-wider uppercase text-slate-800 ${col.width || ''}`}
                  onClick={() => setSelectedCell(`${columnLetters[cIdx] || 'A'}1`)}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span>
                      <span className="text-emerald-800 mr-1 font-bold text-[10px]">
                        {columnLetters[cIdx] || 'A'}
                      </span>
                      {col.label}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Spreadsheet Data Rows */}
          <tbody className="bg-white divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="py-12 text-center text-slate-500 font-mono">
                  <div className="inline-flex items-center gap-2">
                    <FaSync className="animate-spin text-emerald-600" />
                    <span>Loading spreadsheet rows from database...</span>
                  </div>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="py-12 text-center text-slate-400 font-mono italic">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filteredData.map((row, rIdx) => (
                <tr 
                  key={rIdx} 
                  className={`hover:bg-[#E8F0FE] transition-colors ${rIdx % 2 === 0 ? 'bg-white' : 'bg-[#FBFBFC]'}`}
                  onClick={() => setSelectedCell(`A${rIdx + 1}`)}
                >
                  {/* Row Number Index Column */}
                  <td className="text-center py-1.5 px-2 font-bold text-[11px] border-r border-slate-300 bg-[#F0F3F7] text-slate-500 select-none border-b border-slate-200">
                    {rIdx + 1}
                  </td>

                  {/* Data Cells */}
                  {columns.map((col, cIdx) => (
                    <td
                      key={cIdx}
                      className="py-1.5 px-3 border-r border-slate-200 border-b border-slate-200 text-slate-900 text-xs truncate max-w-md font-sans"
                    >
                      {col.render ? col.render(row[col.key], row, rIdx) : (row[col.key] !== undefined ? String(row[col.key]) : '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Excel Bottom Sheet Tabs & Status Bar */}
      <div className="bg-[#F0F2F5] border-t-2 border-slate-300 px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-600 select-none">
        
        {/* Sheet Tab */}
        <div className="flex items-center gap-1">
          <div className="bg-white border-t-2 border-t-emerald-600 border-x border-b border-slate-300 px-3 py-1 font-bold text-slate-900 rounded-t shadow-xs flex items-center gap-1.5">
            <FaTable className="text-emerald-700 text-xs" />
            <span>{sheetName}</span>
          </div>
        </div>

        {/* Status Metrics */}
        <div className="flex items-center gap-4 text-slate-500 font-mono text-[10px]">
          <span>READY</span>
          <span>ROWS: <strong className="text-slate-800">{filteredData.length}</strong></span>
          <span>COLS: <strong className="text-slate-800">{columns.length}</strong></span>
          <span>FORMAT: <strong className="text-slate-800">EXCEL_GRID</strong></span>
          <span>ZOOM: <strong>100%</strong></span>
        </div>
      </div>

    </div>
  );
};

export default ExcelDataSheet;
