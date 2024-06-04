import { create } from 'zustand';
import { AuthState, User } from '../types';
import { persist } from 'zustand/middleware';

const persistAuthStore  = persist<AuthState>((set, get) => ({
  // Estado inicial
  loggedIn: false,
  user: null,
  // Acciones para actualizar el estado
  setUser: (user: User) => set({ user, loggedIn: true }),
  login: () => set({ loggedIn: true }),
  logout: () => set({ loggedIn: false, user: null }),
}), {
  // Configuración de persistencia
  name: 'auth-store',
  getStorage: () => localStorage,
});

const authStore = create<AuthState>()(persistAuthStore);

export default authStore;