import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../utils/api';
import { toast } from 'react-toastify';

const BrandingUI = () => {
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBrand();
  }, []);

  const fetchBrand = async () => {
    try {
      const data = await apiFetch('/branding');
      if (data.data && data.data.length > 0) {
        setBrand(data.data[0]);
      } else {
        setBrand({
          journal_title: 'Open Journal System',
          public_primary_hex: '#1A1A1A',
          public_secondary_hex: '#FFFFFF',
          admin_dash_bg_hex: '#FFFFFF',
          admin_dash_accent_hex: '#8E7C68',
          user_dash_bg_hex: '#FFFFFF',
          user_dash_accent_hex: '#8E7C68'
        });
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (brand.brand_id) {
        await apiFetch(`/branding?id=${brand.brand_id}`, {
          method: 'PUT',
          body: brand
        });
        toast.success('Branding updated successfully!');
      } else {
        const res = await apiFetch('/branding', {
          method: 'POST',
          body: brand
        });
        setBrand({ ...brand, brand_id: res.data.brand_id });
        toast.success('Branding created successfully!');
      }
    } catch (err) {
      toast.error('Failed to save branding: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500 text-sm">Loading...</div>;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Branding & UI</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Journal Title</label>
          <input 
            type="text" 
            required
            value={brand.journal_title}
            onChange={e => setBrand({...brand, journal_title: e.target.value})}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
          />
        </div>
        
        <div className="pt-2 pb-2 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 text-sm">Public Portal Theme</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center justify-between">
              Primary <span className="font-mono text-[10px] text-gray-500">{brand.public_primary_hex}</span>
            </label>
            <input 
              type="color" 
              value={brand.public_primary_hex || '#000000'} 
              onChange={e => setBrand({...brand, public_primary_hex: e.target.value})}
              className="h-10 w-full rounded-lg cursor-pointer border border-gray-200" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center justify-between">
              Secondary <span className="font-mono text-[10px] text-gray-500">{brand.public_secondary_hex}</span>
            </label>
            <input 
              type="color" 
              value={brand.public_secondary_hex || '#ffffff'} 
              onChange={e => setBrand({...brand, public_secondary_hex: e.target.value})}
              className="h-10 w-full rounded-lg cursor-pointer border border-gray-200" 
            />
          </div>
        </div>

        <div className="pt-2 pb-2 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 text-sm">Admin Dashboard Theme</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center justify-between">
              Background <span className="font-mono text-[10px] text-gray-500">{brand.admin_dash_bg_hex}</span>
            </label>
            <input 
              type="color" 
              value={brand.admin_dash_bg_hex || '#000000'} 
              onChange={e => setBrand({...brand, admin_dash_bg_hex: e.target.value})}
              className="h-10 w-full rounded-lg cursor-pointer border border-gray-200" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center justify-between">
              Accent <span className="font-mono text-[10px] text-gray-500">{brand.admin_dash_accent_hex}</span>
            </label>
            <input 
              type="color" 
              value={brand.admin_dash_accent_hex || '#ffffff'} 
              onChange={e => setBrand({...brand, admin_dash_accent_hex: e.target.value})}
              className="h-10 w-full rounded-lg cursor-pointer border border-gray-200" 
            />
          </div>
        </div>
        
        <div className="pt-4">
          <button 
            type="submit" 
            disabled={saving}
            className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Update Branding'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BrandingUI;
