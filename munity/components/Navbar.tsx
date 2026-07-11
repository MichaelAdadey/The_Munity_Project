"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell } from "lucide-react";
import profile from "@/public/images/profile.jpg";

/** Lightweight top bar without page links — navigation lives in MemberAppShell sidebar. */
const Navbar = () => {
  return (
    <div className="flex justify-between p-4 shadow-sm">
      <Link href="/home" className="text-[24px] font-bold text-[#3E5219]">
        Munity
      </Link>
      <div className="flex items-center space-x-5 px-3">
        <button type="button" aria-label="Notifications">
          <Bell className="size-5 text-[#3E5219]" />
        </button>
        <Link href="/profile" className="relative size-7.5 overflow-hidden rounded-full">
          <Image src={profile} alt="Profile" fill className="object-cover" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
