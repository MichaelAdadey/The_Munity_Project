import { OnboardingStepPage } from "@/components/onboarding/OnboardingStepPage";
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
  return (
    <OnboardingStepPage
      stepId="specialties"
      title="Specialties & Expertise"
      description="Select the areas where you have clinical expertise. This helps patients find the right therapist."
      backHref={routes.onboarding.credentials}
      backLabel="Back to Credentials"
      continueHref={routes.onboarding.payout}
      continueLabel="Continue to Payout Settings"
    >
      <div className="flex flex-wrap gap-3">
        {specialties.map((specialty) => (
          <button
            key={specialty}
            type="button"
            className="rounded-full border border-munity-input-border bg-munity-bg px-4 py-2 text-sm font-semibold text-munity-muted transition hover:border-munity-green hover:text-munity-green"
          >
            {specialty}
          </button>
        ))}
      </div>
      <p className="mt-6 text-sm text-munity-muted">
        You can update your specialties anytime from your profile settings.
      </p>
    </OnboardingStepPage>
  );
}
