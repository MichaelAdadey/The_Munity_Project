import type { OnboardingStepId } from "@/lib/routes";
import { ONBOARDING_PROGRESS_EVENT } from "@/lib/onboarding-progress";

const DATA_STORAGE_KEY = "munity-onboarding-step-data";

export type BasicInfoData = {
  title: string;
  gender: string;
  firstName: string;
  lastName: string;
  professionalTitle: string;
  phone: string;
  practiceLocation: string;
  email: string;
};

export type CredentialsData = {
  licenseType: string;
  registrationNumber: string;
  licensingBody: string;
  regionOfIssue: string;
  yearsOfExperience: number;
  documentName: string;
};

export type SpecialtiesData = {
  specialties: string[];
};

export type PayoutData = {
  payoutMethods: string[];
  momoAccountName: string;
  mobileMoneyNetwork: string;
  momoNumber: string;
  bankAccountName: string;
  bankName: string;
  bankAccountNumber: string;
};

export type OnboardingStepDataMap = {
  "basic-info": BasicInfoData;
  credentials: CredentialsData;
  specialties: SpecialtiesData;
  payout: PayoutData;
};

type StoredOnboardingData = Partial<{
  [K in OnboardingStepId]: OnboardingStepDataMap[K];
}>;

function readAll(): StoredOnboardingData {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = localStorage.getItem(DATA_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return {};
    }
    return parsed as StoredOnboardingData;
  } catch {
    return {};
  }
}

function writeAll(data: StoredOnboardingData) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent(ONBOARDING_PROGRESS_EVENT));
  } catch {
    // Preview mode can continue without localStorage.
  }
}

export function getOnboardingStepData<T extends OnboardingStepId>(
  stepId: T,
): OnboardingStepDataMap[T] | null {
  const all = readAll();
  return all[stepId] ?? null;
}

export function saveOnboardingStepData<T extends OnboardingStepId>(
  stepId: T,
  data: OnboardingStepDataMap[T],
) {
  const all = readAll();
  all[stepId] = data;
  writeAll(all);
}

export function getAllOnboardingStepData(): StoredOnboardingData {
  return readAll();
}
