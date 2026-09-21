"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { AdminAppShell } from "@/components/admin/AdminAppShell";
import {
  LiveTicker,
  liveFadeUp,
  useLiveToast,
} from "@/components/live/LiveFeedback";
import type { GrowthMetric } from "@/lib/admin/growth-queries";

function GrowthRefreshButton() {
  const router = useRouter();
  const { flash } = useLiveToast();
  const [spinning, setSpinning] = useState(false);

  const runRefresh = useCallback(
    (showToast: boolean) => {
      setSpinning(true);
      router.refresh();
      if (showToast) {
        flash("Growth insights refreshed with the latest platform activity.");
      }
      window.setTimeout(() => setSpinning(false), 700);
    },
    [router, flash],
  );

  // Keep a ref pointing at the latest runRefresh so the interval below
  // never closes over a stale version — but only ever write to it inside
  // an effect, never during render.
  const runRefreshRef = useRef(runRefresh);
  useEffect(() => {
    runRefreshRef.current = runRefresh;
  }, [runRefresh]);

  useEffect(() => {
    const id = window.setInterval(() => runRefreshRef.current(false), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <button
      type="button"
      onClick={() => runRefresh(true)}
      className="flex size-9 items-center justify-center rounded-full border border-munity-border bg-white text-munity-green transition hover:bg-munity-lime/40"
      aria-label="Refresh growth insights"
      title="Refresh growth insights (auto every 30s)"
    >
      <RefreshCw className={`size-4 ${spinning ? "animate-spin" : ""}`} />
    </button>
  );
}

export function AdminGrowthView({
  adminName,
  metrics,
}: {
  adminName: string;
  metrics: GrowthMetric[];
}) {
  return (
    <AdminAppShell
      adminName={adminName}
      title="Platform Growth"
      actions={<GrowthRefreshButton />}
    >
      <motion.div
        variants={liveFadeUp}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.35 }}
        className="mx-auto max-w-6xl"
      >
        <LiveTicker
          items={[
            "Platform activity is syncing across admin workspaces.",
            "Growth metrics reflect real signups and engagement.",
          ]}
        />
        <div className="grid gap-4 md:grid-cols-3">
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className="rounded-2xl border border-munity-border bg-white p-6"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-munity-muted">
                {metric.label}
              </p>
              <p className="mt-3 text-4xl font-bold text-munity-green">
                {metric.value}
              </p>
              <p className="mt-2 text-sm text-munity-muted">{metric.detail}</p>
            </article>
          ))}
        </div>
      </motion.div>
    </AdminAppShell>
  );
}
