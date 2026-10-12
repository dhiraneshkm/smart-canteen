import React, { useState } from 'react';
import { Clock, Plus, Check, ShoppingBag, Eye } from 'lucide-react';
import { FoodItem } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

interface FoodCardProps {
  item: FoodItem;
  onAdded?: (name: string) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item, onAdded }) => {
  const { cart, addToCart } = useCart();
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const cartItem = cart?.items?.find((ci) => ci.foodItemId === item.id);
  const isOutOfStock = item.stockQuantity <= 0 || !item.available;

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (role !== 'ROLE_STUDENT') {
      alert('Only students can add food items to cart');
      return;
    }
    if (isOutOfStock) return;

    try {
      setAdding(true);
      await addToCart(item.id, 1);
      if (onAdded) onAdded(item.name);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setAdding(false), 500);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-cream-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      {/* Top Image & Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-cream-100">
        <img
          src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Veg/Non-Veg symbol */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-1 rounded-md shadow-sm">
          <div
            className={`w-4 h-4 border-2 flex items-center justify-center rounded-sm ${
              item.vegetarian ? 'border-emerald-600' : 'border-rose-600'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                item.vegetarian ? 'bg-emerald-600' : 'bg-rose-600'
              }`}
            />
          </div>
        </div>

        {/* Preparation time badge */}
        <div className="absolute top-3 right-3 bg-charcoal-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
          <Clock className="w-3 h-3 text-brand-400" />
          <span>{item.preparationTimeMinutes} min</span>
        </div>

        {/* Stock status overlay if out of stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-rose-600 text-white font-bold text-xs uppercase px-3 py-1 rounded-full tracking-wider shadow-md">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick view link */}
        <Link
          to={`/menu/${item.id}`}
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm text-charcoal-800 p-2 rounded-xl shadow-md hover:bg-white hover:text-brand-600"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </Link>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {item.categoryName && (
            <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider">
              {item.categoryName}
            </span>
          )}
          <h3 className="font-bold text-charcoal-900 text-base line-clamp-1 mt-0.5 hover:text-brand-600 transition-colors">
            <Link to={`/menu/${item.id}`}>{item.name}</Link>
          </h3>
          <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
            {item.description || 'Prepared fresh on order with high-quality ingredients.'}
          </p>
        </div>

        {/* Footer: Price & Add Button */}
        <div className="mt-4 pt-3 border-t border-cream-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-medium">Price</span>
            <p className="text-lg font-extrabold text-charcoal-900">
              ₹{Number(item.price).toFixed(2)}
            </p>
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock || adding}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : cartItem
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                : 'bg-brand-600 hover:bg-brand-700 text-white hover:shadow-md hover:shadow-brand-500/25 active:scale-95'
            }`}
          >
            {adding ? (
              <Check className="w-4 h-4 animate-scale" />
            ) : cartItem ? (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>In Cart ({cartItem.quantity})</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Pre-Order</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
