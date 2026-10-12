import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, ShoppingBag, Plus, Minus, Check, ShieldCheck, Flame } from 'lucide-react';
import { FoodItem } from '../types';
import { menuApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, ToastMessage } from '../components/Toast';

export const FoodItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const { isAuthenticated, role } = useAuth();

  const [item, setItem] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const toastId = Date.now().toString();
    setToasts((prev) => [...prev, { id: toastId, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 3000);
  };

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await menuApi.getMenuItemById(Number(id));
        setItem(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleAddToCart = async () => {
    if (!item) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (role !== 'ROLE_STUDENT') {
      addToast('Only students can add food items to cart', 'error');
      return;
    }

    try {
      setAdding(true);
      await addToCart(item.id, quantity);
      addToast(`Added ${quantity}x "${item.name}" to cart!`, 'success');
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Failed to add item', 'error');
    } finally {
      setTimeout(() => setAdding(false), 500);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-6 w-32 bg-cream-200 rounded"></div>
        <div className="h-80 bg-cream-200 rounded-3xl"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-charcoal-900">Food Item Not Found</h2>
        <Link to="/menu" className="text-sm text-brand-600 underline font-bold mt-2 inline-block">
          Return to Menu
        </Link>
      </div>
    );
  }

  const isOutOfStock = item.stockQuantity <= 0 || !item.available;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <ToastContainer toasts={toasts} onDismiss={(tId) => setToasts((prev) => prev.filter((t) => t.id !== tId))} />

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Food Menu</span>
      </button>

      {/* Main Details Grid */}
      <div className="bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2">
        {/* Left: Food Image */}
        <div className="relative h-72 md:h-full bg-cream-100">
          <img
            src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80'}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-xl shadow-md flex items-center gap-2">
            <div
              className={`w-3.5 h-3.5 border-2 flex items-center justify-center rounded-sm ${
                item.vegetarian ? 'border-emerald-600' : 'border-rose-600'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${item.vegetarian ? 'bg-emerald-600' : 'bg-rose-600'}`} />
            </div>
            <span className="text-xs font-bold text-charcoal-900">
              {item.vegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
            </span>
          </div>
        </div>

        {/* Right: Info and Actions */}
        <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                {item.categoryName}
              </span>
              <h1 className="text-2xl font-black text-charcoal-900 tracking-tight mt-1">{item.name}</h1>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              {item.description || 'Specially crafted by campus chefs with fresh seasonal ingredients.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 py-2 border-y border-cream-200 text-xs">
              <div className="flex items-center gap-1.5 text-gray-600">
                <Clock className="w-4 h-4 text-brand-500" />
                <span>Prep: <strong>{item.preparationTimeMinutes} min</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600">
                <Flame className="w-4 h-4 text-brand-500" />
                <span>Stock: <strong>{item.stockQuantity} left</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700">
                <ShieldCheck className="w-4 h-4" />
                <span>Freshly Cooked</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-gray-400 font-medium">Price</span>
              <p className="text-3xl font-black text-charcoal-900">
                ₹{Number(item.price).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Quantity Controls & Add to Cart */}
          <div className="space-y-4 pt-4">
            {!isOutOfStock ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-cream-300 rounded-xl bg-cream-50 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 rounded-lg hover:bg-white text-charcoal-900 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-extrabold text-charcoal-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(item.stockQuantity, q + 1))}
                    className="p-2 rounded-lg hover:bg-white text-charcoal-900 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="flex-1 py-3 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 transition-all"
                >
                  {adding ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  <span>Add to Pre-Order (₹{(Number(item.price) * quantity).toFixed(2)})</span>
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-center text-xs font-bold text-rose-800">
                Currently Out of Stock
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
