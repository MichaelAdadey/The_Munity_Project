"use client";

import { useState } from "react";
import { Bell, Lock, Moon, Shield } from "lucide-react";
import { TherapistAppShell } from "@/components/therapistlayout/TherapistAppShell";
import { LivePulse, useLiveToast } from "@/components/live/LiveFeedback";
import { useTheme } from "@/components/theme/ThemeProvider";

type ToggleKey = "emailAlerts" | "smsAlerts" | "crisisFlags" | "twoFactor";
type SettingsToggleKey = ToggleKey | "darkMode";

const settingsGroups: {
  title: string;
  description: string;
  icon: typeof Bell;
  items: { key: SettingsToggleKey; label: string; detail: string }[];
}[] = [
  {
    title: "Notifications",
    description: "Choose how Munity reaches you about sessions and patients.",
    icon: Bell,
    items: [
      {
        key: "emailAlerts",
        label: "Email alerts",
        detail: "Session reminders and weekly summaries",
      },
      {
        key: "smsAlerts",
        label: "SMS alerts",
        detail: "Same-day appointment changes",
      },
      {
        key: "crisisFlags",
        label: "Crisis flag push",
        detail: "Immediate notice when a patient flags high distress",
      },
    ],
  },
  {
    title: "Security",
    description: "Protect your clinical account and patient data.",
    icon: Shield,
    items: [
      {
        key: "twoFactor",
        label: "Two-factor authentication",
        detail: "Require a code at sign-in",
      },
    ],
  },
  {
    title: "Appearance",
    description: "Personalize how the clinical workspace looks.",
    icon: Moon,
    items: [
      {
        key: "darkMode",
        label: "Dark mode",
        detail: "Use a darker palette across the clinical workspace",
      },
    ],
  },
];

export function TherapistSettingsView() {
  const { flash } = useLiveToast();
  const { darkMode, setDarkMode } = useTheme();
  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    emailAlerts: true,
    smsAlerts: false,
    crisisFlags: true,
    twoFactor: true,
  });

  function toggle(key: SettingsToggleKey) {
    if (key === "darkMode") {
      setDarkMode(!darkMode);
      flash(darkMode ? "Dark mode disabled" : "Dark mode enabled");
      return;
    }

    setToggles((current) => ({ ...current, [key]: !current[key] }));
    flash(`${key.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase())} updated`);
  }

  return (
    <TherapistAppShell
      active="Settings"
      title="Settings"
      subtitle="Manage notifications, security, and workspace preferences."
    >
      <div className="flex justify-end"><LivePulse label="Preferences synced" /></div>
      <div className="flex flex-col gap-6">
        {settingsGroups.map((group) => {
          const Icon = group.icon;
          return (
            <section
              key={group.title}
              className="rounded-[20px] border border-munity-input-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]"
            >
              <div className="mb-5 flex items-start gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-munity-lime/50 text-munity-green">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-munity-text">{group.title}</h2>
                  <p className="mt-1 text-sm text-munity-muted">{group.description}</p>
                </div>
              </div>

              <div className="divide-y divide-munity-border">
                {group.items.map((item) => (
                  <div
                    key={item.key}
                    className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-semibold text-munity-text">{item.label}</p>
                      <p className="mt-0.5 text-sm text-munity-muted">{item.detail}</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={item.key === "darkMode" ? darkMode : toggles[item.key]}
                      onClick={() => toggle(item.key)}
                      className={`relative h-7 w-12 rounded-full transition ${
                        (item.key === "darkMode" ? darkMode : toggles[item.key])
                          ? "bg-munity-green"
                          : "bg-munity-divider"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 size-6 rounded-full bg-white shadow transition ${
                          (item.key === "darkMode" ? darkMode : toggles[item.key])
                            ? "left-5"
                            : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        <section className="rounded-[20px] border border-munity-input-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-munity-lime/50 text-munity-green">
              <Lock className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-munity-text">Password</h2>
              <p className="mt-1 text-sm text-munity-muted">
                Update the password you use for therapist login.
              </p>
              <button
                type="button"
                onClick={() => flash("Password change flow opened")}
                className="mt-4 rounded-xl border border-munity-input-border px-4 py-2.5 text-sm font-semibold text-munity-green transition hover:bg-munity-lime/40"
              >
                Change password
              </button>
            </div>
          </div>
        </section>
      </div>
    </TherapistAppShell>
  );
}
