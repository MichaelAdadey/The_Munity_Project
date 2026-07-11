"use client";

import Link from "next/link";
import { useState, type ElementType } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Heart,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { AdminAppShell } from "@/components/admin/AdminAppShell";
import { LiveTicker, liveFadeUp, liveStagger, useLiveToast } from "@/components/live/LiveFeedback";
import { useMockStore } from "@/lib/mock-store";
import { routes } from "@/lib/routes";

const kpis: {
  label: string;
  value: string;
  trend: string;
  trendTone: "up" | "down" | "alert";
  icon: ElementType;
  alert?: boolean;
}[] = [
  {
    label: "Total Active Users",
    value: "24,892",
    trend: "+12%",
    trendTone: "up",
    icon: Users,
  },
  {
    label: "New Signups (7D)",
    value: "1,402",
    trend: "+5.2%",
    trendTone: "up",
    icon: UserPlus,
  },
  {
    label: "Sessions Booked",
    value: "3,120",
    trend: "+8%",
    trendTone: "up",
    icon: Calendar,
  },
  {
    label: "Engagement Rate",
    value: "68.5%",
    trend: "-1.4%",
    trendTone: "down",
    icon: Heart,
  },
  {
    label: "Safety Reports",
    value: "42",
    trend: "High Priority",
    trendTone: "alert",
    icon: AlertTriangle,
    alert: true,
  },
];

const growthMonthly = [
  { month: "JAN", growth: 42, retention: 58 },
  { month: "FEB", growth: 48, retention: 62 },
  { month: "MAR", growth: 55, retention: 60 },
  { month: "APR", growth: 68, retention: 70 },
  { month: "MAY", growth: 78, retention: 74 },
  { month: "JUN", growth: 92, retention: 82 },
];

const growthWeekly = [
  { month: "W1", growth: 50, retention: 60 },
  { month: "W2", growth: 58, retention: 64 },
  { month: "W3", growth: 66, retention: 68 },
  { month: "W4", growth: 74, retention: 72 },
  { month: "W5", growth: 82, retention: 76 },
  { month: "W6", growth: 90, retention: 80 },
];

const sessionTypes = [
  { label: "Video Call", percent: 45, color: "#3e5219" },
  { label: "Audio Chat", percent: 30, color: "#56642b" },
  { label: "Text Message", percent: 25, color: "#bdce89" },
];

const communities = [
  { name: "Anxiety Peer Support", members: "8.4k members", width: "95%", color: "#3e5219" },
  { name: "Depression & Resilience", members: "6.1k members", width: "75%", color: "#b6d088" },
  { name: "Post-Traumatic Growth", members: "4.8k members", width: "60%", color: "#56642b" },
  { name: "Mindfulness & Meditators", members: "4.2k members", width: "55%", color: "#bdce89" },
];

const alerts = [
  {
    title: "Critical Flag: User #829",
    body: "Potential high-risk trigger detected in 'Depression' community.",
    time: "12m ago",
    tone: "critical" as const,
    icon: AlertTriangle,
  },
  {
    title: "API Usage Spike",
    body: "System performance remains stable at 90% load.",
    time: "45m ago",
    tone: "warning" as const,
    icon: Zap,
  },
  {
    title: "New Therapist Verified",
    body: "Dr. Aris Thorne has completed credential review.",
    time: "2h ago",
    tone: "success" as const,
    icon: CheckCircle2,
  },
];

function GrowthChart({ range }: { range: "Weekly" | "Monthly" }) {
  const data = range === "Monthly" ? growthMonthly : growthWeekly;
  const width = 640;
  const height = 260;
  const padX = 16;
  const padY = 20;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2 - 20;

  const toPoints = (key: "growth" | "retention") =>
    data
      .map((entry, index) => {
        const x = padX + (index / (data.length - 1)) * chartW;
        const y = padY + chartH - (entry[key] / 100) * chartH;
        return `${x},${y}`;
      })
      .join(" ");

  return (
    <div className="relative h-[280px] w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" role="img" aria-label="User growth and retention">
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = padY + chartH * ratio;
          return (
            <line
              key={ratio}
              x1={padX}
              x2={width - padX}
              y1={y}
              y2={y}
              stroke="#c5c8b8"
              strokeOpacity={0.35}
            />
          );
        })}
        <polyline
          points={toPoints("retention")}
          fill="none"
          stroke="#bdce89"
          strokeWidth={2.5}
          strokeDasharray="6 6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points={toPoints("growth")}
          fill="none"
          stroke="#3e5219"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((entry, index) => {
          const x = padX + (index / (data.length - 1)) * chartW;
          const y = padY + chartH - (entry.growth / 100) * chartH;
          return <circle key={entry.month} cx={x} cy={y} r={4} fill="#d6e7a1" stroke="#3e5219" strokeWidth={2} />;
        })}
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex justify-between px-2">
        {data.map((entry) => (
          <span key={entry.month} className="w-full text-center text-[10px] font-medium text-munity-muted">
            {entry.month}
          </span>
        ))}
      </div>
    </div>
  );
}

function SessionDonut() {
  const size = 160;
  const stroke = 18;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative mx-auto size-40">
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90 size-full" aria-hidden>
        {sessionTypes.map((segment, index) => {
          const length = (segment.percent / 100) * circumference;
          const dash = `${length} ${circumference - length}`;
          const currentOffset = sessionTypes
            .slice(0, index)
            .reduce((total, previous) => total + (previous.percent / 100) * circumference, 0);
          return (
            <circle
              key={segment.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={stroke}
              strokeDasharray={dash}
              strokeDashoffset={-currentOffset}
              strokeLinecap="butt"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-2xl font-bold text-munity-green">3.1k</p>
        <p className="text-[10px] font-bold uppercase text-munity-muted">Total Sessions</p>
      </div>
    </div>
  );
}

function AdminDashboardContent() {
  const { reports } = useMockStore();
  const [range, setRange] = useState<"Weekly" | "Monthly">("Monthly");
  const { flash } = useLiveToast();
  const dashboardKpis = kpis.map((kpi) =>
    kpi.label === "Safety Reports"
      ? { ...kpi, value: String(reports.filter((report) => report.status !== "Resolved").length) }
      : kpi,
  );

  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-6">
        <LiveTicker
          items={[
            "18 members joined community conversations in the last hour.",
            "Dr. Aris Thorne completed therapist verification.",
            "Three moderation reports moved into review.",
            "Session bookings are up 8% from this time last week.",
          ]}
        />
        {/* KPI row */}
        <motion.section
          variants={liveStagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5"
        >
          {dashboardKpis.map(({ label, value, trend, trendTone, icon: Icon, alert }) => (
            <motion.article
              key={label}
              variants={liveFadeUp}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className={`rounded-[20px] border p-5 shadow-[0px_4px_20px_rgba(85,107,47,0.05)] backdrop-blur-sm ${
                alert
                  ? "border-[rgba(186,26,26,0.2)] bg-[rgba(255,218,214,0.1)]"
                  : "border-[#e5e5e1] bg-white/70"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div
                  className={`flex size-10 items-center justify-center rounded-xl ${
                    alert ? "bg-[#ffdad6] text-[#ba1a1a]" : "bg-munity-lime/60 text-munity-green"
                  }`}
                >
                  <Icon className="size-5" />
                </div>
                <span
                  className={`text-xs font-bold ${
                    trendTone === "up"
                      ? "text-[#56642b]"
                      : trendTone === "down" || trendTone === "alert"
                        ? "text-[#ba1a1a]"
                        : "text-munity-muted"
                  }`}
                >
                  {trend}
                </span>
              </div>
              <p className="mt-3 text-base uppercase tracking-[0.8px] text-munity-muted">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-munity-text">{value}</p>
            </motion.article>
          ))}
        </motion.section>

        {/* Charts row */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <article className="rounded-[20px] border border-[#e5e5e1] bg-white/70 p-6 shadow-[0px_4px_20px_rgba(85,107,47,0.05)] xl:col-span-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-munity-text">User Growth & Retention</h2>
                <p className="mt-1 text-base text-munity-muted">
                  Data visualized over the last 6 months
                </p>
              </div>
              <div className="flex gap-2">
                {(["Weekly", "Monthly"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setRange(option);
                      flash(`Growth chart updated to ${option.toLowerCase()} data.`);
                    }}
                    className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
                      range === option
                        ? "bg-munity-green text-white shadow-sm"
                        : "bg-[#eae8e7] text-munity-text hover:bg-munity-lime/50"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <GrowthChart range={range} />
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-xs font-medium text-munity-muted">
              <span className="inline-flex items-center gap-2">
                <span className="h-0.5 w-4 bg-munity-green" /> Growth
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-0.5 w-4 border-t-2 border-dashed border-[#bdce89]" /> Retention
              </span>
            </div>
          </article>

          <article className="rounded-[20px] border border-[#e5e5e1] bg-white/70 p-6 shadow-[0px_4px_20px_rgba(85,107,47,0.05)] xl:col-span-4">
            <h2 className="text-2xl font-semibold text-munity-text">Session Types</h2>
            <p className="mt-1 text-base text-munity-muted">Preferred mode of therapy</p>
            <div className="mt-8 flex flex-col items-center gap-8">
              <SessionDonut />
              <div className="flex w-full flex-col gap-2">
                {sessionTypes.map((type) => (
                  <div key={type.label} className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-munity-text">
                      <span
                        className="size-3 rounded-full"
                        style={{ backgroundColor: type.color }}
                      />
                      {type.label}
                    </span>
                    <span className="text-sm font-semibold tracking-wide text-munity-muted">
                      {type.percent}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </section>

        {/* Bottom row */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <article className="rounded-[20px] border border-[#e5e5e1] bg-white/70 p-6 shadow-[0px_4px_20px_rgba(85,107,47,0.05)] xl:col-span-4">
            <h2 className="text-2xl font-semibold text-munity-text">Platform Health</h2>
            <div className="mt-6 flex flex-col gap-4">
              <div className="flex items-center justify-between rounded-2xl bg-[#f5f3f3] p-4">
                <div className="flex items-center gap-3">
                  <span className="size-2 rounded-full bg-[#1b5e20]" />
                  <div>
                    <p className="text-sm font-semibold tracking-wide text-munity-text">
                      Server Status
                    </p>
                    <p className="text-[10px] text-munity-muted">Global uptime: 99.98%</p>
                  </div>
                </div>
                <p className="text-xs font-bold text-munity-green">Optimal</p>
              </div>

              <div className="rounded-2xl bg-[#f5f3f3] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold tracking-wide text-munity-text">
                    Mod Response Time
                  </p>
                  <p className="text-sm font-semibold tracking-wide text-munity-green">12m 4s</p>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#efeded]">
                  <div className="h-full w-[85%] rounded-full bg-munity-green" />
                </div>
              </div>

              <div className="rounded-2xl bg-[#f5f3f3] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold tracking-wide text-munity-text">
                    Therapist Availability
                  </p>
                  <p className="text-sm font-semibold tracking-wide text-[#56642b]">92%</p>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#efeded]">
                  <div className="h-full w-[92%] rounded-full bg-[#56642b]" />
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-[20px] border border-[#e5e5e1] bg-white/70 p-6 shadow-[0px_4px_20px_rgba(85,107,47,0.05)] xl:col-span-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-2xl font-semibold leading-tight text-munity-text">
                Most Active Communities
              </h2>
              <Link
                href={routes.adminCommunities}
                className="shrink-0 text-sm font-semibold tracking-wide text-munity-green hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="mt-6 flex flex-col gap-5">
              {communities.map((community) => (
                <div key={community.name}>
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <p className="text-xs text-munity-text">{community.name}</p>
                    <p className="text-xs text-munity-muted">{community.members}</p>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-[#efeded]">
                    <div
                      className="h-full rounded-full"
                      style={{ width: community.width, backgroundColor: community.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[20px] border border-[#e5e5e1] bg-white/70 p-6 shadow-[0px_4px_20px_rgba(85,107,47,0.05)] xl:col-span-3">
            <h2 className="text-2xl font-semibold text-munity-text">Recent Alerts</h2>
            <div className="mt-4 flex flex-col gap-4">
              {alerts.map((alert) => {
                const Icon = alert.icon;
                return (
                  <div
                    key={alert.title}
                    className="flex gap-3 border-b border-[rgba(197,200,184,0.3)] pb-3 last:border-b-0 last:pb-0"
                  >
                    <div
                      className={`mt-1 flex size-8 shrink-0 items-center justify-center rounded-full ${
                        alert.tone === "critical"
                          ? "bg-[rgba(255,218,214,0.3)] text-[#ba1a1a]"
                          : alert.tone === "warning"
                            ? "bg-[#fff3cd] text-[#8a6d00]"
                            : "bg-munity-lime/50 text-munity-green"
                      }`}
                    >
                      <Icon className="size-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold tracking-wide text-munity-text">{alert.title}</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-munity-muted">{alert.body}</p>
                      <p className="mt-1 text-[10px] font-medium text-munity-muted/70">{alert.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        </section>
    </div>
  );
}

export function AdminDashboardView({ adminName }: { adminName: string }) {
  return (
    <AdminAppShell adminName={adminName}>
      <AdminDashboardContent />
    </AdminAppShell>
  );
}
