"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";
import {
  BookOpen,
  LayoutGrid,
  LifeBuoy,
  LogOut,
  Search,
  Settings,
  ShieldAlert,
  Stethoscope,
  TrendingUp,
  Users,
} from "lucide-react";
import { signOut } from "@/lib/auth/actions";
import { LiveToastProvider } from "@/components/live/LiveFeedback";
import { NotificationsMenu, ProfileAvatar } from "@/components/live/NotificationsMenu";
import { routes } from "@/lib/routes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const adminNav = [
  { label: "Dashboard", href: routes.admin, icon: LayoutGrid },
  { label: "Communities", href: routes.adminCommunities, icon: Users },
  { label: "Platform Growth", href: routes.adminGrowth, icon: TrendingUp },
  { label: "Therapy", href: routes.adminTherapy, icon: Stethoscope },
  { label: "Resources", href: routes.adminResources, icon: BookOpen },
  { label: "Moderation", href: routes.adminModeration, icon: ShieldAlert },
  { label: "Settings", href: routes.adminSettings, icon: Settings },
] as const;

function isActive(pathname: string, href: string) {
  if (href === routes.admin) return pathname === routes.admin;
  return pathname.startsWith(href);
}

export function AdminAppShell({
  children,
  adminName,
  title = "Admin Dashboard",
  searchPlaceholder = "Search analytics...",
  actions,
  searchValue,
  onSearchChange,
}: {
  children: ReactNode;
  adminName: string;
  title?: string;
  searchPlaceholder?: string;
  actions?: ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}) {
  const pathname = usePathname();
  const [internalSearch, setInternalSearch] = useState("");
  const search = searchValue ?? internalSearch;

  return (
    <LiveToastProvider>
    <div className="min-h-screen bg-munity-bg">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-[rgba(197,200,184,0.3)] bg-munity-sidebar px-4 py-4 lg:flex">
        <Link href={routes.admin} className="mb-8 block px-4 pt-2">
          <p className="text-2xl font-bold leading-tight text-munity-green">Munity</p>
          <p className="text-xs font-medium text-munity-muted">Nurtured Stability</p>
        </Link>

        <nav className="flex flex-1 flex-col gap-1">
          {adminNav.map(({ label, href, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold tracking-wide transition ${
                  active
                    ? "bg-munity-lime text-munity-olive-text"
                    : "text-munity-muted hover:bg-white/70"
                }`}
              >
                <Icon className="size-4.5" />
                {label}
              </Link>
            );
          })}
        </nav>

        <Link
          href={routes.emergency}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#ffdad6] py-3 text-sm font-semibold text-[#93000a] transition hover:brightness-95"
        >
          <LifeBuoy className="size-3.5" />
          Emergency Support
        </Link>
      </aside>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-[rgba(197,200,184,0.2)] bg-[rgba(251,249,248,0.8)] shadow-sm backdrop-blur-md lg:left-64">
        <div className="flex h-16 items-center gap-4 px-6 lg:px-10">
          <h1 className="shrink-0 text-xl font-bold text-munity-green md:text-2xl">{title}</h1>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
          <div className="relative ml-auto hidden sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4.5 -translate-y-1/2 text-gray-500" />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                const next = e.target.value;
                if (onSearchChange) onSearchChange(next);
                else setInternalSearch(next);
              }}
              placeholder={searchPlaceholder}
              className="h-9 w-56 rounded-full bg-munity-sidebar py-2 pl-10 pr-4 text-xs font-medium text-munity-text outline-none placeholder:text-gray-500 md:w-72"
            />
          </div>
          <NotificationsMenu role="admin" />
          <DropdownMenu>
            <DropdownMenuTrigger
              className="rounded-full border-2 border-munity-lime outline-none transition hover:ring-2 hover:ring-munity-green/20"
              aria-label="Open admin menu"
            >
              <ProfileAvatar src="/images/admin/avatar.jpg" alt={adminName} size={36} />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="min-w-52 border border-munity-border bg-white p-1.5 shadow-[0_16px_40px_rgba(62,82,25,0.12)]"
            >
              <div className="px-3 py-2">
                <p className="text-sm font-semibold text-munity-text">{adminName}</p>
                <p className="text-xs text-munity-muted">Platform admin</p>
              </div>
              <DropdownMenuSeparator className="my-1 bg-munity-divider" />
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium focus:bg-red-50 dark:focus:bg-red-950/40"
                onClick={() => signOut()}
              >
                <LogOut className="size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="pt-16 lg:pl-64">
        <div className="px-6 py-8 lg:px-10">{children}</div>
      </div>
    </div>
    </LiveToastProvider>
  );
}
