"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  itemId: string;
  name: string;
  price: number;
  qty: number;
}

interface CartContextProps {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  increaseQty: (itemId: string) => void;
  decreaseQty: (itemId: string) => void;
  total: number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cart");
      if (saved) {
        try {
          setCart(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse cart", e);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const exist = prev.find((i) => i.itemId === item.itemId);
      if (exist) {
        return prev.map((i) =>
          i.itemId === item.itemId ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.itemId !== itemId));
  };

  const increaseQty = (itemId: string) => {
    setCart((prev) =>
      prev.map((i) =>
        i.itemId === itemId ? { ...i, qty: i.qty + 1 } : i
      )
    );
  };

  const decreaseQty = (itemId: string) => {
    setCart((prev) =>
      prev.map((i) =>
        i.itemId === itemId && i.qty > 1
          ? { ...i, qty: i.qty - 1 }
          : i
      )
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
