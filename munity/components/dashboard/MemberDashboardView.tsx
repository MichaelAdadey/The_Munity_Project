"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Flame,
  MessageCircle,
  Stethoscope,
  TrendingUp,
  Users,
} from "lucide-react";
import { MemberAppShell } from "@/components/memberlayout/MemberAppShell";
import { MunityRiseIcon } from "@/components/icons/MunityIcons";
import {
  LivePulse,
  LiveTicker,
  liveFadeUp,
  liveStagger,
  useLiveToast,
} from "@/components/live/LiveFeedback";
import { useMockStore } from "@/lib/mock-store";
import { routes } from "@/lib/routes";
import { DashboardBookingData } from "@/lib/dashboard/queries";
import { useCurrentProfile } from "@/hooks/use-current-profile";

const weekMood = [
  { day: "Mon", score: 6 },
  { day: "Tue", score: 7 },
  { day: "Wed", score: 5 },
  { day: "Thu", score: 8 },
  { day: "Fri", score: 7 },
  { day: "Sat", score: 8 },
  { day: "Sun", score: 9 },
];

// const upcoming = [
//   {
//     title: "Video session with Dr. Sarah Jenkins",
//     time: "Today · 2:00 PM",
//     type: "Therapy",
//     href: "/Therapy",
//   },
//   {
//     title: "Anxiety Peer Support check-in",
//     time: "Tomorrow · 6:30 PM",
//     type: "Community",
//     href: "/Communities",
//   },
// ];

const goals = [
  { title: "Log mood 5 days this week", progress: 80, done: false },
  { title: "Complete breathing homework", progress: 100, done: true },
  { title: "Reply in Anxiety Support", progress: 40, done: false },
];

const activity = [
  {
    title: "Mood check-in saved",
    detail: "You rated today a 8/10 — Calm",
    time: "2h ago",
  },
  {
    title: "New message from Dr. Sarah Jenkins",
    detail: "How have you been feeling since our last session?",
    time: "Yesterday",
  },
  {
    title: "Saved a resource",
    detail: "Morning Routine for Mental Clarity",
    time: "2 days ago",
  },
];

export function MemberDashboardView({
  bookingData,
}: {
  bookingData: DashboardBookingData;
}) {
  const store = useMockStore();
  const { profile } = useCurrentProfile();
  const { flash } = useLiveToast();
  const [completedGoals, setCompletedGoals] = useState(
    () => new Set(goals.filter((goal) => goal.done).map((goal) => goal.title)),
  );
  const stats = [
    {
      label: "Day streak",
      value: String(store.profile.dayStreak),
      detail: "Keep going — you’re on a roll",
      icon: Flame,
    },
    {
      label: "Mood average",
      value: store.moodToday ? "8.0" : "7.4",
      detail: store.moodToday ? "Today’s check-in logged" : "+0.6 vs last week",
      icon: TrendingUp,
    },
    {
      label: "Sessions booked",
      value: String(bookingData.sessionsBookedCount),
      detail: bookingData.upcoming[0]
        ? `Your next session is ${bookingData.upcoming[0].time}`
        : "No sessions booked yet",
      icon: Stethoscope,
    },
    {
      label: "Communities",
      value: String(store.memberships.length),
      detail: "Your spaces are active",
      icon: Users,
    },
  ];
  const liveItems = [
    `${store.memberships.length} communities are in your circle today.`,
    bookingData.upcoming[0]
      ? `${bookingData.upcoming[0].title} is coming up ${bookingData.upcoming[0].time}.`
      : "Book a session to see it here.",
    store.moodToday
      ? `Your ${store.moodToday} check-in is helping build your streak.`
      : "A quick check-in can keep your wellness streak going.",
  ];

  return (
    <MemberAppShell>
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-munity-muted">
              Overview
            </p>
            <h1 className="mt-2 text-3xl font-bold text-munity-text">
              Welcome back, {profile?.firstName}
            </h1>
            <p className="mt-1 text-base text-munity-muted">
              Here&apos;s how your wellness journey is going this week.
            </p>
            <div className="mt-3">
              <LivePulse label="Journey active" />
            </div>
          </div>
          <Link
            href={routes.sessions}
            className="inline-flex items-center gap-2 rounded-xl bg-munity-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-munity-green-dark"
          >
            <Calendar className="size-4" />
            My sessions
          </Link>
        </header>

        <LiveTicker items={liveItems} />

        <motion.section
          variants={liveStagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.article
                key={stat.label}
                variants={liveFadeUp}
                transition={{ delay: index * 0.04 }}
                className="rounded-[20px] border border-munity-border bg-white p-5 shadow-[0_4px_10px_rgba(85,107,47,0.05)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-munity-muted">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-munity-text">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm text-munity-green">
                      {stat.detail}
                    </p>
                  </div>
                  <div className="flex size-10 items-center justify-center rounded-xl bg-munity-lime/50">
                    <Icon className="size-5 text-munity-green" />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          <section className="rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)] xl:col-span-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-munity-text">
                  Weekly mood
                </h2>
                <p className="mt-1 text-sm text-munity-muted">
                  Self-reported check-ins from the last 7 days
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-munity-lime/50 px-3 py-1 text-xs font-semibold text-munity-olive-text">
                <MunityRiseIcon className="size-3.5" />
                Trending up
              </span>
            </div>

            <div className="mt-8 flex h-48 items-end gap-2 sm:gap-3">
              {weekMood.map((day, index) => {
                const heightPct = Math.max(12, (day.score / 10) * 100);
                return (
                  <div
                    key={day.day}
                    className="flex h-full min-w-0 flex-1 flex-col items-center gap-2"
                  >
                    <div className="relative flex w-full flex-1 items-end justify-center">
                      <motion.div
                        initial={{ height: 0, opacity: 0.4 }}
                        animate={{ height: `${heightPct}%`, opacity: 1 }}
                        transition={{
                          delay: index * 0.06,
                          duration: 0.5,
                          ease: "easeOut",
                        }}
                        className="w-full max-w-10 rounded-t-xl bg-linear-to-t from-munity-green to-[#b6d088] shadow-[0_4px_12px_rgba(62,82,25,0.18)]"
                        title={`${day.day}: ${day.score}/10`}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-[11px] font-bold text-munity-green">
                        {day.score}
                      </p>
                      <p className="text-xs font-semibold text-munity-muted">
                        {day.day}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)] xl:col-span-2">
            <h2 className="text-xl font-semibold text-munity-text">Upcoming</h2>
            <p className="mt-1 text-sm text-munity-muted">
              Sessions and community events
            </p>
            <div className="mt-5 flex flex-col gap-3">
              {bookingData.upcoming.length === 0 ? (
                <p className="text-sm text-munity-muted">
                  No upcoming sessions. Book a therapist to see it here.
                </p>
              ) : (
                bookingData.upcoming.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="rounded-2xl border border-munity-border bg-munity-sidebar/40 p-4 transition hover:border-munity-green/30 hover:bg-munity-lime/10"
                  >
                    <p className="text-xs font-bold uppercase tracking-wide text-munity-green">
                      {item.type}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-munity-text">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-munity-muted">
                      {item.time}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
            <h2 className="text-xl font-semibold text-munity-text">
              This week&apos;s goals
            </h2>
            <div className="mt-5 flex flex-col gap-4">
              {goals.map((goal) => {
                const done = completedGoals.has(goal.title);
                return (
                  <div key={goal.title}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setCompletedGoals((current) => {
                              const next = new Set(current);
                              if (next.has(goal.title)) next.delete(goal.title);
                              else next.add(goal.title);
                              return next;
                            });
                            flash(
                              done
                                ? "Goal reopened"
                                : "Goal completed — great work!",
                            );
                          }}
                          aria-label={`${done ? "Mark incomplete" : "Complete"}: ${goal.title}`}
                        >
                          {done ? (
                            <CheckCircle2 className="size-4 text-munity-green" />
                          ) : (
                            <span className="size-4 rounded-full border-2 border-munity-divider" />
                          )}
                        </button>
                        <p className="text-sm font-medium text-munity-text">
                          {goal.title}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-munity-muted">
                        {goal.progress}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-munity-divider">
                      <div
                        className="h-full rounded-full bg-munity-green"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
            <h2 className="text-xl font-semibold text-munity-text">
              Recent activity
            </h2>
            <div className="mt-5 flex flex-col gap-4">
              {activity.map((item, index) => (
                <Link
                  key={item.title}
                  href={
                    [routes.memberHome, routes.messages, routes.resources][
                      index
                    ]
                  }
                  className="border-b border-munity-border pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-munity-text">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm text-munity-muted">
                        {item.detail}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-munity-muted">
                      {item.time}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              title: "Open messages",
              detail: "Continue with your therapist",
              href: routes.messages,
              icon: MessageCircle,
            },
            {
              title: "Browse resources",
              detail: "Guides, audio, and worksheets",
              href: routes.resources,
              icon: BookOpen,
            },
            {
              title: "Visit communities",
              detail: "See what’s new with your groups",
              href: "/Communities",
              icon: Users,
            },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="group flex items-center gap-4 rounded-[20px] border border-munity-border bg-white p-5 shadow-[0_4px_10px_rgba(85,107,47,0.05)] transition hover:border-munity-green/30 hover:bg-munity-lime/5"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-munity-lime/50">
                  <Icon className="size-5 text-munity-green" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-munity-text">
                    {action.title}
                  </p>
                  <p className="text-sm text-munity-muted">{action.detail}</p>
                </div>
                <ArrowRight className="size-4 text-munity-green opacity-0 transition group-hover:opacity-100" />
              </Link>
            );
          })}
        </section>

        <section className="overflow-hidden rounded-[20px] border border-munity-border bg-munity-green p-6 text-white shadow-[0_4px_10px_rgba(85,107,47,0.05)] sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="text-2xl font-semibold">
                Ready for today&apos;s check-in?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                A quick mood log helps your therapist spot patterns and keeps
                your streak alive.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden size-16 overflow-hidden rounded-full border-4 border-white/20 sm:block">
                <Image
                  src="/images/home-feed/alex.jpg"
                  alt="Alex Rivera"
                  fill
                  className="object-cover"
                />
              </div>
              <Link
                href={routes.memberHome}
                className="inline-flex items-center gap-2 rounded-xl bg-munity-lime px-4 py-2.5 text-sm font-semibold text-munity-olive-text transition hover:brightness-95"
              >
                Go to Home feed
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MemberAppShell>
  );
}
