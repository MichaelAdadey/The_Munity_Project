export type AttendanceSession = {
  bookingId: string;
  scheduledAt: string;
  attended: boolean;
};

export type SessionsBucket = {
  label: string;
  count: number;
};

export type PatientProgress = {
  /** Sessions actually held (status "completed") within the selected range. */
  totalSessions: number;
  /** completed / (completed + cancelled) within the range, as a whole percent. Null with no decided sessions yet. */
  attendanceRatePercent: number | null;
  /** Most recent decided (completed/cancelled) sessions within the range, oldest first. */
  attendance: AttendanceSession[];
  /** Completed sessions bucketed by week (short ranges) or month. */
  sessionsOverTime: SessionsBucket[];
};

export type BookingRow = { id: string; scheduled_at: string; status: string };

const MAX_ATTENDANCE_BARS = 10;

function bucketLabel(date: Date, weekly: boolean) {
  if (weekly) {
    const day = Math.floor(date.getTime() / (1000 * 60 * 60 * 24 * 7));
    return `Wk of ${new Date(day * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
  }
  return date.toLocaleDateString(undefined, { month: "short", year: "2-digit" });
}

/** Shared derivation used by both the server query and the client refetch action. */
export function buildProgress(
  bookings: BookingRow[],
  rangeStart: Date,
  rangeEnd: Date,
): PatientProgress {
  const decided = bookings.filter((b) => b.status === "completed" || b.status === "cancelled");
  const completed = decided.filter((b) => b.status === "completed");

  const attendance: AttendanceSession[] = decided.slice(-MAX_ATTENDANCE_BARS).map((b) => ({
    bookingId: b.id,
    scheduledAt: b.scheduled_at,
    attended: b.status === "completed",
  }));

  const attendanceRatePercent =
    decided.length > 0 ? Math.round((completed.length / decided.length) * 100) : null;

  const rangeDays = (rangeEnd.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24);
  const weekly = rangeDays <= 45;

  const bucketOrder: string[] = [];
  const bucketCounts = new Map<string, number>();
  for (const booking of completed) {
    const label = bucketLabel(new Date(booking.scheduled_at), weekly);
    if (!bucketCounts.has(label)) {
      bucketCounts.set(label, 0);
      bucketOrder.push(label);
    }
    bucketCounts.set(label, bucketCounts.get(label)! + 1);
  }

  return {
    totalSessions: completed.length,
    attendanceRatePercent,
    attendance,
    sessionsOverTime: bucketOrder.map((label) => ({ label, count: bucketCounts.get(label)! })),
  };
}

export const dateRangeOptions = [
  "Last 30 Days",
  "Last 3 Months",
  "Last 6 Months",
  "Last 12 Months",
] as const;

export type DateRangeOption = (typeof dateRangeOptions)[number];

/** Maps a date-range label to concrete start/end Dates, anchored on `now`. */
export function resolveDateRange(label: string, now = new Date()): { start: Date; end: Date } {
  const end = now;
  const start = new Date(now);
  switch (label) {
    case "Last 30 Days":
      start.setDate(start.getDate() - 30);
      break;
    case "Last 3 Months":
      start.setMonth(start.getMonth() - 3);
      break;
    case "Last 12 Months":
      start.setMonth(start.getMonth() - 12);
      break;
    case "Last 6 Months":
    default:
      start.setMonth(start.getMonth() - 6);
      break;
  }
  return { start, end };
}
