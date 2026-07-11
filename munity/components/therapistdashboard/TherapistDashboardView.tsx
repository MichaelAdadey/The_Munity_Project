"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  ChevronRight,
  ClipboardList,
  Clock,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";
import { TherapistSidebar } from "@/components/therapistlayout/Sidebars";
import { CollapsibleSidebarLayout } from "@/components/therapistlayout/CollapsibleSidebarLayout";
import { SidebarProvider } from "@/components/therapistlayout/SidebarContext";
import { TopNav } from "@/components/therapistlayout/TopNav";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { Button } from "@/components/ui/AppButton";
import { assets } from "@/lib/assets";
import { patientRoutes, patientSlugs, patientsBySlug, routes } from "@/lib/routes";

const stats = [
  {
    label: "Active Patients",
    value: "12",
    change: "+2 this month",
    icon: Users,
    iconBg: "bg-munity-lime/50",
    iconColor: "text-munity-green",
  },
  {
    label: "Sessions Today",
    value: "3",
    change: "Next at 10:30 AM",
    icon: Calendar,
    iconBg: "bg-munity-green/10",
    iconColor: "text-munity-green",
  },
  {
    label: "Pending Notes",
    value: "2",
    change: "Due before Friday",
    icon: ClipboardList,
    iconBg: "bg-[#e4e4cc]",
    iconColor: "text-[#474836]",
  },
  {
    label: "Avg. Mood Score",
    value: "7.4",
    change: "+0.6 vs last week",
    icon: TrendingUp,
    iconBg: "bg-munity-lime/30",
    iconColor: "text-munity-olive-text",
  },
];

const todaysSessions = [
  {
    time: "10:30 AM",
    duration: "60 min",
    patient: "Leo Richards",
    slug: "leo-richards" as const,
    type: "Video Session",
    avatarKey: "leo" as const,
  },
  {
    time: "2:00 PM",
    duration: "45 min",
    patient: "Elena Rodriguez",
    slug: "elena-rodriguez" as const,
    type: "In-Person",
    avatarKey: "elena" as const,
  },
  {
    time: "4:30 PM",
    duration: "60 min",
    patient: "Alex Mercer",
    slug: "alex-mercer" as const,
    type: "Video Session",
    avatarKey: "alex" as const,
  },
];

const patientCaseload = patientSlugs.map((slug) => {
  const patient = patientsBySlug[slug];
  const meta: Record<
    typeof slug,
    { status: string; mood: string; lastSession: string; plan: string }
  > = {
    "leo-richards": {
      status: "Active",
      mood: "8/10",
      lastSession: "Mar 14",
      plan: "Weekly Therapy",
    },
    "elena-rodriguez": {
      status: "Active",
      mood: "6/10",
      lastSession: "Mar 12",
      plan: "Bi-weekly",
    },
    "alex-mercer": {
      status: "Follow-up",
      mood: "7/10",
      lastSession: "Mar 10",
      plan: "Monthly Check-in",
    },
  };

  return {
    ...patient,
    avatar: assets.avatars[patient.avatarKey],
    ...meta[slug],
  };
});

const tasks = [
  {
    title: "Review session notes for Alex Mercer",
    due: "Due today",
    href: patientRoutes("alex-mercer").clinicalNotes,
  },
  {
    title: "Update care plan for Elena Rodriguez",
    due: "Due tomorrow",
    href: patientRoutes("elena-rodriguez").overview,
  },
  {
    title: "Submit monthly progress summary",
    due: "Due Friday",
    href: patientRoutes("leo-richards").progress,
  },
];

export function TherapistDashboardView() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <SidebarProvider storageKey="munity-therapist-sidebar-open">
    <div className="min-h-screen bg-munity-bg">
      <TopNav active="Dashboard" showSearch />

      <div className="w-full pt-16">
        <CollapsibleSidebarLayout
          sidebar={<TherapistSidebar active="Dashboard" />}
          mainClassName="px-10 pb-16 pt-8"
        >
        <AnimatedPage className="flex-1">
          <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-munity-muted">
                Therapist Dashboard
              </p>
              <h1 className="mt-2 text-3xl font-bold text-munity-text">Good morning, Dr. Harper</h1>
              <p className="mt-1 text-base text-munity-muted">{today}</p>
            </div>
            <Button href={patientRoutes("leo-richards").clinicalNotes}>
              Start Next Session
              <ArrowRight className="size-4" />
            </Button>
          </header>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.article
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-munity-muted">{stat.label}</p>
                      <p className="mt-2 text-3xl font-bold text-munity-text">{stat.value}</p>
                      <p className="mt-1 text-sm text-munity-green">{stat.change}</p>
                    </div>
                    <div
                      className={`flex size-11 items-center justify-center rounded-xl ${stat.iconBg}`}
                    >
                      <Icon className={`size-5 ${stat.iconColor}`} />
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </section>

          <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <section className="rounded-[20px] border border-munity-border bg-white p-8 shadow-[0_4px_10px_rgba(85,107,47,0.05)] xl:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-munity-text">Today&apos;s Schedule</h2>
                  <p className="text-sm text-munity-muted">Upcoming sessions and appointments</p>
                </div>
                <span className="rounded-full bg-munity-lime/40 px-3 py-1 text-xs font-bold text-munity-olive-text">
                  3 sessions
                </span>
              </div>

              <div className="space-y-4">
                {todaysSessions.map((session, index) => (
                  <motion.div
                    key={session.slug}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06 }}
                    className="flex flex-wrap items-center gap-4 rounded-2xl border border-munity-border bg-munity-sidebar/40 p-4"
                  >
                    <div className="min-w-[88px]">
                      <p className="text-sm font-bold text-munity-text">{session.time}</p>
                      <p className="text-xs text-munity-muted">{session.duration}</p>
                    </div>
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={assets.avatars[session.avatarKey]}
                        alt={session.patient}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-munity-text">{session.patient}</p>
                      <p className="text-sm text-munity-muted">{session.type}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-munity-green">
                      <Video className="size-4" />
                      Join
                    </div>
                    <Link
                      href={patientRoutes(session.slug).clinicalNotes}
                      className="rounded-xl bg-munity-green px-4 py-2 text-sm font-semibold text-white transition hover:bg-munity-green-dark"
                    >
                      Prepare Notes
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="rounded-[20px] border border-munity-border bg-white p-8 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-munity-text">Action Items</h2>
                <Clock className="size-[18px] text-munity-muted" />
              </div>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <Link
                    key={task.title}
                    href={task.href}
                    className="block rounded-2xl border border-munity-border bg-munity-bg p-4 transition hover:border-munity-green/30"
                  >
                    <p className="text-sm font-semibold text-munity-text">{task.title}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wide text-munity-muted">
                      {task.due}
                    </p>
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-[20px] border border-munity-border bg-white p-8 shadow-[0_4px_10px_rgba(85,107,47,0.05)] xl:col-span-3">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-munity-text">Patient Caseload</h2>
                  <p className="text-sm text-munity-muted">
                    Active clients and their latest clinical signals
                  </p>
                </div>
                <Button variant="outline" href={routes.therapistPatients}>
                  View All Patients
                </Button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-munity-border">
                <div className="grid grid-cols-[minmax(0,2fr)_repeat(4,minmax(0,1fr))] gap-4 border-b border-munity-border bg-munity-sidebar/60 px-6 py-3 text-xs font-bold uppercase tracking-wide text-munity-muted">
                  <span>Patient</span>
                  <span>Status</span>
                  <span>Care Plan</span>
                  <span>Mood</span>
                  <span>Last Session</span>
                </div>
                {patientCaseload.map((patient, index) => (
                  <motion.div
                    key={patient.slug}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={patientRoutes(patient.slug).overview}
                      className="grid grid-cols-[minmax(0,2fr)_repeat(4,minmax(0,1fr))] items-center gap-4 border-b border-munity-border px-6 py-4 transition last:border-b-0 hover:bg-munity-lime/10"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="relative size-11 shrink-0 overflow-hidden rounded-xl">
                          <Image
                            src={patient.avatar}
                            alt={patient.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-munity-text">{patient.name}</p>
                          <p className="text-xs font-bold uppercase tracking-wide text-munity-muted">
                            {patient.clientId}
                          </p>
                        </div>
                      </div>
                      <span className="w-fit rounded-full bg-munity-lime/50 px-3 py-1 text-xs font-semibold text-munity-olive-text">
                        {patient.status}
                      </span>
                      <span className="text-sm text-munity-text">{patient.plan}</span>
                      <span className="text-sm font-semibold text-munity-green">{patient.mood}</span>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm text-munity-muted">{patient.lastSession}</span>
                        <ChevronRight className="size-4 text-munity-green" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        </AnimatedPage>
        </CollapsibleSidebarLayout>
      </div>
    </div>
    </SidebarProvider>
  );
}
