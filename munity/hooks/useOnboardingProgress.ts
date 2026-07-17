"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getApplicationProgressPercent,
  getCompletedSteps,
  markStepComplete as persistStepComplete,
  ONBOARDING_PROGRESS_EVENT,
  resetStaleOnboardingStorage,
} from "@/lib/onboarding-progress";
import { isOnboardingStepFilled } from "@/lib/onboarding-data";
import type { OnboardingStepId } from "@/lib/routes";

export function useOnboardingProgress() {
  const [completedSteps, setCompletedSteps] = useState<OnboardingStepId[]>([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => {
    resetStaleOnboardingStorage();
    setCompletedSteps(getCompletedSteps());
    setProgressPercent(getApplicationProgressPercent());
    setTick((n) => n + 1);
  }, []);

  useEffect(() => {
    refresh();

    function handleUpdate() {
      refresh();
    }

    window.addEventListener(ONBOARDING_PROGRESS_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(ONBOARDING_PROGRESS_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [refresh]);

  const markStepComplete = useCallback(
    (stepId: OnboardingStepId) => {
      persistStepComplete(stepId);
      refresh();
    },
    [refresh],
  );

  const isStepComplete = useCallback(
    (stepId: OnboardingStepId) => isOnboardingStepFilled(stepId),
    // tick forces re-bind after storage updates so sidebars re-render correctly
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tick],
  );

  return {
    completedSteps,
    progressPercent,
    isStepComplete,
    markStepComplete,
    refresh,
  };
}
