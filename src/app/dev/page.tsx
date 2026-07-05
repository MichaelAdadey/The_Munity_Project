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
  { title: "Login", subtitle: "Sign in to your Munity account", href: routes.login },
  { title: "Sign Up", subtitle: "Create account → therapist onboarding", href: routes.signup },
  {
    title: "Onboarding — Basic Info",
    subtitle: "Step 1 of 4",
    href: routes.onboarding.basicInfo,
  },
  {
    title: "Onboarding — Credentials",
    subtitle: "Step 2 of 4",
    href: routes.onboarding.credentials,
  },
  {
    title: "Onboarding — Specialties",
    subtitle: "Step 3 of 4",
    href: routes.onboarding.specialties,
  },
  {
    title: "Onboarding — Payout",
    subtitle: "Step 4 of 4 → dashboard",
    href: routes.onboarding.payout,
  },
  {
    title: "Dashboard",
    subtitle: "Clinical home — redirects to default patient",
    href: routes.dashboard,
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
        title: `${patient.name} — Progress`,
        subtitle: "Therapeutic progress tracking",
        href: paths.progress,
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
