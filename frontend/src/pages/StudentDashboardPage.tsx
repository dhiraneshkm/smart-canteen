import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Clock,
  Ticket,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { Order } from '../types';
import { orderApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderApi.getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const activeOrder = orders.find(
    (o) => o.status === 'PLACED' || o.status === 'ACCEPTED' || o.status === 'PREPARING' || o.status === 'READY'
  );

  const completedCount = orders.filter((o) => o.status === 'COLLECTED').length;
  const timeSavedMinutes = completedCount * 25; // average 25 mins saved per pre-order!

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cream-200 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Student Portal</span>
          <h1 className="text-3xl font-black text-charcoal-900 tracking-tight mt-0.5">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-xs text-gray-500 mt-1">Track active pre-orders, view ticket numbers, and order food.</p>
        </div>

        <Link
          to="/menu"
          className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-brand-500/20 transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Pre-Order Meal</span>
        </Link>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Orders Placed</span>
          <p className="text-3xl font-black text-charcoal-900 mt-1">{orders.length}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Campus dining history</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Queues Skipped</span>
          <p className="text-3xl font-black text-emerald-600 mt-1">{completedCount}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Zero wait pickups</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Estimated Time Saved</span>
          <p className="text-3xl font-black text-brand-600 mt-1">{timeSavedMinutes} mins</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Saved for study & relaxation</p>
        </div>
      </div>

      {/* Active Order Spotlight Banner */}
      {activeOrder && (
        <div className="bg-gradient-to-r from-brand-600 to-amber-600 text-white rounded-3xl p-6 shadow-xl shadow-brand-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-cream-200 animate-ping"></span>
              <span>Active Order In Progress</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              Order #{activeOrder.orderNumber}
            </h2>
            <p className="text-xs text-cream-100 max-w-md">
              Your ticket <strong>{activeOrder.ticketNumber}</strong> is currently in status{' '}
              <strong className="uppercase">{activeOrder.status}</strong>.
              Estimated wait: ~{activeOrder.estimatedWaitMinutes || 8} mins.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-sm">
              <span className="text-[10px] text-cream-200 uppercase font-bold">Ticket Code</span>
              <p className="text-3xl font-black text-white">{activeOrder.ticketNumber}</p>
            </div>

            <Link
              to="/queue"
              className="px-5 py-3 rounded-xl bg-white text-brand-700 font-bold text-xs uppercase tracking-wider hover:bg-cream-100 transition-colors shadow-md flex items-center gap-2"
            >
              <span>Track Live Queue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Recent Orders List */}
      <div className="bg-white rounded-3xl border border-cream-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-cream-100 pb-3">
          <h2 className="text-base font-bold text-charcoal-900">Recent Pre-Orders</h2>
          <Link to="/orders" className="text-xs font-bold text-brand-600 hover:text-brand-700">
            View All ({orders.length}) →
          </Link>
        </div>

        {loading ? (
          <p className="text-xs text-gray-400 py-6 text-center">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <ShoppingBag className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="text-xs font-bold text-gray-500">No pre-orders placed yet.</p>
            <Link
              to="/menu"
              className="inline-block px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700"
            >
              Start Your First Order
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-cream-100">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-extrabold text-xs text-charcoal-900">
                      #{order.orderNumber}
                    </span>
                    <StatusBadge status={order.status} size="sm" />
                    {order.ticketNumber && (
                      <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
                        {order.ticketNumber}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {order.items?.map((i) => `${i.quantity}x ${i.itemName}`).join(', ')}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Slot: {order.pickupSlotTime || 'Counter'} &nbsp;•&nbsp; Placed:{' '}
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <span className="text-sm font-black text-charcoal-900">
                    ₹{Number(order.totalAmount).toFixed(2)}
                  </span>
                  <Link
                    to={`/orders`}
                    className="p-2 rounded-xl bg-cream-50 hover:bg-cream-100 text-charcoal-800 text-xs font-bold transition-colors"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
