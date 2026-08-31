"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, FileText, Search } from "lucide-react";
import { TherapistAppShell } from "@/components/therapistlayout/TherapistAppShell";
import { LivePulse, LiveTicker } from "@/components/live/LiveFeedback";
import { useMockStore } from "@/lib/mock-store";
import { patientRoutes } from "@/lib/routes";
import type { TherapistPatient } from "@/lib/therapist/patients-queries";

interface TherapistClinicalNotesListViewProps {
  patients: TherapistPatient[];
}

export function TherapistClinicalNotesListView({ patients }: TherapistClinicalNotesListViewProps) {
  const { sessionNotes } = useMockStore();

  const patientsWithNotes = patients.map((patient) => ({
    ...patient,
    notes: sessionNotes
      .filter((note) => note.patientSlug === patient.slug)
      .sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime()),
  }));

  return (
    <TherapistAppShell
      active="Sessions"
      title="Sessions"
      subtitle="Session notes across your patient caseload"
      actions={
        <div className="relative w-full max-w-xs sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-munity-muted" />
          <input
            type="search"
            placeholder="Search notes..."
            className="h-10 w-full rounded-full border border-munity-input-border bg-[#efeded] py-2 pl-10 pr-4 text-sm font-medium text-munity-text outline-none focus:border-munity-green"
          />
        </div>
      }
    >
      <LiveTicker
        items={[
          `${patientsWithNotes.reduce((sum, p) => sum + p.notes.length, 0)} saved session note(s) across your caseload.`,
          `${patients.length} patient${patients.length === 1 ? "" : "s"} in your caseload.`,
        ]}
      />
      <div className="flex flex-col gap-6">
        {patientsWithNotes.map((patient, index) => (
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
                    {patient.clientId}
                  </p>
                </div>
                {index === 0 && patient.notes.length > 0 ? <LivePulse label="Has notes" /> : null}
              </Link>
              <Link
                href={patientRoutes(patient.slug).clinicalNotes}
                className="flex items-center gap-1 text-sm font-semibold text-munity-green hover:underline"
              >
                <FileText className="size-4" />
                View all notes
                <ChevronRight className="size-4" />
              </Link>
            </div>

            {patient.notes.length === 0 ? (
              <p className="mt-4 text-sm text-munity-muted">No session notes saved for {patient.name} yet.</p>
            ) : (
              <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                {patient.notes.slice(0, 4).map((note) => (
                  <Link
                    key={note.id}
                    href={patientRoutes(patient.slug).clinicalNotes}
                    className="rounded-2xl border border-munity-border bg-munity-sidebar/30 p-4 transition hover:border-munity-green/30 hover:bg-munity-lime/10"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-xs font-medium text-munity-muted">
                        {new Date(`${note.sessionDate}T12:00:00`).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <h3 className="mt-2 text-base font-semibold text-munity-text">{note.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm leading-5 text-munity-muted">
                      {note.body}
                    </p>
                  </Link>
                ))}
              </div>
            )}
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
