import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Ticket, Clock, Calendar, ArrowRight, ShoppingBag, Eye } from 'lucide-react';
import { Order } from '../types';
import { orderApi } from '../services/api';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>((location.state as any)?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && id) {
      const fetchOrder = async () => {
        try {
          setLoading(true);
          const data = await orderApi.getOrderById(Number(id));
          setOrder(data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="h-12 w-12 bg-cream-200 rounded-full mx-auto mb-4"></div>
        <div className="h-6 w-48 bg-cream-200 rounded mx-auto mb-2"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-charcoal-900">Order not found</h2>
        <Link to="/menu" className="text-brand-600 underline text-xs font-bold">
          Return to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-center">
      <div className="space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-charcoal-900 tracking-tight">Pre-Order Confirmed!</h1>
        <p className="text-xs text-gray-500">
          Order <strong>#{order.orderNumber}</strong> has been transmitted directly to the kitchen display.
        </p>
      </div>

      {/* Digital Ticket Card */}
      <div className="bg-gradient-to-br from-brand-600 to-amber-600 rounded-3xl p-6 text-white shadow-xl shadow-brand-500/25 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/20 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-cream-200" />
            <span className="text-xs font-bold uppercase tracking-wider text-cream-200">Digital Queue Ticket</span>
          </div>
          <span className="text-[11px] font-semibold bg-white/20 px-2.5 py-0.5 rounded-full">
            Counter Pickup
          </span>
        </div>

        <div className="py-2">
          <p className="text-xs font-medium text-cream-200">Your Assigned Ticket Number</p>
          <p className="text-5xl font-black tracking-wider text-white mt-1">
            {order.ticketNumber || 'TKT-101'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/20 text-left">
          <div>
            <span className="text-[10px] text-cream-200 uppercase font-bold">Estimated Waiting Time</span>
            <p className="text-sm font-extrabold text-white flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-cream-200" />
              <span>~{order.estimatedWaitMinutes || 10} minutes</span>
            </p>
          </div>
          <div>
            <span className="text-[10px] text-cream-200 uppercase font-bold">Pickup Window</span>
            <p className="text-sm font-extrabold text-white flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-cream-200" />
              <span>{order.pickupSlotTime || 'Immediate'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Summary Box */}
      <div className="bg-white rounded-3xl border border-cream-200 p-6 shadow-sm text-left space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ordered Items</h3>
        <div className="divide-y divide-cream-100 text-xs">
          {order.items?.map((item) => (
            <div key={item.id} className="py-2.5 flex justify-between">
              <span className="font-semibold text-charcoal-800">
                {item.quantity}x {item.itemName}
              </span>
              <span className="font-bold text-charcoal-900">₹{Number(item.subtotal).toFixed(2)}</span>
            </div>
          ))}
          <div className="pt-3 flex justify-between font-black text-sm text-charcoal-900">
            <span>Total Paid (incl. Tax)</span>
            <span className="text-brand-600">₹{Number(order.totalAmount).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/queue"
          className="flex-1 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 transition-all"
        >
          <Clock className="w-4 h-4" />
          <span>Track Live Queue Position</span>
        </Link>
        <Link
          to="/orders"
          className="flex-1 py-3.5 rounded-xl bg-white border border-cream-300 hover:border-gray-400 text-charcoal-900 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs"
        >
          <Eye className="w-4 h-4" />
          <span>View Order Details</span>
        </Link>
      </div>
    </div>
  );
};
