"use client";

import { OnboardingStepPage } from "@/components/therapistonboarding/OnboardingStepPage";
import { Field } from "@/components/ui/Field";
import { FileUpload } from "@/components/ui/FileUpload";
import { RangeField } from "@/components/ui/RangeField";
import { Select } from "@/components/ui/AppSelect";
import { assets } from "@/lib/assets";
import { routes } from "@/lib/routes";

const licenseOptions = [
  { value: "lcsw", label: "LCSW" },
  { value: "lmft", label: "LMFT" },
  { value: "phd", label: "PhD / PsyD" },
  { value: "lpc", label: "LPC" },
];

const stateOptions = [
  { value: "CA", label: "California" },
  { value: "NY", label: "New York" },
  { value: "WA", label: "Washington" },
  { value: "TX", label: "Texas" },
];

export default function CredentialsPage() {
  return (
    <OnboardingStepPage
      stepId="credentials"
      title="Professional Credentials"
      description="Please provide your licensing details. We verify all credentials to ensure the highest standard of care for our community."
      backHref={routes.therapistOnboarding.basicInfo}
      backLabel="Back to Basic Info"
      continueHref={routes.therapistOnboarding.specialties}
      continueLabel="Continue to Specialties"
      footer={
        <div className="relative flex items-center justify-center gap-8 opacity-40">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-white mix-blend-saturation" />
          {assets.therapistOnboarding.trustBadges.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="" className="h-8 w-24 object-contain" />
          ))}
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Select label="License Type" placeholder="Select your license type" options={licenseOptions} />
        <Field label="License Number">
          <input type="text" placeholder="e.g. 123456789" className="input-field" />
        </Field>
        <Select label="State of Issue" placeholder="Select state" options={stateOptions} />
        <RangeField label="Years of Experience" min={0} max={20} defaultValue={5} />
      </div>

      <hr className="my-8 border-munity-input-border/30" />

      <div>
        <label className="block text-sm font-semibold tracking-wide text-munity-muted">
          Verification of Credentials
        </label>
        <p className="mt-1 text-xs font-medium text-munity-muted">
          Upload a copy of your current state license or certification document.
        </p>
        <FileUpload />
      </div>
    </OnboardingStepPage>
  );
}
