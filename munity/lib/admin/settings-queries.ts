import { createClient } from "@/lib/supabase/server";

export type PlatformSettings = {
  crisisAlerts: boolean;
  weeklyDigest: boolean;
  maintenanceMode: boolean;
};

export async function getPlatformSettings(): Promise<PlatformSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("platform_settings")
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  return {
    crisisAlerts: data.crisis_alerts as boolean,
    weeklyDigest: data.weekly_digest as boolean,
    maintenanceMode: data.maintenance_mode as boolean,
  };
}
