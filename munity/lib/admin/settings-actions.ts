"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updatePlatformSetting(
  key: "crisisAlerts" | "weeklyDigest" | "maintenanceMode",
  value: boolean,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || profile.role !== "admin") return { error: "Not authorized." };

  const column = {
    crisisAlerts: "crisis_alerts",
    weeklyDigest: "weekly_digest",
    maintenanceMode: "maintenance_mode",
  }[key];

  const { error } = await supabase
    .from("platform_settings")
    .update({
      [column]: value,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    })
    .eq("id", true);

  if (error) return { error: error.message };

  revalidatePath("/admin/settings");
  return {};
}
