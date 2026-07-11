"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  MessageSquare,
  MoreVertical,
  Star,
  Video,
} from "lucide-react";
import { TherapistAppShell } from "@/components/therapistlayout/TherapistAppShell";
import { assets } from "@/lib/assets";
import { patientRoutes, routes } from "@/lib/routes";

const stats = [
  {
    label: "Upcoming Sessions",
    value: "08",
    meta: "+2 from yesterday",
    metaClass: "text-munity-muted",
    icon: Calendar,
    iconWrap: "bg-munity-lime/40 text-munity-green",
  },
  {
    label: "Pending Requests",
    value: "03",
    meta: "Requires Action",
    metaClass: "text-[#56642b]",
    icon: ClipboardList,
    iconWrap: "bg-[#e4e4cc] text-[#474836]",
  },
  {
    label: "Completed This Week",
    value: "24",
    meta: "88% Completion",
    metaClass: "text-munity-muted",
    icon: CheckCircle2,
    iconWrap: "bg-munity-green/10 text-munity-green",
  },
  {
    label: "Average Rating",
    value: "4.92",
    meta: "Top Rated",
    metaClass: "text-munity-green",
    icon: Star,
    iconWrap: "bg-munity-lime/50 text-munity-olive-text",
  },
] as const;

const todaysSchedule = [
  {
    name: "Marcus Thorne",
    patientId: "#MT-82",
    type: "Video Session",
    typeIcon: Video,
    time: "02:00 PM – 02:50 PM",
    action: "Join Session",
    actionHref: patientRoutes("alex-mercer").clinicalNotes,
    avatar: assets.avatars.alex,
  },
  {
    name: "Sarah Jenkins",
    patientId: "#SJ-41",
    type: "Text Consultation",
    typeIcon: MessageSquare,
    time: "04:30 PM – 05:00 PM",
    action: "Open Chat",
    actionHref: patientRoutes("elena-rodriguez").overview,
    avatar: assets.avatars.elena,
  },
] as const;

const recentPatients = [
  {
    name: "Leo Richards",
    detail: "Last active: 2h ago",
    status: "online" as const,
    avatar: assets.avatars.leo,
    href: patientRoutes("leo-richards").overview,
  },
  {
    name: "Chloe Bennett",
    detail: "Active journal entry",
    status: "away" as const,
    avatar: assets.avatars.elena,
    href: patientRoutes("elena-rodriguez").overview,
  },
  {
    name: "Julian Vance",
    detail: "Last session: 3 days ago",
    status: "offline" as const,
    avatar: assets.avatars.alex,
    href: patientRoutes("alex-mercer").overview,
  },
];

const statusDotClass = {
  online: "bg-[#22c55e]",
  away: "bg-[#fbbf24]",
  offline: "bg-[#9ca3af]",
} as const;

export function TherapistDashboardView() {
  return (
    <TherapistAppShell
      active="Dashboard"
      title="Welcome back, Dr. Aris"
      subtitle="Here's an overview of your schedule today."
    >
      <section className="flex flex-col gap-3 rounded-2xl border border-[rgba(186,26,26,0.2)] bg-[rgba(255,218,214,0.4)] p-4 sm:flex-row sm:items-start sm:gap-4">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-[#93000a]" />
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold tracking-wide text-[#93000a]">
            Urgent: Patient Crisis Flag
          </h2>
          <p className="mt-1 text-xs font-medium leading-relaxed text-munity-muted">
            Marcus Thorne has flagged high distress in their morning check-in. Review their recent
            logs before your 2:00 PM session.
          </p>
        </div>
        <Link
          href={patientRoutes("alex-mercer").progress}
          className="shrink-0 text-sm font-semibold tracking-wide text-munity-green hover:underline"
        >
          View Log
        </Link>
      </section>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.article
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-[20px] border border-munity-input-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]"
            >
              <div className="flex items-center justify-between">
                <div className={`flex size-9 items-center justify-center rounded-xl ${stat.iconWrap}`}>
                  <Icon className="size-4" />
                </div>
                <span className={`text-xs font-medium ${stat.metaClass}`}>{stat.meta}</span>
              </div>
              <p className="mt-3 text-sm font-semibold tracking-wide text-munity-muted">
                {stat.label}
              </p>
              <p className="mt-1 text-2xl font-semibold text-munity-text">{stat.value}</p>
            </motion.article>
          );
        })}
      </section>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <section className="overflow-hidden rounded-[20px] border border-munity-input-border bg-white shadow-[0_4px_20px_rgba(85,107,47,0.05)] xl:col-span-2">
          <div className="flex items-center justify-between border-b border-munity-input-border px-6 py-6">
            <h2 className="text-2xl font-semibold text-munity-text">Today&apos;s Schedule</h2>
            <Link
              href={routes.therapistAppointments}
              className="rounded-xl px-4 py-2 text-sm font-semibold tracking-wide text-munity-green transition hover:bg-munity-lime/40"
            >
              View Calendar
            </Link>
          </div>

          <div>
            {todaysSchedule.map((session, index) => {
              const TypeIcon = session.typeIcon;
              return (
                <motion.div
                  key={session.patientId}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className={`flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:gap-6 ${
                    index > 0 ? "border-t border-munity-input-border" : ""
                  }`}
                >
                  <div className="flex min-w-[200px] items-center gap-4">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={session.avatar}
                        alt={session.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold tracking-wide text-munity-text">
                        {session.name}
                      </p>
                      <p className="text-xs font-medium text-munity-muted">
                        Patient ID: {session.patientId}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-wrap items-center gap-6 sm:gap-8">
                    <div className="flex items-center gap-2 text-munity-muted">
                      <TypeIcon className="size-3.5 shrink-0" />
                      <span className="text-xs font-medium leading-snug">{session.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="size-3.5 shrink-0 text-munity-muted" />
                      <span className="text-sm font-semibold tracking-wide text-munity-text">
                        {session.time}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={session.actionHref}
                    className="inline-flex shrink-0 items-center justify-center rounded-xl bg-munity-green px-6 py-2.5 text-sm font-semibold tracking-wide text-white transition hover:bg-munity-green-dark"
                  >
                    {session.action}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        <aside className="flex flex-col gap-8">
          <section className="rounded-[20px] border border-munity-input-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
            <h2 className="text-sm font-semibold uppercase tracking-[0.7px] text-munity-text">
              Recent Patients
            </h2>
            <div className="mt-6 flex flex-col gap-6">
              {recentPatients.map((patient) => (
                <div key={patient.name} className="flex items-center justify-between gap-3">
                  <Link href={patient.href} className="flex min-w-0 items-center gap-3">
                    <div className="relative shrink-0">
                      <div className="relative size-10 overflow-hidden rounded-full">
                        <Image
                          src={patient.avatar}
                          alt={patient.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-munity-bg ${statusDotClass[patient.status]}`}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold tracking-wide text-munity-text">
                        {patient.name}
                      </p>
                      <p className="truncate text-xs font-medium text-munity-muted">
                        {patient.detail}
                      </p>
                    </div>
                  </Link>
                  <button
                    type="button"
                    className="rounded-lg p-1 text-munity-muted transition hover:bg-munity-bg hover:text-munity-green"
                    aria-label={`More options for ${patient.name}`}
                  >
                    <MoreVertical className="size-4" />
                  </button>
                </div>
              ))}
            </div>
            <Link
              href={routes.therapistPatients}
              className="mt-6 flex w-full items-center justify-center rounded-xl border border-munity-input-border py-3 text-sm font-semibold tracking-wide text-munity-green transition hover:bg-munity-lime/30"
            >
              View All Patients
            </Link>
          </section>

          <section className="rounded-[20px] bg-munity-lime/35 p-6">
            <h2 className="text-base font-semibold text-munity-text">Weekly Summary Report</h2>
            <p className="mt-2 text-sm leading-relaxed text-munity-muted">
              Your AI-assisted progress summaries for all 12 patients this week are ready for final
              review.
            </p>
            <Link
              href={routes.therapistAnalytics}
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-munity-green hover:underline"
            >
              Review Now
              <ArrowRight className="size-3.5" />
            </Link>
          </section>
        </aside>
      </div>
    </TherapistAppShell>
  );
}
