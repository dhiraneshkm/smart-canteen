-- Flyway Seed Data Migration V2: Categories, Food Items, and Pickup Slots

-- Insert Categories
INSERT INTO categories (id, name, description, display_order, active) VALUES
(1, 'South Indian Breakfast', 'Steaming hot idlis, crispy dosas, and vadas served with sambar and fresh chutneys', 1, TRUE),
(2, 'Meals & Combos', 'Wholesome executive thalis, mini meals, and variety rice', 2, TRUE),
(3, 'Snacks & Quick Bites', 'Crispy samosas, sandwiches, rolls, and evening snacks', 3, TRUE),
(4, 'Beverages & Juices', 'Traditional filter coffee, masala chai, fresh fruit juices, and shakes', 4, TRUE),
(5, 'Chinese & Fast Food', 'Noodles, fried rice, and Indo-Chinese favorites', 5, TRUE);

-- Insert Food Items (Prices in Indian Rupees)
INSERT INTO food_items (name, description, category_id, price, image_url, stock_quantity, available, preparation_time_minutes, is_vegetarian) VALUES
('Ghee Podi Masala Dosa', 'Golden crispy rice crepe smeared with fragrant spiced podi and pure ghee, stuffed with seasoned potato masala.', 1, 65.00, 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80', 50, TRUE, 8, TRUE),
('Steamed Idli (2 Pcs) & Medu Vada (1 Pc)', 'Two melt-in-mouth steamed rice cakes and one crispy golden lentil donut, served with piping hot drumstick sambar and coconut chutney.', 1, 45.00, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80', 60, TRUE, 5, TRUE),
('South Indian Executive Thali', 'Complete meal with steamed rice, sambar, rasam, kootu, poriyal, curd, appalam, pickle, and sweet paysam.', 2, 95.00, 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop&q=80', 40, TRUE, 12, TRUE),
('Paneer Butter Masala with 2 Butter Rotis', 'Rich cottage cheese cubes simmered in buttery tomato-cashew gravy served with tandoor butter rotis.', 2, 120.00, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80', 35, TRUE, 15, TRUE),
('Veg Club Grilled Sandwich', 'Triple-layer toasted sandwich stuffed with crisp lettuce, cucumbers, tomatoes, cheese slice, and mint mayo.', 3, 55.00, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80', 30, TRUE, 10, TRUE),
('Punjabi Samosa with Chutney (2 Pcs)', 'Flaky pastry filled with spiced potatoes, green peas, and whole spices, served with tamarind and mint chutney.', 3, 30.00, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80', 70, TRUE, 4, TRUE),
('Authentic South Indian Filter Coffee', 'Freshly brewed aromatic chicory-coffee decoction blended with frothed whole milk.', 4, 25.00, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80', 100, TRUE, 3, TRUE),
('Fresh Mango Lassi', 'Chilled creamy yogurt blended with Alphonso mango pulp and cardamom.', 4, 45.00, 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600&auto=format&fit=crop&q=80', 45, TRUE, 5, TRUE),
('Veg Hakka Noodles', 'Wok-tossed noodles with shredded cabbage, carrots, bell peppers, spring onions, and oriental sauces.', 5, 80.00, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80', 25, TRUE, 12, TRUE),
('Cold Badam Milk', 'Nutritious saffron-flavored chilled milk topped with slivered almonds and pistachios.', 4, 35.00, 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&auto=format&fit=crop&q=80', 50, TRUE, 2, TRUE);

-- Insert Pickup Slots
INSERT INTO pickup_slots (start_time, end_time, max_orders_capacity, current_booked_count, active) VALUES
('08:30:00', '09:30:00', 35, 0, TRUE),
('10:00:00', '11:00:00', 30, 0, TRUE),
('12:30:00', '13:30:00', 50, 0, TRUE),
('13:30:00', '14:30:00', 40, 0, TRUE),
('15:30:00', '16:30:00', 30, 0, TRUE),
('17:00:00', '18:00:00', 35, 0, TRUE);
