import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Utensils, ShoppingBag, Clock, User, LogOut, Menu as MenuIcon, X, LayoutDashboard, ChefHat, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-cream-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-charcoal-900 to-brand-800 bg-clip-text text-transparent">
                Smart Canteen
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-cream-200 text-brand-800">
                Pre-Order & Queue
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/menu"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/menu')
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-charcoal-800 hover:text-brand-600 hover:bg-cream-100'
              }`}
            >
              Food Menu
            </Link>

            <Link
              to="/queue"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                isActive('/queue')
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-charcoal-800 hover:text-brand-600 hover:bg-cream-100'
              }`}
            >
              <Clock className="w-4 h-4 text-brand-500" />
              Live Queue
            </Link>

            {user?.role === 'ROLE_STUDENT' && (
              <>
                <Link
                  to="/student"
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive('/student')
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-charcoal-800 hover:text-brand-600 hover:bg-cream-100'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/orders"
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive('/orders')
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-charcoal-800 hover:text-brand-600 hover:bg-cream-100'
                  }`}
                >
                  My Orders
                </Link>
              </>
            )}

            {user?.role === 'ROLE_KITCHEN_STAFF' && (
              <Link
                to="/kitchen/board"
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                  location.pathname.startsWith('/kitchen')
                    ? 'bg-brand-50 text-brand-600'
                    : 'text-charcoal-800 hover:text-brand-600 hover:bg-cream-100'
                }`}
              >
                <ChefHat className="w-4 h-4 text-brand-600" />
                Kitchen Display (KDS)
              </Link>
            )}

            {user?.role === 'ROLE_ADMIN' && (
              <Link
                to="/admin"
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-brand-50 text-brand-600'
                    : 'text-charcoal-800 hover:text-brand-600 hover:bg-cream-100'
                }`}
              >
                <Shield className="w-4 h-4 text-brand-600" />
                Admin Console
              </Link>
            )}
          </nav>

          {/* Right Action Icons & User Dropdown */}
          <div className="flex items-center gap-3">
            {/* Cart Button (Always visible for students or guests) */}
            {(!user || user.role === 'ROLE_STUDENT') && (
              <Link
                to="/cart"
                className="relative p-2.5 rounded-xl bg-cream-100 text-charcoal-800 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                title="View Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center animate-bounce">
                    {totalCount}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl border border-cream-200 hover:border-brand-300 bg-cream-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold leading-tight text-charcoal-900">{user.fullName}</p>
                    <p className="text-[10px] text-gray-500 capitalize">{user.role.replace('ROLE_', '').toLowerCase().replace('_', ' ')}</p>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-cream-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-cream-100">
                      <p className="text-xs font-semibold text-charcoal-900">{user.fullName}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-charcoal-800 hover:bg-cream-100 hover:text-brand-600"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>

                    {user.role === 'ROLE_STUDENT' && (
                      <Link
                        to="/student"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-charcoal-800 hover:bg-cream-100 hover:text-brand-600"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Student Dashboard
                      </Link>
                    )}

                    {user.role === 'ROLE_KITCHEN_STAFF' && (
                      <Link
                        to="/kitchen/board"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-charcoal-800 hover:bg-cream-100 hover:text-brand-600"
                      >
                        <ChefHat className="w-4 h-4" />
                        Preparation Board
                      </Link>
                    )}

                    {user.role === 'ROLE_ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-charcoal-800 hover:bg-cream-100 hover:text-brand-600"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-cream-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-bold text-charcoal-900 hover:text-brand-600 rounded-lg transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-lg shadow-sm hover:shadow transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-charcoal-800 hover:bg-cream-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-cream-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <Link
            to="/menu"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-charcoal-800 hover:bg-cream-100"
          >
            Food Menu
          </Link>
          <Link
            to="/queue"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-charcoal-800 hover:bg-cream-100"
          >
            Live Queue Tracker
          </Link>
          {user?.role === 'ROLE_STUDENT' && (
            <>
              <Link
                to="/student"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-charcoal-800 hover:bg-cream-100"
              >
                Student Dashboard
              </Link>
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-charcoal-800 hover:bg-cream-100"
              >
                My Orders
              </Link>
            </>
          )}
          {user?.role === 'ROLE_KITCHEN_STAFF' && (
            <Link
              to="/kitchen/board"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-charcoal-800 hover:bg-cream-100"
            >
              Kitchen Preparation Board
            </Link>
          )}
          {user?.role === 'ROLE_ADMIN' && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-charcoal-800 hover:bg-cream-100"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
