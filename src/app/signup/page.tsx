"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { AuthBrandHeader } from "@/components/auth/AuthBrandHeader";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { AuthShell } from "@/components/auth/AuthShell";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { routes } from "@/lib/routes";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <AuthShell
      footer={
        <p className="text-base text-munity-muted">
          Already have a munity account?{" "}
          <Link href={routes.login} className="text-sm font-bold tracking-wide text-munity-green">
            Login
          </Link>
        </p>
      }
    >
      <div className="flex w-full max-w-[480px] flex-col gap-8">
        <AuthBrandHeader
          title="Join Munity"
          subtitle="Create your therapist account to get started"
        />

        <div className="rounded-[20px] border border-munity-input-border/30 bg-white px-10 pb-10 pt-10 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
          <form
            className="flex flex-col gap-6"
            onSubmit={(event) => {
              event.preventDefault();
              router.push(routes.onboarding.basicInfo);
            }}
          >
            <AuthField label="Full Name" icon={User}>
              <input
                type="text"
                placeholder="Dr. Jane Smith"
                className="auth-input"
                autoComplete="name"
              />
            </AuthField>

            <AuthField label="Email Address" icon={Mail}>
              <input
                type="email"
                placeholder="name@example.com"
                className="auth-input"
                autoComplete="email"
              />
            </AuthField>

            <PasswordField
              label="Password"
              showPassword={showPassword}
              onToggle={() => setShowPassword((value) => !value)}
            />

            <PasswordField
              label="Confirm Password"
              showPassword={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((value) => !value)}
            />

            <div className="flex flex-col gap-4 pt-2">
              <button
                type="submit"
                className="h-[52px] rounded-xl bg-munity-green text-sm font-semibold tracking-wide text-white shadow-[0_1px_1px_rgba(0,0,0,0.05)] transition hover:bg-munity-green-dark"
              >
                Create Account
              </button>

              <AuthDivider />
              <GoogleButton href={routes.onboarding.basicInfo} />
            </div>
          </form>
        </div>
      </div>
    </AuthShell>
  );
}

function AuthField({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block px-1 text-sm font-semibold tracking-wide text-munity-text">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-munity-gray" />
        {children}
      </div>
    </div>
  );
}

function PasswordField({
  label,
  showPassword,
  onToggle,
}: {
  label: string;
  showPassword: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <label className="mb-2 block px-1 text-sm font-semibold tracking-wide text-munity-text">
        {label}
      </label>
      <div className="relative">
        <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-munity-gray" />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          className="auth-input pr-12"
          autoComplete={label === "Password" ? "new-password" : "new-password"}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-munity-gray"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </div>
  );
}
