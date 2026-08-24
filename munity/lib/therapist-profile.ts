"use client";

export type TherapistProfile = {
  title: string;
  gender: string;
  firstName: string;
  lastName: string;
  professionalTitle: string;
  phone: string;
  practiceLocation: string;
  email: string;
  bio: string;
  licensingBody: string;
  licenseType: string;
  licenseNumber: string;
  licenseExpiry: string;
  verificationStatus: "verified" | "pending" | "in-review" | "rejected";
  specialties: string[];
  payoutMethods: string[];
  mobileMoneyNetwork?: string;
  mobileMoneyNumber?: string;
  bankName?: string;
  bankAccountLast4?: string;
  memberSince: string;
};

const STORAGE_KEY = "munity-therapist-profile-v1";

/** Preview data until therapist profile is loaded from Supabase. Matches demo login. */
export const currentTherapistProfile: TherapistProfile = {
  title: "Dr.",
  gender: "Female",
  firstName: "Elena",
  lastName: "Aris",
  professionalTitle: "Registered Clinical Psychologist",
  phone: "+233 24 123 4567",
  practiceLocation: "Greater Accra",
  email: "elena.aris@munity.app",
  bio: "Clinical psychologist with 8 years of experience supporting adults through anxiety, depression, and life transitions. Based in Accra, offering video and in-person sessions.",
  licensingBody: "Ghana Psychology Council (GPC)",
  licenseType: "Registered Clinical Psychologist",
  licenseNumber: "GPC-PSY-2018-0042",
  licenseExpiry: "Dec 2026",
  verificationStatus: "verified",
  specialties: [
    "Anxiety & Stress",
    "Depression",
    "Trauma & PTSD",
    "Relationship Issues",
  ],
  payoutMethods: ["Mobile Money", "Bank Transfer"],
  mobileMoneyNetwork: "MTN Mobile Money",
  mobileMoneyNumber: "••• ••• 4567",
  bankName: "GCB Bank",
  bankAccountLast4: "4821",
  memberSince: "January 2024",
};

export function getTherapistDisplayName(profile: TherapistProfile) {
  return `${profile.title} ${profile.firstName} ${profile.lastName}`.trim();
}

export function loadTherapistProfile(): TherapistProfile {
  if (typeof window === "undefined") return currentTherapistProfile;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return currentTherapistProfile;
    const parsed = JSON.parse(raw) as Partial<TherapistProfile>;
    return {
      ...currentTherapistProfile,
      ...parsed,
      specialties: parsed.specialties ?? currentTherapistProfile.specialties,
      payoutMethods: parsed.payoutMethods ?? currentTherapistProfile.payoutMethods,
    };
  } catch {
    return currentTherapistProfile;
  }
}

export function saveTherapistProfile(profile: TherapistProfile) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // ignore quota errors in preview
  }
}
