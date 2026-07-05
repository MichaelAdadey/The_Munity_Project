import type { assets } from "@/lib/assets";

export const routes = {
  home: "/",
  login: "/login",
  signup: "/signup",
  dev: "/dev",
  dashboard: "/dashboard",
  onboarding: {
    basicInfo: "/onboarding/basic-info",
    credentials: "/onboarding/credentials",
    specialties: "/onboarding/specialties",
    payout: "/onboarding/payout",
  },
} as const;

export type OnboardingStepId = "basic-info" | "credentials" | "specialties" | "payout";

export const onboardingSteps: {
  id: OnboardingStepId;
  number: number;
  label: string;
  title: string;
  href: string;
}[] = [
  {
    id: "basic-info",
    number: 1,
    label: "Step 1",
    title: "Basic Info",
    href: routes.onboarding.basicInfo,
  },
  {
    id: "credentials",
    number: 2,
    label: "Step 2",
    title: "Professional Credentials",
    href: routes.onboarding.credentials,
  },
  {
    id: "specialties",
    number: 3,
    label: "Step 3",
    title: "Specialties & Expertise",
    href: routes.onboarding.specialties,
  },
  {
    id: "payout",
    number: 4,
    label: "Step 4",
    title: "Payout Settings",
    href: routes.onboarding.payout,
  },
];

export type PatientSlug = "leo-richards" | "elena-rodriguez" | "alex-mercer";

export type PatientAvatarKey = keyof (typeof assets)["avatars"];

export type PatientRecord = {
  slug: PatientSlug;
  name: string;
  clientId: string;
  avatarKey: PatientAvatarKey;
};

export const defaultPatientSlug: PatientSlug = "leo-richards";

export const patientsBySlug: Record<PatientSlug, PatientRecord> = {
  "leo-richards": {
    slug: "leo-richards",
    name: "Leo Richards",
    clientId: "#LR-2847",
    avatarKey: "leo",
  },
  "elena-rodriguez": {
    slug: "elena-rodriguez",
    name: "Elena Rodriguez",
    clientId: "#ER-4421",
    avatarKey: "elena",
  },
  "alex-mercer": {
    slug: "alex-mercer",
    name: "Alex Mercer",
    clientId: "#8201",
    avatarKey: "alex",
  },
};

export const patientSlugs = Object.keys(patientsBySlug) as PatientSlug[];

export function isPatientSlug(slug: string): slug is PatientSlug {
  return slug in patientsBySlug;
}

export function getPatient(slug: string): PatientRecord | null {
  if (!isPatientSlug(slug)) {
    return null;
  }
  return patientsBySlug[slug];
}

export function patientRoutes(slug: PatientSlug) {
  return {
    overview: `/patients/${slug}`,
    clinicalNotes: `/patients/${slug}/clinical-notes`,
    progress: `/patients/${slug}/progress`,
  };
}

export type PatientNavSection = "Overview" | "Clinical Notes" | "Progress";

export function patientNavHref(slug: PatientSlug, section: PatientNavSection): string {
  const paths = patientRoutes(slug);
  switch (section) {
    case "Overview":
      return paths.overview;
    case "Clinical Notes":
      return paths.clinicalNotes;
    case "Progress":
      return paths.progress;
  }
}

/** @deprecated Use patientRoutes(slug) for slug-aware navigation */
export const patients = {
  leo: patientsBySlug["leo-richards"],
  elena: patientsBySlug["elena-rodriguez"],
  alex: patientsBySlug["alex-mercer"],
} as const;
