import { createClient } from "../supabase/server";

export type SessionBooking = {
  id: string;
  therapistId: string;
  therapistName: string;
  when: string;
  scheduledAt: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  priority: "low" | "normal" | "high" | "urgent";
  archived: boolean;
};

export const getMyBookings = async (
  userId: string,
): Promise<SessionBooking[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("id, therapist_id, scheduled_at, status, priority, archived")
    .eq("patient_id", userId)
    .order("scheduled_at", { ascending: false });

  if (error) throw new Error(error.message);

  const therapistIds = Array.from(
    new Set(
      (data ?? [])
        .map((b) => b.therapist_id)
        .filter((id): id is string => !!id),
    ),
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

  return (data ?? []).map((row) => {
    const scheduledAt = row.scheduled_at as string;
    const date = new Date(scheduledAt);
    const when = `${date.toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
    })}, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

    return {
      id: row.id as string,
      therapistId: row.therapist_id as string,
      therapistName:
        nameById.get(row.therapist_id as string) ?? "Unknown Therapist",
      when,
      scheduledAt,
      status: row.status as SessionBooking["status"],
      priority: row.priority as SessionBooking["priority"],
      archived: row.archived as boolean,
    };
  });
};
