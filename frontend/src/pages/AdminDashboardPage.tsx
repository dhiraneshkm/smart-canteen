import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Clock,
  AlertTriangle,
  Award,
  ArrowRight,
  RefreshCw,
  UtensilsCrossed,
  Tags,
  Users,
  FileSpreadsheet,
} from 'lucide-react';
import { DashboardMetrics } from '../types';
import { adminApi } from '../services/api';
import { Sidebar } from '../components/Sidebar';

export const AdminDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  return (
    <div className="flex">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <main className="flex-1 p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Operations Control</span>
            <h1 className="text-2xl font-black text-charcoal-900 tracking-tight mt-0.5">
              Admin Analytics & Overview
            </h1>
          </div>

          <button
            onClick={loadMetrics}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white border border-cream-300 text-xs font-bold text-charcoal-800 flex items-center gap-2 hover:border-brand-500 transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-brand-600" />
            <span>Refresh Analytics</span>
          </button>
        </div>

        {/* Top KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider">Today's Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-3xl font-black text-charcoal-900">
              ₹{Number(metrics?.salesToday || 0).toFixed(2)}
            </p>
            <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Lifetime: ₹{Number(metrics?.totalLifetimeSales || 0).toFixed(2)}</span>
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider">Orders Today</span>
              <ShoppingBag className="w-4 h-4 text-brand-600" />
            </div>
            <p className="text-3xl font-black text-charcoal-900">{metrics?.totalOrdersToday || 0}</p>
            <p className="text-[11px] text-gray-500">Completed: {metrics?.completedOrders || 0}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider">Active In Pipeline</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-3xl font-black text-amber-600">
              {(metrics?.pendingOrders || 0) + (metrics?.preparingOrders || 0)}
            </p>
            <p className="text-[11px] text-gray-500">
              Cooking: {metrics?.preparingOrders || 0} &nbsp;•&nbsp; Ready: {metrics?.readyOrders || 0}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider">Cancellation Rate</span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <p className="text-3xl font-black text-rose-600">{metrics?.cancellationRate || 0}%</p>
            <p className="text-[11px] text-gray-500">Cancelled: {metrics?.cancelledOrders || 0}</p>
          </div>
        </div>

        {/* Popular Items Table */}
        <div className="bg-white rounded-3xl border border-cream-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-cream-100 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-600" />
              <h2 className="text-base font-bold text-charcoal-900">Most Popular Food Items</h2>
            </div>
            <Link to="/admin/menu" className="text-xs font-bold text-brand-600 hover:text-brand-700">
              Manage Menu →
            </Link>
          </div>

          {!metrics?.popularItems || metrics.popularItems.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">No order data accumulated yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-cream-100 text-gray-400 uppercase text-[10px] font-bold">
                    <th className="py-2.5 px-3">Item Name</th>
                    <th className="py-2.5 px-3">Units Sold</th>
                    <th className="py-2.5 px-3 text-right">Revenue Generated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-50 font-medium">
                  {metrics.popularItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-cream-50/50">
                      <td className="py-2.5 px-3 font-bold text-charcoal-900 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-800 text-[10px] flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span>{item.name}</span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-charcoal-800">{item.orderCount} units</td>
                      <td className="py-2.5 px-3 text-right font-black text-brand-600">
                        ₹{Number(item.revenue).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Management Navigation Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/admin/menu"
            className="p-5 rounded-2xl bg-white border border-cream-200 hover:border-brand-500 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-charcoal-900">Food Menu</span>
            <span className="text-[10px] text-gray-400">CRUD items & prices</span>
          </Link>

          <Link
            to="/admin/categories"
            className="p-5 rounded-2xl bg-white border border-cream-200 hover:border-brand-500 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Tags className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-charcoal-900">Categories</span>
            <span className="text-[10px] text-gray-400">Organize dining options</span>
          </Link>

          <Link
            to="/admin/users"
            className="p-5 rounded-2xl bg-white border border-cream-200 hover:border-brand-500 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-charcoal-900">User Accounts</span>
            <span className="text-[10px] text-gray-400">Manage students & staff</span>
          </Link>

          <Link
            to="/admin/reports"
            className="p-5 rounded-2xl bg-white border border-cream-200 hover:border-brand-500 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-charcoal-900">Export Reports</span>
            <span className="text-[10px] text-gray-400">CSV downloads & sales</span>
          </Link>
        </div>
      </main>
    </div>
  );
};
