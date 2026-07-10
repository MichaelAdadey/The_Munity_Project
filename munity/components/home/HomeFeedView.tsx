"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Bell,
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
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/home" },
  { label: "Communities", href: "/Communities" },
  { label: "Resources", href: "/resources" },
  { label: "Therapy", href: "/Therapy" },
];

const communities = [
  { letter: "A", name: "Anxiety Support", meta: "12 new posts", bg: "bg-[#d6e7a1]", text: "text-[#5a682f]" },
  { letter: "M", name: "Meditation Circle", meta: "5 new posts", bg: "bg-[#e4e4cc]", text: "text-[#1b1d0e]" },
  { letter: "N", name: "Night Owls", meta: "Just now", bg: "bg-[#d2eca2]", text: "text-[#131f00]" },
];

const moods = [
  { label: "Happy", emoji: "😊", bg: "bg-[#fef9c3]" },
  { label: "Calm", emoji: "😌", bg: "bg-[#dcfce7]" },
  { label: "Stressed", emoji: "😫", bg: "bg-[#ffedd5]" },
  { label: "Sad", emoji: "😢", bg: "bg-[#dbeafe]" },
  { label: "Anxious", emoji: "😰", bg: "bg-[#f3e8ff]" },
];

const suggestedGroups = [
  { letter: "S", name: "Sleep Hygiene", members: "2.4k members", bg: "bg-[#d9eaa3]", text: "text-[#161f00]" },
  { letter: "C", name: "CBT Basics", members: "8.1k members", bg: "bg-[#c8c8b0]", text: "text-[#1b1d0e]" },
];

const therapists = [
  {
    name: "Dr. Elena Thorne",
    specialty: "Cognitive Behavioral",
    avatar: "/images/home-feed/elena.jpg",
    status: "online" as const,
  },
  {
    name: "Mark Wilson, LCSW",
    specialty: "Peer Specialist",
    avatar: "/images/home-feed/mark.jpg",
    status: "busy" as const,
  },
];

const feedPosts = [
  {
    id: "1",
    anonymous: true,
    author: "Anonymous Warrior",
    time: "2h ago",
    feeling: "Feeling Anxious 😰",
    content:
      "Today was tough. I felt like I couldn't breathe during my meeting, but I remembered the grounding technique I learned here last week. 5-4-3-2-1. It actually worked. Just wanted to share that progress is possible even on hard days.",
    supports: 42,
    comments: 8,
    image: null as string | null,
    accent: true,
  },
  {
    id: "2",
    anonymous: false,
    author: "Sarah Jenkins",
    time: "5h ago",
    feeling: "Feeling Calm 😌",
    content:
      "Finally took a morning walk without my phone. The silence was intimidating at first, but then it became peaceful. Highly recommend a digital detox for just 30 minutes. 🌿",
    supports: 128,
    comments: 24,
    image: "/images/home-feed/forest-walk.png",
    accent: false,
  },
];

function HomeTopNav() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-munity-border/60 bg-munity-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 lg:px-10">
        <div className="flex items-center gap-8">
          <Link href="/home" className="text-2xl font-bold text-munity-green">
            Munity
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => {
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
          <button
            type="button"
            className="rounded-full p-2 text-munity-muted transition hover:bg-white hover:text-munity-green"
            aria-label="Notifications"
          >
            <Bell className="size-5" />
          </button>
          <Link href="/profile" className="relative size-9 overflow-hidden rounded-full border-2 border-munity-lime">
            <Image src="/images/home-feed/alex.jpg" alt="Alex Rivera" fill className="object-cover" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function HomeFeedView() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showMoods, setShowMoods] = useState(true);

  return (
    <div className="min-h-screen bg-munity-bg">
      <HomeTopNav />

      <main className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 px-6 pb-16 pt-24 lg:grid-cols-12 lg:gap-6 lg:px-10">
        {/* Left sidebar */}
        <aside className="flex flex-col gap-6 lg:col-span-3">
          <section className="rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full border-4 border-munity-lime p-2">
                <div className="relative size-16 overflow-hidden rounded-full">
                  <Image src="/images/home-feed/alex.jpg" alt="Alex Rivera" fill className="object-cover" />
                </div>
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-munity-text">Alex Rivera</h2>
              <p className="mt-1 text-xs font-medium text-munity-muted">Daily Mindful Warrior</p>
              <div className="mt-4 flex w-full gap-2">
                <div className="flex-1 rounded-xl bg-[#efeded] px-3 py-3 text-center">
                  <p className="text-sm font-semibold text-munity-green">12</p>
                  <p className="text-xs font-medium text-munity-muted">Day Streak</p>
                </div>
                <div className="flex-1 rounded-xl bg-[#efeded] px-3 py-3 text-center">
                  <p className="text-sm font-semibold text-munity-green">4</p>
                  <p className="text-xs font-medium text-munity-muted">Groups</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_20px_rgba(85,107,47,0.05)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-wide text-munity-text">Your Communities</h3>
              <button type="button" className="text-munity-green" aria-label="Add community">
                <Plus className="size-4" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {communities.map((community) => (
                <button
                  key={community.name}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:bg-munity-bg"
                >
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-base font-bold ${community.bg} ${community.text}`}
                  >
                    {community.letter}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold tracking-wide text-munity-text">
                      {community.name}
                    </span>
                    <span className="block text-xs font-medium text-munity-muted">{community.meta}</span>
                  </span>
                </button>
              ))}
            </div>
            <Link
              href="/Communities"
              className="mt-4 block text-center text-xs font-medium text-munity-green hover:underline"
            >
              View all communities
            </Link>
          </section>
        </aside>

        {/* Center feed */}
        <section className="flex flex-col gap-6 lg:col-span-6">
          <div className="rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
            <div className="flex gap-4">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-full">
                <Image src="/images/home-feed/alex.jpg" alt="Alex Rivera" fill className="object-cover" />
              </div>
              <textarea
                placeholder="What's on your mind, Alex?"
                className="min-h-[100px] w-full resize-none rounded-2xl bg-[#f5f3f3] px-4 py-4 text-base text-munity-text outline-none placeholder:text-munity-muted/50 focus:ring-2 focus:ring-munity-green/15"
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setShowMoods((value) => !value)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#efeded] px-4 py-2 text-xs font-medium text-munity-muted transition hover:bg-munity-lime/40"
                >
                  <Smile className="size-3.5" />
                  Mood
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-[#efeded] px-4 py-2 text-xs font-medium text-munity-muted transition hover:bg-munity-lime/40"
                >
                  <ImageIcon className="size-3.5" />
                  Photo
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-[#efeded] px-4 py-2 text-xs font-medium text-munity-muted transition hover:bg-munity-lime/40"
                >
                  <UserRound className="size-3.5" />
                  Anonymous
                </button>
              </div>
              <button
                type="button"
                className="rounded-full bg-munity-green px-8 py-2.5 text-sm font-semibold tracking-wide text-white shadow-sm transition hover:bg-munity-green-dark"
              >
                Post
              </button>
            </div>

            {showMoods ? (
              <div className="mt-6 flex items-start justify-between rounded-2xl border border-munity-input-border/30 bg-munity-bg p-4">
                {moods.map((mood) => (
                  <button
                    key={mood.label}
                    type="button"
                    onClick={() => setSelectedMood(mood.label)}
                    className={`flex flex-col items-center gap-1 rounded-xl px-1 py-1 transition ${
                      selectedMood === mood.label ? "ring-2 ring-munity-green/30" : ""
                    }`}
                  >
                    <span className={`flex size-10 items-center justify-center rounded-full text-xl ${mood.bg}`}>
                      {mood.emoji}
                    </span>
                    <span className="text-xs font-medium text-munity-muted">{mood.label}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {feedPosts.map((post) => (
            <article
              key={post.id}
              className={`rounded-[20px] border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)] ${
                post.accent
                  ? "border-l-4 border-munity-border border-l-munity-green"
                  : "border-munity-border"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {post.anonymous ? (
                    <div className="flex size-10 items-center justify-center rounded-full bg-[#e4e2e2] text-munity-muted">
                      <UserRound className="size-5" />
                    </div>
                  ) : (
                    <div className="relative size-10 overflow-hidden rounded-full">
                      <Image src="/images/home-feed/sarah.jpg" alt={post.author} fill className="object-cover" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold tracking-wide text-munity-text">{post.author}</p>
                    <div className="mt-0.5 flex items-center gap-2 text-xs font-medium text-munity-muted">
                      <span>{post.time}</span>
                      <span className="size-1 rounded-full bg-munity-input-border" />
                      <span className="text-[#56642b]">{post.feeling}</span>
                    </div>
                  </div>
                </div>
                <button type="button" className="text-munity-muted" aria-label="Post options">
                  <MoreHorizontal className="size-4" />
                </button>
              </div>

              <p className="mt-4 text-base leading-relaxed text-munity-text">{post.content}</p>

              {post.image ? (
                <div className="relative mt-4 h-64 w-full overflow-hidden rounded-2xl">
                  <Image src={post.image} alt="Post attachment" fill className="object-cover" />
                </div>
              ) : null}

              <div className="mt-4 flex items-center justify-between border-t border-munity-input-border/20 pt-4">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-munity-muted transition hover:text-munity-green"
                  >
                    <Heart className="size-4" />
                    {post.supports}
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-munity-muted transition hover:text-munity-green"
                  >
                    <MessageCircle className="size-4" />
                    {post.comments}
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-munity-muted transition hover:text-munity-green"
                    aria-label="Share"
                  >
                    <Share2 className="size-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Right sidebar */}
        <aside className="flex flex-col gap-6 lg:col-span-3">
          <section className="relative overflow-hidden rounded-[20px] border border-munity-border bg-munity-olive p-6 shadow-[0_4px_20px_rgba(85,107,47,0.05)]">
            <div className="pointer-events-none absolute -bottom-8 -right-8 size-32 rounded-full bg-[#d0eba1]/10 blur-xl" />
            <div className="relative">
              <div className="flex items-center gap-2">
                <Lightbulb className="size-4 text-munity-lime-light" />
                <h3 className="text-sm font-semibold uppercase tracking-[0.7px] text-munity-lime-light">
                  Mindful Moment
                </h3>
              </div>
              <p className="mt-3 text-base italic leading-relaxed text-munity-lime-light">
                &ldquo;Box breathing: Inhale for 4, Hold for 4, Exhale for 4, Hold for 4. Repeat until you feel
                grounded.&rdquo;
              </p>
              <button
                type="button"
                className="mt-3 text-xs font-medium text-munity-lime-light underline underline-offset-2"
              >
                Try it now
              </button>
            </div>
          </section>

          <section className="rounded-[20px] border border-munity-border bg-white px-6 py-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
            <h3 className="text-sm font-semibold tracking-wide text-munity-text">Suggested Groups</h3>
            <div className="mt-4 flex flex-col gap-4">
              {suggestedGroups.map((group) => (
                <div key={group.name} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded-full text-base font-bold ${group.bg} ${group.text}`}
                    >
                      {group.letter}
                    </span>
                    <div>
                      <p className="text-xs font-medium text-munity-text">{group.name}</p>
                      <p className="text-[10px] text-munity-muted">{group.members}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="rounded-full border border-munity-green px-3 py-1 text-xs font-medium text-munity-green transition hover:bg-munity-lime/40"
                  >
                    Join
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-wide text-munity-text">Available Therapists</h3>
              <Link href="/Therapy" className="text-[10px] text-munity-green hover:underline">
                See all
              </Link>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              {therapists.map((therapist) => (
                <div
                  key={therapist.name}
                  className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-munity-bg"
                >
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
                    <Image src={therapist.avatar} alt={therapist.name} fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-munity-text">{therapist.name}</p>
                    <p className="text-[10px] text-munity-muted">{therapist.specialty}</p>
                  </div>
                  <span
                    className={`size-2 shrink-0 rounded-full ${
                      therapist.status === "online" ? "bg-[#22c55e]" : "bg-[#fb923c]"
                    }`}
                    aria-label={therapist.status}
                  />
                </div>
              ))}
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}
