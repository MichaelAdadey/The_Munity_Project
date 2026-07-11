"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Search, TrendingDown, TrendingUp, Users } from "lucide-react";
import { TherapistAppShell } from "@/components/therapistlayout/TherapistAppShell";
import { assets } from "@/lib/assets";
import { patientRoutes, patientSlugs, patientsBySlug } from "@/lib/routes";

const analyticsByPatient: Record<
  (typeof patientSlugs)[number],
  {
    moodScore: string;
    moodTrend: "up" | "down" | "stable";
    improvement: string;
    attendance: string;
    sessionsCompleted: number;
    focusArea: string;
  }
> = {
  "leo-richards": {
    moodScore: "8/10",
    moodTrend: "up",
    improvement: "-42%",
    attendance: "88%",
    sessionsCompleted: 16,
    focusArea: "Anxiety",
  },
  "elena-rodriguez": {
    moodScore: "6/10",
    moodTrend: "stable",
    improvement: "-18%",
    attendance: "76%",
    sessionsCompleted: 11,
    focusArea: "Sleep & burnout",
  },
  "alex-mercer": {
    moodScore: "7/10",
    moodTrend: "up",
    improvement: "-31%",
    attendance: "82%",
    sessionsCompleted: 8,
    focusArea: "Grief processing",
  },
};

const patients = patientSlugs.map((slug) => ({
  ...patientsBySlug[slug],
  avatar: assets.avatars[patientsBySlug[slug].avatarKey],
  ...analyticsByPatient[slug],
}));

const overviewStats = [
  {
    label: "Active Patients",
    value: String(patients.length),
    detail: "In current caseload",
    icon: Users,
  },
  {
    label: "Avg. Mood Score",
    value: "7.0",
    detail: "+0.4 vs last month",
    icon: TrendingUp,
  },
  {
    label: "Avg. Attendance",
    value: "82%",
    detail: "Across all sessions",
    icon: TrendingUp,
  },
  {
    label: "Symptom Reduction",
    value: "30%",
    detail: "Mean improvement",
    icon: TrendingDown,
  },
];

export function TherapistAnalyticsListView() {
  return (
    <TherapistAppShell
      active="Dashboard"
      title="Analytics"
      subtitle="Therapeutic progress across your full patient caseload"
      actions={
        <div className="relative w-full max-w-xs sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-munity-muted" />
          <input
            type="search"
            placeholder="Search patients..."
            className="h-10 w-full rounded-full border border-munity-input-border bg-[#efeded] py-2 pl-10 pr-4 text-sm font-medium text-munity-text outline-none focus:border-munity-green"
          />
        </div>
      }
    >
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.article
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-munity-muted">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-munity-text">{stat.value}</p>
                  <p className="mt-1 text-sm text-munity-green">{stat.detail}</p>
                </div>
                <div className="flex size-11 items-center justify-center rounded-xl bg-munity-lime/50">
                  <Icon className="size-5 text-munity-green" />
                </div>
              </div>
            </motion.article>
          );
        })}
      </section>

      <div className="flex flex-col gap-6">
        {patients.map((patient, index) => (
          <motion.section
            key={patient.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-munity-border pb-5">
              <Link
                href={patientRoutes(patient.slug).overview}
                className="flex items-center gap-4 transition hover:opacity-80"
              >
                <div className="relative size-12 shrink-0 overflow-hidden rounded-xl">
                  <Image src={patient.avatar} alt={patient.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-munity-text">{patient.name}</p>
                  <p className="text-xs font-bold uppercase tracking-wide text-munity-muted">
                    {patient.clientId} · Focus: {patient.focusArea}
                  </p>
                </div>
              </Link>
              <Link
                href={patientRoutes(patient.slug).progress}
                className="flex items-center gap-1 text-sm font-semibold text-munity-green hover:underline"
              >
                View full analytics
                <ChevronRight className="size-4" />
              </Link>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div className="rounded-2xl border border-munity-border bg-munity-sidebar/30 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-munity-muted">
                  Mood score
                </p>
                <p className="mt-2 text-2xl font-bold text-munity-text">{patient.moodScore}</p>
                <p className="mt-1 text-xs text-munity-green">
                  {patient.moodTrend === "up"
                    ? "Trending up"
                    : patient.moodTrend === "down"
                      ? "Needs attention"
                      : "Stable"}
                </p>
              </div>
              <div className="rounded-2xl border border-munity-border bg-munity-sidebar/30 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-munity-muted">
                  Symptom change
                </p>
                <p className="mt-2 text-2xl font-bold text-munity-green">{patient.improvement}</p>
                <p className="mt-1 text-xs text-munity-muted">vs baseline</p>
              </div>
              <div className="rounded-2xl border border-munity-border bg-munity-sidebar/30 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-munity-muted">
                  Attendance
                </p>
                <p className="mt-2 text-2xl font-bold text-munity-text">{patient.attendance}</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-munity-divider">
                  <div
                    className="h-full rounded-full bg-munity-green"
                    style={{ width: patient.attendance }}
                  />
                </div>
              </div>
              <div className="rounded-2xl border border-munity-border bg-munity-sidebar/30 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-munity-muted">
                  Sessions
                </p>
                <p className="mt-2 text-2xl font-bold text-munity-text">{patient.sessionsCompleted}</p>
                <p className="mt-1 text-xs text-munity-muted">Completed to date</p>
              </div>
            </div>
          </motion.section>
        ))}
      </div>
    </TherapistAppShell>
  );
}
