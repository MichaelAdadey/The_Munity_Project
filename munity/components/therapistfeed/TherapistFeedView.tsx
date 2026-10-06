"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import {
  Bookmark,
  Flag,
  Heart,
  ImageIcon,
  Lightbulb,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserRound,
  Wind,
  X,
} from "lucide-react";
import { TherapistAppShell } from "@/components/therapistlayout/TherapistAppShell";
import { moodIcons, type MoodLabel } from "@/components/home/MoodIcons";
import { EditPostDialog } from "@/components/home/EditPostDialog";
import { ReportDialog } from "@/components/reports/ReportDialog";
import { ImageLightbox } from "@/components/ui/image-lightbox";
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
import { MOOD_LABEL_TO_DB, type FeedPost } from "@/types/feed";
import { useCommunityOptions } from "@/lib/communities/client-queries";
import { communityPath, routes } from "@/lib/routes";
import { useLiveToast } from "@/components/live/LiveFeedback";

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

export function TherapistFeedView() {
  const { profile, loading: profileLoading } = useCurrentProfile();
  const { flash } = useLiveToast();
  const {
    posts,
    commentsByPost,
    loading: feedLoading,
    error: feedError,
    refresh,
  } = useFeed();

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
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [posting, setPosting] = useState(false);
  const [search, setSearch] = useState("");
  const [momentIndex, setMomentIndex] = useState(0);
  const [openPostMenu, setOpenPostMenu] = useState<string | null>(null);
  const [lightboxPost, setLightboxPost] = useState<FeedPost | null>(null);
  const [reportTarget, setReportTarget] = useState<{
    type: "post" | "comment";
    id: string;
  } | null>(null);
  const [editingPost, setEditingPost] = useState<FeedPost | null>(null);

  const hour = new Date().getHours();
  const greeting = greetingForHour(hour);
  const firstName = profile?.firstName ?? "there";
  const fullName = profile?.fullName ?? "Therapist";

  const visiblePosts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return posts;
    return posts.filter(
      (post) =>
        post.content.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query) ||
        post.feeling.toLowerCase().includes(query) ||
        (post.communityName?.toLowerCase().includes(query) ?? false),
    );
  }, [search, posts]);

  useEffect(() => {
    function closeMenus(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-post-menu]")) setOpenPostMenu(null);
    }
    window.addEventListener("click", closeMenus);
    return () => window.removeEventListener("click", closeMenus);
  }, []);

  function selectMood(mood: MoodLabel) {
    setSelectedMood(mood);
    flash(`Mood set to ${mood}`);
  }

  const clearPhoto = () => {
    setPhotoPreview(null);
    setPendingFile(null);
  };

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
    flash("Photo ready — add a caption or post");
  }

  async function supportPost(postId: string) {
    const result = await toggleSupport(postId);
    if (result.error) {
      flash(result.error);
      return;
    }
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
      setSelectedCommunityId(null);
      setAnonymous(false);
      clearPhoto();
      flash(
        anonymous
          ? "Posted anonymously"
          : "Shared with the community",
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
    <TherapistAppShell
      active="Community Feed"
      title="Community Feed"
      subtitle="Connect with members and share support in the community."
      actions={
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4.5 -translate-y-1/2 text-munity-gray" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search posts..."
            className="w-48 rounded-full border border-munity-input-border bg-white py-2 pl-9 pr-4 text-sm outline-none transition focus:border-munity-green lg:w-64"
            aria-label="Search posts"
          />
        </div>
      }
    >
      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Center feed */}
        <section className="flex flex-col gap-5 lg:col-span-8">
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
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-munity-green">
                  {profileLoading ? "..." : `${fullName}, share with the community`}
                </h2>
              </div>
              <Lightbulb className="size-5 shrink-0 text-munity-green/70" />
            </div>

            <div className="flex gap-3 sm:gap-4">
              <div className="relative size-11 shrink-0 overflow-hidden rounded-full sm:size-12">
                <Image
                  src={profile?.avatarUrl ?? "/images/profile/avatar.jpg"}
                  alt={fullName}
                  fill
                  className="object-cover"
                />
              </div>
              <textarea
                value={composerText}
                onChange={(event) => setComposerText(event.target.value)}
                placeholder={`What would you like to share, ${firstName}?`}
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
                  onClick={() => photoInputRef.current?.click()}
                  className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                    photoPreview
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
                <select
                  value={selectedMood ?? ""}
                  onChange={(event) => {
                    const value = event.target.value as MoodLabel;
                    if (value) selectMood(value);
                  }}
                  className={`rounded-full px-3.5 py-2 text-xs font-semibold outline-none transition ${
                    selectedMood
                      ? "bg-munity-lime/60 text-munity-olive-text"
                      : "bg-munity-sidebar text-munity-muted hover:bg-munity-lime/40"
                  }`}
                  aria-label="Select your mood"
                >
                  <option value="" disabled>
                    Mood
                  </option>
                  {moods.map((mood) => (
                    <option key={mood.label} value={mood.label}>
                      {mood.label}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedCommunityId ?? ""}
                  onChange={(e) => setSelectedCommunityId(e.target.value || null)}
                  className="rounded-full bg-munity-sidebar px-3.5 py-2 text-xs font-semibold text-munity-muted outline-none transition hover:bg-munity-lime/40"
                  aria-label="Choose post audience"
                >
                  <option value="">Post to: My Feed</option>
                  {communityOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      Post to: {c.name}
                    </option>
                  ))}
                </select>
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
            </div>

            <AnimatePresence>
              {selectedMood ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 flex items-center gap-3 rounded-2xl bg-munity-sidebar p-3">
                    <span className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm">
                      {(() => {
                        const Icon = moodIcons[selectedMood];
                        return <Icon className="size-9" />;
                      })()}
                    </span>
                    <p className="text-sm font-medium text-munity-text">
                      Feeling {selectedMood} today
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedMood(null)}
                      className="ml-auto rounded-full p-1.5 text-munity-muted transition hover:bg-white"
                      aria-label="Clear mood"
                    >
                      <X className="size-4" />
                    </button>
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
                    : "No posts yet — share something supportive with the community."}
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
                  className={`${cardClass} p-5 sm:p-6`}
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
                            src={post.avatarUrl ?? "/images/home-feed/sarah.jpg"}
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
                          {post.communityName && post.communitySlug ? (
                            <>
                              <span className="size-1 rounded-full bg-munity-input-border" />
                              <Link
                                href={communityPath(post.communitySlug)}
                                className="text-munity-green hover:underline"
                              >
                                {post.communityName}
                              </Link>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="relative" data-post-menu>
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
                      {openPostMenu === post.id ? (
                        <div className="absolute right-0 z-10 mt-1 min-w-36 rounded-xl border border-munity-border bg-white p-1 shadow-lg">
                          {post.isMine ? (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingPost(post);
                                  setOpenPostMenu(null);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-munity-text hover:bg-munity-sidebar"
                              >
                                <Pencil className="size-4" />
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => void handleDeletePost(post.id)}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="size-4" />
                                Delete
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setReportTarget({ type: "post", id: post.id });
                                setOpenPostMenu(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-munity-text hover:bg-munity-sidebar"
                            >
                              <Flag className="size-4" />
                              Report
                            </button>
                          )}
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
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setLightboxPost(post)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ")
                          setLightboxPost(post);
                      }}
                      aria-label="View post photo"
                      className="relative mt-4 h-56 w-full cursor-zoom-in overflow-hidden rounded-2xl sm:h-64"
                    >
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
                      <Heart
                        className={`size-4 ${supported ? "fill-current" : ""}`}
                      />
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
                                  <div className="flex items-center gap-2">
                                    <p className="text-[11px] text-munity-muted">
                                      {formatRelativeTime(comment.createdAt)}
                                    </p>
                                    {comment.authorId !== profile?.id ? (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setReportTarget({
                                            type: "comment",
                                            id: comment.id,
                                          })
                                        }
                                        className="text-munity-muted hover:text-[#93000a]"
                                        aria-label="Report comment"
                                      >
                                        <Flag className="size-3" />
                                      </button>
                                    ) : null}
                                  </div>
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
          className="flex flex-col gap-5 lg:col-span-4"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.35 }}
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
                onClick={() => setMomentIndex((value) => (value + 1) % mindfulMoments.length)}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-munity-lime-light underline underline-offset-4 transition hover:opacity-80"
              >
                <Wind className="size-3.5" />
                Another one
              </button>
            </div>
          </section>

          <section className={`${cardClass} p-5`}>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold tracking-wide text-munity-text">
                Communities
              </h3>
              <Link
                href={routes.communities}
                className="rounded-full p-1.5 text-munity-green transition hover:bg-munity-lime/40"
                aria-label="Browse communities"
              >
                <Plus className="size-4" />
              </Link>
            </div>
            <div className="mt-3 flex flex-col gap-1">
              {communityOptions.slice(0, 5).map((community) => (
                <Link
                  key={community.id}
                  href={communityPath(community.slug)}
                  className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-munity-sidebar"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-munity-lime text-sm font-bold text-munity-olive-text">
                    {community.name.charAt(0)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-munity-text">
                      {community.name}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className={`${cardClass} p-5`}>
            <h3 className="text-sm font-semibold tracking-wide text-munity-text">
              Guidelines
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-munity-muted">
              This is a shared peer-support space. Posts are member-initiated —
              as a therapist, keep replies general and supportive. For clinical
              guidance, invite members to book a session through Appointments.
            </p>
          </section>
        </motion.aside>
      </div>

      <ReportDialog
        open={reportTarget !== null}
        onClose={() => setReportTarget(null)}
        targetType={reportTarget?.type ?? "post"}
        targetId={reportTarget?.id ?? ""}
        flash={flash}
      />
      <ImageLightbox
        open={lightboxPost !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setLightboxPost(null);
        }}
        images={lightboxPost?.imageUrl ? [lightboxPost.imageUrl] : []}
        altText={
          lightboxPost
            ? `Photo from ${lightboxPost.author}'s post`
            : "Post image"
        }
      />
      <EditPostDialog
        post={editingPost}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setEditingPost(null);
        }}
        flash={flash}
        onSaved={refresh}
      />
    </TherapistAppShell>
  );
}
