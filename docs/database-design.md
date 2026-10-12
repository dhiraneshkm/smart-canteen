# Database Design & Schema Specification

## 1. Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USERS ||--o{ CARTS : "owns"
    USERS ||--o{ ORDERS : "places"
    USERS ||--o{ NOTIFICATIONS : "receives"
    USERS ||--o{ AUDIT_LOGS : "triggers"
    CATEGORIES ||--o{ FOOD_ITEMS : "contains"
    CARTS ||--o{ CART_ITEMS : "contains"
    FOOD_ITEMS ||--o{ CART_ITEMS : "referenced_in"
    ORDERS ||--o{ ORDER_ITEMS : "contains"
    FOOD_ITEMS ||--o{ ORDER_ITEMS : "referenced_in"
    PICKUP_SLOTS ||--o{ ORDERS : "scheduled_in"
    ORDERS ||--|| QUEUE_TICKETS : "generates"
    ORDERS ||--|| PAYMENTS : "billed_by"

    USERS {
        bigint id PK
        varchar username UK
        varchar email UK
        varchar password
        varchar full_name
        varchar phone
        varchar role
        boolean enabled
        datetime created_at
        datetime updated_at
    }

    CATEGORIES {
        bigint id PK
        varchar name UK
        varchar description
        int display_order
        boolean active
        datetime created_at
        datetime updated_at
    }

    FOOD_ITEMS {
        bigint id PK
        varchar name
        text description
        bigint category_id FK
        decimal price
        varchar image_url
        int stock_quantity
        boolean available
        int preparation_time_minutes
        boolean is_vegetarian
        datetime created_at
        datetime updated_at
    }

    PICKUP_SLOTS {
        bigint id PK
        time start_time
        time end_time
        date slot_date
        int max_orders_capacity
        int current_booked_count
        boolean active
        datetime created_at
    }

    CARTS {
        bigint id PK
        bigint user_id FK
        datetime created_at
        datetime updated_at
    }

    CART_ITEMS {
        bigint id PK
        bigint cart_id FK
        bigint food_item_id FK
        int quantity
        decimal unit_price
        datetime created_at
    }

    ORDERS {
        bigint id PK
        varchar order_number UK
        bigint user_id FK
        bigint pickup_slot_id FK
        varchar status
        decimal subtotal
        decimal tax
        decimal total_amount
        text special_instructions
        varchar cancellation_reason
        datetime created_at
        datetime updated_at
    }

    ORDER_ITEMS {
        bigint id PK
        bigint order_id FK
        bigint food_item_id FK
        varchar item_name
        decimal item_price
        int quantity
        decimal subtotal
    }

    QUEUE_TICKETS {
        bigint id PK
        varchar ticket_number UK
        bigint order_id FK
        int queue_position
        int estimated_wait_minutes
        varchar status
        datetime issued_at
        datetime ready_at
        datetime completed_at
    }

    PAYMENTS {
        bigint id PK
        varchar payment_reference UK
        bigint order_id FK
        decimal amount
        varchar payment_method
        varchar status
        varchar transaction_id
        datetime paid_at
        datetime created_at
    }

    NOTIFICATIONS {
        bigint id PK
        bigint user_id FK
        varchar title
        text message
        boolean is_read
        varchar type
        datetime created_at
    }

    AUDIT_LOGS {
        bigint id PK
        bigint admin_user_id FK
        varchar action
        varchar entity_name
        varchar entity_id
        text details
        varchar ip_address
        datetime created_at
    }
```

---

## 2. Table Specifications & Constraints

- **Monetary Precision**: All currency values (`price`, `subtotal`, `tax`, `total_amount`, `unit_price`, `item_price`, `amount`) strictly use `DECIMAL(10,2)` mapped to Java `java.math.BigDecimal` to eliminate floating-point rounding errors.
- **Transactional Integrity**:
  - `orders.order_number` and `queue_tickets.ticket_number` have unique database constraints (`UK`).
  - `pickup_slots.current_booked_count` is updated atomically within transactional isolation.
  - `food_items.stock_quantity` uses atomic decrements to avoid race conditions.
