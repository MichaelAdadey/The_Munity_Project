import { routes } from "@/lib/routes";

export type MockRole = "user" | "therapist" | "admin";

export type MockAccount = {
  role: MockRole;
  name: string;
  email: string;
  password: string;
  redirectTo: string;
  description: string;
};

/**
 * Preview-only accounts for navigating role-specific pages without Supabase.
 * Shown on login screens and validated when the backend is not configured.
 */
export const mockAccounts: MockAccount[] = [
  {
    role: "user",
    name: "Alex Rivera",
    email: "alex.rivera@munity.app",
    password: "User1234!",
    redirectTo: "/home",
    description: "Member home, communities, and resources",
  },
  {
    role: "therapist",
    name: "Dr. Elena Aris",
    email: "elena.aris@munity.app",
    password: "Therapist1234!",
    redirectTo: routes.therapistDashboard,
    description: "Therapist dashboard, patients, and clinical tools",
  },
  {
    role: "admin",
    name: "Munity Admin",
    email: "admin@munity.app",
    password: "Admin1234!",
    redirectTo: routes.admin,
    description: "Admin console for platform oversight",
  },
];

export const MOCK_SESSION_COOKIE = "munity-mock-session";

export function findMockAccount(email: string, password: string): MockAccount | null {
  const normalized = email.trim().toLowerCase();
  return (
    mockAccounts.find(
      (account) =>
        account.email.toLowerCase() === normalized && account.password === password,
    ) ?? null
  );
}

export function getMockAccountByRole(role: MockRole): MockAccount {
  const account = mockAccounts.find((item) => item.role === role);
  if (!account) {
    throw new Error(`Missing mock account for role: ${role}`);
  }
  return account;
}

export function parseMockSessionCookie(value: string | undefined): MockAccount | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as {
      role?: MockRole;
      email?: string;
      name?: string;
    };
    if (!parsed.role || !parsed.email) return null;

    const known = mockAccounts.find(
      (account) =>
        account.role === parsed.role &&
        account.email.toLowerCase() === parsed.email!.toLowerCase(),
    );
    if (known) {
      return {
        ...known,
        name: parsed.name?.trim() || known.name,
      };
    }

    // Preview signups may use a new email — keep role template + cookie identity.
    const template = mockAccounts.find((account) => account.role === parsed.role);
    if (!template) return null;
    return {
      ...template,
      email: parsed.email,
      name: parsed.name?.trim() || template.name,
    };
  } catch {
    return null;
  }
}

export function serializeMockSession(account: MockAccount): string {
  return JSON.stringify({ role: account.role, email: account.email, name: account.name });
}
