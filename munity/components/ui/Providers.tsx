"use client";

import { LiveToastProvider } from "@/components/live/LiveFeedback";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { LoadingProvider } from "@/components/ui/LoadingProvider";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LoadingProvider>
        <LiveToastProvider>{children}</LiveToastProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}
