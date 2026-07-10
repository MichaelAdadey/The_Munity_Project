export type ReportStatus = 'Pending' | 'In Review' | 'Resolved'
export type ReportSeverity = 'Urgent' | 'Critical' | 'Medium' | 'Low'

export type ModerationReport = {
  id: string
  reporter: string
  reporterInitials: string
  target: string
  targetLabel: string
  reason: string
  status: ReportStatus
  severity: ReportSeverity
  content: string
  postedAt: string
  community: string
  sentiment: string
  prevFlags: number
  trustedReporter: string
  trustedReporterScore: number
  isUrgent: boolean
}

export const moderationStats = {
  activeReports: { value: 42, change: '+5 today' },
  pendingReview: { value: 18 },
  urgentCrisis: { value: 3 },
  avgResponse: { value: '14m' },
}

export const moderationReports: ModerationReport[] = [
  {
    id: 'REP-8492',
    reporter: 'Jane_Doe',
    reporterInitials: 'JD',
    target: '@Alex_Care',
    targetLabel: 'Post: "Feeling hopeless today..."',
    reason: 'Self-Harm',
    status: 'Pending',
    severity: 'Urgent',
    content:
      '"Everything just feels like too much today. I\'ve tried reaching out to my usual circles but I don\'t think I can do this anymore. It\'s just too quiet and the weight is too heavy."',
    postedAt: '14 minutes ago',
    community: 'General Support',
    sentiment: 'High Distress',
    prevFlags: 0,
    trustedReporter: 'Jane_Doe',
    trustedReporterScore: 98,
    isUrgent: true,
  },
  {
    id: 'REP-8491',
    reporter: 'Mike_L',
    reporterInitials: 'ML',
    target: '@CryptoBot23',
    targetLabel: 'Comment: "Check my link for..."',
    reason: 'Spam',
    status: 'In Review',
    severity: 'Low',
    content: 'Promotional link shared repeatedly across multiple community threads.',
    postedAt: '2 hours ago',
    community: 'General Support',
    sentiment: 'Neutral',
    prevFlags: 2,
    trustedReporter: 'Mike_L',
    trustedReporterScore: 76,
    isUrgent: false,
  },
  {
    id: 'REP-8490',
    reporter: 'Sarah_T',
    reporterInitials: 'ST',
    target: '@User900',
    targetLabel: 'Direct Message',
    reason: 'Harassment',
    status: 'Pending',
    severity: 'Medium',
    content: 'Reported for repeated hostile messages sent via direct message.',
    postedAt: '4 hours ago',
    community: 'Direct Message',
    sentiment: 'Elevated',
    prevFlags: 1,
    trustedReporter: 'Sarah_T',
    trustedReporterScore: 91,
    isUrgent: false,
  },
]

export const reportTabs = ['All Reports', 'Pending', 'In Review', 'Resolved'] as const
