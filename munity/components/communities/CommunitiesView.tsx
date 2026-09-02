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
import {
  LivePulse,
  LiveTicker,
  liveFadeUp,
  liveStagger,
  useLiveToast,
} from "@/components/live/LiveFeedback";
import { MunityRingsIcon } from "@/components/icons/MunityIcons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mockStore } from "@/lib/mock-store";
import type { CommunityRecord } from "@/lib/mock-db";
import { communityPath, routes } from "@/lib/routes";
import { CommunityListItem } from "@/lib/communities/queries";
import {
  joinCommunity,
  leaveCommunity,
} from "@/lib/communities/membership-actions";

// type CommunityFilter =
//   | "All"
//   | "Anxiety"
//   | "Depression"
//   | "Student Support"
//   | "Grief"
//   | "Neurodiversity"
//   | "Workplace Stress";

// const filters: CommunityFilter[] = [
//   "All",
//   "Anxiety",
//   "Depression",
//   "Student Support",
//   "Grief",
//   "Neurodiversity",
//   "Workplace Stress",
// ];

const createFilters: CommunityRecord["filter"][] = [
  "Anxiety",
  "Depression",
  "Student Support",
  "Grief",
  "Neurodiversity",
  "Workplace Stress",
  "Mindfulness",
];

const filterIcons: Record<string, ElementType> = {
  Anxiety: Lightbulb,
  Depression: Heart,
  "Student Support": GraduationCap,
  Grief: Heart,
  Neurodiversity: MunityRingsIcon,
  "Workplace Stress": Briefcase,
};

const howItWorksSteps = [
  {
    title: "Browse or create",
    body: "Find a moderated space that fits your path, or start one for others like you.",
  },
  {
    title: "Join and check in",
    body: "Membership is gentle and optional. Share when you're ready — anonymity is always available.",
  },
  {
    title: "Stay supported",
    body: "Trained moderators keep empathy as the standard. Flag anything that feels off.",
  },
];

export function CommunitiesView({
  isLoggedIn = true,
  communities,
  initialMembershipIds,
}: {
  isLoggedIn?: boolean;
  communities: CommunityListItem[];
  initialMembershipIds: string[];
}) {
  const router = useRouter();
  const { flash } = useLiveToast();
  const [memberships, setMemberships] = useState<Set<string>>(
    () => new Set(initialMembershipIds),
  );

  const availableCategories = useMemo(
    () =>
      Array.from(
        new Set(
          communities.map((c) => c.category).filter((c): c is string => !!c),
        ),
      ).sort(),
    [communities],
  );

  const filters = ["All", ...availableCategories];
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [howOpen, setHowOpen] = useState(false);
  const [moderateOpen, setModerateOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [topic, setTopic] = useState<CommunityRecord["filter"]>("Anxiety");
  const [moderateFocus, setModerateFocus] = useState("");
  const [moderateWhy, setModerateWhy] = useState("");

  const visible = useMemo(() => {
    return communities.filter((community) => {
      const matchesFilter =
        activeFilter === "All" || community.category === activeFilter;
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        community.name.toLowerCase().includes(query) ||
        (community.description ?? "").toLowerCase().includes(query) ||
        (community.tag ?? "").toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, search, communities]);

  function requireLogin() {
    if (isLoggedIn) return true;
    router.push(routes.login);
    return false;
  }

  const handleToggleMembership = async (community: CommunityListItem) => {
    if (!requireLogin()) return;
    const wasJoined = memberships.has(community.id);

    setMemberships((prev) => {
      const next = new Set(prev);
      if (wasJoined) next.delete(community.id);
      else next.add(community.id);
      return next;
    });

    try {
      if (wasJoined) {
        await leaveCommunity(community.id);
      } else {
        await joinCommunity(community.id);
      }
      flash(wasJoined ? `Left ${community.name}` : `Joined ${community.name}`);
    } catch (error) {
      // Roll back the optimistic update on failure
      setMemberships((prev) => {
        const next = new Set(prev);
        if (wasJoined) next.add(community.id);
        else next.delete(community.id);
        return next;
      });
      flash(
        error instanceof Error ? error.message : "Couldn't update membership",
      );
    }
  };

  function resetCreateForm() {
    setName("");
    setDescription("");
    setTag("");
    setTopic("Anxiety");
  }

  function handleCreate() {
    if (!requireLogin()) return;
    const community = mockStore.createCommunity({
      name,
      description,
      filter: topic,
      tag,
    });
    if (!community) {
      flash("Add a community name to continue");
      return;
    }
    flash(`Created ${community.name}`);
    resetCreateForm();
    setCreateOpen(false);
    router.push(communityPath(community.slug));
  }

  function handleModerateApply() {
    if (!requireLogin()) return;
    if (!moderateFocus.trim()) {
      flash("Tell us which space you'd like to moderate");
      return;
    }
    flash("Moderator application submitted — we'll review it soon");
    setModerateFocus("");
    setModerateWhy("");
    setModerateOpen(false);
  }

  return (
    <MemberAppShell
      isLoggedIn={isLoggedIn}
      showSearch
      searchPlaceholder="Search communities..."
      searchValue={search}
      onSearchChange={setSearch}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-4xl p-8 md:min-h-70 md:p-12">
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
              Join safe, moderated spaces where empathy is the standard. Connect
              with others walking a similar path.
            </p>
            <div className="mt-4">
              <LivePulse label="Active spaces" count={memberships.size} />
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => setHowOpen(true)}
                className="rounded-xl border border-munity-input-border bg-[rgba(251,249,248,0.5)] px-6 py-3 text-sm font-semibold tracking-wide text-munity-text backdrop-blur-sm transition hover:bg-white"
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
                    : "border border-munity-input-border bg-white text-munity-muted hover:border-munity-green/40 hover:text-munity-green"
                }`}
              >
                {filter}
              </motion.button>
            );
          })}
        </div>

        {/* Grid */}
        <LiveTicker
          items={communities
            .slice(0, 3)
            .map(
              (community) =>
                `${community.name} has ${community.membersLabel} connecting today.`,
            )}
        />
        <motion.div
          variants={liveStagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          {visible.map((community) => {
            const Icon = filterIcons[community.category ?? ""] ?? Users;
            const joined = memberships.has(community.id);
            return (
              <motion.article
                key={community.id}
                variants={liveFadeUp}
                className="flex flex-col overflow-hidden rounded-[20px] border border-munity-border bg-white"
              >
                <div className="relative h-32 w-full">
                  <Image
                    src={
                      community.image ?? "/images/communities/mindful-paths.png"
                    }
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
                    {community.tag ? (
                      <span className="mt-1 rounded-md bg-[#efeded] px-2 py-1 text-xs font-medium text-munity-muted">
                        {community.tag}
                      </span>
                    ) : null}
                  </div>
                  <p className="line-clamp-2 text-base leading-relaxed text-munity-muted">
                    {community.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2 text-sm font-semibold tracking-wide text-munity-gray">
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
                        onClick={() => void handleToggleMembership(community)}
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

          <article className="flex min-h-80 flex-col items-center justify-center gap-6 rounded-[20px] bg-munity-green p-8 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-white/10">
              <Users className="size-7 text-munity-lime" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Can&apos;t find what you&apos;re looking for?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Start a moderated space for your community and help others feel
                less alone.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!requireLogin()) return;
                setModerateOpen(true);
              }}
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
            <p className="text-sm font-semibold text-munity-text">
              Munity Peer Support
            </p>
            <p className="mt-1 text-xs text-munity-muted">
              © {new Date().getFullYear()} Munity. For emergencies, contact
              local crisis services immediately.
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

      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open) resetCreateForm();
        }}
      >
        <DialogContent
          className="border border-[#d8dbcf] bg-white shadow-2xl ring-1 ring-black/5 sm:max-w-md"
          showCloseButton
        >
          <DialogHeader>
            <DialogTitle>Create a community</DialogTitle>
            <DialogDescription>
              Start a moderated peer space. You&apos;ll join as the first
              member.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold tracking-wide text-munity-muted">
                Name
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Evening Calm Check-ins"
                className="w-full rounded-xl border border-munity-input-border bg-white px-3 py-2.5 text-sm text-munity-text outline-none ring-munity-green/30 placeholder:text-munity-muted/70 focus:ring-2"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold tracking-wide text-munity-muted">
                Topic
              </span>
              <select
                value={topic}
                onChange={(e) =>
                  setTopic(e.target.value as CommunityRecord["filter"])
                }
                className="w-full rounded-xl border border-munity-input-border bg-white px-3 py-2.5 text-sm text-munity-text outline-none ring-munity-green/30 focus:ring-2"
              >
                {createFilters.map((filter) => (
                  <option key={filter} value={filter}>
                    {filter}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold tracking-wide text-munity-muted">
                Short tag
              </span>
              <input
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Optional label"
                className="w-full rounded-xl border border-munity-input-border bg-white px-3 py-2.5 text-sm text-munity-text outline-none ring-munity-green/30 placeholder:text-munity-muted/70 focus:ring-2"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold tracking-wide text-munity-muted">
                Description
              </span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="What kind of support will this space hold?"
                className="w-full resize-none rounded-xl border border-munity-input-border bg-white px-3 py-2.5 text-sm text-munity-text outline-none ring-munity-green/30 placeholder:text-munity-muted/70 focus:ring-2"
              />
            </label>
          </div>
          <DialogFooter className="border-munity-border bg-[#f3f4ee]">
            <button
              type="button"
              onClick={() => setCreateOpen(false)}
              className="rounded-xl border-2 border-munity-gray bg-white px-4 py-2.5 text-sm font-semibold text-munity-text shadow-sm transition hover:bg-[#eceee6]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreate}
              className="rounded-xl bg-munity-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-munity-green-dark"
            >
              Create space
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={howOpen} onOpenChange={setHowOpen}>
        <DialogContent
          className="border border-[#d8dbcf] bg-white shadow-2xl ring-1 ring-black/5 sm:max-w-md"
          showCloseButton
        >
          <DialogHeader>
            <DialogTitle>How communities work</DialogTitle>
            <DialogDescription>
              Safe, moderated peer spaces — empathy first, pressure never.
            </DialogDescription>
          </DialogHeader>
          <ol className="space-y-4">
            {howItWorksSteps.map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-munity-lime text-xs font-bold text-munity-olive-text">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-munity-text">
                    {step.title}
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-munity-muted">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <DialogFooter className="border-munity-border bg-[#f3f4ee]">
            <button
              type="button"
              onClick={() => setHowOpen(false)}
              className="rounded-xl border-2 border-munity-gray bg-white px-4 py-2.5 text-sm font-semibold text-munity-text shadow-sm transition hover:bg-[#eceee6]"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                setHowOpen(false);
                if (!requireLogin()) return;
                setCreateOpen(true);
              }}
              className="rounded-xl bg-munity-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-munity-green-dark"
            >
              Create a space
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={moderateOpen}
        onOpenChange={(open) => {
          setModerateOpen(open);
          if (!open) {
            setModerateFocus("");
            setModerateWhy("");
          }
        }}
      >
        <DialogContent
          className="border border-[#d8dbcf] bg-white shadow-2xl ring-1 ring-black/5 sm:max-w-md"
          showCloseButton
        >
          <DialogHeader>
            <DialogTitle>Apply to moderate</DialogTitle>
            <DialogDescription>
              Moderators help keep spaces kind and on-track. This is a preview —
              your application is stored locally for the demo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold tracking-wide text-munity-muted">
                Space or topic
              </span>
              <input
                value={moderateFocus}
                onChange={(e) => setModerateFocus(e.target.value)}
                placeholder="e.g. Anxiety Allies"
                className="w-full rounded-xl border border-munity-input-border bg-white px-3 py-2.5 text-sm text-munity-text outline-none ring-munity-green/30 placeholder:text-munity-muted/70 focus:ring-2"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold tracking-wide text-munity-muted">
                Why you&apos;d like to help
              </span>
              <textarea
                value={moderateWhy}
                onChange={(e) => setModerateWhy(e.target.value)}
                rows={3}
                placeholder="Optional — a few words about your experience or interest"
                className="w-full resize-none rounded-xl border border-munity-input-border bg-white px-3 py-2.5 text-sm text-munity-text outline-none ring-munity-green/30 placeholder:text-munity-muted/70 focus:ring-2"
              />
            </label>
          </div>
          <DialogFooter className="border-munity-border bg-[#f3f4ee]">
            <button
              type="button"
              onClick={() => setModerateOpen(false)}
              className="rounded-xl border-2 border-munity-gray bg-white px-4 py-2.5 text-sm font-semibold text-munity-text shadow-sm transition hover:bg-[#eceee6]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleModerateApply}
              className="rounded-xl bg-munity-lime px-4 py-2.5 text-sm font-semibold text-munity-olive-text transition hover:brightness-95"
            >
              Submit application
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MemberAppShell>
  );
}
