import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { FoodItem, Category } from '../types';
import { adminApi, menuApi } from '../services/api';
import { Sidebar } from '../components/Sidebar';
import { ToastContainer, ToastMessage } from '../components/Toast';

export const MenuManagementPage: React.FC = () => {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: 1,
    price: 50,
    imageUrl: '',
    stockQuantity: 20,
    available: true,
    preparationTimeMinutes: 10,
    vegetarian: true,
  });

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [itemsData, catsData] = await Promise.all([
        adminApi.getAllMenuItems(),
        menuApi.getCategories(),
      ]);
      setItems(itemsData);
      setCategories(catsData);
      if (catsData.length > 0) {
        setFormData((prev) => ({ ...prev, categoryId: catsData[0].id }));
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to load menu data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      categoryId: categories[0]?.id || 1,
      price: 50,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      stockQuantity: 30,
      available: true,
      preparationTimeMinutes: 10,
      vegetarian: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: FoodItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      categoryId: item.categoryId,
      price: Number(item.price),
      imageUrl: item.imageUrl || '',
      stockQuantity: item.stockQuantity,
      available: item.available,
      preparationTimeMinutes: item.preparationTimeMinutes,
      vegetarian: item.vegetarian,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await adminApi.updateMenuItem(editingItem.id, formData);
        addToast(`Updated "${formData.name}" successfully`, 'success');
      } else {
        await adminApi.createMenuItem(formData);
        addToast(`Added "${formData.name}" to menu`, 'success');
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to deactivate "${name}"?`)) return;
    try {
      await adminApi.deleteMenuItem(id);
      addToast(`Deactivated "${name}"`, 'info');
      loadData();
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Failed to deactivate item', 'error');
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.categoryName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Menu Management</span>
            <h1 className="text-2xl font-black text-charcoal-900 tracking-tight mt-0.5">Food Items & Pricing</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openCreateModal}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-brand-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Food Item</span>
            </button>
            <button
              onClick={loadData}
              className="p-2 rounded-xl bg-white border border-cream-300 text-charcoal-800 hover:border-brand-500"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items by title or category..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-cream-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-50 border-b border-cream-200 text-gray-400 uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price (INR)</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Prep Time</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100 font-medium text-charcoal-800">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-400">Loading menu records...</td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-400">No matching food items found.</td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-cream-50/50">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=80'}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover bg-cream-100 flex-shrink-0"
                        />
                        <div>
                          <p className="font-bold text-charcoal-900">{item.name}</p>
                          <p className="text-[10px] text-gray-400 truncate max-w-xs">{item.description}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-brand-700">{item.categoryName}</td>
                      <td className="py-3 px-4 font-black">₹{Number(item.price).toFixed(2)}</td>
                      <td className="py-3 px-4 font-bold">
                        <span className={item.stockQuantity < 10 ? 'text-rose-600' : 'text-charcoal-900'}>
                          {item.stockQuantity}
                        </span>
                      </td>
                      <td className="py-3 px-4">{item.preparationTimeMinutes} min</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.vegetarian ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                          {item.vegetarian ? 'Veg' : 'Non-Veg'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.available ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                          {item.available ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg hover:bg-cream-100 text-charcoal-800 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors"
                          title="Deactivate"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-cream-100 pb-3">
                <h3 className="text-base font-bold text-charcoal-900">
                  {editingItem ? 'Edit Food Item' : 'Add New Food Item'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-charcoal-900">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-charcoal-800 mb-1">Item Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal-800 mb-1">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-charcoal-800 mb-1">Price in INR (₹)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-charcoal-800 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-charcoal-800 mb-1">Prep Time (Minutes)</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formData.preparationTimeMinutes}
                      onChange={(e) => setFormData({ ...formData, preparationTimeMinutes: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div className="flex items-center gap-4 pt-5">
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                      <input
                        type="checkbox"
                        checked={formData.vegetarian}
                        onChange={(e) => setFormData({ ...formData, vegetarian: e.target.checked })}
                        className="rounded text-brand-600 focus:ring-brand-500"
                      />
                      <span>Vegetarian</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                      <input
                        type="checkbox"
                        checked={formData.available}
                        onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                        className="rounded text-brand-600 focus:ring-brand-500"
                      />
                      <span>Active</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-charcoal-800 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal-800 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-cream-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-cream-300 text-charcoal-800 font-bold hover:bg-cream-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md shadow-brand-500/20"
                  >
                    Save Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
