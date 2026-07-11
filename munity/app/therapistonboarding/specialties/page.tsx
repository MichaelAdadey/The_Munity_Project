"use client";

import { useState } from "react";
import { OnboardingStepPage } from "@/components/therapistonboarding/OnboardingStepPage";
import { ChipSelect } from "@/components/ui/ChipSelect";
import { routes } from "@/lib/routes";

const specialties = [
  "Anxiety & Stress",
  "Depression",
  "Trauma & PTSD",
  "Relationship Issues",
  "Grief & Loss",
  "Addiction Recovery",
  "LGBTQ+ Support",
  "Family Therapy",
];

export default function SpecialtiesPage() {
  const [selected, setSelected] = useState<string[]>(["Anxiety & Stress", "Depression"]);

  return (
    <OnboardingStepPage
      stepId="specialties"
      title="Specialties & Expertise"
      description="Select the areas where you have clinical expertise. This helps patients find the right therapist."
      backHref={routes.therapistOnboarding.credentials}
      backLabel="Back to Credentials"
      continueHref={routes.therapistOnboarding.payout}
      continueLabel="Continue to Payout Settings"
      validate={() => {
        if (selected.length === 0) {
          window.alert("Please select at least one specialty.");
          return false;
        }
        return true;
      }}
    >
      <ChipSelect options={specialties} value={selected} onChange={setSelected} />
      <p className="mt-6 text-sm text-munity-muted">
        {selected.length} selected — you can update your specialties anytime from your profile settings.
      </p>
    </OnboardingStepPage>
  );
}
