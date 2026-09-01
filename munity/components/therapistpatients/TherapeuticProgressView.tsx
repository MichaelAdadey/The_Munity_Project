"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Download,
  FileText,
} from "lucide-react";
import { TopNav } from "@/components/therapistlayout/TopNav";
import { PatientSidebar } from "@/components/therapistlayout/Sidebars";
import { CollapsibleSidebarLayout } from "@/components/therapistlayout/CollapsibleSidebarLayout";
import { SidebarProvider } from "@/components/therapistlayout/SidebarContext";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { Button } from "@/components/ui/AppButton";
import { LiveTicker, useLiveToast } from "@/components/live/LiveFeedback";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { useLoading } from "@/components/ui/LoadingProvider";
import { patientNavHref, patientRoutes } from "@/lib/routes";
import type { TherapistPatient } from "@/lib/therapist/patients-queries";
import type { SessionNote } from "@/lib/therapist/session-notes-queries";
import { fetchPatientProgress } from "@/lib/therapist/progress-actions";
import {
  dateRangeOptions,
  resolveDateRange,
  type PatientProgress,
} from "@/lib/therapist/progress-shared";

interface TherapeuticProgressViewProps {
  patient: TherapistPatient;
  initialDateRange: string;
  initialProgress: PatientProgress;
  recentNotes: SessionNote[];
}

function formatNoteDate(sessionDate: string) {
  return new Date(`${sessionDate}T12:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatBarDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function TherapeuticProgressView({
  patient,
  initialDateRange,
  initialProgress,
  recentNotes,
}: TherapeuticProgressViewProps) {
  const { withLoading } = useLoading();
  const { flash } = useLiveToast();
  const [dateRange, setDateRange] = useState(initialDateRange);
  const [progress, setProgress] = useState(initialProgress);
  const [loading, setLoading] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const avatar = patient.avatar;

  const loadProgress = useCallback(
    (range: string) => {
      const { start, end } = resolveDateRange(range);
      setLoading(true);
      void (async () => {
        try {
          const data = await fetchPatientProgress(patient.id, start, end);
          setProgress(data);
        } catch (error) {
          flash(error instanceof Error ? error.message : "Couldn't load progress data");
        } finally {
          setLoading(false);
        }
      })();
    },
    [patient.id, flash],
  );

  useEffect(() => {
    if (dateRange === initialDateRange) return;
    loadProgress(dateRange);
    // Only refetch when the therapist actively changes the range.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  const attendanceRateLabel =
    progress.attendanceRatePercent === null ? "—" : `${progress.attendanceRatePercent}%`;

  const summaryStats = [
    { label: "Sessions", value: String(progress.totalSessions), detail: dateRange },
    { label: "Attendance rate", value: attendanceRateLabel, detail: dateRange },
    { label: "Last session", value: patient.lastSessionLabel, detail: "All time" },
    { label: "Next session", value: patient.nextSessionLabel ?? "None scheduled", detail: "Upcoming" },
  ];

  const maxBucketCount = Math.max(1, ...progress.sessionsOverTime.map((b) => b.count));

  function buildProgressPlainText() {
    return [
      `Progress Report for ${patient.name}`,
      `Period: ${dateRange}`,
      "",
      "Summary Stats:",
      ...summaryStats.map((s) => `- ${s.label}: ${s.value} (${s.detail})`),
      "",
      "Recent session notes:",
      ...(recentNotes.length
        ? recentNotes.map((n) => `- ${formatNoteDate(n.sessionDate)}: ${n.title}`)
        : ["- No session notes saved yet"]),
    ].join("\n");
  }

  function buildProgressHTML() {
    return `
      <div style="font-family:system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial;padding:20px;color:#21311b;">
        <h1 style="color:#3e5219;">Progress Report for ${patient.name}</h1>
        <p><strong>Period:</strong> ${dateRange}</p>
        <h2>Summary Stats</h2>
        <ul>
          ${summaryStats.map((s) => `<li><strong>${s.label}:</strong> ${s.value} (${s.detail})</li>`).join("")}
        </ul>
        <h2>Recent Session Notes</h2>
        <ul>
          ${
            recentNotes.length
              ? recentNotes.map((n) => `<li>${formatNoteDate(n.sessionDate)}: ${n.title}</li>`).join("")
              : "<li>No session notes saved yet</li>"
          }
        </ul>
      </div>
    `;
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
                    Session outcomes for {patient.name}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <DropdownMenu
                    value={dateRange}
                    options={[...dateRangeOptions]}
                    onChange={setDateRange}
                  />
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

              <LiveTicker
                items={[
                  `${progress.totalSessions} session${progress.totalSessions === 1 ? "" : "s"} held in the ${dateRange.toLowerCase()}.`,
                  patient.nextSessionLabel
                    ? `Next session ${patient.nextSessionLabel}.`
                    : "No upcoming session scheduled.",
                ]}
              />

              <section
                className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 ${loading ? "opacity-60" : ""}`}
              >
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
                    <p className="mt-1 text-sm text-munity-muted">{stat.detail}</p>
                  </motion.article>
                ))}
              </section>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
                <section className="rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)] xl:col-span-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold text-munity-text">Sessions over time</h2>
                      <p className="mt-1 text-sm text-munity-muted">
                        Completed sessions across the selected range
                      </p>
                    </div>
                  </div>

                  {progress.sessionsOverTime.length === 0 ? (
                    <div className="mt-8 flex h-56 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-munity-input-border text-center">
                      <p className="text-sm font-semibold text-munity-text">
                        No completed sessions in this range
                      </p>
                      <p className="max-w-xs text-xs text-munity-muted">
                        Try a wider date range, or check back once sessions with {patient.name} are
                        marked complete.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-8 flex h-56 items-end justify-between gap-2">
                      {progress.sessionsOverTime.map((bucket, index) => (
                        <div key={bucket.label} className="flex flex-1 flex-col items-center gap-2">
                          <span className="text-xs font-semibold text-munity-text">
                            {bucket.count}
                          </span>
                          <motion.div
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ delay: index * 0.04, duration: 0.35 }}
                            style={{
                              originY: 1,
                              height: `${Math.max(8, (bucket.count / maxBucketCount) * 160)}px`,
                            }}
                            className="w-full max-w-[36px] rounded-t-lg bg-munity-green"
                          />
                          <span className="text-[10px] font-semibold text-munity-muted">
                            {bucket.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-munity-border pt-5">
                    <p className="text-sm text-munity-muted">
                      <span className="font-semibold text-munity-text">
                        {progress.totalSessions}
                      </span>{" "}
                      session{progress.totalSessions === 1 ? "" : "s"} completed · {dateRange.toLowerCase()}
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
                  <p className="mt-1 text-sm text-munity-muted">
                    Last {progress.attendance.length || 0} decided session
                    {progress.attendance.length === 1 ? "" : "s"} in range
                  </p>

                  {progress.attendance.length === 0 ? (
                    <div className="mt-6 flex h-24 items-center justify-center rounded-xl border border-dashed border-munity-input-border text-center text-sm text-munity-muted">
                      No completed or cancelled sessions in this range yet.
                    </div>
                  ) : (
                    <div className="mt-6 flex items-end justify-between gap-2">
                      {progress.attendance.map((session, index) => (
                        <div
                          key={session.bookingId}
                          className="flex flex-1 flex-col items-center gap-2"
                        >
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
                            {formatBarDate(session.scheduledAt)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-6">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-medium text-munity-muted">Completion rate</span>
                      <span className="font-semibold text-munity-green">{attendanceRateLabel}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-munity-divider">
                      <div
                        className="h-full rounded-full bg-munity-green"
                        style={{ width: `${progress.attendanceRatePercent ?? 0}%` }}
                      />
                    </div>
                    <div className="mt-4 flex gap-4 text-xs text-munity-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="size-2.5 rounded-sm bg-munity-green" />
                        Attended
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="size-2.5 rounded-sm bg-[#ffdad6]" />
                        Cancelled
                      </span>
                    </div>
                  </div>
                </section>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <section className="rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <FileText className="size-5 text-munity-green" />
                      <h2 className="text-xl font-semibold text-munity-text">Recent session notes</h2>
                    </div>
                    <Link
                      href={patientRoutes(patient.slug).clinicalNotes}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-munity-green hover:underline"
                    >
                      View all
                      <ChevronRight className="size-4" />
                    </Link>
                  </div>

                  {recentNotes.length === 0 ? (
                    <div className="mt-6 rounded-2xl border border-dashed border-munity-input-border bg-munity-sidebar/30 p-6 text-center text-sm text-munity-muted">
                      No session notes saved for {patient.name} yet.
                    </div>
                  ) : (
                    <ul className="mt-5 space-y-3">
                      {recentNotes.map((note) => (
                        <li key={note.id}>
                          <Link
                            href={patientRoutes(patient.slug).clinicalNotes}
                            className="flex items-start gap-3 rounded-2xl border border-munity-border bg-munity-sidebar/30 px-4 py-3 text-sm transition hover:border-munity-green/30 hover:bg-munity-lime/10"
                          >
                            <CalendarClock className="mt-0.5 size-4 shrink-0 text-munity-muted" />
                            <div className="min-w-0">
                              <p className="font-semibold text-munity-text">{note.title}</p>
                              <p className="mt-0.5 text-xs text-munity-muted">
                                {formatNoteDate(note.sessionDate)}
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <section className="rounded-[20px] border border-dashed border-munity-input-border bg-white p-6">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="size-5 text-munity-muted" />
                    <h2 className="text-xl font-semibold text-munity-text">Clinical assessments</h2>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-munity-muted">
                    Standardized check-ins (GAD-7, mood tracking, symptom scoring) aren&apos;t
                    collected yet — this section will populate once assessment data is captured for{" "}
                    {patient.name}.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs font-medium text-munity-muted">
                    <CheckCircle2 className="size-3.5" />
                    Session attendance and cadence above are drawn from real bookings.
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
