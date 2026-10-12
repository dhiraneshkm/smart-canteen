import React, { useEffect, useState } from 'react';
import { ShoppingBag, Search, Eye, RefreshCw } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { adminApi } from '../services/api';
import { Sidebar } from '../components/Sidebar';
import { StatusBadge } from '../components/StatusBadge';

export const OrderManagementPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.ticketNumber?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Order Governance</span>
            <h1 className="text-2xl font-black text-charcoal-900 tracking-tight mt-0.5">All Pre-Orders & History</h1>
          </div>

          <button onClick={loadOrders} className="p-2 rounded-xl bg-white border border-cream-300 self-start sm:self-auto">
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
              placeholder="Search by order #, ticket, student..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {['ALL', 'PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'COLLECTED', 'CANCELLED'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  statusFilter === s
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-white border border-cream-200 text-charcoal-800 hover:bg-cream-100'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-cream-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-50 border-b border-cream-200 text-gray-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Ticket</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4">Slot</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100 font-medium text-charcoal-800">
              {loading ? (
                <tr><td colSpan={8} className="py-6 text-center text-gray-400">Loading orders...</td></tr>
              ) : filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-cream-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-charcoal-900">{o.orderNumber}</td>
                  <td className="py-3 px-4">
                    <p className="font-bold">{o.customerName}</p>
                    <p className="text-[10px] text-gray-400">{o.customerPhone || '-'}</p>
                  </td>
                  <td className="py-3 px-4 font-black text-brand-600">{o.ticketNumber || '-'}</td>
                  <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                    {o.items?.map((i) => `${i.quantity}x ${i.itemName}`).join(', ')}
                  </td>
                  <td className="py-3 px-4 text-gray-500">{o.pickupSlotTime || 'Immediate'}</td>
                  <td className="py-3 px-4 font-black text-charcoal-900">₹{Number(o.totalAmount).toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={o.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="p-1.5 rounded-lg hover:bg-cream-100 text-charcoal-800"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-base">Order #{selectedOrder.orderNumber}</h3>
                <button onClick={() => setSelectedOrder(null)}>✕</button>
              </div>
              <div className="space-y-2 text-xs">
                <p><strong>Customer:</strong> {selectedOrder.customerName} ({selectedOrder.customerPhone || 'N/A'})</p>
                <p><strong>Ticket:</strong> {selectedOrder.ticketNumber} &nbsp;|&nbsp; <strong>Slot:</strong> {selectedOrder.pickupSlotTime || 'Counter'}</p>
                <p><strong>Payment:</strong> {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})</p>
                {selectedOrder.specialInstructions && (
                  <p className="bg-cream-50 p-2 rounded-xl text-brand-800"><strong>Note:</strong> {selectedOrder.specialInstructions}</p>
                )}
                <div className="pt-2 border-t space-y-1">
                  {selectedOrder.items?.map((i) => (
                    <div key={i.id} className="flex justify-between">
                      <span>{i.quantity}x {i.itemName}</span>
                      <span className="font-bold">₹{Number(i.subtotal).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-black pt-2 border-t text-sm">
                    <span>Total Amount</span>
                    <span className="text-brand-600">₹{Number(selectedOrder.totalAmount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
