"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
  if (!profile || profile.role !== "admin") throw new Error("Not authorized.");

  return { supabase, adminId: user.id };
}

async function decide(
  id: string,
  status: "approved" | "rejected",
): Promise<{ error?: string }> {
  const { supabase, adminId } = await assertAdmin();

  const { data: application } = await supabase
    .from("moderator_applications")
    .select("applicant_id, focus")
    .eq("id", id)
    .single();

  if (!application) return { error: "Application not found." };

  const { error } = await supabase
    .from("moderator_applications")
    .update({
      status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: adminId,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  // Best-effort — no real moderator role/permissions are granted here yet,
  // this only records the decision and notifies the applicant.
  await supabase.from("notifications").insert({
    recipient_id: application.applicant_id,
    type:
      status === "approved"
        ? "moderator_application_approved"
        : "moderator_application_rejected",
    title:
      status === "approved"
        ? "Moderator application approved"
        : "Moderator application not approved",
    body:
      status === "approved"
        ? `Your application to moderate "${application.focus}" was approved. Our team will follow up with next steps.`
        : `Your application to moderate "${application.focus}" wasn't approved this time.`,
    href: "/Communities",
  });

  revalidatePath("/admin/moderator-applications");
  return {};
}

export async function approveModeratorApplication(id: string) {
  return decide(id, "approved");
}

export async function rejectModeratorApplication(id: string) {
  return decide(id, "rejected");
}
