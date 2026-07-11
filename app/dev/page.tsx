import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import {
  patientRoutes,
  patientSlugs,
  patientsBySlug,
  routes,
} from "@/lib/routes";

const screens = [
  { title: "Landing Page", subtitle: "Public homepage", href: routes.home },
  { title: "Member Home", subtitle: "Personalized peer support feed", href: routes.memberHome },
  { title: "Communities", subtitle: "Browse peer support communities", href: routes.communities },
  { title: "Therapy", subtitle: "Browse the therapy network", href: routes.therapy },
  { title: "Messages", subtitle: "Member conversations", href: routes.messages },
  { title: "Profile", subtitle: "Member profile and activity", href: routes.profile },
  { title: "Emergency Support", subtitle: "Immediate support resources", href: routes.emergency },
  { title: "Privacy Policy", subtitle: "Public privacy preview", href: routes.privacy },
  { title: "Login", subtitle: "Sign in to your Munity account", href: routes.login },
  {
    title: "Therapist Login",
    subtitle: "Sign in to your therapist account",
    href: routes.therapistLogin,
  },
  {
    title: "Admin Login",
    subtitle: "Platform admin console",
    href: routes.adminLogin,
  },
  {
    title: "Admin Dashboard",
    subtitle: "Reviews, members, and support overview",
    href: routes.admin,
  },
  { title: "Sign Up", subtitle: "Create account → therapist onboarding", href: routes.signup },
  {
    title: "Therapist Sign Up",
    subtitle: "Create a therapist account → onboarding",
    href: routes.therapistSignup,
  },
  {
    title: "Onboarding — Basic Info",
    subtitle: "Step 1 of 4",
    href: routes.therapistOnboarding.basicInfo,
  },
  {
    title: "Onboarding — Credentials",
    subtitle: "Step 2 of 4",
    href: routes.therapistOnboarding.credentials,
  },
  {
    title: "Onboarding — Specialties",
    subtitle: "Step 3 of 4",
    href: routes.therapistOnboarding.specialties,
  },
  {
    title: "Onboarding — Payout",
    subtitle: "Step 4 of 4 → credential authentication",
    href: routes.therapistOnboarding.payout,
  },
  {
    title: "Credential Authentication",
    subtitle: "Review in progress after credential verification",
    href: routes.therapistCredentialAuth,
  },
  {
    title: "Dashboard",
    subtitle: "Therapist clinical home — schedule, caseload, and tasks",
    href: routes.therapistDashboard,
  },
  {
    title: "Patients",
    subtitle: "All active clients in your caseload",
    href: routes.therapistPatients,
  },
  {
    title: "Sessions",
    subtitle: "Session notes across your patient caseload",
    href: routes.therapistClinicalNotes,
  },
  {
    title: "Analysis",
    subtitle: "Therapeutic progress across your caseload",
    href: routes.therapistAnalytics,
  },
  {
    title: "Files",
    subtitle: "Documents and worksheets across your caseload",
    href: routes.therapistFiles,
  },
  {
    title: "Care Plan",
    subtitle: "Treatment goals across your caseload",
    href: routes.therapistCarePlan,
  },
  ...patientSlugs.flatMap((slug) => {
    const patient = patientsBySlug[slug];
    const paths = patientRoutes(slug);
    return [
      {
        title: `${patient.name} — Overview`,
        subtitle: "Patient clinical dashboard",
        href: paths.overview,
      },
      {
        title: `${patient.name} — Clinical Notes`,
        subtitle: "Session notes editor",
        href: paths.clinicalNotes,
      },
      {
        title: `${patient.name} — New Session Note`,
        subtitle: "Create a new clinical session note",
        href: paths.newSessionNote,
      },
      {
        title: `${patient.name} — Progress`,
        subtitle: "Therapeutic progress tracking",
        href: paths.progress,
      },
      {
        title: `${patient.name} — Files`,
        subtitle: "Patient documents and worksheets",
        href: paths.files,
      },
      {
        title: `${patient.name} — Care Plan`,
        subtitle: "Treatment goals and review schedule",
        href: paths.carePlan,
      },
    ];
  }),
];

export default function DevIndexPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <main className="min-h-screen bg-munity-bg">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <Link href={routes.home} className="text-sm font-semibold text-munity-green hover:underline">
          ← Back to landing
        </Link>
        <h1 className="mt-6 text-4xl font-bold text-munity-green">Munity Dev Index</h1>
        <p className="mt-2 text-lg text-munity-muted">
          All app screens — development preview only
        </p>

        <ul className="mt-12 space-y-4">
          {screens.map((screen) => (
            <li key={screen.href}>
              <Link
                href={screen.href}
                className="group flex items-center justify-between rounded-2xl border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)] transition hover:border-munity-green/30"
              >
                <div>
                  <h2 className="text-lg font-semibold text-munity-text">{screen.title}</h2>
                  <p className="mt-1 text-sm text-munity-muted">{screen.subtitle}</p>
                </div>
                <ArrowRight className="size-5 text-munity-green transition group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
