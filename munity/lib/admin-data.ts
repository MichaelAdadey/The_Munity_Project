export type AdminKpi = {
  id: string
  label: string
  value: string
  change?: string
  changePositive?: boolean
  priority?: string
  accent?: boolean
}

export type SessionType = {
  label: string
  percent: number
  color: string
}

export type ActiveCommunity = {
  name: string
  members: string
  fill: number
}

export type PlatformHealthMetric = {
  label: string
  detail?: string
  value: string
  progress?: number
  status?: 'optimal' | 'warning'
}

export type AdminAlert = {
  id: string
  title: string
  description: string
  time: string
  variant: 'critical' | 'info' | 'success'
}

export const adminKpis: AdminKpi[] = [
  {
    id: 'users',
    label: 'Total Active Users',
    value: '24,892',
    change: '+12%',
    changePositive: true,
    accent: true,
  },
  {
    id: 'signups',
    label: 'New Signups (7D)',
    value: '1,402',
    change: '+5.2%',
    changePositive: true,
  },
  {
    id: 'sessions',
    label: 'Sessions Booked',
    value: '3,120',
    change: '+8%',
    changePositive: true,
  },
  {
    id: 'engagement',
    label: 'Engagement Rate',
    value: '68.5%',
    change: '-1.4%',
    changePositive: false,
  },
  {
    id: 'safety',
    label: 'Safety Reports',
    value: '42',
    priority: 'High Priority',
  },
]

export const growthMonths = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN']

export const growthPoints = [42, 48, 55, 61, 72, 84]

export const sessionTypes: SessionType[] = [
  { label: 'Video Call', percent: 45, color: '#3e5219' },
  { label: 'Audio Chat', percent: 30, color: '#8fa84a' },
  { label: 'Text Message', percent: 25, color: '#d6e7a1' },
]

export const activeCommunities: ActiveCommunity[] = [
  { name: 'Anxiety Peer Support', members: '8.4k members', fill: 95 },
  { name: 'Depression & Resilience', members: '6.1k members', fill: 78 },
  { name: 'Post-Traumatic Growth', members: '4.8k members', fill: 62 },
  { name: 'Mindfulness & Meditators', members: '4.2k members', fill: 55 },
]

export const platformHealth: PlatformHealthMetric[] = [
  {
    label: 'Server Status',
    detail: 'Global uptime: 99.98%',
    value: 'Optimal',
    status: 'optimal',
  },
  {
    label: 'Mod Response Time',
    value: '12m 4s',
    progress: 85,
  },
  {
    label: 'Therapist Availability',
    value: '92%',
    progress: 92,
  },
]

export const adminAlerts: AdminAlert[] = [
  {
    id: 'a1',
    title: 'Critical Flag: User #829',
    description:
      "Potential high-risk trigger detected in 'Depression' community.",
    time: '2 minutes ago',
    variant: 'critical',
  },
  {
    id: 'a2',
    title: 'API Usage Spike',
    description: 'System performance remains stable at 90% load.',
    time: '15 minutes ago',
    variant: 'info',
  },
  {
    id: 'a3',
    title: 'New Therapist Verified',
    description: 'Dr. Aris Thorne (Credential ID: TH-001) has been onboarded.',
    time: '1 hour ago',
    variant: 'success',
  },
]
