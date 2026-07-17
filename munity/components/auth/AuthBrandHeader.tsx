import Link from "next/link";
import { assets } from "@/lib/assets";
import { routes } from "@/lib/routes";

interface AuthBrandHeaderProps {
  title?: string;
  subtitle?: string;
}

export function AuthBrandHeader({
  title = "Welcome",
  subtitle = "Start your journey with Munity",
}: AuthBrandHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <Link
        href={routes.home}
        className="flex size-16 items-center justify-center rounded-2xl bg-munity-olive shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={assets.auth.logoIcon} alt="Munity" className="h-[27px] w-[25px]" />
      </Link>
      <h1 className="pt-2 text-[32px] font-bold tracking-[-0.8px] text-munity-green">{title}</h1>
      <p className="text-base text-munity-muted">{subtitle}</p>
    </div>
  );
}
