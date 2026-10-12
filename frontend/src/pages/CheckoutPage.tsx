import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CreditCard, Banknote, QrCode, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { PickupSlot, PaymentMethod } from '../types';
import { slotApi, orderApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, totalAmount, refreshCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [slots, setSlots] = useState<PickupSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('MOCK_ONLINE_UPI');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!cart || !cart.items || cart.items.length === 0) {
      navigate('/cart');
      return;
    }

    const loadSlots = async () => {
      try {
        const data = await slotApi.getPickupSlots();
        setSlots(data);
        const available = data.find((s) => s.available);
        if (available) {
          setSelectedSlotId(available.id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadSlots();
  }, [isAuthenticated, cart]);

  const subtotal = Number(totalAmount);
  const tax = subtotal * 0.05;
  const grandTotal = subtotal + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotId) {
      setError('Please select an available pickup time slot');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const order = await orderApi.createOrder({
        pickupSlotId: selectedSlotId,
        paymentMethod,
        specialInstructions: specialInstructions.trim() || undefined,
      });

      await refreshCart();
      navigate(`/orders/confirmation/${order.id}`, { state: { order } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order. Slot might be full.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-cream-200 pb-4">
        <h1 className="text-2xl font-black text-charcoal-900 tracking-tight">Checkout & Slot Reservation</h1>
        <p className="text-xs text-gray-500">Pick your convenient collection window and complete pre-order</p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="space-y-8">
        {/* Step 1: Pickup Slot Selection */}
        <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h2 className="text-base font-bold text-charcoal-900">Select Pickup Recess Slot</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {slots.map((slot) => (
              <label
                key={slot.id}
                className={`relative flex flex-col p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedSlotId === slot.id
                    ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20'
                    : slot.available
                    ? 'border-cream-200 bg-white hover:border-brand-300'
                    : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                }`}
              >
                <input
                  type="radio"
                  name="pickupSlot"
                  value={slot.id}
                  disabled={!slot.available}
                  checked={selectedSlotId === slot.id}
                  onChange={() => setSelectedSlotId(slot.id)}
                  className="sr-only"
                />
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-charcoal-900">
                    <Clock className="w-3.5 h-3.5 text-brand-600" />
                    <span>{slot.label}</span>
                  </div>
                  {selectedSlotId === slot.id && (
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  )}
                </div>
                <div className="text-[11px] font-medium text-gray-500">
                  {slot.available ? (
                    <span className="text-emerald-700 font-bold">
                      {slot.remainingCapacity} spots remaining
                    </span>
                  ) : (
                    <span className="text-rose-600 font-bold">Fully Booked</span>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Step 2: Payment Method */}
        <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h2 className="text-base font-bold text-charcoal-900">Select Payment Mode</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label
              className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                paymentMethod === 'MOCK_ONLINE_UPI'
                  ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20'
                  : 'border-cream-200 bg-white hover:border-brand-300'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="MOCK_ONLINE_UPI"
                checked={paymentMethod === 'MOCK_ONLINE_UPI'}
                onChange={() => setPaymentMethod('MOCK_ONLINE_UPI')}
                className="sr-only"
              />
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-brand-600" />
                <span className="text-xs font-bold text-charcoal-900">Online UPI (Simulated)</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">Instant digital verification</p>
            </label>

            <label
              className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                paymentMethod === 'MOCK_ONLINE_CARD'
                  ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20'
                  : 'border-cream-200 bg-white hover:border-brand-300'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="MOCK_ONLINE_CARD"
                checked={paymentMethod === 'MOCK_ONLINE_CARD'}
                onChange={() => setPaymentMethod('MOCK_ONLINE_CARD')}
                className="sr-only"
              />
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-600" />
                <span className="text-xs font-bold text-charcoal-900">Card / NetBanking</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">Simulated payment</p>
            </label>

            <label
              className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                paymentMethod === 'CASH_ON_PICKUP'
                  ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20'
                  : 'border-cream-200 bg-white hover:border-brand-300'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="CASH_ON_PICKUP"
                checked={paymentMethod === 'CASH_ON_PICKUP'}
                onChange={() => setPaymentMethod('CASH_ON_PICKUP')}
                className="sr-only"
              />
              <div className="flex items-center gap-2">
                <Banknote className="w-5 h-5 text-brand-600" />
                <span className="text-xs font-bold text-charcoal-900">Pay Cash at Counter</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">Pay on food collection</p>
            </label>
          </div>
        </div>

        {/* Step 3: Special Notes */}
        <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-sm space-y-3">
          <label className="block text-xs font-bold text-charcoal-900">
            Kitchen Cooking Notes (Optional)
          </label>
          <input
            type="text"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="e.g. Extra spicy, no onions, keep separate packing"
            className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Submit Bar */}
        <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-gray-400">Total Pre-Order Amount (incl. 5% GST)</span>
            <p className="text-2xl font-black text-brand-600">₹{grandTotal.toFixed(2)}</p>
          </div>

          <button
            type="submit"
            disabled={loading || !selectedSlotId}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Confirming Ticket...' : 'Confirm Pre-Order & Generate Ticket'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
