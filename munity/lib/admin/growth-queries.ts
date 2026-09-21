import { createClient } from "@/lib/supabase/server";
import { countPatients, countActivePatients } from "./dashboard-queries";

export type GrowthMetric = {
  label: string;
  value: string;
  detail: string;
};

export async function getGrowthMetrics(): Promise<GrowthMetric[]> {
  const supabase = await createClient();

  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const d7 = new Date(now);
  d7.setDate(d7.getDate() - 7);
  const d14 = new Date(now);
  d14.setDate(d14.getDate() - 14);

  const [
    newThisMonth,
    newLastMonth,
    totalPatients,
    activeThisWeek,
    activeLastWeek,
    { data: communities },
    { data: memberCounts },
  ] = await Promise.all([
    countPatients(supabase, startOfThisMonth),
    countPatients(supabase, startOfLastMonth, startOfThisMonth),
    countPatients(supabase),
    countActivePatients(supabase, d7),
    countActivePatients(supabase, d14),
    supabase.from("communities").select("id, verified"),
    supabase.from("community_member_counts").select("member_count"),
  ]);

  const monthChange =
    newLastMonth > 0 ? ((newThisMonth - newLastMonth) / newLastMonth) * 100 : 0;
  const engagementNow =
    totalPatients > 0 ? (activeThisWeek / totalPatients) * 100 : 0;
  const engagementPrev =
    totalPatients > 0 ? (activeLastWeek / totalPatients) * 100 : 0;
  const engagementChange =
    engagementPrev > 0 ? engagementNow - engagementPrev : 0;

  const verifiedCount = (communities ?? []).filter((c) => c.verified).length;
  const totalMembers = (memberCounts ?? []).reduce(
    (sum, c) => sum + (c.member_count as number),
    0,
  );

  return [
    {
      label: "New members",
      value: newThisMonth.toLocaleString(),
      detail: `${monthChange >= 0 ? "+" : ""}${monthChange.toFixed(1)}% vs last month`,
    },
    {
      label: "Active communities",
      value: String(verifiedCount),
      detail: `${totalMembers.toLocaleString()} total members across communities`,
    },
    {
      label: "Weekly engagement",
      value: `${engagementNow.toFixed(1)}%`,
      detail: `${engagementChange >= 0 ? "+" : ""}${engagementChange.toFixed(1)}pp from last week`,
    },
  ];
}
