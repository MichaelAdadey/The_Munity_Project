import type { OnboardingStepId } from "@/lib/routes";
import { isOnboardingStepFilled } from "@/lib/onboarding-data";

const STORAGE_KEY = "munity-onboarding-completed-steps-v2";
export const ONBOARDING_PROGRESS_EVENT = "munity-onboarding-progress-updated";

const formStepIds: OnboardingStepId[] = [
  "basic-info",
  "credentials",
  "specialties",
  "payout",
];

/** Green checks / progress only count steps whose required fields are actually filled. */
export function getCompletedSteps(): OnboardingStepId[] {
  if (typeof window === "undefined") {
    return [];
  }

  const filled = formStepIds.filter((stepId) => isOnboardingStepFilled(stepId));

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filled));
  } catch {
    // Preview mode can continue without localStorage.
  }

  return filled;
}

export function markStepComplete(stepId: OnboardingStepId) {
  if (typeof window === "undefined") {
    return;
  }

  // Only persist a check when the step data is actually complete.
  if (!isOnboardingStepFilled(stepId)) {
    window.dispatchEvent(new CustomEvent(ONBOARDING_PROGRESS_EVENT));
    return;
  }

  const completed = new Set(getCompletedSteps());
  completed.add(stepId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
  window.dispatchEvent(new CustomEvent(ONBOARDING_PROGRESS_EVENT));
}

export function isStepComplete(stepId: OnboardingStepId) {
  return isOnboardingStepFilled(stepId);
}

export function getApplicationProgressPercent() {
  const completedCount = getCompletedSteps().length;
  // Four form steps plus review = five milestones on the credential sidebar.
  return Math.round((completedCount / 5) * 100);
}
