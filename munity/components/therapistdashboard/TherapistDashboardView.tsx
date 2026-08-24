"use client";

import { useState } from "react";
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
import {
  TherapistSessionOverlays,
  type TherapistSessionKind,
  type TherapistSessionPatient,
} from "@/components/therapist/TherapistSessionOverlays";
import { TherapistAppShell } from "@/components/therapistlayout/TherapistAppShell";
import { LivePulse, LiveTicker, useLiveToast } from "@/components/live/LiveFeedback";
import { assets } from "@/lib/assets";
import { routes } from "@/lib/routes";

export type DashboardStats = {
  upcomingSessions: number;
  pendingRequests: number;
  completedThisWeek: number;
  averageRating: number | null;
};

export type ScheduleItem = {
  bookingId: string;
  name: string;
  patientId: string;
  type: "video" | "chat";
  time: string;
};

export type RecentPatientItem = {
  patientId: string;
  name: string;
  lastSession: string;
};

interface TherapistDashboardViewProps {
  therapistName: string;
  stats: DashboardStats;
  todaysSchedule: ScheduleItem[];
  recentPatients: RecentPatientItem[];
}

export function TherapistDashboardView({
  therapistName,
  stats,
  todaysSchedule,
  recentPatients,
}: TherapistDashboardViewProps) {
  const { flash } = useLiveToast();
  const [activePatient, setActivePatient] = useState<TherapistSessionPatient | null>(null);
  const [activeKind, setActiveKind] = useState<TherapistSessionKind | null>(null);

  const statCards = [
    {
      label: "Upcoming Sessions",
      value: String(stats.upcomingSessions).padStart(2, "0"),
      meta: "Scheduled",
      metaClass: "text-munity-muted",
      icon: Calendar,
      iconWrap: "bg-munity-lime/40 text-munity-green",
    },
    {
      label: "Pending Requests",
      value: String(stats.pendingRequests).padStart(2, "0"),
      meta: stats.pendingRequests > 0 ? "Requires Action" : "All caught up",
      metaClass: "text-[#56642b]",
      icon: ClipboardList,
      iconWrap: "bg-[#e4e4cc] text-[#474836]",
    },
    {
      label: "Completed This Week",
      value: String(stats.completedThisWeek).padStart(2, "0"),
      meta: "Last 7 days",
      metaClass: "text-munity-muted",
      icon: CheckCircle2,
      iconWrap: "bg-munity-green/10 text-munity-green",
    },
    {
      label: "Average Rating",
      value: stats.averageRating != null ? stats.averageRating.toFixed(2) : "—",
      meta: stats.averageRating != null ? "Patient reviews" : "No reviews yet",
      metaClass: "text-munity-green",
      icon: Star,
      iconWrap: "bg-munity-lime/50 text-munity-olive-text",
    },
  ] as const;

  function startSession(session: ScheduleItem) {
    setActivePatient({
      patientUuid: session.patientId,
      name: session.name,
      patientId: `#${session.patientId.slice(0, 6).toUpperCase()}`,
      avatar: assets.avatars.alex,
      time: session.time,
      type: session.type === "video" ? "Video Session" : "Text Consultation",
    });
    setActiveKind(session.type);
    flash(
      session.type === "video"
        ? `Joining video session with ${session.name}`
        : `Opening chat with ${session.name}`,
    );
  }

  return (
    <TherapistAppShell
      active="Dashboard"
      title={`Welcome back, ${therapistName}`}
      subtitle="Here's an overview of your schedule today."
    >
      {/* NOTE: this crisis-alert banner is still placeholder content — wiring it to
          real patient check-ins/distress flags is a separate feature not yet built. */}
      <section className="flex flex-col gap-3 rounded-2xl border border-[rgba(186,26,26,0.2)] bg-[rgba(255,218,214,0.4)] p-4 sm:flex-row sm:items-start sm:gap-4">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-[#93000a]" />
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold tracking-wide text-[#93000a]">
            Urgent: Patient Crisis Flag
          </h2>
          <p className="mt-1 text-xs font-medium leading-relaxed text-munity-muted">
            This alert is a placeholder — real check-in/distress flagging isn&apos;t built yet.
          </p>
        </div>
      </section>

      <LiveTicker
        items={[
          `${stats.pendingRequests} pending booking request${stats.pendingRequests === 1 ? "" : "s"} awaiting your response.`,
          `${stats.upcomingSessions} upcoming session${stats.upcomingSessions === 1 ? "" : "s"} on your calendar.`,
        ]}
      />

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat, index) => {
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
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold text-munity-text">Today&apos;s Schedule</h2>
              <LivePulse label={`${todaysSchedule.length} today`} />
            </div>
            <Link
              href={routes.therapistAppointments}
              className="rounded-xl px-4 py-2 text-sm font-semibold tracking-wide text-munity-green transition hover:bg-munity-lime/40"
            >
              View Calendar
            </Link>
          </div>

          <div>
            {todaysSchedule.length === 0 ? (
              <p className="p-6 text-sm text-munity-muted">No sessions scheduled for today.</p>
            ) : (
              todaysSchedule.map((session, index) => {
                const TypeIcon = session.type === "video" ? Video : MessageSquare;
                return (
                  <motion.div
                    key={session.bookingId}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className={`flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:gap-6 ${
                      index > 0 ? "border-t border-munity-input-border" : ""
                    }`}
                  >
                    <div className="flex min-w-50 items-center gap-4">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-full">
                        <Image
                          src={assets.avatars.alex}
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
                          Patient ID: #{session.patientId.slice(0, 6).toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-wrap items-center gap-6 sm:gap-8">
                      <div className="flex items-center gap-2 text-munity-muted">
                        <TypeIcon className="size-3.5 shrink-0" />
                        <span className="text-xs font-medium leading-snug">
                          {session.type === "video" ? "Video Session" : "Text Consultation"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="size-3.5 shrink-0 text-munity-muted" />
                        <span className="text-sm font-semibold tracking-wide text-munity-text">
                          {session.time}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => startSession(session)}
                      className="inline-flex shrink-0 items-center justify-center rounded-xl bg-munity-green px-6 py-2.5 text-sm font-semibold tracking-wide text-white transition hover:bg-munity-green-dark"
                    >
                      {session.type === "video" ? "Join Session" : "Open Chat"}
                    </button>
                  </motion.div>
                );
              })
            )}
          </div>
        </section>

        <aside className="flex flex-col gap-8">
          <section className="rounded-[20px] border border-munity-input-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
            <h2 className="text-sm font-semibold uppercase tracking-[0.7px] text-munity-text">
              Recent Patients
            </h2>
            <div className="mt-6 flex flex-col gap-6">
              {recentPatients.length === 0 ? (
                <p className="text-sm text-munity-muted">No patients yet.</p>
              ) : (
                recentPatients.map((patient) => (
                  <div key={patient.patientId} className="flex items-center justify-between gap-3">
                    <Link
                      href={routes.therapistPatients}
                      className="flex min-w-0 items-center gap-3"
                    >
                      <div className="relative shrink-0">
                        <div className="relative size-10 overflow-hidden rounded-full">
                          <Image
                            src={assets.avatars.alex}
                            alt={patient.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-munity-bg bg-[#9ca3af]" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold tracking-wide text-munity-text">
                          {patient.name}
                        </p>
                        <p className="truncate text-xs font-medium text-munity-muted">
                          Last session: {patient.lastSession}
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
                ))
              )}
            </div>
            <Link
              href={routes.therapistPatients}
              className="mt-6 flex w-full items-center justify-center rounded-xl border border-munity-input-border py-3 text-sm font-semibold tracking-wide text-munity-green transition hover:bg-munity-lime/30"
            >
              View All Patients
            </Link>
          </section>

          {/* NOTE: still placeholder — AI-generated weekly summaries aren't built yet. */}
          <section className="rounded-[20px] bg-munity-lime/35 p-6">
            <h2 className="text-base font-semibold text-munity-text">Weekly Summary Report</h2>
            <p className="mt-2 text-sm leading-relaxed text-munity-muted">
              AI-assisted progress summaries are a planned feature — not connected yet.
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

      <TherapistSessionOverlays
        patient={activePatient}
        kind={activeKind}
        onClose={() => {
          setActivePatient(null);
          setActiveKind(null);
        }}
      />
    </TherapistAppShell>
  );
}
