export const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export type WeekDay = (typeof weekDays)[number];

export const timeSlots = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
] as const;

export type TimeSlot = (typeof timeSlots)[number];

export type WeeklyAvailability = Record<WeekDay, string[]>;

export function weekdayFromDate(date: Date): WeekDay {
  // JS: 0 = Sunday … 6 = Saturday
  const map: WeekDay[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return map[date.getDay()]!;
}

export function formatDayLabel(date: Date, day: WeekDay) {
  const month = date.toLocaleDateString("en-GB", { month: "short" });
  return `${day} ${date.getDate()} ${month}`;
}

export function formatBookingWhen(dayLabel: string, time: string) {
  return `${dayLabel}, ${time}`;
}

/** Combine a calendar day with a display time like "03:00 PM" into an ISO string. */
export function bookingScheduledAt(date: Date, time: string): string {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  const next = new Date(date);
  if (!match) {
    next.setHours(9, 0, 0, 0);
    return next.toISOString();
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3]!.toUpperCase();
  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  next.setHours(hours, minutes, 0, 0);
  return next.toISOString();
}
