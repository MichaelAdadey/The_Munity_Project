import { createClient } from "@/lib/supabase/server";

function pctChange(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? "+100%" : "0%";
  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
}

export type DashboardData = {
  kpis: {
    totalUsers: { value: number; trend: string };
    newSignups7d: { value: number; trend: string };
    sessionsBooked: { value: number; trend: string };
    engagementRate: { value: number; trend: string };
    safetyReports: { value: number; hasUrgent: boolean };
  };
  growth: {
    monthly: { month: string; growth: number; retention: number }[];
    weekly: { month: string; growth: number; retention: number }[];
  };
  sessionTypes: { label: string; percent: number; color: string }[];
  communities: {
    name: string;
    membersLabel: string;
    width: string;
    color: string;
  }[];
};

const RETENTION_MONTHLY = [26, 38, 46, 52, 72, 78]; // still estimated — no activity-history table yet
const RETENTION_WEEKLY = [30, 40, 48, 54, 74, 80];

export async function countPatients(
  supabase: Awaited<ReturnType<typeof createClient>>,
  since?: Date,
  until?: Date,
) {
  let query = supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "patient");
  if (since) query = query.gte("created_at", since.toISOString());
  if (until) query = query.lt("created_at", until.toISOString());
  const { count } = await query;
  return count ?? 0;
}

async function countBookings(
  supabase: Awaited<ReturnType<typeof createClient>>,
  since?: Date,
  until?: Date,
) {
  let query = supabase
    .from("bookings")
    .select("id", { count: "exact", head: true });
  if (since) query = query.gte("created_at", since.toISOString());
  if (until) query = query.lt("created_at", until.toISOString());
  const { count } = await query;
  return count ?? 0;
}

/** "Active" = authored a post, sent a chat message, or had a booking created in the window. */
export async function countActivePatients(
  supabase: Awaited<ReturnType<typeof createClient>>,
  since: Date,
): Promise<number> {
  const [{ data: posters }, { data: messengers }, { data: bookers }] =
    await Promise.all([
      supabase
        .from("posts")
        .select("author_id")
        .gte("created_at", since.toISOString()),
      supabase
        .from("chat_messages")
        .select("sender_id")
        .gte("created_at", since.toISOString()),
      supabase
        .from("bookings")
        .select("patient_id")
        .gte("created_at", since.toISOString()),
    ]);

  const activeIds = new Set<string>();
  (posters ?? []).forEach((r) => activeIds.add(r.author_id as string));
  (messengers ?? []).forEach((r) => activeIds.add(r.sender_id as string));
  (bookers ?? []).forEach(
    (r) => r.patient_id && activeIds.add(r.patient_id as string),
  );

  return activeIds.size;
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();

  const now = new Date();
  const d7 = new Date(now);
  d7.setDate(d7.getDate() - 7);
  const d14 = new Date(now);
  d14.setDate(d14.getDate() - 14);

  const [
    totalUsersNow,
    signups7d,
    signupsPrev7d,
    bookings7d,
    bookingsPrev7d,
    totalBookings,
    activeNow,
    activePrev,
    totalPatientsForEngagement,
    { count: pendingReports },
    { count: urgentReports },
    { data: sessionTypeRows },
    { data: communityRows },
    { data: memberCountRows },
  ] = await Promise.all([
    countPatients(supabase),
    countPatients(supabase, d7),
    countPatients(supabase, d14, d7),
    countBookings(supabase, d7),
    countBookings(supabase, d14, d7),
    countBookings(supabase),
    countActivePatients(supabase, d7),
    countActivePatients(supabase, d14),
    countPatients(supabase),
    supabase
      .from("reports")
      .select("id", { count: "exact", head: true })
      .neq("status", "resolved"),
    supabase
      .from("reports")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase.from("bookings").select("session_type"),
    supabase.from("communities").select("id, name, tag"),
    supabase
      .from("community_member_counts")
      .select("community_id, member_count"),
  ]);

  // ── Session types (real video/chat; audio reserved for future) ──
  const typeCounts = { video: 0, chat: 0 };
  (sessionTypeRows ?? []).forEach((row) => {
    const t = row.session_type as string;
    if (t === "video") typeCounts.video += 1;
    else if (t === "chat") typeCounts.chat += 1;
  });
  const totalSessions = typeCounts.video + typeCounts.chat;
  const sessionTypes = [
    {
      label: "Video Call",
      percent:
        totalSessions > 0
          ? Math.round((typeCounts.video / totalSessions) * 100)
          : 0,
      color: "#3e5219",
    },
    {
      label: "Text Message",
      percent:
        totalSessions > 0
          ? Math.round((typeCounts.chat / totalSessions) * 100)
          : 0,
      color: "#bdce89",
    },
    { label: "Audio Chat", percent: 0, color: "#56642b" }, // not tracked yet — reserved for later
  ];

  // ── Most active communities (real member counts) ──
  const countById = new Map(
    (memberCountRows ?? []).map((r) => [
      r.community_id as string,
      r.member_count as number,
    ]),
  );
  const communityColors = ["#3e5219", "#b6d088", "#56642b", "#bdce89"];
  const communities = (communityRows ?? [])
    .map((c) => ({
      name: c.name as string,
      tag: c.tag as string | null,
      count: countById.get(c.id as string) ?? 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4)
    .map((c, i) => {
      const maxCount = Math.max(
        1,
        countById.get([...countById.keys()][0]) ?? 1,
      );
      const relativeWidth = Math.max(
        10,
        Math.round((c.count / Math.max(c.count, maxCount, 1)) * 100),
      );
      return {
        name: c.name,
        membersLabel: `${c.count} member${c.count === 1 ? "" : "s"}`,
        width: `${relativeWidth}%`,
        color: communityColors[i % communityColors.length],
      };
    });

  // ── Growth: real monthly/weekly signups, retention stays estimated ──
  const monthly: DashboardData["growth"]["monthly"] = [];
  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const count = await countPatients(supabase, start, end);
    monthly.push({
      month: start
        .toLocaleDateString(undefined, { month: "short" })
        .toUpperCase(),
      growth: count,
      retention: RETENTION_MONTHLY[5 - i] ?? 0,
    });
  }

  const weekly: DashboardData["growth"]["weekly"] = [];
  for (let i = 5; i >= 0; i--) {
    const start = new Date(now);
    start.setDate(start.getDate() - (i + 1) * 7);
    const end = new Date(now);
    end.setDate(end.getDate() - i * 7);
    const count = await countBookings(supabase, start, end); // weekly view tracks booking activity, not signups
    weekly.push({
      month: `W${6 - i}`,
      growth: count,
      retention: RETENTION_WEEKLY[5 - i] ?? 0,
    });
  }

  const engagementNow =
    totalPatientsForEngagement > 0
      ? (activeNow / totalPatientsForEngagement) * 100
      : 0;
  const engagementPrev =
    totalPatientsForEngagement > 0
      ? (activePrev / totalPatientsForEngagement) * 100
      : 0;

  return {
    kpis: {
      totalUsers: {
        value: totalUsersNow,
        trend: pctChange(signups7d, signupsPrev7d),
      },
      newSignups7d: {
        value: signups7d,
        trend: pctChange(signups7d, signupsPrev7d),
      },
      sessionsBooked: {
        value: totalBookings,
        trend: pctChange(bookings7d, bookingsPrev7d),
      },
      engagementRate: {
        value: Math.round(engagementNow * 10) / 10,
        trend: pctChange(engagementNow, engagementPrev),
      },
      safetyReports: {
        value: pendingReports ?? 0,
        hasUrgent: (urgentReports ?? 0) > 0,
      },
    },
    growth: { monthly, weekly },
    sessionTypes,
    communities,
  };
}
