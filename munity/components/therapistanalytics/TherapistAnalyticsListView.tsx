"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Search, TrendingUp, Users } from "lucide-react";
import { TherapistAppShell } from "@/components/therapistlayout/TherapistAppShell";
import { LivePulse, LiveTicker } from "@/components/live/LiveFeedback";
import { patientRoutes } from "@/lib/routes";
import type { TherapistPatient } from "@/lib/therapist/patients-queries";

interface TherapistAnalyticsListViewProps {
  patients: TherapistPatient[];
}

export function TherapistAnalyticsListView({ patients }: TherapistAnalyticsListViewProps) {
  const activeCount = patients.filter((p) => p.status === "Active").length;
  const totalSessions = patients.reduce((sum, p) => sum + p.sessionCount, 0);

  const overviewStats = [
    {
      label: "Active Patients",
      value: String(activeCount),
      detail: `${patients.length} total in caseload`,
      icon: Users,
    },
    {
      label: "Total Sessions",
      value: String(totalSessions),
      detail: "Across all patients",
      icon: TrendingUp,
    },
  ];

  return (
    <TherapistAppShell
      active="Analysis"
      title="Analysis"
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
      <LiveTicker
        items={[
          `${activeCount} active patient${activeCount === 1 ? "" : "s"} in your caseload.`,
          `${totalSessions} session${totalSessions === 1 ? "" : "s"} recorded across your caseload.`,
        ]}
      />
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
                  <div className="flex items-center justify-between gap-2"><p className="text-sm font-semibold text-munity-muted">{stat.label}</p>{index === 0 ? <LivePulse label="Live" /> : null}</div>
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
                    {patient.clientId} · {patient.status}
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

            {/* NOTE: mood score, symptom change, and attendance aren't backed by real
                assessment data yet — showing real session counts and dates instead. */}
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-munity-border bg-munity-sidebar/30 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-munity-muted">
                  Sessions
                </p>
                <p className="mt-2 text-2xl font-bold text-munity-text">{patient.sessionCount}</p>
                <p className="mt-1 text-xs text-munity-muted">Completed to date</p>
              </div>
              <div className="rounded-2xl border border-munity-border bg-munity-sidebar/30 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-munity-muted">
                  Last session
                </p>
                <p className="mt-2 text-lg font-bold text-munity-text">{patient.lastSessionLabel}</p>
              </div>
              <div className="rounded-2xl border border-munity-border bg-munity-sidebar/30 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-munity-muted">
                  Next session
                </p>
                <p className="mt-2 text-lg font-bold text-munity-text">
                  {patient.nextSessionLabel ?? "None scheduled"}
                </p>
              </div>
            </div>
          </motion.section>
        ))}
      </div>
      {patients.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-munity-border bg-white p-10 text-center text-munity-muted">
          You don&apos;t have any patients yet.
        </div>
      ) : null}
    </TherapistAppShell>
  );
}
