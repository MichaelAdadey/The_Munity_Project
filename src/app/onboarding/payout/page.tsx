import { OnboardingStepPage } from "@/components/onboarding/OnboardingStepPage";
import { routes } from "@/lib/routes";

export default function PayoutPage() {
  return (
    <OnboardingStepPage
      stepId="payout"
      title="Payout Settings"
      description="Connect your bank account to receive payments for sessions and community support."
      backHref={routes.onboarding.specialties}
      backLabel="Back to Specialties"
      continueHref={routes.dashboard}
      continueLabel="Finish & Go to Dashboard"
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Field label="Account Holder Name">
          <input type="text" placeholder="Jane Smith" className="input-field" />
        </Field>
        <Field label="Bank Name">
          <input type="text" placeholder="Chase Bank" className="input-field" />
        </Field>
        <Field label="Routing Number">
          <input type="text" placeholder="021000021" className="input-field" />
        </Field>
        <Field label="Account Number">
          <input type="text" placeholder="**** **** **** 1234" className="input-field" />
        </Field>
      </div>
      <p className="mt-6 text-sm text-munity-muted">
        Your banking information is encrypted and stored securely. Payouts are processed weekly.
      </p>
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
