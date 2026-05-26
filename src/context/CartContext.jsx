import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Clear cart on logout
  useEffect(() => {
    if (!currentUser) {
      setCartItems([]);
      localStorage.removeItem('cart');
    }
  }, [currentUser]);

  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // For this app, usually one customization per order, but we allow multiple items
      return [...prevItems, { ...product, id: Date.now().toString() }];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.price, 0);

  // Flat ₹80 shipping if ANY qualifying item exists (not per item)
  const shippingTotal = (() => {
    const hasShippableItem = cartItems.some(item => {
      const name = (item.templateName || '').toLowerCase();
      const category = (item.category || '').toLowerCase();
      
      // Exclude Bouquets and Combos from triggering shipping
      if (name.includes('bouquet') || name.includes('combo') || 
          category.includes('bouquet') || category.includes('combo')) {
        return false;
      }

      // Check for shippable categories: frames, caps, hot wheels
      return name.includes('frame') || name.includes('cap') || 
             name.includes('hot wheels') || name.includes('hotwheels') || 
             item.isHotWheels || 
             category.includes('hot wheels') || category.includes('frame') || 
             category.includes('cap');
    });
    return hasShippableItem ? 80 : 0;
  })();

  const finalTotal = cartTotal + shippingTotal;

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartTotal, shippingTotal, finalTotal }}>
      {children}
    </CartContext.Provider>
  );
};
