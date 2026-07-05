import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { OnboardingSidebar } from "@/components/layout/Sidebars";
import type { OnboardingStepId } from "@/lib/routes";
import { onboardingSteps } from "@/lib/routes";

interface OnboardingStepPageProps {
  stepId: OnboardingStepId;
  title: string;
  description: string;
  children: React.ReactNode;
  backHref: string;
  backLabel: string;
  continueHref: string;
  continueLabel: string;
  footer?: React.ReactNode;
}

export function OnboardingStepPage({
  stepId,
  title,
  description,
  children,
  backHref,
  backLabel,
  continueHref,
  continueLabel,
  footer,
}: OnboardingStepPageProps) {
  const stepIndex = onboardingSteps.findIndex((step) => step.id === stepId);

  return (
    <div className="flex min-h-screen bg-munity-bg">
      <OnboardingSidebar activeStep={stepId} />

      <main className="flex flex-1 flex-col px-24 py-20">
        <div className="mx-auto w-full max-w-3xl">
          <header className="mb-10">
            <p className="text-sm font-semibold tracking-wide text-munity-muted">
              Step {stepIndex + 1} of {onboardingSteps.length}
            </p>
            <h2 className="mt-2 text-[32px] font-bold text-munity-text">{title}</h2>
            <p className="mt-3 text-lg leading-relaxed text-munity-muted">{description}</p>
          </header>

          <div className="rounded-[20px] border border-munity-border bg-white px-8 pb-8 pt-10 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
            {children}
          </div>

          <div className="mt-10 flex items-center justify-between pb-6">
            <Link
              href={backHref}
              className="flex items-center gap-2 px-10 py-3 text-sm font-semibold text-munity-green"
            >
              <ArrowLeft className="size-3" />
              {backLabel}
            </Link>
            <Link
              href={continueHref}
              className="flex h-14 items-center gap-2 rounded-xl bg-munity-green px-8 text-sm font-semibold text-white"
            >
              {continueLabel}
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {footer}
        </div>
      </main>
    </div>
  );
}
