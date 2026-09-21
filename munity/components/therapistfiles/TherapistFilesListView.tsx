"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, FileText, FolderOpen, Search } from "lucide-react";
import { TherapistAppShell } from "@/components/therapistlayout/TherapistAppShell";
import { LiveTicker } from "@/components/live/LiveFeedback";
import { patientRoutes } from "@/lib/routes";
import type { TherapistPatient } from "@/lib/therapist/patients-queries";
import type { SessionNote } from "@/lib/therapist/session-notes-queries";

interface TherapistFilesListViewProps {
  patients: TherapistPatient[];
  notes: SessionNote[];
}

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function TherapistFilesListView({ patients, notes }: TherapistFilesListViewProps) {
  const notesByPatient = new Map<string, SessionNote[]>();
  for (const note of notes) {
    const list = notesByPatient.get(note.patientId) ?? [];
    list.push(note);
    notesByPatient.set(note.patientId, list);
  }

  return (
    <TherapistAppShell
      active="Files"
      title="Files"
      subtitle="Session notes and documents across your patient caseload"
      actions={
        <div className="relative w-full max-w-xs sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-munity-muted" />
          <input
            type="search"
            placeholder="Search files..."
            className="h-10 w-full rounded-full border border-munity-input-border bg-[#efeded] py-2 pl-10 pr-4 text-sm font-medium text-munity-text outline-none focus:border-munity-green"
          />
        </div>
      }
    >
      <LiveTicker
        items={[
          `${patients.length} patient${patients.length === 1 ? "" : "s"} in your caseload.`,
          `${notes.length} session note${notes.length === 1 ? "" : "s"} on file across your caseload.`,
        ]}
      />
      <div className="flex flex-col gap-6">
        {patients.map((patient) => {
          const patientNotes = (notesByPatient.get(patient.id) ?? []).slice(0, 3);
          const fileCount = notesByPatient.get(patient.id)?.length ?? 0;
          return (
            <motion.section
              key={patient.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 }}
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
                      {patient.clientId} · {fileCount} file{fileCount === 1 ? "" : "s"}
                    </p>
                  </div>
                </Link>
                <Link
                  href={patientRoutes(patient.slug).files}
                  className="flex items-center gap-1 text-sm font-semibold text-munity-green hover:underline"
                >
                  <FolderOpen className="size-4" />
                  Open folder
                  <ChevronRight className="size-4" />
                </Link>
              </div>

              {patientNotes.length === 0 ? (
                <p className="mt-4 text-sm text-munity-muted">No files uploaded for {patient.name} yet.</p>
              ) : (
                <table className="mt-4 w-full text-left text-sm">
                  <tbody>
                    {patientNotes.map((note) => (
                      <tr key={note.id} className="border-b border-munity-border/60 last:border-b-0">
                        <td className="py-3 pr-3">
                          <Link
                            href={`${patientRoutes(patient.slug).clinicalNotes}?note=${note.id}`}
                            className="flex items-center gap-3 hover:opacity-80"
                          >
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-munity-lime/50">
                              <FileText className="size-4 text-munity-green" />
                            </div>
                            <span className="font-medium text-munity-text">{note.title}</span>
                          </Link>
                        </td>
                        <td className="py-3 pl-3 text-right text-munity-muted">
                          {formatDate(note.sessionDate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {fileCount > patientNotes.length ? (
                <Link
                  href={patientRoutes(patient.slug).files}
                  className="mt-3 inline-block text-sm font-semibold text-munity-green hover:underline"
                >
                  View all {fileCount} files
                </Link>
              ) : null}
            </motion.section>
          );
        })}
      </div>
      {patients.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-munity-border bg-white p-10 text-center text-munity-muted">
          You don&apos;t have any patients yet.
        </div>
      ) : null}
    </TherapistAppShell>
  );
}
