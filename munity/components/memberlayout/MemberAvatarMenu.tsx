"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, Settings, User } from "lucide-react";
import { signOut } from "@/app/(auth)/actions";
import { routes } from "@/lib/routes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const menuItems = [
  { label: "My Profile", href: routes.profile, icon: User },
  { label: "Settings", href: routes.settings, icon: Settings },
] as const;

export function MemberAvatarMenu() {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="relative size-9 overflow-hidden rounded-full border-2 border-munity-lime outline-none transition hover:ring-2 hover:ring-munity-green/20 focus-visible:ring-2 focus-visible:ring-munity-green/30"
        aria-label="Open profile menu"
      >
        <Image
          src="/images/home-feed/alex.jpg"
          alt="Your profile"
          fill
          className="object-cover"
          sizes="36px"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="min-w-52 border border-munity-border bg-white p-1.5 text-munity-text shadow-[0_16px_40px_rgba(62,82,25,0.12)]"
      >
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
