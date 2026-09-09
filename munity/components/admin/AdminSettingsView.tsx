"use client";

import { useState } from "react";
import { AdminAppShell } from "@/components/admin/AdminAppShell";
import { useLiveToast } from "@/components/live/LiveFeedback";
import { updatePlatformSetting } from "@/lib/admin/settings-actions";
import type { PlatformSettings } from "@/lib/admin/settings-queries";

const LABELS: Record<keyof PlatformSettings, string> = {
  crisisAlerts: "Crisis Alerts",
  weeklyDigest: "Weekly Digest",
  maintenanceMode: "Maintenance Mode",
};

export function AdminSettingsView({
  adminName,
  settings,
}: {
  adminName: string;
  settings: PlatformSettings;
}) {
  const { flash } = useLiveToast();
  const [current, setCurrent] = useState(settings);

  async function toggle(key: keyof PlatformSettings) {
    const next = !current[key];

    if (key === "maintenanceMode" && next) {
      if (
        !window.confirm(
          "Turning on Maintenance Mode will immediately block all non-admin users from the site. Continue?",
        )
      ) {
        return;
      }
    }

    setCurrent((c) => ({ ...c, [key]: next }));
    try {
      const result = await updatePlatformSetting(key, next);
      if (result.error) {
        setCurrent((c) => ({ ...c, [key]: !next }));
        flash(result.error);
        return;
      }
      flash(`${LABELS[key]} ${next ? "enabled" : "disabled"}.`);
    } catch (err) {
      setCurrent((c) => ({ ...c, [key]: !next }));
      flash(err instanceof Error ? err.message : "Couldn't update setting");
    }
  }

  return (
    <AdminAppShell adminName={adminName} title="Admin Settings">
      <div className="mx-auto max-w-2xl">
        {current.maintenanceMode ? (
          <div className="mb-6 rounded-2xl border border-[#ba1a1a]/30 bg-[#ffdad6]/30 p-4 text-sm font-semibold text-[#93000a]">
            Maintenance Mode is currently ON — non-admin users cannot access the
            site.
          </div>
        ) : null}
        <div className="rounded-2xl border border-munity-border bg-white p-6">
          {(Object.keys(LABELS) as (keyof PlatformSettings)[]).map((key) => (
            <label
              key={key}
              className="flex items-center justify-between gap-4 border-b border-munity-border py-4 last:border-0"
            >
              <span className="text-munity-text">{LABELS[key]}</span>
              <input
                type="checkbox"
                checked={current[key]}
                onChange={() => void toggle(key)}
                className="size-5 accent-munity-green"
              />
            </label>
          ))}
        </div>
      </div>
    </AdminAppShell>
  );
}
