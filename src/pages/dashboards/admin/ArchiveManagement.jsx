import React, { useState, useEffect } from 'react';
import { 
  FaArchive, FaPlus, FaSearch, FaFilter, FaFilePdf, FaEdit, FaTrash, 
  FaEye, FaTimes, FaCloudUploadAlt, FaCalendarAlt, FaBookOpen, FaUser, 
  FaTag, FaLayerGroup, FaCheckCircle, FaExternalLinkAlt, FaDownload,
  FaFileExcel, FaThLarge, FaTable
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { apiFetch, resolveFileUrl } from '../../../utils/api';
import ExcelDataSheet from '../../../components/ExcelDataSheet';

const ArchiveManagement = () => {
  const [articles, setArticles] = useState([]);
  const [volumes, setVolumes] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVolumeFilter, setSelectedVolumeFilter] = useState('ALL');
  const [selectedIssueFilter, setSelectedIssueFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('sheet'); // 'sheet' | 'cards'
  
  const archiveColumns = [
    { key: 'article_id', label: 'ID', width: 'w-16 text-center', render: (v) => <span className="font-mono font-bold text-slate-700">#{v}</span> },
    { key: 'title', label: 'Publication Title', render: (v) => <span className="font-bold text-slate-900 line-clamp-1">{v}</span> },
    { key: 'author_name', label: 'Author(s)', render: (v) => <span className="text-slate-800 font-medium">{v || 'Anonymous'}</span> },
    { key: 'volume_number', label: 'Vol / Issue', width: 'w-32 text-center', render: (_, r) => r.volume_number && r.issue_number ? <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300 font-bold text-slate-700">Vol {r.volume_number}, Iss {r.issue_number}</span> : <span className="text-slate-400 italic">Unassigned</span> },
    { key: 'doi', label: 'DOI', width: 'w-44', render: (v) => v ? <span className="font-mono text-[10px] text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">{v}</span> : <span className="text-slate-400 italic">None</span> },
    { key: 'status', label: 'Status', width: 'w-28 text-center', render: (v) => <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded border bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]">{String(v || 'PUBLISHED').toUpperCase()}</span> },
    { key: 'actions', label: 'Actions', width: 'min-w-[210px] text-center', truncate: false, render: (_, art) => {
      const pdfUrl = art.published_url || art.manuscript_url;
      return (
        <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
          {pdfUrl ? (
            <button
              type="button"
              onClick={() => handlePreviewPdf(pdfUrl, art.title)}
              className="text-blue-700 hover:text-blue-900 text-xs font-bold bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded border border-blue-300 inline-flex items-center gap-1 cursor-pointer transition-all shadow-xs"
              title="View Publication PDF"
            >
              <FaEye /> PDF
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => handleOpenEditModal(art)}
            className="text-slate-800 hover:text-slate-950 text-xs font-bold bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded border border-slate-300 inline-flex items-center gap-1 cursor-pointer transition-all shadow-xs"
            title="Edit Publication"
          >
            <FaEdit /> Edit
          </button>
          <button
            type="button"
            onClick={() => handleDelete(art.article_id)}
            className="text-red-700 hover:text-red-900 text-xs font-bold bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded border border-red-300 inline-flex items-center gap-1 cursor-pointer transition-all shadow-xs"
            title="Delete Publication"
          >
            <FaTrash /> Delete
          </button>
        </div>
      );
    }}
  ];
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [previewPdfUrl, setPreviewPdfUrl] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [editingArticle, setEditingArticle] = useState(null);
  
  // Quick Volume/Issue creation state
  const [showNewVolInline, setShowNewVolInline] = useState(false);
  const [showNewIssInline, setShowNewIssInline] = useState(false);
  const [newVolNumber, setNewVolNumber] = useState('');
  const [newVolYear, setNewVolYear] = useState(new Date().getFullYear().toString());
  const [newVolTitle, setNewVolTitle] = useState('');
  const [newIssNumber, setNewIssNumber] = useState('');
  const [newIssTitle, setNewIssTitle] = useState('');

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    title: '',
    author_name: '',
    author_email: '',
    volume_id: '',
    issue_id: '',
    abstract: '',
    keywords: '',
    category: '',
    doi: '',
    page_range: '',
    status: 'published',
    pdfFile: null,
    externalPdfUrl: '',
    published_pdf_id: null,
    manuscript_pdf_id: null
  });

  const [submitting, setSubmitting] = useState(false);

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [volRes, artRes, issRes] = await Promise.all([
        apiFetch('/volumes?with_issues=true'),
        apiFetch('/articles'),
        apiFetch('/issues')
      ]);

      if (volRes && volRes.data) setVolumes(volRes.data);
      if (artRes && artRes.data) setArticles(artRes.data);
      if (issRes && issRes.data) setIssues(issRes.data);
    } catch (err) {
      console.error('Failed to load archive data:', err);
      toast.error('Failed to load publications & volumes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter issues based on selected volume in form
  const availableIssuesInForm = formData.volume_id
    ? issues.filter(i => String(i.volume_id) === String(formData.volume_id))
    : issues;

  // Filter issues based on selected volume in filter toolbar
  const availableIssuesInFilter = selectedVolumeFilter !== 'ALL'
    ? issues.filter(i => String(i.volume_id) === String(selectedVolumeFilter))
    : issues;

  // Open Modal for Create
  const handleOpenCreateModal = () => {
    setEditingArticle(null);
    const defaultVol = volumes.length > 0 ? volumes[0].volume_id : '';
    const defaultIss = issues.filter(i => String(i.volume_id) === String(defaultVol))[0]?.issue_id || '';
    
    setFormData({
      title: '',
      author_name: '',
      author_email: '',
      volume_id: defaultVol,
      issue_id: defaultIss,
      abstract: '',
      keywords: '',
      category: '',
      doi: '',
      page_range: '',
      status: 'published',
      pdfFile: null,
      externalPdfUrl: '',
      published_pdf_id: null,
      manuscript_pdf_id: null
    });
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (art) => {
    setEditingArticle(art);
    setFormData({
      title: art.title || '',
      author_name: art.author_name || '',
      author_email: art.author_email || '',
      volume_id: art.volume_id || '',
      issue_id: art.issue_id || '',
      abstract: art.abstract || '',
      keywords: art.keywords || '',
      category: '',
      doi: art.doi || '',
      page_range: art.page_range || '',
      status: art.status || 'published',
      pdfFile: null,
      externalPdfUrl: art.published_url || art.manuscript_url || '',
      published_pdf_id: art.published_pdf_id,
      manuscript_pdf_id: art.manuscript_pdf_id
    });
    setIsModalOpen(true);
  };

  // Inline Volume Creation
  const handleCreateVolumeInline = async () => {
    if (!newVolNumber || !newVolYear) {
      toast.warn('Please provide volume number and year');
      return;
    }
    try {
      const res = await apiFetch('/volumes', {
        method: 'POST',
        body: {
          volume_number: parseInt(newVolNumber),
          publication_year: parseInt(newVolYear),
          volume_title: newVolTitle || `Volume ${newVolNumber} (${newVolYear})`,
          is_published: 1
        }
      });
      toast.success('Volume created successfully!');
      setShowNewVolInline(false);
      setNewVolNumber('');
      setNewVolTitle('');
      await fetchData();
      if (res.data?.volume_id) {
        setFormData(prev => ({ ...prev, volume_id: res.data.volume_id }));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create volume');
    }
  };

  // Inline Issue Creation
  const handleCreateIssueInline = async () => {
    if (!formData.volume_id) {
      toast.warn('Please select a volume first');
      return;
    }
    if (!newIssNumber) {
      toast.warn('Please provide issue number');
      return;
    }
    try {
      const res = await apiFetch('/issues', {
        method: 'POST',
        body: {
          volume_id: parseInt(formData.volume_id),
          issue_number: parseInt(newIssNumber),
          issue_title: newIssTitle || `Issue ${newIssNumber}`,
          is_published: 1
        }
      });
      toast.success('Issue created successfully!');
      setShowNewIssInline(false);
      setNewIssNumber('');
      setNewIssTitle('');
      await fetchData();
      if (res.data?.issue_id) {
        setFormData(prev => ({ ...prev, issue_id: res.data.issue_id }));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create issue');
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.warn('Article title is required');
      return;
    }
    if (!formData.author_name.trim()) {
      toast.warn('Author name is required');
      return;
    }

    setSubmitting(true);
    try {
      let docId = editingArticle ? (formData.published_pdf_id || formData.manuscript_pdf_id) : null;

      // 1. If physical PDF file is uploaded, upload to backend with structured journals path
      if (formData.pdfFile) {
        const uploadForm = new FormData();
        uploadForm.append('file', formData.pdfFile);
        uploadForm.append('volume_id', formData.volume_id);
        uploadForm.append('issue_id', formData.issue_id);
        uploadForm.append('folder', 'journals');

        const uploadRes = await apiFetch('/docs', {
          method: 'POST',
          body: uploadForm
        });

        if (uploadRes && uploadRes.data && uploadRes.data.doc_id) {
          docId = uploadRes.data.doc_id;
        }
      } else if (!docId && formData.externalPdfUrl.trim()) {
        // Create mock doc record for external URL
        const docRes = await apiFetch('/docs', {
          method: 'POST',
          body: {
            uploaded_by: 1,
            file_name: `${formData.title.substring(0, 30)}.pdf`,
            s3_url: formData.externalPdfUrl.trim(),
            mime_type: 'application/pdf',
            file_size_bytes: 1024000
          }
        });
        if (docRes && docRes.data) {
          docId = docRes.data.doc_id;
        }
      }

      if (!docId) {
        toast.warn('Please upload a PDF file or provide a valid PDF link');
        setSubmitting(false);
        return;
      }

      // 2. Create or Update Article
      const payload = {
        title: formData.title.trim(),
        author_name: formData.author_name.trim(),
        author_email: formData.author_email.trim(),
        issue_id: formData.issue_id ? parseInt(formData.issue_id) : null,
        abstract: formData.abstract.trim(),
        keywords: formData.keywords?.trim() || null,
        status: formData.status || 'published',
        doi: formData.doi.trim() || null,
        page_range: formData.page_range.trim() || null,
        manuscript_pdf_id: docId,
        published_pdf_id: docId
      };

      if (editingArticle) {
        await apiFetch(`/articles?id=${editingArticle.article_id}`, {
          method: 'PUT',
          body: payload
        });
        toast.success('Archived journal updated successfully!');
      } else {
        await apiFetch('/articles', {
          method: 'POST',
          body: payload
        });
        toast.success('New journal added to archives and published!');
      }

      setIsModalOpen(false);
      await fetchData();
    } catch (err) {
      console.error('Error saving article:', err);
      toast.error(err.message || 'Failed to save publication');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Article
  const handleDelete = async (articleId) => {
    if (!articleId) {
      toast.error('Invalid article ID');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this publication from archives?')) return;
    try {
      await apiFetch(`/articles?id=${articleId}`, { method: 'DELETE' });
      toast.success('Publication deleted successfully');
      setArticles(prev => prev.filter(a => String(a.article_id) !== String(articleId)));
      fetchData();
    } catch (err) {
      console.error('Failed to delete publication:', err);
      toast.error(err.message || 'Failed to delete publication');
    }
  };

  const handleDeleteArticle = handleDelete;

  // Preview PDF Modal
  const handlePreviewPdf = (url, title) => {
    if (!url) {
      toast.info('No PDF URL available for this publication');
      return;
    }
    setPreviewPdfUrl(resolveFileUrl(url));
    setPreviewTitle(title);
    setIsPdfModalOpen(true);
  };

  // Filtered list
  const filteredArticles = articles.filter(art => {
    const matchesSearch = searchQuery === '' ||
      art.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.author_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.doi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.abstract?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesVolume = selectedVolumeFilter === 'ALL' ||
      String(art.volume_id) === String(selectedVolumeFilter);

    const matchesIssue = selectedIssueFilter === 'ALL' ||
      String(art.issue_id) === String(selectedIssueFilter);

    return matchesSearch && matchesVolume && matchesIssue;
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#2C2C2C] to-[#3D3A37] text-gray-100 p-8 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2.5 bg-amber-500/20 text-amber-300 rounded-xl">
              <FaArchive className="w-6 h-6" />
            </span>
            <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Publications Hub</span>
          </div>
          <h1 className="text-3xl font-sans font-bold text-white tracking-tight">
            Journal Archives & Publications
          </h1>
          <p className="text-gray-400 text-sm mt-1 max-w-2xl">
            Add, edit, and organize old and newly published journal papers. Uploaded PDFs are automatically organized by volume and issue folders on the server.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2.5 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3.5 rounded-xl font-medium shadow-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <FaPlus className="w-4 h-4" />
          <span>Add Journal to Archives</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl font-bold">
            <FaLayerGroup />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{volumes.length}</div>
            <div className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Total Volumes</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl font-bold">
            <FaBookOpen />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{issues.length}</div>
            <div className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Total Issues</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-xl font-bold">
            <FaFilePdf />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{articles.length}</div>
            <div className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Published Articles</div>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, author, DOI, keywords..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400 transition-all"
          />
        </div>

        {/* Volume & Issue Selectors */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase text-gray-500">Volume:</span>
            <select
              value={selectedVolumeFilter}
              onChange={(e) => {
                setSelectedVolumeFilter(e.target.value);
                setSelectedIssueFilter('ALL');
              }}
              className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-gray-400"
            >
              <option value="ALL">All Volumes</option>
              {volumes.map(v => (
                <option key={v.volume_id} value={v.volume_id}>
                  {v.volume_title || `Volume ${v.volume_number} (${v.publication_year})`}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase text-gray-500">Issue:</span>
            <select
              value={selectedIssueFilter}
              onChange={(e) => setSelectedIssueFilter(e.target.value)}
              className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-gray-400"
            >
              <option value="ALL">All Issues</option>
              {availableIssuesInFilter.map(i => (
                <option key={i.issue_id} value={i.issue_id}>
                  {i.issue_title || `Issue ${i.issue_number}`}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-300">
            <button
              onClick={() => setViewMode('sheet')}
              className={`px-3 py-1 text-xs font-bold rounded-md flex items-center gap-1 transition-all ${
                viewMode === 'sheet' ? 'bg-[#107C41] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FaFileExcel /> Sheet View
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 text-xs font-bold rounded-md flex items-center gap-1 transition-all ${
                viewMode === 'cards' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FaThLarge /> Card View
            </button>
          </div>
        </div>
      </div>

      {/* Articles List / Excel Sheet */}
      {viewMode === 'sheet' ? (
        <ExcelDataSheet
          sheetName="Archive_Publications"
          workbookName="OJS_Archive_Publications.xlsx"
          columns={archiveColumns}
          data={filteredArticles}
          loading={loading}
          onRefresh={fetchData}
          formulaText={`=ARCHIVES!A1:G${filteredArticles.length} [VOL=${selectedVolumeFilter}, ISS=${selectedIssueFilter}]`}
          emptyMessage="No publications matched criteria in spreadsheet."
        />
      ) : loading ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <div className="animate-spin w-8 h-8 border-3 border-gray-400 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading archives & publications...</p>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8">
          <div className="w-16 h-16 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            <FaArchive />
          </div>
          <h3 className="text-xl font-bold text-gray-900">No Publications Found</h3>
          <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
            {searchQuery || selectedVolumeFilter !== 'ALL' 
              ? 'No articles matched your filter criteria. Try adjusting your search query.'
              : 'You haven\'t added any publications to the archives yet. Click below to add your first journal paper!'}
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="mt-5 inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors text-sm"
          >
            <FaPlus /> Add First Publication
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filteredArticles.map((art) => {
              const pdfUrl = art.published_url || art.manuscript_url;
              return (
                <div key={art.article_id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {art.status.toUpperCase()}
                      </span>
                      {art.volume_number && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                          Vol {art.volume_number} ({art.publication_year})
                        </span>
                      )}
                      {art.issue_number && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                          Issue {art.issue_number}
                        </span>
                      )}
                      {art.page_range && (
                        <span className="text-xs text-gray-500">
                          Pages: {art.page_range}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                      {art.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5 font-medium text-gray-600">
                        <FaUser className="text-gray-500" />
                        <span>{art.author_name || 'Anonymous Author'}</span>
                      </div>
                      {art.doi && (
                        <div className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          DOI: {art.doi}
                        </div>
                      )}
                      {art.created_at && (
                        <div>Added: {new Date(art.created_at).toLocaleDateString()}</div>
                      )}
                    </div>

                    {art.abstract && (
                      <p className="text-xs text-gray-500 line-clamp-2 pt-1 font-sans italic">
                        "{art.abstract}"
                      </p>
                    )}

                    {art.keywords && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {art.keywords.split(',').map((kw, i) => kw.trim() && (
                          <span key={i} className="inline-block text-[10px] font-semibold bg-white text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full">
                            #{kw.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    {pdfUrl && (
                      <button
                        onClick={() => handlePreviewPdf(pdfUrl, art.title)}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-xl text-xs font-semibold border border-amber-200 transition-colors"
                        title="View PDF"
                      >
                        <FaEye /> View PDF
                      </button>
                    )}

                    <button
                      onClick={() => handleOpenEditModal(art)}
                      className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
                      title="Edit Publication"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(art.article_id)}
                      className="p-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                      title="Delete Publication"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add / Edit Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 sm:p-8 shadow-lg border border-gray-200 my-8 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-5 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold font-sans text-gray-900">
                  {editingArticle ? 'Edit Archived Journal' : 'Add New Journal to Archives'}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Uploaded files will be stored in structured <code className="bg-gray-50 px-1 py-0.5 rounded text-amber-900">journals/Volume_X_YYYY/Issue_Y/</code> directories.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-black/5 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 pt-6">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Journal / Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. BRIDGING CINEMATIC NARRATIVES AND LITERARY DEPTHS..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400"
                />
              </div>

              {/* Author & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Author Name(s) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author_name}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    placeholder="e.g. Dr. Rakesh Kaibartya"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Author Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.author_email}
                    onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
                    placeholder="author@example.com"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400"
                  />
                </div>
              </div>

              {/* Volume & Issue selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Volume Selector */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                      Volume
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowNewVolInline(!showNewVolInline)}
                      className="text-xs text-gray-500 hover:underline font-semibold"
                    >
                      + New Volume
                    </button>
                  </div>

                  {showNewVolInline ? (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2 mb-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Vol #"
                          value={newVolNumber}
                          onChange={(e) => setNewVolNumber(e.target.value)}
                          className="px-2.5 py-1.5 border rounded text-xs bg-white"
                        />
                        <input
                          type="number"
                          placeholder="Year"
                          value={newVolYear}
                          onChange={(e) => setNewVolYear(e.target.value)}
                          className="px-2.5 py-1.5 border rounded text-xs bg-white"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Volume Title (optional)"
                        value={newVolTitle}
                        onChange={(e) => setNewVolTitle(e.target.value)}
                        className="w-full px-2.5 py-1.5 border rounded text-xs bg-white"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleCreateVolumeInline}
                          className="px-3 py-1 bg-gray-900 text-white rounded text-xs font-medium"
                        >
                          Save Volume
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowNewVolInline(false)}
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : null}

                  <select
                    value={formData.volume_id}
                    onChange={(e) => {
                      setFormData({ ...formData, volume_id: e.target.value, issue_id: '' });
                    }}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-gray-400"
                  >
                    <option value="">-- No Volume (Unassigned) --</option>
                    {volumes.map(v => (
                      <option key={v.volume_id} value={v.volume_id}>
                        {v.volume_title || `Volume ${v.volume_number} (${v.publication_year})`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Issue Selector */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                      Issue
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowNewIssInline(!showNewIssInline)}
                      className="text-xs text-gray-500 hover:underline font-semibold"
                    >
                      + New Issue
                    </button>
                  </div>

                  {showNewIssInline ? (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2 mb-2">
                      <input
                        type="number"
                        placeholder="Issue #"
                        value={newIssNumber}
                        onChange={(e) => setNewIssNumber(e.target.value)}
                        className="w-full px-2.5 py-1.5 border rounded text-xs bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Issue Title (optional)"
                        value={newIssTitle}
                        onChange={(e) => setNewIssTitle(e.target.value)}
                        className="w-full px-2.5 py-1.5 border rounded text-xs bg-white"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleCreateIssueInline}
                          className="px-3 py-1 bg-gray-900 text-white rounded text-xs font-medium"
                        >
                          Save Issue
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowNewIssInline(false)}
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : null}

                  <select
                    value={formData.issue_id}
                    onChange={(e) => setFormData({ ...formData, issue_id: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-gray-400"
                  >
                    <option value="">-- No Issue (Unassigned) --</option>
                    {availableIssuesInForm.map(i => (
                      <option key={i.issue_id} value={i.issue_id}>
                        {i.issue_title || `Issue ${i.issue_number}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* DOI and Page Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    DOI (e.g. 10.1234/tls.2025.01)
                  </label>
                  <input
                    type="text"
                    value={formData.doi}
                    onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                    placeholder="10.1234/tls.2025.01"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Page Range (e.g. 26-30)
                  </label>
                  <input
                    type="text"
                    value={formData.page_range}
                    onChange={(e) => setFormData({ ...formData, page_range: e.target.value })}
                    placeholder="26-30"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-gray-400"
                  />
                </div>
              </div>

              {/* Abstract */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Abstract / Summary
                </label>
                <textarea
                  rows="3"
                  value={formData.abstract}
                  onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                  placeholder="Provide a concise abstract of the paper..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-gray-400"
                />
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Keywords / Research Topics (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="e.g. Mythological Fiction, Cinema Studies, Folk Art, Eco-criticism"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-gray-400"
                />
              </div>

              {/* PDF Document Upload */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                  Manuscript / Published PDF *
                </label>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <label className="flex-1 w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 hover:border-gray-400 rounded-2xl cursor-pointer bg-white transition-all hover:bg-amber-50/20">
                    <FaCloudUploadAlt className="w-8 h-8 text-gray-500 mb-2" />
                    <span className="text-xs font-bold text-gray-900">
                      {formData.pdfFile ? formData.pdfFile.name : 'Upload PDF File from Computer'}
                    </span>
                    <span className="text-[11px] text-gray-500 mt-0.5">
                      Will be saved in journals/ folder structure
                    </span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFormData({ ...formData, pdfFile: e.target.files[0] });
                        }
                      }}
                    />
                  </label>

                  <div className="text-xs font-bold text-gray-500 uppercase">OR</div>

                  <div className="flex-1 w-full">
                    <input
                      type="url"
                      value={formData.externalPdfUrl}
                      onChange={(e) => setFormData({ ...formData, externalPdfUrl: e.target.value })}
                      placeholder="Paste PDF URL (e.g., https://.../paper.pdf)"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Publication Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-gray-400"
                >
                  <option value="published">Published (Visible on Home & Archives)</option>
                  <option value="accepted">Accepted (Pending Publication)</option>
                  <option value="under_review">Under Review</option>
                  <option value="submitted">Submitted</option>
                </select>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 font-medium text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-7 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingArticle ? 'Update Publication' : 'Add Publication'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF Preview Modal */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-5xl w-full h-[90vh] shadow-lg flex flex-col overflow-hidden animate-scaleUp">
            <div className="p-4 sm:p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-3">
                <FaFilePdf className="w-5 h-5 text-red-600" />
                <h3 className="font-sans font-bold text-gray-900 text-sm sm:text-base truncate max-w-xl">
                  {previewTitle}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-black/5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
                >
                  <FaDownload /> Download
                </a>
                <button
                  onClick={() => setIsPdfModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-black/5 transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-gray-900">
              <iframe
                src={previewPdfUrl}
                title={previewTitle}
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchiveManagement;
