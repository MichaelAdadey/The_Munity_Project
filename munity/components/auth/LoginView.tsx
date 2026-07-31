"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { signInWithGoogle } from "@/app/(auth)/actions";
import { AuthBrandHeader } from "@/components/auth/AuthBrandHeader";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { AuthShell } from "@/components/auth/AuthShell";
import { MockCredentialsHint } from "@/components/auth/MockCredentialsHint";
import { Button } from "@/components/ui/AppButton";
import { getMockAccountByRole } from "@/lib/mock-credentials";
import { routes } from "@/lib/routes";
import { signIn, type AuthActionState  } from "@/lib/auth/actions";

const initialState: AuthActionState = {};

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function GoogleSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="secondary"
      className="h-13.5 w-full rounded-xl"
      loading={pending}
      loadingLabel="Connecting with Google…"
    >
      <GoogleIcon />
      Continue with Google
    </Button>
  );
}

function LoginButton() {
  const {pending} = useFormStatus();

  return (
    <Button
      type="submit"
      className="h-12 w-full rounded-xl shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
      loading={pending}
      disabled={pending}
    >
      {pending ? "Signing in…" : "Login"}
    </Button>
  );
}

function AuthField({
  label,
  id,
  type = "text",
  placeholder,
  icon: Icon,
  name,
  autoComplete,
  defaultValue,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder: string;
  icon: React.ElementType;
  name: string;
  autoComplete?: string;
  defaultValue?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="px-1 text-sm font-semibold tracking-[0.14px] text-munity-text">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-munity-gray" />
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          required
          className="auth-input"
        />
      </div>
    </div>
  );
}

export function LoginView() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction] = useActionState(signIn, initialState);
  const demoUser = getMockAccountByRole("user");

  return (
    <AuthShell
      footer={
        <p className="text-base text-munity-muted">
          New to Munity?{" "}
          <Link
            href={routes.signup}
            className="text-sm font-bold tracking-[0.14px] text-munity-green hover:underline"
          >
            Create Account
          </Link>
          {" · "}
          <Link
            href={routes.therapistLogin}
            className="text-sm font-bold tracking-[0.14px] text-munity-green hover:underline"
          >
            Therapist
          </Link>
          {" · "}
          <Link
            href={routes.adminLogin}
            className="text-sm font-bold tracking-[0.14px] text-munity-green hover:underline"
          >
            Admin
          </Link>
        </p>
      }
    >
      <div className="flex w-full max-w-120 flex-col gap-[31.5px]">
        <AuthBrandHeader
          title="Welcome Back"
          subtitle="Continue your journey with Munity"
        />

        <MockCredentialsHint role="user" />

        <div className="rounded-[20px] border border-munity-input-border/30 bg-white px-10.25 pb-10.25 pt-10 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
          {state?.error ? (
            <div className="mb-6 flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-800">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          ) : null}

          <form action={formAction} className="flex flex-col gap-6">
            <AuthField
              label="Email Address"
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              icon={Mail}
              autoComplete="email"
              defaultValue={demoUser.email}
            />

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold tracking-[0.14px] text-munity-text"
                >
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs font-medium text-munity-green hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-munity-gray" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  defaultValue={demoUser.password}
                  required
                  className="auth-input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-munity-gray transition-colors hover:text-munity-green"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 px-1 text-sm text-munity-muted">
              <input
                type="checkbox"
                name="remember"
                className="size-4 rounded border-munity-input-border text-munity-green focus:ring-munity-green"
              />
              Remember Me
            </label>

            <LoginButton />
          </form>

          <div className="mt-6">
            <AuthDivider />
          </div>

          <form action={signInWithGoogle} className="mt-6">
            <GoogleSubmitButton />
          </form>
        </div>
      </div>
    </AuthShell>
  );
}
