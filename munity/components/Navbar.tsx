"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import profile from "@/public/images/profile.jpg";
import React from "react";

const Navbar = () => {
  const pageLink = [
    { pageName: "Home", pageLink: "/home" },
    { pageName: "Communities", pageLink: "/communities" },
    { pageName: "Resources", pageLink: "/resources" },
    { pageName: "Therapy", pageLink: "/therapy" },
  ];

  const pathname = usePathname();

  return (
    <div className="flex justify-between shadow-sm p-4">
      <div className="space-x-10 flex">
        <div className="font-bold text-[#3E5219] text-[24px] font">Munity</div>
        <div className="flex">
          <ul className="text-[14px] space-x-6 flex items-center text-[#3E5219] ">
            {pageLink.map((item) => (
              <Link className="" key={item.pageName} href={`${item.pageLink}`}>
                <li
                  className={`pb-1 ${pathname === item.pageLink ? "border-b-2 border-[#3E5219]" : ""}`}
                >
                  {item.pageName}
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex space-x-5 px-3">
        <div>not</div>
        <div className="h-7.5 w-7.5">
          <Image src={profile} alt="Profile" className="rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
