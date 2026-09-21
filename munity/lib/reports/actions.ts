"use server";

import { createClient } from "@/lib/supabase/server";

export type ReportInput = {
  targetType: "post" | "comment";
  targetId: string;
  reason:
    | "Self-Harm"
    | "Spam"
    | "Harassment"
    | "Hate Speech"
    | "Misinformation"
    | "Other";
  reasonDetails?: string;
};

export async function submitReport(
  input: ReportInput,
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in to report content." };

  // Best-effort — notify all admins a new report needs review; a failed
  // notification insert shouldn't block the report itself from being filed.
  const { data: admins } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "admin");
  if (admins && admins.length > 0) {
    await supabase.from("notifications").insert(
      admins.map((admin) => ({
        recipient_id: admin.id,
        type: "new_report",
        title: "New content report",
        body: `A ${input.targetType} was reported for ${input.reason}.`,
        href: "/admin/moderation",
      })),
    );
  }

  const { error } = await supabase.from("reports").insert({
    reporter_id: user.id,
    target_type: input.targetType,
    target_id: input.targetId,
    reason: input.reason,
    reason_details:
      input.reason === "Other" ? input.reasonDetails?.trim() || null : null,
  });

  if (error) return { error: error.message };
  return { success: true };
}
