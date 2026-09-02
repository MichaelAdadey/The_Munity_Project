"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Calendar, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import { BookSessionSheet } from "@/components/therapy/BookSessionSheet";
import { MemberAppShell } from "@/components/memberlayout/MemberAppShell";
import { liveFadeUp, useLiveToast } from "@/components/live/LiveFeedback";
import { messagesPath, routes } from "@/lib/routes";
import { TherapyListItem } from "@/lib/therapy/queries";
import {
  formatExistingBookingWhen,
  useMyBookings,
} from "@/lib/therapy/booking-status";
import { createBooking } from "@/lib/therapy/booking-actions";

export function TherapistDetailView({
  isLoggedIn = true,
  therapist,
}: {
  therapist: TherapyListItem | null;
  isLoggedIn?: boolean;
}) {
  const router = useRouter();
  const { flash } = useLiveToast();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [bookingInFlight, setBookingInFlight] = useState(false);
  const { bookings, refresh: refreshBookings } = useMyBookings(flash);

  if (!therapist) {
    return (
      <MemberAppShell isLoggedIn={isLoggedIn}>
        <div className="mx-auto max-w-3xl rounded-[20px] border border-munity-border bg-white p-8 text-center">
          <p className="text-munity-muted">
            This therapist could not be found.
          </p>
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

  const therapistBookings = bookings.filter(
    (b) => b.therapistId === therapist.id,
  );
  const latestBooking = therapistBookings[0] ?? 0;
  const booked = therapistBookings.length > 0;

  return (
    <MemberAppShell isLoggedIn={isLoggedIn}>
      <motion.div
        initial="hidden"
        animate="show"
        variants={liveFadeUp}
        className="mx-auto max-w-4xl"
      >
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
                src="/images/avatar-placeholder.png"
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
              {therapist.bio ? (
                <p className="mt-4 leading-relaxed text-munity-text">
                  {therapist.bio}
                </p>
              ) : null}
              {therapist.location ? (
                <p className="mt-4 inline-flex items-center gap-2 text-sm text-munity-muted">
                  <MapPin className="size-4" />
                  {therapist.location}
                </p>
              ) : null}
              <div className="mt-5 flex flex-wrap gap-2">
                {therapist.specialties.map((tag) => (
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
              <p className="text-sm text-munity-muted">
                {booked ? "Your booking" : "Next available"}
              </p>
              <p className="font-semibold text-munity-text">
                {booked && latestBooking
                  ? formatExistingBookingWhen(latestBooking.scheduledAt)
                  : therapist.rate != null
                    ? `₵${therapist.rate}/hr`
                    : "Rate not set"}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href={
                  isLoggedIn
                    ? messagesPath({ therapistId: therapist.id })
                    : routes.login
                }
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
                  setSheetOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-munity-green px-5 py-3 text-sm font-semibold text-white"
              >
                <Calendar className="size-4" />
                {booked ? "Book" : "Book Session"}
              </button>
            </div>
          </div>
        </section>
      </motion.div>

      <BookSessionSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        therapistId={therapist.id}
        therapistName={therapist.name}
        rate={therapist.rate ?? 0}
        alreadyBooked={booked}
        latestBookingWhen={
          latestBooking
            ? formatExistingBookingWhen(latestBooking.scheduledAt)
            : null
        }
        submitting={bookingInFlight}
        onConfirm={async ({ when, scheduledAt }) => {
          setBookingInFlight(true);
          try {
            await createBooking({ therapistId: therapist.id, scheduledAt });
            flash(`Session booked with ${therapist.name} · ${when}`);
            refreshBookings();
            setSheetOpen(false);
          } catch (err) {
            flash(
              err instanceof Error ? err.message : "Couldn't book that session",
            );
          } finally {
            setBookingInFlight(false);
          }
        }}
      />
    </MemberAppShell>
  );
}
