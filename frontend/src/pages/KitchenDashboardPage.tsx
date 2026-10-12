import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Clock, CheckCircle2, ArrowRight, RefreshCw, AlertCircle, ShoppingBag } from 'lucide-react';
import { Order } from '../types';
import { kitchenApi } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

export const KitchenDashboardPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await kitchenApi.getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const pending = orders.filter((o) => o.status === 'PLACED').length;
  const preparing = orders.filter((o) => o.status === 'PREPARING').length;
  const ready = orders.filter((o) => o.status === 'READY').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Kitchen Display Hub</span>
          <h1 className="text-2xl font-black text-charcoal-900 tracking-tight mt-0.5">Kitchen Operational Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/kitchen/board"
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-500/20 transition-all"
          >
            <ChefHat className="w-4 h-4" />
            <span>Open Kanban Board</span>
          </Link>
          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-white border border-cream-300 text-charcoal-800 hover:border-brand-500"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Awaiting Acceptance</span>
          <p className="text-3xl font-black text-amber-600 mt-1">{pending}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Needs kitchen confirmation</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Currently Cooking</span>
          <p className="text-3xl font-black text-indigo-600 mt-1">{preparing}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Cooking stations busy</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ready at Counter</span>
          <p className="text-3xl font-black text-emerald-600 mt-1">{ready}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Awaiting student pickup</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-cream-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-charcoal-900 border-b border-cream-100 pb-3">
          All Active Kitchen Orders
        </h2>

        {loading ? (
          <p className="text-xs text-gray-400 py-6 text-center">Loading tickets...</p>
        ) : orders.length === 0 ? (
          <p className="text-xs text-gray-400 py-6 text-center">No active kitchen orders right now.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-cream-200 text-gray-400 uppercase font-bold text-[10px]">
                  <th className="py-3 px-2">Ticket #</th>
                  <th className="py-3 px-2">Order #</th>
                  <th className="py-3 px-2">Items</th>
                  <th className="py-3 px-2">Slot Window</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Est. Wait</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100 font-medium text-charcoal-800">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-cream-50/50">
                    <td className="py-3 px-2 font-black text-brand-600">{o.ticketNumber || '-'}</td>
                    <td className="py-3 px-2 font-bold">{o.orderNumber}</td>
                    <td className="py-3 px-2">
                      {o.items?.map((i) => `${i.quantity}x ${i.itemName}`).join(', ')}
                    </td>
                    <td className="py-3 px-2 text-gray-500">{o.pickupSlotTime || 'Immediate'}</td>
                    <td className="py-3 px-2">
                      <StatusBadge status={o.status} size="sm" />
                    </td>
                    <td className="py-3 px-2 font-bold text-gray-700">~{o.estimatedWaitMinutes || 8} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
