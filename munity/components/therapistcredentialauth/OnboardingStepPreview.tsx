"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getOnboardingStepData,
  type OnboardingStepDataMap,
} from "@/lib/onboarding-data";
import {
  ghanaBanks,
  ghanaLicenseTypes,
  ghanaLicensingBodies,
  ghanaMobileMoneyProviders,
  ghanaRegions,
  genderOptions,
  honorificTitles,
} from "@/lib/ghana-therapist";
import type { OnboardingStepId } from "@/lib/routes";

function optionLabel(
  options: readonly { value: string; label: string }[],
  value: string,
) {
  return options.find((option) => option.value === value)?.label ?? value;
}

function PreviewField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-semibold tracking-wide text-munity-muted">{label}</p>
      <p className="mt-1 text-base text-munity-text">{value || "—"}</p>
    </div>
  );
}

function EmptyPreview({ stepLabel }: { stepLabel: string }) {
  return (
    <p className="text-base text-munity-muted">
      No saved {stepLabel.toLowerCase()} yet. Complete this step during onboarding to preview it
      here.
    </p>
  );
}

const stepMeta: Record<OnboardingStepId, { title: string; description: string }> = {
  "basic-info": {
    title: "Basic Information",
    description: "Your personal details and login credentials from your application.",
  },
  credentials: {
    title: "Credentials Upload",
    description: "Licensing details and verification documents you submitted.",
  },
  specialties: {
    title: "Specialties & Profile",
    description: "Areas of expertise selected for your therapist profile.",
  },
  payout: {
    title: "Payout Configuration",
    description: "Payment methods you connected for session and support payouts.",
  },
};

export function OnboardingStepPreview({ stepId }: { stepId: OnboardingStepId }) {
  const meta = stepMeta[stepId];
  const [data, setData] = useState<OnboardingStepDataMap[OnboardingStepId] | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setData(getOnboardingStepData(stepId));
    setReady(true);
  }, [stepId]);

  return (
    <article className="w-full max-w-2xl rounded-[32px] border border-munity-border/50 bg-white/70 p-10 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] backdrop-blur-sm">
      <div className="mb-2 inline-flex rounded-full bg-munity-lime/60 px-3 py-1 text-xs font-semibold text-munity-olive-text">
        Read-only preview
      </div>
      <h1 className="text-[28px] font-bold text-munity-text">{meta.title}</h1>
      <p className="mt-2 text-base leading-relaxed text-munity-muted">{meta.description}</p>

      <div className="mt-8 border-t border-munity-border/50 pt-8">
        {!ready ? null : !data ? (
          <EmptyPreview stepLabel={meta.title} />
        ) : stepId === "basic-info" ? (
          <BasicInfoPreview data={data as OnboardingStepDataMap["basic-info"]} />
        ) : stepId === "credentials" ? (
          <CredentialsPreview data={data as OnboardingStepDataMap["credentials"]} />
        ) : stepId === "specialties" ? (
          <SpecialtiesPreview data={data as OnboardingStepDataMap["specialties"]} />
        ) : (
          <PayoutPreview data={data as OnboardingStepDataMap["payout"]} />
        )}
      </div>
    </article>
  );
}

function BasicInfoPreview({ data }: { data: OnboardingStepDataMap["basic-info"] }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <PreviewField label="Title" value={optionLabel(honorificTitles, data.title)} />
      <PreviewField label="Gender" value={optionLabel(genderOptions, data.gender)} />
      <PreviewField label="First Name" value={data.firstName} />
      <PreviewField label="Last Name" value={data.lastName} />
      <PreviewField label="Professional Title" value={data.professionalTitle} />
      <PreviewField label="Phone Number" value={data.phone} />
      <div className="md:col-span-2">
        <PreviewField
          label="Practice Location"
          value={optionLabel(ghanaRegions, data.practiceLocation)}
        />
      </div>
      <PreviewField label="Email Address" value={data.email} />
      <PreviewField label="Password" value="••••••••" />
    </div>
  );
}

function CredentialsPreview({ data }: { data: OnboardingStepDataMap["credentials"] }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <PreviewField
          label="License Type"
          value={optionLabel(ghanaLicenseTypes, data.licenseType)}
        />
        <PreviewField label="Council Registration Number" value={data.registrationNumber} />
        <PreviewField
          label="Licensing Body"
          value={optionLabel(ghanaLicensingBodies, data.licensingBody)}
        />
        <PreviewField
          label="Region of Issue"
          value={optionLabel(ghanaRegions, data.regionOfIssue)}
        />
        <PreviewField
          label="Years of Experience"
          value={data.yearsOfExperience >= 20 ? "20+" : String(data.yearsOfExperience)}
        />
      </div>
      <div>
        <p className="text-sm font-semibold tracking-wide text-munity-muted">
          Verification Document
        </p>
        <p className="mt-1 text-base text-munity-text">
          {data.documentName || "No document uploaded"}
        </p>
      </div>
    </div>
  );
}

function SpecialtiesPreview({ data }: { data: OnboardingStepDataMap["specialties"] }) {
  if (data.specialties.length === 0) {
    return <EmptyPreview stepLabel="specialties" />;
  }

  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-munity-text">
        Selected ({data.specialties.length})
      </p>
      <div className="flex flex-wrap gap-2">
        {data.specialties.map((specialty) => (
          <span
            key={specialty}
            className="inline-flex rounded-full border border-munity-green/30 bg-munity-lime px-3 py-1.5 text-xs font-semibold text-munity-olive-text"
          >
            {specialty}
          </span>
        ))}
      </div>
    </div>
  );
}

function PayoutPreview({ data }: { data: OnboardingStepDataMap["payout"] }) {
  const hasMobileMoney = data.payoutMethods.includes("Mobile Money");
  const hasBank = data.payoutMethods.includes("Bank Transfer");

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-3 text-sm font-semibold tracking-wide text-munity-muted">
          Payout Methods
        </p>
        <div className="flex flex-wrap gap-2">
          {data.payoutMethods.length > 0 ? (
            data.payoutMethods.map((method) => (
              <span
                key={method}
                className="inline-flex rounded-full border border-munity-green/30 bg-munity-lime px-3 py-1.5 text-xs font-semibold text-munity-olive-text"
              >
                {method}
              </span>
            ))
          ) : (
            <p className="text-base text-munity-muted">—</p>
          )}
        </div>
      </div>

      {hasMobileMoney ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <PreviewField label="Name on MoMo Account" value={data.momoAccountName} />
          </div>
          <PreviewField
            label="Mobile Money Network"
            value={optionLabel(ghanaMobileMoneyProviders, data.mobileMoneyNetwork)}
          />
          <PreviewField label="MoMo Number" value={data.momoNumber} />
        </div>
      ) : null}

      {hasBank ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <PreviewField label="Name on Bank Account" value={data.bankAccountName} />
          </div>
          <PreviewField label="Bank Name" value={optionLabel(ghanaBanks, data.bankName)} />
          <PreviewField label="Bank Account Number" value={data.bankAccountNumber} />
        </div>
      ) : null}
    </div>
  );
}
