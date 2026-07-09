"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { OnboardingSidebar } from "@/components/therapistlayout/Sidebars";
import { CollapsibleSidebarLayout } from "@/components/therapistlayout/CollapsibleSidebarLayout";
import { SidebarProvider } from "@/components/therapistlayout/SidebarContext";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { Button } from "@/components/ui/AppButton";
import { useLoading } from "@/components/ui/LoadingProvider";
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
  const router = useRouter();
  const { withLoading } = useLoading();
  const stepIndex = onboardingSteps.findIndex((step) => step.id === stepId);

  async function navigate(href: string, message: string) {
    await withLoading(async () => {
      router.push(href);
    }, message);
  }

  return (
    <SidebarProvider storageKey="munity-onboarding-sidebar-open" expandedWidth={320}>
    <div className="min-h-screen bg-munity-bg">
      <CollapsibleSidebarLayout
        sidebar={<OnboardingSidebar activeStep={stepId} />}
        mainClassName="px-24 py-20"
      >
      <main className="flex flex-1 flex-col">
        <AnimatedPage className="mx-auto w-full max-w-3xl">
          <header className="mb-10">
            <motion.p
              className="text-sm font-semibold tracking-wide text-munity-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Step {stepIndex + 1} of {onboardingSteps.length}
            </motion.p>
            <motion.h2
              className="mt-2 text-[32px] font-bold text-munity-text"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              {title}
            </motion.h2>
            <motion.p
              className="mt-3 text-lg leading-relaxed text-munity-muted"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {description}
            </motion.p>
          </header>

          <motion.div
            className="rounded-[20px] border border-munity-border bg-white px-8 pb-8 pt-10 shadow-[0_4px_10px_rgba(85,107,47,0.05)]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, type: "spring", stiffness: 280, damping: 28 }}
          >
            {children}
          </motion.div>

          <div className="mt-10 flex items-center justify-between pb-6">
            <Button
              variant="ghost"
              className="px-10"
              onClick={() => navigate(backHref, "Going back...")}
            >
              <ArrowLeft className="size-3" />
              {backLabel}
            </Button>
            <Button
              className="h-14 px-8"
              onClick={() => navigate(continueHref, "Saving your progress...")}
            >
              {continueLabel}
              <ArrowRight className="size-3.5" />
            </Button>
          </div>

          {footer}
        </AnimatedPage>
      </main>
      </CollapsibleSidebarLayout>
    </div>
    </SidebarProvider>
  );
}
