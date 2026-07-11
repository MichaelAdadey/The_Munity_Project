"use client";

import { useEffect, useState } from "react";
import { createTherapistAccount } from "@/app/therapistsignup/actions";
import { OnboardingStepPage } from "@/components/therapistonboarding/OnboardingStepPage";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/AppSelect";
import { genderOptions, ghanaRegions, honorificTitles } from "@/lib/ghana-therapist";
import { getOnboardingStepData, saveOnboardingStepData } from "@/lib/onboarding-data";
import { routes } from "@/lib/routes";

const CREDENTIALS_STORAGE_KEY = "munity-therapist-pending-credentials";

export default function BasicInfoPage() {
  const [title, setTitle] = useState("");
  const [gender, setGender] = useState("");
  const [practiceLocation, setPracticeLocation] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [professionalTitle, setProfessionalTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [accountError, setAccountError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = getOnboardingStepData("basic-info");
    if (saved) {
      setTitle(saved.title);
      setGender(saved.gender);
      setPracticeLocation(saved.practiceLocation);
      setFirstName(saved.firstName);
      setLastName(saved.lastName);
      setProfessionalTitle(saved.professionalTitle);
      setPhone(saved.phone);
      setEmail(saved.email);
    }
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null;
  }

  return (
    <OnboardingStepPage
      stepId="basic-info"
      title="Basic Info"
      description="Tell us a little about yourself and create the login you’ll use once your credentials are approved."
      backHref={routes.home}
      backLabel="Back to Home"
      continueHref={routes.therapistOnboarding.credentials}
      continueLabel="Continue to Credentials"
      validate={() => {
        if (!title) {
          window.alert("Please select your title.");
          return false;
        }
        if (!gender) {
          window.alert("Please select your gender.");
          return false;
        }
        if (!practiceLocation) {
          window.alert("Please select your practice location.");
          return false;
        }
        return true;
      }}
      onBeforeContinue={async (form) => {
        setAccountError(null);
        const formData = new FormData(form);
        const nextEmail = String(formData.get("email") || "").trim();

        const result = await createTherapistAccount(formData);
        if (result?.error) {
          setAccountError(result.error);
          return false;
        }

        try {
          localStorage.setItem(
            CREDENTIALS_STORAGE_KEY,
            JSON.stringify({ email: nextEmail, createdAt: Date.now() }),
          );
        } catch {
          // Preview mode can continue without localStorage.
        }

        return true;
      }}
      onSave={(form) => {
        const formData = new FormData(form);
        saveOnboardingStepData("basic-info", {
          title,
          gender,
          practiceLocation,
          firstName: String(formData.get("firstName") || "").trim(),
          lastName: String(formData.get("lastName") || "").trim(),
          professionalTitle: String(formData.get("professionalTitle") || "").trim(),
          phone: String(formData.get("phone") || "").trim(),
          email: String(formData.get("email") || "").trim(),
        });
      }}
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Select
          label="Title"
          placeholder="Select title"
          options={[...honorificTitles]}
          value={title}
          onChange={setTitle}
        />
        <Select
          label="Gender"
          placeholder="Select gender"
          options={[...genderOptions]}
          value={gender}
          onChange={setGender}
        />
        <Field label="First Name">
          <input
            type="text"
            name="firstName"
            placeholder="Ama"
            className="input-field"
            defaultValue={firstName}
            required
          />
        </Field>
        <Field label="Last Name">
          <input
            type="text"
            name="lastName"
            placeholder="Mensah"
            className="input-field"
            defaultValue={lastName}
            required
          />
        </Field>
        <Field label="Professional Title">
          <input
            type="text"
            name="professionalTitle"
            placeholder="Registered Clinical Psychologist"
            className="input-field"
            defaultValue={professionalTitle}
            required
          />
        </Field>
        <Field label="Phone Number">
          <input
            type="tel"
            name="phone"
            placeholder="+233 24 123 4567"
            className="input-field"
            defaultValue={phone}
            required
          />
        </Field>
        <div className="md:col-span-2">
          <Select
            label="Practice Location"
            placeholder="Select region"
            options={[...ghanaRegions]}
            value={practiceLocation}
            onChange={setPracticeLocation}
          />
        </div>
      </div>

      <div className="mt-10 border-t border-munity-border/60 pt-8">
        <h3 className="text-base font-semibold text-munity-text">Login credentials</h3>
        <p className="mt-1 text-sm text-munity-muted">
          After your application is verified, use these to sign in to your therapist account.
        </p>
        {accountError ? (
          <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">{accountError}</p>
        ) : null}
        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
          <Field label="Email Address">
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              className="input-field"
              autoComplete="email"
              defaultValue={email}
              required
            />
          </Field>
          <Field label="Password">
            <input
              type="password"
              name="password"
              placeholder="At least 8 characters"
              className="input-field"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </Field>
        </div>
      </div>
    </OnboardingStepPage>
  );
}
