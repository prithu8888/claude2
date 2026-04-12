import { createContext, useContext } from 'react';

export type ToastKind = 'success' | 'error' | 'info';

export interface ToastContextValue {
  show: (kind: ToastKind, message: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Fallback no-op if used outside provider
    return { show: () => {} };
  }
  return ctx;
}
