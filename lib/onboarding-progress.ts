import type { OnboardingStepId } from "@/lib/routes";
import { isOnboardingStepFilled } from "@/lib/onboarding-data";

const STORAGE_KEY = "munity-onboarding-completed-steps-v4";
export const ONBOARDING_PROGRESS_EVENT = "munity-onboarding-progress-updated";
const STORAGE_VERSION_KEY = "munity-onboarding-storage-version";
const STORAGE_VERSION = "5";

const formStepIds: OnboardingStepId[] = [
  "basic-info",
  "credentials",
  "specialties",
  "payout",
];

const KEYS_TO_CLEAR = [
  "munity-onboarding-step-data",
  "munity-onboarding-step-data-v2",
  "munity-onboarding-step-data-v3",
  "munity-onboarding-step-data-v4",
  "munity-onboarding-completed-steps",
  "munity-onboarding-completed-steps-v2",
  "munity-onboarding-completed-steps-v3",
  "munity-onboarding-completed-steps-v4",
  "munity-onboarding-storage-reset-v3",
  "munity-therapist-application-review-v1",
];

/** Clears stale onboarding keys whenever the storage schema version changes. */
export function resetStaleOnboardingStorage() {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem(STORAGE_VERSION_KEY) === STORAGE_VERSION) return;
    KEYS_TO_CLEAR.forEach((key) => localStorage.removeItem(key));
    localStorage.setItem(STORAGE_VERSION_KEY, STORAGE_VERSION);
    window.dispatchEvent(new CustomEvent(ONBOARDING_PROGRESS_EVENT));
  } catch {
    // ignore
  }
}

/** Green checks only when that step’s required fields are actually filled. */
export function getCompletedSteps(): OnboardingStepId[] {
  if (typeof window === "undefined") {
    return [];
  }

  resetStaleOnboardingStorage();

  const filled = formStepIds.filter((stepId) => isOnboardingStepFilled(stepId));

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filled));
  } catch {
    // Preview mode can continue without localStorage.
  }

  return filled;
}

export function markStepComplete(_stepId: OnboardingStepId) {
  if (typeof window === "undefined") {
    return;
  }

  // Completion is derived from filled fields — just notify listeners to re-check.
  window.dispatchEvent(new CustomEvent(ONBOARDING_PROGRESS_EVENT));
}

export function markStepIncomplete(_stepId: OnboardingStepId) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(ONBOARDING_PROGRESS_EVENT));
}

export function isStepComplete(stepId: OnboardingStepId) {
  return isOnboardingStepFilled(stepId);
}

export function getApplicationProgressPercent() {
  const completedCount = getCompletedSteps().length;
  // All form steps done still means review is open — credentials are not active yet.
  if (completedCount >= 4) return 80;
  return Math.round((completedCount / 5) * 100);
}
