import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiFetch, resolveFileUrl } from '../utils/api';

const DEFAULT_BRAND = {
  brand_id: 1,
  journal_title: 'The Literary Scientist',
  logo_doc_id: null,
  logo_url: '',
  favicon_doc_id: null,
  favicon_url: '',
  public_primary_hex: '#0F5132',
  public_secondary_hex: '#F0FDF4',
  admin_dash_bg_hex: '#FFFFFF',
  admin_dash_accent_hex: '#107C41',
  user_dash_bg_hex: '#FFFFFF',
  user_dash_accent_hex: '#059669'
};

const BrandingContext = createContext({
  brand: DEFAULT_BRAND,
  updateBrand: async () => {},
  refreshBrand: async () => {},
  loading: false
});

export const BrandingProvider = ({ children }) => {
  const [brand, setBrand] = useState(() => {
    try {
      const saved = localStorage.getItem('white_label');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_BRAND;
  });
  const [loading, setLoading] = useState(false);

  // Apply CSS Variables to Document Root
  const applyThemeVariables = useCallback((brandData) => {
    if (!brandData || typeof document === 'undefined') return;

    const root = document.documentElement;
    if (brandData.public_primary_hex) {
      root.style.setProperty('--brand-primary', brandData.public_primary_hex);
    }
    if (brandData.public_secondary_hex) {
      root.style.setProperty('--brand-secondary', brandData.public_secondary_hex);
    }
    if (brandData.admin_dash_accent_hex) {
      root.style.setProperty('--brand-admin-accent', brandData.admin_dash_accent_hex);
    }
    if (brandData.admin_dash_bg_hex) {
      root.style.setProperty('--brand-admin-bg', brandData.admin_dash_bg_hex);
    }
    if (brandData.user_dash_accent_hex) {
      root.style.setProperty('--brand-user-accent', brandData.user_dash_accent_hex);
    }
    if (brandData.user_dash_bg_hex) {
      root.style.setProperty('--brand-user-bg', brandData.user_dash_bg_hex);
    }

    // Favicon update
    if (brandData.favicon_url) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = resolveFileUrl(brandData.favicon_url);
    }
  }, []);

  const fetchBranding = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/branding');
      if (res && res.data && res.data.length > 0) {
        const item = res.data[0];
        setBrand(item);
        applyThemeVariables(item);
        localStorage.setItem('white_label', JSON.stringify(item));
      }
    } catch (err) {
      console.warn('[BrandingContext] Could not fetch remote branding, using cached/default:', err.message);
    } finally {
      setLoading(false);
    }
  }, [applyThemeVariables]);

  useEffect(() => {
    applyThemeVariables(brand);
    fetchBranding();

    const handleBrandEvent = (e) => {
      if (e.detail) {
        setBrand(e.detail);
        applyThemeVariables(e.detail);
      } else {
        fetchBranding();
      }
    };
    window.addEventListener('brand-updated', handleBrandEvent);
    return () => window.removeEventListener('brand-updated', handleBrandEvent);
  }, [applyThemeVariables, fetchBranding]);

  const updateBrand = async (payload) => {
    const res = await apiFetch(`/branding?id=${payload.brand_id || 1}`, {
      method: 'PUT',
      body: payload
    });

    const updated = res.data || payload;
    setBrand(updated);
    applyThemeVariables(updated);
    localStorage.setItem('white_label', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('brand-updated', { detail: updated }));
    return updated;
  };

  return (
    <BrandingContext.Provider value={{ brand, updateBrand, refreshBrand: fetchBranding, loading }}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBrand = () => useContext(BrandingContext);
export default BrandingContext;
