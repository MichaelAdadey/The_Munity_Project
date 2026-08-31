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
  therapistMessages: "/therapistmessages",
  saved: "/saved",
  settings: "/settings",
  profile: "/profile",
  emergency: "/emergency",
  notifications: "/notifications",
  therapistNotifications: "/therapistnotifications",
  communities: "/Communities",
  therapy: "/Therapy",
  sessions: "/sessions",
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

export function messagesPath(opts?: { therapistId?: string; chatId?: string }) {
  if (opts?.therapistId) {
    return `${routes.messages}?therapist=${encodeURIComponent(opts.therapistId)}`;
  }
  if (opts?.chatId) {
    return `${routes.messages}?chat=${encodeURIComponent(opts.chatId)}`;
  }
  return routes.messages;
}

export function therapistMessagesPath(opts?: { chatId?: string }) {
  if (opts?.chatId) {
    return `${routes.therapistMessages}?chat=${encodeURIComponent(opts.chatId)}`;
  }
  return routes.therapistMessages;
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

/** A real patient's `profiles.id` (UUID). Named `slug` since it's what fills the `[slug]` route segment. */
export type PatientSlug = string;

/**
 * Minimal identity shape the patient-detail views/sidebar need to render.
 * `lib/therapist/patients-queries.ts`'s `TherapistPatient` is a superset of this,
 * so real patient data drops straight in.
 */
export type PatientRecord = {
  slug: PatientSlug;
  name: string;
  clientId: string;
  avatar: string;
};

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
