import { ChevronDown, Upload } from "lucide-react";
import { OnboardingStepPage } from "@/components/onboarding/OnboardingStepPage";
import { assets } from "@/lib/assets";
import { routes } from "@/lib/routes";

export default function CredentialsPage() {
  return (
    <OnboardingStepPage
      stepId="credentials"
      title="Professional Credentials"
      description="Please provide your licensing details. We verify all credentials to ensure the highest standard of care for our community."
      backHref={routes.onboarding.basicInfo}
      backLabel="Back to Basic Info"
      continueHref={routes.onboarding.specialties}
      continueLabel="Continue to Specialties"
      footer={
        <div className="relative flex items-center justify-center gap-8 opacity-40">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-white mix-blend-saturation" />
          {assets.onboarding.trustBadges.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="" className="h-8 w-24 object-contain" />
          ))}
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Field label="License Type">
          <select className="input-field appearance-none">
            <option>Select your license type</option>
            <option>LCSW</option>
            <option>LMFT</option>
            <option>PhD / PsyD</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-munity-text" />
        </Field>

        <Field label="License Number">
          <input type="text" placeholder="e.g. 123456789" className="input-field" />
        </Field>

        <Field label="State of Issue">
          <select className="input-field appearance-none">
            <option>Select state</option>
            <option>California</option>
            <option>New York</option>
            <option>Washington</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-munity-text" />
        </Field>

        <div>
          <label className="mb-2 block text-sm font-semibold tracking-wide text-munity-muted">
            Years of Experience
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={0}
              max={20}
              defaultValue={5}
              className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-munity-divider accent-munity-green"
            />
            <span className="rounded-full bg-munity-olive px-3 py-1 text-sm font-semibold text-munity-green">
              5+
            </span>
          </div>
        </div>
      </div>

      <hr className="my-8 border-munity-input-border/30" />

      <div>
        <label className="block text-sm font-semibold tracking-wide text-munity-muted">
          Verification of Credentials
        </label>
        <p className="mt-1 text-xs font-medium text-munity-muted">
          Upload a copy of your current state license or certification document.
        </p>
        <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-munity-input-border bg-munity-sidebar/30 px-6 py-12 transition hover:border-munity-green/50">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-munity-lime">
            <Upload className="size-6 text-munity-green" />
          </div>
          <p className="text-sm">
            <span className="font-bold text-munity-green">Click to upload</span>
            <span className="font-semibold text-munity-text"> or drag and drop</span>
          </p>
          <p className="mt-1 text-xs font-medium text-munity-muted">
            PDF, JPG, or PNG (Max 10MB)
          </p>
          <input type="file" className="sr-only" accept=".pdf,.jpg,.jpeg,.png" />
        </label>
      </div>
    </OnboardingStepPage>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold tracking-wide text-munity-muted">
        {label}
      </label>
      <div className="relative">{children}</div>
    </div>
  );
}
