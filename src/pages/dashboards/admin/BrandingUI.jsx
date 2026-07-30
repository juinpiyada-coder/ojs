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
      // The backend returns an array of brands, we'll just edit the first one, or create one if empty
      if (data.data && data.data.length > 0) {
        setBrand(data.data[0]);
      } else {
        setBrand({
          journal_title: 'Open Journal System',
          public_primary_hex: '#2C2C2C',
          public_secondary_hex: '#F9F6F0',
          admin_dash_bg_hex: '#FAF9F6',
          admin_dash_accent_hex: '#8E7C68',
          user_dash_bg_hex: '#FFFFFF',
          user_dash_accent_hex: '#737067'
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
        // Update existing
        await apiFetch(`/branding?id=${brand.brand_id}`, {
          method: 'PUT',
          body: brand
        });
        toast.success('Branding updated successfully!');
      } else {
        // Create new
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E5E0D8]">
      <h2 className="text-2xl font-bold text-[#2C2C2C] mb-6">Branding & UI</h2>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-semibold text-[#5C5446] mb-2">Journal Title</label>
          <input 
            type="text" 
            required
            value={brand.journal_title}
            onChange={e => setBrand({...brand, journal_title: e.target.value})}
            className="w-full px-4 py-3 border border-[#E5E0D8] rounded focus:outline-none focus:border-[#8E7C68]"
          />
        </div>
        
        <div className="pt-4 pb-2 border-b border-[#F0EBE1]">
          <h3 className="font-bold text-[#2C2C2C]">Public Portal Theme</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-[#5C5446] mb-2 flex items-center justify-between">
              Primary Color <span className="font-mono text-xs">{brand.public_primary_hex}</span>
            </label>
            <input 
              type="color" 
              value={brand.public_primary_hex || '#000000'} 
              onChange={e => setBrand({...brand, public_primary_hex: e.target.value})}
              className="h-12 w-full rounded cursor-pointer border border-[#E5E0D8]" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#5C5446] mb-2 flex items-center justify-between">
              Secondary Color <span className="font-mono text-xs">{brand.public_secondary_hex}</span>
            </label>
            <input 
              type="color" 
              value={brand.public_secondary_hex || '#ffffff'} 
              onChange={e => setBrand({...brand, public_secondary_hex: e.target.value})}
              className="h-12 w-full rounded cursor-pointer border border-[#E5E0D8]" 
            />
          </div>
        </div>

        <div className="pt-4 pb-2 border-b border-[#F0EBE1]">
          <h3 className="font-bold text-[#2C2C2C]">Admin Dashboard Theme</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-[#5C5446] mb-2 flex items-center justify-between">
              Background Color <span className="font-mono text-xs">{brand.admin_dash_bg_hex}</span>
            </label>
            <input 
              type="color" 
              value={brand.admin_dash_bg_hex || '#000000'} 
              onChange={e => setBrand({...brand, admin_dash_bg_hex: e.target.value})}
              className="h-12 w-full rounded cursor-pointer border border-[#E5E0D8]" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#5C5446] mb-2 flex items-center justify-between">
              Accent Color <span className="font-mono text-xs">{brand.admin_dash_accent_hex}</span>
            </label>
            <input 
              type="color" 
              value={brand.admin_dash_accent_hex || '#ffffff'} 
              onChange={e => setBrand({...brand, admin_dash_accent_hex: e.target.value})}
              className="h-12 w-full rounded cursor-pointer border border-[#E5E0D8]" 
            />
          </div>
        </div>
        
        <div className="pt-6">
          <button 
            type="submit" 
            disabled={saving}
            className="px-6 py-3 bg-[#2C2C2C] text-white rounded font-bold hover:bg-[#4A4A4A] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Update Branding'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BrandingUI;
