"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Check,
  ChevronRight,
  Download,
  Frown,
  Info,
  Smile,
} from "lucide-react";
import { TopNav } from "@/components/layout/TopNav";
import { PatientSidebar } from "@/components/layout/Sidebars";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { Button } from "@/components/ui/AppButton";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { useLoading } from "@/components/ui/LoadingProvider";
import { assets } from "@/lib/assets";
import type { PatientRecord } from "@/lib/routes";
import { patientNavHref, routes } from "@/lib/routes";

const dateRanges = ["Last 30 Days", "Last 3 Months", "Last 6 Months", "Last 12 Months"];

const themeTags = [
  { label: "Anxiety", className: "bg-munity-green text-white text-lg font-bold px-4 py-2" },
  { label: "Work-life balance", className: "bg-munity-lime text-munity-olive-text text-base font-semibold px-3 py-1" },
  { label: "Sleep", className: "bg-munity-divider text-munity-muted text-sm px-3 py-1" },
  { label: "Self-esteem", className: "bg-[#646552] text-[#e2e3ca] text-xl font-extrabold px-5 py-3" },
  { label: "Boundaries", className: "bg-munity-divider text-munity-muted text-sm px-3 py-1" },
  { label: "Relationships", className: "bg-[#d9eaa3] text-[#161f00] text-base font-medium px-4 py-2" },
  { label: "Phobias", className: "bg-munity-divider text-munity-muted text-xs px-2 py-1" },
  { label: "Coping strategies", className: "bg-munity-olive text-munity-lime-light text-sm font-semibold px-3 py-1" },
  { label: "Social media", className: "bg-[#4c4d3b] text-white text-base px-4 py-2" },
];

const attendanceBars = [
  { h: "h-[185px]", color: "bg-munity-olive" },
  { h: "h-full", color: "bg-munity-olive" },
  { h: "h-[41px]", color: "bg-[#ffdad6]" },
  { h: "h-[175px]", color: "bg-munity-olive" },
  { h: "h-[196px]", color: "bg-munity-olive" },
  { h: "h-full", color: "bg-munity-olive" },
  { h: "h-[62px]", color: "bg-munity-divider" },
  { h: "h-[185px]", color: "bg-munity-olive" },
];

interface TherapeuticProgressViewProps {
  patient: PatientRecord;
}

export function TherapeuticProgressView({ patient }: TherapeuticProgressViewProps) {
  const { withLoading } = useLoading();
  const [dateRange, setDateRange] = useState("Last 6 Months");
  const avatar = assets.avatars[patient.avatarKey];

  return (
    <div className="min-h-screen bg-munity-bg">
      <TopNav active="Analytics" showSearch />

      <div className="flex w-full pt-16">
        <PatientSidebar
          active="Progress"
          patientSlug={patient.slug}
          patient={{
            name: patient.name,
            clientId: patient.clientId,
            avatar,
          }}
        />

        <AnimatedPage className="flex-1 px-10 pb-24 pt-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <nav className="mb-1 flex items-center gap-2 text-xs font-medium text-munity-muted">
                <Link href={routes.dashboard} className="hover:text-munity-green">
                  Patients
                </Link>
                <ChevronRight className="size-3" />
                <Link href={patientNavHref(patient.slug, "Overview")} className="hover:text-munity-green">
                  {patient.name}
                </Link>
                <ChevronRight className="size-3" />
                <span className="font-bold text-munity-green">Progress Tracking</span>
              </nav>
              <h1 className="text-[32px] font-bold text-munity-text">Therapeutic Progress</h1>
            </div>
            <div className="flex gap-3">
              <DropdownMenu value={dateRange} options={dateRanges} onChange={setDateRange} />
              <Button
                onClick={() =>
                  withLoading(async () => {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                  }, "Generating report...")
                }
              >
                <Download className="size-3" />
                Export Report
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <section className="col-span-12 rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_20px_rgba(85,107,47,0.05)] lg:col-span-8">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-munity-text">
                    Anxiety Levels over Time
                  </h2>
                  <p className="text-sm font-semibold tracking-wide text-munity-muted">
                    Self-reported GAD-7 scores from weekly check-ins
                  </p>
                </div>
                <div className="flex gap-4 text-xs font-medium">
                  <span className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-munity-green" />
                    Current
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-munity-input-border" />
                    Baseline
                  </span>
                </div>
              </div>

              <div className="relative mt-6 h-52">
                <div className="absolute inset-0 flex flex-col justify-between text-xs text-munity-muted">
                  <span>21</span>
                  <span>14</span>
                  <span>7</span>
                  <span>0</span>
                </div>
                <svg
                  viewBox="0 0 500 180"
                  className="absolute inset-0 ml-8 h-full w-[calc(100%-2rem)]"
                  preserveAspectRatio="none"
                >
                  <line x1="0" y1="20" x2="500" y2="20" stroke="#c5c8b8" strokeDasharray="4" />
                  <line x1="0" y1="80" x2="500" y2="80" stroke="#c5c8b8" strokeDasharray="4" />
                  <line x1="0" y1="140" x2="500" y2="140" stroke="#c5c8b8" strokeDasharray="4" />
                  <polyline
                    fill="none"
                    stroke="#c5c8b8"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    points="0,30 100,35 200,40 300,38 400,36 500,34"
                  />
                  <polyline
                    fill="none"
                    stroke="#3e5219"
                    strokeWidth="2.5"
                    points="0,25 100,55 200,90 300,110 400,130 500,145"
                  />
                  <circle cx="500" cy="145" r="5" fill="#3e5219" />
                  <circle cx="0" cy="25" r="5" fill="#3e5219" />
                </svg>
              </div>

              <div className="mt-2 flex justify-between px-12 text-xs font-medium text-munity-muted">
                {["Baseline", "Week 4", "Week 8", "Week 12", "Week 16", "Current"].map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-munity-input-border/30 pt-6">
                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-munity-lime px-3 py-1 text-xs font-bold text-munity-olive-text">
                    -42% Improvement
                  </span>
                  <span className="text-xs font-medium text-munity-muted">
                    since onboarding (Oct 2023)
                  </span>
                </div>
                <Link
                  href={patientNavHref(patient.slug, "Clinical Notes")}
                  className="flex items-center gap-1 text-sm font-bold text-munity-green"
                >
                  View session notes
                  <ChevronRight className="size-2.5" />
                </Link>
              </div>
            </section>

            <section className="col-span-12 rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)] lg:col-span-4">
              <h2 className="text-2xl font-semibold text-munity-text">Attendance</h2>
              <p className="text-sm font-semibold tracking-wide text-munity-muted">
                Completion rate for last 10 sessions
              </p>
              <div className="mt-6 flex h-48 items-end justify-center gap-3 px-2">
                {attendanceBars.map((bar, i) => (
                  <motion.div
                    key={`${dateRange}-${i}`}
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    className={`w-[18px] rounded-t-lg ${bar.color} ${bar.h}`}
                  />
                ))}
              </div>
              <div className="mt-6">
                <div className="mb-2 flex justify-between text-sm font-semibold">
                  <span className="text-munity-muted">Sessions Completed</span>
                  <span className="text-munity-green">82%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-munity-divider">
                  <div className="h-full w-[82%] rounded-full bg-munity-green" />
                </div>
                <p className="mt-3 text-[11px] italic leading-relaxed text-munity-muted">
                  Consistent attendance correlates with rapid symptom reduction in recent weeks.
                </p>
              </div>
            </section>

            <section className="col-span-12 rounded-[20px] border border-munity-input-border/20 bg-munity-sidebar p-6 lg:col-span-5">
              <h2 className="text-2xl font-semibold text-munity-text">Baseline Comparison</h2>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white p-4">
                  <p className="text-xs font-medium text-munity-muted">Onboarding Mood</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Frown className="size-5 text-red-400" />
                    <span className="font-bold">Severely Low</span>
                  </div>
                </div>
                <div className="rounded-xl border border-munity-green/20 bg-white p-4">
                  <p className="text-xs font-medium text-munity-muted">Current Mood</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Smile className="size-5 text-munity-green" />
                    <span className="font-bold">Stable / Positive</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 rounded-xl border border-dashed border-munity-gray bg-white/50 p-4">
                <h4 className="text-sm font-bold tracking-wide text-munity-text">Key Shifts</h4>
                <ul className="mt-3 space-y-3">
                  {[
                    "Improved sleep hygiene (6h → 7.5h avg)",
                    "Decrease in panic frequency (2/week → 0/week)",
                    "Social engagement remains a challenge area",
                  ].map((item, i) => (
                    <li key={item} className="flex items-start gap-3 text-sm font-semibold">
                      {i < 2 ? (
                        <Check className="mt-0.5 size-4 shrink-0 text-munity-green" />
                      ) : (
                        <span className="mt-0.5 size-4 shrink-0 text-center text-munity-muted">…</span>
                      )}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="col-span-12 rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)] lg:col-span-7">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-munity-text">
                  Commonly Discussed Themes
                </h2>
                <Info className="size-5 text-munity-muted" />
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {themeTags.map((tag) => (
                  <span key={tag.label} className={`rounded-full ${tag.className}`}>
                    {tag.label}
                  </span>
                ))}
              </div>
              <div className="mt-6 rounded-xl bg-munity-sidebar p-4">
                <p className="text-sm font-semibold italic leading-relaxed text-munity-muted">
                  &quot;Self-esteem&quot; has increased in frequency by{" "}
                  <strong className="font-bold not-italic text-munity-green">30%</strong> in the
                  last month, often co-occurring with positive developments in &quot;Relationships&quot;.
                </p>
              </div>
            </section>

            <section className="col-span-12 rounded-[20px] border border-munity-border bg-white p-8 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <h2 className="text-2xl font-semibold text-munity-text">
                    Patient Reflection Snapshot
                  </h2>
                  <p className="mt-2 text-sm font-semibold tracking-wide text-munity-muted">
                    Interactive slider showing the patient&apos;s current self-perception relative to
                    the last clinical assessment.
                  </p>
                </div>
                <div>
                  <div className="mb-3 flex justify-between text-sm font-bold">
                    <span>Feelings of Stability</span>
                    <span className="text-munity-green">7.5 / 10</span>
                  </div>
                  <div className="relative h-2 rounded bg-munity-lime">
                    <div
                      className="absolute -top-1 size-6 rounded-xl bg-munity-green shadow-[0_0_10px_rgba(62,82,25,0.2)]"
                      style={{ left: "75%" }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] font-bold uppercase text-munity-muted">
                    <span>Turbulent</span>
                    <span>Grounded</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </AnimatedPage>
      </div>
    </div>
  );
}
