import axios from 'axios';
import {
  ApiResponse,
  AuthResponse,
  Category,
  FoodItem,
  Cart,
  PickupSlot,
  Order,
  QueueStatus,
  QueueTicket,
  DashboardMetrics,
  SalesReport,
  AuditLog,
  User,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from '../types';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle unauthenticated or token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (credentials: { username: string; password: string }): Promise<AuthResponse> => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return res.data.data;
  },
  register: async (userData: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role?: string;
  }): Promise<AuthResponse> => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    return res.data.data;
  },
  getCurrentUser: async (): Promise<User> => {
    const res = await api.get<ApiResponse<User>>('/auth/me');
    return res.data.data;
  },
  updateProfile: async (data: { fullName: string; phone?: string }): Promise<User> => {
    const res = await api.put<ApiResponse<User>>('/auth/profile', data);
    return res.data.data;
  },
};

export const menuApi = {
  getCategories: async (): Promise<Category[]> => {
    const res = await api.get<ApiResponse<Category[]>>('/categories');
    return res.data.data;
  },
  getMenuItems: async (params?: { categoryId?: number; isVegetarian?: boolean; search?: string }): Promise<FoodItem[]> => {
    const res = await api.get<ApiResponse<FoodItem[]>>('/menu', { params });
    return res.data.data;
  },
  getMenuItemById: async (id: number): Promise<FoodItem> => {
    const res = await api.get<ApiResponse<FoodItem>>(`/menu/${id}`);
    return res.data.data;
  },
};

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const res = await api.get<ApiResponse<Cart>>('/cart');
    return res.data.data;
  },
  addToCart: async (foodItemId: number, quantity: number = 1): Promise<Cart> => {
    const res = await api.post<ApiResponse<Cart>>('/cart/items', { foodItemId, quantity });
    return res.data.data;
  },
  updateCartItem: async (cartItemId: number, quantity: number): Promise<Cart> => {
    const res = await api.put<ApiResponse<Cart>>(`/cart/items/${cartItemId}`, { quantity });
    return res.data.data;
  },
  removeCartItem: async (cartItemId: number): Promise<Cart> => {
    const res = await api.delete<ApiResponse<Cart>>(`/cart/items/${cartItemId}`);
    return res.data.data;
  },
  clearCart: async (): Promise<void> => {
    await api.delete('/cart');
  },
};

export const slotApi = {
  getPickupSlots: async (): Promise<PickupSlot[]> => {
    const res = await api.get<ApiResponse<PickupSlot[]>>('/pickup-slots');
    return res.data.data;
  },
};

export const orderApi = {
  createOrder: async (data: {
    pickupSlotId: number;
    paymentMethod: PaymentMethod;
    specialInstructions?: string;
  }): Promise<Order> => {
    const res = await api.post<ApiResponse<Order>>('/orders', data);
    return res.data.data;
  },
  getMyOrders: async (): Promise<Order[]> => {
    const res = await api.get<ApiResponse<Order[]>>('/orders/my');
    return res.data.data;
  },
  getOrderById: async (id: number): Promise<Order> => {
    const res = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    return res.data.data;
  },
  cancelOrder: async (id: number, reason?: string): Promise<Order> => {
    const res = await api.post<ApiResponse<Order>>(`/orders/${id}/cancel`, { reason });
    return res.data.data;
  },
};

export const queueApi = {
  getQueueStatus: async (): Promise<QueueStatus> => {
    const res = await api.get<ApiResponse<QueueStatus>>('/queue/status');
    return res.data.data;
  },
  getOrderTicket: async (orderId: number): Promise<QueueTicket> => {
    const res = await api.get<ApiResponse<QueueTicket>>(`/queue/orders/${orderId}`);
    return res.data.data;
  },
};

export const kitchenApi = {
  getOrders: async (): Promise<Order[]> => {
    const res = await api.get<ApiResponse<Order[]>>('/kitchen/orders');
    return res.data.data;
  },
  updateStatus: async (orderId: number, status: OrderStatus, note?: string): Promise<Order> => {
    const res = await api.patch<ApiResponse<Order>>(`/kitchen/orders/${orderId}/status`, { status, note });
    return res.data.data;
  },
};

export const paymentApi = {
  createPayment: async (orderId: number, paymentMethod: PaymentMethod) => {
    const res = await api.post('/payments/create', { orderId, paymentMethod });
    return res.data.data;
  },
  getPaymentById: async (id: number) => {
    const res = await api.get(`/payments/${id}`);
    return res.data.data;
  },
};

export const adminApi = {
  getDashboardMetrics: async (): Promise<DashboardMetrics> => {
    const res = await api.get<ApiResponse<DashboardMetrics>>('/admin/dashboard');
    return res.data.data;
  },
  getAllOrders: async (): Promise<Order[]> => {
    const res = await api.get<ApiResponse<Order[]>>('/admin/orders');
    return res.data.data;
  },
  getAllUsers: async (): Promise<User[]> => {
    const res = await api.get<ApiResponse<User[]>>('/admin/users');
    return res.data.data;
  },
  toggleUserStatus: async (id: number, enabled: boolean): Promise<User> => {
    const res = await api.patch<ApiResponse<User>>(`/admin/users/${id}/status`, { enabled });
    return res.data.data;
  },

  // Categories
  getAllCategories: async (): Promise<Category[]> => {
    const res = await api.get<ApiResponse<Category[]>>('/categories');
    return res.data.data;
  },
  createCategory: async (category: Partial<Category>): Promise<Category> => {
    const res = await api.post<ApiResponse<Category>>('/admin/categories', category);
    return res.data.data;
  },
  updateCategory: async (id: number, category: Partial<Category>): Promise<Category> => {
    const res = await api.put<ApiResponse<Category>>(`/admin/categories/${id}`, category);
    return res.data.data;
  },
  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`/admin/categories/${id}`);
  },

  // Menu Items
  getAllMenuItems: async (): Promise<FoodItem[]> => {
    const res = await api.get<ApiResponse<FoodItem[]>>('/admin/menu');
    return res.data.data;
  },
  createMenuItem: async (item: Partial<FoodItem>): Promise<FoodItem> => {
    const res = await api.post<ApiResponse<FoodItem>>('/admin/menu', item);
    return res.data.data;
  },
  updateMenuItem: async (id: number, item: Partial<FoodItem>): Promise<FoodItem> => {
    const res = await api.put<ApiResponse<FoodItem>>(`/admin/menu/${id}`, item);
    return res.data.data;
  },
  deleteMenuItem: async (id: number): Promise<void> => {
    await api.delete(`/admin/menu/${id}`);
  },

  // Pickup Slots
  getAllSlots: async (): Promise<PickupSlot[]> => {
    const res = await api.get<ApiResponse<PickupSlot[]>>('/admin/pickup-slots');
    return res.data.data;
  },
  createSlot: async (slot: Partial<PickupSlot>): Promise<PickupSlot> => {
    const res = await api.post<ApiResponse<PickupSlot>>('/admin/pickup-slots', slot);
    return res.data.data;
  },
  updateSlot: async (id: number, slot: Partial<PickupSlot>): Promise<PickupSlot> => {
    const res = await api.put<ApiResponse<PickupSlot>>(`/admin/pickup-slots/${id}`, slot);
    return res.data.data;
  },

  // Reports
  getReports: async (startDate?: string, endDate?: string): Promise<SalesReport[]> => {
    const res = await api.get<ApiResponse<SalesReport[]>>('/admin/reports', {
      params: { startDate, endDate },
    });
    return res.data.data;
  },
  getAuditLogs: async (): Promise<AuditLog[]> => {
    const res = await api.get<ApiResponse<AuditLog[]>>('/admin/audit-logs');
    return res.data.data;
  },
};

export default api;
