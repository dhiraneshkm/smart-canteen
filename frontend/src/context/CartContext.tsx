import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cart } from '../types';
import { cartApi } from '../services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  totalCount: number;
  totalAmount: number;
  addToCart: (foodItemId: number, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, role } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshCart = async () => {
    if (!isAuthenticated || role !== 'ROLE_STUDENT') {
      setCart(null);
      return;
    }
    try {
      setLoading(true);
      const data = await cartApi.getCart();
      setCart(data);
    } catch (err) {
      console.error('Failed to load cart', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [isAuthenticated, role]);

  const addToCart = async (foodItemId: number, quantity: number = 1) => {
    const updated = await cartApi.addToCart(foodItemId, quantity);
    setCart(updated);
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(cartItemId);
    } else {
      const updated = await cartApi.updateCartItem(cartItemId, quantity);
      setCart(updated);
    }
  };

  const removeItem = async (cartItemId: number) => {
    const updated = await cartApi.removeCartItem(cartItemId);
    setCart(updated);
  };

  const clearCart = async () => {
    await cartApi.clearCart();
    setCart(null);
  };

  const totalCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalAmount = cart?.totalAmount || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        totalCount,
        totalAmount,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
