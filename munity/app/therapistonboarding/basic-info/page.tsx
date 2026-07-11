"use client";

import { useState } from "react";
import { OnboardingStepPage } from "@/components/therapistonboarding/OnboardingStepPage";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/AppSelect";
import { genderOptions, ghanaRegions, honorificTitles } from "@/lib/ghana-therapist";
import { routes } from "@/lib/routes";

export default function BasicInfoPage() {
  const [title, setTitle] = useState("");
  const [gender, setGender] = useState("");
  const [practiceLocation, setPracticeLocation] = useState("");

  return (
    <OnboardingStepPage
      stepId="basic-info"
      title="Basic Info"
      description="Tell us a little about yourself so we can set up your therapist profile for practice in Ghana."
      backHref={routes.therapistSignup}
      backLabel="Back to Sign Up"
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
          <input type="text" name="firstName" placeholder="Ama" className="input-field" required />
        </Field>
        <Field label="Last Name">
          <input type="text" name="lastName" placeholder="Mensah" className="input-field" required />
        </Field>
        <Field label="Professional Title">
          <input
            type="text"
            name="professionalTitle"
            placeholder="Registered Clinical Psychologist"
            className="input-field"
            required
          />
        </Field>
        <Field label="Phone Number">
          <input
            type="tel"
            name="phone"
            placeholder="+233 24 123 4567"
            className="input-field"
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
    </OnboardingStepPage>
  );
}
