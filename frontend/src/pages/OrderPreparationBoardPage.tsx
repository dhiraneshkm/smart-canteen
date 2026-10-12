import React, { useEffect, useState } from 'react';
import { ChefHat, Clock, Check, ArrowRight, RefreshCw, XCircle, Bell, User, CheckCircle2 } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { kitchenApi } from '../services/api';
import { useWebSocket } from '../context/WebSocketContext';
import { StatusBadge } from '../components/StatusBadge';
import { ToastContainer, ToastMessage } from '../components/Toast';

export const OrderPreparationBoardPage: React.FC = () => {
  const { connected, subscribeToOrders } = useWebSocket();
  const [orders, setOrders] = useState<Order[]>([]);
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
      const data = await kitchenApi.getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load kitchen tickets', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();

    // STOMP WebSocket listener for incoming orders and transitions
    const unsubscribe = subscribeToOrders((updatedOrder) => {
      setOrders((prev) => {
        const exists = prev.some((o) => o.id === updatedOrder.id);
        if (updatedOrder.status === 'COLLECTED' || updatedOrder.status === 'CANCELLED' || updatedOrder.status === 'REJECTED') {
          return prev.filter((o) => o.id !== updatedOrder.id);
        }
        if (exists) {
          return prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o));
        }
        return [updatedOrder, ...prev];
      });
      addToast(`Order #${updatedOrder.orderNumber} updated to ${updatedOrder.status}`, 'info');
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleUpdateStatus = async (orderId: number, nextStatus: OrderStatus) => {
    try {
      const updated = await kitchenApi.updateStatus(orderId, nextStatus);
      setOrders((prev) => {
        if (nextStatus === 'COLLECTED' || nextStatus === 'REJECTED') {
          return prev.filter((o) => o.id !== orderId);
        }
        return prev.map((o) => (o.id === orderId ? updated : o));
      });
      addToast(`Moved Ticket ${updated.ticketNumber || orderId} to ${nextStatus}!`, 'success');
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Failed to update order status', 'error');
    }
  };

  const placedOrders = orders.filter((o) => o.status === 'PLACED');
  const acceptedOrders = orders.filter((o) => o.status === 'ACCEPTED');
  const preparingOrders = orders.filter((o) => o.status === 'PREPARING');
  const readyOrders = orders.filter((o) => o.status === 'READY');

  const renderColumn = (
    title: string,
    badgeBg: string,
    orderList: Order[],
    actionLabel: string | null,
    nextStatus: OrderStatus | null,
    btnColor?: string
  ) => (
    <div className="bg-cream-100/60 rounded-3xl p-4 border border-cream-200 flex flex-col h-full min-h-[600px] shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-cream-200">
        <h3 className="font-extrabold text-sm text-charcoal-900 uppercase tracking-wider">{title}</h3>
        <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${badgeBg}`}>
          {orderList.length}
        </span>
      </div>

      <div className="space-y-3 overflow-y-auto flex-1 pr-1">
        {orderList.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-xs font-medium text-gray-400 border border-dashed border-cream-300 rounded-2xl">
            No orders in this stage
          </div>
        ) : (
          orderList.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-4 border border-cream-200 shadow-sm hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-brand-600 bg-brand-50 px-2 py-0.5 rounded-lg">
                  {order.ticketNumber || `#${order.orderNumber.slice(-4)}`}
                </span>
                <span className="text-[10px] font-semibold text-gray-400">
                  {order.pickupSlotTime || 'Immediate'}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-charcoal-900">#{order.orderNumber}</p>
                <div className="text-xs space-y-0.5">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex justify-between text-charcoal-800 font-medium">
                      <span>{item.quantity}x {item.itemName}</span>
                    </div>
                  ))}
                </div>
              </div>

              {order.specialInstructions && (
                <p className="text-[11px] font-semibold text-amber-700 bg-amber-50 p-2 rounded-xl">
                  Note: {order.specialInstructions}
                </p>
              )}

              <div className="pt-2 border-t border-cream-100 flex items-center justify-between gap-2">
                <span className="text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3 text-brand-500" />
                  <span>~{order.estimatedWaitMinutes || 8} min</span>
                </span>

                {actionLabel && nextStatus && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, nextStatus)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1 shadow-sm transition-all ${
                      btnColor || 'bg-brand-600 hover:bg-brand-700'
                    }`}
                  >
                    <span>{actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Kitchen Display System (KDS)</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              {connected ? '● WebSocket Live Connected' : 'Polling Sync'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-charcoal-900 tracking-tight mt-0.5">Order Preparation Board</h1>
        </div>

        <button
          onClick={loadOrders}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white border border-cream-300 text-xs font-bold text-charcoal-800 flex items-center gap-2 hover:border-brand-500 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-brand-600" />
          <span>Refresh Tickets</span>
        </button>
      </div>

      {/* 4-Column Kanban Preparation Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {/* Column 1: Placed / Incoming */}
        {renderColumn(
          '1. Incoming Orders',
          'bg-amber-100 text-amber-800',
          placedOrders,
          'Accept Order',
          'ACCEPTED',
          'bg-blue-600 hover:bg-blue-700'
        )}

        {/* Column 2: Accepted */}
        {renderColumn(
          '2. Accepted',
          'bg-blue-100 text-blue-800',
          acceptedOrders,
          'Start Cooking',
          'PREPARING',
          'bg-indigo-600 hover:bg-indigo-700'
        )}

        {/* Column 3: Preparing */}
        {renderColumn(
          '3. Preparing / Cooking',
          'bg-indigo-100 text-indigo-800',
          preparingOrders,
          'Mark Ready',
          'READY',
          'bg-emerald-600 hover:bg-emerald-700'
        )}

        {/* Column 4: Ready for Pickup */}
        {renderColumn(
          '4. Ready for Pickup',
          'bg-emerald-100 text-emerald-800',
          readyOrders,
          'Mark Collected',
          'COLLECTED',
          'bg-gray-800 hover:bg-black'
        )}
      </div>
    </div>
  );
};
