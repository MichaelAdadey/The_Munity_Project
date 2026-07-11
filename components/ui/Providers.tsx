"use client";

import { LoadingProvider } from "@/components/ui/LoadingProvider";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <LoadingProvider>{children}</LoadingProvider>;
}
