import {
  getAllOnboardingStepData,
  getOnboardingStepData,
  isOnboardingStepFilled,
} from "@/lib/onboarding-data";
import { ONBOARDING_PROGRESS_EVENT } from "@/lib/onboarding-progress";

const STORAGE_KEY = "munity-therapist-application-review-v1";
export const APPLICATION_REVIEW_EVENT = "munity-application-review-updated";

export type ReviewCheckStatus = "complete" | "in_progress" | "pending";

export type ReviewChecklistItem = {
  id: string;
  label: string;
  status: ReviewCheckStatus;
  detail: string;
};

export type TherapistApplicationReview = {
  submittedAt: number;
  status: "in_review";
};

function emit() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(APPLICATION_REVIEW_EVENT));
  window.dispatchEvent(new CustomEvent(ONBOARDING_PROGRESS_EVENT));
}

export function getApplicationReview(): TherapistApplicationReview | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TherapistApplicationReview;
    if (!parsed?.submittedAt || parsed.status !== "in_review") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function isApplicationSubmitted() {
  return Boolean(getApplicationReview());
}

/** Marks the application as submitted for clinical review (credentials stay inactive). */
export function submitTherapistApplication() {
  if (typeof window === "undefined") return;

  const existing = getApplicationReview();
  if (existing) {
    emit();
    return;
  }

  const review: TherapistApplicationReview = {
    submittedAt: Date.now(),
    status: "in_review",
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(review));
  } catch {
    // Preview mode can continue without localStorage.
  }
  emit();
}

/**
 * Ensures a review record exists when the therapist reaches the review screen
 * with a complete application (e.g. refreshed or deep-linked).
 */
export function ensureApplicationSubmitted() {
  const allFilled = (
    ["basic-info", "credentials", "specialties", "payout"] as const
  ).every((stepId) => isOnboardingStepFilled(stepId));

  if (allFilled && !getApplicationReview()) {
    submitTherapistApplication();
  }
}

export function getApplicantDisplayName() {
  const basic = getOnboardingStepData("basic-info");
  if (!basic) return null;
  const name = [basic.title, basic.firstName, basic.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  return name || null;
}

export function getReviewChecklist(): ReviewChecklistItem[] {
  const review = getApplicationReview();
  const submitted = Boolean(review);
  const identityDone = isOnboardingStepFilled("basic-info");
  const licenseDone = isOnboardingStepFilled("credentials");
  const specialtiesDone = isOnboardingStepFilled("specialties");
  const payoutDone = isOnboardingStepFilled("payout");
  const packageComplete = identityDone && licenseDone && specialtiesDone && payoutDone;

  return [
    {
      id: "received",
      label: "Application Received",
      status: submitted ? "complete" : packageComplete ? "in_progress" : "pending",
      detail: submitted
        ? "Your full application is with Clinical Operations."
        : "Finish all onboarding steps to submit.",
    },
    {
      id: "identity",
      label: "Identity & Profile",
      status: identityDone ? "complete" : "pending",
      detail: identityDone
        ? "Basic info and login details confirmed."
        : "Complete Basic Info to verify identity.",
    },
    {
      id: "license",
      label: "License Credentials",
      status: licenseDone ? "complete" : "pending",
      detail: licenseDone
        ? "Council registration and documents on file."
        : "Upload licensing details and verification documents.",
    },
    {
      id: "background",
      label: "Background Check",
      status: submitted ? "in_progress" : "pending",
      detail: submitted
        ? "Manual review in progress — usually 24–48 business hours."
        : "Starts after your application is submitted.",
    },
    {
      id: "interview",
      label: "Clinical Interview",
      status: "pending",
      detail: submitted
        ? "Scheduled after background checks clear. Dashboard unlocks only once approved."
        : "Final step before credentials are activated.",
    },
  ];
}

export function getReviewProgressPercent() {
  const checklist = getReviewChecklist();
  const weights: Record<ReviewCheckStatus, number> = {
    complete: 1,
    in_progress: 0.45,
    pending: 0,
  };
  const total = checklist.reduce((sum, item) => sum + weights[item.status], 0);
  return Math.round((total / checklist.length) * 100);
}

export function formatSubmittedRelative(submittedAt: number, now = Date.now()) {
  const seconds = Math.max(0, Math.floor((now - submittedAt) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function getReviewTickerItems(now = Date.now()) {
  const review = getApplicationReview();
  const name = getApplicantDisplayName();
  const checklist = getReviewChecklist();
  const inProgress = checklist.find((item) => item.status === "in_progress");
  const completeCount = checklist.filter((item) => item.status === "complete").length;

  const items: string[] = [];

  if (review) {
    items.push(
      `Application submitted ${formatSubmittedRelative(review.submittedAt, now)}.`,
    );
    items.push(
      "Credentials stay inactive until Clinical Operations approves your profile.",
    );
  } else {
    items.push("Submit your application to start credential review.");
  }

  if (name) {
    items.push(`Reviewing application for ${name}.`);
  }

  if (inProgress) {
    items.push(`${inProgress.label}: ${inProgress.detail}`);
  }

  items.push(`${completeCount} of ${checklist.length} verification checks complete.`);

  const data = getAllOnboardingStepData();
  const doc = data.credentials?.documentName;
  if (doc) {
    items.push(`Verification document on file: ${doc}.`);
  }

  return items;
}
