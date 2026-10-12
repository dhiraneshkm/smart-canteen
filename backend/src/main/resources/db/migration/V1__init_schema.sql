-- Flyway Schema Migration V1: Initial Table Definitions

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(30) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    display_order INT DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS food_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category_id BIGINT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500),
    stock_quantity INT NOT NULL DEFAULT 0,
    available BOOLEAN NOT NULL DEFAULT TRUE,
    preparation_time_minutes INT NOT NULL DEFAULT 10,
    is_vegetarian BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_food_category FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS pickup_slots (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_date DATE,
    max_orders_capacity INT NOT NULL DEFAULT 30,
    current_booked_count INT NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS carts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_id BIGINT NOT NULL,
    food_item_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cartitem_cart FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    CONSTRAINT fk_cartitem_food FOREIGN KEY (food_item_id) REFERENCES food_items(id)
);

CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(64) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    pickup_slot_id BIGINT,
    status VARCHAR(30) NOT NULL DEFAULT 'PLACED',
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    special_instructions VARCHAR(255),
    cancellation_reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_order_slot FOREIGN KEY (pickup_slot_id) REFERENCES pickup_slots(id)
);

CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    food_item_id BIGINT NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    item_price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_orderitem_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_orderitem_food FOREIGN KEY (food_item_id) REFERENCES food_items(id)
);

CREATE TABLE IF NOT EXISTS queue_tickets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_number VARCHAR(32) NOT NULL UNIQUE,
    order_id BIGINT NOT NULL UNIQUE,
    queue_position INT NOT NULL DEFAULT 1,
    estimated_wait_minutes INT NOT NULL DEFAULT 10,
    status VARCHAR(30) NOT NULL DEFAULT 'WAITING',
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ready_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    CONSTRAINT fk_ticket_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payment_reference VARCHAR(64) NOT NULL UNIQUE,
    order_id BIGINT NOT NULL UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(40) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    transaction_id VARCHAR(100),
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    type VARCHAR(40) NOT NULL DEFAULT 'ORDER_STATUS',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_user_id BIGINT,
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(50),
    entity_id VARCHAR(50),
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_user FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE SET NULL
);
