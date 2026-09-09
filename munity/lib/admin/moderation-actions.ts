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

export type ModerationActionResult = { error?: string; success?: boolean };

export async function markReportInReview(
  reportId: string,
): Promise<ModerationActionResult> {
  const { supabase } = await assertAdmin();
  const { error } = await supabase
    .from("reports")
    .update({ status: "in_review" })
    .eq("id", reportId);
  if (error) return { error: error.message };
  revalidatePath("/admin/moderation");
  return { success: true };
}

export async function reopenReport(
  reportId: string,
): Promise<ModerationActionResult> {
  const { supabase } = await assertAdmin();
  const { error } = await supabase
    .from("reports")
    .update({ status: "pending", resolution: null, resolved_at: null })
    .eq("id", reportId);
  if (error) return { error: error.message };
  revalidatePath("/admin/moderation");
  return { success: true };
}

export async function resolveReport(
  reportId: string,
  resolution: "Warn" | "Remove content" | "Suspend" | "Dismiss",
): Promise<ModerationActionResult> {
  const { supabase } = await assertAdmin();

  const { data: report } = await supabase
    .from("reports")
    .select("*")
    .eq("id", reportId)
    .single();
  if (!report) return { error: "Report not found." };

  if (resolution === "Remove content") {
    const table = report.target_type === "post" ? "posts" : "post_comments";
    const { error: deleteError } = await supabase
      .from(table)
      .delete()
      .eq("id", report.target_id);
    if (deleteError)
      return { error: `Couldn't remove content: ${deleteError.message}` };
  }

  if (resolution === "Suspend" || resolution === "Warn") {
    const table = report.target_type === "post" ? "posts" : "post_comments";
    const { data: content } = await supabase
      .from(table)
      .select("author_id")
      .eq("id", report.target_id)
      .maybeSingle();

    if (content?.author_id) {
      if (resolution === "Suspend") {
        const { error: suspendError } = await supabase
          .from("profiles")
          .update({ is_suspended: true })
          .eq("id", content.author_id);
        if (suspendError)
          return { error: `Couldn't suspend account: ${suspendError.message}` };
      }

      // Best-effort notification either way — a failed insert shouldn't fail the resolution itself.
      await supabase.from("notifications").insert({
        recipient_id: content.author_id,
        type:
          resolution === "Suspend" ? "account_suspended" : "content_warning",
        title:
          resolution === "Suspend"
            ? "Your account has been suspended"
            : "Content warning",
        body:
          resolution === "Suspend"
            ? "Your account was suspended following a review of reported content. Contact support for details."
            : "One of your posts or comments was reviewed and found to violate community guidelines. Please review our community standards.",
        href: "/help",
      });
    }
  }

  const { error } = await supabase
    .from("reports")
    .update({
      status: "resolved",
      resolution,
      resolved_at: new Date().toISOString(),
    })
    .eq("id", reportId);

  if (error) return { error: error.message };

  revalidatePath("/admin/moderation");
  return { success: true };
}
