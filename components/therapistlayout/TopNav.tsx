"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { ProfileAvatarMenu } from "@/components/therapistlayout/ProfileAvatarMenu";
import { LiveToastProvider } from "@/components/live/LiveFeedback";
import { NotificationsMenu } from "@/components/live/NotificationsMenu";
import { routes } from "@/lib/routes";

type NavItem = "Dashboard" | "Patients";

interface TopNavProps {
  active?: NavItem;
  showSearch?: boolean;
}

const navItems: { label: NavItem; href: string }[] = [
  { label: "Dashboard", href: routes.therapistDashboard },
  { label: "Patients", href: routes.therapistPatients },
];

export function TopNav({ active = "Patients", showSearch = false }: TopNavProps) {
  return (
    <LiveToastProvider>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-munity-input-border/30 bg-munity-bg/80 shadow-sm backdrop-blur-md">
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
            {showSearch ? (
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
            ) : null}
            <NotificationsMenu role="therapist" />
            <Link
              href={routes.therapistSettings}
              className="rounded-full p-2 text-munity-muted hover:bg-munity-sidebar"
              aria-label="Settings"
            >
              <Settings className="size-5" />
            </Link>
            <ProfileAvatarMenu />
          </div>
        </div>
      </header>
    </LiveToastProvider>
  );
}
