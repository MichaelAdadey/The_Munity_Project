"use client";

import Link from "next/link";
import {
  ClipboardCheck,
  LayoutGrid,
  LogOut,
  Shield,
  Users,
} from "lucide-react";
import { signOut } from "@/app/(auth)/actions";
import { routes } from "@/lib/routes";

const overviewCards = [
  {
    label: "Pending Therapist Reviews",
    value: "7",
    detail: "Awaiting credential verification",
    icon: ClipboardCheck,
  },
  {
    label: "Active Members",
    value: "1,284",
    detail: "+46 this week",
    icon: Users,
  },
  {
    label: "Active Therapists",
    value: "86",
    detail: "12 onboarding in progress",
    icon: Shield,
  },
  {
    label: "Open Support Cases",
    value: "19",
    detail: "3 marked urgent",
    icon: LayoutGrid,
  },
] as const;

const pendingReviews = [
  { name: "Dr. Ama Mensah", submitted: "2 hours ago", status: "Credentials" },
  { name: "Kwame Boateng", submitted: "Yesterday", status: "Background check" },
  { name: "Dr. Nia Owusu", submitted: "2 days ago", status: "Interview" },
];

export function AdminDashboardView({ adminName }: { adminName: string }) {
  return (
    <div className="min-h-screen bg-munity-bg">
      <header className="border-b border-munity-border/60 bg-munity-bg/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div>
            <Link href={routes.admin} className="text-2xl font-bold text-munity-green">
              Munity
            </Link>
            <p className="text-xs font-medium text-munity-muted">Admin Console</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm font-semibold text-munity-text">{adminName}</p>
            <form action={signOut}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl border border-munity-input-border bg-white px-4 py-2 text-sm font-semibold text-munity-green transition hover:bg-munity-lime/40"
              >
                <LogOut className="size-4" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <div>
          <h1 className="text-3xl font-bold text-munity-text">Platform overview</h1>
          <p className="mt-1 text-base text-munity-muted">
            Review therapist applications, members, and support activity.
          </p>
        </div>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map(({ label, value, detail, icon: Icon }) => (
            <article
              key={label}
              className="rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-munity-muted">{label}</p>
                  <p className="mt-2 text-3xl font-bold text-munity-text">{value}</p>
                  <p className="mt-1 text-sm text-munity-green">{detail}</p>
                </div>
                <div className="flex size-10 items-center justify-center rounded-xl bg-munity-lime/50 text-munity-green">
                  <Icon className="size-5" />
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-[20px] border border-munity-border bg-white p-8 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-munity-text">
                Therapist applications in review
              </h2>
              <p className="text-sm text-munity-muted">
                Mock queue for credential and clinical review
              </p>
            </div>
            <Link
              href={routes.therapistCredentialAuth}
              className="text-sm font-semibold text-munity-green hover:underline"
            >
              Open review screen
            </Link>
          </div>

          <div className="divide-y divide-munity-border overflow-hidden rounded-2xl border border-munity-border">
            {pendingReviews.map((item) => (
              <div
                key={item.name}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
              >
                <div>
                  <p className="font-semibold text-munity-text">{item.name}</p>
                  <p className="text-sm text-munity-muted">Submitted {item.submitted}</p>
                </div>
                <span className="rounded-full bg-munity-lime/50 px-3 py-1 text-xs font-semibold text-munity-olive-text">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link
            href="/home"
            className="rounded-2xl border border-munity-border bg-white p-5 transition hover:border-munity-green/40"
          >
            <p className="font-semibold text-munity-text">Member experience</p>
            <p className="mt-1 text-sm text-munity-muted">Open the member home feed</p>
          </Link>
          <Link
            href={routes.therapistDashboard}
            className="rounded-2xl border border-munity-border bg-white p-5 transition hover:border-munity-green/40"
          >
            <p className="font-semibold text-munity-text">Therapist experience</p>
            <p className="mt-1 text-sm text-munity-muted">Open the therapist dashboard</p>
          </Link>
          <Link
            href={routes.resources}
            className="rounded-2xl border border-munity-border bg-white p-5 transition hover:border-munity-green/40"
          >
            <p className="font-semibold text-munity-text">Public resources</p>
            <p className="mt-1 text-sm text-munity-muted">Browse the resource hub</p>
          </Link>
        </section>
      </main>
    </div>
  );
}
