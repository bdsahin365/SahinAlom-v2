/**
 * UI Context for managing global UI state (modals, notifications, loading)
 */

import React, { createContext, useContext, useCallback, useState } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface UIContextType {
  // Toast notifications
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Loading state
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;

  // Modal state
  modals: Map<string, boolean>;
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  toggleModal: (id: string) => void;
  isModalOpen: (id: string) => boolean;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export interface UIProviderProps {
  children: React.ReactNode;
}

/**
 * UI Provider Component
 */
export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modals, setModals] = useState<Map<string, boolean>>(new Map());

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { ...toast, id };

    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    const duration = toast.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const openModal = useCallback((id: string) => {
    setModals(prev => new Map(prev).set(id, true));
  }, []);

  const closeModal = useCallback((id: string) => {
    setModals(prev => new Map(prev).set(id, false));
  }, []);

  const toggleModal = useCallback((id: string) => {
    setModals(prev => {
      const newMap = new Map(prev);
      newMap.set(id, !newMap.get(id));
      return newMap;
    });
  }, []);

  const isModalOpen = useCallback(
    (id: string) => modals.get(id) ?? false,
    [modals]
  );

  const value: UIContextType = {
    toasts,
    showToast,
    removeToast,
    clearToasts,
    isLoading,
    setIsLoading,
    modals,
    openModal,
    closeModal,
    toggleModal,
    isModalOpen,
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};

/**
 * Hook to use UI context
 */
export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within UIProvider');
  }
  return context;
};

/**
 * Hook for toast notifications
 */
export const useToast = () => {
  const { showToast } = useUI();

  return {
    success: (message: string, title?: string) =>
      showToast({ type: 'success', message, title }),
    error: (message: string, title?: string) =>
      showToast({ type: 'error', message, title }),
    warning: (message: string, title?: string) =>
      showToast({ type: 'warning', message, title }),
    info: (message: string, title?: string) =>
      showToast({ type: 'info', message, title }),
  };
};
