import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartPage: React.FC = () => {
  const { cart, loading, updateQuantity, removeItem, clearCart, totalAmount, totalCount } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-4">
        <div className="h-8 w-48 bg-cream-200 rounded"></div>
        <div className="h-64 bg-cream-100 rounded-3xl"></div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-md shadow-brand-500/10">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-charcoal-900 tracking-tight">Your Cart is Empty</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Explore delicious South & North Indian breakfast, meals, fresh juices, and quick snacks from the campus canteen.
        </p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/25 transition-all mt-4"
        >
          <span>Browse Food Menu</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const subtotal = Number(totalAmount);
  const tax = subtotal * 0.05;
  const grandTotal = subtotal + tax;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-cream-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-charcoal-900 tracking-tight">Your Pre-Order Cart</h1>
          <p className="text-xs text-gray-500">Review selected items before choosing pickup slot</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-cream-200 p-6 divide-y divide-cream-100 shadow-sm space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="pt-4 first:pt-0 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop&q=80'}
                  alt={item.foodItemName}
                  className="w-16 h-16 rounded-2xl object-cover bg-cream-100 flex-shrink-0"
                />
                <div>
                  <h3 className="text-sm font-bold text-charcoal-900">{item.foodItemName}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">₹{Number(item.unitPrice).toFixed(2)} each</p>
                </div>
              </div>

              {/* Quantity steppers & Remove */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-cream-300 rounded-xl bg-cream-50 p-0.5">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1.5 rounded-lg hover:bg-white text-charcoal-900 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-charcoal-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1.5 rounded-lg hover:bg-white text-charcoal-900 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-sm font-extrabold text-charcoal-900 w-16 text-right">
                  ₹{Number(item.subtotal).toFixed(2)}
                </p>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-rose-600 p-1 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-4 flex items-center justify-between">
            <Link
              to="/menu"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Add More Items</span>
            </Link>
            <span className="text-xs text-gray-500 font-medium">
              Total: {totalCount} item{totalCount > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Order Bill Summary */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-cream-200 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-black text-charcoal-900 border-b border-cream-100 pb-3">
            Bill Summary
          </h2>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Item Subtotal</span>
              <span className="font-bold text-charcoal-900">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Campus GST & Taxes (5%)</span>
              <span className="font-bold text-charcoal-900">₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Pickup Convenience</span>
              <span>FREE</span>
            </div>

            <div className="border-t border-cream-100 pt-3 flex justify-between text-sm font-black text-charcoal-900">
              <span>Total Payable</span>
              <span className="text-brand-600 text-lg">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 transition-all mt-4"
          >
            <span>Select Slot & Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
