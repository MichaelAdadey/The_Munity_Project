import { redirect } from "next/navigation";
import type { MockRole } from "@/lib/mock-credentials";
import { getMockSession } from "@/lib/mock-session";
import { routes } from "@/lib/routes";

const loginByRole: Record<MockRole, string> = {
  user: routes.login,
  therapist: routes.therapistLogin,
  admin: routes.adminLogin,
};

/** Server-side gate for preview auth (mock cookie) and future Supabase sessions. */
export async function requireMockRole(allowed: MockRole | MockRole[]) {
  const roles = Array.isArray(allowed) ? allowed : [allowed];
  const session = await getMockSession();
  if (!session || !roles.includes(session.role)) {
    redirect(loginByRole[roles[0]]);
  }
  return session;
}
