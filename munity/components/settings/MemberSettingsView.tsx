"use client";

import { Bell, Lock, Moon, Shield, User } from "lucide-react";
import { MemberAppShell } from "@/components/memberlayout/MemberAppShell";
import { mockStore, useMockStore } from "@/lib/mock-store";

const sections = [
  {
    id: "account",
    title: "Account",
    description: "Profile details and how you appear to others.",
    icon: User,
    items: [
      { label: "Display name", value: "Alex Rivera" },
      { label: "Email", value: "alex.rivera@munity.app" },
      { label: "Timezone", value: "Pacific Time (PT)" },
    ],
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Choose what you hear about from Munity.",
    icon: Bell,
    toggles: [
      { label: "Session reminders", defaultOn: true },
      { label: "Community replies", defaultOn: true },
      { label: "Resource recommendations", defaultOn: false },
      { label: "Marketing emails", defaultOn: false },
    ],
  },
  {
    id: "privacy",
    title: "Privacy & safety",
    description: "Control visibility and data preferences.",
    icon: Shield,
    toggles: [
      { label: "Show online status", defaultOn: true },
      { label: "Allow therapist messages", defaultOn: true },
      { label: "Anonymous posting by default", defaultOn: false },
    ],
  },
  {
    id: "security",
    title: "Security",
    description: "Keep your account protected.",
    icon: Lock,
    items: [
      { label: "Password", value: "Last changed 2 months ago" },
      { label: "Two-factor authentication", value: "Off" },
    ],
  },
  {
    id: "appearance",
    title: "Appearance",
    description: "Display preferences for your workspace.",
    icon: Moon,
    toggles: [{ label: "Reduce motion", defaultOn: false }],
  },
] as const;

function Toggle({
  label,
  on,
  onToggle,
}: {
  label: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-munity-border bg-munity-sidebar/30 px-4 py-3 text-left transition hover:bg-munity-lime/10"
    >
      <span className="text-sm font-medium text-munity-text">{label}</span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          on ? "bg-munity-green" : "bg-munity-divider"
        }`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition ${
            on ? "left-5" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}

export function MemberSettingsView() {
  const store = useMockStore();
  const settingKeys: Record<string, Exclude<keyof typeof store.settings, "displayName">> = {
    "Session reminders": "pushNotifications",
    "Community replies": "emailNotifications",
    "Resource recommendations": "weeklyDigest",
    "Marketing emails": "weeklyDigest",
    "Show online status": "showOnlineStatus",
    "Allow therapist messages": "emailNotifications",
    "Anonymous posting by default": "anonymousDefault",
  };

  return (
    <MemberAppShell>
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-munity-muted">
            Preferences
          </p>
          <h1 className="mt-2 text-3xl font-bold text-munity-text">Settings</h1>
          <p className="mt-1 text-base text-munity-muted">
            Manage your account, notifications, and privacy
          </p>
        </header>

        <div className="flex flex-col gap-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <section
                key={section.id}
                className="rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-munity-lime/50">
                    <Icon className="size-5 text-munity-green" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-munity-text">{section.title}</h2>
                    <p className="mt-1 text-sm text-munity-muted">{section.description}</p>
                  </div>
                </div>

                {"items" in section && section.items ? (
                  <div className="mt-5 flex flex-col gap-3">
                    {section.items.map((item) => (
                      <div
                        key={item.label}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-munity-border bg-munity-sidebar/30 px-4 py-3"
                      >
                        <span className="text-sm font-medium text-munity-muted">{item.label}</span>
                        <span className="text-sm font-semibold text-munity-text">
                          {item.label === "Display name"
                            ? store.profile.fullName
                            : item.label === "Email"
                              ? store.profile.email
                              : item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}

                {"toggles" in section && section.toggles ? (
                  <div className="mt-5 flex flex-col gap-3">
                    {section.toggles.map((toggle) => (
                      <Toggle
                        key={toggle.label}
                        label={toggle.label}
                        on={settingKeys[toggle.label] ? store.settings[settingKeys[toggle.label]] : toggle.defaultOn}
                        onToggle={() => {
                          const key = settingKeys[toggle.label];
                          if (key) mockStore.updateSettings({ [key]: !store.settings[key] });
                        }}
                      />
                    ))}
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>
      </div>
    </MemberAppShell>
  );
}
