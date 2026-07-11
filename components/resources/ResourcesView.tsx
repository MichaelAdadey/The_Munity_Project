"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Bell,
  Bookmark,
  BookOpen,
  Brain,
  Clock,
  Cloud,
  Heart,
  HeartHandshake,
  Headphones,
  LayoutGrid,
  LifeBuoy,
  Play,
  Search,
  Stethoscope,
  Users,
  Wind,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/routes";
import {
  resourceCategoriesById,
  type ResourceCategory,
} from "@/lib/resource-categories";

const topNavLinks = [
  { label: "Home", href: "/home" },
  { label: "Communities", href: "/Communities" },
  { label: "Resources", href: "/resources" },
  { label: "Therapy", href: "/Therapy" },
];

const sideNav = [
  { label: "Dashboard", href: "/home", icon: LayoutGrid },
  { label: "Communities", href: "/Communities", icon: Users },
  { label: "Resources", href: "/resources", icon: BookOpen },
  { label: "Saved Posts", href: "/saved", icon: Bookmark },
  { label: "Therapy", href: "/Therapy", icon: Stethoscope },
];

const categories: { label: ResourceCategory; icon: typeof Wind }[] = [
  { label: "Anxiety", icon: Wind },
  { label: "Depression", icon: Cloud },
  { label: "Stress", icon: Brain },
  { label: "Grief", icon: Heart },
  { label: "Relationships", icon: HeartHandshake },
  { label: "Addiction", icon: LifeBuoy },
];

const savedItems = [
  {
    title: "Morning Routine for Mental Clarity",
    image: "/images/resources/side1.png",
  },
  {
    title: "Cognitive Reframing Workbook",
    image: "/images/resources/side2.png",
  },
];

function ResourcesTopNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  const pathname = usePathname();
  const visibleTopLinks = isLoggedIn
    ? topNavLinks
    : topNavLinks.filter((link) => link.label === "Resources");

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-munity-border/60 bg-munity-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 lg:px-10">
        <div className="flex items-center gap-8">
          <Link
            href={isLoggedIn ? "/home" : routes.home}
            className="text-2xl font-bold text-munity-green"
          >
            Munity
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {visibleTopLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-wide transition ${
                    active
                      ? "border-b-2 border-munity-green pb-1 font-bold text-munity-green"
                      : "font-medium text-munity-muted hover:text-munity-green"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <button
                type="button"
                className="rounded-full p-2 text-munity-muted transition hover:bg-white hover:text-munity-green"
                aria-label="Notifications"
              >
                <Bell className="size-5" />
              </button>
              <Link
                href="/profile"
                className="relative size-9 overflow-hidden rounded-full border-2 border-munity-lime"
              >
                <Image
                  src="/images/home-feed/alex.jpg"
                  alt="Alex Rivera"
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href={routes.login}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-munity-green transition hover:bg-white"
              >
                Log in
              </Link>
              <Link
                href={routes.signup}
                className="rounded-xl bg-munity-green px-4 py-2 text-sm font-semibold text-white transition hover:bg-munity-green-dark"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function ResourcesView({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const pathname = usePathname();
  const [activeCategory, setActiveCategory] = useState<ResourceCategory>("Anxiety");
  const [query, setQuery] = useState("");
  const visibleSideNav = isLoggedIn
    ? sideNav
    : sideNav.filter((item) => item.label === "Resources");

  const categoryContent = resourceCategoriesById[activeCategory];
  const search = query.trim().toLowerCase();
  const filteredLatest = search
    ? categoryContent.latest.filter(
        (item) =>
          item.title.toLowerCase().includes(search) ||
          item.excerpt.toLowerCase().includes(search) ||
          item.type.toLowerCase().includes(search),
      )
    : categoryContent.latest;

  return (
    <div className="min-h-screen bg-munity-bg">
      <ResourcesTopNav isLoggedIn={isLoggedIn} />

      <div className="flex pt-16">
        <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-64 shrink-0 flex-col bg-[#f5f3f3] px-4 py-4 lg:flex">
          <p className="mb-2 px-4 text-xs font-medium uppercase tracking-[1.2px] text-munity-muted opacity-60">
            Navigation
          </p>
          <nav className="flex flex-1 flex-col gap-1">
            {visibleSideNav.map(({ label, href, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={label}
                  href={href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold tracking-wide transition ${
                    active
                      ? "bg-munity-lime text-munity-olive-text"
                      : "text-munity-muted hover:bg-white/70"
                  }`}
                >
                  <Icon className="size-[18px]" />
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="p-4">
            <Link
              href="/emergency"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ffdad6] py-3 text-base text-[#93000a] transition hover:brightness-95"
            >
              <LifeBuoy className="size-3.5" />
              Emergency Support
            </Link>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-6 py-8 lg:px-10">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-12">
            <section className="flex flex-col gap-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-xl">
                  <h1 className="text-4xl font-bold tracking-[-0.96px] text-munity-green md:text-5xl md:leading-[57.6px]">
                    Resource Hub
                  </h1>
                  <p className="mt-2 text-lg leading-relaxed text-munity-muted">
                    {categoryContent.blurb}
                  </p>
                </div>
                <div className="relative w-full max-w-sm">
                  <Search className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-gray-500" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`Search ${activeCategory.toLowerCase()} resources...`}
                    className="h-[56px] w-full rounded-2xl border border-munity-input-border bg-white py-4 pl-12 pr-4 text-base text-munity-text shadow-sm outline-none placeholder:text-gray-500 focus:border-munity-green focus:ring-2 focus:ring-munity-green/15"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {categories.map(({ label, icon: Icon }) => {
                  const active = activeCategory === label;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        setActiveCategory(label);
                        setQuery("");
                      }}
                      className={`flex min-w-[120px] flex-col items-center gap-2.5 rounded-2xl border px-6 py-4 transition ${
                        active
                          ? "border-munity-green bg-munity-lime/40 text-munity-olive-text"
                          : "border-munity-input-border bg-white text-munity-text hover:border-munity-green/40"
                      }`}
                    >
                      <Icon className="size-6" />
                      <span className="text-sm font-semibold tracking-wide">{label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <div className="flex flex-col gap-8 xl:flex-row xl:items-start">
              <div className="flex min-w-0 flex-1 flex-col gap-12">
                <article
                  key={activeCategory}
                  className="overflow-hidden rounded-[20px] border border-munity-input-border bg-white shadow-[0_4px_20px_rgba(85,107,47,0.05)]"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="relative h-64 w-full md:min-h-[360px] md:w-1/2">
                      <Image
                        src={categoryContent.featured.image}
                        alt={categoryContent.featured.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        priority
                      />
                      <span className="absolute left-4 top-4 rounded-full bg-munity-green px-3 py-1 text-xs font-medium uppercase tracking-[0.6px] text-white">
                        {categoryContent.featured.badge}
                      </span>
                    </div>
                    <div className="flex w-full flex-col justify-center p-8 md:w-1/2">
                      <div className="flex items-center gap-2 text-xs font-medium text-munity-green">
                        <Clock className="size-3" />
                        {categoryContent.featured.duration}
                      </div>
                      <p className="mt-2 text-xs font-bold uppercase tracking-wide text-munity-muted">
                        {activeCategory}
                      </p>
                      <h2 className="mt-2 text-3xl font-bold leading-tight text-munity-text">
                        {categoryContent.featured.title}
                      </h2>
                      <p className="mt-4 text-base leading-relaxed text-munity-muted">
                        {categoryContent.featured.description}
                      </p>
                      <div className="mt-6 flex items-center justify-between">
                        <button
                          type="button"
                          className="rounded-xl bg-munity-green px-6 py-3 text-base text-white transition hover:bg-munity-green-dark"
                        >
                          {categoryContent.featured.cta}
                        </button>
                        {isLoggedIn ? (
                          <button
                            type="button"
                            className="rounded-full p-2 text-munity-muted hover:bg-munity-bg hover:text-munity-green"
                            aria-label="Save for later"
                          >
                            <Bookmark className="size-5" />
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </article>

                <section>
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-2xl font-semibold text-munity-text">
                      Latest in {activeCategory}
                    </h3>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-base text-munity-green hover:underline"
                    >
                      View All
                      <ArrowRight className="size-2.5" />
                    </button>
                  </div>
                  {filteredLatest.length === 0 ? (
                    <p className="rounded-2xl border border-munity-border/50 bg-white px-6 py-10 text-center text-munity-muted">
                      No {activeCategory.toLowerCase()} resources match “{query}”.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredLatest.map((item) => (
                        <article
                          key={item.title}
                          className="overflow-hidden rounded-[20px] border border-munity-input-border bg-white shadow-sm"
                        >
                          <div className="relative h-48 w-full">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover"
                            />
                            {item.video ? (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <span className="flex size-10 items-center justify-center rounded-full bg-white/90 text-munity-green">
                                  <Play className="size-4 fill-current" />
                                </span>
                              </div>
                            ) : null}
                            <span className="absolute bottom-3 left-3 rounded-lg bg-white/90 px-2 py-1 text-xs font-medium text-munity-green backdrop-blur-sm">
                              {item.type}
                            </span>
                          </div>
                          <div className="p-6">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold uppercase tracking-tight text-munity-green">
                                {item.category}
                              </span>
                              <span className="font-medium text-munity-muted">{item.duration}</span>
                            </div>
                            <h4 className="mt-2 text-xl leading-snug text-munity-text">
                              {item.title}
                            </h4>
                            <p className="mt-3 text-sm leading-5 text-munity-muted">{item.excerpt}</p>
                            <button
                              type="button"
                              className="mt-4 inline-flex items-center gap-1 text-base text-munity-green hover:underline"
                            >
                              {item.cta}
                              <ArrowRight className="size-2.5" />
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              <aside className="flex w-full shrink-0 flex-col gap-6 xl:w-[320px]">
                {isLoggedIn ? (
                  <section className="rounded-[20px] border border-munity-input-border bg-white p-6 shadow-sm">
                    <div className="mb-4">
                      <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-munity-text">
                        Saved for Later
                      </h3>
                      <p className="mt-1 text-xs text-munity-muted">{savedItems.length} Items</p>
                    </div>
                    <div className="flex flex-col gap-4">
                      {savedItems.map((item) => (
                        <div key={item.title} className="flex items-center gap-3">
                          <div className="relative size-14 shrink-0 overflow-hidden rounded-xl">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>
                          <p className="text-sm font-semibold leading-snug text-munity-text">
                            {item.title}
                          </p>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="mt-5 text-sm font-medium text-munity-green hover:underline"
                    >
                      View All Saved
                    </button>
                  </section>
                ) : null}

                <section className="rounded-[20px] border border-munity-input-border bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-munity-text">
                    Trending in {activeCategory}
                  </h3>
                  <div className="flex flex-col gap-5">
                    {categoryContent.trending.map((item) => (
                      <div key={item.rank} className="flex gap-3">
                        <span className="text-2xl font-bold text-munity-lime">{item.rank}</span>
                        <div>
                          <p className="text-sm font-semibold leading-snug text-munity-text">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs text-munity-muted">{item.reads}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="overflow-hidden rounded-[20px] bg-munity-olive p-6 text-munity-lime-light shadow-[0_4px_20px_rgba(85,107,47,0.05)]">
                  <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-white/10">
                    <Headphones className="size-5" />
                  </div>
                  <h3 className="text-xl font-bold leading-tight">Need Immediate Help?</h3>
                  <p className="mt-2 text-sm leading-relaxed opacity-90">
                    Connect with a certified peer counselor or therapist within 15 minutes.
                  </p>
                  <button
                    type="button"
                    className="mt-5 w-full rounded-xl bg-munity-lime px-4 py-3 text-sm font-semibold text-munity-olive-text transition hover:brightness-95"
                  >
                    Get Support
                  </button>
                </section>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
