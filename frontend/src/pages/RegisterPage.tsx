import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Utensils, Lock, User as UserIcon, Mail, Phone, ArrowRight, AlertCircle } from 'lucide-react';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phone: '',
    role: 'STUDENT',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authApi.register(formData);
      login(response.token, response.user);
      navigate('/menu');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-brand-600 text-white items-center justify-center shadow-lg shadow-brand-500/25 mb-2">
            <Utensils className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-charcoal-900 tracking-tight">Create Student Account</h2>
          <p className="text-xs text-gray-500">Join Smart Canteen for easy pre-orders & queue skip</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-cream-200 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold text-charcoal-800 mb-1">Full Name</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Aarav Sharma"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-800 mb-1">Username</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="e.g. aarav24"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-800 mb-1">College Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="student@college.edu"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-800 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 9876543210"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-800 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-brand-500/20 transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Registering...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700 underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
