import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

const EditorDashboard = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        if (!user.user_id) return;
        const res = await apiFetch(`/articles?editor_id=${user.user_id}`);
        setArticles(res.data || []);
      } catch (err) {
        console.error('Failed to fetch assigned articles', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [user.user_id]);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E5E0D8]">
          <p className="text-[#8E7C68] text-sm font-bold uppercase tracking-wider mb-2">Total Assigned</p>
          <p className="text-4xl font-bold text-[#2C2C2C]">{articles.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E5E0D8]">
          <p className="text-[#8E7C68] text-sm font-bold uppercase tracking-wider mb-2">Under Review</p>
          <p className="text-4xl font-bold text-[#2C2C2C]">{articles.filter(a => a.status === 'under_review').length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E5E0D8]">
          <p className="text-[#8E7C68] text-sm font-bold uppercase tracking-wider mb-2">Awaiting Decision</p>
          <p className="text-4xl font-bold text-[#2C2C2C]">{articles.filter(a => a.status === 'submitted').length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-[#E5E0D8] bg-[#FAF9F6] flex justify-between items-center">
          <h3 className="font-bold text-[#2C2C2C] text-lg">Assigned Manuscripts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-[#FAF9F6]">
              <tr className="border-b border-[#E5E0D8] text-[#8E7C68]">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Paper Title</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Submitted By</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Submission Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#F0EBE1]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-[#8E7C68]">Loading...</td>
                </tr>
              ) : articles.length > 0 ? (
                articles.map(article => (
                  <tr key={article.article_id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-sm font-bold text-[#2C2C2C] truncate">{article.title}</p>
                      <p className="text-xs text-[#8E7C68] mt-1 truncate">{article.abstract}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-[#5C5446]">{article.author_name}</p>
                    </td>
                    <td className="px-6 py-4 text-[#5C5446] text-sm">
                      {new Date(article.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-[10px] rounded-full font-bold uppercase tracking-wider
                          ${article.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 
                            article.status === 'in_review' ? 'bg-blue-100 text-blue-800' : 
                            article.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {article.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {article.manuscript_url ? (
                        <a href={article.manuscript_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 text-sm font-bold underline">Review File</a>
                      ) : (
                        <span className="text-[#8E7C68] text-xs italic">No file</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-[#8E7C68]">No manuscripts assigned to you yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EditorDashboard;
