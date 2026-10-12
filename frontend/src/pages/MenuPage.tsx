import React, { useEffect, useState } from 'react';
import { Search, Filter, Leaf, RefreshCw, ShoppingBag } from 'lucide-react';
import { FoodItem, Category } from '../types';
import { menuApi } from '../services/api';
import { FoodCard } from '../components/FoodCard';
import { ToastContainer, ToastMessage } from '../components/Toast';

export const MenuPage: React.FC = () => {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const loadMenu = async () => {
    try {
      setLoading(true);
      const [catsData, itemsData] = await Promise.all([
        menuApi.getCategories(),
        menuApi.getMenuItems({
          categoryId: selectedCategory || undefined,
          isVegetarian: vegOnly ? true : undefined,
          search: search.trim() || undefined,
        }),
      ]);
      setCategories(catsData);
      setItems(itemsData);
    } catch (err) {
      console.error(err);
      addToast('Failed to load menu items', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, [selectedCategory, vegOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadMenu();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-cream-200 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Daily Campus Dining</span>
          <h1 className="text-3xl font-black text-charcoal-900 tracking-tight mt-0.5">Explore Canteen Menu</h1>
          <p className="text-xs text-gray-500 mt-1">Pre-order freshly prepared breakfast, lunch, combos, and snacks</p>
        </div>

        {/* Veg Only Switch */}
        <button
          onClick={() => setVegOnly(!vegOnly)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
            vegOnly
              ? 'bg-emerald-50 text-emerald-800 border-emerald-400 shadow-sm'
              : 'bg-white text-gray-600 border-cream-300 hover:border-gray-400'
          }`}
        >
          <Leaf className={`w-4 h-4 ${vegOnly ? 'text-emerald-600 fill-emerald-600' : 'text-gray-400'}`} />
          <span>Pure Vegetarian Only</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === null
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                : 'bg-white border border-cream-200 text-charcoal-800 hover:bg-cream-100'
            }`}
          >
            All Items
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === c.id
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                  : 'bg-white border border-cream-200 text-charcoal-800 hover:bg-cream-100'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dosa, thali, coffee..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-cream-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs font-medium"
          />
        </form>
      </div>

      {/* Food Items Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-80 bg-cream-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-cream-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-cream-100 text-gray-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-charcoal-900">No Food Items Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try adjusting your search keyword or selected category filter.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory(null);
              setVegOnly(false);
            }}
            className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <FoodCard
              key={item.id}
              item={item}
              onAdded={(name) => addToast(`Added "${name}" to your cart!`, 'success')}
            />
          ))}
        </div>
      )}
    </div>
  );
};
