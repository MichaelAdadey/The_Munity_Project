"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, FileText, Search } from "lucide-react";
import { TherapistSidebar } from "@/components/therapistlayout/Sidebars";
import { CollapsibleSidebarLayout } from "@/components/therapistlayout/CollapsibleSidebarLayout";
import { SidebarProvider } from "@/components/therapistlayout/SidebarContext";
import { TopNav } from "@/components/therapistlayout/TopNav";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { assets } from "@/lib/assets";
import { patientRoutes, patientSlugs, patientsBySlug } from "@/lib/routes";

type NotePreview = {
  id: number;
  date: string;
  title: string;
  excerpt: string;
  tags?: string[];
};

const notesByPatient: Record<(typeof patientSlugs)[number], NotePreview[]> = {
  "leo-richards": [
    {
      id: 12,
      date: "Today",
      title: "Addressing Anxiety Triggers",
      excerpt: "Patient reported increased stress during workplace transition.",
      tags: ["CBT", "MOOD: FAIR"],
    },
    {
      id: 11,
      date: "Oct 17, 2023",
      title: "Boundary Setting at Home",
      excerpt: "Explored family dynamics and the concept of healthy detachment.",
    },
  ],
  "elena-rodriguez": [
    {
      id: 8,
      date: "Mar 12",
      title: "Sleep Hygiene Review",
      excerpt: "Reviewed evening routine changes and progress on wind-down habits.",
      tags: ["CBT"],
    },
    {
      id: 7,
      date: "Feb 28",
      title: "Work-Life Balance Check-in",
      excerpt: "Discussed boundaries with manager and coping strategies for deadlines.",
    },
  ],
  "alex-mercer": [
    {
      id: 5,
      date: "Mar 10",
      title: "Monthly Progress Review",
      excerpt: "Month 3 review. Patient showing marked improvement in sleep patterns.",
      tags: ["MOOD: GOOD"],
    },
    {
      id: 4,
      date: "Feb 10",
      title: "Grief and Loss Processing",
      excerpt: "First session focusing on recent loss. Narrative therapy techniques used.",
    },
  ],
};

const patients = patientSlugs.map((slug) => ({
  ...patientsBySlug[slug],
  avatar: assets.avatars[patientsBySlug[slug].avatarKey],
  notes: notesByPatient[slug],
}));

export function TherapistClinicalNotesListView() {
  return (
    <SidebarProvider storageKey="munity-therapist-sidebar-open">
      <div className="min-h-screen bg-munity-bg">
        <TopNav active="Sessions" showSearch />

        <div className="w-full pt-16">
          <CollapsibleSidebarLayout
            sidebar={<TherapistSidebar active="Appointments" />}
            mainClassName="px-10 pb-16 pt-8"
          >
            <AnimatedPage className="flex-1">
              <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-munity-muted">
                    Documentation
                  </p>
                  <h1 className="mt-2 text-3xl font-bold text-munity-text">Clinical Notes</h1>
                  <p className="mt-1 text-base text-munity-muted">
                    Session notes across your patient caseload
                  </p>
                </div>
                <div className="relative w-full max-w-sm sm:w-72">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-munity-muted" />
                  <input
                    type="search"
                    placeholder="Search notes..."
                    className="h-10 w-full rounded-full border border-munity-input-border bg-[#efeded] py-2 pl-10 pr-4 text-sm font-medium text-munity-text outline-none focus:border-munity-green"
                  />
                </div>
              </header>

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

                    <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                      {patient.notes.map((note) => (
                        <Link
                          key={note.id}
                          href={patientRoutes(patient.slug).clinicalNotes}
                          className="rounded-2xl border border-munity-border bg-munity-sidebar/30 p-4 transition hover:border-munity-green/30 hover:bg-munity-lime/10"
                        >
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-semibold text-munity-green">
                              Session #{note.id}
                            </span>
                            <span className="text-xs font-medium text-munity-muted">{note.date}</span>
                          </div>
                          <h3 className="mt-2 text-base font-semibold text-munity-text">{note.title}</h3>
                          <p className="mt-1 line-clamp-2 text-sm leading-5 text-munity-muted">
                            {note.excerpt}
                          </p>
                          {note.tags ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {note.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                    tag === "CBT"
                                      ? "bg-munity-lime text-munity-olive-text"
                                      : "bg-munity-divider text-munity-muted"
                                  }`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </Link>
                      ))}
                    </div>
                  </motion.section>
                ))}
              </div>
            </AnimatedPage>
          </CollapsibleSidebarLayout>
        </div>
      </div>
    </SidebarProvider>
  );
}
