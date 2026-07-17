"use server";

import { redirect } from "next/navigation";
import { findMockAccount } from "@/lib/mock-credentials";
import { setMockSession } from "@/lib/mock-session";

export type AdminLoginState = { error?: string } | undefined;

export async function signInAsAdmin(
  _prev: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  const account = findMockAccount(email, password);
  if (!account || account.role !== "admin") {
    return {
      error: "Invalid admin credentials. Use admin@munity.app / Admin1234!",
    };
  }

  await setMockSession(account);
  redirect(account.redirectTo);
}
