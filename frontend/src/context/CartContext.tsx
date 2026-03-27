import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { CartItem, CartContextType } from '../types';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((productId: string, productName: string, category: string) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId === productId);
      if (existingItem) {
        return prevItems.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { productId, productName, category, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getCartCount = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getCartTotal = useCallback(() => {
    return items.length;
  }, [items]);

  const value = useMemo<CartContextType>(() => ({
    items,
    addToCart,
    removeFromCart,
    clearCart,
    getCartCount,
    getCartTotal,
  }), [items, addToCart, removeFromCart, clearCart, getCartCount, getCartTotal]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
