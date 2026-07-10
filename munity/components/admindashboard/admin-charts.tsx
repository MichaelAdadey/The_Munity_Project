import {
  Activity,
  AlertTriangle,
  CalendarCheck,
  TrendingUp,
  Users,
} from 'lucide-react'
import type { AdminKpi } from '@/lib/admin-data'
import { cn } from '@/lib/utils'

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  users: Users,
  signups: TrendingUp,
  sessions: CalendarCheck,
  engagement: Activity,
  safety: AlertTriangle,
}

export function KpiCard({ kpi }: { kpi: AdminKpi }) {
  const Icon = icons[kpi.id] ?? Activity
  const isSafety = kpi.id === 'safety'

  return (
    <article
      className={cn(
        'flex flex-col gap-3 rounded-[20px] border border-[#e5e5e1] bg-white/70 p-5 shadow-[0_4px_20px_rgba(85,107,47,0.05)] backdrop-blur-sm',
        kpi.accent && 'border-l-4 border-l-[#3e5219]',
        isSafety && 'border-l-4 border-l-[#ba1a1a]',
      )}
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            'flex size-10 items-center justify-center rounded-xl',
            isSafety ? 'bg-[#ffdad6]/50 text-[#ba1a1a]' : 'bg-[#d6e7a1]/40 text-[#3e5219]',
          )}
        >
          <Icon className="size-5" />
        </div>
        {kpi.change && (
          <span
            className={cn(
              'text-xs font-bold',
              kpi.changePositive ? 'text-[#56642b]' : 'text-[#ba1a1a]',
            )}
          >
            {kpi.change}
          </span>
        )}
        {kpi.priority && (
          <span className="text-xs font-bold text-[#ba1a1a]">{kpi.priority}</span>
        )}
      </div>
      <div>
        <p className="text-sm uppercase tracking-wider text-[#45483c]">{kpi.label}</p>
        <p className="mt-1 text-2xl font-semibold text-[#1b1c1c]">{kpi.value}</p>
      </div>
    </article>
  )
}

export function GrowthChart({
  months,
  points,
}: {
  months: string[]
  points: number[]
}) {
  const max = Math.max(...points)
  const width = 100
  const height = 60
  const step = width / (points.length - 1)

  const linePath = points
    .map((p, i) => {
      const x = i * step
      const y = height - (p / max) * height
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')

  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`

  return (
    <div className="relative h-56 w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3e5219" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3e5219" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#growthFill)" />
        <path d={linePath} fill="none" stroke="#3e5219" strokeWidth="1.5" />
      </svg>
      <div className="mt-4 flex justify-between text-xs font-medium text-[#45483c]">
        {months.map((month) => (
          <span key={month}>{month}</span>
        ))}
      </div>
    </div>
  )
}

export function SessionTypesChart({
  types,
  total,
}: {
  types: { label: string; percent: number; color: string }[]
  total: string
}) {
  let cumulative = 0
  const segments = types.map((type) => {
    const start = cumulative
    cumulative += type.percent
    return { ...type, start, end: cumulative }
  })

  const gradient = segments
    .map((s) => `${s.color} ${s.start}% ${s.end}%`)
    .join(', ')

  return (
    <div className="flex flex-col items-center gap-8">
      <div
        className="relative flex size-40 items-center justify-center rounded-full"
        style={{ background: `conic-gradient(${gradient})` }}
      >
        <div className="flex size-24 flex-col items-center justify-center rounded-full bg-white text-center">
          <span className="text-xl font-bold text-[#1b1c1c]">{total}</span>
          <span className="text-[10px] font-medium uppercase tracking-wide text-[#45483c]">
            Total Sessions
          </span>
        </div>
      </div>
      <ul className="w-full space-y-3">
        {types.map((type) => (
          <li key={type.label} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span
                className="size-3 rounded-full"
                style={{ backgroundColor: type.color }}
              />
              <span className="text-[#1b1c1c]">{type.label}</span>
            </div>
            <span className="font-semibold text-[#3e5219]">{type.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}