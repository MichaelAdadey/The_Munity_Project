"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import { TherapistSidebar } from "@/components/therapistlayout/Sidebars";
import { CollapsibleSidebarLayout } from "@/components/therapistlayout/CollapsibleSidebarLayout";
import { SidebarProvider } from "@/components/therapistlayout/SidebarContext";
import { TopNav } from "@/components/therapistlayout/TopNav";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { assets } from "@/lib/assets";
import { patientRoutes, patientSlugs, patientsBySlug } from "@/lib/routes";

const patientMeta: Record<
  (typeof patientSlugs)[number],
  { status: string; plan: string; lastActive: string; mood: string }
> = {
  "leo-richards": {
    status: "Active",
    plan: "Weekly Therapy",
    lastActive: "2h ago",
    mood: "8/10",
  },
  "elena-rodriguez": {
    status: "Active",
    plan: "Bi-weekly",
    lastActive: "Yesterday",
    mood: "6/10",
  },
  "alex-mercer": {
    status: "Follow-up",
    plan: "Monthly Check-in",
    lastActive: "3 days ago",
    mood: "7/10",
  },
};

const patients = patientSlugs.map((slug) => ({
  ...patientsBySlug[slug],
  avatar: assets.avatars[patientsBySlug[slug].avatarKey],
  ...patientMeta[slug],
}));

export function TherapistPatientsListView() {
  return (
    <SidebarProvider storageKey="munity-therapist-sidebar-open">
      <div className="min-h-screen bg-munity-bg">
        <TopNav active="Patients" showSearch />

        <div className="w-full pt-16">
          <CollapsibleSidebarLayout
            sidebar={<TherapistSidebar active="My Patients" />}
            mainClassName="px-10 pb-16 pt-8"
          >
            <AnimatedPage className="flex-1">
              <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-munity-muted">
                    Caseload
                  </p>
                  <h1 className="mt-2 text-3xl font-bold text-munity-text">My Patients</h1>
                  <p className="mt-1 text-base text-munity-muted">
                    {patients.length} active clients in your practice
                  </p>
                </div>
                <div className="relative w-full max-w-sm sm:w-72">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-munity-muted" />
                  <input
                    type="search"
                    placeholder="Search patients..."
                    className="h-10 w-full rounded-full border border-munity-input-border bg-[#efeded] py-2 pl-10 pr-4 text-sm font-medium text-munity-text outline-none focus:border-munity-green"
                  />
                </div>
              </header>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {patients.map((patient, index) => (
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
                        <span className="rounded-full bg-munity-lime/50 px-3 py-1 text-xs font-semibold text-munity-olive-text">
                          {patient.status}
                        </span>
                        <span className="rounded-full bg-munity-sidebar px-3 py-1 text-xs font-semibold text-munity-muted">
                          {patient.plan}
                        </span>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-munity-border pt-4 text-sm">
                        <span className="text-munity-muted">Last active: {patient.lastActive}</span>
                        <span className="font-semibold text-munity-green">Mood {patient.mood}</span>
                      </div>
                    </Link>
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
