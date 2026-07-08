import Link from "next/link";
import { Check, Plus } from "lucide-react";
import {
  LayoutGrid,
  FileText,
  TrendingUp,
  FolderOpen,
  Briefcase,
} from "lucide-react";
import type { OnboardingStepId, PatientNavSection, PatientSlug } from "@/lib/routes";
import { onboardingSteps, patientNavHref, patientRoutes, routes } from "@/lib/routes";

export type PatientNavItem =
  | "Overview"
  | "Clinical Notes"
  | "Progress"
  | "Files"
  | "Care Plan";

interface PatientSidebarProps {
  active: PatientNavItem;
  patientSlug: PatientSlug;
  showLogo?: boolean;
  patient?: {
    name: string;
    clientId: string;
    avatar: string;
  };
}

const navItems: { label: PatientNavItem; section?: PatientNavSection; icon: React.ElementType }[] = [
  { label: "Overview", section: "Overview", icon: LayoutGrid },
  { label: "Clinical Notes", section: "Clinical Notes", icon: FileText },
  { label: "Progress", section: "Progress", icon: TrendingUp },
  { label: "Files", icon: FolderOpen },
  { label: "Care Plan", icon: Briefcase },
];

export function PatientSidebar({
  active,
  patientSlug,
  showLogo = false,
  patient,
}: PatientSidebarProps) {
  return (
    <aside className="flex w-64 shrink-0 flex-col gap-2 border-r border-munity-input-border/30 bg-munity-sidebar px-4 py-6">
      {showLogo ? (
        <Link href={routes.dashboard} className="mb-6 block px-2">
          <h1 className="text-[32px] font-bold leading-tight text-munity-green">Munity</h1>
          <p className="text-sm font-semibold tracking-wide text-munity-muted opacity-70">
            Clinical Management
          </p>
        </Link>
      ) : patient ? (
        <div className="mb-8 flex items-center gap-3 px-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={patient.avatar}
            alt={patient.name}
            className="size-12 shrink-0 rounded-xl object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-munity-text">{patient.name}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-munity-muted">
              Client ID: {patient.clientId}
            </p>
          </div>
        </div>
      ) : (
        <Link href={routes.dashboard} className="mb-6 block px-2">
          <p className="text-base text-munity-green">Patient Record</p>
          <p className="text-base text-munity-muted">Clinical Management</p>
        </Link>
      )}

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ label, section, icon: Icon }) => {
          const isActive = label === active;
          const href = section ? patientNavHref(patientSlug, section) : "#";
          const className = `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
            isActive
              ? "bg-munity-lime text-munity-olive-text"
              : "text-munity-muted hover:bg-white/50"
          }`;

          if (href === "#") {
            return (
              <button key={label} type="button" className={className} disabled aria-disabled>
                <Icon className="size-[18px]" />
                {label}
              </button>
            );
          }

          return (
            <Link key={label} href={href} className={className}>
              <Icon className="size-[18px]" />
              {label}
            </Link>
          );
        })}
      </nav>

      <Link
        href={patientNavHref(patientSlug, "Clinical Notes")}
        className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-munity-green px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-munity-green-dark"
      >
        <Plus className="size-3.5" />
        New Session Note
      </Link>
    </aside>
  );
}

interface OnboardingSidebarProps {
  activeStep: OnboardingStepId;
}

export function OnboardingSidebar({ activeStep }: OnboardingSidebarProps) {
  const activeIndex = onboardingSteps.findIndex((step) => step.id === activeStep);

  return (
    <aside className="flex w-80 shrink-0 flex-col border-r border-munity-input-border/30 bg-munity-sidebar px-4 py-6">
      <Link href={routes.home} className="mb-10 block px-4">
        <h1 className="text-[32px] font-bold text-munity-green">Munity</h1>
        <p className="text-sm font-semibold tracking-wide text-munity-muted">
          Therapist Onboarding
        </p>
      </Link>

      <nav className="flex flex-col gap-4">
        {onboardingSteps.map((step, index) => {
          const isActive = step.id === activeStep;
          const isComplete = index < activeIndex;

          return (
            <div key={step.number} className="relative">
              {index < onboardingSteps.length - 1 && (
                <div className="absolute bottom-0 left-[27px] top-10 w-0.5 bg-munity-divider" />
              )}
              <Link
                href={step.href}
                className={`relative flex items-start gap-4 rounded-xl px-4 py-3 transition-colors ${
                  isActive ? "bg-munity-lime" : "hover:bg-white/50"
                }`}
              >
                <div
                  className={`relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                    isComplete || isActive
                      ? "bg-munity-green text-white"
                      : "bg-munity-divider text-munity-muted"
                  }`}
                >
                  {isComplete ? <Check className="size-3" strokeWidth={3} /> : step.number}
                </div>
                <div>
                  <p
                    className={`text-sm font-semibold tracking-wide ${
                      isActive ? "text-munity-olive-text" : "text-munity-muted"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p
                    className={`text-sm tracking-wide ${
                      isActive
                        ? "font-semibold text-munity-olive-text"
                        : isComplete
                          ? "font-bold text-munity-green"
                          : "font-semibold text-munity-muted"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl bg-munity-green/10 px-4 py-4">
        <p className="text-xs font-medium text-munity-green">Need help?</p>
        <p className="mt-1 text-[13px] leading-relaxed text-munity-muted">
          Our support team is available 24/7 to assist with your credentialing process.
        </p>
      </div>
    </aside>
  );
}
