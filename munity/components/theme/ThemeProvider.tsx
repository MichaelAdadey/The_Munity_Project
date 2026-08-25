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
import {
  applyTheme,
  getStoredTheme,
  persistTheme,
  type Theme,
} from "@/lib/theme";

type ThemeContextValue = {
  theme: Theme;
  darkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = getStoredTheme() ?? "light";
      setTheme(stored);
      applyTheme(stored);
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    applyTheme(theme);
    persistTheme(theme);
  }, [theme, hydrated]);

  const setDarkMode = useCallback((enabled: boolean) => {
    setTheme(enabled ? "dark" : "light");
  }, []);

  const toggleDarkMode = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      darkMode: theme === "dark",
      setDarkMode,
      toggleDarkMode,
    }),
    [theme, setDarkMode, toggleDarkMode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
