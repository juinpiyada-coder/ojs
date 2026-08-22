import React, { useState, useEffect } from 'react';
import { 
  FaPaintBrush, FaCheck, FaEye, FaCloudUploadAlt, FaMagic, 
  FaUndo, FaPalette, FaGlobe, FaShieldAlt, FaUser, FaSave, FaImage
} from 'react-icons/fa';
import { apiFetch, resolveFileUrl } from '../../../utils/api';
import { toast } from 'react-toastify';
import { useBrand } from '../../../context/BrandingContext';

const PRESET_PALETTES = [
  {
    name: 'Emerald Scholar',
    badge: 'Popular',
    public_primary_hex: '#0F5132',
    public_secondary_hex: '#F0FDF4',
    admin_dash_bg_hex: '#FFFFFF',
    admin_dash_accent_hex: '#107C41',
    user_dash_bg_hex: '#FFFFFF',
    user_dash_accent_hex: '#059669'
  },
  {
    name: 'Academic Slate & Gold',
    badge: 'Classic',
    public_primary_hex: '#1E2530',
    public_secondary_hex: '#FDFBF7',
    admin_dash_bg_hex: '#FFFFFF',
    admin_dash_accent_hex: '#D4AF37',
    user_dash_bg_hex: '#FFFFFF',
    user_dash_accent_hex: '#B8860B'
  },
  {
    name: 'Royal Navy',
    badge: 'Formal',
    public_primary_hex: '#0A2540',
    public_secondary_hex: '#F4F8FA',
    admin_dash_bg_hex: '#FFFFFF',
    admin_dash_accent_hex: '#0066CC',
    user_dash_bg_hex: '#FFFFFF',
    user_dash_accent_hex: '#0284C7'
  },
  {
    name: 'Crimson Journal',
    badge: 'Humanities',
    public_primary_hex: '#78151D',
    public_secondary_hex: '#FFF5F5',
    admin_dash_bg_hex: '#FFFFFF',
    admin_dash_accent_hex: '#991B1B',
    user_dash_bg_hex: '#FFFFFF',
    user_dash_accent_hex: '#DC2626'
  },
  {
    name: 'Midnight Monochrome',
    badge: 'Modern',
    public_primary_hex: '#18181B',
    public_secondary_hex: '#FAFAFA',
    admin_dash_bg_hex: '#FFFFFF',
    admin_dash_accent_hex: '#27272A',
    user_dash_bg_hex: '#FFFFFF',
    user_dash_accent_hex: '#52525B'
  }
];

const BrandingUI = () => {
  const [brand, setBrand] = useState({
    brand_id: 1,
    journal_title: 'The Literary Scientist',
    logo_doc_id: null,
    logo_url: '',
    favicon_doc_id: null,
    favicon_url: '',
    public_primary_hex: '#2C2C2C',
    public_secondary_hex: '#F9F6F0',
    admin_dash_bg_hex: '#FFFFFF',
    admin_dash_accent_hex: '#1E2530',
    user_dash_bg_hex: '#FFFFFF',
    user_dash_accent_hex: '#8E7C68'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'colors' | 'presets' | 'preview'

  useEffect(() => {
    fetchBrand();
  }, []);

  const fetchBrand = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/branding');
      if (res && res.data && res.data.length > 0) {
        const item = res.data[0];
        setBrand({
          brand_id: item.brand_id || 1,
          journal_title: item.journal_title || 'The Literary Scientist',
          logo_doc_id: item.logo_doc_id || null,
          logo_url: item.logo_url || '',
          favicon_doc_id: item.favicon_doc_id || null,
          favicon_url: item.favicon_url || '',
          public_primary_hex: item.public_primary_hex || '#2C2C2C',
          public_secondary_hex: item.public_secondary_hex || '#F9F6F0',
          admin_dash_bg_hex: item.admin_dash_bg_hex || '#FFFFFF',
          admin_dash_accent_hex: item.admin_dash_accent_hex || '#1E2530',
          user_dash_bg_hex: item.user_dash_bg_hex || '#FFFFFF',
          user_dash_accent_hex: item.user_dash_accent_hex || '#8E7C68'
        });
      }
    } catch (err) {
      console.error('Failed to load branding:', err);
      toast.error('Failed to load white-labeling configurations');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPreset = (preset) => {
    setBrand(prev => ({
      ...prev,
      public_primary_hex: preset.public_primary_hex,
      public_secondary_hex: preset.public_secondary_hex,
      admin_dash_bg_hex: preset.admin_dash_bg_hex,
      admin_dash_accent_hex: preset.admin_dash_accent_hex,
      user_dash_bg_hex: preset.user_dash_bg_hex,
      user_dash_accent_hex: preset.user_dash_accent_hex
    }));
    toast.info(`Applied palette: "${preset.name}". Click 'Save White-Labeling' to persist.`);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      const docPayload = new FormData();
      docPayload.append('uploaded_by', 1);
      docPayload.append('file', file);
      docPayload.append('folder', 'branding');

      const docRes = await apiFetch('/docs', {
        method: 'POST',
        body: docPayload
      });

      if (docRes && docRes.data && docRes.data.doc_id) {
        const logoUrl = docRes.data.s3_url || '';
        setBrand(prev => ({
          ...prev,
          logo_doc_id: docRes.data.doc_id,
          logo_url: logoUrl
        }));
        toast.success('Brand logo uploaded successfully! Click "Save White-Labeling" to persist.');
      }
    } catch (err) {
      console.error('Logo upload error:', err);
      toast.error('Failed to upload logo: ' + (err.message || 'Server error'));
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleRemoveLogo = () => {
    setBrand(prev => ({
      ...prev,
      logo_doc_id: null,
      logo_url: ''
    }));
    toast.info('Custom logo removed. Click "Save White-Labeling" to persist.');
  };

  const { updateBrand: syncGlobalBrand } = useBrand();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!brand.journal_title?.trim()) {
      toast.error('Journal Title is required.');
      return;
    }

    setSaving(true);

    const payload = {
      brand_id: brand.brand_id || 1,
      journal_title: brand.journal_title.trim(),
      logo_doc_id: brand.logo_doc_id ? parseInt(brand.logo_doc_id) : null,
      public_primary_hex: brand.public_primary_hex || '#0F5132',
      public_secondary_hex: brand.public_secondary_hex || '#F0FDF4',
      admin_dash_bg_hex: brand.admin_dash_bg_hex || '#FFFFFF',
      admin_dash_accent_hex: brand.admin_dash_accent_hex || '#107C41',
      user_dash_bg_hex: brand.user_dash_bg_hex || '#FFFFFF',
      user_dash_accent_hex: brand.user_dash_accent_hex || '#059669',
      last_updated_by: 1
    };

    try {
      const updated = await syncGlobalBrand(payload);
      setBrand(prev => ({ ...prev, ...(updated || payload) }));
      toast.success('White-labeling & branding updated successfully across all portals!');
    } catch (err) {
      console.error('Branding save error:', err);
      toast.error('Failed to save branding: ' + (err.message || 'Server error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 font-sans">
        <div className="animate-spin w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full mx-auto mb-3" />
        <p className="font-semibold text-sm">Loading White-Labeling Configurations...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 animate-fadeIn font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1B2A32] to-[#2C3E50] text-white p-8 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <FaPaintBrush className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase tracking-widest text-emerald-300 font-semibold font-mono">White-Label Engine</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            White-Labeling & Brand Customizer
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Customize journal titles, public portal identity, logos, and dashboard color themes with instant live multi-portal synchronisation.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
        >
          <FaSave />
          <span>{saving ? 'Saving Changes...' : 'Save White-Labeling'}</span>
        </button>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('general')}
          className={`pb-3 flex items-center gap-2 transition-all border-b-2 ${
            activeTab === 'general' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FaGlobe /> Journal Identity & Logos
        </button>
        <button
          onClick={() => setActiveTab('colors')}
          className={`pb-3 flex items-center gap-2 transition-all border-b-2 ${
            activeTab === 'colors' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FaPalette /> Color Palette Customizer
        </button>
        <button
          onClick={() => setActiveTab('presets')}
          className={`pb-3 flex items-center gap-2 transition-all border-b-2 ${
            activeTab === 'presets' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FaMagic /> Curated Theme Presets
        </button>
      </div>

      {/* Tab 1: General Identity & Logos */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Identity Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <FaGlobe className="text-emerald-600" /> Portal Identity
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Official Journal Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={brand.journal_title}
                onChange={e => setBrand({ ...brand, journal_title: e.target.value })}
                placeholder="e.g. The Literary Scientist"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl font-bold text-slate-900 text-base focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all bg-slate-50 focus:bg-white"
              />
              <p className="text-xs text-slate-500 mt-1.5">
                Displays in the public navbar, footer, search indexing, and metadata headers.
              </p>
            </div>

            {/* Quick Live Preview Snippet */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Live Title & Logo Preview</span>
              <div className="bg-[#1E2530] text-white p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  {brand?.logo_url ? (
                    <img 
                      src={resolveFileUrl(brand.logo_url)} 
                      alt="Logo" 
                      className="h-7 w-auto max-w-[100px] object-contain rounded bg-white/10 p-0.5" 
                    />
                  ) : (
                    <div 
                      className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white"
                      style={{ backgroundColor: brand?.admin_dash_accent_hex || '#107C41' }}
                    >
                      {brand.journal_title.charAt(0) || 'J'}
                    </div>
                  )}
                  <span className="font-bold text-sm tracking-tight truncate">{brand.journal_title || 'Journal Title'}</span>
                </div>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono shrink-0">LIVE PREVIEW</span>
              </div>
            </div>
          </div>

          {/* Logo & Favicon Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <FaImage className="text-emerald-600" /> Brand Logo Asset
            </h2>

            {/* Logo Upload */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Upload Journal Logo (PNG, SVG, JPG, WebP)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    onChange={handleLogoUpload}
                    className="text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200 cursor-pointer"
                  />
                  {uploadingLogo && <span className="text-xs text-emerald-600 font-bold animate-pulse">Uploading...</span>}
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                  Displays in the public navbar header and the administration dashboard sidebar.
                </p>
              </div>

              {brand.logo_url && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={resolveFileUrl(brand.logo_url)} 
                      alt="Logo Preview" 
                      className="h-12 w-auto max-w-[140px] object-contain rounded bg-white p-1 border border-slate-200 shadow-2xs" 
                    />
                    <div className="text-xs min-w-0">
                      <p className="font-bold text-slate-800">Active Brand Logo</p>
                      <p className="text-[10px] text-slate-500 font-mono truncate max-w-xs">{brand.logo_url}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0"
                  >
                    Remove Logo
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* Tab 2: Colors Customizer */}
      {activeTab === 'colors' && (
        <div className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Public Portal Palette */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <FaGlobe className="text-emerald-600" /> Public Portal Theme
                </h3>
                <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">PUBLIC</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Primary Brand Hex</span>
                  <span className="font-mono text-[11px] text-slate-500 font-bold">{brand.public_primary_hex}</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={brand.public_primary_hex || '#2C2C2C'}
                    onChange={e => setBrand({ ...brand, public_primary_hex: e.target.value })}
                    className="h-10 w-16 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                  />
                  <input
                    type="text"
                    value={brand.public_primary_hex || ''}
                    onChange={e => setBrand({ ...brand, public_primary_hex: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Secondary Surface Hex</span>
                  <span className="font-mono text-[11px] text-slate-500 font-bold">{brand.public_secondary_hex}</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={brand.public_secondary_hex || '#F9F6F0'}
                    onChange={e => setBrand({ ...brand, public_secondary_hex: e.target.value })}
                    className="h-10 w-16 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                  />
                  <input
                    type="text"
                    value={brand.public_secondary_hex || ''}
                    onChange={e => setBrand({ ...brand, public_secondary_hex: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Admin Dashboard Theme */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <FaShieldAlt className="text-slate-800" /> Admin Dashboard Theme
                </h3>
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-300">ADMIN</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Dashboard Background</span>
                  <span className="font-mono text-[11px] text-slate-500 font-bold">{brand.admin_dash_bg_hex}</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={brand.admin_dash_bg_hex || '#FFFFFF'}
                    onChange={e => setBrand({ ...brand, admin_dash_bg_hex: e.target.value })}
                    className="h-10 w-16 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                  />
                  <input
                    type="text"
                    value={brand.admin_dash_bg_hex || ''}
                    onChange={e => setBrand({ ...brand, admin_dash_bg_hex: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Sidebar & Accent Hex</span>
                  <span className="font-mono text-[11px] text-slate-500 font-bold">{brand.admin_dash_accent_hex}</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={brand.admin_dash_accent_hex || '#1E2530'}
                    onChange={e => setBrand({ ...brand, admin_dash_accent_hex: e.target.value })}
                    className="h-10 w-16 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                  />
                  <input
                    type="text"
                    value={brand.admin_dash_accent_hex || ''}
                    onChange={e => setBrand({ ...brand, admin_dash_accent_hex: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Author & Reviewer Portal Theme */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <FaUser className="text-blue-600" /> User Portal Theme
                </h3>
                <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">PORTAL</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>User Portal BG</span>
                  <span className="font-mono text-[11px] text-slate-500 font-bold">{brand.user_dash_bg_hex}</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={brand.user_dash_bg_hex || '#FFFFFF'}
                    onChange={e => setBrand({ ...brand, user_dash_bg_hex: e.target.value })}
                    className="h-10 w-16 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                  />
                  <input
                    type="text"
                    value={brand.user_dash_bg_hex || ''}
                    onChange={e => setBrand({ ...brand, user_dash_bg_hex: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>User Portal Accent</span>
                  <span className="font-mono text-[11px] text-slate-500 font-bold">{brand.user_dash_accent_hex}</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={brand.user_dash_accent_hex || '#8E7C68'}
                    onChange={e => setBrand({ ...brand, user_dash_accent_hex: e.target.value })}
                    className="h-10 w-16 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                  />
                  <input
                    type="text"
                    value={brand.user_dash_accent_hex || ''}
                    onChange={e => setBrand({ ...brand, user_dash_accent_hex: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Tab 3: Presets */}
      {activeTab === 'presets' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-base font-bold text-slate-900">Choose a Curated Editorial Colorway</h2>
            <span className="text-xs text-slate-500">Click any card to load its hex palette</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRESET_PALETTES.map((preset, pIdx) => (
              <div
                key={pIdx}
                onClick={() => handleApplyPreset(preset)}
                className="bg-white p-5 rounded-2xl border-2 border-slate-200 hover:border-emerald-600 transition-all cursor-pointer shadow-xs hover:shadow-md group space-y-3"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                    {preset.name}
                  </h3>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {preset.badge}
                  </span>
                </div>

                <div className="flex h-8 rounded-lg overflow-hidden border border-slate-200">
                  <div className="flex-1 flex items-center justify-center text-[10px] font-mono font-bold text-white" style={{ backgroundColor: preset.public_primary_hex }}>
                    Pri
                  </div>
                  <div className="flex-1 flex items-center justify-center text-[10px] font-mono font-bold text-slate-800" style={{ backgroundColor: preset.public_secondary_hex }}>
                    Sec
                  </div>
                  <div className="flex-1 flex items-center justify-center text-[10px] font-mono font-bold text-white" style={{ backgroundColor: preset.admin_dash_accent_hex }}>
                    Acc
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full py-1.5 text-xs font-bold text-slate-700 bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white rounded-lg transition-all"
                >
                  Apply Palette
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Action Footer */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Ready to update portal branding?</h4>
          <p className="text-xs text-slate-500">Changes will take effect instantly across public pages, administration, and author dashboards.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchBrand}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
          >
            Reset Form
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            <FaCheck />
            <span>{saving ? 'Saving...' : 'Save White-Labeling'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default BrandingUI;
