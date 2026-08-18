import { redirect } from "next/navigation";
import type { MockRole } from "@/lib/mock-credentials";
import { getMockSession } from "@/lib/mock-session";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import { routes } from "@/lib/routes";

const loginByRole: Record<MockRole, string> = {
  user: routes.login,
  therapist: routes.therapistLogin,
  admin: routes.adminLogin,
};

/**
 * Server-side gate for a page that requires one of `allowed` roles.
 *
 * Mirrors the branching in `lib/supabase/middleware.ts`: when Supabase is
 * configured, a real Supabase session is required (Supabase has no
 * role concept here, same as the middleware's generic `!user` check) —
 * checking the mock-session cookie instead would always fail, since
 * `signIn` only ever sets that cookie when Supabase is NOT configured.
 * Otherwise, falls back to the preview mock-session cookie.
 */
export async function requireMockRole(allowed: MockRole | MockRole[]) {
  const roles = Array.isArray(allowed) ? allowed : [allowed];

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      redirect(loginByRole[roles[0]]);
    }
    return null;
  }

  const session = await getMockSession();
  if (!session || !roles.includes(session.role)) {
    redirect(loginByRole[roles[0]]);
  }
  return session;
}
