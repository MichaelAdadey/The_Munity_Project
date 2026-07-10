"use client";

import { useState } from "react";
import { OnboardingStepPage } from "@/components/therapistonboarding/OnboardingStepPage";
import { Field } from "@/components/ui/Field";
import { FileUpload } from "@/components/ui/FileUpload";
import { RangeField } from "@/components/ui/RangeField";
import { Select } from "@/components/ui/AppSelect";
import { assets } from "@/lib/assets";
import {
  ghanaLicenseTypes,
  ghanaLicensingBodies,
  ghanaRegions,
} from "@/lib/ghana-therapist";
import { routes } from "@/lib/routes";

export default function CredentialsPage() {
  const [licenseType, setLicenseType] = useState("");
  const [licensingBody, setLicensingBody] = useState("");
  const [regionOfIssue, setRegionOfIssue] = useState("");

  return (
    <OnboardingStepPage
      stepId="credentials"
      title="Professional Credentials"
      description="Please provide your licensing details. We verify all credentials with recognised Ghanaian councils to ensure the highest standard of care for our community."
      backHref={routes.therapistOnboarding.basicInfo}
      backLabel="Back to Basic Info"
      continueHref={routes.therapistOnboarding.specialties}
      continueLabel="Continue to Specialties"
      validate={() => {
        if (!licenseType || !licensingBody || !regionOfIssue) {
          window.alert("Please complete all credential fields.");
          return false;
        }
        return true;
      }}
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
        <Select
          label="License Type"
          placeholder="Select your license type"
          options={[...ghanaLicenseTypes]}
          value={licenseType}
          onChange={setLicenseType}
        />
        <Field label="Council Registration Number">
          <input
            type="text"
            name="registrationNumber"
            placeholder="e.g. GPC/CP/2024/0042"
            className="input-field"
            required
          />
        </Field>
        <Select
          label="Licensing Body"
          placeholder="Select council"
          options={[...ghanaLicensingBodies]}
          value={licensingBody}
          onChange={setLicensingBody}
        />
        <Select
          label="Region of Issue"
          placeholder="Select region"
          options={[...ghanaRegions]}
          value={regionOfIssue}
          onChange={setRegionOfIssue}
        />
        <RangeField label="Years of Experience" min={0} max={20} defaultValue={5} />
      </div>

      <hr className="my-8 border-munity-input-border/30" />

      <div>
        <label className="block text-sm font-semibold tracking-wide text-munity-muted">
          Verification of Credentials
        </label>
        <p className="mt-1 text-xs font-medium text-munity-muted">
          Upload a copy of your current council registration or certification document.
        </p>
        <FileUpload />
      </div>
    </OnboardingStepPage>
  );
}
