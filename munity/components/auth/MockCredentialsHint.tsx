"use client";

import { getMockAccountByRole, type MockRole } from "@/lib/mock-credentials";

export function MockCredentialsHint({ role }: { role: MockRole }) {
  const account = getMockAccountByRole(role);

  return (
    <div className="rounded-2xl border border-munity-green/20 bg-munity-lime/30 px-4 py-3 text-sm text-munity-olive-text">
      <p className="font-semibold tracking-wide">Demo {role} login</p>
      <p className="mt-1 font-medium text-munity-muted">
        Email: <span className="text-munity-text">{account.email}</span>
      </p>
      <p className="font-medium text-munity-muted">
        Password: <span className="text-munity-text">{account.password}</span>
      </p>
    </div>
  );
}
