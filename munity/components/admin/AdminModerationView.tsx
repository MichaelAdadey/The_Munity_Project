"use client";

import Image from "next/image";
import { useState } from "react";
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
import { mockStore, useMockStore } from "@/lib/mock-store";
import type { ModerationReport } from "@/lib/mock-db";

type ReportTab = "All Reports" | "Pending" | "In Review" | "Resolved";

const tabs: ReportTab[] = ["All Reports", "Pending", "In Review", "Resolved"];

function statusMatchesTab(status: ModerationReport["status"], tab: ReportTab) {
  if (tab === "All Reports") return true;
  if (tab === "Pending") return status === "Pending" || status === "Pending Urgent";
  if (tab === "In Review") return status === "In Review";
  return status === "Resolved";
}

function AdminModerationContent() {
  const { reports } = useMockStore();
  const { flash } = useLiveToast();
  const [tab, setTab] = useState<ReportTab>("All Reports");
  const [selectedId, setSelectedId] = useState("8492");
  const [page, setPage] = useState(1);

  const visible = reports.filter((report) => statusMatchesTab(report.status, tab));
  const selected = visible.find((report) => report.id === selectedId) ?? visible[0] ?? reports[0];
  const activeReports = reports.filter((report) => report.status !== "Resolved").length;
  const pendingReports = reports.filter(
    (report) => report.status === "Pending" || report.status === "Pending Urgent",
  ).length;
  const urgentReports = reports.filter((report) => report.status === "Pending Urgent").length;
  const tabCount = (item: ReportTab) =>
    reports.filter((report) => statusMatchesTab(report.status, item)).length;
  const resolveSelected = (resolution: string) => {
    if (!selected) return;
    mockStore.resolveReport(selected.id, resolution);
    flash(`${resolution} applied to report #${selected.id}.`);
  };

  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-6">
        {/* Stats */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-[20px] border border-[rgba(197,200,184,0.3)] bg-white p-6 shadow-[0px_4px_10px_rgba(85,107,47,0.05)]">
            <p className="text-base uppercase tracking-[0.8px] text-munity-muted">Active Reports</p>
            <div className="mt-1 flex items-end justify-between gap-3">
              <p className="text-5xl font-bold tracking-[-0.96px] text-munity-green">{activeReports}</p>
              <span className="mb-2 rounded-lg bg-munity-lime px-2 py-1 text-base text-[#56642b]">
                +5 today
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
              <p className="text-5xl font-bold tracking-[-0.96px] text-munity-green">14m</p>
              <Gauge className="mb-2 size-8 text-munity-muted" />
            </div>
          </article>
        </section>

        {/* Reports table */}
        <section className="overflow-hidden rounded-[20px] border border-[rgba(197,200,184,0.3)] bg-white shadow-[0px_4px_20px_rgba(85,107,47,0.05)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(197,200,184,0.3)] px-6 py-6">
            <div className="flex flex-wrap gap-2">
              {tabs.map((item) => {
                const active = tab === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setTab(item);
                      setPage(1);
                    }}
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
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-[#c5c8b8] px-4 py-2 text-base text-munity-muted transition hover:bg-[#f5f3f3]"
              >
                <Filter className="size-3.5" />
                Filter By
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-[#c5c8b8] px-4 py-2 text-base text-munity-muted transition hover:bg-[#f5f3f3]"
              >
                <ArrowUpDown className="size-3.5" />
                Sort
              </button>
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
                {visible.map((report) => {
                  const selectedRow = selected?.id === report.id;
                  return (
                    <motion.tr
                      key={report.id}
                      onClick={() => setSelectedId(report.id)}
                      animate={{ backgroundColor: selectedRow ? "rgba(214, 231, 161, 0.22)" : "rgba(255, 255, 255, 0)" }}
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
                                  : "bg-munity-green"
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
                        <button
                          type="button"
                          className="rounded-lg p-2 text-munity-muted transition hover:bg-[#f5f3f3] hover:text-munity-text"
                          aria-label={`Open actions for report ${report.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedId(report.id);
                          }}
                        >
                          <MoreHorizontal className="size-5" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
            <p className="text-sm text-munity-muted">
              Showing {visible.length ? "1" : "0"}–{visible.length} of {reports.length} reports
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous page"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex size-9 items-center justify-center rounded-xl border border-[#c5c8b8] disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </button>
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={`flex size-9 items-center justify-center rounded-xl text-sm font-semibold ${
                    page === n
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
                onClick={() => setPage((p) => Math.min(3, p + 1))}
                className="flex size-9 items-center justify-center rounded-xl border border-[#c5c8b8]"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Case detail + tools */}
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
                  </div>
                  <p className="mt-1 text-sm text-munity-muted">
                    Reported for: <span className="font-bold text-munity-text">{selected.reason}</span>
                    {" • "}Case #{selected.id}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-[rgba(197,200,184,0.3)] bg-[#f5f3f3] p-5">
                <p className="text-base italic leading-relaxed text-munity-text">
                  &ldquo;Everything just feels like too much today. I&apos;ve tried reaching out to my
                  usual circles but I don&apos;t think I can do this anymore. It&apos;s just too quiet
                  and the weight is too heavy.&rdquo;
                </p>
                <p className="mt-3 text-xs text-munity-muted">
                  Posted 14 minutes ago in &apos;General Support&apos;
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-munity-lime/70 px-3 py-1.5 text-xs font-semibold text-munity-olive-text">
                  Sentiment: High Distress
                </span>
                <span className="rounded-full bg-[#fff3cd] px-3 py-1.5 text-xs font-semibold text-[#8a6d00]">
                  Prev. Flags: 0
                </span>
                <span className="rounded-full bg-munity-lime/70 px-3 py-1.5 text-xs font-semibold text-munity-olive-text">
                  Trusted Reporter: {selected.reporter} (98%)
                </span>
              </div>
            </article>

            <article className="rounded-[20px] border border-[rgba(197,200,184,0.3)] bg-white p-6 shadow-[0px_4px_20px_rgba(85,107,47,0.05)] xl:col-span-4">
              <h3 className="text-xl font-semibold text-munity-text">Resolution Tools</h3>
              <div className="mt-5 flex flex-col gap-3">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ba1a1a] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-95"
                >
                  <HeartPulse className="size-4" />
                  Initiate Wellness Check
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (selected) {
                      mockStore.updateReportStatus(selected.id, "In Review");
                      flash(`Report #${selected.id} is now in review.`);
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-munity-green px-4 py-3 text-sm font-semibold text-munity-green transition hover:bg-munity-lime/40"
                >
                  <Hourglass className="size-4" />
                  Mark In Review
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-munity-lime px-4 py-3 text-sm font-semibold text-munity-olive-text transition hover:brightness-95"
                  onClick={() => resolveSelected("Warn")}
                >
                  <Mail className="size-4" />
                  Warn User
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-munity-text px-4 py-3 text-sm font-semibold text-munity-text transition hover:bg-[#f5f3f3]"
                  onClick={() => resolveSelected("Remove content")}
                >
                  <Trash2 className="size-4" />
                  Remove Content
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#ba1a1a] px-4 py-3 text-sm font-semibold text-[#ba1a1a] transition hover:bg-[#ffdad6]/40"
                  onClick={() => resolveSelected("Suspend")}
                >
                  <Ban className="size-4" />
                  Suspend Account
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#eae8e7] px-4 py-3 text-sm font-semibold text-munity-muted transition hover:bg-[#e4e2e2]"
                  onClick={() => resolveSelected("Dismiss")}
                >
                  <Check className="size-4" />
                  Dismiss Report
                </button>
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
              <a href="/emergency" className="hover:text-munity-green">
                Emergency Support
              </a>
              <a href="#" className="hover:text-munity-green">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-munity-green">
                Terms of Service
              </a>
              <a href="#" className="hover:text-munity-green">
                Help Center
              </a>
            </div>
          </div>
        </footer>
    </div>
  );
}

export function AdminModerationView({ adminName }: { adminName: string }) {
  return (
    <AdminAppShell
      adminName={adminName}
      title="Moderation Center"
      searchPlaceholder="Search reports, users, or keywords..."
    >
      <AdminModerationContent />
    </AdminAppShell>
  );
}
