"use client";

import Link from "next/link";
import { Bookmark, Heart, MessageCircle } from "lucide-react";
import { MemberAppShell } from "@/components/memberlayout/MemberAppShell";
import { mockStore, useMockStore } from "@/lib/mock-store";
import { communityPath, routes } from "@/lib/routes";

export function SavedPostsView() {
  const store = useMockStore();
  const savedPosts = store.posts.filter((post) => store.savedPostIds.includes(post.id));
  return (
    <MemberAppShell>
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
            <p className="text-sm text-munity-muted">No saved posts yet</p>
            <Link
              href={routes.memberHome}
              className="text-sm font-semibold text-munity-green hover:underline"
            >
              Browse resources
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {savedPosts.map((post) => (
              <article
                key={post.id}
                className="group flex gap-4 rounded-[20px] border border-munity-border bg-white p-4 shadow-[0_4px_10px_rgba(85,107,47,0.05)] transition hover:border-munity-green/30 hover:bg-munity-lime/5"
              >
                <div className="min-w-0 flex-1 py-1">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-munity-muted">
                    {post.communityId && post.communityName ? (
                      <Link href={communityPath(store.communities.find((community) => community.id === post.communityId)?.slug ?? "")}>
                        {post.communityName}
                      </Link>
                    ) : "Community post"}
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
                <button
                  type="button"
                  onClick={() => mockStore.toggleSavedPost(post.id)}
                  className="mt-1 size-5 shrink-0 text-munity-green"
                  aria-label="Unsave post"
                >
                  <Bookmark className="size-5 fill-current" />
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </MemberAppShell>
  );
}
