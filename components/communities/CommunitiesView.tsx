"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type ElementType } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  GraduationCap,
  Heart,
  Lightbulb,
  Plus,
  Users,
} from "lucide-react";
import { MemberAppShell } from "@/components/memberlayout/MemberAppShell";
import { LivePulse, LiveTicker, liveFadeUp, liveStagger, useLiveToast } from "@/components/live/LiveFeedback";
import { MunityRingsIcon } from "@/components/icons/MunityIcons";
import { mockStore, useMockStore } from "@/lib/mock-store";
import { communityPath, routes } from "@/lib/routes";

type CommunityFilter =
  | "All"
  | "Anxiety"
  | "Depression"
  | "Student Support"
  | "Grief"
  | "Neurodiversity"
  | "Workplace Stress";

const filters: CommunityFilter[] = [
  "All",
  "Anxiety",
  "Depression",
  "Student Support",
  "Grief",
  "Neurodiversity",
  "Workplace Stress",
];

const filterIcons: Record<string, ElementType> = {
  Anxiety: Lightbulb,
  Depression: Heart,
  "Student Support": GraduationCap,
  Grief: Heart,
  Neurodiversity: MunityRingsIcon,
  "Workplace Stress": Briefcase,
};

export function CommunitiesView({ isLoggedIn = true }: { isLoggedIn?: boolean }) {
  const router = useRouter();
  const store = useMockStore();
  const { flash } = useLiveToast();
  const [activeFilter, setActiveFilter] = useState<CommunityFilter>("All");
  const [search, setSearch] = useState("");

  const visible = useMemo(() => {
    return store.communities.filter((community) => {
      const matchesFilter =
        activeFilter === "All" || community.filter === activeFilter;
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        community.name.toLowerCase().includes(query) ||
        community.description.toLowerCase().includes(query) ||
        community.tag.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, search, store.communities]);

  return (
    <MemberAppShell
      isLoggedIn={isLoggedIn}
      showSearch
      searchPlaceholder="Search communities..."
      searchValue={search}
      onSearchChange={setSearch}
    >
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[32px] p-8 md:min-h-[280px] md:p-12">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(162deg, rgba(214, 231, 161, 0.4) 0%, rgba(85, 107, 47, 0.1) 100%)",
            }}
          />
          <div className="relative max-w-2xl">
            <h1 className="text-4xl font-bold tracking-[-0.96px] text-munity-green md:text-5xl md:leading-[1.2]">
              Find your people.
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-munity-muted">
              Join safe, moderated spaces where empathy is the standard. Connect with
              others walking a similar path.
            </p>
            <div className="mt-4"><LivePulse label="Active spaces" count={store.memberships.length} /></div>
            <div className="mt-8 flex flex-wrap gap-4">
              <motion.button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-munity-green px-6 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-munity-green-dark"
              >
                <Plus className="size-3.5" />
                Create Community
              </motion.button>
              <motion.button
                type="button"
                className="rounded-xl border border-[#c5c8b8] bg-[rgba(251,249,248,0.5)] px-6 py-3 text-sm font-semibold tracking-wide text-munity-text backdrop-blur-sm transition hover:bg-white"
              >
                How it works
              </motion.button>
            </div>
          </div>
        </section>

        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto pb-1">
          {filters.map((filter) => {
            const active = activeFilter === filter;
            return (
              <motion.button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                whileTap={{ scale: 0.95 }}
                className={`shrink-0 rounded-full px-6 py-2 text-sm font-semibold tracking-wide transition ${
                  active
                    ? "bg-munity-green text-white shadow-sm"
                    : "border border-[#c5c8b8] bg-white text-munity-muted hover:border-munity-green/40 hover:text-munity-green"
                }`}
              >
                {filter}
              </motion.button>
            );
          })}
        </div>

        {/* Grid */}
        <LiveTicker items={store.communities.slice(0, 3).map((community) => `${community.name} has ${community.membersLabel} connecting today.`)} />
        <motion.div variants={liveStagger} initial="hidden" animate="show" className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((community) => {
            const Icon = filterIcons[community.filter] ?? Users;
            const joined = store.memberships.includes(community.id);
            return (
              <motion.article
                key={community.id}
                variants={liveFadeUp}
                className="flex flex-col overflow-hidden rounded-[20px] border border-[#e5e5e1] bg-white"
              >
                <div className="relative h-32 w-full">
                  <Image
                    src={community.image}
                    alt={community.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute -bottom-6 left-6 flex size-12 items-center justify-center rounded-xl bg-munity-lime shadow-md">
                    <Icon className="size-5 text-munity-olive-text" />
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-2 px-6 pb-6 pt-10">
                  <div className="flex flex-wrap items-start gap-2">
                    <h2 className="text-2xl font-semibold leading-tight text-munity-text">
                      {community.name}
                    </h2>
                    <span className="mt-1 rounded-md bg-[#efeded] px-2 py-1 text-xs font-medium text-munity-muted">
                      {community.tag}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-base leading-relaxed text-munity-muted">
                    {community.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2 text-sm font-semibold tracking-wide text-[#75796b]">
                      <Users className="size-4" />
                      {community.membersLabel}
                    </div>
                    <div className="flex gap-2">
                    <Link
                      href={communityPath(community.slug)}
                      className="rounded-xl border border-munity-green px-4 py-2 text-sm font-semibold tracking-wide text-munity-green transition hover:bg-munity-lime/30"
                    >
                      View
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        if (!isLoggedIn) {
                          router.push(routes.login);
                          return;
                        }
                        mockStore.toggleMembership(community.id);
                        flash(joined ? `Left ${community.name}` : `Joined ${community.name}`);
                      }}
                      className="rounded-xl bg-munity-lime px-5 py-2 text-sm font-semibold tracking-wide text-munity-olive-text transition hover:brightness-95"
                    >
                      {joined ? "Joined" : "Join"}
                    </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}

          <article className="flex min-h-[320px] flex-col items-center justify-center gap-6 rounded-[20px] bg-munity-green p-8 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-white/10">
              <Users className="size-7 text-munity-lime" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Can&apos;t find what you&apos;re looking for?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Start a moderated space for your community and help others feel less alone.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-munity-lime px-5 py-2.5 text-sm font-semibold tracking-wide text-munity-olive-text transition hover:brightness-95"
            >
              <Plus className="size-3.5" />
              Apply to Moderate
            </button>
          </article>
        </motion.div>

        {visible.length === 0 ? (
          <p className="py-8 text-center text-sm text-munity-muted">
            No communities match your search.
          </p>
        ) : null}

        {/* Footer */}
        <footer className="mt-4 flex flex-col gap-6 border-t border-munity-border pt-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold text-munity-text">Munity Peer Support</p>
            <p className="mt-1 text-xs text-munity-muted">
              © {new Date().getFullYear()} Munity. For emergencies, contact local crisis
              services immediately.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-munity-muted">
            <a href={routes.emergency} className="hover:text-munity-green">
              Emergency Support
            </a>
            <a href="#" className="hover:text-munity-green">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-munity-green">
              Terms of Service
            </a>
            <a href="#" className="hover:text-munity-green">
              Help Center
            </a>
          </div>
        </footer>
      </div>
    </MemberAppShell>
  );
}
