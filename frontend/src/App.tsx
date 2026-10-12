import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// 21 Required Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { MenuPage } from './pages/MenuPage';
import { FoodItemDetailPage } from './pages/FoodItemDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { LiveQueueTrackingPage } from './pages/LiveQueueTrackingPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { KitchenDashboardPage } from './pages/KitchenDashboardPage';
import { OrderPreparationBoardPage } from './pages/OrderPreparationBoardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { MenuManagementPage } from './pages/MenuManagementPage';
import { CategoryManagementPage } from './pages/CategoryManagementPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { OrderManagementPage } from './pages/OrderManagementPage';
import { PickupSlotManagementPage } from './pages/PickupSlotManagementPage';
import { SalesReportPage } from './pages/SalesReportPage';
import { ProfilePage } from './pages/ProfilePage';

// Route guards
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xs font-bold text-gray-400">Loading Smart Canteen...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />
      <div className="flex-1">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/menu/:id" element={<FoodItemDetailPage />} />
          <Route path="/queue" element={<LiveQueueTrackingPage />} />

          {/* Student Flow */}
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/confirmation/:id"
            element={
              <ProtectedRoute>
                <OrderConfirmationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
                <StudentDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
                <OrderHistoryPage />
              </ProtectedRoute>
            }
          />

          {/* Kitchen Display Staff Pages */}
          <Route
            path="/kitchen"
            element={
              <ProtectedRoute allowedRoles={['ROLE_KITCHEN_STAFF', 'ROLE_ADMIN']}>
                <KitchenDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kitchen/board"
            element={
              <ProtectedRoute allowedRoles={['ROLE_KITCHEN_STAFF', 'ROLE_ADMIN']}>
                <OrderPreparationBoardPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Suite Pages */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/menu"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <MenuManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <CategoryManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <UserManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <OrderManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/slots"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <PickupSlotManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <SalesReportPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/audit-logs"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <SalesReportPage />
              </ProtectedRoute>
            }
          />

          {/* Shared Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WebSocketProvider>
            <AppContent />
          </WebSocketProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
