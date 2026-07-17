"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowUpDown,
  Ban,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  Gauge,
  HeartPulse,
  Hourglass,
  Mail,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { AdminAppShell } from "@/components/admin/AdminAppShell";
import { LivePulse, useLiveToast } from "@/components/live/LiveFeedback";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockStore, useMockStore } from "@/lib/mock-store";
import type { ModerationReport } from "@/lib/mock-db";
import { routes } from "@/lib/routes";

type ReportTab = "All Reports" | "Pending" | "In Review" | "Resolved";
type SeverityFilter = "All" | "CRITICAL" | "MEDIUM" | "LOW";
type SortKey = "newest" | "severity" | "status";

const tabs: ReportTab[] = ["All Reports", "Pending", "In Review", "Resolved"];
const PAGE_SIZE = 5;

const severityRank: Record<ModerationReport["severity"], number> = {
  CRITICAL: 0,
  MEDIUM: 1,
  LOW: 2,
};

const statusRank: Record<ModerationReport["status"], number> = {
  "Pending Urgent": 0,
  Pending: 1,
  "In Review": 2,
  Resolved: 3,
};

function statusMatchesTab(status: ModerationReport["status"], tab: ReportTab) {
  if (tab === "All Reports") return true;
  if (tab === "Pending") return status === "Pending" || status === "Pending Urgent";
  if (tab === "In Review") return status === "In Review";
  return status === "Resolved";
}

function AdminModerationContent({ searchQuery }: { searchQuery: string }) {
  const { reports } = useMockStore();
  const { flash } = useLiveToast();
  const [tab, setTab] = useState<ReportTab>("All Reports");
  const [selectedId, setSelectedId] = useState("8492");
  const [page, setPage] = useState(1);
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("All");
  const [sortKey, setSortKey] = useState<SortKey>("newest");

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const list = reports.filter((report) => {
      if (!statusMatchesTab(report.status, tab)) return false;
      if (severityFilter !== "All" && report.severity !== severityFilter) return false;
      if (!query) return true;
      return (
        report.id.includes(query) ||
        report.reporter.toLowerCase().includes(query) ||
        report.target.toLowerCase().includes(query) ||
        report.reason.toLowerCase().includes(query) ||
        report.targetSnippet.toLowerCase().includes(query) ||
        report.caseContent.toLowerCase().includes(query)
      );
    });

    return [...list].sort((a, b) => {
      if (sortKey === "severity") {
        return severityRank[a.severity] - severityRank[b.severity];
      }
      if (sortKey === "status") {
        return statusRank[a.status] - statusRank[b.status];
      }
      return Number(b.id) - Number(a.id);
    });
  }, [reports, tab, severityFilter, sortKey, searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, tab, severityFilter, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(pageStart, pageStart + PAGE_SIZE);
  const selected =
    filtered.find((report) => report.id === selectedId) ??
    visible[0] ??
    filtered[0] ??
    reports[0];

  const activeReports = reports.filter((report) => report.status !== "Resolved").length;
  const pendingReports = reports.filter(
    (report) => report.status === "Pending" || report.status === "Pending Urgent",
  ).length;
  const urgentReports = reports.filter((report) => report.status === "Pending Urgent").length;
  const resolvedToday = reports.filter((report) => {
    if (!report.resolvedAt) return false;
    return report.resolvedAt.slice(0, 10) === new Date().toISOString().slice(0, 10);
  }).length;
  const avgResponseMins = Math.max(
    8,
    18 - Math.min(resolvedToday * 2, 8) - Math.min(activeReports, 4),
  );

  const tabCount = (item: ReportTab) =>
    reports.filter((report) => statusMatchesTab(report.status, item)).length;

  function selectReport(id: string) {
    setSelectedId(id);
  }

  function resolveSelected(resolution: string) {
    if (!selected) return;
    mockStore.resolveReport(selected.id, resolution);
    flash(`${resolution} applied to report #${selected.id}.`);
  }

  function markInReview(reportId: string) {
    mockStore.updateReportStatus(reportId, "In Review");
    flash(`Report #${reportId} is now in review.`);
  }

  function startWellnessCheck(reportId: string) {
    mockStore.initiateWellnessCheck(reportId);
    flash(`Wellness check initiated for report #${reportId}. Crisis protocol notified.`);
  }

  function changeTab(next: ReportTab) {
    setTab(next);
    setPage(1);
  }

  function changeSeverity(next: SeverityFilter) {
    setSeverityFilter(next);
    setPage(1);
    flash(
      next === "All"
        ? "Showing all severities."
        : `Filtered to ${next.toLowerCase()} severity reports.`,
    );
  }

  function changeSort(next: SortKey) {
    setSortKey(next);
    setPage(1);
    const labels: Record<SortKey, string> = {
      newest: "newest first",
      severity: "severity",
      status: "status",
    };
    flash(`Sorted by ${labels[next]}.`);
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
    Math.max(0, currentPage - 2),
    Math.max(0, currentPage - 2) + Math.min(3, totalPages),
  );

  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[20px] border border-[rgba(197,200,184,0.3)] bg-white p-6 shadow-[0px_4px_10px_rgba(85,107,47,0.05)]">
          <p className="text-base uppercase tracking-[0.8px] text-munity-muted">Active Reports</p>
          <div className="mt-1 flex items-end justify-between gap-3">
            <p className="text-5xl font-bold tracking-[-0.96px] text-munity-green">{activeReports}</p>
            <span className="mb-2 rounded-lg bg-munity-lime px-2 py-1 text-base text-[#56642b]">
              {resolvedToday > 0 ? `${resolvedToday} resolved today` : `${pendingReports} pending`}
            </span>
          </div>
        </article>

        <article className="rounded-[20px] border border-[rgba(197,200,184,0.3)] bg-white p-6 shadow-[0px_4px_10px_rgba(85,107,47,0.05)]">
          <p className="text-base uppercase tracking-[0.8px] text-munity-muted">Pending Review</p>
          <div className="mt-1 flex items-end justify-between gap-3">
            <p className="text-5xl font-bold tracking-[-0.96px] text-[#474836]">{pendingReports}</p>
            <div className="mb-2">
              <LivePulse label="Pending" count={pendingReports} />
            </div>
          </div>
        </article>

        <article className="rounded-[20px] border border-[rgba(186,26,26,0.2)] bg-[rgba(255,218,214,0.1)] p-6 shadow-[0px_4px_20px_rgba(85,107,47,0.05)]">
          <p className="text-base uppercase tracking-[0.8px] text-[#ba1a1a]">Urgent (Crisis)</p>
          <div className="mt-1 flex items-end justify-between gap-3">
            <p className="text-5xl font-bold tracking-[-0.96px] text-[#ba1a1a]">
              {String(urgentReports).padStart(2, "0")}
            </p>
            <AlertTriangle className="mb-2 size-8 text-[#ba1a1a]" />
          </div>
        </article>

        <article className="rounded-[20px] border border-[rgba(197,200,184,0.3)] bg-white p-6 shadow-[0px_4px_10px_rgba(85,107,47,0.05)]">
          <p className="text-base uppercase tracking-[0.8px] text-munity-muted">Avg. Response</p>
          <div className="mt-1 flex items-end justify-between gap-3">
            <p className="text-5xl font-bold tracking-[-0.96px] text-munity-green">{avgResponseMins}m</p>
            <Gauge className="mb-2 size-8 text-munity-muted" />
          </div>
        </article>
      </section>

      <section className="overflow-hidden rounded-[20px] border border-[rgba(197,200,184,0.3)] bg-white shadow-[0px_4px_20px_rgba(85,107,47,0.05)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(197,200,184,0.3)] px-6 py-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((item) => {
              const active = tab === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => changeTab(item)}
                  className={`rounded-full px-6 py-2 text-base transition ${
                    active
                      ? "bg-munity-green text-white shadow-sm"
                      : "text-munity-muted hover:bg-[#f5f3f3]"
                  }`}
                >
                  {item} ({tabCount(item)})
                </button>
              );
            })}
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger
                className="inline-flex items-center gap-2 rounded-xl border border-[#c5c8b8] px-4 py-2 text-base text-munity-muted outline-none transition hover:bg-[#f5f3f3]"
              >
                <Filter className="size-3.5" />
                {severityFilter === "All" ? "Filter By" : severityFilter}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="min-w-44 border border-munity-border bg-white p-1.5 shadow-lg"
              >
                {(["All", "CRITICAL", "MEDIUM", "LOW"] as SeverityFilter[]).map((option) => (
                  <DropdownMenuItem
                    key={option}
                    className="cursor-pointer rounded-lg px-3 py-2 text-sm"
                    onClick={() => changeSeverity(option)}
                  >
                    {option === "All" ? "All severities" : option}
                    {severityFilter === option ? " ✓" : ""}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger
                className="inline-flex items-center gap-2 rounded-xl border border-[#c5c8b8] px-4 py-2 text-base text-munity-muted outline-none transition hover:bg-[#f5f3f3]"
              >
                <ArrowUpDown className="size-3.5" />
                Sort
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="min-w-44 border border-munity-border bg-white p-1.5 shadow-lg"
              >
                {(
                  [
                    ["newest", "Newest first"],
                    ["severity", "Severity"],
                    ["status", "Status"],
                  ] as const
                ).map(([key, label]) => (
                  <DropdownMenuItem
                    key={key}
                    className="cursor-pointer rounded-lg px-3 py-2 text-sm"
                    onClick={() => changeSort(key)}
                  >
                    {label}
                    {sortKey === key ? " ✓" : ""}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full border-collapse text-left">
            <thead className="bg-[#f5f3f3]">
              <tr className="border-b border-[rgba(197,200,184,0.3)] text-[11px] font-bold uppercase tracking-[0.55px] text-munity-muted">
                <th className="px-6 py-4">Report ID</th>
                <th className="px-6 py-4">Reporter</th>
                <th className="px-6 py-4">Target (User/Post)</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-munity-muted">
                    No reports match this filter.
                  </td>
                </tr>
              ) : (
                visible.map((report) => {
                  const selectedRow = selected?.id === report.id;
                  return (
                    <motion.tr
                      key={report.id}
                      onClick={() => selectReport(report.id)}
                      animate={{
                        backgroundColor: selectedRow
                          ? "rgba(214, 231, 161, 0.22)"
                          : "rgba(255, 255, 255, 0)",
                      }}
                      transition={{ duration: 0.2 }}
                      className={`cursor-pointer border-b border-[rgba(197,200,184,0.2)] transition hover:bg-[#f5f3f3]/60 ${
                        report.urgent ? "bg-[rgba(255,218,214,0.03)]" : ""
                      } ${selectedRow ? "ring-1 ring-inset ring-munity-green/20" : ""}`}
                    >
                      <td className="px-6 py-5 font-mono text-xs text-munity-muted">
                        #REP-{report.id}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <span className="flex size-8 items-center justify-center rounded-full bg-[#efeded] text-xs font-bold text-munity-green">
                            {report.reporterInitials}
                          </span>
                          <span className="text-base text-munity-text">{report.reporter}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-base text-munity-green">{report.target}</p>
                        <p className="text-xs text-munity-muted/70">{report.targetSnippet}</p>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                            report.reasonTone === "danger"
                              ? "bg-[#ffdad6] text-[#93000a]"
                              : report.reasonTone === "lime"
                                ? "bg-munity-lime text-[#5a682f]"
                                : "bg-[#e4e2e2] text-munity-muted"
                          }`}
                        >
                          {report.reason}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center gap-2 text-base">
                          <span
                            className={`size-2 rounded-full ${
                              report.status === "Pending Urgent"
                                ? "bg-[#ba1a1a]"
                                : report.status === "In Review"
                                  ? "bg-[#75796b]"
                                  : report.status === "Resolved"
                                    ? "bg-munity-green"
                                    : "bg-[#c5c8b8]"
                            }`}
                          />
                          <span
                            className={
                              report.status === "Pending Urgent"
                                ? "text-[#ba1a1a]"
                                : "text-munity-muted"
                            }
                          >
                            {report.status}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-0.5 text-[11px] font-bold uppercase ${
                            report.severity === "CRITICAL"
                              ? "bg-[#ba1a1a] text-white"
                              : report.severity === "MEDIUM"
                                ? "border border-[rgba(197,200,184,0.5)] bg-[#fff8e8] text-[#8a6d00]"
                                : "border border-[rgba(197,200,184,0.5)] bg-[#e4e2e2] text-munity-muted"
                          }`}
                        >
                          {report.severity}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className="rounded-lg p-2 text-munity-muted outline-none transition hover:bg-[#f5f3f3] hover:text-munity-text"
                            aria-label={`Open actions for report ${report.id}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="size-5" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="min-w-48 border border-munity-border bg-white p-1.5 shadow-lg"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <DropdownMenuItem
                              className="cursor-pointer rounded-lg px-3 py-2 text-sm"
                              onClick={() => {
                                selectReport(report.id);
                                flash(`Opened case #${report.id}.`);
                              }}
                            >
                              Open case
                            </DropdownMenuItem>
                            {report.status !== "Resolved" ? (
                              <>
                                <DropdownMenuItem
                                  className="cursor-pointer rounded-lg px-3 py-2 text-sm"
                                  onClick={() => {
                                    selectReport(report.id);
                                    markInReview(report.id);
                                  }}
                                >
                                  Mark in review
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer rounded-lg px-3 py-2 text-sm"
                                  onClick={() => {
                                    selectReport(report.id);
                                    startWellnessCheck(report.id);
                                  }}
                                >
                                  Wellness check
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="my-1 bg-munity-divider" />
                                <DropdownMenuItem
                                  className="cursor-pointer rounded-lg px-3 py-2 text-sm"
                                  onClick={() => {
                                    selectReport(report.id);
                                    mockStore.resolveReport(report.id, "Warn");
                                    flash(`Warn applied to report #${report.id}.`);
                                  }}
                                >
                                  Warn user
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer rounded-lg px-3 py-2 text-sm"
                                  onClick={() => {
                                    selectReport(report.id);
                                    mockStore.resolveReport(report.id, "Remove content");
                                    flash(`Content removed for report #${report.id}.`);
                                  }}
                                >
                                  Remove content
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  variant="destructive"
                                  className="cursor-pointer rounded-lg px-3 py-2 text-sm"
                                  onClick={() => {
                                    selectReport(report.id);
                                    mockStore.resolveReport(report.id, "Suspend");
                                    flash(`Account suspended for report #${report.id}.`);
                                  }}
                                >
                                  Suspend account
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer rounded-lg px-3 py-2 text-sm"
                                  onClick={() => {
                                    selectReport(report.id);
                                    mockStore.resolveReport(report.id, "Dismiss");
                                    flash(`Report #${report.id} dismissed.`);
                                  }}
                                >
                                  Dismiss
                                </DropdownMenuItem>
                              </>
                            ) : (
                              <DropdownMenuItem
                                className="cursor-pointer rounded-lg px-3 py-2 text-sm"
                                onClick={() => {
                                  mockStore.updateReportStatus(report.id, "Pending");
                                  flash(`Report #${report.id} reopened.`);
                                }}
                              >
                                Reopen report
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
          <p className="text-sm text-munity-muted">
            Showing {filtered.length === 0 ? 0 : pageStart + 1}–
            {Math.min(pageStart + PAGE_SIZE, filtered.length)} of {filtered.length} reports
            {severityFilter !== "All" ? ` · ${severityFilter}` : ""}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous page"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex size-9 items-center justify-center rounded-xl border border-[#c5c8b8] disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
            </button>
            {pageNumbers.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={`flex size-9 items-center justify-center rounded-xl text-sm font-semibold ${
                  currentPage === n
                    ? "bg-munity-green text-white"
                    : "border border-[#c5c8b8] text-munity-text"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              aria-label="Next page"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="flex size-9 items-center justify-center rounded-xl border border-[#c5c8b8] disabled:opacity-40"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </section>

      {selected ? (
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <article className="rounded-[20px] border border-[rgba(197,200,184,0.3)] bg-white p-6 shadow-[0px_4px_20px_rgba(85,107,47,0.05)] xl:col-span-8">
            <div className="flex flex-wrap items-start gap-4">
              <div className="relative size-16 overflow-hidden rounded-full bg-[#efeded]">
                <Image
                  src="/images/admin/case-avatar.jpg"
                  alt={selected.target}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-semibold text-munity-text">{selected.target}</h2>
                  {selected.urgent ? (
                    <span className="rounded-full bg-[#ba1a1a] px-3 py-1 text-xs font-bold uppercase text-white">
                      Urgent Case
                    </span>
                  ) : null}
                  {selected.status === "Resolved" ? (
                    <span className="rounded-full bg-munity-lime px-3 py-1 text-xs font-bold uppercase text-munity-olive-text">
                      Resolved · {selected.resolution ?? "Closed"}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-munity-muted">
                  Reported for: <span className="font-bold text-munity-text">{selected.reason}</span>
                  {" • "}Case #{selected.id}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-[rgba(197,200,184,0.3)] bg-[#f5f3f3] p-5">
              <p className="text-base italic leading-relaxed text-munity-text">
                &ldquo;{selected.caseContent}&rdquo;
              </p>
              <p className="mt-3 text-xs text-munity-muted">
                Posted {selected.postedAgo} in &apos;{selected.postedIn}&apos;
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-munity-lime/70 px-3 py-1.5 text-xs font-semibold text-munity-olive-text">
                Sentiment: {selected.sentiment}
              </span>
              <span className="rounded-full bg-[#fff3cd] px-3 py-1.5 text-xs font-semibold text-[#8a6d00]">
                Prev. Flags: {selected.prevFlags}
              </span>
              <span className="rounded-full bg-munity-lime/70 px-3 py-1.5 text-xs font-semibold text-munity-olive-text">
                Trusted Reporter: {selected.reporter} ({selected.reporterTrust}%)
              </span>
            </div>
          </article>

          <article className="rounded-[20px] border border-[rgba(197,200,184,0.3)] bg-white p-6 shadow-[0px_4px_20px_rgba(85,107,47,0.05)] xl:col-span-4">
            <h3 className="text-xl font-semibold text-munity-text">Resolution Tools</h3>
            <div className="mt-5 flex flex-col gap-3">
              <button
                type="button"
                disabled={selected.status === "Resolved"}
                onClick={() => startWellnessCheck(selected.id)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ba1a1a] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <HeartPulse className="size-4" />
                Initiate Wellness Check
              </button>
              <button
                type="button"
                disabled={selected.status === "Resolved" || selected.status === "In Review"}
                onClick={() => markInReview(selected.id)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-munity-green px-4 py-3 text-sm font-semibold text-munity-green transition hover:bg-munity-lime/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Hourglass className="size-4" />
                Mark In Review
              </button>
              <button
                type="button"
                disabled={selected.status === "Resolved"}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-munity-lime px-4 py-3 text-sm font-semibold text-munity-olive-text transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => resolveSelected("Warn")}
              >
                <Mail className="size-4" />
                Warn User
              </button>
              <button
                type="button"
                disabled={selected.status === "Resolved"}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-munity-text px-4 py-3 text-sm font-semibold text-munity-text transition hover:bg-[#f5f3f3] disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => resolveSelected("Remove content")}
              >
                <Trash2 className="size-4" />
                Remove Content
              </button>
              <button
                type="button"
                disabled={selected.status === "Resolved"}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#ba1a1a] px-4 py-3 text-sm font-semibold text-[#ba1a1a] transition hover:bg-[#ffdad6]/40 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => resolveSelected("Suspend")}
              >
                <Ban className="size-4" />
                Suspend Account
              </button>
              <button
                type="button"
                disabled={selected.status === "Resolved"}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#eae8e7] px-4 py-3 text-sm font-semibold text-munity-muted transition hover:bg-[#e4e2e2] disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => resolveSelected("Dismiss")}
              >
                <Check className="size-4" />
                Dismiss Report
              </button>
              {selected.status === "Resolved" ? (
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-munity-green px-4 py-3 text-sm font-semibold text-munity-green transition hover:bg-munity-lime/40"
                  onClick={() => {
                    mockStore.updateReportStatus(selected.id, "Pending");
                    flash(`Report #${selected.id} reopened.`);
                  }}
                >
                  Reopen Report
                </button>
              ) : null}
            </div>
          </article>
        </section>
      ) : null}

      <footer className="mt-2 border-t border-[rgba(197,200,184,0.1)] bg-[#e4e2e2] px-6 py-8 md:-mx-2 md:px-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-bold tracking-wide text-munity-text">
              Munity Peer Support • Moderation Protocol v2.4.1
            </p>
            <p className="mt-1 text-xs font-medium text-munity-muted">
              © {new Date().getFullYear()} Munity Peer Support. For emergencies, contact local
              crisis services immediately.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-medium text-munity-muted">
            <Link href={routes.emergency} className="hover:text-munity-green">
              Emergency Support
            </Link>
            <Link href={routes.privacy} className="hover:text-munity-green">
              Privacy Policy
            </Link>
            <Link href={routes.terms} className="hover:text-munity-green">
              Terms of Service
            </Link>
            <Link href={routes.help} className="hover:text-munity-green">
              Help Center
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function AdminModerationView({ adminName }: { adminName: string }) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AdminAppShell
      adminName={adminName}
      title="Moderation Center"
      searchPlaceholder="Search reports, users, or keywords..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <AdminModerationContent searchQuery={searchQuery} />
    </AdminAppShell>
  );
}
