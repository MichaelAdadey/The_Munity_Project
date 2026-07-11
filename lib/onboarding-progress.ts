import type { OnboardingStepId } from "@/lib/routes";

const STORAGE_KEY = "munity-onboarding-completed-steps";
export const ONBOARDING_PROGRESS_EVENT = "munity-onboarding-progress-updated";

const formStepIds: OnboardingStepId[] = [
  "basic-info",
  "credentials",
  "specialties",
  "payout",
];

export function getCompletedSteps(): OnboardingStepId[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((step): step is OnboardingStepId =>
      formStepIds.includes(step as OnboardingStepId),
    );
  } catch {
    return [];
  }
}

export function markStepComplete(stepId: OnboardingStepId) {
  if (typeof window === "undefined") {
    return;
  }

  const completed = new Set(getCompletedSteps());
  completed.add(stepId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
  window.dispatchEvent(new CustomEvent(ONBOARDING_PROGRESS_EVENT));
}

export function isStepComplete(stepId: OnboardingStepId) {
  return getCompletedSteps().includes(stepId);
}

export function getApplicationProgressPercent() {
  const completedCount = getCompletedSteps().length;
  // Four form steps plus review = five milestones on the credential sidebar.
  return Math.round((completedCount / 5) * 100);
}
