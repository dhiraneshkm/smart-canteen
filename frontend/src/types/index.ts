export type UserRole = 'ROLE_STUDENT' | 'ROLE_KITCHEN_STAFF' | 'ROLE_ADMIN';

export type OrderStatus =
  | 'PLACED'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'COLLECTED'
  | 'CANCELLED'
  | 'REJECTED';

export type PaymentMethod =
  | 'CASH_ON_PICKUP'
  | 'MOCK_ONLINE_UPI'
  | 'MOCK_ONLINE_CARD';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export type QueueTicketStatus =
  | 'WAITING'
  | 'PREPARING'
  | 'READY'
  | 'COMPLETED'
  | 'CANCELLED';

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  enabled: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  user: User;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  displayOrder: number;
  active: boolean;
}

export interface FoodItem {
  id: number;
  name: string;
  description?: string;
  categoryId: number;
  categoryName?: string;
  price: number;
  imageUrl?: string;
  stockQuantity: number;
  available: boolean;
  preparationTimeMinutes: number;
  vegetarian: boolean;
  createdAt: string;
}

export interface CartItem {
  id: number;
  foodItemId: number;
  foodItemName: string;
  imageUrl?: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  preparationTimeMinutes: number;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  totalAmount: number;
  totalItemsCount: number;
}

export interface PickupSlot {
  id: number;
  startTime: string;
  endTime: string;
  slotDate?: string;
  maxOrdersCapacity: number;
  currentBookedCount: number;
  remainingCapacity: number;
  active: boolean;
  available: boolean;
  label: string;
}

export interface OrderItem {
  id: number;
  foodItemId: number;
  itemName: string;
  itemPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  customerName: string;
  customerPhone?: string;
  pickupSlotId?: number;
  pickupSlotTime?: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  totalAmount: number;
  specialInstructions?: string;
  cancellationReason?: string;
  items: OrderItem[];
  ticketNumber?: string;
  queuePosition?: number;
  estimatedWaitMinutes?: number;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paymentReference?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface QueueTicket {
  id: number;
  ticketNumber: string;
  orderId: number;
  orderNumber: string;
  queuePosition: number;
  estimatedWaitMinutes: number;
  status: QueueTicketStatus;
  issuedAt: string;
  readyAt?: string;
  completedAt?: string;
}

export interface QueueStatus {
  totalWaitingOrders: number;
  totalPreparingOrders: number;
  totalReadyOrders: number;
  averageWaitMinutes: number;
  activeTickets: QueueTicket[];
}

export interface DashboardMetrics {
  totalOrdersToday: number;
  salesToday: number;
  totalLifetimeSales: number;
  pendingOrders: number;
  preparingOrders: number;
  readyOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  averagePreparationTime: number;
  averageWaitingTime: number;
  cancellationRate: number;
  popularItems: {
    name: string;
    orderCount: number;
    revenue: number;
  }[];
}

export interface SalesReport {
  reportDate: string;
  totalOrders: number;
  grossSales: number;
  completedOrders: number;
  cancelledOrders: number;
}

export interface AuditLog {
  id: number;
  adminUsername: string;
  action: string;
  entityName: string;
  entityId: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
