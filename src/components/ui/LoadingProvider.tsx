"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Loader3D } from "@/components/ui/Loader3D";

interface LoadingContextValue {
  isLoading: boolean;
  message: string | null;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
  withLoading: <T>(fn: () => Promise<T> | T, message?: string) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextValue | null>(null);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const startLoading = useCallback((nextMessage?: string) => {
    setMessage(nextMessage ?? "Loading...");
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setMessage(null);
  }, []);

  const withLoading = useCallback(
    async <T,>(fn: () => Promise<T> | T, nextMessage?: string) => {
      startLoading(nextMessage);
      try {
        await new Promise((resolve) => setTimeout(resolve, 600));
        return await fn();
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading],
  );

  const value = useMemo(
    () => ({ isLoading, message, startLoading, stopLoading, withLoading }),
    [isLoading, message, startLoading, stopLoading, withLoading],
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            key="loading-overlay"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-munity-bg/75 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -8 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="rounded-3xl border border-munity-border bg-white px-12 py-10 shadow-[0_24px_60px_rgba(62,82,25,0.12)]"
            >
              <Loader3D label={message ?? "Loading..."} />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
}
