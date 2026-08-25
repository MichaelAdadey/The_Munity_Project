"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, Heart, MessageCircle } from "lucide-react";
import { MemberAppShell } from "@/components/memberlayout/MemberAppShell";
// import { EditPostDialog } from "@/components/home/EditPostDialog";
// import { PostOptionsMenu } from "@/components/home/PostOptionsMenu";
import { liveFadeUp, liveStagger, useLiveToast } from "@/components/live/LiveFeedback";
// import { mockStore, useMockStore } from "@/lib/mock-store";
import { routes } from "@/lib/routes";
import { useSavedPosts } from "@/hooks/saved-posts";
import { toggleSavePost } from "@/lib/feed/actions";

export function SavedPostsView() {
  const {posts, commentsByPost, loading, error, refresh} = useSavedPosts();
  const { flash } = useLiveToast();
  const [search, setSearch] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null)

  const savedPosts = useMemo(() => {
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

  const handleUnsave = async (postId: string) => {
    setRemovingId(postId);
    try {
      await toggleSavePost(postId)
      flash("Removed from saved posts");
      refresh()
    } catch (error) {
      flash(error instanceof Error ? error.message : "Couldn't remove post")
    } finally {
      setRemovingId(null)
    }
  }

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
            Resources and posts you&apos;ve bookmarked for later
          </p>
        </header>

        {loading ? (
          <div className="flex items-center justify-center rounded-[20px] border border-munity-border bg-white px-6 py-16 text-sm text-munity-muted shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
            Loading saved posts…
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 rounded-[20px] border border-munity-border bg-white px-6 py-16 text-center shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
            <p className="text-sm text-red-600">{error}</p>
            <button
              type="button"
              onClick={refresh}
              className="text-sm font-semibold text-munity-green hover:underline"
            >
              Try again
            </button>
          </div>
        ) : savedPosts.length === 0 ? (
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
                    {/* {post.communityId && post.communityName ? (
                      <Link href={communityPath(store.communities.find((community) => community.id === post.communityId)?.slug ?? "")}>
                        {post.communityName}
                      </Link>
                    ) : "Community post"} */} Community post
                  </div>
                  <h2 className="mt-2 text-base font-semibold text-munity-text group-hover:text-munity-green">
                    {post.author}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-sm text-munity-muted">{post.content}</p>
                  <p className="mt-3 flex gap-3 text-xs text-munity-muted">
                    <span className="inline-flex items-center gap-1"><Heart className="size-3" />{post.supportCount}</span>
                    <span className="inline-flex items-center gap-1"><MessageCircle className="size-3" />{commentsByPost[post.id]?.length ?? post.commentCount}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleUnsave(post.id)}
                  disabled={removingId === post.id}
                  className="mt-1 size-5 shrink-0 text-munity-green"
                  aria-label="Unsave post"
                >
                  <Bookmark className="size-5 fill-current" />
                </button>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>

      {/* <EditPostDialog
        post={editingPost}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setEditingPost(null);
        }}
        flash={flash}
      /> */}
    </MemberAppShell>
  );
}
