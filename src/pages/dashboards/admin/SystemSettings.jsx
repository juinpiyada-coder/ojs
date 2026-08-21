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

  if (loading) return <div className="p-8 text-gray-500 text-sm">Loading...</div>;
  if (error) return <div className="p-8 text-red-500 text-sm">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">System Settings</h2>
          <p className="text-xs text-gray-500 mt-0.5">Manage core application configuration</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Setting
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg relative">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-base font-bold text-gray-900">Add New Setting</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6">
              <form id="settingForm" onSubmit={handleModalSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Setting Key</label>
                  <input required type="text" value={formData.setting_key} onChange={e => setFormData({...formData, setting_key: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200" placeholder="e.g., SITE_TITLE" />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Setting Value</label>
                  <input required type="text" value={formData.setting_value} onChange={e => setFormData({...formData, setting_value: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200" placeholder="e.g., My Journal" />
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors">Cancel</button>
              <button type="submit" form="settingForm" disabled={formLoading} className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:pointer-events-none flex items-center">
                {formLoading ? (
                  <><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Saving...</>
                ) : 'Save Setting'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
        {settings.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 text-gray-500 mb-3">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-900">No settings found</h3>
            <p className="text-gray-500 text-xs mt-1">Create your first system setting to get started.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {settings.map((setting) => {
              const isEdited = !!editedSettings[setting.setting_key];
              const currentValue = isEdited && editedSettings[setting.setting_key].setting_value !== undefined 
                ? editedSettings[setting.setting_key].setting_value 
                : setting.setting_value;
              const currentDesc = isEdited && editedSettings[setting.setting_key].description !== undefined 
                ? editedSettings[setting.setting_key].description 
                : setting.description;

              return (
                <li key={setting.setting_key} className="p-5 hover:bg-gray-50 transition-colors group">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700">
                          {setting.setting_key}
                        </span>
                      </div>
                      <input 
                        type="text" 
                        value={currentDesc || ''}
                        onChange={(e) => handleEditChange(setting.setting_key, 'description', e.target.value)}
                        className="w-full mt-2 text-xs text-gray-500 bg-transparent border border-transparent hover:border-gray-200 hover:bg-white focus:bg-white focus:border-gray-300 rounded px-2 py-1 -ml-2 transition-all outline-none"
                        placeholder="Add a description..."
                      />
                    </div>
                    <div className="flex items-start sm:items-center space-x-3 w-full md:w-auto">
                      <div className="relative flex-1 sm:w-56 flex items-center">
                        {(setting.setting_value === 'true' || setting.setting_value === 'false') ? (
                          <button
                            type="button"
                            onClick={() => handleEditChange(setting.setting_key, 'setting_value', currentValue === 'true' ? 'false' : 'true')}
                            className={`${
                              currentValue === 'true' ? 'bg-gray-900' : 'bg-gray-200'
                            } relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2`}
                            role="switch"
                            aria-checked={currentValue === 'true'}
                          >
                            <span
                              aria-hidden="true"
                              className={`${
                                currentValue === 'true' ? 'translate-x-4' : 'translate-x-0'
                              } pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                            />
                          </button>
                        ) : (
                          <input 
                            type="text" 
                            value={currentValue} 
                            onChange={(e) => handleEditChange(setting.setting_key, 'setting_value', e.target.value)}
                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
                          />
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1.5 pt-0.5 sm:pt-0">
                        {isEdited && (
                          <button 
                            onClick={() => handleSaveExisting(setting.setting_key)}
                            disabled={saving}
                            className="p-1.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                            title="Save"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          </button>
                        )}
                        
                        <button 
                          onClick={() => handleDelete(setting.setting_key)}
                          className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors opacity-100 md:opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
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
