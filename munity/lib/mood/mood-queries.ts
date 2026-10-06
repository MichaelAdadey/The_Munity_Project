import { createClient } from "../supabase/server";
import type { Mood } from "../types";
import { DISTRESS_MOODS } from "./mood-scale";

export type MoodEntryRow = {
  mood: Mood;
  note: string | null;
  createdAt: string;
};

type RawMoodRow = { user_id: string; mood: Mood; note: string | null; created_at: string };

function daysAgoIso(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

/** One patient's mood check-ins over the last `days` days, most recent first. RLS: own rows, or their therapist's. */
export async function getMoodEntriesForPatient(
  patientId: string,
  days = 30,
): Promise<MoodEntryRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mood_entries")
    .select("mood, note, created_at")
    .eq("user_id", patientId)
    .gte("created_at", daysAgoIso(days))
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    mood: row.mood as Mood,
    note: row.note as string | null,
    createdAt: row.created_at as string,
  }));
}

export type PatientMoodSummary = {
  latestMood: Mood | null;
  latestAt: string | null;
  checkinCount: number;
};

/** Latest mood + check-in count over the last `days` days, per patient — for the Analysis list. */
export async function getMoodSummaryForTherapistPatients(
  therapistId: string,
  patientIds: string[],
  days = 30,
): Promise<Map<string, PatientMoodSummary>> {
  const summaries = new Map<string, PatientMoodSummary>();
  if (patientIds.length === 0) return summaries;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mood_entries")
    .select("user_id, mood, note, created_at")
    .in("user_id", patientIds)
    .gte("created_at", daysAgoIso(days))
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  for (const row of (data ?? []) as RawMoodRow[]) {
    const existing = summaries.get(row.user_id);
    if (!existing) {
      summaries.set(row.user_id, { latestMood: row.mood, latestAt: row.created_at, checkinCount: 1 });
    } else {
      existing.checkinCount += 1;
    }
  }

  return summaries;
}

export type DistressAlert = {
  patientId: string;
  name: string;
  avatar: string;
  mood: Mood;
  createdAt: string;
};

const FALLBACK_AVATAR = "/images/profile/avatar.jpg";

/** Recent struggling/anxious check-ins among this therapist's booked patients, most recent per patient. */
export async function getDistressAlertsForTherapist(
  therapistId: string,
  hours = 48,
): Promise<DistressAlert[]> {
  const supabase = await createClient();

  const { data: bookingsRaw, error: bookingsError } = await supabase
    .from("bookings")
    .select("patient_id")
    .eq("therapist_id", therapistId);

  if (bookingsError) throw new Error(bookingsError.message);

  const patientIds = Array.from(
    new Set((bookingsRaw ?? []).map((b) => b.patient_id as string | null).filter((id): id is string => !!id)),
  );
  if (patientIds.length === 0) return [];

  const since = new Date();
  since.setHours(since.getHours() - hours);

  const { data: entriesRaw, error: entriesError } = await supabase
    .from("mood_entries")
    .select("user_id, mood, created_at")
    .in("user_id", patientIds)
    .in("mood", DISTRESS_MOODS)
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false });

  if (entriesError) throw new Error(entriesError.message);
  if (!entriesRaw || entriesRaw.length === 0) return [];

  const { data: profilesRaw, error: profilesError } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, avatar_url")
    .in(
      "id",
      Array.from(new Set(entriesRaw.map((e) => e.user_id as string))),
    );

  if (profilesError) throw new Error(profilesError.message);

  const profileById = new Map((profilesRaw ?? []).map((p) => [p.id, p]));
  const seen = new Set<string>();
  const alerts: DistressAlert[] = [];

  for (const entry of entriesRaw) {
    const patientId = entry.user_id as string;
    if (seen.has(patientId)) continue;
    seen.add(patientId);

    const profile = profileById.get(patientId);
    alerts.push({
      patientId,
      name: profile ? `${profile.first_name} ${profile.last_name}`.trim() || "Unknown Patient" : "Unknown Patient",
      avatar: profile?.avatar_url || FALLBACK_AVATAR,
      mood: entry.mood as Mood,
      createdAt: entry.created_at as string,
    });
  }

  return alerts;
}
