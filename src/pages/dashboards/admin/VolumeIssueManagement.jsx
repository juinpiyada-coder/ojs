import React, { useState, useEffect, useMemo } from 'react';
import { apiFetch, resolveImageUrl } from '../../../utils/api';
import { toast } from 'react-toastify';
import { 
  FaBook, 
  FaLayerGroup, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaCalendarAlt, 
  FaChevronDown, 
  FaChevronUp,
  FaFileAlt,
  FaImage,
  FaThLarge,
  FaSearch,
  FaFilter,
  FaArrowRight,
  FaExternalLinkAlt,
  FaFolderOpen
} from 'react-icons/fa';
import Pagination from '../../../components/Pagination';

const ITEMS_PER_PAGE = 5;

const VolumeIssueManagement = () => {
  const [volumes, setVolumes] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedVolumeId, setExpandedVolumeId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Volume Modal State
  const [showVolumeModal, setShowVolumeModal] = useState(false);
  const [volumeFormData, setVolumeFormData] = useState({
    volume_id: '',
    volume_number: 1,
    publication_year: new Date().getFullYear(),
    volume_title: '',
    description: '',
    is_published: 1
  });
  const [isEditingVolume, setIsEditingVolume] = useState(false);

  // Issue Modal State
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueFormData, setIssueFormData] = useState({
    issue_id: '',
    volume_id: '',
    issue_number: 1,
    issue_title: '',
    description: '',
    publication_date: new Date().toISOString().split('T')[0],
    is_published: 1
  });
  const [isEditingIssue, setIsEditingIssue] = useState(false);

  // Cover Image State
  const [selectedCoverFile, setSelectedCoverFile] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [volRes, issueRes] = await Promise.all([
        apiFetch('/volumes'),
        apiFetch('/issues')
      ]);
      const loadedVolumes = volRes.data || [];
      // Sort volumes descending by volume number
      loadedVolumes.sort((a, b) => Number(b.volume_number) - Number(a.volume_number));
      setVolumes(loadedVolumes);
      setIssues(issueRes.data || []);
      if (loadedVolumes.length > 0 && !expandedVolumeId) {
        setExpandedVolumeId(loadedVolumes[0].volume_id);
      }
    } catch (err) {
      toast.error('Failed to load volumes and issues: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- VOLUME HANDLERS ---
  const openVolumeModal = (volume = null) => {
    setSelectedCoverFile(null);
    if (volume) {
      setIsEditingVolume(true);
      setVolumeFormData({
        volume_id: volume.volume_id,
        volume_number: volume.volume_number,
        publication_year: volume.publication_year,
        volume_title: volume.volume_title || '',
        description: volume.description || '',
        is_published: volume.is_published ? 1 : 0
      });
    } else {
      setIsEditingVolume(false);
      const nextVolNum = volumes.length > 0 ? Math.max(...volumes.map(v => Number(v.volume_number) || 0)) + 1 : 1;
      setVolumeFormData({
        volume_id: '',
        volume_number: nextVolNum,
        publication_year: new Date().getFullYear(),
        volume_title: `Volume ${nextVolNum}`,
        description: '',
        is_published: 1
      });
    }
    setShowVolumeModal(true);
  };

  const handleVolumeSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      let coverDocId = null;

      if (selectedCoverFile) {
        const docPayload = new FormData();
        const user = JSON.parse(localStorage.getItem('user')) || {};
        docPayload.append('uploaded_by', user.user_id || 1);
        docPayload.append('file', selectedCoverFile);

        const docRes = await apiFetch('/docs', {
          method: 'POST',
          body: docPayload
        });
        coverDocId = docRes.data.doc_id;
      }

      const payload = {
        volume_number: Number(volumeFormData.volume_number),
        publication_year: Number(volumeFormData.publication_year),
        volume_title: volumeFormData.volume_title,
        description: volumeFormData.description,
        is_published: Number(volumeFormData.is_published)
      };
      if (coverDocId) payload.cover_doc_id = coverDocId;

      if (isEditingVolume) {
        await apiFetch(`/volumes?id=${volumeFormData.volume_id}`, {
          method: 'PUT',
          body: payload
        });
        toast.success('Volume updated successfully!');
      } else {
        await apiFetch('/volumes', {
          method: 'POST',
          body: payload
        });
        toast.success('Volume created successfully!');
      }

      setShowVolumeModal(false);
      await fetchData();
    } catch (err) {
      toast.error('Error saving volume: ' + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteVolume = async (volumeId) => {
    const hasIssues = issues.some(i => String(i.volume_id) === String(volumeId));
    if (hasIssues) {
      toast.warning('Cannot delete volume with active issues. Remove or reassign issues first.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this volume?')) {
      try {
        await apiFetch(`/volumes?id=${volumeId}`, { method: 'DELETE' });
        toast.success('Volume deleted');
        await fetchData();
      } catch (err) {
        toast.error('Failed to delete volume: ' + err.message);
      }
    }
  };

  // --- ISSUE HANDLERS ---
  const openIssueModal = (issue = null, defaultVolId = null) => {
    setSelectedCoverFile(null);
    if (issue) {
      setIsEditingIssue(true);
      setIssueFormData({
        issue_id: issue.issue_id,
        volume_id: issue.volume_id,
        issue_number: issue.issue_number,
        issue_title: issue.issue_title || '',
        description: issue.description || '',
        publication_date: issue.publication_date || new Date().toISOString().split('T')[0],
        is_published: issue.is_published ? 1 : 0
      });
    } else {
      setIsEditingIssue(false);
      const targetVolId = defaultVolId || (volumes.length > 0 ? volumes[0].volume_id : '');
      const existingIssues = issues.filter(i => String(i.volume_id) === String(targetVolId));
      const nextIssueNum = existingIssues.length > 0 ? Math.max(...existingIssues.map(i => Number(i.issue_number) || 0)) + 1 : 1;
      
      setIssueFormData({
        issue_id: '',
        volume_id: targetVolId,
        issue_number: nextIssueNum,
        issue_title: `Issue ${nextIssueNum}`,
        description: '',
        publication_date: new Date().toISOString().split('T')[0],
        is_published: 1
      });
    }
    setShowIssueModal(true);
  };

  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      let coverDocId = null;

      if (selectedCoverFile) {
        const docPayload = new FormData();
        const user = JSON.parse(localStorage.getItem('user')) || {};
        docPayload.append('uploaded_by', user.user_id || 1);
        docPayload.append('file', selectedCoverFile);

        const docRes = await apiFetch('/docs', {
          method: 'POST',
          body: docPayload
        });
        coverDocId = docRes.data.doc_id;
      }

      const payload = {
        volume_id: Number(issueFormData.volume_id),
        issue_number: Number(issueFormData.issue_number),
        issue_title: issueFormData.issue_title,
        description: issueFormData.description,
        publication_date: issueFormData.publication_date,
        is_published: Number(issueFormData.is_published)
      };
      if (coverDocId) payload.cover_doc_id = coverDocId;

      if (isEditingIssue) {
        await apiFetch(`/issues?id=${issueFormData.issue_id}`, {
          method: 'PUT',
          body: payload
        });
        toast.success('Issue updated successfully!');
      } else {
        await apiFetch('/issues', {
          method: 'POST',
          body: payload
        });
        toast.success('Issue created successfully!');
      }

      setShowIssueModal(false);
      await fetchData();
    } catch (err) {
      toast.error('Error saving issue: ' + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteIssue = async (issueId) => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      try {
        await apiFetch(`/issues?id=${issueId}`, { method: 'DELETE' });
        toast.success('Issue deleted');
        await fetchData();
      } catch (err) {
        toast.error('Failed to delete issue: ' + err.message);
      }
    }
  };

  // Filtered Volumes
  const filteredVolumes = useMemo(() => {
    return volumes.filter(v => {
      const matchesSearch = 
        v.volume_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(v.volume_number).includes(searchTerm) ||
        String(v.publication_year).includes(searchTerm);

      const matchesStatus = 
        statusFilter === 'ALL' ? true :
        statusFilter === 'published' ? Boolean(v.is_published) :
        !v.is_published;

      return matchesSearch && matchesStatus;
    });
  }, [volumes, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredVolumes.length / ITEMS_PER_PAGE) || 1;
  const paginatedVolumes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredVolumes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredVolumes, currentPage]);

  const totalPublishedIssues = issues.filter(i => i.is_published).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* 1. Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
              <FaLayerGroup className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Volumes & Issues Management</h2>
              <p className="text-slate-500 text-xs mt-0.5">
                Organize journal publication hierarchy: Volumes contain Issues, and Issues contain Articles.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => openVolumeModal()}
            className="px-4 py-2.5 bg-[#107C41] hover:bg-[#0E6E38] text-white text-xs font-semibold rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <FaPlus className="text-[10px]" />
            <span>Add Volume</span>
          </button>
          
          <button
            onClick={() => openIssueModal()}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <FaPlus className="text-[10px]" />
            <span>Add Issue</span>
          </button>
        </div>
      </div>

      {/* 2. Top-Level Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center text-xl shrink-0 shadow-xs">
            <FaBook />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Volumes</p>
            <p className="text-2xl font-bold font-mono text-slate-900 mt-0.5">{volumes.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center text-xl shrink-0 shadow-xs">
            <FaLayerGroup />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Issues</p>
            <p className="text-2xl font-bold font-mono text-slate-900 mt-0.5">{issues.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center text-xl shrink-0 shadow-xs">
            <FaCheckCircle />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Published Issues</p>
            <p className="text-2xl font-bold font-mono text-emerald-700 mt-0.5">{totalPublishedIssues}</p>
          </div>
        </div>

      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="relative w-full sm:max-w-md">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search volumes by title, number or year..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <FaFilter className="w-3 h-3 text-slate-400" />
            <span className="text-xs font-semibold text-slate-600">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer"
            >
              <option value="ALL">All Volumes</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Volumes List & Nested Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-semibold">Loading publication volumes...</span>
          </div>
        ) : paginatedVolumes.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
            No volumes found matching the search criteria.
          </div>
        ) : (
          paginatedVolumes.map((vol) => {
            const volIssues = issues.filter(i => String(i.volume_id) === String(vol.volume_id));
            const isExpanded = expandedVolumeId === vol.volume_id;

            return (
              <div 
                key={vol.volume_id} 
                className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden transition-all duration-200 hover:border-slate-300"
              >
                {/* Volume Header Bar */}
                <div 
                  className="p-5 sm:p-6 bg-slate-50/70 hover:bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer select-none border-b border-slate-200/80 transition-colors"
                  onClick={() => setExpandedVolumeId(isExpanded ? null : vol.volume_id)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center shrink-0 shadow-xs">
                      <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-slate-400">VOL</span>
                      <span className="text-lg font-bold font-mono leading-none">{vol.volume_number}</span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900 truncate">
                          {vol.volume_title || `Volume ${vol.volume_number}`} ({vol.publication_year})
                        </h3>
                        <span className={`px-2.5 py-0.5 text-[10px] rounded-full font-bold uppercase tracking-wider border ${
                          vol.is_published 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {vol.is_published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 truncate">
                        {volIssues.length} {volIssues.length === 1 ? 'Issue' : 'Issues'} assigned
                        {vol.description && ` • ${vol.description}`}
                      </p>
                    </div>
                  </div>

                  {/* Volume Action Buttons */}
                  <div className="flex items-center gap-2 self-end md:self-auto shrink-0" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => openIssueModal(null, vol.volume_id)}
                      className="px-3 py-1.5 bg-[#107C41] hover:bg-[#0E6E38] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <FaPlus className="text-[9px]" /> 
                      <span>Add Issue</span>
                    </button>

                    <button
                      onClick={() => openVolumeModal(vol)}
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit Volume"
                    >
                      <FaEdit className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteVolume(vol.volume_id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Volume"
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setExpandedVolumeId(isExpanded ? null : vol.volume_id)}
                      className="p-2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    >
                      {isExpanded ? <FaChevronUp className="w-3.5 h-3.5" /> : <FaChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Nested Issues Section */}
                {isExpanded && (
                  <div className="p-6 bg-white space-y-4">
                    {volIssues.length === 0 ? (
                      <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                        <FaFolderOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-slate-600 font-semibold text-xs">No issues created in this volume yet.</p>
                        <button
                          onClick={() => openIssueModal(null, vol.volume_id)}
                          className="mt-3 px-4 py-2 bg-[#107C41] hover:bg-[#0E6E38] text-white rounded-xl font-semibold text-xs transition-colors inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <FaPlus className="text-[9px]" /> Create First Issue for Volume {vol.volume_number}
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {volIssues.map((issue) => (
                          <div 
                            key={issue.issue_id}
                            className="p-5 bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-sm transition-all duration-200 flex flex-col justify-between group"
                          >
                            <div>
                              <div className="flex justify-between items-start gap-2 mb-2">
                                <span className="px-2.5 py-1 bg-slate-900 text-white text-[10px] font-mono font-bold uppercase tracking-wider rounded-md shadow-2xs">
                                  ISSUE {issue.issue_number}
                                </span>
                                <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold uppercase border ${
                                  issue.is_published 
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}>
                                  {issue.is_published ? 'Published' : 'Draft'}
                                </span>
                              </div>

                              <h4 className="font-bold text-slate-900 text-sm mt-3 leading-snug group-hover:text-emerald-700 transition-colors">
                                {issue.issue_title || `Volume ${vol.volume_number}, Issue ${issue.issue_number}`}
                              </h4>
                              
                              {issue.description && (
                                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                                  {issue.description}
                                </p>
                              )}

                              {issue.publication_date && (
                                <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5 font-medium">
                                  <FaCalendarAlt className="text-[10px]" />
                                  Published: {new Date(issue.publication_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                </p>
                              )}
                            </div>

                            <div className="flex justify-end items-center gap-1.5 mt-4 pt-3 border-t border-slate-100">
                              <button
                                onClick={() => openIssueModal(issue)}
                                className="px-2.5 py-1 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer"
                              >
                                <FaEdit className="w-3 h-3 text-blue-500" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteIssue(issue.issue_id)}
                                className="px-2.5 py-1 text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer"
                              >
                                <FaTrash className="w-3 h-3 text-rose-400" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={filteredVolumes.length}
        />
      </div>

      {/* VOLUME MODAL */}
      {showVolumeModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FaBook className="text-emerald-600" />
                {isEditingVolume ? 'Edit Volume' : 'New Publication Volume'}
              </h3>
              <button 
                onClick={() => setShowVolumeModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleVolumeSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Volume Number *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={volumeFormData.volume_number}
                    onChange={e => setVolumeFormData({...volumeFormData, volume_number: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Publication Year *</label>
                  <input
                    required
                    type="number"
                    min="1900"
                    max="2100"
                    value={volumeFormData.publication_year}
                    onChange={e => setVolumeFormData({...volumeFormData, publication_year: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Volume Title / Theme</label>
                <input
                  type="text"
                  placeholder="e.g. Volume 10 (2025): Scholarly Interdisciplinary Advances"
                  value={volumeFormData.volume_title}
                  onChange={e => setVolumeFormData({...volumeFormData, volume_title: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description / Editorial Note</label>
                <textarea
                  rows="3"
                  placeholder="Overview of this annual volume..."
                  value={volumeFormData.description}
                  onChange={e => setVolumeFormData({...volumeFormData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={volumeFormData.is_published}
                  onChange={e => setVolumeFormData({...volumeFormData, is_published: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none bg-white"
                >
                  <option value={1}>Published (Visible to Public)</option>
                  <option value={0}>Draft (Internal Only)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowVolumeModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 bg-[#107C41] hover:bg-[#0E6E38] text-white rounded-lg text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                >
                  {formLoading ? 'Saving...' : 'Save Volume'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ISSUE MODAL */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FaLayerGroup className="text-emerald-600" />
                {isEditingIssue ? 'Edit Issue' : 'New Journal Issue'}
              </h3>
              <button 
                onClick={() => setShowIssueModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleIssueSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Parent Volume *</label>
                <select
                  required
                  value={issueFormData.volume_id}
                  onChange={e => setIssueFormData({...issueFormData, volume_id: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none bg-white"
                >
                  <option value="">-- Choose Volume --</option>
                  {volumes.map(v => (
                    <option key={v.volume_id} value={v.volume_id}>
                      Volume {v.volume_number} ({v.publication_year}) {v.volume_title ? `- ${v.volume_title}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Number *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={issueFormData.issue_number}
                    onChange={e => setIssueFormData({...issueFormData, issue_number: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Publication Date</label>
                  <input
                    type="date"
                    value={issueFormData.publication_date}
                    onChange={e => setIssueFormData({...issueFormData, publication_date: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Title / Theme (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Special Issue on Cognitive Sciences"
                  value={issueFormData.issue_title}
                  onChange={e => setIssueFormData({...issueFormData, issue_title: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  placeholder="Issue overview or editorial note..."
                  value={issueFormData.description}
                  onChange={e => setIssueFormData({...issueFormData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={issueFormData.is_published}
                  onChange={e => setIssueFormData({...issueFormData, is_published: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none bg-white"
                >
                  <option value={1}>Published (Visible to Public)</option>
                  <option value={0}>Draft (Internal Only)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 bg-[#107C41] hover:bg-[#0E6E38] text-white rounded-lg text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                >
                  {formLoading ? 'Saving...' : 'Save Issue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default VolumeIssueManagement;
