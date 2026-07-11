"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Circle, Search, Target } from "lucide-react";
import { TherapistAppShell } from "@/components/therapistlayout/TherapistAppShell";
import { assets } from "@/lib/assets";
import { patientRoutes, patientSlugs, patientsBySlug } from "@/lib/routes";

type CareGoal = {
  title: string;
  status: "active" | "completed" | "upcoming";
  focus: string;
};

const plansByPatient: Record<
  (typeof patientSlugs)[number],
  { modality: string; frequency: string; nextReview: string; goals: CareGoal[] }
> = {
  "leo-richards": {
    modality: "CBT + Mindfulness",
    frequency: "Weekly",
    nextReview: "Apr 15, 2024",
    goals: [
      {
        title: "Reduce workplace anxiety spikes",
        status: "active",
        focus: "Coping skills before meetings",
      },
      {
        title: "Establish evening wind-down routine",
        status: "active",
        focus: "Sleep hygiene",
      },
      {
        title: "Practice assertive communication",
        status: "upcoming",
        focus: "Boundary setting",
      },
    ],
  },
  "elena-rodriguez": {
    modality: "CBT",
    frequency: "Bi-weekly",
    nextReview: "Apr 2, 2024",
    goals: [
      {
        title: "Improve sleep consistency",
        status: "active",
        focus: "7+ hours most nights",
      },
      {
        title: "Set work-hour boundaries",
        status: "completed",
        focus: "No email after 7pm",
      },
    ],
  },
  "alex-mercer": {
    modality: "Narrative Therapy",
    frequency: "Monthly",
    nextReview: "May 1, 2024",
    goals: [
      {
        title: "Process recent loss",
        status: "active",
        focus: "Grief journaling",
      },
      {
        title: "Rebuild social connection",
        status: "upcoming",
        focus: "One outreach per week",
      },
    ],
  },
};

const patients = patientSlugs.map((slug) => ({
  ...patientsBySlug[slug],
  avatar: assets.avatars[patientsBySlug[slug].avatarKey],
  ...plansByPatient[slug],
}));

const statusStyles = {
  active: "bg-munity-lime/50 text-munity-olive-text",
  completed: "bg-munity-divider text-munity-muted",
  upcoming: "bg-munity-sidebar text-munity-muted",
} as const;

export function TherapistCarePlanListView() {
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
                    {patient.clientId} · {patient.modality} · {patient.frequency}
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

            <p className="mt-4 text-sm text-munity-muted">
              Next review: <span className="font-semibold text-munity-text">{patient.nextReview}</span>
            </p>

            <div className="mt-4 flex flex-col gap-3">
              {patient.goals.map((goal) => (
                <div
                  key={goal.title}
                  className="flex items-start gap-3 rounded-2xl border border-munity-border bg-munity-sidebar/30 p-4"
                >
                  {goal.status === "completed" ? (
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-munity-green" />
                  ) : (
                    <Circle className="mt-0.5 size-5 shrink-0 text-munity-muted" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-munity-text">{goal.title}</p>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusStyles[goal.status]}`}
                      >
                        {goal.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-munity-muted">{goal.focus}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </TherapistAppShell>
  );
}
