import React, { useEffect, useState } from 'react';
import { Clock, Plus, Edit2, RefreshCw } from 'lucide-react';
import { PickupSlot } from '../types';
import { adminApi } from '../services/api';
import { Sidebar } from '../components/Sidebar';
import { ToastContainer, ToastMessage } from '../components/Toast';

export const PickupSlotManagementPage: React.FC = () => {
  const [slots, setSlots] = useState<PickupSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<PickupSlot | null>(null);
  const [formData, setFormData] = useState({
    startTime: '12:30',
    endTime: '13:30',
    maxOrdersCapacity: 35,
    active: true,
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  const loadSlots = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAllSlots();
      setSlots(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load pickup slots', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  const openCreateModal = () => {
    setEditingSlot(null);
    setFormData({ startTime: '12:30', endTime: '13:30', maxOrdersCapacity: 35, active: true });
    setModalOpen(true);
  };

  const openEditModal = (slot: PickupSlot) => {
    setEditingSlot(slot);
    setFormData({
      startTime: slot.startTime.slice(0, 5),
      endTime: slot.endTime.slice(0, 5),
      maxOrdersCapacity: slot.maxOrdersCapacity,
      active: slot.active,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        startTime: formData.startTime.length === 5 ? formData.startTime + ':00' : formData.startTime,
        endTime: formData.endTime.length === 5 ? formData.endTime + ':00' : formData.endTime,
        maxOrdersCapacity: formData.maxOrdersCapacity,
        active: formData.active,
      };

      if (editingSlot) {
        await adminApi.updateSlot(editingSlot.id, payload as any);
        addToast('Pickup slot updated successfully', 'success');
      } else {
        await adminApi.createSlot(payload as any);
        addToast('New pickup slot added', 'success');
      }
      setModalOpen(false);
      loadSlots();
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Operation failed', 'error');
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
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Capacity & Scheduling</span>
            <h1 className="text-2xl font-black text-charcoal-900 tracking-tight mt-0.5">Pickup Time Windows</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openCreateModal}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-brand-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Slot</span>
            </button>
            <button onClick={loadSlots} className="p-2 rounded-xl bg-white border border-cream-300">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-cream-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-50 border-b border-cream-200 text-gray-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3 px-4">Time Window</th>
                <th className="py-3 px-4">Max Capacity</th>
                <th className="py-3 px-4">Booked Orders</th>
                <th className="py-3 px-4">Remaining Spots</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100 font-medium text-charcoal-800">
              {loading ? (
                <tr><td colSpan={6} className="py-6 text-center text-gray-400">Loading slots...</td></tr>
              ) : slots.map((s) => (
                <tr key={s.id} className="hover:bg-cream-50/50">
                  <td className="py-3 px-4 font-black text-charcoal-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-600" />
                    <span>{s.label}</span>
                  </td>
                  <td className="py-3 px-4 font-bold">{s.maxOrdersCapacity} orders</td>
                  <td className="py-3 px-4 font-bold text-brand-700">{s.currentBookedCount}</td>
                  <td className="py-3 px-4 font-bold text-emerald-700">{s.remainingCapacity} spots</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                      {s.active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => openEditModal(s)} className="p-1.5 rounded-lg hover:bg-cream-100">
                      <Edit2 className="w-4 h-4" />
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
                {editingSlot ? 'Edit Pickup Slot' : 'Create Pickup Slot'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Start Time</label>
                    <input
                      type="time"
                      required
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-cream-300"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">End Time</label>
                    <input
                      type="time"
                      required
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-cream-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1">Max Orders Capacity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.maxOrdersCapacity}
                    onChange={(e) => setFormData({ ...formData, maxOrdersCapacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-cream-300"
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="rounded text-brand-600"
                    />
                    <span>Slot is Active & Bookable</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl border">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-brand-600 text-white font-bold">Save Slot</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
