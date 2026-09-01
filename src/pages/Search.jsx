import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaBookOpen, FaFilePdf, FaTag, FaFilter, FaCalendarAlt, FaLayerGroup } from 'react-icons/fa';
import AnimatedSection from '../components/AnimatedSection';
import { apiFetch, resolveFileUrl } from '../utils/api';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVolume, setSelectedVolume] = useState('ALL');
  const [articles, setArticles] = useState([]);
  const [volumes, setVolumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [artRes, volRes] = await Promise.all([
        apiFetch('/articles'),
        apiFetch('/volumes?with_issues=true')
      ]);
      setArticles(artRes.data || []);
      setVolumes(volRes.data || []);
    } catch (err) {
      console.error('Failed to load search data:', err);
    } finally {
      setLoading(false);
    }
  };

  const publishedArticles = articles.filter(a => a.status === 'published' || a.status === 'accepted');

  const filteredArticles = publishedArticles.filter(art => {
    const matchesQuery = 
      !searchTerm.trim() ||
      art.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.abstract?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.keywords?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.author_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.doi?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVolume = selectedVolume === 'ALL' || String(art.volume_id) === String(selectedVolume);

    return matchesQuery && matchesVolume;
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setHasSearched(true);
  };

  return (
    <AnimatedSection animation="fade-up">
      <div className="flex-grow bg-[#FDFBF7] py-16 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9E8B75]">
              The Literary Scientist Index
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1C2024] font-serif tracking-tight">
              Search Scholarly Articles
            </h1>
            <p className="text-sm sm:text-base text-[#5A5043] leading-relaxed">
              Explore peer-reviewed research, interdisciplinary treatises, literary theory, and scientific methodologies.
            </p>
          </div>

          {/* Search Box & Filter Bar */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5DFD4] shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9E8B75] text-sm" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by article title, author, keyword, DOI, or abstract text..." 
                  className="w-full pl-11 pr-4 py-3.5 bg-[#FAF8F5] border border-[#E5DFD4] rounded-2xl focus:bg-white focus:outline-none focus:border-[#1C2024] transition-all text-sm sm:text-base text-[#1C2024]"
                />
              </div>

              <button 
                type="submit"
                className="px-8 py-3.5 bg-[#1C2024] hover:bg-[#2D3748] text-white rounded-2xl font-bold tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 text-sm"
              >
                <FaSearch />
                <span>Search</span>
              </button>
            </form>

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#F1EBE1] text-xs">
              <div className="flex items-center gap-2">
                <FaFilter className="text-[#9E8B75]" />
                <span className="font-bold text-[#5A5043]">Filter by Volume:</span>
                <select
                  value={selectedVolume}
                  onChange={(e) => setSelectedVolume(e.target.value)}
                  className="px-3 py-1.5 bg-[#FAF8F5] border border-[#E5DFD4] rounded-xl text-xs font-semibold text-[#1C2024] focus:outline-none"
                >
                  <option value="ALL">All Volumes ({publishedArticles.length} Articles)</option>
                  {volumes.map(v => (
                    <option key={v.volume_id} value={v.volume_id}>
                      {v.volume_title || `Volume ${v.volume_number} (${v.publication_year})`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-[#7A6E5E] font-medium">
                Found <strong>{filteredArticles.length}</strong> published article{filteredArticles.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Search Results List */}
          <div className="space-y-4">
            {loading ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-[#E5DFD4] text-[#7A6E5E] font-semibold">
                Loading research database...
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-[#E5DFD4] space-y-3">
                <FaBookOpen className="w-12 h-12 text-[#C5BAA8] mx-auto" />
                <h3 className="text-xl font-bold text-[#1C2024]">No Matching Articles Found</h3>
                <p className="text-xs text-[#7A6E5E] max-w-md mx-auto">
                  Try adjusting your search keywords or removing volume filters to find published articles.
                </p>
              </div>
            ) : (
              filteredArticles.map((art) => (
                <div 
                  key={art.article_id}
                  className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5DFD4] hover:border-[#1C2024]/40 shadow-xs hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Peer-Reviewed & Open Access
                      </span>
                      {art.volume_number && (
                        <span className="px-2.5 py-0.5 bg-[#FAF7F2] text-[#5A5043] border border-[#E5DFD4] rounded-full text-[10px] font-bold">
                          Vol. {art.volume_number}, Issue {art.issue_number || 1}
                        </span>
                      )}
                      {art.doi && (
                        <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-[10px] font-mono font-semibold">
                          DOI: {art.doi}
                        </span>
                      )}
                    </div>

                    <span className="text-xs text-[#7A6E5E] font-serif">
                      Published: {art.created_at ? new Date(art.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#1C2024] font-serif leading-snug hover:text-emerald-900 transition-colors">
                      {art.title}
                    </h3>
                    {art.author_name && (
                      <p className="text-xs font-semibold text-[#857766] mt-1">
                        By {art.author_name}
                      </p>
                    )}
                  </div>

                  {art.abstract && (
                    <p className="text-xs sm:text-sm text-[#5A5043] leading-relaxed line-clamp-3 font-serif italic">
                      "{art.abstract}"
                    </p>
                  )}

                  {/* Keywords & Actions */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-[#F1EBE1]">
                    {art.keywords ? (
                      <div className="flex flex-wrap gap-1">
                        {art.keywords.split(',').map((kw, idx) => kw.trim() && (
                          <span key={idx} className="text-[10px] font-semibold bg-[#FAF8F5] text-[#5A5043] border border-[#EAE4D9] px-2.5 py-0.5 rounded-full">
                            #{kw.trim()}
                          </span>
                        ))}
                      </div>
                    ) : <div />}

                    <div className="flex items-center gap-2 shrink-0">
                      {art.manuscript_url && (
                        <a
                          href={resolveFileUrl(art.manuscript_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#B83327] hover:bg-[#992218] text-white rounded-xl text-xs font-bold transition-all shadow-2xs"
                        >
                          <FaFilePdf /> View Full PDF
                        </a>
                      )}
                      <Link
                        to="/current-issue"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#FAF8F5] hover:bg-[#EAE4D9] text-[#1C2024] border border-[#E5DFD4] rounded-xl text-xs font-semibold transition-all"
                      >
                        Issue TOC
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </AnimatedSection>
  );
};

export default Search;
