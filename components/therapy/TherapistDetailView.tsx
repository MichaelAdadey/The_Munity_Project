"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, Star } from "lucide-react";
import { MemberAppShell } from "@/components/memberlayout/MemberAppShell";
import { mockStore, useMockStore } from "@/lib/mock-store";
import { routes } from "@/lib/routes";

export function TherapistDetailView({
  id,
  isLoggedIn = true,
}: {
  id: string;
  isLoggedIn?: boolean;
}) {
  const router = useRouter();
  const store = useMockStore();
  const therapist = store.therapists.find((item) => item.id === id);
  const booked = store.bookings.some((booking) => booking.therapistId === id);

  if (!therapist) {
    return (
      <MemberAppShell isLoggedIn={isLoggedIn}>
        <div className="mx-auto max-w-3xl rounded-[20px] border border-munity-border bg-white p-8 text-center">
          <p className="text-munity-muted">This therapist could not be found.</p>
          <Link
            href={routes.therapy}
            className="mt-4 inline-block font-semibold text-munity-green"
          >
            Back to therapy
          </Link>
        </div>
      </MemberAppShell>
    );
  }

  return (
    <MemberAppShell isLoggedIn={isLoggedIn}>
      <div className="mx-auto max-w-4xl">
        <Link
          href={routes.therapy}
          className="inline-flex items-center gap-2 text-sm font-semibold text-munity-green hover:underline"
        >
          <ArrowLeft className="size-4" /> Back to therapy
        </Link>
        <section className="mt-6 rounded-[20px] border border-munity-border bg-white p-6 md:p-8">
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="relative size-32 shrink-0 overflow-hidden rounded-2xl bg-munity-sidebar">
              <Image
                src={therapist.image}
                alt={therapist.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-3xl font-bold text-munity-green">
                    {therapist.name}
                  </h1>
                  <p className="mt-1 text-sm font-semibold text-munity-muted">
                    {therapist.credentials}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-munity-lime/50 px-3 py-1 text-sm font-semibold text-munity-olive-text">
                  <Star className="size-4 fill-current" />
                  {therapist.rating.toFixed(1)} ({therapist.reviewCount})
                </span>
              </div>
              <p className="mt-4 leading-relaxed text-munity-text">{therapist.bio}</p>
              <p className="mt-4 inline-flex items-center gap-2 text-sm text-munity-muted">
                <MapPin className="size-4" />
                {therapist.location} · {therapist.languages.join(", ")}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {therapist.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#efeded] px-3 py-1 text-xs text-munity-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-munity-border pt-6">
            <div>
              <p className="text-sm text-munity-muted">Next available</p>
              <p className="font-semibold text-munity-text">
                {therapist.nextAvailable} · ${therapist.rate}/hr
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href={isLoggedIn ? routes.messages : routes.login}
                className="rounded-xl border border-munity-green px-5 py-3 text-sm font-semibold text-munity-green"
              >
                Message
              </Link>
              <button
                type="button"
                onClick={() => {
                  if (!isLoggedIn) {
                    router.push(routes.login);
                    return;
                  }
                  mockStore.bookSession(therapist.id);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-munity-green px-5 py-3 text-sm font-semibold text-white"
              >
                <Calendar className="size-4" />
                {booked ? "Booked ✓" : "Book Session"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </MemberAppShell>
  );
}
