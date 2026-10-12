import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, RefreshCw } from 'lucide-react';
import { Category } from '../types';
import { adminApi, menuApi } from '../services/api';
import { Sidebar } from '../components/Sidebar';
import { ToastContainer, ToastMessage } from '../components/Toast';

export const CategoryManagementPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', displayOrder: 1, active: true });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', displayOrder: categories.length + 1, active: true });
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, description: cat.description || '', displayOrder: cat.displayOrder, active: cat.active });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await adminApi.updateCategory(editingCategory.id, formData);
        addToast(`Updated category "${formData.name}"`, 'success');
      } else {
        await adminApi.createCategory(formData);
        addToast(`Created category "${formData.name}"`, 'success');
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
      await adminApi.deleteCategory(id);
      addToast(`Deactivated "${name}"`, 'info');
      loadData();
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Failed to deactivate', 'error');
    }
  };

  return (
    <div className="flex">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Categories</span>
            <h1 className="text-2xl font-black text-charcoal-900 tracking-tight mt-0.5">Menu Categories</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openCreateModal}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-brand-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
            <button onClick={loadData} className="p-2 rounded-xl bg-white border border-cream-300">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-cream-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-50 border-b border-cream-200 text-gray-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3 px-4">Display Order</th>
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100 font-medium text-charcoal-800">
              {loading ? (
                <tr><td colSpan={5} className="py-6 text-center text-gray-400">Loading categories...</td></tr>
              ) : categories.map((c) => (
                <tr key={c.id} className="hover:bg-cream-50/50">
                  <td className="py-3 px-4 font-bold text-brand-600">#{c.displayOrder}</td>
                  <td className="py-3 px-4 font-bold text-charcoal-900">{c.name}</td>
                  <td className="py-3 px-4 text-gray-500">{c.description || '-'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                      {c.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    <button onClick={() => openEditModal(c)} className="p-1.5 rounded-lg hover:bg-cream-100">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(c.id, c.name)} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in">
              <h3 className="text-base font-bold text-charcoal-900">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl border">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-brand-600 text-white font-bold">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
