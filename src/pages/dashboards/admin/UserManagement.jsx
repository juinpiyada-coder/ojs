import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../utils/api';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    user_id: '',
    display_name: '',
    email: '',
    password: '',
    role_id: '',
    account_status: 'active'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await apiFetch('/users');
      setUsers(data.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await apiFetch('/roles');
      setRoles(data.data || []);
    } catch (err) {
      console.error('Failed to fetch roles', err);
    }
  };

  const openModal = (user = null) => {
    if (user) {
      setIsEditing(true);
      setFormData({
        user_id: user.user_id,
        display_name: user.display_name,
        email: user.email,
        password: '', // Never populate password on edit
        role_id: user.role_id,
        account_status: user.account_status
      });
    } else {
      setIsEditing(false);
      setFormData({
        user_id: '',
        display_name: '',
        email: '',
        password: '',
        role_id: roles.length > 0 ? roles[0].role_id : '',
        account_status: 'active'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      if (isEditing) {
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        await apiFetch(`/users?id=${formData.user_id}`, {
          method: 'PUT',
          body: payload
        });
        toast.success('User updated successfully!');
      } else {
        await apiFetch('/users', {
          method: 'POST',
          body: formData
        });
        toast.success('User created successfully!');
      }
      await fetchUsers();
      closeModal();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await apiFetch(`/users?id=${id}`, { method: 'DELETE' });
        toast.success('User deleted successfully!');
        await fetchUsers();
      } catch (err) {
        toast.error('Error deleting user: ' + err.message);
      }
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div className="text-red-500 p-8">Error: {error}</div>;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E5E0D8] relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#2C2C2C]">User Management</h2>
        <button 
          onClick={() => openModal()}
          className="px-5 py-2 bg-[#8E7C68] text-white rounded font-bold hover:bg-[#7a6a57] transition-colors"
        >
          + Add User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-[#E5E0D8] text-[#5C5446]">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.user_id} className="border-b border-[#F0EBE1] hover:bg-[#FAF9F6]">
                <td className="py-3 px-4 text-[#2C2C2C] font-semibold">{user.display_name}</td>
                <td className="py-3 px-4 text-[#5C5446]">{user.email}</td>
                <td className="py-3 px-4 text-[#5C5446]">{user.role_name || user.role_id}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${user.account_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.account_status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-3 whitespace-nowrap">
                  <button onClick={() => openModal(user)} className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1"><FaEdit /> Edit</button>
                  <button onClick={() => handleDelete(user.user_id)} className="text-red-600 hover:text-red-800 font-semibold inline-flex items-center gap-1"><FaTrash /> Delete</button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="py-4 text-center text-[#5C5446]">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col relative my-auto">
            <div className="px-8 py-5 border-b border-[#E5E0D8] flex justify-between items-center bg-[#FAF9F6] rounded-t-2xl shrink-0">
              <h3 className="text-xl font-bold text-[#2C2C2C]">{isEditing ? 'Edit User' : 'Add New User'}</h3>
              <button onClick={closeModal} className="text-[#8E7C68] hover:text-[#2C2C2C] text-2xl font-light leading-none">✕</button>
            </div>
            
            <div className="p-8 overflow-y-auto">
              <form id="userForm" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#5C5446] mb-1.5">Display Name *</label>
                  <input required type="text" value={formData.display_name} onChange={e => setFormData({...formData, display_name: e.target.value})} className="w-full px-3 py-2 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8E7C68]/30 focus:border-[#8E7C68]" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-[#5C5446] mb-1.5">Email Address *</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8E7C68]/30 focus:border-[#8E7C68]" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#5C5446] mb-1.5">
                    {isEditing ? 'New Password (leave blank to keep current)' : 'Password *'}
                  </label>
                  <input required={!isEditing} type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8E7C68]/30 focus:border-[#8E7C68]" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#5C5446] mb-1.5">Role *</label>
                    <select required value={formData.role_id} onChange={e => setFormData({...formData, role_id: e.target.value})} className="w-full px-3 py-2 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8E7C68]/30 focus:border-[#8E7C68] bg-white">
                      <option value="">Select Role</option>
                      {roles.map(r => (
                        <option key={r.role_id} value={r.role_id}>{r.role_name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#5C5446] mb-1.5">Status</label>
                    <select value={formData.account_status} onChange={e => setFormData({...formData, account_status: e.target.value})} className="w-full px-3 py-2 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8E7C68]/30 focus:border-[#8E7C68] bg-white">
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>

            <div className="px-8 py-5 border-t border-[#E5E0D8] bg-[#FAF9F6] rounded-b-2xl flex justify-end space-x-4 shrink-0">
              <button type="button" onClick={closeModal} className="px-6 py-2.5 text-[#5C5446] hover:bg-[#E5E0D8] rounded-lg font-bold transition-colors">Cancel</button>
              <button type="submit" form="userForm" disabled={formLoading} className="px-8 py-2.5 bg-[#2C2C2C] text-white rounded-lg font-bold hover:bg-[#4A4A4A] transition-colors disabled:opacity-50">
                {formLoading ? 'Saving...' : 'Save User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
