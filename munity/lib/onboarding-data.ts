import type { OnboardingStepId } from "@/lib/routes";

const DATA_STORAGE_KEY = "munity-onboarding-step-data-v4";
const ONBOARDING_PROGRESS_EVENT = "munity-onboarding-progress-updated";

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

function hasText(value: string | undefined | null) {
  return Boolean(value && value.trim());
}

export function isOnboardingStepFilled(
  stepId: OnboardingStepId,
  data?: OnboardingStepDataMap[OnboardingStepId] | null,
): boolean {
  const stepData = data === undefined ? getOnboardingStepData(stepId) : data;
  if (!stepData) return false;

  switch (stepId) {
    case "basic-info": {
      const d = stepData as BasicInfoData;
      return (
        hasText(d.title) &&
        hasText(d.gender) &&
        hasText(d.firstName) &&
        hasText(d.lastName) &&
        hasText(d.professionalTitle) &&
        hasText(d.phone) &&
        hasText(d.practiceLocation) &&
        hasText(d.email)
      );
    }
    case "credentials": {
      const d = stepData as CredentialsData;
      return (
        hasText(d.licenseType) &&
        hasText(d.registrationNumber) &&
        hasText(d.licensingBody) &&
        hasText(d.regionOfIssue) &&
        hasText(d.documentName) &&
        Number.isFinite(d.yearsOfExperience)
      );
    }
    case "specialties": {
      const d = stepData as SpecialtiesData;
      return Array.isArray(d.specialties) && d.specialties.length > 0;
    }
    case "payout": {
      const d = stepData as PayoutData;
      if (!Array.isArray(d.payoutMethods) || d.payoutMethods.length === 0) return false;
      const hasMobileMoney = d.payoutMethods.includes("Mobile Money");
      const hasBank = d.payoutMethods.includes("Bank Transfer");
      if (hasMobileMoney) {
        if (
          !hasText(d.momoAccountName) ||
          !hasText(d.mobileMoneyNetwork) ||
          !hasText(d.momoNumber)
        ) {
          return false;
        }
      }
      if (hasBank) {
        if (
          !hasText(d.bankAccountName) ||
          !hasText(d.bankName) ||
          !hasText(d.bankAccountNumber)
        ) {
          return false;
        }
      }
      return true;
    }
    default:
      return false;
  }
}

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
