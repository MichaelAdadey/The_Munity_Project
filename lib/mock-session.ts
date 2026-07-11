import { cookies } from "next/headers";
import {
  MOCK_SESSION_COOKIE,
  parseMockSessionCookie,
  serializeMockSession,
  type MockAccount,
} from "@/lib/mock-credentials";

export async function getMockSession(): Promise<MockAccount | null> {
  const cookieStore = await cookies();
  return parseMockSessionCookie(cookieStore.get(MOCK_SESSION_COOKIE)?.value);
}

export async function setMockSession(account: MockAccount) {
  const cookieStore = await cookies();
  cookieStore.set(MOCK_SESSION_COOKIE, serializeMockSession(account), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearMockSession() {
  const cookieStore = await cookies();
  cookieStore.delete(MOCK_SESSION_COOKIE);
}
