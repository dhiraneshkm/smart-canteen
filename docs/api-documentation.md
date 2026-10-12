# REST API Specification

### Base URL: `/api`

All protected endpoints require an `Authorization: Bearer <token>` header.

---

### 1. Authentication Endpoints

- **`POST /api/auth/register`**
  - **Body**: `{ "username": "student1", "email": "student1@college.edu", "password": "Password@123", "fullName": "Aarav Sharma", "phone": "9876543210", "role": "STUDENT" }`
  - **Response 201**: `{ "token": "jwt...", "user": { "id": 1, "username": "student1", "email": "student1@college.edu", "role": "STUDENT" } }`

- **`POST /api/auth/login`**
  - **Body**: `{ "username": "student1", "password": "Password@123" }`
  - **Response 200**: `{ "token": "jwt...", "user": { ... } }`

- **`GET /api/auth/me`**
  - **Response 200**: Current authenticated user profile.

- **`PUT /api/auth/profile`**
  - **Body**: `{ "fullName": "Aarav S.", "phone": "9876543210" }`
  - **Response 200**: Updated user profile.

---

### 2. Menu & Categories

- **`GET /api/categories`**: List all active menu categories.
- **`POST /api/admin/categories`** *(ADMIN)*: Create a new category.
- **`PUT /api/admin/categories/{id}`** *(ADMIN)*: Update category.
- **`DELETE /api/admin/categories/{id}`** *(ADMIN)*: Deactivate/delete category.

- **`GET /api/menu`**: List all available food items (supports `?category=1&search=dosa&vegOnly=true`).
- **`GET /api/menu/{id}`**: Get single food item detail.
- **`POST /api/admin/menu`** *(ADMIN)*: Create food item.
- **`PUT /api/admin/menu/{id}`** *(ADMIN)*: Update food item.
- **`DELETE /api/admin/menu/{id}`** *(ADMIN)*: Delete/deactivate food item.

---

### 3. Shopping Cart

- **`GET /api/cart`**: Get active student's cart with items and total.
- **`POST /api/cart/items`**: Add item to cart `{ "foodItemId": 2, "quantity": 1 }`.
- **`PUT /api/cart/items/{id}`**: Update item quantity `{ "quantity": 3 }`.
- **`DELETE /api/cart/items/{id}`**: Remove item from cart.
- **`DELETE /api/cart`**: Clear all cart items.

---

### 4. Pickup Slots

- **`GET /api/pickup-slots`**: List available pickup slots with remaining capacity.
- **`POST /api/admin/pickup-slots`** *(ADMIN)*: Create pickup slot.
- **`PUT /api/admin/pickup-slots/{id}`** *(ADMIN)*: Update slot capacity/hours.

---

### 5. Orders & Checkout

- **`POST /api/orders`**: Create pre-order:
  - **Body**: `{ "pickupSlotId": 1, "paymentMethod": "MOCK_ONLINE_UPI", "specialInstructions": "Less spicy please" }`
  - **Response 201**: Order object with generated `orderNumber`, `queueTicket`, and total calculation.
- **`GET /api/orders/my`**: List student's pre-orders.
- **`GET /api/orders/{id}`**: Get order details.
- **`POST /api/orders/{id}/cancel`**: Cancel eligible pre-order (if PLACED or ACCEPTED).

---

### 6. Queue Tracking

- **`GET /api/queue/status`**: Current active queue board overview.
- **`GET /api/queue/orders/{id}`**: Real-time position and estimated waiting time for order.

---

### 7. Kitchen Operations

- **`GET /api/kitchen/orders`** *(KITCHEN_STAFF, ADMIN)*: Active incoming orders sorted by pickup slot & time.
- **`PATCH /api/kitchen/orders/{id}/status`** *(KITCHEN_STAFF, ADMIN)*:
  - **Body**: `{ "status": "PREPARING" | "READY" | "COLLECTED" | "REJECTED" }`

---

### 8. Payments

- **`POST /api/payments/create`**: Create or confirm payment `{ "orderId": 10, "method": "MOCK_ONLINE_UPI" }`.
- **`GET /api/payments/{id}`**: Payment status.

---

### 9. Admin Analytics & Operations

- **`GET /api/admin/dashboard`**: High-level KPI metrics (revenue, orders today, avg wait time, popular items).
- **`GET /api/admin/orders`**: Paginated & filtered list of all orders.
- **`GET /api/admin/users`**: List all users with status toggle.
- **`PATCH /api/admin/users/{id}/status`**: Enable/disable user.
- **`GET /api/admin/reports`**: Revenue and order statistics with date filtering.
- **`GET /api/admin/reports/export`**: Export order/sales report as CSV download.
- **`GET /api/admin/audit-logs`**: Administrative action logs.
