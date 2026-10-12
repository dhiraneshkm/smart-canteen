import React, { useEffect, useState } from 'react';
import { ShoppingBag, Clock, XCircle, Eye, Calendar, ArrowRight, AlertCircle } from 'lucide-react';
import { Order } from '../types';
import { orderApi } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { ToastContainer, ToastMessage } from '../components/Toast';

export const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderApi.getMyOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load order history', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellingOrderId) return;
    try {
      const updated = await orderApi.cancelOrder(cancellingOrderId, cancelReason || 'Cancelled by student');
      addToast(`Order #${updated.orderNumber} cancelled successfully`, 'success');
      setCancellingOrderId(null);
      setCancelReason('');
      loadOrders();
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Cannot cancel order', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <div className="border-b border-cream-200 pb-4">
        <h1 className="text-2xl font-black text-charcoal-900 tracking-tight">Order History & Tracking</h1>
        <p className="text-xs text-gray-500">Track current tickets, view item receipts, or cancel eligible orders</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-cream-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-cream-200 space-y-3">
          <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-charcoal-900">No Orders Placed Yet</h3>
          <p className="text-xs text-gray-500">All your active and previous canteen pre-orders will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const canCancel = order.status === 'PLACED' || order.status === 'ACCEPTED';
            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-cream-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-sm text-charcoal-900">
                        Order #{order.orderNumber}
                      </span>
                      <StatusBadge status={order.status} size="sm" />
                      {order.ticketNumber && (
                        <span className="text-xs font-black bg-brand-100 text-brand-800 px-2.5 py-0.5 rounded-lg">
                          Ticket: {order.ticketNumber}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400">
                      Placed on {new Date(order.createdAt).toLocaleString()} &nbsp;•&nbsp; Slot: {order.pickupSlotTime || 'Immediate'}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 uppercase font-bold">Total Amount</span>
                      <p className="text-lg font-black text-charcoal-900">
                        ₹{Number(order.totalAmount).toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 rounded-xl bg-cream-50 hover:bg-cream-100 text-charcoal-800 text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Receipt</span>
                    </button>

                    {canCancel && (
                      <button
                        onClick={() => setCancellingOrderId(order.id)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Items preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  {order.items?.map((item) => (
                    <div key={item.id} className="p-2.5 rounded-xl bg-cream-50 flex justify-between items-center">
                      <span className="font-semibold text-charcoal-800">
                        {item.quantity}x {item.itemName}
                      </span>
                      <span className="font-bold text-gray-600">
                        ₹{Number(item.subtotal).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {order.cancellationReason && (
                  <p className="text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded-xl">
                    Cancellation Reason: {order.cancellationReason}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Order Confirmation Modal */}
      {cancellingOrderId && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in">
            <h3 className="text-lg font-bold text-charcoal-900">Cancel Pre-Order</h3>
            <p className="text-xs text-gray-500">
              Are you sure? This will release your pickup slot and restore the item stock to the kitchen.
            </p>
            <form onSubmit={handleCancel} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">Reason (Optional)</label>
                <input
                  type="text"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Schedule changed, ordered by mistake"
                  className="w-full px-3 py-2 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setCancellingOrderId(null)}
                  className="px-4 py-2 rounded-xl border border-cream-300 text-xs font-bold text-charcoal-800 hover:bg-cream-100"
                >
                  Keep Order
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Receipt Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-cream-100 pb-3">
              <div>
                <span className="text-xs text-brand-600 font-bold uppercase">Campus Canteen Receipt</span>
                <h3 className="text-lg font-black text-charcoal-900">Order #{selectedOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-charcoal-900 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-cream-50">
                <span className="text-gray-500">Ticket Number:</span>
                <span className="font-extrabold text-brand-600">{selectedOrder.ticketNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-cream-50">
                <span className="text-gray-500">Pickup Window:</span>
                <span className="font-bold">{selectedOrder.pickupSlotTime || 'Immediate'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-cream-50">
                <span className="text-gray-500">Current Status:</span>
                <StatusBadge status={selectedOrder.status} size="sm" />
              </div>
              <div className="flex justify-between py-1 border-b border-cream-50">
                <span className="text-gray-500">Payment Mode:</span>
                <span className="font-bold">{selectedOrder.paymentMethod || 'Simulated'} ({selectedOrder.paymentStatus})</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Itemized Breakdown</h4>
              <div className="divide-y divide-cream-100 text-xs">
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="py-2 flex justify-between">
                    <span>{item.quantity}x {item.itemName}</span>
                    <span className="font-bold">₹{Number(item.subtotal).toFixed(2)}</span>
                  </div>
                ))}
                <div className="pt-2 flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{Number(selectedOrder.subtotal).toFixed(2)}</span>
                </div>
                <div className="pt-1 flex justify-between text-gray-500">
                  <span>GST (5%)</span>
                  <span>₹{Number(selectedOrder.tax).toFixed(2)}</span>
                </div>
                <div className="pt-2 flex justify-between font-black text-sm text-charcoal-900">
                  <span>Total Paid</span>
                  <span className="text-brand-600">₹{Number(selectedOrder.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-2.5 rounded-xl bg-charcoal-900 text-white text-xs font-bold hover:bg-black transition-colors"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
