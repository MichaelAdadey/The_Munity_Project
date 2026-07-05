import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { OnboardingStepPage } from "@/components/onboarding/OnboardingStepPage";
import { routes } from "@/lib/routes";

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
          <Field label="Practice Location">
            <select className="input-field appearance-none">
              <option>Select state</option>
              <option>California</option>
              <option>New York</option>
              <option>Washington</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-munity-text" />
          </Field>
        </div>
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
