"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Download, FileText, FolderOpen, Search } from "lucide-react";
import { TherapistAppShell } from "@/components/therapistlayout/TherapistAppShell";
import { LivePulse, LiveTicker, useLiveToast } from "@/components/live/LiveFeedback";
import { assets } from "@/lib/assets";
import { patientRoutes, patientSlugs, patientsBySlug } from "@/lib/routes";

type PatientFile = {
  name: string;
  type: string;
  size: string;
  updated: string;
};

const filesByPatient: Record<(typeof patientSlugs)[number], PatientFile[]> = {
  "leo-richards": [
    {
      name: "Intake Assessment.pdf",
      type: "PDF",
      size: "1.2 MB",
      updated: "Mar 2, 2024",
    },
    {
      name: "Consent Form.pdf",
      type: "PDF",
      size: "420 KB",
      updated: "Feb 18, 2024",
    },
    {
      name: "Workplace Stress Worksheet.docx",
      type: "DOCX",
      size: "88 KB",
      updated: "Today",
    },
  ],
  "elena-rodriguez": [
    {
      name: "Sleep Diary Template.pdf",
      type: "PDF",
      size: "310 KB",
      updated: "Mar 10, 2024",
    },
    {
      name: "Release of Information.pdf",
      type: "PDF",
      size: "540 KB",
      updated: "Jan 22, 2024",
    },
  ],
  "alex-mercer": [
    {
      name: "Grief Processing Journal.pdf",
      type: "PDF",
      size: "760 KB",
      updated: "Mar 8, 2024",
    },
    {
      name: "Emergency Contacts.pdf",
      type: "PDF",
      size: "190 KB",
      updated: "Feb 1, 2024",
    },
  ],
};

const patients = patientSlugs.map((slug) => ({
  ...patientsBySlug[slug],
  avatar: assets.avatars[patientsBySlug[slug].avatarKey],
  files: filesByPatient[slug],
}));

export function TherapistFilesListView() {
  const { flash } = useLiveToast();
  return (
    <TherapistAppShell
      active="Files"
      title="Files"
      subtitle="Documents and worksheets across your patient caseload"
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
      <LiveTicker items={["A worksheet was shared with Leo Richards today.", "All clinical files are synchronized and encrypted."]} />
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
                  <div className="flex items-center gap-2"><p className="text-xs font-bold uppercase tracking-wide text-munity-muted">
                    {patient.clientId} · {patient.files.length} files
                  </p>{index === 0 ? <LivePulse label="Updated" /> : null}</div>
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

            <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
              {patient.files.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center gap-4 rounded-2xl border border-munity-border bg-munity-sidebar/30 p-4"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-munity-lime/50">
                    <FileText className="size-5 text-munity-green" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-munity-text">{file.name}</p>
                    <p className="text-xs text-munity-muted">
                      {file.type} · {file.size} · {file.updated}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => flash(`${file.name} download started`)}
                    className="rounded-full p-2 text-munity-muted transition hover:bg-white hover:text-munity-green"
                    aria-label={`Download ${file.name}`}
                  >
                    <Download className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </TherapistAppShell>
  );
}
