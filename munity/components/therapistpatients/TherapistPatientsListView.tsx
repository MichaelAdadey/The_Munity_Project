"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import { LivePulse, LiveTicker } from "@/components/live/LiveFeedback";
import { TherapistAppShell } from "@/components/therapistlayout/TherapistAppShell";
import { patientRoutes } from "@/lib/routes";
import type { TherapistPatient } from "@/lib/therapist/patients-queries";

interface TherapistPatientsListViewProps {
  patients: TherapistPatient[];
}

export function TherapistPatientsListView({ patients }: TherapistPatientsListViewProps) {
  const [query, setQuery] = useState("");
  const visiblePatients = useMemo(
    () => patients.filter((patient) => patient.name.toLowerCase().includes(query.toLowerCase())),
    [patients, query],
  );
  const activeCount = useMemo(
    () => patients.filter((patient) => patient.status === "Active").length,
    [patients],
  );
  const nextUpcoming = useMemo(
    () =>
      patients
        .filter((patient): patient is TherapistPatient & { nextSessionAt: string } =>
          Boolean(patient.nextSessionAt),
        )
        .sort((a, b) => new Date(a.nextSessionAt).getTime() - new Date(b.nextSessionAt).getTime())[0] ??
      null,
    [patients],
  );

  const tickerItems =
    patients.length === 0
      ? ["Booked sessions with patients will show up here."]
      : [
          `${activeCount} active patient${activeCount === 1 ? "" : "s"} in your caseload.`,
          nextUpcoming
            ? `${nextUpcoming.name} has a session on ${nextUpcoming.nextSessionLabel}.`
            : "No upcoming sessions scheduled.",
        ];

  return (
    <TherapistAppShell
      active="Patients"
      title="Patients"
      subtitle={`${patients.length} patient${patients.length === 1 ? "" : "s"} in your practice`}
      actions={
        <div className="relative w-full max-w-xs sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-munity-muted" />
          <input
            type="search"
            placeholder="Search patients..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-10 w-full rounded-full border border-munity-input-border bg-[#efeded] py-2 pl-10 pr-4 text-sm font-medium text-munity-text outline-none focus:border-munity-green"
          />
        </div>
      }
    >
      <LiveTicker items={tickerItems} />
      <div className="flex items-center gap-2 text-sm text-munity-muted">
        <LivePulse label="Active caseload" count={activeCount} />
        <span>{visiblePatients.length} matching patients</span>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visiblePatients.map((patient, index) => (
          <motion.div
            key={patient.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            <Link
              href={patientRoutes(patient.slug).overview}
              className="group flex flex-col rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)] transition hover:border-munity-green/30 hover:bg-munity-lime/5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={patient.avatar}
                      alt={patient.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-munity-text">{patient.name}</p>
                    <p className="text-xs font-bold uppercase tracking-wide text-munity-muted">
                      {patient.clientId}
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-5 text-munity-green opacity-0 transition group-hover:opacity-100" />
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    patient.status === "Active"
                      ? "bg-munity-lime/50 text-munity-olive-text"
                      : "bg-munity-sidebar text-munity-muted"
                  }`}
                >
                  {patient.status}
                </span>
                <span className="rounded-full bg-munity-sidebar px-3 py-1 text-xs font-semibold text-munity-muted">
                  {patient.sessionCount} session{patient.sessionCount === 1 ? "" : "s"}
                </span>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-munity-border pt-4 text-sm">
                <span className="text-munity-muted">Last session: {patient.lastSessionLabel}</span>
                <span className="font-semibold text-munity-green">
                  {patient.nextSessionLabel ? `Next: ${patient.nextSessionLabel}` : "No upcoming session"}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      {patients.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-[20px] border border-dashed border-munity-border bg-white p-10 text-center text-munity-muted">
          You don&apos;t have any patients yet. Once someone books a session with you, they&apos;ll show up here.
        </motion.div>
      ) : visiblePatients.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-[20px] border border-dashed border-munity-border bg-white p-10 text-center text-munity-muted">
          No patients match “{query}”. Try another name or clear your search.
        </motion.div>
      ) : null}
    </TherapistAppShell>
  );
}
