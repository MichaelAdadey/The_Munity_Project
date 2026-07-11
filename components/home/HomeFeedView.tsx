"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Heart,
  ImageIcon,
  Lightbulb,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Share2,
  Smile,
  UserRound,
} from "lucide-react";
import { MemberAppShell } from "@/components/memberlayout/MemberAppShell";
import { moodIcons, type MoodLabel } from "@/components/home/MoodIcons";
import { mockStore, useMockStore } from "@/lib/mock-store";
import { communityPath, routes, therapyPath } from "@/lib/routes";

const moods: { label: MoodLabel; bg: string }[] = [
  { label: "Happy", bg: "bg-[#f4f7e8]" },
  { label: "Calm", bg: "bg-[#eef5d8]" },
  { label: "Stressed", bg: "bg-[#f8f0e6]" },
  { label: "Sad", bg: "bg-[#eef2f7]" },
  { label: "Anxious", bg: "bg-[#f3eef7]" },
];

const cardClass =
  "rounded-[20px] border border-munity-border bg-white shadow-[0_4px_10px_rgba(85,107,47,0.05)]";

export function HomeFeedView() {
  const store = useMockStore();
  const [showMoods, setShowMoods] = useState(true);
  const [composerText, setComposerText] = useState("");
  const [anonymous, setAnonymous] = useState(store.settings.anonymousDefault);
  const joinedCommunities = store.communities.filter((community) =>
    store.memberships.includes(community.id),
  );
  const suggestedGroups = store.communities.filter(
    (community) => !store.memberships.includes(community.id),
  ).slice(0, 2);
  const therapists = store.therapists.slice(0, 2);

  function selectMood(mood: MoodLabel) {
    mockStore.setMood(mood);
  }

  function createPost() {
    if (!composerText.trim()) return;
    mockStore.createPost({
      content: composerText,
      anonymous,
      feeling: store.moodToday ? `Feeling ${store.moodToday}` : undefined,
    });
    setComposerText("");
  }

  return (
    <MemberAppShell>
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-6">
        {/* Left sidebar */}
        <aside className="flex flex-col gap-5 lg:col-span-3">
          <section className={`${cardClass} p-6`}>
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full border-4 border-munity-lime/80 p-1.5 shadow-sm">
                <div className="relative size-16 overflow-hidden rounded-full">
                  <Image
                    src={store.profile.avatar}
                    alt={store.profile.fullName}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <h2 className="mt-4 text-xl font-semibold tracking-tight text-munity-text">
                {store.profile.fullName}
              </h2>
              <p className="mt-1 text-xs font-medium text-munity-muted">{store.profile.title}</p>
              <div className="mt-5 flex w-full gap-2">
                <div className="flex-1 rounded-xl bg-[#f5f3f3] px-3 py-3 text-center">
                  <p className="text-base font-bold text-munity-green">{store.profile.dayStreak}</p>
                  <p className="mt-0.5 text-[11px] font-medium text-munity-muted">Day Streak</p>
                </div>
                <div className="flex-1 rounded-xl bg-[#f5f3f3] px-3 py-3 text-center">
                  <p className="text-base font-bold text-munity-green">{store.profile.groupCount}</p>
                  <p className="mt-0.5 text-[11px] font-medium text-munity-muted">Groups</p>
                </div>
              </div>
            </div>
          </section>

          <section className={`${cardClass} p-5`}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-wide text-munity-text">
                Your Communities
              </h3>
              <button
                type="button"
                className="rounded-full p-1.5 text-munity-green transition hover:bg-munity-lime/40"
                aria-label="Add community"
              >
                <Plus className="size-4" />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {joinedCommunities.map((community) => (
                <Link
                  key={community.id}
                  href={communityPath(community.slug)}
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-[#f5f3f3]"
                >
                  <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#d6e7a1] text-sm font-bold text-[#5a682f]"
                  >
                    {community.name.charAt(0)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-munity-text">
                      {community.name}
                    </span>
                    <span className="block text-xs text-munity-muted">{community.membersLabel}</span>
                  </span>
                </Link>
              ))}
            </div>
            <Link
              href={routes.communities}
              className="mt-3 block rounded-xl py-2 text-center text-xs font-semibold text-munity-green transition hover:bg-munity-lime/30"
            >
              View all communities
            </Link>
          </section>
        </aside>

        {/* Center feed */}
        <section className="flex flex-col gap-5 lg:col-span-6">
          <div className={`${cardClass} p-5 sm:p-6`}>
            <div className="flex gap-3 sm:gap-4">
              <div className="relative size-11 shrink-0 overflow-hidden rounded-full sm:size-12">
                <Image
                  src={store.profile.avatar}
                  alt={store.profile.fullName}
                  fill
                  className="object-cover"
                />
              </div>
              <textarea
                value={composerText}
                onChange={(event) => setComposerText(event.target.value)}
                placeholder={`What's on your mind, ${store.profile.fullName.split(" ")[0]}?`}
                className="min-h-[96px] w-full resize-none rounded-2xl border border-transparent bg-[#f5f3f3] px-4 py-3.5 text-base text-munity-text outline-none transition placeholder:text-munity-muted/55 focus:border-munity-green/20 focus:bg-white focus:ring-2 focus:ring-munity-green/10"
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-munity-border/60 pt-4">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setShowMoods((value) => !value)}
                  className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                    showMoods
                      ? "bg-munity-lime/60 text-munity-olive-text"
                      : "bg-[#f5f3f3] text-munity-muted hover:bg-munity-lime/40"
                  }`}
                >
                  <Smile className="size-3.5" />
                  Mood
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-[#f5f3f3] px-3.5 py-2 text-xs font-semibold text-munity-muted transition hover:bg-munity-lime/40"
                >
                  <ImageIcon className="size-3.5" />
                  Photo
                </button>
                <button
                  type="button"
                  onClick={() => setAnonymous((value) => !value)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#f5f3f3] px-3.5 py-2 text-xs font-semibold text-munity-muted transition hover:bg-munity-lime/40"
                >
                  <UserRound className="size-3.5" />
                  {anonymous ? "Anonymous ✓" : "Anonymous"}
                </button>
              </div>
              <button
                type="button"
                onClick={createPost}
                disabled={!composerText.trim()}
                className="rounded-full bg-munity-green px-7 py-2.5 text-sm font-semibold tracking-wide text-white transition hover:bg-munity-green-dark disabled:opacity-50"
              >
                Post
              </button>
            </div>

            {showMoods ? (
              <div className="mt-4 grid grid-cols-5 gap-2 rounded-2xl bg-[#f5f3f3] p-3 sm:gap-3 sm:p-4">
                {moods.map((mood) => {
                  const active = store.moodToday === mood.label;
                  const Icon = moodIcons[mood.label];
                  return (
                    <button
                      key={mood.label}
                      type="button"
                      onClick={() => selectMood(mood.label)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl px-1 py-2 transition ${
                        active
                          ? "bg-white shadow-sm ring-2 ring-munity-green/25"
                          : "hover:bg-white/70"
                      }`}
                    >
                      <span
                        className={`flex size-10 items-center justify-center rounded-full ${mood.bg}`}
                      >
                        <Icon className="size-9" />
                      </span>
                      <span
                        className={`text-[11px] font-medium ${
                          active ? "text-munity-green" : "text-munity-muted"
                        }`}
                      >
                        {mood.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          {store.posts.map((post) => (
            <article
              key={post.id}
              className={`${cardClass} p-5 sm:p-6 ${
                post.accent ? "border-l-4 border-l-munity-green" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {post.anonymous ? (
                    <div className="flex size-10 items-center justify-center rounded-full bg-[#efeded] text-munity-muted">
                      <UserRound className="size-5" />
                    </div>
                  ) : (
                    <div className="relative size-10 overflow-hidden rounded-full">
                      <Image
                        src={post.avatar ?? "/images/home-feed/sarah.jpg"}
                        alt={post.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-munity-text">{post.author}</p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-medium text-munity-muted">
                      <span>{post.time}</span>
                      <span className="size-1 rounded-full bg-munity-input-border" />
                      <span className="text-munity-olive-text">{post.feeling}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-full p-1.5 text-munity-muted transition hover:bg-[#f5f3f3] hover:text-munity-text"
                  aria-label="Post options"
                >
                  <MoreHorizontal className="size-4" />
                </button>
              </div>

              <p className="mt-4 text-[15px] leading-relaxed text-munity-text">{post.content}</p>

              {post.image ? (
                <div className="relative mt-4 h-56 w-full overflow-hidden rounded-2xl sm:h-64">
                  <Image src={post.image} alt="Post attachment" fill className="object-cover" />
                </div>
              ) : null}

              <div className="mt-4 flex items-center gap-1 border-t border-munity-border/60 pt-3">
                <button
                  type="button"
                  onClick={() => mockStore.toggleSupport(post.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition hover:bg-[#f5f3f3] hover:text-munity-green ${store.supportedPostIds.includes(post.id) ? "bg-munity-lime/40 text-munity-green" : "text-munity-muted"}`}
                >
                  <Heart className="size-4" />
                  Support · {post.supports}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-munity-muted transition hover:bg-[#f5f3f3] hover:text-munity-green"
                >
                  <MessageCircle className="size-4" />
                  Comment · {post.comments}
                </button>
                <button
                  type="button"
                  onClick={() => mockStore.toggleSavedPost(post.id)}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-munity-muted transition hover:bg-[#f5f3f3] hover:text-munity-green"
                  aria-label="Share"
                >
                  <Share2 className="size-4" />
                  {store.savedPostIds.includes(post.id) ? "Saved" : "Save"}
                </button>
              </div>
            </article>
          ))}
        </section>

        {/* Right sidebar */}
        <aside className="flex flex-col gap-5 lg:col-span-3">
          <section className="relative overflow-hidden rounded-[20px] bg-munity-olive p-5 shadow-[0_4px_10px_rgba(85,107,47,0.08)]">
            <div className="pointer-events-none absolute -bottom-10 -right-10 size-36 rounded-full bg-[#d0eba1]/15 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2">
                <Lightbulb className="size-4 text-munity-lime-light" />
                <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-munity-lime-light">
                  Mindful Moment
                </h3>
              </div>
              <p className="mt-3 text-sm italic leading-relaxed text-munity-lime-light/95">
                &ldquo;Box breathing: Inhale for 4, Hold for 4, Exhale for 4, Hold for 4. Repeat until
                you feel grounded.&rdquo;
              </p>
              <button
                type="button"
                className="mt-4 text-xs font-semibold text-munity-lime-light underline underline-offset-4 transition hover:opacity-80"
              >
                Try it now
              </button>
            </div>
          </section>

          <section className={`${cardClass} p-5`}>
            <h3 className="text-sm font-semibold tracking-wide text-munity-text">Suggested Groups</h3>
            <div className="mt-4 flex flex-col gap-3">
              {suggestedGroups.map((group) => (
                <div key={group.id} className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#d9eaa3] text-sm font-bold text-[#161f00]"
                    >
                      {group.name.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-munity-text">{group.name}</p>
                      <p className="text-[11px] text-munity-muted">{group.membersLabel}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => mockStore.toggleMembership(group.id)}
                    className="shrink-0 rounded-full border border-munity-green/70 px-3 py-1.5 text-xs font-semibold text-munity-green transition hover:bg-munity-lime/40"
                  >
                    Join
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className={`${cardClass} p-5`}>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold tracking-wide text-munity-text">
                Available Therapists
              </h3>
              <Link
                href={routes.therapy}
                className="text-[11px] font-semibold text-munity-green hover:underline"
              >
                See all
              </Link>
            </div>
            <div className="mt-3 flex flex-col gap-1">
              {therapists.map((therapist, index) => (
                <Link
                  key={therapist.id}
                  href={therapyPath(therapist.id)}
                  className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-[#f5f3f3]"
                >
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={therapist.image}
                      alt={therapist.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-munity-text">
                      {therapist.name}
                    </p>
                    <p className="text-[11px] text-munity-muted">{therapist.specializations[0]}</p>
                  </div>
                  <span
                    className={`size-2.5 shrink-0 rounded-full ring-2 ring-white ${
                      index === 0 ? "bg-[#22c55e]" : "bg-[#fb923c]"
                    }`}
                    aria-label={index === 0 ? "online" : "away"}
                  />
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </MemberAppShell>
  );
}
