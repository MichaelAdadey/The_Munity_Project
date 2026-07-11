"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Lock,
  RefreshCw,
} from "lucide-react";
import { useOnboardingProgress } from "@/hooks/useOnboardingProgress";
import {
  APPLICATION_REVIEW_EVENT,
  isApplicationSubmitted,
} from "@/lib/therapist-application-review";
import type { OnboardingStepId } from "@/lib/routes";
import { routes } from "@/lib/routes";

export type ApplicationTabId = OnboardingStepId | "review";

const applicationSteps: {
  id: ApplicationTabId;
  label: string;
}[] = [
  { id: "basic-info", label: "Basic Information" },
  { id: "credentials", label: "Credentials Upload" },
  { id: "specialties", label: "Specialties & Profile" },
  { id: "payout", label: "Payout Configuration" },
  { id: "review", label: "Review in Progress" },
];

interface CredentialVerificationSidebarProps {
  activeTab: ApplicationTabId;
  onSelectTab: (tab: ApplicationTabId) => void;
}

export function CredentialVerificationSidebar({
  activeTab,
  onSelectTab,
}: CredentialVerificationSidebarProps) {
  const { isStepComplete, progressPercent, refresh } = useOnboardingProgress();
  const [reviewLive, setReviewLive] = useState(false);

  useEffect(() => {
    function sync() {
      setReviewLive(isApplicationSubmitted());
      refresh();
    }
    sync();
    window.addEventListener(APPLICATION_REVIEW_EVENT, sync);
    return () => window.removeEventListener(APPLICATION_REVIEW_EVENT, sync);
  }, [refresh]);

  return (
    <aside className="flex h-full w-72 flex-col gap-8 p-6">
      <div>
        <p className="text-base uppercase tracking-[0.08em] text-munity-muted">
          Application Progress
        </p>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-munity-divider">
          <div
            className="h-full rounded-full bg-munity-green transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="mt-1 text-base text-munity-green">{progressPercent}% Completed</p>
        {reviewLive ? (
          <p className="mt-1 text-xs text-munity-muted">
            Awaiting clinical approval — dashboard locked
          </p>
        ) : null}
      </div>

      <nav className="flex flex-col gap-2">
        {applicationSteps.map((step) => {
          if (step.id === "review") {
            const isActive = activeTab === "review";
            return (
              <button
                key={step.label}
                type="button"
                onClick={() => onSelectTab("review")}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${
                  isActive
                    ? "border border-munity-green/20 bg-munity-divider"
                    : "hover:bg-white/50"
                }`}
              >
                <RefreshCw
                  className={`size-4 text-munity-green ${reviewLive ? "animate-spin" : ""}`}
                  style={reviewLive ? { animationDuration: "3s" } : undefined}
                />
                <span className="text-base text-munity-green">{step.label}</span>
              </button>
            );
          }

          if (isStepComplete(step.id)) {
            const isActive = activeTab === step.id;
            return (
              <button
                key={step.label}
                type="button"
                onClick={() => onSelectTab(step.id)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${
                  isActive ? "bg-munity-lime ring-2 ring-munity-green/20" : "bg-munity-lime/70 hover:bg-munity-lime"
                }`}
              >
                <span className="flex size-5 items-center justify-center rounded-full bg-munity-green text-white">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                <span className="text-base text-munity-olive-text">{step.label}</span>
              </button>
            );
          }

          return (
            <div
              key={step.label}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-munity-muted/40"
            >
              <Lock className="size-4 shrink-0" />
              <span className="text-base">{step.label}</span>
            </div>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-munity-green/10 bg-munity-green/5 p-4">
        <p className="text-base font-bold text-munity-green">Need help?</p>
        <p className="mt-1 text-xs leading-relaxed text-munity-muted">
          Our support team is available 24/7 for application queries.
        </p>
        <Link
          href={routes.help}
          className="mt-2 inline-flex items-center gap-1 text-base text-munity-green hover:underline"
        >
          Contact Support
          <ArrowRight className="size-3" />
        </Link>
      </div>
    </aside>
  );
}

export function CredentialVerificationFooter() {
  return (
    <footer className="border-t border-munity-divider bg-munity-divider px-10 py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-base font-bold text-munity-text">Munity Peer Support</p>
          <p className="mt-1 text-xs font-medium text-munity-muted">
            © 2024 Munity Peer Support. For emergencies, contact local crisis services
            immediately.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-xs font-medium text-munity-muted">
          <Link href={routes.privacy} className="hover:text-munity-green">
            Privacy Policy
          </Link>
          <Link href={routes.terms} className="hover:text-munity-green">
            Terms of Service
          </Link>
          <Link href={routes.help} className="hover:text-munity-green">
            Help Center
          </Link>
        </div>
      </div>
    </footer>
  );
}
