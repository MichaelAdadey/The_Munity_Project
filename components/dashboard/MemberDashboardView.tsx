"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Flame,
  MessageCircle,
  Sparkles,
  Stethoscope,
  TrendingUp,
  Users,
} from "lucide-react";
import { MemberAppShell } from "@/components/memberlayout/MemberAppShell";
import { routes } from "@/lib/routes";

const stats = [
  {
    label: "Day streak",
    value: "12",
    detail: "Keep going — you’re on a roll",
    icon: Flame,
  },
  {
    label: "Mood average",
    value: "7.4",
    detail: "+0.6 vs last week",
    icon: TrendingUp,
  },
  {
    label: "Sessions done",
    value: "8",
    detail: "2 remaining this month",
    icon: Stethoscope,
  },
  {
    label: "Communities",
    value: "4",
    detail: "3 new posts today",
    icon: Users,
  },
];

const weekMood = [
  { day: "Mon", score: 6 },
  { day: "Tue", score: 7 },
  { day: "Wed", score: 5 },
  { day: "Thu", score: 8 },
  { day: "Fri", score: 7 },
  { day: "Sat", score: 8 },
  { day: "Sun", score: 9 },
];

const upcoming = [
  {
    title: "Video session with Dr. Sarah Jenkins",
    time: "Today · 2:00 PM",
    type: "Therapy",
    href: "/Therapy",
  },
  {
    title: "Anxiety Peer Support check-in",
    time: "Tomorrow · 6:30 PM",
    type: "Community",
    href: "/Communities",
  },
];

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

export function MemberDashboardView() {
  const maxMood = Math.max(...weekMood.map((d) => d.score));

  return (
    <MemberAppShell>
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-munity-muted">
              Overview
            </p>
            <h1 className="mt-2 text-3xl font-bold text-munity-text">
              Welcome back, Alex
            </h1>
            <p className="mt-1 text-base text-munity-muted">
              Here’s how your wellness journey is going this week.
            </p>
          </div>
          <Link
            href="/Therapy"
            className="inline-flex items-center gap-2 rounded-xl bg-munity-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-munity-green-dark"
          >
            <Calendar className="size-4" />
            Book a session
          </Link>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.article
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="rounded-[20px] border border-munity-border bg-white p-5 shadow-[0_4px_10px_rgba(85,107,47,0.05)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-munity-muted">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-munity-text">{stat.value}</p>
                    <p className="mt-1 text-sm text-munity-green">{stat.detail}</p>
                  </div>
                  <div className="flex size-10 items-center justify-center rounded-xl bg-munity-lime/50">
                    <Icon className="size-5 text-munity-green" />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          <section className="rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)] xl:col-span-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-munity-text">Weekly mood</h2>
                <p className="mt-1 text-sm text-munity-muted">
                  Self-reported check-ins from the last 7 days
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-munity-lime/50 px-3 py-1 text-xs font-semibold text-munity-olive-text">
                <Sparkles className="size-3.5" />
                Trending up
              </span>
            </div>

            <div className="mt-8 flex h-40 items-end justify-between gap-3">
              {weekMood.map((day, index) => (
                <div key={day.day} className="flex flex-1 flex-col items-center gap-2">
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.35 }}
                    style={{ originY: 1, height: `${(day.score / maxMood) * 100}%` }}
                    className="w-full max-w-[36px] rounded-t-lg bg-munity-green"
                  />
                  <span className="text-xs font-semibold text-munity-muted">{day.day}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)] xl:col-span-2">
            <h2 className="text-xl font-semibold text-munity-text">Upcoming</h2>
            <p className="mt-1 text-sm text-munity-muted">Sessions and community events</p>
            <div className="mt-5 flex flex-col gap-3">
              {upcoming.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="rounded-2xl border border-munity-border bg-munity-sidebar/40 p-4 transition hover:border-munity-green/30 hover:bg-munity-lime/10"
                >
                  <p className="text-xs font-bold uppercase tracking-wide text-munity-green">
                    {item.type}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-munity-text">{item.title}</p>
                  <p className="mt-1 text-xs text-munity-muted">{item.time}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
            <h2 className="text-xl font-semibold text-munity-text">This week’s goals</h2>
            <div className="mt-5 flex flex-col gap-4">
              {goals.map((goal) => (
                <div key={goal.title}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {goal.done ? (
                        <CheckCircle2 className="size-4 text-munity-green" />
                      ) : (
                        <span className="size-4 rounded-full border-2 border-munity-divider" />
                      )}
                      <p className="text-sm font-medium text-munity-text">{goal.title}</p>
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
              ))}
            </div>
          </section>

          <section className="rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
            <h2 className="text-xl font-semibold text-munity-text">Recent activity</h2>
            <div className="mt-5 flex flex-col gap-4">
              {activity.map((item) => (
                <div
                  key={item.title}
                  className="border-b border-munity-border pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-munity-text">{item.title}</p>
                      <p className="mt-1 text-sm text-munity-muted">{item.detail}</p>
                    </div>
                    <span className="shrink-0 text-xs text-munity-muted">{item.time}</span>
                  </div>
                </div>
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
                  <p className="font-semibold text-munity-text">{action.title}</p>
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
              <h2 className="text-2xl font-semibold">Ready for today’s check-in?</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                A quick mood log helps your therapist spot patterns and keeps your streak alive.
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
