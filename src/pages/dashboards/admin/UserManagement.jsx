import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../utils/api';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Pagination from '../../../components/Pagination';

const ITEMS_PER_PAGE = 10;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

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
        password: '',
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

  if (loading) return <div className="p-8 text-gray-500 text-sm">Loading users...</div>;
  if (error) return <div className="p-8 text-red-500 text-sm">Error: {error}</div>;

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const paginatedUsers = users.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">User Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage all system users, credentials, and roles</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
        >
          + Add New User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">No users found.</div>
        ) : (
          <>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-bold text-slate-600 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 font-bold text-slate-600 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 font-bold text-slate-600 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 font-bold text-slate-600 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 font-bold text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 font-bold text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedUsers.map(user => (
                  <tr key={user.user_id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-slate-700">#{user.user_id}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{user.display_name}</td>
                    <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[10px] uppercase font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-300">{user.role_name || user.role_id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${
                        user.account_status === 'active' ? 'bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]' : 'bg-[#FCE8E6] text-[#C5221F] border-[#FAD2CF]'
                      }`}>
                        {String(user.account_status || '').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => openModal(user)} 
                          className="text-blue-600 hover:text-blue-800 text-xs font-semibold inline-flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(user.user_id)} 
                          className="text-red-500 hover:text-red-700 text-xs font-semibold inline-flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded border border-red-200"
                        >
                          <FaTrash /> Del
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={users.length}
          />
          </>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-sm w-full max-w-lg relative">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-base font-bold text-gray-900">{isEditing ? 'Edit User' : 'Add New User'}</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-600 text-lg leading-none">&times;</button>
            </div>
            
            <div className="p-6">
              <form id="userForm" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Display Name *</label>
                  <input required type="text" value={formData.display_name} onChange={e => setFormData({...formData, display_name: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200" />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address *</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    {isEditing ? 'New Password (leave blank to keep current)' : 'Password *'}
                  </label>
                  <input required={!isEditing} type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Role *</label>
                    <select required value={formData.role_id} onChange={e => setFormData({...formData, role_id: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 bg-white">
                      <option value="">Select Role</option>
                      {roles.map(r => (
                        <option key={r.role_id} value={r.role_id}>{r.role_name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Status</label>
                    <select value={formData.account_status} onChange={e => setFormData({...formData, account_status: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 bg-white">
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors">Cancel</button>
              <button type="submit" form="userForm" disabled={formLoading} className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50">
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
