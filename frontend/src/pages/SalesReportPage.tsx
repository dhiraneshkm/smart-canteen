import React, { useEffect, useState } from 'react';
import { BarChart3, Download, Calendar, RefreshCw, FileText, DollarSign, ShoppingBag } from 'lucide-react';
import { SalesReport, AuditLog } from '../types';
import { adminApi } from '../services/api';
import { Sidebar } from '../components/Sidebar';
import { ToastContainer, ToastMessage } from '../components/Toast';

export const SalesReportPage: React.FC = () => {
  const [reports, setReports] = useState<SalesReport[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [activeTab, setActiveTab] = useState<'sales' | 'logs'>('sales');
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [salesData, logsData] = await Promise.all([
        adminApi.getReports(startDate || undefined, endDate || undefined),
        adminApi.getAuditLogs(),
      ]);
      setReports(salesData);
      setAuditLogs(logsData);
    } catch (err) {
      console.error(err);
      addToast('Failed to load reports', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalGross = reports.reduce((sum, r) => sum + Number(r.grossSales), 0);
  const totalOrders = reports.reduce((sum, r) => sum + Number(r.totalOrders), 0);
  const totalCompleted = reports.reduce((sum, r) => sum + Number(r.completedOrders), 0);

  const handleExportCsv = () => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    window.open(`/api/admin/reports/export?${params.toString()}`, '_blank');
    addToast('Initiated CSV download', 'info');
  };

  return (
    <div className="flex">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Financial Insights</span>
            <h1 className="text-2xl font-black text-charcoal-900 tracking-tight mt-0.5">Sales & Audit Reporting</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-brand-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button onClick={loadData} className="p-2 rounded-xl bg-white border border-cream-300">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 border-b border-cream-200 pb-2">
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'sales' ? 'bg-brand-600 text-white shadow-xs' : 'text-gray-600 hover:bg-cream-100'
            }`}
          >
            Sales Breakdown
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'logs' ? 'bg-brand-600 text-white shadow-xs' : 'text-gray-600 hover:bg-cream-100'
            }`}
          >
            Administrative Audit Trail ({auditLogs.length})
          </button>
        </div>

        {activeTab === 'sales' && (
          <div className="space-y-6">
            {/* Date filter bar */}
            <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-xs flex flex-wrap items-center gap-4 text-xs font-bold">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-600" />
                <span>Filter Period:</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">From</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-cream-300"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">To</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-cream-300"
                />
              </div>
              <button
                onClick={loadData}
                className="px-4 py-1.5 rounded-lg bg-charcoal-900 text-white hover:bg-black transition-colors"
              >
                Apply Range
              </button>
            </div>

            {/* Total highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs">
                <span className="text-xs font-bold text-gray-400 uppercase">Gross Revenue</span>
                <p className="text-3xl font-black text-emerald-600 mt-1">₹{totalGross.toFixed(2)}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Selected date period</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs">
                <span className="text-xs font-bold text-gray-400 uppercase">Orders Volume</span>
                <p className="text-3xl font-black text-brand-600 mt-1">{totalOrders}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Total processed</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs">
                <span className="text-xs font-bold text-gray-400 uppercase">Successful Deliveries</span>
                <p className="text-3xl font-black text-charcoal-900 mt-1">{totalCompleted}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Counter collections</p>
              </div>
            </div>

            {/* Reports Table */}
            <div className="bg-white rounded-3xl border border-cream-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-cream-50 border-b border-cream-200 text-gray-400 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Report Date</th>
                    <th className="py-3 px-4">Total Orders</th>
                    <th className="py-3 px-4">Gross Revenue (INR)</th>
                    <th className="py-3 px-4">Fulfilled Orders</th>
                    <th className="py-3 px-4">Cancelled / Rejected</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100 font-medium text-charcoal-800">
                  {loading ? (
                    <tr><td colSpan={5} className="py-6 text-center text-gray-400">Loading sales records...</td></tr>
                  ) : reports.length === 0 ? (
                    <tr><td colSpan={5} className="py-6 text-center text-gray-400">No records found for date filter.</td></tr>
                  ) : (
                    reports.map((r, i) => (
                      <tr key={i} className="hover:bg-cream-50/50">
                        <td className="py-3 px-4 font-bold text-charcoal-900">{r.reportDate}</td>
                        <td className="py-3 px-4 font-bold">{r.totalOrders}</td>
                        <td className="py-3 px-4 font-black text-emerald-600">₹{Number(r.grossSales).toFixed(2)}</td>
                        <td className="py-3 px-4 font-semibold text-charcoal-700">{r.completedOrders}</td>
                        <td className="py-3 px-4 font-bold text-rose-600">{r.cancelledOrders}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-white rounded-3xl border border-cream-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-50 border-b border-cream-200 text-gray-400 uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Admin User</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100 font-medium text-charcoal-800">
                {auditLogs.length === 0 ? (
                  <tr><td colSpan={6} className="py-6 text-center text-gray-400">No audit log records recorded yet.</td></tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-cream-50/50">
                      <td className="py-3 px-4 text-gray-400 font-mono text-[11px]">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-bold text-charcoal-900">{log.adminUsername || 'admin'}</td>
                      <td className="py-3 px-4 font-semibold text-brand-700">{log.action}</td>
                      <td className="py-3 px-4">{log.entityName} #{log.entityId}</td>
                      <td className="py-3 px-4 text-gray-600 max-w-sm truncate">{log.details}</td>
                      <td className="py-3 px-4 font-mono text-[10px] text-gray-400">{log.ipAddress || '127.0.0.1'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};
