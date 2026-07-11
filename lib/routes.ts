import type { assets } from "@/lib/assets";

export const routes = {
  home: "/",
  memberHome: "/home",
  memberDashboard: "/dashboard",
  login: "/login",
  therapistLogin: "/therapistlogin",
  signup: "/signup",
  therapistSignup: "/therapistsignup",
  dev: "/dev",
  therapistDashboard: "/therapistdashboard",
  therapistProfile: "/therapistprofile",
  therapistPatients: "/therapistpatients",
  therapistClinicalNotes: "/therapistclinicalnotes",
  therapistAppointments: "/therapistappointments",
  therapistAvailability: "/therapistavailability",
  therapistSettings: "/therapistsettings",
  therapistAnalytics: "/therapistanalytics",
  therapistFiles: "/therapistfiles",
  therapistCarePlan: "/therapistcareplan",
  therapistCredentialAuth: "/therapistcredentialauth",
  resources: "/resources",
  messages: "/messages",
  saved: "/saved",
  settings: "/settings",
  profile: "/profile",
  emergency: "/emergency",
  notifications: "/notifications",
  therapistNotifications: "/therapistnotifications",
  communities: "/Communities",
  therapy: "/Therapy",
  privacy: "/privacy",
  terms: "/terms",
  help: "/help",
  admin: "/admin",
  adminLogin: "/admin/login",
  adminModeration: "/admin/moderation",
  adminCommunities: "/admin/communities",
  adminGrowth: "/admin/growth",
  adminTherapy: "/admin/therapy",
  adminResources: "/admin/resources",
  adminSettings: "/admin/settings",
  adminNotifications: "/admin/notifications",
  therapistOnboarding: {
    basicInfo: "/therapistonboarding/basic-info",
    credentials: "/therapistonboarding/credentials",
    specialties: "/therapistonboarding/specialties",
    payout: "/therapistonboarding/payout",
  },
} as const;

export function communityPath(slug: string) {
  return `${routes.communities}/${slug}`;
}

export function therapyPath(id: string) {
  return `${routes.therapy}/${id}`;
}

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
    href: routes.therapistOnboarding.basicInfo,
  },
  {
    id: "credentials",
    number: 2,
    label: "Step 2",
    title: "Professional Credentials",
    href: routes.therapistOnboarding.credentials,
  },
  {
    id: "specialties",
    number: 3,
    label: "Step 3",
    title: "Specialties & Expertise",
    href: routes.therapistOnboarding.specialties,
  },
  {
    id: "payout",
    number: 4,
    label: "Step 4",
    title: "Payout Settings",
    href: routes.therapistOnboarding.payout,
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
    overview: `/therapistpatients/${slug}`,
    clinicalNotes: `/therapistpatients/${slug}/clinical-notes`,
    newSessionNote: `/therapistpatients/${slug}/clinical-notes/new`,
    progress: `/therapistpatients/${slug}/progress`,
    files: `/therapistpatients/${slug}/files`,
    carePlan: `/therapistpatients/${slug}/care-plan`,
  };
}

export type PatientNavSection =
  | "Overview"
  | "Clinical Notes"
  | "Progress"
  | "Files"
  | "Care Plan";

export function patientNavHref(slug: PatientSlug, section: PatientNavSection): string {
  const paths = patientRoutes(slug);
  switch (section) {
    case "Overview":
      return paths.overview;
    case "Clinical Notes":
      return paths.clinicalNotes;
    case "Progress":
      return paths.progress;
    case "Files":
      return paths.files;
    case "Care Plan":
      return paths.carePlan;
  }
}

/** @deprecated Use patientRoutes(slug) for slug-aware navigation */
export const patients = {
  leo: patientsBySlug["leo-richards"],
  elena: patientsBySlug["elena-rodriguez"],
  alex: patientsBySlug["alex-mercer"],
} as const;
