"use client";

import { OnboardingStepPage } from "@/components/onboarding/OnboardingStepPage";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { routes } from "@/lib/routes";

const stateOptions = [
  { value: "", label: "Select state" },
  { value: "CA", label: "California" },
  { value: "NY", label: "New York" },
  { value: "WA", label: "Washington" },
  { value: "TX", label: "Texas" },
  { value: "FL", label: "Florida" },
];

export default function BasicInfoPage() {
  return (
    <OnboardingStepPage
      stepId="basic-info"
      title="Basic Info"
      description="Tell us a little about yourself so we can set up your therapist profile."
      backHref={routes.signup}
      backLabel="Back to Sign Up"
      continueHref={routes.onboarding.credentials}
      continueLabel="Continue to Credentials"
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Field label="First Name">
          <input type="text" placeholder="Jane" className="input-field" />
        </Field>
        <Field label="Last Name">
          <input type="text" placeholder="Smith" className="input-field" />
        </Field>
        <Field label="Professional Title">
          <input type="text" placeholder="Licensed Clinical Social Worker" className="input-field" />
        </Field>
        <Field label="Phone Number">
          <input type="tel" placeholder="(555) 123-4567" className="input-field" />
        </Field>
        <div className="md:col-span-2">
          <Select
            label="Practice Location"
            placeholder="Select state"
            options={stateOptions.filter((option) => option.value !== "")}
          />
        </div>
      </div>
    </OnboardingStepPage>
  );
}
