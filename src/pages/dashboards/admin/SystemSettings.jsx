import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../utils/api';
import { toast } from 'react-toastify';

const SystemSettings = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ setting_key: '', setting_value: '', description: '' });
  const [formLoading, setFormLoading] = useState(false);
  
  const [editedSettings, setEditedSettings] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await apiFetch('/settings');
      setSettings(data.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const closeModal = () => setShowModal(false);

  const handleEditChange = (key, field, value) => {
    setEditedSettings({
      ...editedSettings,
      [key]: {
        ...editedSettings[key],
        [field]: value
      }
    });
  };

  const handleSaveExisting = async (key) => {
    const updates = editedSettings[key];
    if (!updates) return;

    setSaving(true);
    try {
      const original = settings.find(s => s.setting_key === key);
      const payload = { ...original, ...updates };

      await apiFetch(`/settings?key=${key}`, {
        method: 'PUT',
        body: payload
      });
      
      const newEdited = { ...editedSettings };
      delete newEdited[key];
      setEditedSettings(newEdited);
      
      toast.success('Setting updated successfully!');
      await fetchSettings();
    } catch (err) {
      toast.error('Failed to save setting: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await apiFetch('/settings', {
        method: 'POST',
        body: formData
      });
      await fetchSettings();
      closeModal();
      toast.success('Setting added successfully!');
    } catch (err) {
      toast.error('Failed to add setting: ' + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (key) => {
    if (window.confirm(`Are you sure you want to delete setting '${key}'?`)) {
      try {
        await apiFetch(`/settings?key=${key}`, { method: 'DELETE' });
        toast.success('Setting deleted!');
        await fetchSettings();
      } catch (err) {
        toast.error('Failed to delete setting: ' + err.message);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 p-8 md:p-10 transition-all">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Settings</h2>
          <p className="text-slate-500 mt-2">Manage the core configuration of your application.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all active:scale-95"
        >
          <svg className="w-5 h-5 mr-2 -ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Setting
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-900">Add New Setting</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-8">
              <form id="settingForm" onSubmit={handleModalSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Setting Key</label>
                  <input required type="text" value={formData.setting_key} onChange={e => setFormData({...formData, setting_key: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors" placeholder="e.g., SITE_TITLE" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Setting Value</label>
                  <input required type="text" value={formData.setting_value} onChange={e => setFormData({...formData, setting_value: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors" placeholder="e.g., My Journal" />
                </div>
              </form>
            </div>

            <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex justify-end space-x-3">
              <button type="button" onClick={closeModal} className="px-6 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl font-medium transition-colors">Cancel</button>
              <button type="submit" form="settingForm" disabled={formLoading} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 shadow-sm hover:shadow transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center">
                {formLoading ? (
                  <><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Saving...</>
                ) : 'Save Setting'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-slate-200 overflow-hidden bg-white">
        {settings.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
               <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900">No settings found</h3>
            <p className="text-slate-500 mt-1">Get started by creating your first system setting.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {settings.map((setting) => {
              const isEdited = !!editedSettings[setting.setting_key];
              const currentValue = isEdited && editedSettings[setting.setting_key].setting_value !== undefined 
                ? editedSettings[setting.setting_key].setting_value 
                : setting.setting_value;
              const currentDesc = isEdited && editedSettings[setting.setting_key].description !== undefined 
                ? editedSettings[setting.setting_key].description 
                : setting.description;

              return (
                <li key={setting.setting_key} className="p-6 sm:p-8 hover:bg-slate-50/50 transition-colors group">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                    <div className="flex-1 max-w-2xl">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 tracking-wide">
                          {setting.setting_key}
                        </span>
                      </div>
                      <input 
                        type="text" 
                        value={currentDesc || ''}
                        onChange={(e) => handleEditChange(setting.setting_key, 'description', e.target.value)}
                        className="w-full mt-3 text-sm text-slate-600 bg-transparent border border-transparent hover:border-slate-200 hover:bg-white focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 rounded-lg px-3 py-2 -ml-3 transition-all outline-none"
                        placeholder="Add a description for this setting..."
                      />
                    </div>
                    <div className="flex items-start sm:items-center space-x-4 w-full md:w-auto">
                      <div className="relative flex-1 sm:w-64 flex items-center h-full min-h-[44px]">
                        {(setting.setting_value === 'true' || setting.setting_value === 'false') ? (
                          <button
                            type="button"
                            onClick={() => handleEditChange(setting.setting_key, 'setting_value', currentValue === 'true' ? 'false' : 'true')}
                            className={`${
                              currentValue === 'true' ? 'bg-indigo-600' : 'bg-slate-200'
                            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                            role="switch"
                            aria-checked={currentValue === 'true'}
                          >
                            <span
                              aria-hidden="true"
                              className={`${
                                currentValue === 'true' ? 'translate-x-5' : 'translate-x-0'
                              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                            />
                          </button>
                        ) : (
                          <input 
                            type="text" 
                            value={currentValue} 
                            onChange={(e) => handleEditChange(setting.setting_key, 'setting_value', e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow shadow-sm"
                          />
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 pt-1 sm:pt-0">
                        {isEdited && (
                          <button 
                            onClick={() => handleSaveExisting(setting.setting_key)}
                            disabled={saving}
                            className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 hover:text-indigo-700 transition-colors disabled:opacity-50"
                            title="Save changes"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          </button>
                        )}
                        
                        <button 
                          onClick={() => handleDelete(setting.setting_key)}
                          className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-100 md:opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Delete setting"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SystemSettings;
