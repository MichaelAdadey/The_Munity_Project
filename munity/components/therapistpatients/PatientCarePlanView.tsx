"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Pencil } from "lucide-react";
import { useState } from "react";
import { TopNav } from "@/components/therapistlayout/TopNav";
import { PatientSidebar } from "@/components/therapistlayout/Sidebars";
import { CollapsibleSidebarLayout } from "@/components/therapistlayout/CollapsibleSidebarLayout";
import { SidebarProvider } from "@/components/therapistlayout/SidebarContext";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { LivePulse, LiveTicker, useLiveToast } from "@/components/live/LiveFeedback";
import type { TherapistPatient } from "@/lib/therapist/patients-queries";

type CareGoal = {
  title: string;
  status: "active" | "completed" | "upcoming";
  focus: string;
  notes: string;
};

type CarePlan = {
  modality: string;
  frequency: string;
  startDate: string;
  nextReview: string;
  summary: string;
  goals: CareGoal[];
};

const defaultPlan: CarePlan = {
  modality: "Not set",
  frequency: "Not set",
  startDate: "—",
  nextReview: "—",
  summary: "No care plan has been created for this patient yet.",
  goals: [],
};

// NOTE: sample plans for the 3 original demo patients only — a real per-patient care-plan
// store isn't built yet, so every actual patient falls back to `defaultPlan` above.
const plansByPatient: Record<string, CarePlan> = {
  "leo-richards": {
    modality: "CBT + Mindfulness",
    frequency: "Weekly video sessions",
    startDate: "Jan 8, 2024",
    nextReview: "Apr 15, 2024",
    summary:
      "Focus on reducing workplace anxiety, strengthening boundaries at home, and building a sustainable evening routine.",
    goals: [
      {
        title: "Reduce workplace anxiety spikes",
        status: "active",
        focus: "Coping skills before meetings",
        notes: "Using 4-7-8 breathing and cognitive reframing before high-stakes calls.",
      },
      {
        title: "Establish evening wind-down routine",
        status: "active",
        focus: "Sleep hygiene",
        notes: "Screens off by 10pm; journaling 3 nights per week.",
      },
      {
        title: "Practice assertive communication",
        status: "upcoming",
        focus: "Boundary setting",
        notes: "Role-play scripts planned for next two sessions.",
      },
    ],
  },
  "elena-rodriguez": {
    modality: "CBT",
    frequency: "Bi-weekly video sessions",
    startDate: "Nov 14, 2023",
    nextReview: "Apr 2, 2024",
    summary:
      "Address burnout and sleep disruption while reinforcing work-life boundaries and recovery habits.",
    goals: [
      {
        title: "Improve sleep consistency",
        status: "active",
        focus: "7+ hours most nights",
        notes: "Sleep diary shows gradual improvement on weeknights.",
      },
      {
        title: "Set work-hour boundaries",
        status: "completed",
        focus: "No email after 7pm",
        notes: "Maintained for 3 consecutive weeks.",
      },
    ],
  },
  "alex-mercer": {
    modality: "Narrative Therapy",
    frequency: "Monthly check-ins",
    startDate: "Dec 3, 2023",
    nextReview: "May 1, 2024",
    summary:
      "Support grief processing after recent loss and gradually rebuild social connection and daily structure.",
    goals: [
      {
        title: "Process recent loss",
        status: "active",
        focus: "Grief journaling",
        notes: "Continuing letter-writing exercises between sessions.",
      },
      {
        title: "Rebuild social connection",
        status: "upcoming",
        focus: "One outreach per week",
        notes: "Start with low-pressure coffee with a close friend.",
      },
    ],
  },
};

const statusStyles = {
  active: "bg-munity-lime/50 text-munity-olive-text",
  completed: "bg-munity-divider text-munity-muted",
  upcoming: "bg-munity-sidebar text-munity-muted",
} as const;

interface PatientCarePlanViewProps {
  patient: TherapistPatient;
}

export function PatientCarePlanView({ patient }: PatientCarePlanViewProps) {
  const { flash } = useLiveToast();
  const avatar = patient.avatar;
  const plan = plansByPatient[patient.slug] ?? defaultPlan;
  const [completedGoals, setCompletedGoals] = useState(() =>
    plan.goals.filter((goal) => goal.status === "completed").map((goal) => goal.title),
  );

  return (
    <SidebarProvider storageKey="munity-patient-sidebar-open">
      <div className="min-h-screen bg-munity-bg">
        <TopNav active="Patients" showSearch />

        <div className="w-full pt-16">
          <CollapsibleSidebarLayout
            sidebar={
              <PatientSidebar
                active="Care Plan"
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
                    Treatment
                  </p>
                  <h1 className="mt-2 text-3xl font-bold text-munity-text">Care Plan</h1>
                  <p className="mt-1 text-base text-munity-muted">
                    Goals and review schedule for {patient.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => flash("Care plan editing opened")}
                  className="inline-flex items-center gap-2 rounded-xl border border-munity-border bg-white px-4 py-2.5 text-sm font-semibold text-munity-text transition hover:border-munity-green/40 hover:bg-munity-lime/10"
                >
                  <Pencil className="size-4 text-munity-green" />
                  Edit plan
                </button>
              </header>

              <div className="mb-5 flex items-center gap-3"><LivePulse label="Plan active" /><LiveTicker items={[`Next care-plan review is ${plan.nextReview}.`, "Goal progress updates are reflected immediately."]} /></div>
              <section className="mb-6 rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-munity-muted">
                      Modality
                    </p>
                    <p className="mt-1 font-semibold text-munity-text">{plan.modality}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-munity-muted">
                      Frequency
                    </p>
                    <p className="mt-1 font-semibold text-munity-text">{plan.frequency}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-munity-muted">
                      Started
                    </p>
                    <p className="mt-1 font-semibold text-munity-text">{plan.startDate}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-munity-muted">
                      Next review
                    </p>
                    <p className="mt-1 font-semibold text-munity-green">{plan.nextReview}</p>
                  </div>
                </div>
                <p className="mt-5 border-t border-munity-border pt-5 text-sm leading-relaxed text-munity-muted">
                  {plan.summary}
                </p>
              </section>

              <div className="flex flex-col gap-4">
                {plan.goals.map((goal, index) => {
                  const isCompleted = completedGoals.includes(goal.title);
                  return (
                  <motion.article
                    key={goal.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]"
                  >
                    <div className="flex items-start gap-3">
                      <button type="button" onClick={() => { setCompletedGoals((current) => isCompleted ? current.filter((title) => title !== goal.title) : [...current, goal.title]); flash(`${goal.title} marked ${isCompleted ? "active" : "complete"}`); }} aria-label={`Toggle ${goal.title}`}>
                        {isCompleted ? <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-munity-green" /> : <Circle className="mt-0.5 size-5 shrink-0 text-munity-muted" />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-semibold text-munity-text">{goal.title}</h2>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusStyles[goal.status]}`}
                          >
                            {goal.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-medium text-munity-green">{goal.focus}</p>
                        <p className="mt-3 text-sm leading-relaxed text-munity-muted">{goal.notes}</p>
                      </div>
                    </div>
                  </motion.article>
                  );
                })}
              </div>
            </AnimatedPage>
          </CollapsibleSidebarLayout>
        </div>
      </div>
    </SidebarProvider>
  );
}
