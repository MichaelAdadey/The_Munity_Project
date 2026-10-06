"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Download, Eye, FileText, PlusCircle } from "lucide-react";
import { TopNav } from "@/components/therapistlayout/TopNav";
import { PatientSidebar } from "@/components/therapistlayout/Sidebars";
import { CollapsibleSidebarLayout } from "@/components/therapistlayout/CollapsibleSidebarLayout";
import { SidebarProvider } from "@/components/therapistlayout/SidebarContext";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { LivePulse, LiveTicker, useLiveToast } from "@/components/live/LiveFeedback";
import { patientRoutes } from "@/lib/routes";
import type { TherapistPatient } from "@/lib/therapist/patients-queries";
import type { SessionNote } from "@/lib/therapist/session-notes-queries";

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function downloadNote(note: SessionNote, patientName: string) {
  const text = [
    note.title,
    `Session date: ${formatDate(note.sessionDate)}`,
    `Patient: ${patientName}`,
    "",
    note.body,
  ].join("\n");
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${note.title.replace(/\s+/g, "_")}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

interface PatientFilesViewProps {
  patient: TherapistPatient;
  notes: SessionNote[];
}

export function PatientFilesView({ patient, notes }: PatientFilesViewProps) {
  const { flash } = useLiveToast();
  const avatar = patient.avatar;
  const clinicalNotesHref = patientRoutes(patient.slug).clinicalNotes;
  const newNoteHref = patientRoutes(patient.slug).newSessionNote;

  return (
    <SidebarProvider storageKey="munity-patient-sidebar-open">
      <div className="min-h-screen bg-munity-bg">
        <TopNav active="Patients" showSearch />

        <div className="w-full pt-16">
          <CollapsibleSidebarLayout
            sidebar={
              <PatientSidebar
                active="Files"
                patientSlug={patient.slug}
                patient={{
                  name: patient.name,
                  clientId: patient.clientId,
                  avatar,
                }}
              />
            }
            mainClassName="px-10 pb-16 pt-6"
          >
            <AnimatedPage className="flex-1">
              <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-munity-muted">
                    Documents
                  </p>
                  <h1 className="mt-2 text-3xl font-bold text-munity-text">Files</h1>
                  <p className="mt-1 text-base text-munity-muted">
                    Clinical session notes on file for {patient.name}
                  </p>
                </div>
                <Link
                  href={newNoteHref}
                  className="inline-flex items-center gap-2 rounded-xl bg-munity-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-munity-green-dark"
                >
                  <PlusCircle className="size-4" />
                  New session note
                </Link>
              </header>

              <div className="mb-5 flex items-center justify-between gap-3">
                <LiveTicker
                  items={[
                    `${notes.length} session note${notes.length === 1 ? "" : "s"} on file for ${patient.name}.`,
                    "Clinical documents are encrypted and access-controlled.",
                  ]}
                />
                <LivePulse label="Synced" />
              </div>
              {notes.length === 0 ? (
                <div className="rounded-[20px] border border-dashed border-munity-border bg-white p-10 text-center text-munity-muted">
                  No files uploaded for {patient.name} yet.
                </div>
              ) : (
                <div className="overflow-hidden rounded-[20px] border border-munity-border bg-white shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-munity-border bg-munity-sidebar/60 text-xs font-semibold uppercase tracking-wide text-munity-muted">
                      <tr>
                        <th className="px-5 py-3">File</th>
                        <th className="px-5 py-3">Category</th>
                        <th className="px-5 py-3">Session date</th>
                        <th className="px-5 py-3">Last updated</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notes.map((note, index) => (
                        <motion.tr
                          key={note.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.04 }}
                          className="border-b border-munity-border last:border-b-0 hover:bg-munity-lime/5"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-munity-lime/50">
                                <FileText className="size-4 text-munity-green" />
                              </div>
                              <span className="font-semibold text-munity-text">{note.title}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="rounded-full bg-munity-sidebar px-3 py-1 text-xs font-semibold text-munity-muted">
                              Clinical
                            </span>
                          </td>
                          <td className="px-5 py-4 text-munity-muted">{formatDate(note.sessionDate)}</td>
                          <td className="px-5 py-4 text-munity-muted">{formatDateTime(note.createdAt)}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`${clinicalNotesHref}?note=${note.id}`}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-munity-border px-3 py-1.5 text-sm font-semibold text-munity-text transition hover:border-munity-green/40 hover:bg-munity-lime/10"
                              >
                                <Eye className="size-4 text-munity-green" />
                                View
                              </Link>
                              <button
                                type="button"
                                onClick={() => {
                                  downloadNote(note, patient.name);
                                  flash(`${note.title} download started`);
                                }}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-munity-border px-3 py-1.5 text-sm font-semibold text-munity-text transition hover:border-munity-green/40 hover:bg-munity-lime/10"
                              >
                                <Download className="size-4 text-munity-green" />
                                Download
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </AnimatedPage>
          </CollapsibleSidebarLayout>
        </div>
      </div>
    </SidebarProvider>
  );
}
