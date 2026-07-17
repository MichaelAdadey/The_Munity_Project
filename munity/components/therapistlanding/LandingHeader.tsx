"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LayoutGrid, LogOut, User } from "lucide-react";
import { signOut } from "@/app/(auth)/actions";
import type { MockAccount, MockRole } from "@/lib/mock-credentials";
import { routes } from "@/lib/routes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function avatarForRole(role: MockRole) {
  switch (role) {
    case "therapist":
      return "/images/home-feed/elena.jpg";
    case "admin":
      return "/images/admin/avatar.jpg";
    default:
      return "/images/profile/avatar.jpg";
  }
}

function roleLabel(role: MockRole) {
  switch (role) {
    case "therapist":
      return "Therapist";
    case "admin":
      return "Admin";
    default:
      return "Member";
  }
}

export function LandingHeader({
  session,
}: {
  session?: Pick<MockAccount, "name" | "role" | "redirectTo"> | null;
}) {
  const router = useRouter();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-munity-input-border/20 bg-munity-bg/80 shadow-[0_1px_2px_rgba(0,0,0,0.05)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href={routes.home} className="text-2xl font-bold text-munity-green">
          Munity
        </Link>

        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex h-[52px] items-center gap-3 rounded-full border border-munity-border bg-white py-1.5 pl-1.5 pr-4 outline-none transition hover:bg-munity-sidebar focus-visible:ring-2 focus-visible:ring-munity-green/30">
              <span className="relative size-10 overflow-hidden rounded-full border-2 border-munity-lime">
                <Image
                  src={avatarForRole(session.role)}
                  alt={session.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-semibold text-munity-text">
                  {session.name}
                </span>
                <span className="block text-xs font-medium text-munity-muted">
                  {roleLabel(session.role)}
                </span>
              </span>
              <ChevronDown className="size-4 text-munity-muted" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="min-w-56 border border-munity-border bg-white p-1.5 shadow-[0_16px_40px_rgba(62,82,25,0.12)]"
            >
              <DropdownMenuItem
                className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium focus:bg-munity-lime/50 focus:text-munity-olive-text"
                onClick={() => router.push(session.redirectTo)}
              >
                <LayoutGrid className="size-4 text-munity-green" />
                Go to dashboard
              </DropdownMenuItem>
              {session.role === "user" ? (
                <DropdownMenuItem
                  className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium focus:bg-munity-lime/50 focus:text-munity-olive-text"
                  onClick={() => router.push(routes.profile)}
                >
                  <User className="size-4 text-munity-green" />
                  My profile
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuSeparator className="my-1 bg-munity-divider" />
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium focus:bg-red-50"
                onClick={() => signOut()}
              >
                <LogOut className="size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href={routes.therapistOnboarding.basicInfo}
              className="flex h-[52px] items-center rounded-xl bg-munity-lime px-5 text-sm font-semibold tracking-wide text-munity-olive-text transition hover:bg-munity-lime-light"
            >
              Join as a therapist
            </Link>
            <Link
              href={routes.login}
              className="flex h-[52px] items-center rounded-xl bg-munity-green px-6 text-sm font-semibold tracking-wide text-white shadow-[0_1px_1px_rgba(0,0,0,0.05)] transition hover:bg-munity-green-dark"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
