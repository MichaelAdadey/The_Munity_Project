"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, MessageCircle, Users } from "lucide-react";
import { motion } from "framer-motion";
import { MemberAppShell } from "@/components/memberlayout/MemberAppShell";
import {
  LivePulse,
  liveFadeUp,
  liveStagger,
  useLiveToast,
} from "@/components/live/LiveFeedback";
import { routes } from "@/lib/routes";
import { CommunityListItem } from "@/lib/communities/queries";
import { CommunityPost } from "@/lib/communities/detail-queries";
import { useState } from "react";
import {
  joinCommunity,
  leaveCommunity,
} from "@/lib/communities/membership-actions";
import { moodIcons, type MoodLabel } from "../home/MoodIcons";
import { createPost } from "@/lib/feed/actions";
import { MOOD_LABEL_TO_DB } from "@/types/feed";

export function CommunityDetailView({
  community,
  posts,
  isLoggedIn = true,
  isJoined,
}: {
  community: CommunityListItem | null;
  posts: CommunityPost[];
  isLoggedIn?: boolean;
  isJoined: boolean;
}) {
  const router = useRouter();
  const { flash } = useLiveToast();
  const [joined, setJoined] = useState(isJoined);
  const [memberCount, setMemberCount] = useState(community?.memberCount ?? 0);
  const [composerText, setComposerText] = useState("");
  const [selectedMood, setSelectedMood] = useState<MoodLabel | null>(null);
  const [posting, setPosting] = useState(false);

  const moods: MoodLabel[] = ["Happy", "Calm", "Stressed", "Sad", "Anxious"];

  const handleCreateCommunityPost = async () => {
    if (!isLoggedIn) {
      router.push(routes.login);
      return;
    }
    if (!composerText.trim()) return;
    if (!selectedMood) {
      flash("Pick a mood before posting");
      return;
    }

    setPosting(true);
    try {
      const result = await createPost({
        content: composerText,
        mood: MOOD_LABEL_TO_DB[selectedMood],
        communityId: community!.id,
      });

      if (result.error) {
        flash(result.error);
        return;
      }
      setComposerText("");
      setSelectedMood(null);
      flash("Posted to " + community!.name);
      router.refresh(); // re-fetches posts from the server component
    } finally {
      setPosting(false);
    }
  };

  if (!community) {
    return (
      <MemberAppShell isLoggedIn={isLoggedIn}>
        <div className="mx-auto max-w-3xl rounded-[20px] border border-munity-border bg-white p-8 text-center">
          <p className="text-munity-muted">
            This community could not be found.
          </p>
          <Link
            href={routes.communities}
            className="mt-4 inline-block font-semibold text-munity-green"
          >
            Back to communities
          </Link>
        </div>
      </MemberAppShell>
    );
  }

  const handleToggleMembership = async () => {
    if (!isLoggedIn) {
      router.push(routes.login);
      return;
    }
    const wasJoined = joined;
    setJoined(!wasJoined);
    setMemberCount((c) => (wasJoined ? Math.max(0, c - 1) : c + 1));

    try {
      if (wasJoined) {
        await leaveCommunity(community!.id);
      } else {
        await joinCommunity(community!.id);
      }
      flash(
        wasJoined ? `Left ${community!.name}` : `Joined ${community!.name}`,
      );
    } catch (error) {
      setJoined(wasJoined);
      setMemberCount((c) => (wasJoined ? c + 1 : Math.max(0, c - 1)));
      flash(
        error instanceof Error ? error.message : "Couldn't update membership",
      );
    }
  };

  return (
    <MemberAppShell isLoggedIn={isLoggedIn}>
      <motion.div
        initial="hidden"
        animate="show"
        variants={liveStagger}
        className="mx-auto max-w-4xl"
      >
        <Link
          href={routes.communities}
          className="inline-flex items-center gap-2 text-sm font-semibold text-munity-green hover:underline"
        >
          <ArrowLeft className="size-4" /> Back to communities
        </Link>
        <motion.section
          variants={liveFadeUp}
          className="mt-6 overflow-hidden rounded-[20px] border border-munity-border bg-white"
        >
          <div
            className="h-40 bg-cover bg-center"
            style={{ backgroundImage: `url(${community.image})` }}
          />
          <div className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                {community.tag ? (
                  <span className="rounded-full bg-munity-lime px-3 py-1 text-xs font-semibold text-munity-olive-text">
                    {community.tag}
                  </span>
                ) : null}
                <h1 className="mt-3 text-3xl font-bold text-munity-green">
                  {community.name}
                </h1>
                <p className="mt-3 max-w-2xl leading-relaxed text-munity-muted">
                  {community.longDescription ?? community.description}
                </p>
                <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-munity-muted">
                  <Users className="size-4" />
                  {memberCount} member{memberCount === 1 ? "" : "s"}
                </p>
                <span className="ml-3">
                  <LivePulse
                    label="Active now"
                    count={Math.max(1, Math.round(memberCount / 40))}
                  />
                </span>
              </div>
              <button
                type="button"
                onClick={() => void handleToggleMembership()}
                className="rounded-xl bg-munity-green px-5 py-3 text-sm font-semibold text-white"
              >
                {joined ? "Leave community" : "Join community"}
              </button>
            </div>
          </div>
        </motion.section>
        <motion.section variants={liveFadeUp} className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold text-munity-text">
            Community posts
          </h2>
          <p className="text-sm font-semibold text-munity-text">
            Share something with {community.name}
          </p>
          <textarea
            value={composerText}
            onChange={(e) => setComposerText(e.target.value)}
            placeholder={`What's on your mind?`}
            className="mt-3 min-h-20 w-full resize-none rounded-2xl border border-transparent bg-munity-sidebar px-4 py-3 text-sm text-munity-text outline-none focus:border-munity-green/20 focus:bg-white"
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              {moods.map((mood) => {
                const Icon = moodIcons[mood];
                const active = selectedMood === mood;
                return (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => setSelectedMood(mood)}
                    className={`flex size-9 items-center justify-center rounded-full transition ${
                      active
                        ? "bg-munity-lime ring-2 ring-munity-green/30"
                        : "bg-munity-sidebar hover:bg-munity-lime/40"
                    }`}
                    aria-label={mood}
                  >
                    <Icon className="size-6" />
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => void handleCreateCommunityPost()}
              disabled={posting || !composerText.trim()}
              className="rounded-full bg-munity-green px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-munity-green-dark disabled:opacity-50"
            >
              {posting ? "Posting..." : "Post"}
            </button>
          </div>
          {posts.length ? (
            posts.map((post) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="rounded-[20px] border border-munity-border bg-white p-5"
              >
                <p className="font-semibold text-munity-text">{post.author}</p>
                <p className="mt-1 text-xs text-munity-muted">
                  {post.time} · {post.feeling}
                </p>
                <p className="mt-4 leading-relaxed text-munity-text">
                  {post.content}
                </p>
                <div className="mt-4 flex gap-4 text-sm text-munity-muted">
                  <span className="inline-flex items-center gap-1">
                    <Heart className="size-4" />
                    {post.supports}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle className="size-4" />
                    {post.comments}
                  </span>
                </div>
              </motion.article>
            ))
          ) : (
            <p className="rounded-[20px] bg-white p-6 text-munity-muted">
              No posts in this community yet.
            </p>
          )}
        </motion.section>
      </motion.div>
    </MemberAppShell>
  );
}
