"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import {
  Bookmark,
  BookOpen,
  CalendarDays,
  Home,
  LayoutGrid,
  LifeBuoy,
  MessageCircle,
  PanelLeft,
  PanelLeftClose,
  Search,
  Settings,
  Stethoscope,
  Users,
} from "lucide-react";
import { MemberAvatarMenu } from "@/components/memberlayout/MemberAvatarMenu";
import { NotificationsMenu } from "@/components/live/NotificationsMenu";
import { LiveToastProvider } from "@/components/live/LiveFeedback";
import { SidebarProvider, useSidebar } from "@/components/therapistlayout/SidebarContext";
import { routes } from "@/lib/routes";

export type MemberNavItem =
  | "Home"
  | "Dashboard"
  | "Communities"
  | "Saved Posts"
  | "Therapy"
  | "Sessions"
  | "Resources"
  | "Messages"
  | "Settings";

const memberNavItems: {
  label: MemberNavItem;
  href: string;
  icon: React.ElementType;
}[] = [
  { label: "Home", href: routes.memberHome, icon: Home },
  { label: "Dashboard", href: routes.memberDashboard, icon: LayoutGrid },
  { label: "Communities", href: routes.communities, icon: Users },
  { label: "Saved Posts", href: routes.saved, icon: Bookmark },
  { label: "Therapy", href: routes.therapy, icon: Stethoscope },
  { label: "Sessions", href: routes.sessions, icon: CalendarDays },
  { label: "Resources", href: routes.resources, icon: BookOpen },
  { label: "Messages", href: routes.messages, icon: MessageCircle },
  { label: "Settings", href: routes.settings, icon: Settings },
];

function isNavActive(pathname: string, href: string) {
  if (href === routes.memberHome) return pathname === "/home";
  if (href === routes.memberDashboard) return pathname === "/dashboard";
  return pathname.toLowerCase().startsWith(href.toLowerCase());
}

interface MemberAppShellProps {
  children: ReactNode;
  /** When false, show a guest header without the member sidebar. */
  isLoggedIn?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  /** Full-bleed content (e.g. messages) without default page padding. */
  flush?: boolean;
}

export function MemberAppShell({ isLoggedIn = true, ...rest }: MemberAppShellProps) {
  if (!isLoggedIn) {
    return <GuestShell>{rest.children}</GuestShell>;
  }

  return (
    <SidebarProvider storageKey="munity-member-sidebar-open">
      <LoggedInShell {...rest} />
    </SidebarProvider>
  );
}

function GuestShell({ children }: { children: ReactNode }) {
  return (
    <LiveToastProvider>
      <div className="min-h-screen bg-munity-bg">
        <header className="fixed inset-x-0 top-0 z-50 border-b border-munity-border/60 bg-munity-bg/90 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 lg:px-10">
            <Link href={routes.home} className="text-2xl font-bold text-munity-green">
              Munity
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href={routes.login}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-munity-green transition hover:bg-white"
              >
                Log in
              </Link>
              <Link
                href={routes.signup}
                className="rounded-xl bg-munity-green px-4 py-2 text-sm font-semibold text-white transition hover:bg-munity-green-dark"
              >
                Sign up
              </Link>
            </div>
          </div>
        </header>
        <div className="pt-16">{children}</div>
      </div>
    </LiveToastProvider>
  );
}

function LoggedInShell({
  children,
  showSearch = false,
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  flush = false,
}: Omit<MemberAppShellProps, "isLoggedIn">) {
  const pathname = usePathname();
  const sidebar = useSidebar();
  if (!sidebar) {
    throw new Error("LoggedInShell must be used within SidebarProvider");
  }
  const { open, toggle } = sidebar;

  return (
    <LiveToastProvider>
    <div className="min-h-screen bg-munity-bg">
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-munity-border/30 bg-munity-sidebar px-4 py-4 transition-transform duration-300 ease-in-out lg:flex ${
          open ? "lg:translate-x-0" : "lg:-translate-x-full"
        }`}
      >
        <Link href={routes.memberHome} className="mb-8 block px-4 pt-2">
          <p className="text-2xl font-bold leading-tight text-munity-green">Munity</p>
          <p className="text-xs font-medium text-munity-muted">Nurtured Stability</p>
        </Link>

        <nav className="flex flex-1 flex-col gap-1">
          {memberNavItems.map(({ label, href, icon: Icon }) => {
            const active = isNavActive(pathname, href);
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
                <Icon className="size-[18px]" />
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

      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-munity-border/20 bg-munity-bg/80 shadow-sm backdrop-blur-md transition-[left] duration-300 ease-in-out ${
          open ? "lg:left-64" : "lg:left-0"
        }`}
      >
        <div className="flex h-16 items-center gap-4 px-6 lg:px-10">
          <button
            type="button"
            onClick={toggle}
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={open}
            className="hidden rounded-full p-2 text-munity-muted transition hover:bg-munity-sidebar hover:text-munity-green lg:inline-flex"
          >
            {open ? (
              <PanelLeftClose className="size-5" />
            ) : (
              <PanelLeft className="size-5" />
            )}
          </button>
          {showSearch ? (
            <div className="relative mr-auto hidden sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-munity-gray" />
              <input
                type="search"
                value={searchValue}
                onChange={(event) => onSearchChange?.(event.target.value)}
                placeholder={searchPlaceholder}
                className="h-9 w-64 rounded-full bg-munity-sidebar py-2 pl-10 pr-4 text-xs font-medium text-munity-text outline-none placeholder:text-munity-gray"
              />
            </div>
          ) : null}
          <div className="ml-auto flex items-center gap-4">
            <NotificationsMenu role="member" />
            <MemberAvatarMenu />
          </div>
        </div>
      </header>

      <div
        className={`pt-16 transition-[padding-left] duration-300 ease-in-out ${
          open ? "lg:pl-64" : "lg:pl-0"
        }`}
      >
        {flush ? children : <div className="px-6 py-8 lg:px-10">{children}</div>}
      </div>
    </div>
    </LiveToastProvider>
  );
}
