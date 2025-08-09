import { create } from 'zustand';

export const useAuth = create(set => ({
  user: undefined,
  token: localStorage.getItem('token') || undefined,
  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: undefined, token: undefined });
  }
}));