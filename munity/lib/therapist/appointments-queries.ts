import { createClient } from "../supabase/server";

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type AppointmentItem = {
  bookingId: string;
  name: string;
  patientId: string;
  avatar: string;
  type: "video" | "chat";
  status: AppointmentStatus;
  /** Raw timestamp — feeds the reschedule input and calendar-day grouping. */
  scheduledAt: string;
  time: string;
  isToday: boolean;
  isPast: boolean;
};

export type AppointmentGroup = {
  day: string;
  items: AppointmentItem[];
};

const FALLBACK_AVATAR = "/images/profile/avatar.jpg";

type BookingRow = {
  id: string;
  scheduled_at: string;
  status: string;
  session_type: string | null;
  patient_id: string | null;
};
type ProfileRow = { id: string; first_name: string; last_name: string; avatar_url: string | null };

const dayLabel = (date: Date, today: Date, tomorrow: Date) => {
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return date.toLocaleDateString([], {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
};

async function attachPatientNames(
  supabase: Awaited<ReturnType<typeof createClient>>,
  bookings: BookingRow[],
) {
  const patientIds = Array.from(
    new Set(bookings.map((b) => b.patient_id).filter((id): id is string => !!id)),
  );

  const { data: patientProfiles } =
    patientIds.length > 0
      ? await supabase.from("profiles").select("id, first_name, last_name, avatar_url").in("id", patientIds)
      : { data: [] as ProfileRow[] };

  const nameById = new Map(
    (patientProfiles ?? []).map((p) => [p.id, `${p.first_name} ${p.last_name}`.trim()]),
  );
  const avatarById = new Map((patientProfiles ?? []).map((p) => [p.id, p.avatar_url]));

  return { nameById, avatarById };
}

function toAppointmentItem(
  booking: BookingRow,
  nameById: Map<string, string>,
  avatarById: Map<string, string | null>,
  now: Date,
): AppointmentItem {
  const scheduledAt = new Date(booking.scheduled_at);
  return {
    bookingId: booking.id,
    name: nameById.get(booking.patient_id ?? "") || "Unknown Patient",
    patientId: booking.patient_id ?? "",
    avatar: avatarById.get(booking.patient_id ?? "") || FALLBACK_AVATAR,
    type: (booking.session_type ?? "video") as "video" | "chat",
    status: booking.status as AppointmentStatus,
    scheduledAt: booking.scheduled_at,
    time: scheduledAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    isToday: scheduledAt.toDateString() === now.toDateString(),
    isPast: scheduledAt.getTime() < now.getTime(),
  };
}

/** Pending + confirmed bookings over the next 14 days, grouped by day — feeds the list view. */
export const getAppointmentGroups = async (userId: string): Promise<AppointmentGroup[]> => {
  const supabase = await createClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const rangeEnd = new Date(today);
  rangeEnd.setDate(rangeEnd.getDate() + 14);

  const { data: bookingsRaw, error } = await supabase
    .from("bookings")
    .select("id, scheduled_at, status, session_type, patient_id")
    .eq("therapist_id", userId)
    .in("status", ["confirmed", "pending"])
    .gte("scheduled_at", today.toISOString())
    .lte("scheduled_at", rangeEnd.toISOString())
    .order("scheduled_at", { ascending: true });

  if (error) throw new Error(error.message);

  const bookings = (bookingsRaw ?? []) as BookingRow[];
  const { nameById, avatarById } = await attachPatientNames(supabase, bookings);
  const now = new Date();

  const groupsMap = new Map<string, AppointmentItem[]>();
  for (const booking of bookings) {
    const label = dayLabel(new Date(booking.scheduled_at), today, tomorrow);
    const item = toAppointmentItem(booking, nameById, avatarById, now);
    if (!groupsMap.has(label)) groupsMap.set(label, []);
    groupsMap.get(label)!.push(item);
  }

  return Array.from(groupsMap.entries()).map(([day, items]) => ({ day, items }));
};
