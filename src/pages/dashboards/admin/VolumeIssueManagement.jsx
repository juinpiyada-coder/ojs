import React, { useState, useEffect } from 'react';
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
  FaThLarge
} from 'react-icons/fa';
import Pagination from '../../../components/Pagination';

const ITEMS_PER_PAGE = 10;

const VolumeIssueManagement = () => {
  const [volumes, setVolumes] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedVolumeId, setExpandedVolumeId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

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
    if (window.confirm('Deleting this volume will also remove all associated issues and unlink related articles. Are you sure?')) {
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
  const openIssueModal = (issue = null, defaultVolumeId = null) => {
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
      const targetVolId = defaultVolumeId || (volumes[0]?.volume_id || '');
      const existingIssuesInVol = issues.filter(i => String(i.volume_id) === String(targetVolId));
      const nextIssueNum = existingIssuesInVol.length > 0 
        ? Math.max(...existingIssuesInVol.map(i => Number(i.issue_number) || 0)) + 1 
        : 1;

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

  if (loading && volumes.length === 0) {
    return <div className="p-8 text-gray-500 font-bold">Loading volumes and issues...</div>;
  }

  const totalPublishedIssues = issues.filter(i => i.is_published).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Stats Banner */}
      <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FaLayerGroup className="text-slate-600" />
                Volumes & Issues Management
              </h2>
            </div>
            <p className="text-slate-500 text-xs mt-0.5">
              Organize journal publication hierarchy: Volumes contain Issues, and Issues contain Articles.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => openVolumeModal()}
              className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-all text-xs flex items-center gap-1.5"
            >
              <FaPlus className="text-[10px]" /> Add Volume
            </button>
            <button
              onClick={() => openIssueModal()}
              className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-all text-xs flex items-center gap-1.5"
            >
              <FaPlus className="text-[10px]" /> Add Issue
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-200">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg">
              <FaBook />
            </div>
            <div>
              <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Total Volumes</p>
              <p className="text-xl font-bold font-mono text-slate-900">{volumes.length}</p>
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-lg">
              <FaLayerGroup />
            </div>
            <div>
              <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Total Issues</p>
              <p className="text-xl font-bold font-mono text-slate-900">{issues.length}</p>
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
              <FaCheckCircle />
            </div>
            <div>
              <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Published Issues</p>
              <p className="text-xl font-bold font-mono text-slate-900">{totalPublishedIssues}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Volumes List with Accordion of Issues */}
      <div className="space-y-4">
        {(() => {
          const totalPages = Math.ceil(volumes.length / ITEMS_PER_PAGE);
          const paginatedVolumes = volumes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
          return (
            <>
              {paginatedVolumes.map((vol) => {
                const volIssues = issues.filter(i => String(i.volume_id) === String(vol.volume_id));
                const isExpanded = expandedVolumeId === vol.volume_id;

          return (
            <div 
              key={vol.volume_id} 
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all"
            >
              {/* Volume Header Banner */}
              <div 
                className="p-6 bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer select-none border-b border-gray-200"
                onClick={() => setExpandedVolumeId(isExpanded ? null : vol.volume_id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-900 text-white flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">VOL</span>
                    <span className="text-lg font-bold leading-none">{vol.volume_number}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-gray-900">
                        {vol.volume_title || `Volume ${vol.volume_number}`} ({vol.publication_year})
                      </h3>
                      <span className={`px-2.5 py-0.5 text-xs rounded-full font-bold uppercase tracking-wider ${
                        vol.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {vol.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {volIssues.length} {volIssues.length === 1 ? 'Issue' : 'Issues'} assigned
                      {vol.description && ` • ${vol.description}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => openIssueModal(null, vol.volume_id)}
                    className="px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <FaPlus /> Add Issue
                  </button>
                  <button
                    onClick={() => openVolumeModal(vol)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg font-bold transition-colors"
                    title="Edit Volume"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteVolume(vol.volume_id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg font-bold transition-colors"
                    title="Delete Volume"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => setExpandedVolumeId(isExpanded ? null : vol.volume_id)}
                    className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>
              </div>

              {/* Nested Issues Section */}
              {isExpanded && (
                <div className="p-6 bg-white">
                  {volIssues.length === 0 ? (
                    <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-100">
                      <p className="text-gray-500 font-medium text-sm">No issues created in this volume yet.</p>
                      <button
                        onClick={() => openIssueModal(null, vol.volume_id)}
                        className="mt-3 px-4 py-2 bg-gray-900 text-white rounded-lg font-bold text-xs hover:bg-gray-800 inline-flex items-center gap-2"
                      >
                        <FaPlus /> Create First Issue for Volume {vol.volume_number}
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {volIssues.map((issue) => (
                        <div 
                          key={issue.issue_id}
                          className="p-5 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-400 transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <span className="px-2.5 py-1 bg-gray-900 text-white text-xs font-extrabold uppercase tracking-wider">
                                Issue {issue.issue_number}
                              </span>
                              <span className={`px-2 py-0.5 text-[11px] rounded-full font-bold uppercase ${
                                issue.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {issue.is_published ? 'Published' : 'Draft'}
                              </span>
                            </div>

                            <h4 className="font-bold text-gray-900 text-base mt-2">
                              {issue.issue_title || `Issue ${issue.issue_number}`}
                            </h4>
                            {issue.description && (
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {issue.description}
                              </p>
                            )}

                            {issue.publication_date && (
                              <p className="text-xs text-gray-500 mt-3 flex items-center gap-1.5 font-medium">
                                <FaCalendarAlt className="text-[10px]" />
                                Published: {new Date(issue.publication_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                              </p>
                            )}
                          </div>

                          <div className="flex justify-end items-center gap-2 mt-4 pt-3 border-t border-gray-100/60">
                            <button
                              onClick={() => openIssueModal(issue)}
                              className="px-2.5 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                            >
                              <FaEdit /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteIssue(issue.issue_id)}
                              className="px-2.5 py-1.5 text-red-500 hover:bg-red-50 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                            >
                              <FaTrash /> Delete
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
        })}
            </>
          );
        })()}

        {volumes.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-gray-200">
            <FaBook className="w-12 h-12 mx-auto text-gray-500 mb-3" />
            <h3 className="text-lg font-bold text-gray-900">No Volumes Created</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
              Start by creating Volume 1 to organize your journal issues and published papers.
            </p>
            <button
              onClick={() => openVolumeModal()}
              className="mt-4 px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm shadow hover:bg-gray-800"
            >
              + Create Volume 1
            </button>
          </div>
        )}
        {volumes.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(volumes.length / ITEMS_PER_PAGE)}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={volumes.length}
          />
        )}
      </div>

      {/* VOLUME MODAL */}
      {showVolumeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-xl overflow-hidden border border-gray-200">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                {isEditingVolume ? 'Edit Volume' : 'New Volume'}
              </h3>
              <button 
                onClick={() => setShowVolumeModal(false)}
                className="text-gray-500 hover:text-gray-900 text-2xl font-light leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleVolumeSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">
                    Volume Number *
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={volumeFormData.volume_number}
                    onChange={e => setVolumeFormData({...volumeFormData, volume_number: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">
                    Publication Year *
                  </label>
                  <input
                    required
                    type="number"
                    min="1900"
                    max="2100"
                    value={volumeFormData.publication_year}
                    onChange={e => setVolumeFormData({...volumeFormData, publication_year: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">
                  Volume Title / Theme (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Volume 1: Multidisciplinary Insights"
                  value={volumeFormData.volume_title}
                  onChange={e => setVolumeFormData({...volumeFormData, volume_title: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Volume overview..."
                  value={volumeFormData.description}
                  onChange={e => setVolumeFormData({...volumeFormData, description: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">
                  Cover Art (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setSelectedCoverFile(e.target.files[0])}
                  className="w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-gray-200 file:text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">
                  Status
                </label>
                <select
                  value={volumeFormData.is_published}
                  onChange={e => setVolumeFormData({...volumeFormData, is_published: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white text-sm font-semibold"
                >
                  <option value={1}>Published (Visible)</option>
                  <option value={0}>Draft (Hidden)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowVolumeModal(false)}
                  className="px-5 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 disabled:opacity-50"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-xl overflow-hidden border border-gray-200">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                {isEditingIssue ? 'Edit Issue' : 'New Issue'}
              </h3>
              <button 
                onClick={() => setShowIssueModal(false)}
                className="text-gray-500 hover:text-gray-900 text-2xl font-light leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleIssueSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">
                  Parent Volume *
                </label>
                <select
                  required
                  value={issueFormData.volume_id}
                  onChange={e => setIssueFormData({...issueFormData, volume_id: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white text-sm font-semibold"
                >
                  <option value="">Select Volume</option>
                  {volumes.map(v => (
                    <option key={v.volume_id} value={v.volume_id}>
                      Volume {v.volume_number} ({v.publication_year}) {v.volume_title ? `- ${v.volume_title}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">
                    Issue Number *
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={issueFormData.issue_number}
                    onChange={e => setIssueFormData({...issueFormData, issue_number: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">
                    Publication Date
                  </label>
                  <input
                    type="date"
                    value={issueFormData.publication_date}
                    onChange={e => setIssueFormData({...issueFormData, publication_date: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">
                  Issue Title / Theme (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Special Issue on Cognitive Sciences"
                  value={issueFormData.issue_title}
                  onChange={e => setIssueFormData({...issueFormData, issue_title: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Issue overview or editorial note..."
                  value={issueFormData.description}
                  onChange={e => setIssueFormData({...issueFormData, description: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">
                  Cover Art (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setSelectedCoverFile(e.target.files[0])}
                  className="w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-gray-200 file:text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">
                  Status
                </label>
                <select
                  value={issueFormData.is_published}
                  onChange={e => setIssueFormData({...issueFormData, is_published: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white text-sm font-semibold"
                >
                  <option value={1}>Published (Visible)</option>
                  <option value={0}>Draft (Hidden)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-5 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 disabled:opacity-50"
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
