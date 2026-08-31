import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Server-side gate using the REAL Supabase session + profiles.role.
 * Use this on any admin/therapist/patient page that needs a real login,
 * as opposed to lib/require-session.ts which only checks the mock cookie.
 */
export async function requireRole(allowedRoles: string[], loginPath: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(loginPath);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, first_name, last_name, avatar_url, created_at")
    .eq("id", user.id)
    .single();

  if (!profile || !allowedRoles.includes(profile.role)) {
    redirect(loginPath);
  }

  return { user, profile: profile! };
}
