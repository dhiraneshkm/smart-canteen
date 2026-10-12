import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Tags,
  ShoppingBag,
  Clock,
  Users,
  BarChart3,
  FileText,
  ChefHat,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isKitchen = user?.role === 'ROLE_KITCHEN_STAFF';

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
      isActive
        ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
        : 'text-charcoal-800 hover:bg-cream-100 hover:text-brand-600'
    }`;

  return (
    <aside className="w-64 bg-white border-r border-cream-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        {isAdmin && (
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 px-3.5 mb-2">
              Administration
            </p>
            <nav className="space-y-1">
              <NavLink to="/admin" end className={linkClass}>
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </NavLink>
              <NavLink to="/admin/orders" className={linkClass}>
                <ShoppingBag className="w-4 h-4" />
                <span>All Orders</span>
              </NavLink>
              <NavLink to="/admin/menu" className={linkClass}>
                <UtensilsCrossed className="w-4 h-4" />
                <span>Menu Management</span>
              </NavLink>
              <NavLink to="/admin/categories" className={linkClass}>
                <Tags className="w-4 h-4" />
                <span>Categories</span>
              </NavLink>
              <NavLink to="/admin/slots" className={linkClass}>
                <Clock className="w-4 h-4" />
                <span>Pickup Slots</span>
              </NavLink>
              <NavLink to="/admin/users" className={linkClass}>
                <Users className="w-4 h-4" />
                <span>User Accounts</span>
              </NavLink>
              <NavLink to="/admin/reports" className={linkClass}>
                <BarChart3 className="w-4 h-4" />
                <span>Sales Reports</span>
              </NavLink>
              <NavLink to="/admin/audit-logs" className={linkClass}>
                <FileText className="w-4 h-4" />
                <span>Audit Logs</span>
              </NavLink>
            </nav>
          </div>
        )}

        {(isAdmin || isKitchen) && (
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 px-3.5 mb-2">
              Kitchen Display System
            </p>
            <nav className="space-y-1">
              <NavLink to="/kitchen/board" className={linkClass}>
                <ChefHat className="w-4 h-4" />
                <span>Preparation Board</span>
              </NavLink>
              <NavLink to="/kitchen" end className={linkClass}>
                <LayoutDashboard className="w-4 h-4" />
                <span>Kitchen Metrics</span>
              </NavLink>
            </nav>
          </div>
        )}
      </div>

      <div className="p-3 bg-cream-50 rounded-xl border border-cream-200 text-center">
        <p className="text-[11px] font-bold text-charcoal-900">Logged in as {user?.username}</p>
        <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-brand-100 text-brand-800 font-semibold uppercase">
          {user?.role.replace('ROLE_', '')}
        </span>
      </div>
    </aside>
  );
};
