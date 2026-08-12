"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Star,
} from "lucide-react";
import { MemberAppShell } from "@/components/memberlayout/MemberAppShell";
import { BookSessionSheet } from "@/components/therapy/BookSessionSheet";
import { LivePulse, liveFadeUp, liveStagger, useLiveToast } from "@/components/live/LiveFeedback";
import { mockStore, useMockStore } from "@/lib/mock-store";
import { routes, therapyPath } from "@/lib/routes";
import type { TherapistRecord } from "@/lib/mock-db";

type Specialization =
  | "Anxiety & Stress"
  | "Depression"
  | "CBT Therapy"
  | "Family Issues";

type AvailabilityFilter = "Today" | "This Week" | "Weekend";

type SortOption = "Recommended" | "Highest rated" | "Price: low to high" | "Price: high to low";

const SPECIALIZATIONS: Specialization[] = [
  "Anxiety & Stress",
  "Depression",
  "CBT Therapy",
  "Family Issues",
                    {
                      bookedTherapistId === therapist.id ||
                      store.bookings.some((b) => b.therapistId === therapist.id)
                        ? "Book"
                        : "Book Session"}

const SORT_OPTIONS: SortOption[] = [
  "Recommended",
  "Highest rated",
  "Price: low to high",
  "Price: high to low",
];

const PRICE_MIN = 80;
const PRICE_MAX = 250;
const PAGE_SIZE = 4;

function matchesName(therapist: { name: string; credentials: string; tags: string[] }, query: string) {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    therapist.name.toLowerCase().includes(q) ||
    therapist.credentials.toLowerCase().includes(q) ||
    therapist.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}

export function TherapyView({ isLoggedIn = true }: { isLoggedIn?: boolean }) {
  const router = useRouter();
  const store = useMockStore();
  const { flash } = useLiveToast();
  const [nameQuery, setNameQuery] = useState("");
  const [selectedSpecs, setSelectedSpecs] = useState<Specialization[]>([]);
  const [language, setLanguage] = useState("English");
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [availability, setAvailability] = useState<AvailabilityFilter>("Today");
  const [sortBy, setSortBy] = useState<SortOption>("Recommended");
  const [page, setPage] = useState(1);
  const [bookedTherapistId, setBookedTherapistId] = useState<string | null>(null);
  const [bookingTherapist, setBookingTherapist] = useState<TherapistRecord | null>(null);

  const filtered = useMemo(() => {
    let list = store.therapists.filter((therapist) => {
      if (!matchesName(therapist, nameQuery.trim())) return false;
      if (therapist.language !== language) return false;
      if (therapist.rate > maxPrice) return false;
      if (!therapist.availability.includes(availability)) return false;
      if (
        selectedSpecs.length > 0 &&
        !selectedSpecs.some((spec) => therapist.specializations.includes(spec))
      ) {
        return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case "Highest rated":
          return b.rating - a.rating;
        case "Price: low to high":
          return a.rate - b.rate;
        case "Price: high to low":
          return b.rate - a.rate;
        default:
          return b.rating - a.rating;
      }
    });

    return list;
  }, [availability, language, maxPrice, nameQuery, selectedSpecs, sortBy, store.therapists]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const resultCount = filtered.length;

  function resetFilters() {
    setNameQuery("");
    setSelectedSpecs([]);
    setLanguage("English");
    setMaxPrice(PRICE_MAX);
    setAvailability("Today");
    setSortBy("Recommended");
    setPage(1);
  }

  function toggleSpec(spec: Specialization) {
    setSelectedSpecs((prev) =>
      prev.includes(spec) ? prev.filter((item) => item !== spec) : [...prev, spec],
    );
    setPage(1);
  }

  return (
    <MemberAppShell isLoggedIn={isLoggedIn}>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10">
        <header>
          <h1 className="text-4xl font-bold tracking-[-0.96px] text-munity-green md:text-5xl md:leading-[1.2]">
            Find Your Specialist
          </h1>
          <p className="mt-2 max-w-2xl text-lg leading-relaxed text-munity-muted">
            Connect with licensed therapists dedicated to your mental well-being and
            personal growth. Your journey to stability starts here.
          </p>
        </header>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Filters */}
          <aside className="w-full shrink-0 lg:w-72">
            <div className="flex flex-col gap-6 rounded-[20px] border border-[#e5e5e1] bg-white p-6 shadow-[0px_4px_10px_rgba(85,107,47,0.05)]">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-munity-green">Filters</h2>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs font-medium text-munity-green transition hover:underline"
                >
                  Reset
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="therapy-search"
                  className="text-sm font-semibold tracking-wide text-munity-text"
                >
                  Search Name
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-munity-muted" />
                  <input
                    id="therapy-search"
                    type="search"
                    value={nameQuery}
                    onChange={(e) => {
                      setNameQuery(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Dr. Smith..."
                    className="w-full rounded-xl border border-[#c5c8b8] bg-[#f5f3f3] py-2.5 pl-10 pr-4 text-base text-munity-text outline-none transition placeholder:text-[#6b7280] focus:border-munity-green/40 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold tracking-wide text-munity-text">
                  Specialization
                </p>
                <div className="flex flex-col gap-2">
                  {SPECIALIZATIONS.map((spec) => {
                    const checked = selectedSpecs.includes(spec);
                    return (
                      <label
                        key={spec}
                        className="flex cursor-pointer items-center gap-3 text-base text-munity-muted"
                      >
                        <span
                          className={`flex size-5 items-center justify-center rounded border transition ${
                            checked
                              ? "border-munity-green bg-munity-green text-white"
                              : "border-[#c5c8b8] bg-white"
                          }`}
                        >
                          {checked ? <Check className="size-3.5 stroke-[3]" /> : null}
                        </span>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={checked}
                          onChange={() => toggleSpec(spec)}
                        />
                        {spec}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="therapy-language"
                  className="text-sm font-semibold tracking-wide text-munity-text"
                >
                  Language
                </label>
                <div className="relative">
                  <select
                    id="therapy-language"
                    value={language}
                    onChange={(e) => {
                      setLanguage(e.target.value);
                      setPage(1);
                    }}
                    className="w-full appearance-none rounded-xl border border-[#c5c8b8] bg-[#f5f3f3] px-4 py-2.5 text-base text-munity-text outline-none transition focus:border-munity-green/40 focus:bg-white"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-munity-muted" />
                </div>
              </div>

              <div className="flex flex-col gap-4 pb-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold tracking-wide text-munity-text">
                    Session Price
                  </p>
                  <p className="text-xs font-medium text-munity-green">
                    ${PRICE_MIN} - ${maxPrice}
                  </p>
                </div>
                <input
                  type="range"
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step={10}
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value));
                    setPage(1);
                  }}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#eae8e7] accent-munity-green [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-munity-green"
                  aria-label="Maximum session price"
                />
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold tracking-wide text-munity-text">
                  Availability
                </p>
                <div className="flex flex-wrap gap-2">
                  {AVAILABILITY_OPTIONS.map((option) => {
                    const active = availability === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setAvailability(option);
                          setPage(1);
                        }}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                          active
                            ? "border border-munity-green bg-munity-green text-white"
                            : "border border-[#c5c8b8] text-munity-text hover:border-munity-green/40"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <section className="flex min-w-0 flex-1 flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold tracking-wide text-munity-muted">
                Showing {resultCount} results
              </p>
              <LivePulse label="Available now" count={resultCount} />
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-munity-text">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="appearance-none bg-transparent pr-7 text-sm font-semibold tracking-wide text-munity-green outline-none"
                    aria-label="Sort therapists"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 text-munity-green" />
                </div>
              </div>
            </div>

            <motion.div variants={liveStagger} initial="hidden" animate="show" className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((therapist) => (
                <motion.article
                  key={therapist.id}
                  variants={liveFadeUp}
                  className="flex flex-col gap-4 rounded-[20px] border border-[#e5e5e1] bg-white p-6 shadow-[0px_4px_10px_rgba(85,107,47,0.05)]"
                >
                  <div className="flex gap-4">
                    <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-[#efeded]">
                      <Image
                        src={therapist.image}
                        alt={therapist.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-2xl font-semibold leading-tight text-munity-text">
                            {therapist.name}
                          </h3>
                          <p className="mt-1 text-xs font-medium uppercase tracking-[0.6px] text-munity-green">
                            {therapist.credentials}
                          </p>
                        </div>
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[rgba(214,231,161,0.5)] px-2 py-0.5 text-xs font-medium text-[#5a682f]">
                          <Star className="size-3 fill-current" />
                          {therapist.rating.toFixed(1)}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {therapist.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-[#eae8e7] px-2 py-0.5 text-[11px] text-munity-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="line-clamp-2 text-base italic leading-relaxed text-munity-muted">
                    &ldquo;{therapist.quote}&rdquo;
                  </p>

                  <div className="flex items-center justify-between border-t border-[#e5e5e1] pt-4">
                    <div>
                      <p className="text-xs font-medium text-munity-muted">Next Available</p>
                      <p className="mt-0.5 text-sm font-semibold tracking-wide text-munity-text">
                        {therapist.nextAvailable}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-munity-muted">Session</p>
                      <p className="mt-0.5 text-sm font-semibold tracking-wide text-munity-green">
                        ${therapist.rate}/hr
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-1">
                    <Link
                      href={therapyPath(therapist.id)}
                      className="rounded-xl border border-munity-green px-5 py-2.5 text-sm font-semibold tracking-wide text-munity-green transition hover:bg-munity-lime/30"
                    >
                      View Profile
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        if (!isLoggedIn) {
                          router.push(routes.login);
                          return;
                        }
                        setBookingTherapist(therapist);
                      }}
                      className="rounded-xl bg-munity-green px-6 py-2.5 text-sm font-semibold tracking-wide text-white transition hover:bg-munity-green-dark"
                    >
                      {bookedTherapistId === therapist.id ||
                      store.bookings.some((b) => b.therapistId === therapist.id)
                        ? "Book another"
                        : "Book Session"}
                    </button>
                  </div>
                </motion.article>
              ))}
            </motion.div>

            {filtered.length === 0 ? (
              <p className="py-10 text-center text-sm text-munity-muted">
                No therapists match your filters. Try adjusting or resetting them.
              </p>
            ) : null}

            {filtered.length > 0 ? (
              <div className="flex items-center justify-center gap-4 pt-6">
                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="flex size-10 items-center justify-center rounded-xl border border-[#c5c8b8] text-munity-text transition hover:border-munity-green/40 disabled:opacity-40"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPage(n)}
                      className={`flex size-10 items-center justify-center rounded-xl text-sm font-semibold tracking-wide transition ${
                        page === n
                          ? "bg-munity-green text-white"
                          : "border border-[#c5c8b8] text-munity-text hover:border-munity-green/40"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <span className="flex size-10 items-center justify-center text-base text-munity-muted">
                    …
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage(totalPages)}
                    className={`flex size-10 items-center justify-center rounded-xl text-sm font-semibold tracking-wide transition ${
                      page === totalPages
                        ? "bg-munity-green text-white"
                        : "border border-[#c5c8b8] text-munity-text hover:border-munity-green/40"
                    }`}
                  >
                    {totalPages}
                  </button>
                </div>
                <button
                  type="button"
                  aria-label="Next page"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="flex size-10 items-center justify-center rounded-xl border border-[#c5c8b8] text-munity-text transition hover:border-munity-green/40 disabled:opacity-40"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            ) : null}
          </section>
        </div>

        <footer className="mt-4 rounded-t-none bg-[#e4e2e2] px-6 py-8 md:-mx-2 md:px-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-bold tracking-wide text-munity-text">
              Munity Peer Support
            </p>
            <p className="text-xs font-medium text-munity-muted">
              © {new Date().getFullYear()} Munity Peer Support. For emergencies, contact
              local crisis services immediately.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-medium text-munity-muted">
              <a href="#" className="hover:text-munity-green">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-munity-green">
                Help Center
              </a>
            </div>
          </div>
        </footer>
      </div>

      {bookingTherapist ? (
        <BookSessionSheet
          open
          onClose={() => setBookingTherapist(null)}
          therapistId={bookingTherapist.id}
          therapistName={bookingTherapist.name}
          rate={bookingTherapist.rate}
          alreadyBooked={
            bookedTherapistId === bookingTherapist.id ||
            store.bookings.some((b) => b.therapistId === bookingTherapist.id)
          }
          latestBookingWhen={
            store.bookings.find((b) => b.therapistId === bookingTherapist.id)?.when
          }
          onConfirm={({ when, scheduledAt }) => {
            mockStore.bookSession(bookingTherapist.id, when, { scheduledAt });
            setBookedTherapistId(bookingTherapist.id);
            flash(`Session booked with ${bookingTherapist.name} · ${when}`);
          }}
        />
      ) : null}
    </MemberAppShell>
  );
}
