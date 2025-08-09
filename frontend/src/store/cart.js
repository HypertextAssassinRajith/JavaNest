import { create } from 'zustand';

const persisted = localStorage.getItem('cart');
const initial = persisted ? JSON.parse(persisted) : [];

export const useCart = create((set, get) => ({
  items: initial,
  add: (item, qty = 1) => {
    const items = [...get().items];
    const existing = items.find(i => i.productId === item.productId);
    if (existing) existing.qty += qty;
    else items.push({ ...item, qty });
    set({ items });
    localStorage.setItem('cart', JSON.stringify(items));
  },
  updateQty: (id, qty) => {
    const items = get().items.map(i =>
      i.productId === id ? { ...i, qty: qty < 1 ? 1 : qty } : i
    );
    set({ items });
    localStorage.setItem('cart', JSON.stringify(items));
  },
  remove: id => {
    const items = get().items.filter(i => i.productId !== id);
    set({ items });
    localStorage.setItem('cart', JSON.stringify(items));
  },
  clear: () => {
    set({ items: [] });
    localStorage.setItem('cart', JSON.stringify([]));
  }
}));