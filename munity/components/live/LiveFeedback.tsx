"use client";

import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

let toastMessage: string | null = null;
let toastTimer: number | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getToastSnapshot() {
  return toastMessage;
}

function getToastServerSnapshot() {
  return null;
}

/** Show a short-lived action confirmation toast anywhere in the app. */
export function flashLiveToast(message: string) {
  toastMessage = message;
  emit();
  if (typeof window !== "undefined") {
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toastMessage = null;
      emit();
    }, 2400);
  }
}

export function useLiveToast() {
  return {
    flash: useCallback((message: string) => {
      flashLiveToast(message);
    }, []),
  };
}

function LiveToastHost() {
  const toast = useSyncExternalStore(
    subscribe,
    getToastSnapshot,
    getToastServerSnapshot,
  );

  return (
    <AnimatePresence>
      {toast ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="pointer-events-none fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-full bg-munity-green px-5 py-3 text-sm font-semibold text-white shadow-lg"
        >
          {toast}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/** Optional wrapper — mounts the global toast host. Safe to nest. */
export function LiveToastProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <LiveToastHost />
    </>
  );
}

export const liveFadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export const liveStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

export function LivePulse({
  label = "Live",
  count,
}: {
  label?: string;
  count?: number;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f7e4] px-2.5 py-1 text-[11px] font-semibold text-[#2f6b3a]">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#22c55e] opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-[#22c55e]" />
      </span>
      {label}
      {typeof count === "number" ? ` · ${count}` : null}
    </span>
  );
}

export function LiveTicker({
  items,
  intervalMs = 4200,
}: {
  items: string[];
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % items.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [items, intervalMs]);

  useEffect(() => {
    if (items.length > 0 && index >= items.length) setIndex(0);
  }, [index, items.length]);

  if (!items.length) return null;

  const safeIndex = index % items.length;

  return (
    <div className="overflow-hidden rounded-2xl border border-munity-border/70 bg-white/80 px-4 py-3">
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-munity-muted">
          Happening now
        </p>
        <LivePulse />
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={`${safeIndex}-${items[safeIndex]}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28 }}
          className="text-sm leading-relaxed text-munity-text"
        >
          {items[safeIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
