"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import {
  Bookmark,
  Heart,
  ImageIcon,
  Lightbulb,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Smile,
  Trash2,
  UserRound,
  Volume2,
  VolumeX,
  Wind,
  X,
} from "lucide-react";
import { MemberAppShell } from "@/components/memberlayout/MemberAppShell";
// import { EditPostDialog } from "@/components/home/EditPostDialog";
import { moodIcons, type MoodLabel } from "@/components/home/MoodIcons";
// import { PostOptionsMenu } from "@/components/home/PostOptionsMenu";
import { MunitySunIcon } from "@/components/icons/MunityIcons";
// import { ImageLightbox } from "@/components/ui/image-lightbox";
import { startCalmAmbient } from "@/lib/calm-ambient";
import { mockStore, useMockStore } from "@/lib/mock-store";
import { communityPath, routes, therapyPath } from "@/lib/routes";
import { useCurrentProfile } from "@/hooks/use-current-profile";
import { formatRelativeTime, useFeed } from "@/hooks/use-feed";
import { uploadPostImage } from "@/lib/feed/upload-image";
import {
  addComment,
  createPost,
  deletePost,
  toggleSavePost,
  toggleSupport,
} from "@/lib/feed/actions";
import { MOOD_LABEL_TO_DB } from "@/types/feed";
import { useCommunityOptions } from "@/lib/communities/client-queries";

const demoPhotoLibrary = [
  {
    id: "forest",
    src: "/images/home-feed/forest-walk.png",
    label: "Forest walk",
  },
  {
    id: "stones",
    src: "/images/messages/media-stones.jpg",
    label: "Calm stones",
  },
  {
    id: "coffee",
    src: "/images/messages/media-coffee.jpg",
    label: "Quiet coffee",
  },
  { id: "brain", src: "/images/messages/media-brain.jpg", label: "Mind map" },
  { id: "safe", src: "/images/messages/shared-safe.png", label: "Safe space" },
  {
    id: "mindfulness",
    src: "/images/messages/mindfulness.jpg",
    label: "Mindfulness",
  },
];

const moods: { label: MoodLabel; bg: string }[] = [
  { label: "Happy", bg: "bg-[#f4f7e8]" },
  { label: "Calm", bg: "bg-[#eef5d8]" },
  { label: "Stressed", bg: "bg-[#f8f0e6]" },
  { label: "Sad", bg: "bg-[#eef2f7]" },
  { label: "Anxious", bg: "bg-[#f3eef7]" },
];

const mindfulMoments = [
  "Box breathing: Inhale for 4, Hold for 4, Exhale for 4, Hold for 4. Repeat until you feel grounded.",
  "Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.",
  "Place a hand on your chest. Feel three slow breaths before you reply to anything urgent.",
  "Unclench your jaw. Drop your shoulders. Soften your gaze for ten seconds.",
];

const liveActivitySeed = [
  {
    who: "Jordan",
    action: "supported a post in Mindful Paths",
    tone: "support",
  },
  { who: "Priya", action: "joined Grief Garden", tone: "join" },
  { who: "Marcus", action: "shared a calm check-in", tone: "post" },
  {
    who: "Elena A.",
    action: "is available for sessions today",
    tone: "therapy",
  },
  { who: "Campus Calm", action: "started a live peer circle", tone: "live" },
];

const cardClass =
  "rounded-[20px] border border-munity-border bg-white shadow-[0_4px_10px_rgba(85,107,47,0.05)]";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

function greetingForHour(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function HomeFeedView() {
  const { profile, loading: profileLoading } = useCurrentProfile();
  const {
    posts,
    commentsByPost,
    loading: feedLoading,
    error: feedError,
    refresh,
  } = useFeed();

  const store = useMockStore();
  const [showMoods, setShowMoods] = useState(true);
  const [selectedMood, setSelectedMood] = useState<MoodLabel | null>(null);
  const [composerText, setComposerText] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(
    null,
  );
  const communityOptions = useCommunityOptions(flash);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  /** Device file waiting to upload on Post (not a data: URL in the DB) */
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>(
    {},
  );
  const [toast, setToast] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [breathing, setBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState("Inhale");
  const [breathCount, setBreathCount] = useState(4);
  const [audioMuted, setAudioMuted] = useState(false);
  const ambientRef = useRef<ReturnType<typeof startCalmAmbient>>(null);
  const [momentIndex, setMomentIndex] = useState(0);
  const [activityIndex, setActivityIndex] = useState(0);
  const [onlineNow, setOnlineNow] = useState(128);
  const [justSupported, setJustSupported] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [openPostMenu, setOpenPostMenu] = useState<string | null>(null);

  const hour = new Date().getHours();
  const greeting = greetingForHour(hour);
  const firstName = profile?.firstName ?? "there";
  const fullName = profile?.fullName ?? "Member";

  const joinedCommunities = store.communities.filter((community) =>
    store.memberships.includes(community.id),
  );
  const suggestedGroups = store.communities
    .filter((community) => !store.memberships.includes(community.id))
    .slice(0, 2);
  const therapists = store.therapists.slice(0, 2);

  const visiblePosts = useMemo(() => {
    // const activePosts = store.posts.filter((post) => !post.archived);
    const query = search.trim().toLowerCase();
    if (!query) return posts;
    return posts.filter(
      (post) =>
        post.content.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query) ||
        post.feeling.toLowerCase().includes(query),
      // (post.communityName?.toLowerCase().includes(query) ?? false),
    );
  }, [search, posts]);

  const liveActivity = useMemo(() => {
    const recentPost = store.posts[0];
    const dynamic = recentPost
      ? [
          {
            who: recentPost.anonymous
              ? "Someone"
              : recentPost.author.split(" ")[0],
            action: `posted in ${recentPost.communityName ?? "the feed"}`,
            tone: "post",
          },
          ...liveActivitySeed,
        ]
      : liveActivitySeed;
    return dynamic;
  }, [store.posts]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setMomentIndex((value) => (value + 1) % mindfulMoments.length);
    }, 8000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActivityIndex((value) => (value + 1) % liveActivity.length);
      setOnlineNow((value) => value + (Math.random() > 0.5 ? 1 : -1));
    }, 4200);
    return () => window.clearInterval(timer);
  }, [liveActivity.length]);

  const startBreathing = () => {
    setBreathing(true);
    setBreathPhase("Inhale");
    setBreathCount(4);
  };

  const stopBreathing = () => {
    setBreathing(false);
  };

  useEffect(() => {
    if (!breathing) {
      ambientRef.current?.stop();
      ambientRef.current = null;
      return;
    }

    ambientRef.current = startCalmAmbient();
    ambientRef.current?.setMuted(audioMuted);
    ambientRef.current?.setBreathGain("Inhale");

    const phases = ["Inhale", "Hold", "Exhale", "Hold"] as const;
    let phase = 0;
    let count = 4;

    const timer = window.setInterval(() => {
      count -= 1;
      if (count <= 0) {
        phase = (phase + 1) % phases.length;
        count = 4;
        setBreathPhase(phases[phase]);
        ambientRef.current?.setBreathGain(phases[phase]);
      }
      setBreathCount(count);
    }, 1000);

    return () => {
      window.clearInterval(timer);
      ambientRef.current?.stop();
      ambientRef.current = null;
    };
    // audioMuted is applied separately so toggling mute doesn't restart the pad
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breathing]);

  useEffect(() => {
    ambientRef.current?.setMuted(audioMuted);
  }, [audioMuted]);

  function flash(message: string) {
    setToast(message);
  }

  function selectMood(mood: MoodLabel) {
    setSelectedMood(mood);
    flash(`Mood set to ${mood}`);
  }

  const clearPhoto = () => {
    setPhotoPreview(null);
    setPendingFile(null);
  };

  function attachDemoPhoto(src: string) {
    setPendingFile(null);
    setPhotoPreview(src);
    setShowPhotoPicker(false);
    flash("Photo attached — add a caption or post");
  }

  function onPickDevicePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      flash("Please choose an image file");
      return;
    }

    setPendingFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPhotoPreview(objectUrl);
    setShowPhotoPicker(false);
    flash("Photo ready - add a caption or post");
    // const reader = new FileReader();
    // reader.onload = () => {
    //   const result = typeof reader.result === "string" ? reader.result : null;
    //   if (!result) return;
    //   setPhotoPreview(result);
    //   setShowPhotoPicker(false);
    //   flash("Photo ready — add a caption or post");
    // };
    // reader.readAsDataURL(file);
  }

  async function supportPost(postId: string) {
    const result = await toggleSupport(postId);
    if (result.error) {
      flash(result.error);
      return;
    }
    setJustSupported(postId);
    window.setTimeout(() => setJustSupported(null), 500);
    refresh();
  }

  async function submitComment(postId: string) {
    const draft = commentDrafts[postId] ?? "";
    if (!draft.trim()) return;
    const result = await addComment(postId, draft);
    if (result.error) {
      flash(result.error);
      return;
    }
    setCommentDrafts((prev) => ({ ...prev, [postId]: "" }));
    flash("Comment added");
    refresh();
  }

  const savePost = async (postId: string, currentlySaved: boolean) => {
    const result = await toggleSavePost(postId);
    if (result.error) {
      flash(result.error);
      return;
    }
    flash(currentlySaved ? "Removed from saved" : "Saved for later");
    refresh();
  };

  const handleCreatePost = async () => {
    if (!composerText.trim() && !photoPreview && !pendingFile) return;
    if (!selectedMood) {
      flash("Pick a mood before posting");
      setShowMoods(true);
      return;
    }

    setPosting(true);
    try {
      let imageUrl: string | null = null;

      if (pendingFile) {
        const uploaded = await uploadPostImage(pendingFile);
        if ("error" in uploaded) {
          flash(uploaded.error);
          return;
        }
        imageUrl = uploaded.url;
      } else if (photoPreview && !photoPreview.startsWith("data:")) {
        // Demo library path or already-uploaded URL
        imageUrl = photoPreview;
      }

      const result = await createPost({
        content: composerText,
        mood: MOOD_LABEL_TO_DB[selectedMood],
        isAnonymous: anonymous,
        imageUrl,
        communityId: selectedCommunityId,
      });

      if (result.error) {
        flash(result.error);
        return;
      }

      setComposerText("");
      setSelectedCommunityId(null)
      clearPhoto();
      setShowPhotoPicker(false);
      flash(
        anonymous
          ? "Posted anonymously"
          : imageUrl
            ? "Photo shared with your communities"
            : "Shared with your communities",
      );
      refresh();
    } finally {
      setPosting(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    const result = await deletePost(postId);
    setOpenPostMenu(null);
    if (result.error) {
      flash(result.error);
      return;
    }
    flash("Post deleted");
    refresh();
  };

  return (
    <MemberAppShell
      showSearch
      searchPlaceholder="Search posts, people, communities..."
      searchValue={search}
      onSearchChange={setSearch}
    >
      {" "}
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-6 h-40 rounded-4xl bg-[radial-gradient(circle_at_top,rgba(214,231,161,0.35),transparent_70%)]"
        />

        {/* Left sidebar */}
        <motion.aside
          className="relative flex flex-col gap-5 lg:col-span-3"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.35 }}
        >
          <section className={`${cardClass} overflow-hidden p-6`}>
            <div className="flex flex-col items-center text-center">
              <motion.div
                className="rounded-full border-4 border-munity-lime/80 p-1.5 shadow-sm"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(214,231,161,0.5)",
                    "0 0 0 10px rgba(214,231,161,0)",
                  ],
                }}
                transition={{ duration: 2.4, repeat: Infinity }}
              >
                <div className="relative size-16 overflow-hidden rounded-full">
                  <Image
                    src={store.profile.avatar}
                    alt={firstName}
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
              <h2 className="mt-4 text-xl font-semibold tracking-tight text-munity-text">
                {profileLoading ? "..." : fullName}
              </h2>
              {profile?.username ? (
                <p className="mt-1 text-xs font-medium text-munity-muted">
                  @{profile.username}
                </p>
              ) : null}
              {selectedMood ? (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 rounded-full bg-munity-lime/50 px-3 py-1 text-[11px] font-semibold text-munity-olive-text"
                >
                  Feeling {selectedMood} today
                </motion.p>
              ) : null}
              <div className="mt-5 flex w-full gap-2">
                <div className="flex-1 rounded-xl bg-munity-sidebar px-3 py-3 text-center">
                  <p className="text-base font-bold text-munity-green">
                    {store.profile.dayStreak}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-munity-muted">
                    Day Streak
                  </p>
                </div>
                <div className="flex-1 rounded-xl bg-munity-sidebar px-3 py-3 text-center">
                  <p className="text-base font-bold text-munity-green">
                    {store.profile.groupCount}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-munity-muted">
                    Groups
                  </p>
                </div>
              </div>
              <Link
                href={routes.profile}
                className="mt-4 text-xs font-semibold text-munity-green hover:underline"
              >
                View profile
              </Link>
            </div>
          </section>

          <section className={`${cardClass} p-4`}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-munity-muted">
                Live now
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f7e4] px-2 py-1 text-[11px] font-semibold text-[#2f6b3a]">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#22c55e] opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-[#22c55e]" />
                </span>
                {Math.max(96, onlineNow)} online
              </span>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={activityIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28 }}
                className="mt-3 text-sm leading-relaxed text-munity-text"
              >
                <span className="font-semibold text-munity-green">
                  {liveActivity[activityIndex]?.who}
                </span>{" "}
                {liveActivity[activityIndex]?.action}
              </motion.p>
            </AnimatePresence>
          </section>

          <section className={`${cardClass} p-5`}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-wide text-munity-text">
                Your Communities
              </h3>
              <Link
                href={routes.communities}
                className="rounded-full p-1.5 text-munity-green transition hover:bg-munity-lime/40"
                aria-label="Browse communities"
              >
                <Plus className="size-4" />
              </Link>
            </div>
            <div className="flex flex-col gap-1">
              {joinedCommunities.map((community, index) => (
                <motion.div
                  key={community.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={communityPath(community.slug)}
                    className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-munity-sidebar"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-munity-lime text-sm font-bold text-munity-olive-text">
                      {community.name.charAt(0)}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-munity-text">
                        {community.name}
                      </span>
                      <span className="block text-xs text-munity-muted">
                        {community.membersLabel}
                      </span>
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
            <Link
              href={routes.communities}
              className="mt-3 block rounded-xl py-2 text-center text-xs font-semibold text-munity-green transition hover:bg-munity-lime/30"
            >
              View all communities
            </Link>
          </section>
        </motion.aside>

        {/* Center feed */}
        <section className="relative flex flex-col gap-5 lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${cardClass} overflow-hidden p-5 sm:p-6`}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-munity-muted">
                  {greeting}
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-munity-green">
                  {profileLoading ? "..." : firstName}, how are you arriving
                  today?
                </h1>
              </div>
              <MunitySunIcon className="size-5 shrink-0 text-munity-green/70" />
            </div>

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
                placeholder={`What's on your mind, ${firstName}?`}
                className="min-h-24 w-full resize-none rounded-2xl border border-transparent bg-munity-sidebar px-4 py-3.5 text-base text-munity-text outline-none transition placeholder:text-munity-muted/55 focus:border-munity-green/20 focus:bg-white focus:ring-2 focus:ring-munity-green/10"
              />
            </div>

            <AnimatePresence>
              {photoPreview ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="relative mt-4 overflow-hidden rounded-2xl border border-munity-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoPreview}
                      alt="Attachment preview"
                      className="max-h-64 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        clearPhoto();
                        flash("Photo removed");
                      }}
                      className="absolute right-3 top-3 rounded-full bg-black/55 p-2 text-white backdrop-blur-sm"
                      aria-label="Remove photo"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPickDevicePhoto}
            />

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-munity-border/60 pt-4">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setShowMoods((value) => !value)}
                  className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                    showMoods || selectedMood
                      ? "bg-munity-lime/60 text-munity-olive-text"
                      : "bg-munity-sidebar text-munity-muted hover:bg-munity-lime/40"
                  }`}
                >
                  <Smile className="size-3.5" />
                  Mood{selectedMood ? ` · ${selectedMood}` : ""}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPhotoPicker((value) => !value)}
                  className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                    showPhotoPicker || photoPreview
                      ? "bg-munity-lime/60 text-munity-olive-text"
                      : "bg-munity-sidebar text-munity-muted hover:bg-munity-lime/40"
                  }`}
                >
                  <ImageIcon className="size-3.5" />
                  {photoPreview ? "Photo ✓" : "Photo"}
                </button>
                <button
                  type="button"
                  onClick={() => setAnonymous((value) => !value)}
                  className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                    anonymous
                      ? "bg-munity-green text-white"
                      : "bg-munity-sidebar text-munity-muted hover:bg-munity-lime/40"
                  }`}
                >
                  <UserRound className="size-3.5" />
                  {anonymous ? "Anonymous ✓" : "Anonymous"}
                </button>
              </div>
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => void handleCreatePost()}
                disabled={
                  posting ||
                  (!composerText.trim() && !photoPreview && !pendingFile)
                }
                className="rounded-full bg-munity-green px-7 py-2.5 text-sm font-semibold tracking-wide text-white transition hover:bg-munity-green-dark disabled:opacity-50"
              >
                {posting ? "Posting..." : "Post"}
              </motion.button>

              <select
                value={selectedCommunityId ?? ""}
                onChange={(e) => setSelectedCommunityId(e.target.value || null)}
                className="rounded-full bg-munity-sidebar px-3.5 py-2 text-xs font-semibold text-munity-muted outline-none transition hover:bg-munity-lime/40"
              >
                <option value="">Post to: My Feed</option>
                {communityOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    Post to: {c.name}
                  </option>
                ))}
              </select>
            </div>

            <AnimatePresence>
              {showPhotoPicker ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 rounded-2xl bg-munity-sidebar p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-munity-text">
                        Add a photo to your post
                      </p>
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="rounded-full bg-munity-green px-3.5 py-1.5 text-xs font-semibold text-white"
                      >
                        Upload from device
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                      {demoPhotoLibrary.map((photo) => (
                        <button
                          key={photo.id}
                          type="button"
                          onClick={() => attachDemoPhoto(photo.src)}
                          className="group relative aspect-square overflow-hidden rounded-xl border border-munity-border bg-white"
                          aria-label={`Attach ${photo.label}`}
                        >
                          <Image
                            src={photo.src}
                            alt={photo.label}
                            fill
                            className="object-cover transition group-hover:scale-105"
                            sizes="96px"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <AnimatePresence>
              {showMoods ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 grid grid-cols-5 gap-2 rounded-2xl bg-munity-sidebar p-3 sm:gap-3 sm:p-4">
                    {moods.map((mood) => {
                      const active = selectedMood === mood.label;
                      const Icon = moodIcons[mood.label];
                      return (
                        <motion.button
                          key={mood.label}
                          type="button"
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.94 }}
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
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>

          {feedError ? (
            <div className={`${cardClass} px-6 py-4 text-sm text-red-700`}>
              Could not load feed: {feedError}
            </div>
          ) : null}

          <AnimatePresence initial={false}>
            {feedLoading && posts.length === 0 ? (
              <motion.div
                key="feed-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`${cardClass} px-6 py-12 text-center text-sm text-munity-muted`}
              >
                Loading posts...
              </motion.div>
            ) : null}

            {!feedLoading && visiblePosts.length === 0 ? (
              <motion.div
                key="empty-search"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${cardClass} px-6 py-12 text-center`}
              >
                <p className="text-sm text-munity-muted">
                  {search.trim()
                    ? `No posts match “${search.trim()}”.`
                    : "No posts yet — share how you’re arriving today."}
                </p>
                {search.trim() ? (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="mt-3 text-sm font-semibold text-munity-green hover:underline"
                  >
                    Clear search
                  </button>
                ) : null}
              </motion.div>
            ) : null}

            {visiblePosts.map((post, index) => {
              const comments = commentsByPost[post.id] ?? [];
              const open = expandedComments === post.id;
              const supported = post.supportedByMe;
              const imageSrc = post.imageUrl;

              return (
                <motion.article
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{
                    delay: Math.min(index * 0.04, 0.2),
                    duration: 0.3,
                  }}
                  className={`${cardClass} p-5 sm:p-6`} //${post.accent ? "border-l-4 border-l-munity-green" : ""}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {post.isAnonymous ? (
                        <div className="flex size-10 items-center justify-center rounded-full bg-[#efeded] text-munity-muted">
                          <UserRound className="size-5" />
                        </div>
                      ) : (
                        <div className="relative size-10 overflow-hidden rounded-full">
                          <Image
                            src={
                              post.avatarUrl ?? "/images/home-feed/sarah.jpg"
                            }
                            alt={post.author}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-munity-text">
                          {post.author}
                        </p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-medium text-munity-muted">
                          <span>{formatRelativeTime(post.createdAt)}</span>
                          <span className="size-1 rounded-full bg-munity-input-border" />
                          <span className="text-munity-olive-text">
                            {post.feeling}
                          </span>
                          {/* {post.communityName ? (
                            <>
                              <span className="size-1 rounded-full bg-munity-input-border" />
                              <Link
                                href={
                                  post.communityId
                                    ? communityPath(
                                        store.communities.find(
                                          (c) => c.id === post.communityId,
                                        )?.slug ?? "mindful-paths",
                                      )
                                    : routes.communities
                                }
                                className="text-munity-green hover:underline"
                              >
                                {post.communityName}
                              </Link>
                            </>
                          ) : null} */}
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <button
                        type="button"
                        className="rounded-full p-1.5 text-munity-muted transition hover:bg-munity-sidebar hover:text-munity-text"
                        aria-label="Post options"
                        onClick={() =>
                          setOpenPostMenu((current) =>
                            current === post.id ? null : post.id,
                          )
                        }
                      >
                        <MoreHorizontal className="size-4" />
                      </button>
                      {openPostMenu === post.id && post.isMine ? (
                        <div className="absolute right-0 z-10 mt-1 min-w-36 rounded-xl border border-munity-border bg-white p-1 shadow-lg">
                          <button
                            type="button"
                            onClick={() => void handleDeletePost(post.id)}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="size-4" />
                            Delete
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {post.content ? (
                    <p className="mt-4 text-[15px] leading-relaxed text-munity-text">
                      {post.content}
                    </p>
                  ) : null}

                  {imageSrc ? (
                    <div className="relative mt-4 h-56 w-full overflow-hidden rounded-2xl sm:h-64">
                      {imageSrc.startsWith("http") ||
                      imageSrc.startsWith("blob:") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imageSrc}
                          alt="Post attachment"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Image
                          src={imageSrc}
                          alt="Post attachment"
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                  ) : null}

                  <div className="mt-4 flex items-center gap-1 border-t border-munity-border/60 pt-3">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.92 }}
                      onClick={() => supportPost(post.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition hover:bg-munity-sidebar hover:text-munity-green ${
                        supported
                          ? "bg-munity-lime/40 text-munity-green"
                          : "text-munity-muted"
                      }`}
                    >
                      <motion.span
                        animate={
                          justSupported === post.id
                            ? { scale: [1, 1.35, 1] }
                            : { scale: 1 }
                        }
                        transition={{ duration: 0.35 }}
                      >
                        <Heart
                          className={`size-4 ${supported ? "fill-current" : ""}`}
                        />
                      </motion.span>
                      Support · {post.supportCount}
                    </motion.button>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedComments((current) =>
                          current === post.id ? null : post.id,
                        )
                      }
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition hover:bg-munity-sidebar hover:text-munity-green ${
                        open
                          ? "bg-munity-lime/30 text-munity-green"
                          : "text-munity-muted"
                      }`}
                    >
                      <MessageCircle className="size-4" />
                      Comment · {post.commentCount}
                    </button>
                    <button
                      type="button"
                      onClick={() => void savePost(post.id, post.savedByMe)}
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-munity-muted transition hover:bg-munity-sidebar hover:text-munity-green"
                    >
                      <Bookmark
                        className={`size-4 ${post.savedByMe ? "fill-current" : ""}`}
                      />
                      {post.savedByMe ? "Saved" : "Save"}
                    </button>
                  </div>

                  <AnimatePresence>
                    {open ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 space-y-3 rounded-2xl bg-munity-sidebar p-4">
                          {comments.length ? (
                            comments.map((comment) => (
                              <motion.div
                                key={comment.id}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-xl bg-white px-3 py-2.5"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-xs font-semibold text-munity-green">
                                    {comment.author}
                                  </p>
                                  <p className="text-[11px] text-munity-muted">
                                    {formatRelativeTime(comment.createdAt)}
                                  </p>
                                </div>
                                <p className="mt-1 text-sm text-munity-text">
                                  {comment.content}
                                </p>
                              </motion.div>
                            ))
                          ) : (
                            <p className="text-sm text-munity-muted">
                              Be the first to leave a supportive comment.
                            </p>
                          )}
                          <div className="flex gap-2">
                            <input
                              value={commentDrafts[post.id] ?? ""}
                              onChange={(event) =>
                                setCommentDrafts((prev) => ({
                                  ...prev,
                                  [post.id]: event.target.value,
                                }))
                              }
                              onKeyDown={(event) => {
                                if (event.key === "Enter")
                                  void submitComment(post.id);
                              }}
                              placeholder="Write a kind reply…"
                              className="min-w-0 flex-1 rounded-xl border border-munity-border bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-munity-green/15"
                            />
                            <button
                              type="button"
                              onClick={() => void submitComment(post.id)}
                              className="rounded-xl bg-munity-green px-4 py-2.5 text-sm font-semibold text-white"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </section>

        {/* Right sidebar */}
        <motion.aside
          className="relative flex flex-col gap-5 lg:col-span-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
        >
          <section className="relative overflow-hidden rounded-[20px] bg-munity-olive p-5 shadow-[0_4px_10px_rgba(85,107,47,0.08)]">
            <div className="pointer-events-none absolute -bottom-10 -right-10 size-36 rounded-full bg-munity-lime-light/15 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2">
                <Lightbulb className="size-4 text-munity-lime-light" />
                <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-munity-lime-light">
                  Mindful Moment
                </h3>
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={momentIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-3 text-sm italic leading-relaxed text-munity-lime-light/95"
                >
                  &ldquo;{mindfulMoments[momentIndex]}&rdquo;
                </motion.p>
              </AnimatePresence>
              <button
                type="button"
                onClick={() => startBreathing}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-munity-lime-light underline underline-offset-4 transition hover:opacity-80"
              >
                <Wind className="size-3.5" />
                Try it now
              </button>
            </div>
          </section>

          <section className={`${cardClass} p-5`}>
            <h3 className="text-sm font-semibold tracking-wide text-munity-text">
              Suggested Groups
            </h3>
            <div className="mt-4 flex flex-col gap-3">
              {suggestedGroups.map((group) => (
                <div
                  key={group.id}
                  className="flex items-center justify-between gap-3"
                >
                  <Link
                    href={communityPath(group.slug)}
                    className="flex min-w-0 items-center gap-3"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#d9eaa3] text-sm font-bold text-[#161f00]">
                      {group.name.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-munity-text">
                        {group.name}
                      </p>
                      <p className="text-[11px] text-munity-muted">
                        {group.membersLabel}
                      </p>
                    </div>
                  </Link>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.94 }}
                    onClick={() => {
                      mockStore.toggleMembership(group.id);
                      flash(`Joined ${group.name}`);
                    }}
                    className="shrink-0 rounded-full border border-munity-green/70 px-3 py-1.5 text-xs font-semibold text-munity-green transition hover:bg-munity-lime/40"
                  >
                    Join
                  </motion.button>
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
                  className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-munity-sidebar"
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
                    <p className="text-[11px] text-munity-muted">
                      {therapist.specializations[0]}
                    </p>
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
        </motion.aside>
      </div>
      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-munity-green px-5 py-3 text-sm font-semibold text-white shadow-lg"
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {breathing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="relative w-full max-w-sm rounded-[28px] bg-munity-bg p-8 text-center shadow-2xl"
            >
              <button
                type="button"
                onClick={() => stopBreathing}
                className="absolute right-4 top-4 rounded-full p-2 text-munity-muted hover:bg-white"
                aria-label="Close breathing exercise"
              >
                <X className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setAudioMuted((value) => !value)}
                className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-semibold text-munity-green shadow-sm"
                aria-label={
                  audioMuted ? "Unmute calm audio" : "Mute calm audio"
                }
              >
                {audioMuted ? (
                  <VolumeX className="size-3.5" />
                ) : (
                  <Volume2 className="size-3.5" />
                )}
                {audioMuted ? "Muted" : "Sound on"}
              </button>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-munity-muted">
                Box breathing
              </p>
              <motion.div
                className="mx-auto mt-8 flex size-36 items-center justify-center rounded-full bg-munity-lime/50"
                animate={{
                  scale:
                    breathPhase === "Inhale"
                      ? 1.15
                      : breathPhase === "Exhale"
                        ? 0.88
                        : 1,
                }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
              >
                <div className="text-center">
                  <p className="text-2xl font-bold text-munity-green">
                    {breathPhase}
                  </p>
                  <p className="mt-1 text-4xl font-bold text-munity-olive-text">
                    {breathCount}
                  </p>
                </div>
              </motion.div>
              <p className="mt-6 text-sm text-munity-muted">
                Follow the circle. Soft ambient audio swells with your breath.
              </p>
              <button
                type="button"
                onClick={() => {
                  stopBreathing();
                  flash("Nice — breathe breaks help reset your day");
                }}
                className="mt-6 rounded-full bg-munity-green px-6 py-2.5 text-sm font-semibold text-white"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      {/* <ImageLightbox
        open={lightboxPost !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setLightboxPost(null);
        }}
        images={lightboxPost ? [lightboxPost.image] : []}
        altText={lightboxPost ? `Photo from ${lightboxPost.author}'s post` : "Post image"}
      />

      <EditPostDialog
        post={editingPost}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setEditingPost(null);
        }}
        flash={flash}
      /> */}
    </MemberAppShell>
  );
}
