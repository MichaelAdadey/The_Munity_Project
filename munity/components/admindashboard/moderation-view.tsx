'use client'

import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Filter,
  HeartPulse,
  ShieldAlert,
  SlidersHorizontal,
  UserX,
} from 'lucide-react'
import {
  moderationReports,
  moderationStats,
  reportTabs,
  type ModerationReport,
  type ReportStatus,
} from '@/lib/moderation-data'
import { cn } from '@/lib/utils'

const statusStyles: Record<ReportStatus, string> = {
  Pending: 'bg-[#fff3cd] text-[#856404]',
  'In Review': 'bg-[#dbeafe] text-[#1e40af]',
  Resolved: 'bg-[#d6e7a1] text-[#3e5219]',
}

const severityStyles: Record<string, string> = {
  Urgent: 'bg-[#ffdad6] text-[#93000a]',
  Critical: 'bg-[#ba1a1a] text-white',
  Medium: 'bg-[#fef3c7] text-[#92400e]',
  Low: 'bg-[#efeded] text-[#45483c]',
}

export function ModerationView() {
  const [activeTab, setActiveTab] = useState<(typeof reportTabs)[number]>('All Reports')
  const [selectedId, setSelectedId] = useState(moderationReports[0].id)

  const filteredReports = useMemo(() => {
    if (activeTab === 'All Reports') return moderationReports
    return moderationReports.filter((r) => r.status === activeTab)
  }, [activeTab])

  const selected =
    moderationReports.find((r) => r.id === selectedId) ?? moderationReports[0]

  return (
    <div className="space-y-6 px-6 py-8 lg:px-10">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active Reports"
          value={String(moderationStats.activeReports.value)}
          badge={moderationStats.activeReports.change}
          accent
        />
        <StatCard
          label="Pending Review"
          value={String(moderationStats.pendingReview.value)}
        />
        <StatCard
          label="Urgent (Crisis)"
          value={String(moderationStats.urgentCrisis.value).padStart(2, '0')}
          urgent
        />
        <StatCard
          label="Avg. Response"
          value={moderationStats.avgResponse.value}
        />
      </section>

      <div className="flex flex-col gap-6 xl:flex-row">
        <section className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {reportTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
                    activeTab === tab
                      ? 'bg-[#3e5219] text-white'
                      : 'bg-white text-[#45483c] hover:bg-[#d6e7a1]/40',
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-[#c5c8b8]/50 bg-white px-4 py-2 text-sm font-medium text-[#45483c]"
              >
                <Filter className="size-4" />
                Filter By
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-[#c5c8b8]/50 bg-white px-4 py-2 text-sm font-medium text-[#45483c]"
              >
                <SlidersHorizontal className="size-4" />
                Sort
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[20px] border border-[#c5c8b8]/30 bg-white shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="border-b border-[#c5c8b8]/30 bg-[#f5f3f3]/60 text-xs font-bold uppercase tracking-wide text-[#45483c]">
                  <tr>
                    <th className="px-5 py-4">Report ID</th>
                    <th className="px-5 py-4">Reporter</th>
                    <th className="px-5 py-4">Target (User/Post)</th>
                    <th className="px-5 py-4">Reason</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Severity</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => (
                    <ReportRow
                      key={report.id}
                      report={report}
                      selected={selectedId === report.id}
                      onSelect={() => setSelectedId(report.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-3 border-t border-[#c5c8b8]/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#45483c]">
                Showing 1–{filteredReports.length} of {moderationStats.activeReports.value}{' '}
                reports
              </p>
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={cn(
                      'flex size-8 items-center justify-center rounded-lg text-sm font-semibold',
                      page === 1
                        ? 'bg-[#3e5219] text-white'
                        : 'bg-[#efeded] text-[#45483c] hover:bg-[#d6e7a1]/50',
                    )}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="w-full shrink-0 space-y-4 xl:w-80">
          <article className="rounded-[20px] border border-[#c5c8b8]/30 bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold text-[#1b1c1c]">{selected.target}</p>
              {selected.isUrgent && (
                <span className="rounded-full bg-[#ffdad6] px-2.5 py-1 text-xs font-bold text-[#93000a]">
                  URGENT CASE
                </span>
              )}
            </div>
            <blockquote className="border-l-4 border-[#3e5219]/30 pl-4 text-sm italic leading-relaxed text-[#45483c]">
              {selected.content}
            </blockquote>
            <p className="mt-4 text-xs text-[#45483c]">
              Posted {selected.postedAt} in &apos;{selected.community}&apos;
            </p>

            <div className="mt-6 rounded-2xl bg-[#f5f3f3] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#45483c]/70">
                System Insights
              </p>
              <ul className="mt-3 space-y-2 text-sm text-[#1b1c1c]">
                <li>
                  <span className="text-[#45483c]">Sentiment:</span> {selected.sentiment}
                </li>
                <li>
                  <span className="text-[#45483c]">Prev. Flags:</span> {selected.prevFlags}
                </li>
                <li>
                  <span className="text-[#45483c]">Trusted Reporter:</span> {selected.trustedReporter}{' '}
                  ({selected.trustedReporterScore}%)
                </li>
              </ul>
            </div>
          </article>

          <article className="rounded-[20px] border border-[#c5c8b8]/30 bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
            <h3 className="text-2xl font-semibold text-[#1b1c1c]">Resolution Tools</h3>
            <div className="mt-4 space-y-3">
              <ActionButton
                label="Initiate Wellness Check"
                variant="danger"
                icon={HeartPulse}
              />
              <ActionButton label="Warn User" icon={AlertTriangle} />
              <ActionButton label="Remove Content" icon={ShieldAlert} />
              <ActionButton label="Suspend Account" icon={UserX} />
              <ActionButton label="Dismiss Report" variant="outline" />
            </div>
          </article>
        </aside>
      </div>

      <footer className="border-t border-[#c5c8b8]/50 pt-6 text-xs text-[#45483c]">
        <p>
          © 2024 Munity Peer Support. For emergencies, contact local crisis services
          immediately.
        </p>
        <div className="mt-2 flex flex-wrap gap-4 font-medium">
          <a href="/emergency" className="hover:text-[#3e5219]">
            Emergency Support
          </a>
          <a href="#" className="hover:text-[#3e5219]">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-[#3e5219]">
            Terms of Service
          </a>
          <a href="#" className="hover:text-[#3e5219]">
            Help Center
          </a>
        </div>
      </footer>
    </div>
  )
}

function StatCard({
  label,
  value,
  badge,
  accent,
  urgent,
}: {
  label: string
  value: string
  badge?: string
  accent?: boolean
  urgent?: boolean
}) {
  return (
    <article className="rounded-[20px] border border-[#c5c8b8]/30 bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
      <p className="text-sm uppercase tracking-wider text-[#45483c]">{label}</p>
      <div className="mt-2 flex items-end justify-between">
        <p
          className={cn(
            'text-5xl font-bold tracking-tight',
            urgent ? 'text-[#ba1a1a]' : accent ? 'text-[#3e5219]' : 'text-[#474836]',
          )}
        >
          {value}
        </p>
        {badge && (
          <span className="rounded-lg bg-[#d6e7a1] px-2 py-1 text-sm text-[#56642b]">
            {badge}
          </span>
        )}
      </div>
    </article>
  )
}

function ReportRow({
  report,
  selected,
  onSelect,
}: {
  report: ModerationReport
  selected: boolean
  onSelect: () => void
}) {
  return (
    <tr
      onClick={onSelect}
      className={cn(
        'cursor-pointer border-b border-[#c5c8b8]/20 transition-colors last:border-0',
        selected ? 'bg-[#d6e7a1]/25' : 'hover:bg-[#f5f3f3]/60',
      )}
    >
      <td className="px-5 py-4 font-mono text-xs font-semibold text-[#3e5219]">
        #{report.id}
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-[#d6e7a1] text-xs font-bold text-[#3e5219]">
            {report.reporterInitials}
          </span>
          <span className="font-medium text-[#1b1c1c]">{report.reporter}</span>
        </div>
      </td>
      <td className="px-5 py-4">
        <p className="font-medium text-[#1b1c1c]">{report.target}</p>
        <p className="text-xs text-[#45483c]">{report.targetLabel}</p>
      </td>
      <td className="px-5 py-4 text-[#45483c]">{report.reason}</td>
      <td className="px-5 py-4">
        <span
          className={cn(
            'rounded-full px-2.5 py-1 text-xs font-semibold',
            statusStyles[report.status],
          )}
        >
          {report.status}
        </span>
      </td>
      <td className="px-5 py-4">
        <span
          className={cn(
            'rounded-full px-2.5 py-1 text-xs font-bold uppercase',
            severityStyles[report.severity],
          )}
        >
          {report.severity}
        </span>
      </td>
      <td className="px-5 py-4">
        <button
          type="button"
          className="rounded-lg bg-[#3e5219] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
        >
          Review
        </button>
      </td>
    </tr>
  )
}

function ActionButton({
  label,
  icon: Icon,
  variant = 'default',
}: {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  variant?: 'default' | 'danger' | 'outline'
}) {
  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-medium transition-opacity hover:opacity-90',
        variant === 'danger' && 'bg-[#ba1a1a] text-white shadow-md',
        variant === 'default' && 'bg-[#3e5219] text-white',
        variant === 'outline' &&
          'border border-[#c5c8b8] bg-white text-[#45483c] hover:bg-[#f5f3f3]',
      )}
    >
      {Icon && <Icon className="size-4" />}
      {label}
    </button>
  )
}
