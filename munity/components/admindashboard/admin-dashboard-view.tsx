'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Info,
} from 'lucide-react'
import { GrowthChart, KpiCard, SessionTypesChart } from '@/components/admindashboard/admin-charts'
import {
  activeCommunities,
  adminAlerts,
  adminKpis,
  growthMonths,
  growthPoints,
  platformHealth,
  sessionTypes,
} from '@/lib/admin-data'
import { cn } from '@/lib/utils'

const alertIcons = {
  critical: AlertTriangle,
  info: Info,
  success: CheckCircle2,
}

const alertStyles = {
  critical: 'bg-[#ffdad6]/30 text-[#ba1a1a]',
  info: 'bg-[#efeded] text-[#3e5219]',
  success: 'bg-[#d6e7a1]/40 text-[#3e5219]',
}

export function AdminDashboardView() {
  const [chartRange, setChartRange] = useState<'weekly' | 'monthly'>('monthly')

  return (
    <div className="space-y-8 px-6 py-8 lg:px-10">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {adminKpis.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-[20px] border border-[#e5e5e1] bg-white/70 p-6 shadow-[0_4px_20px_rgba(85,107,47,0.05)] backdrop-blur-sm xl:col-span-2">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[#1b1c1c]">
                User Growth &amp; Retention
              </h2>
              <p className="mt-1 text-base text-[#45483c]">
                Data visualized over the last 6 months
              </p>
            </div>
            <div className="flex gap-2">
              {(['weekly', 'monthly'] as const).map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setChartRange(range)}
                  className={cn(
                    'rounded-lg px-3 py-1 text-xs font-medium capitalize transition-colors',
                    chartRange === range
                      ? 'bg-[#3e5219] text-white shadow-sm'
                      : 'bg-[#eae8e7] text-[#1b1c1c] hover:bg-[#d6e7a1]/50',
                  )}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <GrowthChart months={growthMonths} points={growthPoints} />
        </article>

        <article className="rounded-[20px] border border-[#e5e5e1] bg-white/70 p-6 shadow-[0_4px_20px_rgba(85,107,47,0.05)] backdrop-blur-sm">
          <h2 className="text-2xl font-semibold text-[#1b1c1c]">Session Types</h2>
          <p className="mt-1 mb-8 text-base text-[#45483c]">Preferred mode of therapy</p>
          <SessionTypesChart types={sessionTypes} total="3.1k" />
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-12">
        <article className="rounded-[20px] border border-[#e5e5e1] bg-white/70 p-6 shadow-[0_4px_20px_rgba(85,107,47,0.05)] backdrop-blur-sm xl:col-span-4">
          <h2 className="mb-6 text-2xl font-semibold text-[#1b1c1c]">Platform Health</h2>
          <div className="space-y-4">
            {platformHealth.map((metric) => (
              <div key={metric.label} className="rounded-2xl bg-[#f5f3f3] p-4">
                {metric.status === 'optimal' ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="size-2 rounded-full bg-[#1b5e20]" />
                      <div>
                        <p className="text-sm font-semibold text-[#1b1c1c]">{metric.label}</p>
                        <p className="text-[10px] text-[#45483c]">{metric.detail}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#3e5219]">{metric.value}</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#1b1c1c]">{metric.label}</p>
                      <span className="text-sm font-semibold text-[#3e5219]">{metric.value}</span>
                    </div>
                    {metric.progress !== undefined && (
                      <div className="h-1.5 overflow-hidden rounded-full bg-[#efeded]">
                        <div
                          className="h-full rounded-full bg-[#3e5219]"
                          style={{ width: `${metric.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[20px] border border-[#e5e5e1] bg-white/70 p-6 shadow-[0_4px_20px_rgba(85,107,47,0.05)] backdrop-blur-sm xl:col-span-4">
          <div className="mb-6 flex items-start justify-between">
            <h2 className="text-2xl font-semibold leading-tight text-[#1b1c1c]">
              Most Active
              <br />
              Communities
            </h2>
            <button
              type="button"
              className="text-sm font-semibold text-[#3e5219] hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-5">
            {activeCommunities.map((community) => (
              <div key={community.name}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-[#1b1c1c]">{community.name}</span>
                  <span className="text-[#45483c]">{community.members}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-[#efeded]">
                  <div
                    className="h-full rounded-full bg-[#3e5219]"
                    style={{ width: `${community.fill}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[20px] border border-[#e5e5e1] bg-white/70 p-6 shadow-[0_4px_20px_rgba(85,107,47,0.05)] backdrop-blur-sm xl:col-span-4">
          <h2 className="mb-6 text-2xl font-semibold text-[#1b1c1c]">Recent Alerts</h2>
          <ul className="max-h-80 space-y-4 overflow-y-auto pr-1">
            {adminAlerts.map((alert) => {
              const Icon = alertIcons[alert.variant]
              return (
                <li
                  key={alert.id}
                  className="flex gap-3 border-b border-[#c5c8b8]/30 pb-4 last:border-0 last:pb-0"
                >
                  <div
                    className={cn(
                      'flex size-8 shrink-0 items-center justify-center rounded-full',
                      alertStyles[alert.variant],
                    )}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#1b1c1c]">{alert.title}</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-[#45483c]">
                      {alert.description}
                    </p>
                    <p className="mt-2 text-[10px] text-[#45483c]/70">{alert.time}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </article>
      </section>
    </div>
  )
}
