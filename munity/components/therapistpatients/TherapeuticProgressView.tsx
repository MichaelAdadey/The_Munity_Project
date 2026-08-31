"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Check,
  ChevronRight,
  Download,
  TrendingUp,
} from "lucide-react";
import { TopNav } from "@/components/therapistlayout/TopNav";
import { PatientSidebar } from "@/components/therapistlayout/Sidebars";
import { CollapsibleSidebarLayout } from "@/components/therapistlayout/CollapsibleSidebarLayout";
import { SidebarProvider } from "@/components/therapistlayout/SidebarContext";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { Button } from "@/components/ui/AppButton";
import { LivePulse, LiveTicker, useLiveToast } from "@/components/live/LiveFeedback";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { useLoading } from "@/components/ui/LoadingProvider";
import { patientNavHref } from "@/lib/routes";
import type { TherapistPatient } from "@/lib/therapist/patients-queries";

const dateRanges = ["Last 30 Days", "Last 3 Months", "Last 6 Months", "Last 12 Months"];

// NOTE: everything below (GAD-7 scores, chart, attendance, themes) is illustrative sample
// data — clinical assessments and session-theme analysis aren't backed by real tables yet.
const summaryStats = [
  { label: "GAD-7 score", value: "8", detail: "Down from 14 at baseline", tone: "good" as const },
  { label: "Symptom change", value: "−42%", detail: "Since onboarding", tone: "good" as const },
  { label: "Attendance", value: "82%", detail: "16 of 20 sessions", tone: "neutral" as const },
  { label: "Mood average", value: "7.5", detail: "Last 30 days", tone: "good" as const },
];

const chartPoints = [
  { label: "Baseline", score: 14 },
  { label: "Week 4", score: 12 },
  { label: "Week 8", score: 11 },
  { label: "Week 12", score: 9 },
  { label: "Week 16", score: 8 },
  { label: "Current", score: 8 },
];

const attendanceSessions = [
  { label: "S1", attended: true },
  { label: "S2", attended: true },
  { label: "S3", attended: false },
  { label: "S4", attended: true },
  { label: "S5", attended: true },
  { label: "S6", attended: true },
  { label: "S7", attended: false },
  { label: "S8", attended: true },
  { label: "S9", attended: true },
  { label: "S10", attended: true },
];

const themes = [
  { label: "Anxiety", count: 18 },
  { label: "Work-life balance", count: 14 },
  { label: "Self-esteem", count: 12 },
  { label: "Relationships", count: 11 },
  { label: "Sleep", count: 9 },
  { label: "Boundaries", count: 8 },
  { label: "Coping strategies", count: 7 },
  { label: "Social media", count: 4 },
];

const keyShifts = [
  { text: "Improved sleep hygiene (6h → 7.5h avg)", positive: true },
  { text: "Decrease in panic frequency (2/week → 0/week)", positive: true },
  { text: "Social engagement remains a challenge area", positive: false },
];

function scoreToY(score: number, max = 21) {
  return 160 - (score / max) * 140;
}

interface TherapeuticProgressViewProps {
  patient: TherapistPatient;
}

export function TherapeuticProgressView({ patient }: TherapeuticProgressViewProps) {
  const { withLoading } = useLoading();
  const { flash } = useLiveToast();
  const [dateRange, setDateRange] = useState("Last 6 Months");
  const [exportOpen, setExportOpen] = useState(false);
  const avatar = patient.avatar;
  const maxThemeCount = themes[0]?.count ?? 1;

  function buildProgressHTML() {
    return `
      <div style="font-family:system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial;padding:20px;color:#21311b;">
        <h1 style="color:#3e5219;">Progress Report for ${patient.name}</h1>
        <p><strong>Period:</strong> ${dateRange}</p>
        <h2>Summary Stats</h2>
        <ul>
          ${summaryStats.map((s) => `<li><strong>${s.label}:</strong> ${s.value} (${s.detail})</li>`).join("")}
        </ul>
        <h2>Key Themes</h2>
        <ul>
          ${themes.map((t) => `<li>${t.label}: ${t.count} mentions</li>`).join("")}
        </ul>
        <h2>Key Shifts</h2>
        <ul>
          ${keyShifts.map((k) => `<li>${k.positive ? "✓" : "○"} ${k.text}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  function buildProgressPlainText() {
    return [
      `Progress Report for ${patient.name}`,
      `Period: ${dateRange}`,
      "",
      "Summary Stats:",
      ...summaryStats.map((s) => `- ${s.label}: ${s.value} (${s.detail})`),
      "",
      "Key Themes:",
      ...themes.map((t) => `- ${t.label}: ${t.count} mentions`),
      "",
      "Key Shifts:",
      ...keyShifts.map((k) => `${k.positive ? "✓" : "○"} ${k.text}`),
    ].join("\n");
  }

  function exportReportAsPDF() {
    if (typeof window === "undefined") return;
    const content = buildProgressHTML();
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Progress Report</title><style>body{font-family:system-ui,-apple-system,sans-serif;padding:20px;color:#21311b;}h1{color:#3e5219;}h2{margin-top:16px;}</style></head><body>${content}</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url);
    if (w) {
      setTimeout(() => {
        w.print();
      }, 250);
    }
  }

  function exportReportAsWord() {
    if (typeof window === "undefined") return;
    const content = buildProgressHTML();
    const html = `<html xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"/><title>Progress Report</title><style>body{font-family:Calibri,sans-serif;line-height:1.5;}h1{color:#3e5219;margin-bottom:10px;}h2{margin-top:16px;margin-bottom:8px;}p{margin:6px 0;}</style></head><body>${content}</body></html>`;
    const blob = new Blob([html], { type: "application/vnd.ms-word" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${patient.name.replace(/\\s+/g, "_")}_progress_report.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function emailReport() {
    if (typeof window === "undefined") return;
    const text = buildProgressPlainText();
    const subject = `Progress Report for ${patient.name}`;
    const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    window.location.href = mailto;
  }

  const linePoints = chartPoints
    .map((point, index) => {
      const x = (index / (chartPoints.length - 1)) * 500;
      const y = scoreToY(point.score);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <SidebarProvider storageKey="munity-patient-sidebar-open">
      <div className="min-h-screen bg-munity-bg">
        <TopNav active="Patients" showSearch />

        <div className="w-full pt-16">
          <CollapsibleSidebarLayout
            sidebar={
              <PatientSidebar
                active="Progress"
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
            <AnimatedPage className="flex flex-col gap-8">
              <header className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-munity-muted">
                    Insights
                  </p>
                  <h1 className="mt-2 text-3xl font-bold text-munity-text">Progress</h1>
                  <p className="mt-1 text-base text-munity-muted">
                    Symptom trends and session outcomes for {patient.name}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <DropdownMenu value={dateRange} options={dateRanges} onChange={setDateRange} />
                  <div className="relative">
                    <Button onClick={() => setExportOpen((s) => !s)}>
                      <Download className="size-3.5" />
                      Export report
                    </Button>
                    {exportOpen && (
                      <div className="absolute right-0 z-10 mt-2 w-48 rounded-xl border border-munity-border bg-white p-2 shadow-lg">
                        <button
                          type="button"
                          onClick={() => {
                            withLoading(async () => {
                              exportReportAsPDF();
                              await new Promise((resolve) => setTimeout(resolve, 500));
                            }, "Exporting as PDF...");
                            setExportOpen(false);
                          }}
                          className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-munity-sidebar"
                        >
                          Export as PDF
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            withLoading(async () => {
                              exportReportAsWord();
                              await new Promise((resolve) => setTimeout(resolve, 300));
                            }, "Exporting as Word...");
                            setExportOpen(false);
                          }}
                          className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-munity-sidebar"
                        >
                          Export as Word
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            emailReport();
                            setExportOpen(false);
                          }}
                          className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-munity-sidebar"
                        >
                          Email report
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </header>

              <LiveTicker items={[`${patient.name}'s GAD-7 score is stable at 8.`, "Attendance updated after the latest session."]} />

              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {summaryStats.map((stat, index) => (
                  <motion.article
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="rounded-[20px] border border-munity-border bg-white p-5 shadow-[0_4px_10px_rgba(85,107,47,0.05)]"
                  >
                    <p className="text-xs font-bold uppercase tracking-wide text-munity-muted">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-munity-text">{stat.value}</p>
                    <p
                      className={`mt-1 text-sm ${
                        stat.tone === "good" ? "text-munity-green" : "text-munity-muted"
                      }`}
                    >
                      {stat.detail}
                    </p>
                  </motion.article>
                ))}
              </section>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
                <section className="rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)] xl:col-span-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold text-munity-text">Anxiety over time</h2>
                      <p className="mt-1 text-sm text-munity-muted">
                        Self-reported GAD-7 scores from weekly check-ins
                      </p>
                    </div>
                    <LivePulse label="Improving" />
                  </div>

                  <div className="relative mt-8 h-56">
                    <div className="absolute inset-y-0 left-0 flex w-8 flex-col justify-between text-xs text-munity-muted">
                      <span>21</span>
                      <span>14</span>
                      <span>7</span>
                      <span>0</span>
                    </div>
                    <svg
                      viewBox="0 0 500 180"
                      className="absolute inset-0 ml-8 h-full w-[calc(100%-2rem)]"
                      preserveAspectRatio="none"
                      aria-hidden
                    >
                      <line x1="0" y1="20" x2="500" y2="20" stroke="#e4e4cc" strokeWidth="1" />
                      <line x1="0" y1="80" x2="500" y2="80" stroke="#e4e4cc" strokeWidth="1" />
                      <line x1="0" y1="140" x2="500" y2="140" stroke="#e4e4cc" strokeWidth="1" />
                      <polyline
                        fill="none"
                        stroke="#c5c8b8"
                        strokeWidth="2"
                        strokeDasharray="6 4"
                        points="0,20 100,20 200,20 300,20 400,20 500,20"
                        transform="translate(0, 46)"
                      />
                      <polyline
                        fill="none"
                        stroke="#3e5219"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={linePoints}
                      />
                      {chartPoints.map((point, index) => {
                        const x = (index / (chartPoints.length - 1)) * 500;
                        const y = scoreToY(point.score);
                        return <circle key={point.label} cx={x} cy={y} r="5" fill="#3e5219" />;
                      })}
                    </svg>
                  </div>

                  <div className="mt-3 flex justify-between pl-8 text-xs font-medium text-munity-muted">
                    {chartPoints.map((point) => (
                      <span key={point.label}>{point.label}</span>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-munity-border pt-5">
                    <p className="text-sm text-munity-muted">
                      Baseline was{" "}
                      <span className="font-semibold text-munity-text">14</span> · Current is{" "}
                      <span className="font-semibold text-munity-green">8</span>
                    </p>
                    <Link
                      href={patientNavHref(patient.slug, "Clinical Notes")}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-munity-green hover:underline"
                    >
                      View session notes
                      <ChevronRight className="size-4" />
                    </Link>
                  </div>
                </section>

                <section className="rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)] xl:col-span-2">
                  <h2 className="text-xl font-semibold text-munity-text">Attendance</h2>
                  <p className="mt-1 text-sm text-munity-muted">Last 10 scheduled sessions</p>

                  <div className="mt-6 flex items-end justify-between gap-2">
                    {attendanceSessions.map((session, index) => (
                      <div key={session.label} className="flex flex-1 flex-col items-center gap-2">
                        <motion.div
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ delay: index * 0.04, duration: 0.35 }}
                          style={{ originY: 1 }}
                          className={`h-24 w-full max-w-[28px] rounded-t-lg ${
                            session.attended ? "bg-munity-green" : "bg-[#ffdad6]"
                          }`}
                        />
                        <span className="text-[10px] font-semibold text-munity-muted">
                          {session.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-medium text-munity-muted">Completion rate</span>
                      <span className="font-semibold text-munity-green">82%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-munity-divider">
                      <div className="h-full w-[82%] rounded-full bg-munity-green" />
                    </div>
                    <div className="mt-4 flex gap-4 text-xs text-munity-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="size-2.5 rounded-sm bg-munity-green" />
                        Attended
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="size-2.5 rounded-sm bg-[#ffdad6]" />
                        Missed
                      </span>
                    </div>
                  </div>
                </section>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <section className="rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-5 text-munity-green" />
                    <h2 className="text-xl font-semibold text-munity-text">Baseline comparison</h2>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-munity-sidebar/60 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-munity-muted">
                        Onboarding
                      </p>
                      <p className="mt-2 text-lg font-semibold text-munity-text">Severely low</p>
                      <p className="mt-1 text-sm text-munity-muted">Mood · Oct 2023</p>
                    </div>
                    <div className="rounded-2xl border border-munity-green/20 bg-munity-lime/30 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-munity-muted">
                        Current
                      </p>
                      <p className="mt-2 text-lg font-semibold text-munity-green">Stable / positive</p>
                      <p className="mt-1 text-sm text-munity-muted">Mood · Today</p>
                    </div>
                  </div>

                  <ul className="mt-6 space-y-3">
                    {keyShifts.map((item) => (
                      <li
                        key={item.text}
                        className="flex items-start gap-3 rounded-2xl border border-munity-border bg-munity-sidebar/30 px-4 py-3 text-sm text-munity-text"
                      >
                        {item.positive ? (
                          <Check className="mt-0.5 size-4 shrink-0 text-munity-green" />
                        ) : (
                          <span className="mt-0.5 size-4 shrink-0 text-center text-munity-muted">
                            ·
                          </span>
                        )}
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
                  <h2 className="text-xl font-semibold text-munity-text">Session themes</h2>
                  <p className="mt-1 text-sm text-munity-muted">
                    Topics most often discussed in recent notes
                  </p>

                  <div className="mt-6 flex flex-col gap-3">
                    {themes.map((theme, index) => (
                      <div key={theme.label} className="flex items-center gap-3">
                        <span className="w-36 shrink-0 truncate text-sm font-medium text-munity-text">
                          {theme.label}
                        </span>
                        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-munity-divider">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(theme.count / maxThemeCount) * 100}%` }}
                            transition={{ delay: index * 0.04, duration: 0.45 }}
                            className="h-full rounded-full bg-munity-green"
                          />
                        </div>
                        <span className="w-6 text-right text-xs font-semibold text-munity-muted">
                          {theme.count}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="mt-6 rounded-2xl bg-munity-sidebar/50 px-4 py-3 text-sm leading-relaxed text-munity-muted">
                    Self-esteem mentions are up{" "}
                    <span className="font-semibold text-munity-green">30%</span> this month, often
                    alongside relationship progress.
                  </p>
                </section>
              </div>
            </AnimatedPage>
          </CollapsibleSidebarLayout>
        </div>
      </div>
    </SidebarProvider>
  );
}
