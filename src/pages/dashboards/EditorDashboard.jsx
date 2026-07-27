import React from 'react';

const EditorDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Awaiting Decision</p>
          <p className="text-4xl font-bold text-gray-800">12</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Under Review</p>
          <p className="text-4xl font-bold text-gray-800">34</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Decisions Made (This Month)</p>
          <p className="text-4xl font-bold text-gray-800">8</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Assigned Manuscripts</h3>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Manuscript ID</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Submitted</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-blue-600">OJS-2026-1042</td>
              <td className="px-6 py-4 text-sm text-gray-900 font-serif">Impact of Artificial Intelligence on Supply Chain Log...</td>
              <td className="px-6 py-4 text-sm text-gray-500">Oct 12, 2026</td>
              <td className="px-6 py-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">Awaiting Decision</span></td>
              <td className="px-6 py-4 text-right">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold">Review</button>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-blue-600">OJS-2026-1045</td>
              <td className="px-6 py-4 text-sm text-gray-900 font-serif">A Comparative Study on Renewable Energy Policies...</td>
              <td className="px-6 py-4 text-sm text-gray-500">Oct 14, 2026</td>
              <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">Under Review</span></td>
              <td className="px-6 py-4 text-right">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EditorDashboard;
