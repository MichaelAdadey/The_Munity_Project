"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface SidebarContextValue {
  open: boolean;
  toggle: () => void;
  expandedWidth: number;
  collapsedWidth: number;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

interface SidebarProviderProps {
  children: ReactNode;
  storageKey?: string;
  expandedWidth?: number;
  collapsedWidth?: number;
}

export function SidebarProvider({
  children,
  storageKey = "munity-sidebar-open",
  expandedWidth = 256,
  collapsedWidth = 48,
}: SidebarProviderProps) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored !== null) {
      setOpen(stored === "true");
    }
  }, [storageKey]);

  const toggle = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      localStorage.setItem(storageKey, String(next));
      return next;
    });
  }, [storageKey]);

  const value = useMemo(
    () => ({ open, toggle, expandedWidth, collapsedWidth }),
    [open, toggle, expandedWidth, collapsedWidth],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  return useContext(SidebarContext);
}
