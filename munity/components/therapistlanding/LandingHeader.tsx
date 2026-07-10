import Link from "next/link";
import { routes } from "@/lib/routes";

export function LandingHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-munity-input-border/20 bg-munity-bg/80 shadow-[0_1px_2px_rgba(0,0,0,0.05)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-10">
        <Link href={routes.home} className="text-2xl font-bold text-munity-green">
          Munity
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={routes.therapistSignup}
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
      </div>
    </header>
  );
}
