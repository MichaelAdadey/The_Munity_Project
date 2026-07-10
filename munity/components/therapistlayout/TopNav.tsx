import Link from "next/link";
import Image from "next/image";
import { Bell, Settings } from "lucide-react";
import { assets } from "@/lib/assets";
import { defaultPatientSlug, patientRoutes, routes } from "@/lib/routes";

type NavItem = "Dashboard" | "Patients" | "Sessions" | "Analytics";

interface TopNavProps {
  active?: NavItem;
  showSearch?: boolean;
}

const navItems: { label: NavItem; href: string }[] = [
  { label: "Dashboard", href: routes.therapistDashboard },
  { label: "Patients", href: patientRoutes(defaultPatientSlug).overview },
  { label: "Sessions", href: patientRoutes(defaultPatientSlug).clinicalNotes },
  { label: "Analytics", href: patientRoutes(defaultPatientSlug).progress },
];

export function TopNav({ active = "Patients", showSearch = false }: TopNavProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-munity-input-border/30 bg-munity-bg/80 backdrop-blur-md shadow-sm">
      <div className="flex h-16 w-full items-center justify-between px-10">
        <div className="flex items-center gap-8">
          <Link href={routes.therapistDashboard} className="text-2xl font-bold text-munity-green">
            Munity
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map(({ label, href }) => {
              const isActive = label === active;
              return (
                <Link
                  key={label}
                  href={href}
                  className={`text-base ${
                    isActive
                      ? "border-b-2 border-munity-green pb-1.5 font-bold text-munity-green"
                      : "font-medium text-munity-muted hover:text-munity-green"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {showSearch && (
            <div className="relative hidden sm:block">
              <input
                type="search"
                placeholder="Search patients..."
                className="h-9 w-64 rounded-full bg-[#efeded] py-2 pl-10 pr-4 text-sm font-semibold text-gray-500 outline-none"
              />
              <svg
                className="absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-munity-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                />
              </svg>
            </div>
          )}
          <button type="button" className="rounded-full p-2 text-munity-muted hover:bg-munity-sidebar">
            <Bell className="size-5" />
          </button>
          <button type="button" className="rounded-full p-2 text-munity-muted hover:bg-munity-sidebar">
            <Settings className="size-5" />
          </button>
          <Link
            href={routes.therapistDashboard}
            className="relative size-9 overflow-hidden rounded-full border-2 border-[#eae8e7]"
          >
            <Image
              src={assets.avatars.clinician}
              alt="Clinician profile"
              fill
              className="object-cover"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
