"use client";

import { motion } from "framer-motion";
import { Download, FileText, Upload } from "lucide-react";
import { useState } from "react";
import { TopNav } from "@/components/therapistlayout/TopNav";
import { PatientSidebar } from "@/components/therapistlayout/Sidebars";
import { CollapsibleSidebarLayout } from "@/components/therapistlayout/CollapsibleSidebarLayout";
import { SidebarProvider } from "@/components/therapistlayout/SidebarContext";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { LivePulse, LiveTicker, useLiveToast } from "@/components/live/LiveFeedback";
import { assets } from "@/lib/assets";
import type { PatientRecord, PatientSlug } from "@/lib/routes";

type PatientFile = {
  name: string;
  type: string;
  size: string;
  updated: string;
  category: string;
};

const filesByPatient: Record<PatientSlug, PatientFile[]> = {
  "leo-richards": [
    {
      name: "Intake Assessment.pdf",
      type: "PDF",
      size: "1.2 MB",
      updated: "Mar 2, 2024",
      category: "Clinical",
    },
    {
      name: "Consent Form.pdf",
      type: "PDF",
      size: "420 KB",
      updated: "Feb 18, 2024",
      category: "Admin",
    },
    {
      name: "Workplace Stress Worksheet.docx",
      type: "DOCX",
      size: "88 KB",
      updated: "Today",
      category: "Homework",
    },
    {
      name: "Session 11 Summary.pdf",
      type: "PDF",
      size: "640 KB",
      updated: "Oct 17, 2023",
      category: "Clinical",
    },
  ],
  "elena-rodriguez": [
    {
      name: "Sleep Diary Template.pdf",
      type: "PDF",
      size: "310 KB",
      updated: "Mar 10, 2024",
      category: "Homework",
    },
    {
      name: "Release of Information.pdf",
      type: "PDF",
      size: "540 KB",
      updated: "Jan 22, 2024",
      category: "Admin",
    },
  ],
  "alex-mercer": [
    {
      name: "Grief Processing Journal.pdf",
      type: "PDF",
      size: "760 KB",
      updated: "Mar 8, 2024",
      category: "Homework",
    },
    {
      name: "Emergency Contacts.pdf",
      type: "PDF",
      size: "190 KB",
      updated: "Feb 1, 2024",
      category: "Admin",
    },
  ],
};

interface PatientFilesViewProps {
  patient: PatientRecord;
}

export function PatientFilesView({ patient }: PatientFilesViewProps) {
  const { flash } = useLiveToast();
  const avatar = assets.avatars[patient.avatarKey];
  const files = filesByPatient[patient.slug];
  const [uploading, setUploading] = useState(false);

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
                    Clinical documents and shared worksheets for {patient.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setUploading(true); window.setTimeout(() => { setUploading(false); flash("File upload is ready"); }, 500); }}
                  className="inline-flex items-center gap-2 rounded-xl bg-munity-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-munity-green-dark"
                >
                  <Upload className="size-4" />
                  {uploading ? "Preparing upload…" : "Upload file"}
                </button>
              </header>

              <div className="mb-5 flex items-center justify-between gap-3"><LiveTicker items={[`${files.length} files are available for ${patient.name}.`, "Clinical documents are encrypted and access-controlled."]} /><LivePulse label="Synced" /></div>
              <div className="flex flex-col gap-3">
                {files.map((file, index) => (
                  <motion.div
                    key={file.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex flex-wrap items-center gap-4 rounded-[20px] border border-munity-border bg-white p-5 shadow-[0_4px_10px_rgba(85,107,47,0.05)]"
                  >
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-munity-lime/50">
                      <FileText className="size-5 text-munity-green" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-munity-text">{file.name}</p>
                      <p className="mt-1 text-sm text-munity-muted">
                        {file.type} · {file.size} · Updated {file.updated}
                      </p>
                    </div>
                    <span className="rounded-full bg-munity-sidebar px-3 py-1 text-xs font-semibold text-munity-muted">
                      {file.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => flash(`${file.name} download started`)}
                      className="inline-flex items-center gap-2 rounded-xl border border-munity-border px-3 py-2 text-sm font-semibold text-munity-text transition hover:border-munity-green/40 hover:bg-munity-lime/10"
                    >
                      <Download className="size-4 text-munity-green" />
                      Download
                    </button>
                  </motion.div>
                ))}
              </div>
            </AnimatedPage>
          </CollapsibleSidebarLayout>
        </div>
      </div>
    </SidebarProvider>
  );
}
