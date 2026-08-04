"use client";

import { useEffect, useState } from "react";
import { OnboardingStepPage } from "@/components/therapistonboarding/OnboardingStepPage";
import { Field } from "@/components/ui/Field";
import { ChipSelect } from "@/components/ui/ChipSelect";
import { Select } from "@/components/ui/AppSelect";
import { ghanaBanks, ghanaMobileMoneyProviders } from "@/lib/ghana-therapist";
import { getOnboardingStepData, saveOnboardingStepData, getAllOnboardingStepData } from "@/lib/onboarding-data";
import { submitTherapistOnboarding } from "@/app/therapistonboarding/actions";
import { submitTherapistApplication } from "@/lib/therapist-application-review";
import { routes } from "@/lib/routes";

const payoutMethodOptions = ["Mobile Money", "Bank Transfer"];

export default function PayoutPage() {
  const [payoutMethods, setPayoutMethods] = useState<string[]>([]);
  const [mobileMoneyNetwork, setMobileMoneyNetwork] = useState("");
  const [bankName, setBankName] = useState("");
  const [momoAccountName, setMomoAccountName] = useState("");
  const [momoNumber, setMomoNumber] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const saved = getOnboardingStepData("payout");
    if (saved) {
      setPayoutMethods(saved.payoutMethods);
      setMobileMoneyNetwork(saved.mobileMoneyNetwork);
      setBankName(saved.bankName);
      setMomoAccountName(saved.momoAccountName);
      setMomoNumber(saved.momoNumber);
      setBankAccountName(saved.bankAccountName);
      setBankAccountNumber(saved.bankAccountNumber);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !dirty) return;
    saveOnboardingStepData("payout", {
      payoutMethods,
      mobileMoneyNetwork,
      bankName,
      momoAccountName,
      momoNumber,
      bankAccountName,
      bankAccountNumber,
    });
  }, [
    hydrated,
    dirty,
    payoutMethods,
    mobileMoneyNetwork,
    bankName,
    momoAccountName,
    momoNumber,
    bankAccountName,
    bankAccountNumber,
  ]);

  const hasMobileMoney = payoutMethods.includes("Mobile Money");
  const hasBank = payoutMethods.includes("Bank Transfer");

  if (!hydrated) {
    return null;
  }

  return (
    <OnboardingStepPage
      stepId="payout"
      title="Payout Settings"
      description="Connect your Mobile Money and/or bank accounts to receive payments for sessions and community support in Ghana."
      backHref={routes.therapistOnboarding.specialties}
      backLabel="Back to Specialties"
      continueHref={routes.therapistCredentialAuth}
      continueLabel="Submit Application"
      validate={() => {
        if (payoutMethods.length === 0) {
          window.alert("Please select at least one payout method.");
          return false;
        }
        if (hasMobileMoney && !mobileMoneyNetwork) {
          window.alert("Please select your Mobile Money network.");
          return false;
        }
        if (hasBank && !bankName) {
          window.alert("Please select your bank.");
          return false;
        }
        return true;
      }}
      onBeforeContinue={async () => {
        const all = getAllOnboardingStepData();
        if (!all["basic-info"] || !all.credentials || !all.specialties || !all.payout) {
          window.alert("Please complete all onboarding steps before submitting.");
          return false;
        }
        const result = await submitTherapistOnboarding({
          basicInfo: all["basic-info"],
          credentials: all.credentials,
          specialties: all.specialties,
          payout: all.payout,
        });
        if (result.error) {
          window.alert(result.error);
          return false;
        }
        return true;
      }}
      onSave={(form) => {
        const formData = new FormData(form);
        saveOnboardingStepData("payout", {
          payoutMethods,
          mobileMoneyNetwork,
          bankName,
          momoAccountName: String(formData.get("momoAccountName") || "").trim(),
          momoNumber: String(formData.get("momoNumber") || "").trim(),
          bankAccountName: String(formData.get("bankAccountName") || "").trim(),
          bankAccountNumber: String(formData.get("bankAccountNumber") || "").trim(),
        });
        submitTherapistApplication();
      }}
    >
      <div>
        <label className="mb-3 block text-sm font-semibold tracking-wide text-munity-muted">
          Payout Methods
        </label>
        <ChipSelect
          options={payoutMethodOptions}
          value={payoutMethods}
          onChange={(value) => {
            setDirty(true);
            setPayoutMethods(value);
          }}
        />
        <p className="mt-3 text-sm text-munity-muted">
          Select all payment methods you want to use for payouts.
        </p>
      </div>

      {hasMobileMoney ? (
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="md:col-span-2">
            <Field label="Name on MoMo Account">
              <input
                type="text"
                name="momoAccountName"
                placeholder="Ama Mensah"
                className="input-field"
                value={momoAccountName}
                onChange={(e) => {
                  setDirty(true);
                  setMomoAccountName(e.target.value);
                }}
                required={hasMobileMoney}
              />
            </Field>
          </div>
          <Select
            label="Mobile Money Network"
            placeholder="Select network"
            options={[...ghanaMobileMoneyProviders]}
            value={mobileMoneyNetwork}
            onChange={(value) => {
              setDirty(true);
              setMobileMoneyNetwork(value);
            }}
          />
          <Field label="MoMo Number">
            <input
              type="text"
              name="momoNumber"
              placeholder="024 123 4567"
              className="input-field"
              value={momoNumber}
              onChange={(e) => {
                setDirty(true);
                setMomoNumber(e.target.value);
              }}
              required={hasMobileMoney}
            />
          </Field>
        </div>
      ) : null}

      {hasBank ? (
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="md:col-span-2">
            <Field label="Name on Bank Account">
              <input
                type="text"
                name="bankAccountName"
                placeholder="Ama Mensah"
                className="input-field"
                value={bankAccountName}
                onChange={(e) => {
                  setDirty(true);
                  setBankAccountName(e.target.value);
                }}
                required={hasBank}
              />
            </Field>
          </div>
          <Select
            label="Bank Name"
            placeholder="Select bank"
            options={[...ghanaBanks]}
            value={bankName}
            onChange={(value) => {
              setDirty(true);
              setBankName(value);
            }}
          />
          <Field label="Bank Account Number">
            <input
              type="text"
              name="bankAccountNumber"
              placeholder="1234567890"
              className="input-field"
              value={bankAccountNumber}
              onChange={(e) => {
                setDirty(true);
                setBankAccountNumber(e.target.value);
              }}
              required={hasBank}
            />
          </Field>
        </div>
      ) : null}

      <p className="mt-8 text-sm text-munity-muted">
        Your payout details are encrypted and stored securely. Payouts are processed weekly in
        Ghana cedis (GHS).
      </p>
    </OnboardingStepPage>
  );
}
