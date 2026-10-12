import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Utensils, Lock, User as UserIcon, ArrowRight, AlertCircle, Shield, ChefHat, GraduationCap } from 'lucide-react';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authApi.login({ username, password });
      login(response.token, response.user);

      if (response.user.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else if (response.user.role === 'ROLE_KITCHEN_STAFF') {
        navigate('/kitchen/board');
      } else {
        navigate(from === '/' ? '/student' : from);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-brand-600 text-white items-center justify-center shadow-lg shadow-brand-500/25 mb-2">
            <Utensils className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-charcoal-900 tracking-tight">Sign in to Smart Canteen</h2>
          <p className="text-xs text-gray-500">Access pre-orders, real-time ticket queue, and meals</p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="p-4 bg-brand-50 border border-brand-200 rounded-2xl space-y-2.5">
          <p className="text-[11px] font-bold text-brand-900 uppercase tracking-wider text-center">
            One-Click Demo Account Autofill
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('student', 'Password@123')}
              className="py-2 px-2 rounded-xl bg-white border border-brand-200 hover:border-brand-500 text-charcoal-900 text-xs font-bold flex flex-col items-center gap-1 transition-all shadow-xs hover:shadow"
            >
              <GraduationCap className="w-4 h-4 text-brand-600" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('kitchen', 'Password@123')}
              className="py-2 px-2 rounded-xl bg-white border border-brand-200 hover:border-brand-500 text-charcoal-900 text-xs font-bold flex flex-col items-center gap-1 transition-all shadow-xs hover:shadow"
            >
              <ChefHat className="w-4 h-4 text-brand-600" />
              <span>Kitchen Staff</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('admin', 'Password@123')}
              className="py-2 px-2 rounded-xl bg-white border border-brand-200 hover:border-brand-500 text-charcoal-900 text-xs font-bold flex flex-col items-center gap-1 transition-all shadow-xs hover:shadow"
            >
              <Shield className="w-4 h-4 text-brand-600" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-cream-200 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold text-charcoal-800 mb-1">Username</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your campus username"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-brand-500/20 transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Don't have a student account?{' '}
          <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700 underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
