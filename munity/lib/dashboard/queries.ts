import { createClient } from "../supabase/server";

export type UpcomingItem = {
  id: string;
  title: string;
  time: string;
  type: "Therapy";
  href: string;
};

export type DashboardBookingData = {
  sessionsBookedCount: number;
  upcoming: UpcomingItem[];
};

export const getDashboardBookingData = async (
  userId: string,
): Promise<DashboardBookingData> => {
  const supabase = await createClient();

  const { data: bookingsRaw, error } = await supabase
    .from("bookings")
    .select("id, therapist_id, scheduled_at, status")
    .eq("patient_id", userId)
    .in("status", ["confirmed", "pending"])
    .gte("scheduled_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true });

  if (error) throw new Error(error.message);

  const rows = bookingsRaw ?? [];

  const therapistIds = Array.from(
    new Set(rows.map((b) => b.therapist_id).filter((id): id is string => !!id)),
  );

  const { data: therapistProfiles } =
    therapistIds.length > 0
      ? await supabase
          .from("profiles")
          .select("id, first_name, last_name")
          .in("id", therapistIds)
      : { data: [] as { id: string; first_name: string; last_name: string }[] };

  const nameById = new Map(
    (therapistProfiles ?? []).map((p) => [
      p.id,
      `${p.first_name} ${p.last_name}`.trim(),
    ]),
  );

  const upcoming: UpcomingItem[] = rows.slice(0, 3).map((row) => {
    const scheduledAt = new Date(row.scheduled_at as string);
    const now = new Date();
    const isToday = scheduledAt.toDateString() === now.toDateString();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = scheduledAt.toDateString() === tomorrow.toDateString();

    const dayLabel = isToday
      ? "Today"
      : isTomorrow
        ? "Tomorrow"
        : scheduledAt.toLocaleDateString(undefined, {
            weekday: "short",
            day: "numeric",
            month: "short",
          });
    const timeLabel = scheduledAt.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
    const therapistName =
      nameById.get(row.therapist_id as string) ?? "Unknown Therapist";

    return {
      id: row.id as string,
      title: `Session with ${therapistName}`,
      time: `${dayLabel} · ${timeLabel}`,
      type: "Therapy",
      href: "/Therapy",
    };
  });

  return { sessionsBookedCount: rows.length, upcoming };
};
