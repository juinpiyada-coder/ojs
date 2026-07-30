import React from 'react';

const AssistantEditorDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Needs Formatting Check</p>
          <p className="text-4xl font-bold text-red-600">5</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Passed Initial Screening (This Week)</p>
          <p className="text-4xl font-bold text-gray-800">18</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Screening Queue</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Manuscript ID</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Submitted</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-blue-600">OJS-2026-1050</td>
              <td className="px-6 py-4 text-sm text-gray-900 font-serif">Analysis of Quantum Cryptography Protocols</td>
              <td className="px-6 py-4 text-sm text-gray-500">Today</td>
              <td className="px-6 py-4 text-right">
                <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-bold hover:bg-blue-700">Begin Screening</button>
              </td>
            </tr>
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssistantEditorDashboard;
