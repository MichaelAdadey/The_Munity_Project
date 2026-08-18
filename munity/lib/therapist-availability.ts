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

export const AVAILABILITY_UPDATED_EVENT = "munity-therapist-availability-updated";

/** Demo therapist account that edits availability in the therapist app. */
export const DEMO_THERAPIST_AVAILABILITY_ID = "elena-aris";

const STORAGE_PREFIX = "munity-therapist-availability-v1:";

export const defaultWeeklyAvailability: WeeklyAvailability = {
  Mon: ["09:00 AM", "10:00 AM", "02:00 PM", "03:00 PM"],
  Tue: ["10:00 AM", "11:00 AM", "01:00 PM", "04:00 PM"],
  Wed: ["09:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"],
  Thu: ["10:00 AM", "11:00 AM", "02:00 PM"],
  Fri: ["09:00 AM", "10:00 AM", "01:00 PM", "02:00 PM"],
  Sat: ["10:00 AM"],
  Sun: [],
};

/** Slightly varied defaults so directory therapists feel distinct. */
const seededByTherapist: Record<string, WeeklyAvailability> = {
  "elena-aris": defaultWeeklyAvailability,
  "elena-vance": {
    Mon: ["10:00 AM", "11:00 AM", "02:00 PM"],
    Tue: ["09:00 AM", "10:00 AM", "03:00 PM"],
    Wed: ["11:00 AM", "01:00 PM", "04:00 PM"],
    Thu: ["09:00 AM", "02:00 PM", "03:00 PM"],
    Fri: ["10:00 AM", "11:00 AM"],
    Sat: ["09:00 AM", "10:00 AM"],
    Sun: [],
  },
  "marcus-thorne": {
    Mon: ["01:00 PM", "02:00 PM", "03:00 PM"],
    Tue: ["10:00 AM", "11:00 AM", "04:00 PM"],
    Wed: ["09:00 AM", "10:00 AM", "02:00 PM"],
    Thu: ["01:00 PM", "02:00 PM"],
    Fri: ["09:00 AM", "03:00 PM", "04:00 PM"],
    Sat: [],
    Sun: [],
  },
  "sarah-jenkins": {
    Mon: ["09:00 AM", "04:00 PM", "05:00 PM"],
    Tue: ["10:00 AM", "11:00 AM", "04:00 PM"],
    Wed: ["09:00 AM", "10:00 AM", "02:00 PM"],
    Thu: ["11:00 AM", "01:00 PM", "04:00 PM"],
    Fri: ["09:00 AM", "10:00 AM", "03:00 PM"],
    Sat: ["10:00 AM", "11:00 AM"],
    Sun: [],
  },
  "james-wilson": {
    Mon: ["09:00 AM", "10:00 AM"],
    Tue: ["09:00 AM", "11:00 AM"],
    Wed: ["10:00 AM", "11:00 AM"],
    Thu: ["09:00 AM", "10:00 AM"],
    Fri: ["09:00 AM"],
    Sat: [],
    Sun: [],
  },
  "ama-okai": {
    Mon: [],
    Tue: ["02:00 PM", "03:00 PM", "04:00 PM"],
    Wed: ["01:00 PM", "02:00 PM"],
    Thu: ["03:00 PM", "04:00 PM", "05:00 PM"],
    Fri: ["11:00 AM", "01:00 PM"],
    Sat: ["10:00 AM", "11:00 AM", "01:00 PM"],
    Sun: ["10:00 AM"],
  },
};

function storageKey(therapistId: string) {
  return `${STORAGE_PREFIX}${therapistId}`;
}

function cloneSchedule(schedule: WeeklyAvailability): WeeklyAvailability {
  return {
    Mon: [...schedule.Mon],
    Tue: [...schedule.Tue],
    Wed: [...schedule.Wed],
    Thu: [...schedule.Thu],
    Fri: [...schedule.Fri],
    Sat: [...schedule.Sat],
    Sun: [...schedule.Sun],
  };
}

function normalizeSchedule(value: unknown): WeeklyAvailability | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const next = cloneSchedule(defaultWeeklyAvailability);
  for (const day of weekDays) {
    const slots = record[day];
    if (!Array.isArray(slots)) continue;
    next[day] = slots.filter((slot): slot is string => typeof slot === "string");
  }
  return next;
}

function seedForTherapist(therapistId: string): WeeklyAvailability {
  return cloneSchedule(seededByTherapist[therapistId] ?? defaultWeeklyAvailability);
}

export function getTherapistAvailability(therapistId: string): WeeklyAvailability {
  if (typeof window === "undefined") {
    return seedForTherapist(therapistId);
  }

  try {
    const raw = localStorage.getItem(storageKey(therapistId));
    if (!raw) return seedForTherapist(therapistId);
    const parsed = normalizeSchedule(JSON.parse(raw) as unknown);
    return parsed ?? seedForTherapist(therapistId);
  } catch {
    return seedForTherapist(therapistId);
  }
}

export function saveTherapistAvailability(
  therapistId: string,
  schedule: WeeklyAvailability,
) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(storageKey(therapistId), JSON.stringify(cloneSchedule(schedule)));
    window.dispatchEvent(
      new CustomEvent(AVAILABILITY_UPDATED_EVENT, { detail: { therapistId } }),
    );
  } catch {
    // Preview mode can continue without localStorage.
  }
}

export function getOpenSlotsForDay(therapistId: string, day: WeekDay): string[] {
  const schedule = getTherapistAvailability(therapistId);
  return [...schedule[day]].sort(
    (a, b) => timeSlots.indexOf(a as TimeSlot) - timeSlots.indexOf(b as TimeSlot),
  );
}

export type BookableDay = {
  day: WeekDay;
  /** Calendar date for this occurrence */
  date: Date;
  /** Short label e.g. "Mon 14 Jul" */
  label: string;
  slots: string[];
};

export function weekdayFromDate(date: Date): WeekDay {
  // JS: 0 = Sunday … 6 = Saturday
  const map: WeekDay[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return map[date.getDay()]!;
}

export function formatDayLabel(date: Date, day: WeekDay) {
  const month = date.toLocaleDateString("en-GB", { month: "short" });
  return `${day} ${date.getDate()} ${month}`;
}

/** Next 7 days that have at least one open slot for this therapist. */
export function getUpcomingBookableDays(
  therapistId: string,
  from = new Date(),
): BookableDay[] {
  const schedule = getTherapistAvailability(therapistId);
  const start = new Date(from);
  start.setHours(0, 0, 0, 0);

  const days: BookableDay[] = [];
  for (let offset = 0; offset < 14 && days.length < 7; offset += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + offset);
    const day = weekdayFromDate(date);
    const slots = [...schedule[day]].sort(
      (a, b) => timeSlots.indexOf(a as TimeSlot) - timeSlots.indexOf(b as TimeSlot),
    );
    if (slots.length === 0) continue;
    days.push({
      day,
      date,
      label: formatDayLabel(date, day),
      slots,
    });
  }
  return days;
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
