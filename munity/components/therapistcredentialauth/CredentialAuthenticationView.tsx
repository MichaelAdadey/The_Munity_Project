"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Check,
  Clock3,
  Compass,
  Home,
  Hourglass,
  Mail,
  MessageCircle,
  Shield,
  Users,
} from "lucide-react";
import {
  CredentialVerificationFooter,
  CredentialVerificationSidebar,
  type ApplicationTabId,
} from "@/components/therapistcredentialauth/CredentialVerificationSidebar";
import { OnboardingStepPreview } from "@/components/therapistcredentialauth/OnboardingStepPreview";
import { CollapsibleSidebarLayout } from "@/components/therapistlayout/CollapsibleSidebarLayout";
import { SidebarProvider } from "@/components/therapistlayout/SidebarContext";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { Button } from "@/components/ui/AppButton";
import { LivePulse, LiveTicker } from "@/components/live/LiveFeedback";
import {
  APPLICATION_REVIEW_EVENT,
  ensureApplicationSubmitted,
  formatSubmittedRelative,
  getApplicantDisplayName,
  getApplicationReview,
  getReviewChecklist,
  getReviewProgressPercent,
  getReviewTickerItems,
  type ReviewCheckStatus,
  type ReviewChecklistItem,
} from "@/lib/therapist-application-review";
import { ONBOARDING_PROGRESS_EVENT } from "@/lib/onboarding-progress";
import { routes } from "@/lib/routes";

const secondaryInfo = [
  {
    icon: Shield,
    title: "Secure Encryption",
    description: "Your documents are protected with HIPAA-compliant AES-256 encryption.",
  },
  {
    icon: Bell,
    title: "Instant Notifications",
    description: "We'll email and text you the moment your review is complete.",
  },
  {
    icon: Users,
    title: "Peer Community",
    description: "Join 500+ professionals dedicated to modern therapy.",
  },
] as const;

function checklistIcon(status: ReviewCheckStatus) {
  if (status === "complete") return Check;
  if (status === "in_progress") return Hourglass;
  return MessageCircle;
}

function ChecklistRow({ item }: { item: ReviewChecklistItem }) {
  const Icon = checklistIcon(item.status);
  const isComplete = item.status === "complete";
  const isActive = item.status === "in_progress";

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-munity-input-border p-4 ${
        isComplete
          ? "bg-white/50"
          : isActive
            ? "bg-munity-lime/40"
            : "bg-white/30 opacity-60"
      }`}
    >
      {isComplete ? (
        <Check className="mt-0.5 size-5 shrink-0 text-munity-green" strokeWidth={2.5} />
      ) : (
        <Icon
          className={`mt-0.5 size-4 shrink-0 ${isActive ? "animate-pulse text-munity-green" : "text-munity-muted"}`}
        />
      )}
      <div className="min-w-0 text-left">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-base text-munity-text">{item.label}</span>
          {isActive ? <LivePulse label="In progress" /> : null}
        </div>
        <p className="mt-1 text-xs leading-relaxed text-munity-muted">{item.detail}</p>
      </div>
    </div>
  );
}

function ReviewStatusCard() {
  const [now, setNow] = useState(() => Date.now());
  const [checklist, setChecklist] = useState<ReviewChecklistItem[]>([]);
  const [progress, setProgress] = useState(0);
  const [applicantName, setApplicantName] = useState<string | null>(null);
  const [submittedAt, setSubmittedAt] = useState<number | null>(null);
  const [tickerItems, setTickerItems] = useState<string[]>([]);

  function refresh() {
    ensureApplicationSubmitted();
    setChecklist(getReviewChecklist());
    setProgress(getReviewProgressPercent());
    setApplicantName(getApplicantDisplayName());
    setSubmittedAt(getApplicationReview()?.submittedAt ?? null);
    setTickerItems(getReviewTickerItems(Date.now()));
    setNow(Date.now());
  }

  useEffect(() => {
    refresh();

    function handleUpdate() {
      refresh();
    }

    window.addEventListener(APPLICATION_REVIEW_EVENT, handleUpdate);
    window.addEventListener(ONBOARDING_PROGRESS_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    const timer = window.setInterval(() => {
      setNow(Date.now());
      setTickerItems(getReviewTickerItems(Date.now()));
    }, 15_000);

    return () => {
      window.removeEventListener(APPLICATION_REVIEW_EVENT, handleUpdate);
      window.removeEventListener(ONBOARDING_PROGRESS_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      window.clearInterval(timer);
    };
  }, []);

  const submittedLabel =
    submittedAt != null ? formatSubmittedRelative(submittedAt, now) : null;

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[32px] border border-munity-border/50 bg-white/70 p-12 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] backdrop-blur-sm"
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-8 flex size-24 items-center justify-center rounded-full bg-[#d9eaa3]">
            <Shield className="size-10 text-munity-green" strokeWidth={1.75} />
            <span className="absolute inset-0 rounded-full border-4 border-munity-green/10" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <h1 className="text-base text-munity-green">
              {submittedAt
                ? "Application submitted for verification"
                : "Finish onboarding to start review"}
            </h1>
            {submittedAt ? <LivePulse label="Review active" /> : null}
          </div>

          <p className="mt-4 max-w-md text-base leading-relaxed text-munity-muted">
            {applicantName ? (
              <>
                Thanks, <span className="font-semibold text-munity-text">{applicantName}</span>.{" "}
              </>
            ) : null}
            Clinical Operations is verifying your credentials before your therapist account can go
            live. Dashboard access unlocks only after approval.
          </p>

          {tickerItems.length > 0 ? (
            <div className="mt-6 w-full max-w-md">
              <LiveTicker items={tickerItems} />
            </div>
          ) : null}
        </div>

        <div className="mt-10 rounded-2xl border border-munity-input-border/30 bg-munity-sidebar p-6">
          <div className="flex items-center gap-4">
            <div className="flex size-9 items-center justify-center rounded-full bg-munity-lime">
              <Clock3 className="size-5 text-munity-green" />
            </div>
            <div className="text-left">
              <p className="text-base text-munity-text">Review in Progress</p>
              <p className="text-xs font-medium text-munity-muted">
                {submittedLabel
                  ? `Submitted ${submittedLabel} · typically 24–48 business hours`
                  : "Estimated time: 24–48 business hours after submission"}
              </p>
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-munity-divider">
            <motion.div
              className="relative h-full rounded-full bg-munity-green"
              initial={false}
              animate={{ width: `${Math.max(8, progress)}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            >
              <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white/30 to-transparent" />
            </motion.div>
          </div>
          <p className="mt-2 text-left text-xs font-semibold text-munity-green">
            {progress}% verified · credentials inactive until approved
          </p>

          <p className="mt-4 text-left text-xs italic leading-relaxed text-munity-muted">
            &ldquo;Munity is committed to safety and quality. Every profile is manually reviewed by
            our Clinical Operations team to maintain nurtured stability for our peers.&rdquo;
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {checklist.map((item) => (
            <ChecklistRow key={item.id} item={item} />
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-munity-green/15 bg-munity-green/5 px-5 py-4 text-left">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 size-4 shrink-0 text-munity-green" />
            <div>
              <p className="text-sm font-semibold text-munity-text">
                We’ll notify you when verification is complete
              </p>
              <p className="mt-1 text-xs leading-relaxed text-munity-muted">
                Therapist login and dashboard stay locked until Clinical Operations activates your
                credentials. You can leave this page — your application remains in review.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center">
          <div className="flex flex-wrap justify-center gap-3">
            <Button href={routes.home} className="h-14 rounded-xl px-8">
              <Home className="size-4" />
              Back to Home
            </Button>
            <Button
              href={routes.resources}
              variant="outline"
              className="h-14 rounded-xl px-8"
            >
              <Compass className="size-4" />
              Explore Resources
            </Button>
          </div>
        </div>
      </motion.article>

      <section className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {secondaryInfo.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-white shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
                <Icon className="size-5 text-munity-green" />
              </div>
              <h2 className="text-base text-munity-text">{item.title}</h2>
              <p className="mt-1 text-xs font-medium leading-relaxed text-munity-muted">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </section>
    </>
  );
}

export function CredentialAuthenticationView() {
  const [activeTab, setActiveTab] = useState<ApplicationTabId>("review");

  useEffect(() => {
    ensureApplicationSubmitted();
  }, []);

  return (
    <SidebarProvider storageKey="munity-credential-sidebar-open" expandedWidth={288}>
      <div className="flex min-h-screen flex-col bg-munity-bg">
        <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center border-b border-munity-input-border/20 bg-munity-bg/80 px-10 shadow-sm backdrop-blur-md">
          <Link href={routes.home} className="text-base font-bold text-munity-green">
            Munity
          </Link>
        </header>

        <div className="flex flex-1 flex-col pt-16">
          <CollapsibleSidebarLayout
            sidebar={
              <CredentialVerificationSidebar
                activeTab={activeTab}
                onSelectTab={setActiveTab}
              />
            }
            mainClassName="flex flex-1 flex-col items-center px-6 py-16 lg:px-24 lg:py-24"
          >
            <AnimatedPage className="flex w-full max-w-2xl flex-col gap-12">
              {activeTab === "review" ? (
                <ReviewStatusCard />
              ) : (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <OnboardingStepPreview stepId={activeTab} />
                </motion.div>
              )}
            </AnimatedPage>
          </CollapsibleSidebarLayout>

          <CredentialVerificationFooter />
        </div>
      </div>
    </SidebarProvider>
  );
}
