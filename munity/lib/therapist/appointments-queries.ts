import { createClient } from "../supabase/server";

export type AppointmentItem = {
  bookingId: string;
  name: string;
  patientId: string;
  type: "video" | "chat";
  time: string;
  isToday: boolean;
};

export type AppointmentGroup = {
  day: string;
  items: AppointmentItem[];
};

const dayLabel = (date: Date, today: Date, tomorrow: Date) => {
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return date.toLocaleDateString([], {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
};

export const getAppointmentGroups = async (
  userId: string,
): Promise<AppointmentGroup[]> => {
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

  const patientIds = Array.from(
    new Set(
      (bookingsRaw ?? [])
        .map((b) => b.patient_id)
        .filter((id): id is string => !!id),
    ),
  );

  const { data: patientProfiles } =
    patientIds.length > 0
      ? await supabase
          .from("profiles")
          .select("id, first_name, last_name")
          .in("id", patientIds)
      : { data: [] as { id: string; first_name: string; last_name: string }[] };

  const nameById = new Map(
    (patientProfiles ?? []).map((p) => [
      p.id,
      `${p.first_name} ${p.last_name}`.trim(),
    ]),
  );

  const groupsMap = new Map<string, AppointmentItem[]>();

  for (const booking of bookingsRaw ?? []) {
    const scheduledAt = new Date(booking.scheduled_at as string);
    const label = dayLabel(scheduledAt, today, tomorrow);
    const item: AppointmentItem = {
      bookingId: booking.id as string,
      name: nameById.get(booking.patient_id as string) ?? "Unknown Patient",
      patientId: booking.patient_id as string,
      type: (booking.session_type ?? "video") as "video" | "chat",
      time: scheduledAt.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isToday: label === "Today",
    };
    if (!groupsMap.has(label)) groupsMap.set(label, []);
    groupsMap.get(label)!.push(item);
  }

  return Array.from(groupsMap.entries()).map(([day, items]) => ({
    day,
    items,
  }));
};
