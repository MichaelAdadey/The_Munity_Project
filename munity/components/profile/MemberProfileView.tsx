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
import { LivePulse, liveFadeUp, liveStagger, useLiveToast } from "@/components/live/LiveFeedback";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mockStore, useMockStore } from "@/lib/mock-store";
import { createClient } from "@/lib/supabase/client";
import { ImageLightbox } from "@/components/ui/image-lightbox";
import { PROFILE_UPDATED_EVENT } from "@/hooks/use-current-profile";

type ProfileTab = "My Posts" | "Communities" | "Saved Resources";
type PhotoTarget = "avatar" | "cover";

const avatarLibrary = [
  { id: "avatar", src: "/images/profile/avatar.jpg", label: "Default" },
  { id: "support-1", src: "/images/profile/support-1.jpg", label: "Warm light" },
  { id: "support-2", src: "/images/profile/support-2.jpg", label: "Soft focus" },
  { id: "support-3", src: "/images/profile/support-3.jpg", label: "Garden" },
  { id: "support-4", src: "/images/profile/support-4.jpg", label: "Calm" },
  { id: "elena", src: "/images/home-feed/elena.jpg", label: "Portrait" },
];

const coverLibrary = [
  { id: "cover", src: "/images/profile/cover.png", label: "Meadow" },
  { id: "forest", src: "/images/home-feed/forest-walk.png", label: "Forest walk" },
  { id: "stones", src: "/images/messages/media-stones.jpg", label: "Stones" },
  { id: "mindfulness", src: "/images/messages/mindfulness.jpg", label: "Mindfulness" },
  { id: "anxiety", src: "/images/resources/card-anxiety.png", label: "Soft green" },
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
      <img src={src} alt={alt} className={`absolute inset-0 size-full object-cover ${className ?? ""}`} />
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
            <circle cx={point.x} cy={point.y} r={5} fill="#d6e7a1" stroke="#3e5219" strokeWidth={2} />
            <title>{`${point.day}: ${point.label}`}</title>
          </g>
        ))}
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex justify-between px-2">
        {moodWeek.map((entry) => (
          <span key={entry.day} className="w-full text-center text-xs font-medium text-munity-muted">
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
  const [tab, setTab] = useState<ProfileTab>("My Posts");
  const [view, setView] = useState("Weekly View");
  const [editOpen, setEditOpen] = useState(false);
  const [photoTarget, setPhotoTarget] = useState<PhotoTarget | null>(null);
  const [reflectionOpen, setReflectionOpen] = useState(false);
  const [reflectionDraft, setReflectionDraft] = useState("");
  const [fullName, setFullName] = useState(store.profile.fullName);
  const [username, setUsername] = useState(store.profile.username);
  const [title, setTitle] = useState(store.profile.title);
  const [bio, setBio] = useState(store.profile.bio);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarViewerOpen, setAvatarViewerOpen] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const coverSrc = store.profile.cover || "/images/profile/cover.png";
  const photoLibrary = photoTarget === "cover" ? coverLibrary : avatarLibrary;

  async function persistAvatarUrl(url: string) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("profiles").update({ avatar_url: url }).eq("id", user.id);
    window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
  }

  function openEdit() {
    setFullName(store.profile.fullName);
    setUsername(store.profile.username);
    setTitle(store.profile.title);
    setBio(store.profile.bio);
    setEditOpen(true);
  }

  function saveProfile() {
    const nextName = fullName.trim() || store.profile.fullName;
    const nextUsername = username.trim().replace(/^@/, "") || store.profile.username;
    mockStore.updateProfile({
      fullName: nextName,
      username: nextUsername,
      title: title.trim() || store.profile.title,
      bio: bio.trim() || store.profile.bio,
    });
    mockStore.updateSettings({ displayName: nextName });
    setEditOpen(false);
    flash("Profile updated");
  }

  function applyPhoto(src: string) {
    if (!photoTarget) return;
    if (photoTarget === "avatar") {
      mockStore.updateProfile({ avatar: src });
      flash("Profile photo updated");
      void persistAvatarUrl(src);
    } else {
      mockStore.updateProfile({ cover: src });
      flash("Cover photo updated");
    }
    setPhotoTarget(null);
  }

  async function onPhotoFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !photoTarget) return;
    if (!file.type.startsWith("image/")) {
      flash("Please choose an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      flash("Image must be under 5MB.");
      return;
    }

    if (photoTarget === "avatar") {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setIsUploadingAvatar(true);
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${user.id}/avatar-${Date.now()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });

        if (uploadError) {
          setIsUploadingAvatar(false);
          flash(`Upload failed: ${uploadError.message}`);
          return;
        }

        const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(path);
        setIsUploadingAvatar(false);
        applyPhoto(publicUrlData.publicUrl);
        return;
      }
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") applyPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function openReflection() {
    setReflectionDraft(store.dailyReflection ?? "");
    setReflectionOpen(true);
  }

  function saveReflection(shareToFeed: boolean) {
    const text = reflectionDraft.trim();
    if (!text) {
      flash("Write a few words before saving");
      return;
    }
    mockStore.saveDailyReflection(text);
    if (shareToFeed) {
      mockStore.createPost({
        content: `Daily reflection: ${text}`,
        feeling: "Grateful",
        anonymous: false,
      });
      flash("Reflection saved and shared to Home");
    } else {
      flash("Reflection saved");
    }
    setReflectionOpen(false);
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
      <motion.div initial="hidden" animate="show" variants={liveStagger} className="mx-auto flex max-w-[1280px] flex-col gap-8">
        {/* Profile hero */}
        <motion.section variants={liveFadeUp} className="overflow-hidden rounded-[20px] bg-[#e4e2e2] shadow-sm">
          <div className="group relative h-48 w-full md:h-64">
            <ProfileMedia
              src={coverSrc}
              alt=""
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
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
                <button
                  type="button"
                  onClick={() => setAvatarViewerOpen(true)}
                  aria-label="View profile photo"
                  className="relative size-full cursor-zoom-in overflow-hidden rounded-full border-4 border-[#fbf9f8] bg-white shadow-xl"
                >
                  <ProfileMedia
                    src={store.profile.avatar}
                    alt={store.profile.fullName}
                    className="object-cover"
                    sizes="128px"
                  />
                  <div className="absolute inset-0 bg-black/0 transition group-hover/avatar:bg-black/10" />
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoTarget("avatar")}
                  aria-label="Change profile photo"
                  className="absolute -bottom-1 -right-1 flex size-9 items-center justify-center rounded-full border-2 border-[#fbf9f8] bg-munity-green text-white shadow-md transition hover:bg-munity-green-dark"
                >
                  <Camera className="size-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-munity-green md:text-[32px] md:leading-[1.2]">
                  {store.profile.fullName}
                </h1>
                <p className="mt-1 flex items-center gap-2 text-base text-munity-muted">
                  <MapPin className="size-3.5" />
                  @{store.profile.username.replace(/^@/, "")}
                </p>
                <p className="mt-1 text-sm font-medium text-munity-olive-text">
                  {store.profile.title}
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
              {store.profile.bio}
            </p>
          </div>
        </motion.section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          {/* Left column */}
          <div className="flex flex-col gap-6 xl:col-span-8">
            <section className="rounded-[20px] border border-[rgba(197,200,184,0.3)] bg-white p-6 shadow-[0px_4px_10px_rgba(85,107,47,0.05)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold text-munity-green">Mood History</h2>
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
                {(["My Posts", "Communities", "Saved Resources"] as ProfileTab[]).map((item) => {
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
                {tab === "My Posts"
                  ? store.posts
                      .filter((post) => post.authorId === "me" || post.author === store.profile.fullName)
                      .map((post) => (
                      <article
                        key={post.id}
                        className="flex flex-col gap-2 rounded-2xl border border-[rgba(197,200,184,0.2)] bg-[#f5f3f3] p-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span
                            className="rounded-full bg-munity-lime px-3 py-1 text-xs font-medium text-munity-olive-text"
                          >
                            {post.communityName ?? post.feeling}
                          </span>
                          <span className="text-xs font-medium text-munity-muted/60">{post.time}</span>
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
                  : null}

                {tab === "Communities"
                  ? store.communities
                      .filter((community) => store.memberships.includes(community.id))
                      .map((community) => (
                      <div
                        key={community.name}
                        className="flex items-center justify-between rounded-2xl border border-[rgba(197,200,184,0.2)] bg-[#f5f3f3] px-5 py-4"
                      >
                        <div>
                          <p className="text-sm font-semibold text-munity-green">{community.name}</p>
                          <p className="mt-1 text-xs text-munity-muted">Member</p>
                        </div>
                        <p className="text-xs font-medium text-munity-muted">
                          {community.membersLabel}
                        </p>
                      </div>
                    ))
                  : null}

                {tab === "Saved Resources"
                  ? savedResources
                      .filter((resource) => store.savedResourceIds.includes(resource.id))
                      .map((resource) => (
                      <div
                        key={resource.title}
                        className="flex items-center justify-between rounded-2xl border border-[rgba(197,200,184,0.2)] bg-[#f5f3f3] px-5 py-4"
                      >
                        <p className="text-sm font-semibold text-munity-green">{resource.title}</p>
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
              <Flame className="mx-auto size-12 text-munity-lime" fill="currentColor" />
              <p className="mt-4 text-5xl font-bold tracking-[-0.96px] text-white">{store.profile.dayStreak}</p>
              <p className="mt-1 text-sm font-semibold uppercase tracking-[1.4px] text-white/80">
                Day Wellness Streak
              </p>
              <div className="mt-3"><LivePulse label="Streak active" /></div>
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
                &ldquo;What is one small win you achieved today, even if it feels
                insignificant?&rdquo;
              </p>
              {store.dailyReflection ? (
                <div className="rounded-xl border border-munity-green/20 bg-[#fbf9f8] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-munity-green">
                    Your reflection
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-munity-text">
                    {store.dailyReflection}
                  </p>
                </div>
              ) : null}
              <button
                type="button"
                onClick={openReflection}
                className="rounded-xl border border-[#c5c8b8] bg-[#fbf9f8] py-3 text-sm font-semibold tracking-wide text-munity-text transition hover:bg-white"
              >
                {store.dailyReflection ? "Edit Reflection" : "Write Reflection"}
              </button>
            </section>

            <section className="rounded-[20px] border border-[rgba(197,200,184,0.3)] bg-[#f5f3f3] p-6">
              <h3 className="text-sm font-semibold tracking-wide text-munity-text">
                Mutual Support
              </h3>
              <div className="mt-4 flex items-center">
                {supportAvatars.map((src, index) => (
                  <div
                    key={src}
                    className="relative size-10 overflow-hidden rounded-full border-2 border-[#fbf9f8]"
                    style={{ marginLeft: index === 0 ? 0 : -12, zIndex: supportAvatars.length - index }}
                  >
                    <Image src={src} alt="" fill className="object-cover" sizes="40px" />
                  </div>
                ))}
                <div
                  className="relative z-0 flex size-10 items-center justify-center rounded-full border-2 border-[#fbf9f8] bg-[#556b2f] text-xs font-bold text-[#d0eba1]"
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

        <footer className="mt-2 border-t border-[rgba(197,200,184,0.1)] bg-[#e4e2e2] px-6 py-8 md:-mx-2 md:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-bold tracking-wide text-munity-text">
                Munity Peer Support
              </p>
              <p className="mt-1 max-w-xs text-xs font-medium leading-relaxed text-munity-muted">
                © {new Date().getFullYear()} Munity Peer Support. For emergencies, contact local
                crisis services immediately.
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

      <ImageLightbox
        images={[store.profile.avatar]}
        altText={`${store.profile.fullName}'s profile photo`}
        open={avatarViewerOpen}
        onOpenChange={setAvatarViewerOpen}
      />

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
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#c5c8b8] bg-white px-3 py-2.5 text-sm font-semibold text-munity-text transition hover:bg-[#f3f4ee]"
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
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#c5c8b8] bg-white px-3 py-2.5 text-sm font-semibold text-munity-text transition hover:bg-[#f3f4ee]"
              >
                <ImageIcon className="size-4" />
                Cover
              </button>
            </div>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold tracking-wide text-munity-muted">
                Full name
              </span>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-[#c5c8b8] bg-white px-3 py-2.5 text-sm text-munity-text outline-none ring-munity-green/30 focus:ring-2"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold tracking-wide text-munity-muted">
                Username
              </span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-[#c5c8b8] bg-white px-3 py-2.5 text-sm text-munity-text outline-none ring-munity-green/30 focus:ring-2"
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
                className="w-full rounded-xl border border-[#c5c8b8] bg-white px-3 py-2.5 text-sm text-munity-text outline-none ring-munity-green/30 placeholder:text-munity-muted/70 focus:ring-2"
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
                className="w-full resize-none rounded-xl border border-[#c5c8b8] bg-white px-3 py-2.5 text-sm text-munity-text outline-none ring-munity-green/30 focus:ring-2"
              />
            </label>
          </div>
          <DialogFooter className="border-[#e5e5e1] bg-[#f3f4ee]">
            <button
              type="button"
              onClick={() => setEditOpen(false)}
              className="rounded-xl border-2 border-[#75796b] bg-white px-4 py-2.5 text-sm font-semibold text-munity-text shadow-sm transition hover:bg-[#eceee6]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveProfile}
              className="rounded-xl bg-munity-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-munity-green-dark"
            >
              Save changes
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
              {photoTarget === "cover" ? "Change cover photo" : "Change profile photo"}
            </DialogTitle>
            <DialogDescription>
              Upload from your device or pick a demo image for this preview.
            </DialogDescription>
          </DialogHeader>
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            disabled={isUploadingAvatar}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-munity-green px-4 py-3 text-sm font-semibold text-white transition hover:bg-munity-green-dark disabled:opacity-50"
          >
            <Upload className="size-4" />
            {isUploadingAvatar ? "Uploading…" : "Upload from device"}
          </button>
          <div className="grid grid-cols-3 gap-3">
            {photoLibrary.map((item) => {
              const selected =
                photoTarget === "cover"
                  ? coverSrc === item.src
                  : store.profile.avatar === item.src;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => applyPhoto(item.src)}
                  className={`overflow-hidden rounded-xl border-2 text-left transition ${
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
          <DialogFooter className="border-[#e5e5e1] bg-[#f3f4ee]">
            <button
              type="button"
              onClick={() => setPhotoTarget(null)}
              className="rounded-xl border-2 border-[#75796b] bg-white px-4 py-2.5 text-sm font-semibold text-munity-text shadow-sm transition hover:bg-[#eceee6]"
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
              What is one small win you achieved today, even if it feels insignificant?
            </DialogDescription>
          </DialogHeader>
          <textarea
            value={reflectionDraft}
            onChange={(e) => setReflectionDraft(e.target.value)}
            rows={5}
            placeholder="Today I…"
            className="w-full resize-none rounded-xl border border-[#c5c8b8] bg-white px-3 py-2.5 text-sm text-munity-text outline-none ring-munity-green/30 placeholder:text-munity-muted/70 focus:ring-2"
          />
          <DialogFooter className="border-[#e5e5e1] bg-[#f3f4ee]">
            <button
              type="button"
              onClick={() => setReflectionOpen(false)}
              className="rounded-xl border-2 border-[#75796b] bg-white px-4 py-2.5 text-sm font-semibold text-munity-text shadow-sm transition hover:bg-[#eceee6]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => saveReflection(false)}
              className="rounded-xl border border-munity-green bg-white px-4 py-2.5 text-sm font-semibold text-munity-green transition hover:bg-munity-lime/30"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => saveReflection(true)}
              className="rounded-xl bg-munity-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-munity-green-dark"
            >
              Save &amp; share
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MemberAppShell>
  );
}
