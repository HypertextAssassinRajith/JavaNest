"use client";

import { create } from "zustand";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  total: () => number;
};

function readInitial(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem("cart");
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function persist(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("cart", JSON.stringify(items));
}

export const useCartStore = create<CartState>((set, get) => ({
  items: readInitial(),

  addItem: (item, qty = 1) => {
    const items = [...get().items];
    const existing = items.find((i) => i.id === item.id);
    if (existing) existing.qty += qty;
    else items.push({ ...item, qty });
    persist(items);
    set({ items });
  },

  updateQty: (id, qty) => {
    const safeQty = Number.isFinite(qty) ? Math.max(1, qty) : 1;
    const items = get().items.map((i) => (i.id === id ? { ...i, qty: safeQty } : i));
    persist(items);
    set({ items });
  },

  removeItem: (id) => {
    const items = get().items.filter((i) => i.id !== id);
    persist(items);
    set({ items });
  },

  clear: () => {
    persist([]);
    set({ items: [] });
  },

  total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
}));
