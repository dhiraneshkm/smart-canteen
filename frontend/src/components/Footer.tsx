import React from 'react';
import { Utensils, Heart, ShieldCheck, Clock, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal-900 text-cream-100 border-t border-charcoal-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white">
                <Utensils className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Smart Canteen</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Campus Pre-Order and Real-Time Queue Management System. Zero counter waiting, smart time slot pickups, and instant ticket tracking.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-400">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Hygienic & Fresh Food Guarantee</span>
            </div>
          </div>

          {/* Timings */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Kitchen Hours</h4>
            <ul className="text-xs space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-brand-400" />
                <span>Breakfast: 08:00 AM - 11:00 AM</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-brand-400" />
                <span>Lunch Peak: 12:00 PM - 03:00 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-brand-400" />
                <span>Evening Snacks: 04:00 PM - 07:30 PM</span>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Explore</h4>
            <ul className="text-xs space-y-2 text-gray-400">
              <li>
                <Link to="/menu" className="hover:text-brand-400 transition-colors">Daily Menu</Link>
              </li>
              <li>
                <Link to="/queue" className="hover:text-brand-400 transition-colors">Live Queue Tracker</Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-brand-400 transition-colors">Order Status & History</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-brand-400 transition-colors">Student Profile</Link>
              </li>
            </ul>
          </div>

          {/* Campus Location */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Campus Location</h4>
            <p className="text-xs text-gray-400 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
              <span>Central Food Court, Ground Floor, Academic Block B, Engineering Campus</span>
            </p>
            <p className="text-xs text-gray-400 flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-400" />
              <span>Kitchen Helpline: Ext 402 / +91 98765 43201</span>
            </p>
          </div>
        </div>

        <div className="border-t border-charcoal-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Smart Canteen Management System. Academic Mini Project.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Engineered with <Heart className="w-3 h-3 text-brand-500 fill-brand-500" /> using Java 21, Spring Boot & React
          </p>
        </div>
      </div>
    </footer>
  );
};
