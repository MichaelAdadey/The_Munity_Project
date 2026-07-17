import { getMockSession } from "@/lib/mock-session";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";

/** True when a member (user) session is active in preview or Supabase. */
export async function getMemberLoggedIn(): Promise<boolean> {
  const mockSession = await getMockSession();
  if (mockSession?.role === "user") return true;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return Boolean(user);
  }

  return false;
}
