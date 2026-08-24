import { requireRole } from "@/lib/require-role";
import { createClient } from "@/lib/supabase/server";
import { routes } from "@/lib/routes";
import { TherapistDashboardView } from "@/components/therapistdashboard/TherapistDashboardView";

export default async function DashboardPage() {
  const { user, profile } = await requireRole(["therapist"], routes.therapistLogin);
  const supabase = await createClient();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  const [
    { count: upcomingSessions },
    { count: pendingRequests },
    { count: completedThisWeek },
    { data: therapistDetails },
    { data: todaysBookingsRaw },
    { data: recentBookingsRaw },
  ] = await Promise.all([
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("therapist_id", user.id)
      .eq("status", "confirmed")
      .gte("scheduled_at", new Date().toISOString()),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("therapist_id", user.id)
      .eq("status", "pending"),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("therapist_id", user.id)
      .eq("status", "completed")
      .gte("scheduled_at", startOfWeek.toISOString()),
    supabase.from("therapist_details").select("rating").eq("profile_id", user.id).single(),
    supabase
      .from("bookings")
      .select("id, scheduled_at, status, session_type, patient_id")
      .eq("therapist_id", user.id)
      .gte("scheduled_at", startOfToday.toISOString())
      .lte("scheduled_at", endOfToday.toISOString())
      .order("scheduled_at", { ascending: true }),
    supabase
      .from("bookings")
      .select("patient_id, scheduled_at")
      .eq("therapist_id", user.id)
      .order("scheduled_at", { ascending: false })
      .limit(20),
  ]);

  // Look up patient names in one extra query rather than a fragile embedded join.
  const patientIds = Array.from(
    new Set(
      [...(todaysBookingsRaw ?? []), ...(recentBookingsRaw ?? [])]
        .map((b) => b.patient_id)
        .filter((id): id is string => !!id),
    ),
  );

  const { data: patientProfiles } =
    patientIds.length > 0
      ? await supabase.from("profiles").select("id, first_name, last_name").in("id", patientIds)
      : { data: [] as { id: string; first_name: string; last_name: string }[] };

  const nameById = new Map(
    (patientProfiles ?? []).map((p) => [p.id, `${p.first_name} ${p.last_name}`.trim()]),
  );

  const todaysSchedule = (todaysBookingsRaw ?? []).map((booking) => ({
    bookingId: booking.id as string,
    name: nameById.get(booking.patient_id as string) ?? "Unknown Patient",
    patientId: booking.patient_id as string,
    type: (booking.session_type ?? "video") as "video" | "chat",
    time: new Date(booking.scheduled_at as string).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  // Dedupe to the 3 most recently-booked distinct patients.
  const seen = new Set<string>();
  const recentPatients: { patientId: string; name: string; lastSession: string }[] = [];
  for (const booking of recentBookingsRaw ?? []) {
    const pid = booking.patient_id as string | null;
    if (!pid || seen.has(pid)) continue;
    seen.add(pid);
    recentPatients.push({
      patientId: pid,
      name: nameById.get(pid) ?? "Unknown Patient",
      lastSession: new Date(booking.scheduled_at as string).toLocaleDateString(),
    });
    if (recentPatients.length >= 3) break;
  }

  return (
    <TherapistDashboardView
      therapistName={`${profile.first_name} ${profile.last_name}`.trim() || "Therapist"}
      stats={{
        upcomingSessions: upcomingSessions ?? 0,
        pendingRequests: pendingRequests ?? 0,
        completedThisWeek: completedThisWeek ?? 0,
        averageRating: therapistDetails?.rating ?? null,
      }}
      todaysSchedule={todaysSchedule}
      recentPatients={recentPatients}
    />
  );
}
