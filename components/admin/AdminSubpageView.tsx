"use client";

import { useState } from "react";
import { AdminAppShell } from "@/components/admin/AdminAppShell";
import { useMockStore } from "@/lib/mock-store";

type AdminSection = "communities" | "growth" | "therapy" | "resources" | "settings";

const growthMetrics = [
  { label: "New members", value: "1,284", detail: "+12.4% this month" },
  { label: "Active communities", value: "7", detail: "94% moderation coverage" },
  { label: "Weekly engagement", value: "68%", detail: "+4.1% from last week" },
];

const resources = [
  { title: "Grounding in the moment", type: "Guide", status: "Published" },
  { title: "Finding local crisis support", type: "Directory", status: "Published" },
  { title: "Building a sleep routine", type: "Worksheet", status: "Draft" },
];

export function AdminSubpageView({
  adminName,
  section,
}: {
  adminName: string;
  section: AdminSection;
}) {
  const { communities, therapists } = useMockStore();
  const [preferences, setPreferences] = useState({
    crisisAlerts: true,
    weeklyDigest: true,
    maintenanceMode: false,
  });

  const content = {
    communities: {
      title: "Community Management",
      body: (
        <div className="grid gap-4 md:grid-cols-2">
          {communities.map((community) => (
            <article key={community.id} className="rounded-2xl border border-munity-border bg-white p-5">
              <p className="text-lg font-semibold text-munity-text">{community.name}</p>
              <p className="mt-1 text-sm text-munity-muted">{community.membersLabel} · {community.tag}</p>
              <p className="mt-4 text-sm text-munity-muted">
                {community.verified ? "Verified community" : "Verification pending"}
              </p>
            </article>
          ))}
        </div>
      ),
    },
    growth: {
      title: "Platform Growth",
      body: (
        <div className="grid gap-4 md:grid-cols-3">
          {growthMetrics.map((metric) => (
            <article key={metric.label} className="rounded-2xl border border-munity-border bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-munity-muted">{metric.label}</p>
              <p className="mt-3 text-4xl font-bold text-munity-green">{metric.value}</p>
              <p className="mt-2 text-sm text-munity-muted">{metric.detail}</p>
            </article>
          ))}
        </div>
      ),
    },
    therapy: {
      title: "Therapy Network",
      body: (
        <div className="overflow-hidden rounded-2xl border border-munity-border bg-white">
          {therapists.map((therapist) => (
            <div key={therapist.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-munity-border p-5 last:border-0">
              <div>
                <p className="font-semibold text-munity-text">{therapist.name}</p>
                <p className="text-sm text-munity-muted">{therapist.credentials} · {therapist.location}</p>
              </div>
              <span className="rounded-full bg-munity-lime px-3 py-1 text-sm font-semibold text-munity-olive-text">
                {therapist.rating.toFixed(1)} rating
              </span>
            </div>
          ))}
        </div>
      ),
    },
    resources: {
      title: "Resource Overview",
      body: (
        <div className="overflow-hidden rounded-2xl border border-munity-border bg-white">
          {resources.map((resource) => (
            <div key={resource.title} className="flex items-center justify-between gap-4 border-b border-munity-border p-5 last:border-0">
              <div>
                <p className="font-semibold text-munity-text">{resource.title}</p>
                <p className="text-sm text-munity-muted">{resource.type}</p>
              </div>
              <span className="text-sm font-semibold text-munity-green">{resource.status}</span>
            </div>
          ))}
        </div>
      ),
    },
    settings: {
      title: "Admin Settings",
      body: (
        <div className="max-w-2xl rounded-2xl border border-munity-border bg-white p-6">
          {Object.entries(preferences).map(([key, enabled]) => (
            <label key={key} className="flex items-center justify-between gap-4 border-b border-munity-border py-4 last:border-0">
              <span className="capitalize text-munity-text">{key.replace(/([A-Z])/g, " $1")}</span>
              <input
                type="checkbox"
                checked={enabled}
                onChange={() => setPreferences((current) => ({ ...current, [key]: !current[key as keyof typeof current] }))}
                className="size-5 accent-munity-green"
              />
            </label>
          ))}
        </div>
      ),
    },
  }[section];

  return (
    <AdminAppShell adminName={adminName} title={content.title}>
      <div className="mx-auto max-w-6xl">
        <p className="mb-6 text-base text-munity-muted">Preview data for the Munity admin backend handoff.</p>
        {content.body}
      </div>
    </AdminAppShell>
  );
}
