import { create } from 'zustand';
import type { Role, Vertical, Brand } from '../types/mpos';

export type Language = 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'mr';
export type TenantId = 'xiaomi' | 'ather';

interface AppState {
  // Auth
  isAuthenticated: boolean;
  authUser: { name: string; phone: string; avatar?: string } | null;

  // Role / tenant context
  activeRole: Role;
  activeVertical: Vertical;
  activeBrand: Brand;
  activeTenant: TenantId;

  // KYC
  kycComplete: boolean;
  kycProgress: number;

  // Onboarding / feature discovery
  hasSeenDemo: boolean;
  hasCompletedGuide: boolean;

  // UI
  sidebarOpen: boolean;
  language: Language;

  // Actions
  setAuthenticated: (auth: boolean, user?: { name: string; phone: string; avatar?: string } | null) => void;
  logout: () => void;
  setActiveRole: (role: Role) => void;
  setActiveVertical: (vertical: Vertical) => void;
  setActiveBrand: (brand: Brand) => void;
  setActiveTenant: (tenant: TenantId) => void;
  setKycComplete: (complete: boolean) => void;
  setKycProgress: (progress: number) => void;
  setHasSeenDemo: (seen: boolean) => void;
  setHasCompletedGuide: (done: boolean) => void;
  toggleSidebar: () => void;
  setLanguage: (lang: Language) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  authUser: null,
  activeRole: 'promoter',
  activeVertical: 'electronics-retail',
  activeBrand: 'Xiaomi',
  activeTenant: 'xiaomi',
  kycComplete: true,
  kycProgress: 100,
  hasSeenDemo: false,
  hasCompletedGuide: false,
  sidebarOpen: true,
  language: 'en',

  setAuthenticated: (auth, user = null) => set({ isAuthenticated: auth, authUser: user }),
  logout: () => set({ isAuthenticated: false, authUser: null, hasCompletedGuide: false }),
  setActiveRole: (role) => set({ activeRole: role }),
  setActiveVertical: (vertical) => set({ activeVertical: vertical }),
  setActiveBrand: (brand) => {
    // Keep tenant in sync with brand for EV brands
    const tenant: TenantId = brand === 'Ather' || brand === 'Ola' || brand === 'Bajaj' || brand === 'TVS' ? 'ather' : 'xiaomi';
    set({ activeBrand: brand, activeTenant: tenant });
  },
  setActiveTenant: (tenant) => set({ activeTenant: tenant }),
  setKycComplete: (complete) => set({ kycComplete: complete }),
  setKycProgress: (progress) => set({ kycProgress: progress }),
  setHasSeenDemo: (seen) => set({ hasSeenDemo: seen }),
  setHasCompletedGuide: (done) => set({ hasCompletedGuide: done }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setLanguage: (language) => set({ language }),
}));
