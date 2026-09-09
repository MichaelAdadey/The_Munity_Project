"use server";

import { createClient } from "@/lib/supabase/server";

export type ModeratorApplicationInput = {
  focus: string;
  why?: string;
};

export async function submitModeratorApplication(
  input: ModeratorApplicationInput,
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in to apply." };

  if (!input.focus.trim())
    return { error: "Tell us which space you'd like to moderate." };

  const { error } = await supabase.from("moderator_applications").insert({
    applicant_id: user.id,
    focus: input.focus.trim(),
    why: input.why?.trim() || null,
  });

  if (error) return { error: error.message };

  // Best-effort — a failed notification insert shouldn't block the application itself.
  const { data: admins } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "admin");
  if (admins && admins.length > 0) {
    await supabase.from("notifications").insert(
      admins.map((admin) => ({
        recipient_id: admin.id,
        type: "new_moderator_application",
        title: "New moderator application",
        body: `Someone applied to moderate: ${input.focus.trim()}`,
        href: "/admin/moderator-applications",
      })),
    );
  }

  return { success: true };
}
