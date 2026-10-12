import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Utensils,
  Clock,
  Zap,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Ticket,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { FoodItem, Category } from '../types';
import { menuApi, queueApi } from '../services/api';
import { FoodCard } from '../components/FoodCard';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  const [popularItems, setPopularItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeQueueCount, setActiveQueueCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, items, qStatus] = await Promise.all([
          menuApi.getCategories(),
          menuApi.getMenuItems(),
          queueApi.getQueueStatus().catch(() => null),
        ]);
        setCategories(cats.slice(0, 5));
        setPopularItems(items.slice(0, 4));
        if (qStatus) {
          setActiveQueueCount(qStatus.totalWaitingOrders + qStatus.totalPreparingOrders);
        }
      } catch (err) {
        console.error('Error fetching landing data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Demo Credentials Alert Banner */}
      <div className="bg-brand-900 text-cream-100 py-3 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-brand-500 text-white font-extrabold px-2 py-0.5 rounded text-[10px] uppercase">
              Demo Logins
            </span>
            <span>
              <strong>Student:</strong> student / Password@123 &nbsp;|&nbsp;
              <strong>Kitchen:</strong> kitchen / Password@123 &nbsp;|&nbsp;
              <strong>Admin:</strong> admin / Password@123
            </span>
          </div>
          <Link to="/login" className="text-brand-300 hover:text-white underline font-bold">
            Quick Sign In →
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 text-brand-800 text-xs font-bold border border-brand-200">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Smart Campus Dining Experience</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-charcoal-900 tracking-tight leading-[1.15]">
              Skip The Counter Lines.{' '}
              <span className="bg-gradient-to-r from-brand-600 to-amber-600 bg-clip-text text-transparent">
                Pre-Order Fresh Food.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl">
              Order your favorite canteen meals in advance, pick your preferred recess slot,
              and receive real-time queue ticket tracking. No more standing in 30-minute campus queues!
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/menu"
                className="px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/35 transition-all transform hover:-translate-y-0.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explore Food Menu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/queue"
                className="px-6 py-3.5 rounded-xl bg-white border border-cream-300 hover:border-brand-500 text-charcoal-900 font-bold text-sm flex items-center gap-2 shadow-sm hover:shadow transition-all"
              >
                <Clock className="w-4 h-4 text-brand-600" />
                <span>Live Queue Board</span>
              </Link>
            </div>

            {/* Quick Live Stats Pills */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-cream-200 max-w-lg">
              <div>
                <p className="text-2xl font-black text-brand-600">{activeQueueCount}</p>
                <p className="text-xs text-gray-500 font-medium">Active In Queue</p>
              </div>
              <div>
                <p className="text-2xl font-black text-charcoal-900">8-12 min</p>
                <p className="text-xs text-gray-500 font-medium">Avg Prep Time</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-600">0 min</p>
                <p className="text-xs text-gray-500 font-medium">Counter Wait</p>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-cream-100 aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000&auto=format&fit=crop&q=80"
                alt="Delicious Canteen Meals"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
                  Featured Daily Special
                </span>
                <h3 className="text-xl font-extrabold">Ghee Podi Masala Dosa & Sambar</h3>
                <p className="text-xs text-gray-300 mt-1">
                  Crispy, hot, and prepared in under 8 minutes with fresh coconut chutney.
                </p>
              </div>
            </div>

            {/* Floating Live Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-cream-200 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-sm">
                <Ticket className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <p className="text-xs font-bold text-charcoal-900">Ticket #TKT-104</p>
                </div>
                <p className="text-[11px] text-emerald-600 font-bold">Ready for Pickup at Counter 1</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="bg-white py-16 border-y border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600">Effortless Workflow</h2>
            <h3 className="text-3xl font-black text-charcoal-900 mt-1">How Pre-Order Works in 3 Steps</h3>
            <p className="text-sm text-gray-500 mt-2">Designed specifically for fast campus dining and lunch breaks.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-brand-500/20">
                1
              </div>
              <h4 className="text-base font-bold text-charcoal-900">Select Food & Pickup Slot</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Browse our real-time canteen menu, customize your order, and choose your preferred recess window.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-brand-500/20">
                2
              </div>
              <h4 className="text-base font-bold text-charcoal-900">Instant Digital Queue Ticket</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Get a unique ticket number with calculated waiting time updated in real time via WebSocket live sync.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-brand-500/20">
                3
              </div>
              <h4 className="text-base font-bold text-charcoal-900">Collect & Enjoy Fresh Food</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Walk up to the counter when your ticket lights up green, present your digital ticket, and grab your hot meal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Menu Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Student Favorites</span>
            <h3 className="text-2xl font-black text-charcoal-900">Most Ordered Today</h3>
          </div>
          <Link
            to="/menu"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>View Full Menu</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-72 bg-cream-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularItems.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
