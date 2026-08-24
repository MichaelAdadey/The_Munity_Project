"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/** Confirms the caller is a real, signed-in admin before allowing changes. */
async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not signed in.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    throw new Error("Not authorized.");
  }

  return supabase;
}

export type AdminActionResult = { error?: string; success?: boolean };

export async function approveTherapist(profileId: string): Promise<AdminActionResult> {
  const supabase = await assertAdmin();

  const { error } = await supabase
    .from("therapist_details")
    .update({ verification_status: "verified" })
    .eq("profile_id", profileId);

  if (error) return { error: error.message };

  revalidatePath("/admin/therapy");
  return { success: true };
}

export async function rejectTherapist(profileId: string): Promise<AdminActionResult> {
  const supabase = await assertAdmin();

  const { error } = await supabase
    .from("therapist_details")
    .update({ verification_status: "rejected" })
    .eq("profile_id", profileId);

  if (error) return { error: error.message };

  revalidatePath("/admin/therapy");
  return { success: true };
}
