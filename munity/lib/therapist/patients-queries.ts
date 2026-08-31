import { createClient } from "../supabase/server";

export type TherapistPatient = {
  id: string;
  /** Same value as `id` — kept as `slug` so it drops straight into the existing patient-detail views/routes. */
  slug: string;
  name: string;
  email: string;
  clientId: string;
  avatar: string;
  status: "Active" | "Inactive";
  sessionCount: number;
  lastSessionAt: string | null;
  lastSessionLabel: string;
  nextSessionAt: string | null;
  nextSessionLabel: string | null;
  memberSince: string;
};

const FALLBACK_AVATAR = "/images/profile/avatar.jpg";
const ACTIVE_WINDOW_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

type BookingRow = { patient_id: string | null; scheduled_at: string; status: string };
type ProfileRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
};

function clientIdFor(id: string) {
  return `#${id.slice(0, 6).toUpperCase()}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function buildPatients(bookings: BookingRow[], profiles: ProfileRow[]): TherapistPatient[] {
  const profileById = new Map(profiles.map((p) => [p.id, p]));
  const now = Date.now();

  const byPatient = new Map<string, BookingRow[]>();
  for (const booking of bookings) {
    if (!booking.patient_id) continue;
    const list = byPatient.get(booking.patient_id) ?? [];
    list.push(booking);
    byPatient.set(booking.patient_id, list);
  }

  const patients: TherapistPatient[] = [];
  for (const [patientId, rows] of byPatient) {
    const profile = profileById.get(patientId);
    if (!profile) continue;

    const sorted = [...rows].sort(
      (a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime(),
    );
    const lastSession = sorted.find((r) => new Date(r.scheduled_at).getTime() <= now) ?? null;
    const nextSession =
      [...sorted]
        .filter(
          (r) =>
            new Date(r.scheduled_at).getTime() > now &&
            (r.status === "confirmed" || r.status === "pending"),
        )
        .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())[0] ??
      null;

    const isActive =
      Boolean(nextSession) ||
      (lastSession ? now - new Date(lastSession.scheduled_at).getTime() < ACTIVE_WINDOW_MS : false);

    patients.push({
      id: patientId,
      slug: patientId,
      name: `${profile.first_name} ${profile.last_name}`.trim() || "Unknown Patient",
      email: profile.email,
      clientId: clientIdFor(patientId),
      avatar: profile.avatar_url || FALLBACK_AVATAR,
      status: isActive ? "Active" : "Inactive",
      sessionCount: rows.length,
      lastSessionAt: lastSession?.scheduled_at ?? null,
      lastSessionLabel: lastSession ? formatDate(lastSession.scheduled_at) : "No sessions yet",
      nextSessionAt: nextSession?.scheduled_at ?? null,
      nextSessionLabel: nextSession ? formatDate(nextSession.scheduled_at) : null,
      memberSince: profile.created_at
        ? new Date(profile.created_at).toLocaleDateString(undefined, {
            month: "long",
            year: "numeric",
          })
        : "Unknown",
    });
  }

  return patients.sort((a, b) => {
    const aTime = a.lastSessionAt ? new Date(a.lastSessionAt).getTime() : 0;
    const bTime = b.lastSessionAt ? new Date(b.lastSessionAt).getTime() : 0;
    return bTime - aTime;
  });
}

/** Every distinct patient who has ever booked with this therapist. */
export async function getTherapistPatients(therapistId: string): Promise<TherapistPatient[]> {
  const supabase = await createClient();

  const { data: bookingsRaw, error } = await supabase
    .from("bookings")
    .select("patient_id, scheduled_at, status")
    .eq("therapist_id", therapistId);

  if (error) throw new Error(error.message);

  const bookings = (bookingsRaw ?? []) as BookingRow[];
  const patientIds = Array.from(
    new Set(bookings.map((b) => b.patient_id).filter((id): id is string => !!id)),
  );

  if (patientIds.length === 0) return [];

  const { data: profilesRaw, error: profilesError } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, email, avatar_url, created_at")
    .in("id", patientIds);

  if (profilesError) throw new Error(profilesError.message);

  return buildPatients(bookings, (profilesRaw ?? []) as ProfileRow[]);
}

/**
 * A single patient, scoped to this therapist. Returns null both when the
 * patient doesn't exist AND when they've never booked with this therapist —
 * callers should treat both as "not found" so a therapist can't page through
 * other therapists' patients by guessing IDs in the URL.
 */
export async function getTherapistPatientById(
  therapistId: string,
  patientId: string,
): Promise<TherapistPatient | null> {
  const supabase = await createClient();

  const { data: bookingsRaw, error } = await supabase
    .from("bookings")
    .select("patient_id, scheduled_at, status")
    .eq("therapist_id", therapistId)
    .eq("patient_id", patientId);

  if (error) throw new Error(error.message);

  const bookings = (bookingsRaw ?? []) as BookingRow[];
  if (bookings.length === 0) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, email, avatar_url, created_at")
    .eq("id", patientId)
    .maybeSingle();

  if (profileError) throw new Error(profileError.message);
  if (!profile) return null;

  const [patient] = buildPatients(bookings, [profile as ProfileRow]);
  return patient ?? null;
}
