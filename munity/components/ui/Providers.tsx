"use client";

import { LiveToastProvider } from "@/components/live/LiveFeedback";
import { LoadingProvider } from "@/components/ui/LoadingProvider";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LoadingProvider>
      <LiveToastProvider>{children}</LiveToastProvider>
    </LoadingProvider>
  );
}
