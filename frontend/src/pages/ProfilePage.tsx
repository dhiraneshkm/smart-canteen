import React, { useState } from 'react';
import { User, Mail, Phone, Shield, Calendar, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import { ToastContainer, ToastMessage } from '../components/Toast';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await authApi.updateProfile({ fullName, phone });
      updateUser(updated);
      addToast('Profile updated successfully!', 'success');
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <div className="border-b border-cream-200 pb-4">
        <h1 className="text-2xl font-black text-charcoal-900 tracking-tight">Account Profile</h1>
        <p className="text-xs text-gray-500">Manage your contact information and campus dining preferences</p>
      </div>

      <div className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4 border-b border-cream-100 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-brand-500/25">
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-black text-charcoal-900">{user?.fullName}</h2>
            <p className="text-xs text-gray-400 font-mono">@{user?.username}</p>
            <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 text-[10px] font-bold uppercase tracking-wider">
              <Shield className="w-3 h-3" />
              <span>{user?.role?.replace('ROLE_', '').replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Read-only account info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200 space-y-1">
            <span className="text-gray-400 font-bold uppercase text-[10px]">Registered Email</span>
            <p className="font-bold text-charcoal-900 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-brand-600" />
              <span>{user?.email}</span>
            </p>
          </div>

          <div className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200 space-y-1">
            <span className="text-gray-400 font-bold uppercase text-[10px]">Account Created</span>
            <p className="font-bold text-charcoal-900 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand-600" />
              <span>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active Member'}
              </span>
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleUpdate} className="space-y-4 pt-4 border-t border-cream-100 text-xs">
          <h3 className="font-bold text-charcoal-900 text-sm">Update Contact Details</h3>

          <div>
            <label className="block font-bold text-charcoal-800 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-charcoal-800 mb-1">Mobile Phone (For Order SMS Alerts)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-brand-500/20 transition-all disabled:opacity-50"
          >
            {saving ? <Check className="w-4 h-4 animate-scale" /> : null}
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
