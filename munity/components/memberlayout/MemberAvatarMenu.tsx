"use client";

import { useRouter } from "next/navigation";
import { LogOut, Settings, User } from "lucide-react";
import { signOut } from "@/lib/auth/actions";
import { ProfileAvatar } from "@/components/live/NotificationsMenu";
import { useMockStore } from "@/lib/mock-store";
import { routes } from "@/lib/routes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentProfile } from "@/hooks/use-current-profile";

const menuItems = [
  { label: "My Profile", href: routes.profile, icon: User },
  { label: "Settings", href: routes.settings, icon: Settings },
] as const;

export function MemberAvatarMenu() {
  const router = useRouter();
  const { profile: mockProfile } = useMockStore(); // only avatar
  const { profile, loading } = useCurrentProfile();

  const fullName = profile?.fullName ?? mockProfile.fullName;
  const username = profile?.username ?? mockProfile.username;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="rounded-full border-2 border-munity-lime outline-none transition hover:ring-2 hover:ring-munity-green/20 focus-visible:ring-2 focus-visible:ring-munity-green/30"
        aria-label="Open profile menu"
      >
        <ProfileAvatar src={mockProfile.avatar} alt={fullName} size={36} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="min-w-52 border border-munity-border bg-white p-1.5 text-munity-text shadow-[0_16px_40px_rgba(62,82,25,0.12)]"
      >
        <div className="flex items-center gap-3 px-3 py-2">
          <ProfileAvatar src={mockProfile.avatar} alt={fullName} size={40} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-munity-text">
              {loading ? "..." : fullName}
            </p>
            <p className="truncate text-xs text-munity-muted">@{username}</p>
          </div>
        </div>
        <DropdownMenuSeparator className="my-1 bg-munity-divider" />
        {menuItems.map(({ label, href, icon: Icon }) => (
          <DropdownMenuItem
            key={label}
            className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium text-munity-text focus:bg-munity-lime/50 focus:text-munity-olive-text"
            onClick={() => router.push(href)}
          >
            <Icon className="size-4 text-munity-green" />
            {label}
          </DropdownMenuItem>
        ))}
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
  );
}
