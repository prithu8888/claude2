import { create } from 'zustand';
import type { Role, Vertical, Brand } from '../types/mpos';

interface AppState {
  activeRole: Role;
  activeVertical: Vertical;
  activeBrand: Brand;
  isAuthenticated: boolean;
  kycComplete: boolean;
  sidebarOpen: boolean;
  setActiveRole: (role: Role) => void;
  setActiveVertical: (vertical: Vertical) => void;
  setActiveBrand: (brand: Brand) => void;
  setAuthenticated: (auth: boolean) => void;
  setKycComplete: (complete: boolean) => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeRole: 'promoter',
  activeVertical: 'electronics-retail',
  activeBrand: 'Samsung',
  isAuthenticated: true,
  kycComplete: true,
  sidebarOpen: true,
  setActiveRole: (role) => set({ activeRole: role }),
  setActiveVertical: (vertical) => set({ activeVertical: vertical }),
  setActiveBrand: (brand) => set({ activeBrand: brand }),
  setAuthenticated: (auth) => set({ isAuthenticated: auth }),
  setKycComplete: (complete) => set({ kycComplete: complete }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
