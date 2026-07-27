import React from 'react';

const AuthorDashboard = () => {
  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">My Manuscripts</h2>
          <p className="text-gray-500 mt-1">Track and manage your journal submissions</p>
        </div>
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all">
          + Submit New Manuscript
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Manuscript ID</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Submitted Date</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            <tr>
              <td className="px-6 py-5 text-sm font-bold text-gray-900">OJS-2026-1045</td>
              <td className="px-6 py-5 text-sm text-gray-800 font-serif font-medium">A Comparative Study on Renewable Energy Policies</td>
              <td className="px-6 py-5 text-sm text-gray-500">Oct 14, 2026</td>
              <td className="px-6 py-5"><span className="px-3 py-1.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">Under Review</span></td>
            </tr>
            <tr>
              <td className="px-6 py-5 text-sm font-bold text-gray-900">OJS-2026-0921</td>
              <td className="px-6 py-5 text-sm text-gray-800 font-serif font-medium">The Future of Cryptography in Financial Systems</td>
              <td className="px-6 py-5 text-sm text-gray-500">Sep 02, 2026</td>
              <td className="px-6 py-5"><span className="px-3 py-1.5 bg-green-100 text-green-800 text-xs font-bold rounded-full">Published</span></td>
            </tr>
            <tr>
              <td className="px-6 py-5 text-sm font-bold text-gray-900">OJS-2026-0811</td>
              <td className="px-6 py-5 text-sm text-gray-800 font-serif font-medium">Evaluating Modern JavaScript Framework Performance</td>
              <td className="px-6 py-5 text-sm text-gray-500">Aug 15, 2026</td>
              <td className="px-6 py-5"><span className="px-3 py-1.5 bg-red-100 text-red-800 text-xs font-bold rounded-full">Rejected</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuthorDashboard;
