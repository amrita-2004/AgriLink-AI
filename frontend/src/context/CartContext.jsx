import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('agrilink_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('agrilink_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantityKg = 10) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product_id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity_kg + quantityKg;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity_kg: newQty,
          item_total: newQty * updated[existingIndex].price_per_kg,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            product_id: product.id,
            product_name: product.name,
            farmer_id: product.farmer_id,
            farmer_name: product.farmer_name,
            farmer_location: product.location,
            price_per_kg: product.price_per_kg,
            quantity_kg: quantityKg,
            item_total: quantityKg * product.price_per_kg,
            image_url: product.image_url,
          },
        ];
      }
    });
  };

  const updateQuantity = (productId, newQuantityKg) => {
    if (newQuantityKg <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product_id === productId
          ? {
              ...item,
              quantity_kg: newQuantityKg,
              item_total: newQuantityKg * item.price_per_kg,
            }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product_id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.item_total, 0);
  const totalWeight = cartItems.reduce((acc, item) => acc + item.quantity_kg, 0);
  const itemCount = cartItems.length;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        totalWeight,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
