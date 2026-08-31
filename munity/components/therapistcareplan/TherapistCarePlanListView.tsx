"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Search, Target } from "lucide-react";
import { TherapistAppShell } from "@/components/therapistlayout/TherapistAppShell";
import { LiveTicker } from "@/components/live/LiveFeedback";
import { patientRoutes } from "@/lib/routes";
import type { TherapistPatient } from "@/lib/therapist/patients-queries";

interface TherapistCarePlanListViewProps {
  patients: TherapistPatient[];
}

export function TherapistCarePlanListView({ patients }: TherapistCarePlanListViewProps) {
  return (
    <TherapistAppShell
      active="Care Plan"
      title="Care Plan"
      subtitle="Treatment goals and review schedules across your caseload"
      actions={
        <div className="relative w-full max-w-xs sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-munity-muted" />
          <input
            type="search"
            placeholder="Search care plans..."
            className="h-10 w-full rounded-full border border-munity-input-border bg-[#efeded] py-2 pl-10 pr-4 text-sm font-medium text-munity-text outline-none focus:border-munity-green"
          />
        </div>
      }
    >
      <LiveTicker
        items={[
          `${patients.length} patient${patients.length === 1 ? "" : "s"} in your caseload.`,
          "Care plans aren't wired to a real store yet — create one from a patient's page.",
        ]}
      />
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
                href={patientRoutes(patient.slug).carePlan}
                className="flex items-center gap-1 text-sm font-semibold text-munity-green hover:underline"
              >
                <Target className="size-4" />
                View care plan
                <ChevronRight className="size-4" />
              </Link>
            </div>

            {/* NOTE: per-patient care plans/goals aren't backed by a real table yet. */}
            <p className="mt-4 text-sm text-munity-muted">
              No care plan has been created for {patient.name} yet.
            </p>
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
