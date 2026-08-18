"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, Heart, MessageCircle } from "lucide-react";
import { MemberAppShell } from "@/components/memberlayout/MemberAppShell";
import { EditPostDialog } from "@/components/home/EditPostDialog";
import { PostOptionsMenu } from "@/components/home/PostOptionsMenu";
import { liveFadeUp, liveStagger, useLiveToast } from "@/components/live/LiveFeedback";
import { mockStore, useMockStore } from "@/lib/mock-store";
import { communityPath, routes } from "@/lib/routes";
import type { FeedPost } from "@/lib/mock-db";

export function SavedPostsView() {
  const store = useMockStore();
  const { flash } = useLiveToast();
  const [search, setSearch] = useState("");
  const [openMenuPostId, setOpenMenuPostId] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<FeedPost | null>(null);

  const savedPosts = useMemo(() => {
    // Archived posts must stay visible here even if later "Unsaved" —
    // otherwise Unsave would strand them with no way back to the feed.
    const saved = store.posts.filter(
      (post) => store.savedPostIds.includes(post.id) || post.archived,
    );
    const query = search.trim().toLowerCase();
    if (!query) return saved;
    return saved.filter(
      (post) =>
        post.content.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query) ||
        post.feeling.toLowerCase().includes(query) ||
        (post.communityName?.toLowerCase().includes(query) ?? false),
    );
  }, [search, store.posts, store.savedPostIds]);

  return (
    <MemberAppShell
      showSearch
      searchPlaceholder="Search saved posts..."
      searchValue={search}
      onSearchChange={setSearch}
    >
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-munity-muted">
            Library
          </p>
          <h1 className="mt-2 text-3xl font-bold text-munity-text">Saved Posts</h1>
          <p className="mt-1 text-base text-munity-muted">
            Resources and posts you’ve bookmarked for later
          </p>
        </header>

        {savedPosts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-[20px] border border-munity-border bg-white px-6 py-16 text-center shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
            <Bookmark className="size-8 text-munity-muted" />
            <p className="text-sm text-munity-muted">
              {search.trim()
                ? `No saved posts match “${search.trim()}”.`
                : "No saved posts yet"}
            </p>
            {search.trim() ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-sm font-semibold text-munity-green hover:underline"
              >
                Clear search
              </button>
            ) : (
              <Link
                href={routes.memberHome}
                className="text-sm font-semibold text-munity-green hover:underline"
              >
                Browse Home feed
              </Link>
            )}
          </div>
        ) : (
          <motion.div variants={liveStagger} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {savedPosts.map((post) => (
              <motion.article
                key={post.id}
                variants={liveFadeUp}
                className="group flex gap-4 rounded-[20px] border border-munity-border bg-white p-4 shadow-[0_4px_10px_rgba(85,107,47,0.05)] transition hover:border-munity-green/30 hover:bg-munity-lime/5"
              >
                <div className="min-w-0 flex-1 py-1">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-munity-muted">
                    {post.communityId && post.communityName ? (
                      <Link href={communityPath(store.communities.find((community) => community.id === post.communityId)?.slug ?? "")}>
                        {post.communityName}
                      </Link>
                    ) : "Community post"}
                    {post.archived ? (
                      <span className="rounded-full bg-munity-lime/40 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-munity-olive-text">
                        Archived
                      </span>
                    ) : null}
                  </div>
                  <h2 className="mt-2 text-base font-semibold text-munity-text group-hover:text-munity-green">
                    {post.author}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-sm text-munity-muted">{post.content}</p>
                  <p className="mt-3 flex gap-3 text-xs text-munity-muted">
                    <span className="inline-flex items-center gap-1"><Heart className="size-3" />{post.supports}</span>
                    <span className="inline-flex items-center gap-1"><MessageCircle className="size-3" />{post.comments}</span>
                  </p>
                </div>
                <div className="flex shrink-0 items-start gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      mockStore.toggleSavedPost(post.id);
                      flash("Removed from saved posts");
                    }}
                    className="mt-1 size-5 text-munity-green"
                    aria-label="Unsave post"
                  >
                    <Bookmark className="size-5 fill-current" />
                  </button>
                  <PostOptionsMenu
                    post={post}
                    isOwner={post.authorId === "me"}
                    open={openMenuPostId === post.id}
                    onOpenChange={(nextOpen) =>
                      setOpenMenuPostId(nextOpen ? post.id : null)
                    }
                    onEdit={() => setEditingPost(post)}
                    flash={flash}
                  />
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>

      <EditPostDialog
        post={editingPost}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setEditingPost(null);
        }}
        flash={flash}
      />
    </MemberAppShell>
  );
}
