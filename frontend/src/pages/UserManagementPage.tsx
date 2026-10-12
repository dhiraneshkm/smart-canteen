import React, { useEffect, useState } from 'react';
import { Users, Search, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { User, UserRole } from '../types';
import { adminApi } from '../services/api';
import { Sidebar } from '../components/Sidebar';
import { ToastContainer, ToastMessage } from '../components/Toast';

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleStatus = async (id: number, currentStatus: boolean, username: string) => {
    try {
      const updated = await adminApi.toggleUserStatus(id, !currentStatus);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      addToast(`User "${username}" ${!currentStatus ? 'enabled' : 'disabled'} successfully`, 'success');
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Failed to update user status', 'error');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="flex">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Access Management</span>
            <h1 className="text-2xl font-black text-charcoal-900 tracking-tight mt-0.5">Campus Accounts & Roles</h1>
          </div>

          <button onClick={loadUsers} className="p-2 rounded-xl bg-white border border-cream-300 self-start sm:self-auto">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user by name, email..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            {['ALL', 'ROLE_STUDENT', 'ROLE_KITCHEN_STAFF', 'ROLE_ADMIN'].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  roleFilter === r
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-white border border-cream-200 text-charcoal-800 hover:bg-cream-100'
                }`}
              >
                {r === 'ALL' ? 'All Roles' : r.replace('ROLE_', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-cream-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-50 border-b border-cream-200 text-gray-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Toggle Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100 font-medium text-charcoal-800">
              {loading ? (
                <tr><td colSpan={6} className="py-6 text-center text-gray-400">Loading accounts...</td></tr>
              ) : filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-cream-50/50">
                  <td className="py-3 px-4">
                    <p className="font-bold text-charcoal-900">{u.fullName}</p>
                    <p className="text-[10px] text-gray-400">{u.email}</p>
                  </td>
                  <td className="py-3 px-4 font-mono">{u.username}</td>
                  <td className="py-3 px-4 text-gray-500">{u.phone || '-'}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700">
                      {u.role.replace('ROLE_', '')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {u.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(u.id, u.enabled, u.username)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        u.enabled
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      {u.enabled ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
