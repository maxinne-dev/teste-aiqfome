import React from 'react';

export type SelectedCustomer = { id: number; label?: string } | null;

type Ctx = {
  selectedCustomer: SelectedCustomer;
  setSelectedCustomer: (c: SelectedCustomer) => void;
  selectedCustomerId: number | null;
};

const STORAGE_KEY = 'selected_customer';

const SelectedCustomerContext = React.createContext<Ctx | undefined>(undefined);

export function SelectedCustomerProvider({
  children,
  initialId = null,
  initialCustomer
}: {
  children: React.ReactNode;
  initialId?: number | null;
  initialCustomer?: SelectedCustomer;
}) {
  const initial: SelectedCustomer = React.useMemo(() => {
    if (initialCustomer) return initialCustomer;
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
      } catch {}
    }
    return initialId ? { id: initialId } : null;
  }, [initialCustomer, initialId]);

  const [selectedCustomer, setSelected] = React.useState<SelectedCustomer>(initial);
  const setSelectedCustomer = React.useCallback((c: SelectedCustomer) => {
    setSelected(c);
    try {
      if (c) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const value = React.useMemo(
    () => ({ selectedCustomer, setSelectedCustomer, selectedCustomerId: selectedCustomer?.id ?? null }),
    [selectedCustomer, setSelectedCustomer]
  );

  return <SelectedCustomerContext.Provider value={value}>{children}</SelectedCustomerContext.Provider>;
}

export function useSelectedCustomer() {
  const ctx = React.useContext(SelectedCustomerContext);
  if (!ctx) throw new Error('useSelectedCustomer must be used within SelectedCustomerProvider');
  return ctx;
}
