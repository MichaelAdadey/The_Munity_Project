"use client";

import Image from "next/image";
import { useRef, useState, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  ChevronDown,
  Flame,
  Heart,
  ImageIcon,
  MapPin,
  MessageCircle,
  Pencil,
  Share2,
  Upload,
} from "lucide-react";
import { MemberAppShell } from "@/components/memberlayout/MemberAppShell";
import { MunityLeafIcon } from "@/components/icons/MunityIcons";
import {
  LivePulse,
  liveFadeUp,
  liveStagger,
  useLiveToast,
} from "@/components/live/LiveFeedback";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMockStore } from "@/lib/mock-store";
import { useCurrentProfile } from "@/hooks/use-current-profile";
import {
  saveDailyReflection,
  setProfilePhotoUrl,
  updateProfile,
} from "@/lib/profile/actions";
import { uploadProfileImage } from "@/lib/profile/upload-image";
import { useMyPosts } from "@/lib/profile/posts-queries";
import { useMyCommunities } from "@/lib/communities/client-queries";
import { createPost } from "@/lib/feed/actions";
import { MOOD_LABEL_TO_DB } from "@/types/feed";

type ProfileTab = "My Posts" | "Communities" | "Saved Resources";
type PhotoTarget = "avatar" | "cover";

const avatarLibrary = [
  { id: "avatar", src: "/images/profile/avatar.jpg", label: "Default" },
  {
    id: "support-1",
    src: "/images/profile/support-1.jpg",
    label: "Warm light",
  },
  {
    id: "support-2",
    src: "/images/profile/support-2.jpg",
    label: "Soft focus",
  },
  { id: "support-3", src: "/images/profile/support-3.jpg", label: "Garden" },
  { id: "support-4", src: "/images/profile/support-4.jpg", label: "Calm" },
  { id: "elena", src: "/images/home-feed/elena.jpg", label: "Portrait" },
];

const coverLibrary = [
  { id: "cover", src: "/images/profile/cover.png", label: "Meadow" },
  {
    id: "forest",
    src: "/images/home-feed/forest-walk.png",
    label: "Forest walk",
  },
  { id: "stones", src: "/images/messages/media-stones.jpg", label: "Stones" },
  {
    id: "mindfulness",
    src: "/images/messages/mindfulness.jpg",
    label: "Mindfulness",
  },
  {
    id: "anxiety",
    src: "/images/resources/card-anxiety.png",
    label: "Soft green",
  },
  { id: "featured", src: "/images/resources/featured.png", label: "Horizon" },
];

function ProfileMedia({
  src,
  alt,
  className,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (src.startsWith("data:")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 size-full object-cover ${className ?? ""}`}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className ?? "object-cover"}
      sizes={sizes}
      priority={priority}
    />
  );
}

const moodWeek = [
  { day: "Mon", label: "Calm", value: 55 },
  { day: "Tue", label: "Steady", value: 62 },
  { day: "Wed", label: "Energetic", value: 78 },
  { day: "Thu", label: "Radiant", value: 88 },
  { day: "Fri", label: "Pensive", value: 48 },
  { day: "Sat", label: "Balanced", value: 70 },
  { day: "Sun", label: "Grateful", value: 82 },
];

const savedResources = [
  { id: "r1", title: "Morning Routine for Mental Clarity", type: "Guide" },
  { id: "r2", title: "5-4-3-2-1 Grounding Technique", type: "Exercise" },
  { id: "r3", title: "Journaling prompts for anxiety", type: "Worksheet" },
];

const supportAvatars = [
  "/images/profile/support-1.jpg",
  "/images/profile/support-2.jpg",
  "/images/profile/support-3.jpg",
  "/images/profile/support-4.jpg",
];

function MoodLineChart() {
  const width = 640;
  const height = 220;
  const padX = 24;
  const padY = 28;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const points = moodWeek.map((entry, index) => {
    const x = padX + (index / (moodWeek.length - 1)) * chartW;
    const y = padY + chartH - (entry.value / 100) * chartH;
    return { ...entry, x, y };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padY + chartH} L ${points[0].x} ${padY + chartH} Z`;

  return (
    <div className="relative h-64 w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full"
        role="img"
        aria-label="Mood history over the last 7 days"
      >
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = padY + chartH * ratio;
          return (
            <line
              key={ratio}
              x1={padX}
              x2={width - padX}
              y1={y}
              y2={y}
              stroke="#1b1c1c"
              strokeOpacity={0.08}
            />
          );
        })}
        <path d={areaPath} fill="rgba(62, 82, 25, 0.08)" />
        <path
          d={linePath}
          fill="none"
          stroke="#3e5219"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((point) => (
          <g key={point.day}>
            <circle
              cx={point.x}
              cy={point.y}
              r={5}
              fill="#d6e7a1"
              stroke="#3e5219"
              strokeWidth={2}
            />
            <title>{`${point.day}: ${point.label}`}</title>
          </g>
        ))}
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex justify-between px-2">
        {moodWeek.map((entry) => (
          <span
            key={entry.day}
            className="w-full text-center text-xs font-medium text-munity-muted"
          >
            {entry.day}
          </span>
        ))}
      </div>
    </div>
  );
}

export function MemberProfileView() {
  const store = useMockStore();
  const { flash } = useLiveToast();
  const {
    profile,
    loading: profileLoading,
    refresh: refreshProfile,
  } = useCurrentProfile();

  const [tab, setTab] = useState<ProfileTab>("My Posts");
  const [view, setView] = useState("Weekly View");
  const [editOpen, setEditOpen] = useState(false);
  const [photoTarget, setPhotoTarget] = useState<PhotoTarget | null>(null);
  const [reflectionOpen, setReflectionOpen] = useState(false);
  const [reflectionDraft, setReflectionDraft] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [savingReflection, setSavingReflection] = useState(false);

  const { posts: myPosts, loading: postsLoading } = useMyPosts(flash);
  const { joined: joinedCommunities, loading: communitiesLoading } =
    useMyCommunities(flash);

  if (profileLoading || !profile) {
    return (
      <MemberAppShell>
        <div className="mx-auto max-w-7xl">
          <div className="h-64 animate-pulse rounded-[20px] bg-munity-sidebar" />
        </div>
      </MemberAppShell>
    );
  }

  const coverSrc = profile.coverUrl || "/images/profile/cover.png";
  const avatarSrc = profile.avatarUrl || "/images/profile/avatar.png";
  const photoLibrary = photoTarget === "cover" ? coverLibrary : avatarLibrary;

  function openEdit() {
    setFirstName(profile!.firstName);
    setlastName(profile!.lastName);
    setUsername(profile!.username);
    setTitle(profile!.title);
    setBio(profile!.bio);
    setEditOpen(true);
  }

  async function saveProfile() {
    setSaving(true);
    try {
      const result = await updateProfile({
        firstName,
        lastName,
        username,
        title,
        bio,
      });
      if (result.error) {
        flash(result.error);
        return;
      }
      refreshProfile();
      setEditOpen(false);
      flash("Profile updated");
    } finally {
      setSaving(false);
    }
  }

  async function applyPhoto(src: string) {
    if (!photoTarget) return;
    setUploadingPhoto(true);
    try {
      const result = await setProfilePhotoUrl(photoTarget, src);
      if (result.error) {
        flash(result.error);
        return;
      }
      refreshProfile();
      flash(
        photoTarget === "avatar"
          ? "Profile photo updated"
          : "Cover photo updated",
      );
    } finally {
      setUploadingPhoto(false);
      setPhotoTarget(null);
    }
  }

  async function onPhotoFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !photoTarget) return;

    setUploadingPhoto(true);
    try {
      const result = await uploadProfileImage(file, photoTarget);
      if ("error" in result) {
        flash(result.error);
        return;
      }
      refreshProfile();
      flash(
        photoTarget === "avatar"
          ? "Profile photo updated"
          : "Cover photo updated",
      );
    } finally {
      setUploadingPhoto(false);
      setPhotoTarget(null);
    }
  }

  function openReflection() {
    setReflectionDraft(profile!.dailyReflection ?? "");
    setReflectionOpen(true);
  }

  async function handleSaveReflection(shareToFeed: boolean) {
    const text = reflectionDraft.trim();
    if (!text) {
      flash("Write a few words before saving");
      return;
    }
    setSavingReflection(true);
    try {
      const result = await saveDailyReflection(text);
      if (result.error) {
        flash(result.error);
        return;
      }
      refreshProfile();

      if (shareToFeed) {
        const postResult = await createPost({
          content: `Daily reflection: ${text}`,
          mood: MOOD_LABEL_TO_DB["Calm"],
          isAnonymous: false,
        });
        if (postResult.error) {
          // Reflection itself saved fine — only the share step failed
          flash(`Reflection saved, but sharing failed: ${postResult.error}`);
          setReflectionOpen(false);
          return;
        }
        flash("Reflection saved and shared to Home");
      } else {
        flash("Reflection saved");
      }
      setReflectionOpen(false);
    } finally {
      setSavingReflection(false);
    }
  }

  return (
    <MemberAppShell>
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onPhotoFile}
      />
      <motion.div
        initial="hidden"
        animate="show"
        variants={liveStagger}
        className="mx-auto flex max-w-7xl flex-col gap-8"
      >
        {/* Profile hero */}
        <motion.section
          variants={liveFadeUp}
          className="overflow-hidden rounded-[20px] bg-munity-divider shadow-sm"
        >
          <div className="group relative h-48 w-full md:h-64">
            <ProfileMedia
              src={coverSrc}
              alt=""
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
            <button
              type="button"
              onClick={() => setPhotoTarget("cover")}
              className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-xl bg-black/45 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-black/60 md:opacity-0 md:group-hover:opacity-100"
            >
              <Camera className="size-3.5" />
              Change cover
            </button>
          </div>

          <div className="relative px-6 pb-6 pt-20">
            <div className="absolute left-6 top-0 -translate-y-1/2">
              <div className="group/avatar relative size-28 md:size-32">
                <div className="relative size-full overflow-hidden rounded-full border-4 border-munity-bg bg-white shadow-xl">
                  <ProfileMedia
                    src={avatarSrc}
                    alt={profile.fullName}
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setPhotoTarget("avatar")}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 text-white opacity-100 transition hover:bg-black/55 md:opacity-0 md:group-hover/avatar:opacity-100"
                  aria-label="Change profile photo"
                >
                  <span className="inline-flex flex-col items-center gap-1 text-[10px] font-semibold tracking-wide">
                    <Camera className="size-5" />
                    Edit
                  </span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-munity-green md:text-[32px] md:leading-[1.2]">
                  {profile.fullName}
                </h1>
                <p className="mt-1 flex items-center gap-2 text-base text-munity-muted">
                  <MapPin className="size-3.5" />@{profile.username}
                </p>
                <p className="mt-1 text-sm font-medium text-munity-olive-text">
                  {profile.title || "Munity member"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openEdit}
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-munity-green px-6 text-sm font-semibold tracking-wide text-white transition hover:bg-munity-green-dark"
                >
                  <Pencil className="size-3.5" />
                  Edit Profile
                </button>
                <button
                  type="button"
                  onClick={() => flash("Profile link copied")}
                  aria-label="Share profile"
                  className="flex size-11 items-center justify-center rounded-xl bg-munity-lime text-munity-olive-text transition hover:brightness-95"
                >
                  <Share2 className="size-4" />
                </button>
              </div>
            </div>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-munity-text">
              {profile.bio || "No bio yet — tap Edit Profile to add one."}
            </p>
          </div>
        </motion.section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          {/* Left column */}
          <div className="flex flex-col gap-6 xl:col-span-8">
            <section className="rounded-[20px] border border-[rgba(197,200,184,0.3)] bg-white p-6 shadow-[0px_4px_10px_rgba(85,107,47,0.05)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold text-munity-green">
                    Mood History
                  </h2>
                  <p className="mt-1 text-xs font-medium text-munity-muted">
                    Your emotional journey over the last 7 days
                  </p>
                </div>
                <div className="relative">
                  <select
                    value={view}
                    onChange={(e) => setView(e.target.value)}
                    className="appearance-none rounded-lg bg-[#efeded] py-2 pl-3 pr-9 text-xs font-medium text-munity-green outline-none"
                    aria-label="Mood history range"
                  >
                    <option>Weekly View</option>
                    <option>Monthly View</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-munity-green" />
                </div>
              </div>
              <div className="mt-8">
                <MoodLineChart />
              </div>
            </section>

            <section className="overflow-hidden rounded-[20px] border border-[rgba(197,200,184,0.3)] bg-white shadow-[0px_4px_20px_rgba(85,107,47,0.05)]">
              <div className="flex border-b border-[rgba(197,200,184,0.3)]">
                {(
                  ["My Posts", "Communities", "Saved Resources"] as ProfileTab[]
                ).map((item) => {
                  const active = tab === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setTab(item)}
                      className={`flex-1 px-4 py-4 text-sm font-semibold tracking-wide transition ${
                        active
                          ? "border-b-2 border-munity-green text-munity-green"
                          : "text-munity-muted hover:text-munity-green"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-4 p-6">
                {tab === "My Posts" ? (
                  postsLoading ? (
                    <p className="text-sm text-munity-muted">
                      Loading your posts...
                    </p>
                  ) : myPosts.length === 0 ? (
                    <p className="text-sm text-munity-muted">
                      You haven&apos;t posted yet.
                    </p>
                  ) : (
                    myPosts.map((post) => (
                      <article
                        key={post.id}
                        className="flex flex-col gap-2 rounded-2xl border border-[rgba(197,200,184,0.2)] bg-munity-sidebar p-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="rounded-full bg-munity-lime px-3 py-1 text-xs font-medium text-munity-olive-text">
                            {post.communityName ?? "Patient Feed"}
                          </span>
                          <span className="text-xs font-medium text-munity-muted/60">
                            {post.time}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold tracking-wide text-munity-green">
                          {post.feeling}
                        </h3>
                        <p className="line-clamp-2 text-base leading-relaxed text-munity-muted">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-4 pt-2 text-xs font-medium text-munity-muted">
                          <span className="inline-flex items-center gap-1.5">
                            <Heart className="size-3.5" />
                            {post.supports}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <MessageCircle className="size-3.5" />
                            {post.comments}
                          </span>
                        </div>
                      </article>
                    ))
                  )
                ) : null}

                {tab === "Communities" ? (
                  communitiesLoading ? (
                    <p className="text-sm text-munity-muted">
                      Loading your communities...
                    </p>
                  ) : joinedCommunities.length === 0 ? (
                    <p className="text-sm text-munity-muted">
                      You haven&apos;t joined any communities yet.
                    </p>
                  ) : (
                    joinedCommunities.map((community) => (
                      <div
                        key={community.name}
                        className="flex items-center justify-between rounded-2xl border border-[rgba(197,200,184,0.2)] bg-munity-sidebar px-5 py-4"
                      >
                        <div>
                          <p className="text-sm font-semibold text-munity-green">
                            {community.name}
                          </p>
                          <p className="mt-1 text-xs text-munity-muted">
                            Member
                          </p>
                        </div>
                        <p className="text-xs font-medium text-munity-muted">
                          {community.membersLabel}
                        </p>
                      </div>
                    ))
                  )
                ) : null}

                {tab === "Saved Resources"
                  ? savedResources
                      .filter((resource) =>
                        store.savedResourceIds.includes(resource.id),
                      )
                      .map((resource) => (
                        <div
                          key={resource.title}
                          className="flex items-center justify-between rounded-2xl border border-[rgba(197,200,184,0.2)] bg-munity-sidebar px-5 py-4"
                        >
                          <p className="text-sm font-semibold text-munity-green">
                            {resource.title}
                          </p>
                          <span className="rounded-full bg-munity-lime px-3 py-1 text-xs font-medium text-munity-olive-text">
                            {resource.type}
                          </span>
                        </div>
                      ))
                  : null}
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6 xl:col-span-4">
            <section className="relative overflow-hidden rounded-3xl bg-munity-green p-8 text-center shadow-xl">
              <div className="absolute -right-12 -top-12 size-32 rounded-full bg-[rgba(214,231,161,0.2)] blur-2xl" />
              <Flame
                className="mx-auto size-12 text-munity-lime"
                fill="currentColor"
              />
              <p className="mt-4 text-5xl font-bold tracking-[-0.96px] text-white">
                {store.profile.dayStreak}
              </p>
              <p className="mt-1 text-sm font-semibold uppercase tracking-[1.4px] text-white/80">
                Day Wellness Streak
              </p>
              <div className="mt-3">
                <LivePulse label="Streak active" />
              </div>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/20">
                <div className="h-full w-4/5 rounded-full bg-munity-lime shadow-[0_0_15px_rgba(214,231,161,0.5)]" />
              </div>
              <p className="mt-4 text-xs font-medium leading-relaxed text-white/70">
                Only 7 days left to reach your Monthly Goal!
              </p>
            </section>

            <section className="flex flex-col gap-4 rounded-[20px] bg-[#eae8e7] p-6">
              <div className="flex items-center gap-2">
                <MunityLeafIcon className="size-5 text-munity-green" />
                <h3 className="text-sm font-semibold tracking-wide text-munity-green">
                  Daily Prompt
                </h3>
              </div>
              <p className="text-base italic leading-relaxed text-munity-muted">
                &ldquo;What is one small win you achieved today, even if it
                feels insignificant?&rdquo;
              </p>
              {profile.dailyReflection ? (
                <div className="rounded-xl border border-munity-green/20 bg-munity-bg p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-munity-green">
                    Your reflection
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-munity-text">
                    {profile.dailyReflection}
                  </p>
                </div>
              ) : null}
              <button
                type="button"
                onClick={openReflection}
                className="rounded-xl border border-munity-input-border bg-munity-bg py-3 text-sm font-semibold tracking-wide text-munity-text transition hover:bg-white"
              >
                {profile.dailyReflection
                  ? "Edit Reflection"
                  : "Write Reflection"}
              </button>
            </section>

            <section className="rounded-[20px] border border-[rgba(197,200,184,0.3)] bg-munity-sidebar p-6">
              <h3 className="text-sm font-semibold tracking-wide text-munity-text">
                Mutual Support
              </h3>
              <div className="mt-4 flex items-center">
                {supportAvatars.map((src, index) => (
                  <div
                    key={src}
                    className="relative size-10 overflow-hidden rounded-full border-2 border-munity-bg"
                    style={{
                      marginLeft: index === 0 ? 0 : -12,
                      zIndex: supportAvatars.length - index,
                    }}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                ))}
                <div
                  className="relative z-0 flex size-10 items-center justify-center rounded-full border-2 border-munity-bg bg-munity-olive text-xs font-bold text-munity-lime-light"
                  style={{ marginLeft: -12 }}
                >
                  +12
                </div>
              </div>
              <p className="mt-4 text-xs font-medium leading-relaxed text-munity-muted">
                You and 16 others are supporting each other this week.
              </p>
            </section>
          </div>
        </div>

        <footer className="mt-2 border-t border-[rgba(197,200,184,0.1)] bg-munity-divider px-6 py-8 md:-mx-2 md:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-bold tracking-wide text-munity-text">
                Munity Peer Support
              </p>
              <p className="mt-1 max-w-xs text-xs font-medium leading-relaxed text-munity-muted">
                © {new Date().getFullYear()} Munity Peer Support. For
                emergencies, contact local crisis services immediately.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs font-medium text-munity-muted">
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
          </div>
        </footer>
      </motion.div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent
          className="border border-[#d8dbcf] bg-white shadow-2xl ring-1 ring-black/5 sm:max-w-md"
          showCloseButton
        >
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Update how you appear across Munity. Changes save in this preview.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setEditOpen(false);
                  setPhotoTarget("avatar");
                }}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-munity-input-border bg-white px-3 py-2.5 text-sm font-semibold text-munity-text transition hover:bg-[#f3f4ee]"
              >
                <Camera className="size-4" />
                Photo
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditOpen(false);
                  setPhotoTarget("cover");
                }}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-munity-input-border bg-white px-3 py-2.5 text-sm font-semibold text-munity-text transition hover:bg-[#f3f4ee]"
              >
                <ImageIcon className="size-4" />
                Cover
              </button>
            </div>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold tracking-wide text-munity-muted">
                First name
              </span>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-xl border border-munity-input-border bg-white px-3 py-2.5 text-sm text-munity-text outline-none ring-munity-green/30 focus:ring-2"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold tracking-wide text-munity-muted">
                Last name
              </span>
              <input
                value={lastName}
                onChange={(e) => setlastName(e.target.value)}
                className="w-full rounded-xl border border-munity-input-border bg-white px-3 py-2.5 text-sm text-munity-text outline-none ring-munity-green/30 focus:ring-2"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold tracking-wide text-munity-muted">
                Username
              </span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-munity-input-border bg-white px-3 py-2.5 text-sm text-munity-text outline-none ring-munity-green/30 focus:ring-2"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold tracking-wide text-munity-muted">
                Title
              </span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Daily Mindful Warrior"
                className="w-full rounded-xl border border-munity-input-border bg-white px-3 py-2.5 text-sm text-munity-text outline-none ring-munity-green/30 placeholder:text-munity-muted/70 focus:ring-2"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold tracking-wide text-munity-muted">
                Bio
              </span>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-xl border border-munity-input-border bg-white px-3 py-2.5 text-sm text-munity-text outline-none ring-munity-green/30 focus:ring-2"
              />
            </label>
          </div>
          <DialogFooter className="border-munity-border bg-[#f3f4ee]">
            <button
              type="button"
              onClick={() => setEditOpen(false)}
              className="rounded-xl border-2 border-munity-gray bg-white px-4 py-2.5 text-sm font-semibold text-munity-text shadow-sm transition hover:bg-[#eceee6]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void saveProfile()}
              disabled={saving}
              className="rounded-xl bg-munity-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-munity-green-dark disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={photoTarget !== null}
        onOpenChange={(open) => {
          if (!open) setPhotoTarget(null);
        }}
      >
        <DialogContent
          className="border border-[#d8dbcf] bg-white shadow-2xl ring-1 ring-black/5 sm:max-w-md"
          showCloseButton
        >
          <DialogHeader>
            <DialogTitle>
              {photoTarget === "cover"
                ? "Change cover photo"
                : "Change profile photo"}
            </DialogTitle>
            <DialogDescription>
              Upload from your device or pick a demo image for this preview.
            </DialogDescription>
          </DialogHeader>
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            disabled={uploadingPhoto}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-munity-green px-4 py-3 text-sm font-semibold text-white transition hover:bg-munity-green-dark disabled:opacity-60"
          >
            <Upload className="size-4" />
            {uploadingPhoto ? "Uploading..." : "Upload from device"}
          </button>
          <div className="grid grid-cols-3 gap-3">
            {photoLibrary.map((item) => {
              const selected =
                photoTarget === "cover"
                  ? coverSrc === item.src
                  : avatarSrc === item.src;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => void applyPhoto(item.src)}
                  disabled={uploadingPhoto}
                  className={`overflow-hidden rounded-xl border-2 text-left transition disabled:opacity-50 ${
                    selected
                      ? "border-munity-green ring-2 ring-munity-green/20"
                      : "border-transparent hover:border-munity-green/40"
                  }`}
                >
                  <div className="relative aspect-square w-full">
                    <Image
                      src={item.src}
                      alt={item.label}
                      fill
                      className="object-cover"
                      sizes="120px"
                    />
                  </div>
                  <p className="bg-[#f7f6f2] px-2 py-1.5 text-[11px] font-medium text-munity-muted">
                    {item.label}
                  </p>
                </button>
              );
            })}
          </div>
          <DialogFooter className="border-munity-border bg-[#f3f4ee]">
            <button
              type="button"
              onClick={() => setPhotoTarget(null)}
              className="rounded-xl border-2 border-munity-gray bg-white px-4 py-2.5 text-sm font-semibold text-munity-text shadow-sm transition hover:bg-[#eceee6]"
            >
              Cancel
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={reflectionOpen} onOpenChange={setReflectionOpen}>
        <DialogContent
          className="border border-[#d8dbcf] bg-white shadow-2xl ring-1 ring-black/5 sm:max-w-md"
          showCloseButton
        >
          <DialogHeader>
            <DialogTitle>Write reflection</DialogTitle>
            <DialogDescription>
              What is one small win you achieved today, even if it feels
              insignificant?
            </DialogDescription>
          </DialogHeader>
          <textarea
            value={reflectionDraft}
            onChange={(e) => setReflectionDraft(e.target.value)}
            rows={5}
            placeholder="Today I…"
            className="w-full resize-none rounded-xl border border-munity-input-border bg-white px-3 py-2.5 text-sm text-munity-text outline-none ring-munity-green/30 placeholder:text-munity-muted/70 focus:ring-2"
          />
          <DialogFooter className="border-munity-border bg-[#f3f4ee]">
            <button
              type="button"
              onClick={() => setReflectionOpen(false)}
              className="rounded-xl border-2 border-munity-gray bg-white px-4 py-2.5 text-sm font-semibold text-munity-text shadow-sm transition hover:bg-[#eceee6]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleSaveReflection(false)}
              disabled={savingReflection}
              className="rounded-xl border border-munity-green bg-white px-4 py-2.5 text-sm font-semibold text-munity-green transition hover:bg-munity-lime/30"
            >
              {savingReflection ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => void handleSaveReflection(true)}
              disabled={savingReflection}
              className="rounded-xl bg-munity-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-munity-green-dark"
            >
              {savingReflection ? "Sharing..." : "Save & share"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MemberAppShell>
  );
}
