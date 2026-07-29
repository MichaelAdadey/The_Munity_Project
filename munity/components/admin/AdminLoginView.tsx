"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { AuthBrandHeader } from "@/components/auth/AuthBrandHeader";
import { AuthShell } from "@/components/auth/AuthShell";
import { MockCredentialsHint } from "@/components/auth/MockCredentialsHint";
import { Button } from "@/components/ui/AppButton";
import { routes } from "@/lib/routes";
import { signInAdmin, type AuthActionState } from "@/lib/auth/actions";

const initialState: AuthActionState = {};

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="h-12 w-full rounded-xl shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
      loading={pending}
    >
      {pending ? "Signing in…" : "Admin Login"}
    </Button>
  );
}

export function AdminLoginView() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction] = useActionState(signInAdmin, initialState);

  return (
    <AuthShell
      footer={
        <p className="text-base text-munity-muted">
          Not an admin?{" "}
          <Link
            href={routes.login}
            className="text-sm font-bold tracking-wide text-munity-green hover:underline"
          >
            Member login
          </Link>
          {" · "}
          <Link
            href={routes.therapistLogin}
            className="text-sm font-bold tracking-wide text-munity-green hover:underline"
          >
            Therapist login
          </Link>
        </p>
      }
    >
      <div className="flex w-full max-w-120 flex-col gap-6">
        <AuthBrandHeader
          title="Admin Console"
          subtitle="Sign in to manage the Munity platform"
        />

        <MockCredentialsHint role="admin" />

        <div className="rounded-[20px] border border-munity-input-border/30 bg-white px-10 py-10 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
          {state?.error ? (
            <div className="mb-6 flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-800">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          ) : null}

          <form action={formAction} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="px-1 text-sm font-semibold tracking-wide text-munity-text"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-munity-gray" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue="admin@munity.app"
                  placeholder="admin@munity.app"
                  autoComplete="email"
                  required
                  className="auth-input"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="px-1 text-sm font-semibold tracking-wide text-munity-text"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-munity-gray" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  defaultValue="Admin1234!"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="auth-input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-munity-gray transition-colors hover:text-munity-green"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>
{state.error ? <p>{state.error}</p> : null}
            <LoginButton />
          </form>
        </div>
      </div>
    </AuthShell>
  );
}
