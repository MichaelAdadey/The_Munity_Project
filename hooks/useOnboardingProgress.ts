"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getApplicationProgressPercent,
  getCompletedSteps,
  markStepComplete as persistStepComplete,
  ONBOARDING_PROGRESS_EVENT,
} from "@/lib/onboarding-progress";
import type { OnboardingStepId } from "@/lib/routes";

export function useOnboardingProgress() {
  const [completedSteps, setCompletedSteps] = useState<OnboardingStepId[]>([]);
  const [progressPercent, setProgressPercent] = useState(0);

  const refresh = useCallback(() => {
    setCompletedSteps(getCompletedSteps());
    setProgressPercent(getApplicationProgressPercent());
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
    (stepId: OnboardingStepId) => completedSteps.includes(stepId),
    [completedSteps],
  );

  return {
    completedSteps,
    progressPercent,
    isStepComplete,
    markStepComplete,
    refresh,
  };
}
