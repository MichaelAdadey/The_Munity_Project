"use client";

import { useEffect, useState } from "react";
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
import { getOnboardingStepData, saveOnboardingStepData } from "@/lib/onboarding-data";
import { routes } from "@/lib/routes";

export default function CredentialsPage() {
  const [licenseType, setLicenseType] = useState("");
  const [licensingBody, setLicensingBody] = useState("");
  const [regionOfIssue, setRegionOfIssue] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState(5);
  const [documentName, setDocumentName] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = getOnboardingStepData("credentials");
    if (saved) {
      setLicenseType(saved.licenseType);
      setLicensingBody(saved.licensingBody);
      setRegionOfIssue(saved.regionOfIssue);
      setRegistrationNumber(saved.registrationNumber);
      setYearsOfExperience(saved.yearsOfExperience);
      setDocumentName(saved.documentName);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveOnboardingStepData("credentials", {
      licenseType,
      licensingBody,
      regionOfIssue,
      registrationNumber,
      yearsOfExperience,
      documentName,
    });
  }, [
    hydrated,
    licenseType,
    licensingBody,
    regionOfIssue,
    registrationNumber,
    yearsOfExperience,
    documentName,
  ]);

  if (!hydrated) {
    return null;
  }

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
        if (!documentName) {
          window.alert("Please upload your verification document.");
          return false;
        }
        return true;
      }}
      onSave={() => {
        saveOnboardingStepData("credentials", {
          licenseType,
          licensingBody,
          regionOfIssue,
          registrationNumber,
          yearsOfExperience,
          documentName,
        });
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
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
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
        <RangeField
          label="Years of Experience"
          min={0}
          max={20}
          value={yearsOfExperience}
          onChange={setYearsOfExperience}
        />
      </div>

      <hr className="my-8 border-munity-input-border/30" />

      <div>
        <label className="block text-sm font-semibold tracking-wide text-munity-muted">
          Verification of Credentials
        </label>
        <p className="mt-1 text-xs font-medium text-munity-muted">
          Upload a copy of your current council registration or certification document.
        </p>
        {documentName ? (
          <p className="mt-2 text-sm text-munity-muted">Previously uploaded: {documentName}</p>
        ) : null}
        <FileUpload onFileChange={(file) => setDocumentName(file?.name ?? "")} />
      </div>
    </OnboardingStepPage>
  );
}
