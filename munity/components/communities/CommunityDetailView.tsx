"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, MessageCircle, Users } from "lucide-react";
import { motion } from "framer-motion";
import { MemberAppShell } from "@/components/memberlayout/MemberAppShell";
import { LivePulse, liveFadeUp, liveStagger, useLiveToast } from "@/components/live/LiveFeedback";
import { mockStore, useMockStore } from "@/lib/mock-store";
import { routes } from "@/lib/routes";

export function CommunityDetailView({
  slug,
  isLoggedIn = true,
}: {
  slug: string;
  isLoggedIn?: boolean;
}) {
  const router = useRouter();
  const store = useMockStore();
  const { flash } = useLiveToast();
  const community = store.communities.find((item) => item.slug === slug);

  if (!community) {
    return (
      <MemberAppShell isLoggedIn={isLoggedIn}>
        <div className="mx-auto max-w-3xl rounded-[20px] border border-munity-border bg-white p-8 text-center">
          <p className="text-munity-muted">This community could not be found.</p>
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

  const joined = store.memberships.includes(community.id);
  const posts = store.posts.filter((post) => post.communityId === community.id);

  return (
    <MemberAppShell isLoggedIn={isLoggedIn}>
      <motion.div initial="hidden" animate="show" variants={liveStagger} className="mx-auto max-w-4xl">
        <Link
          href={routes.communities}
          className="inline-flex items-center gap-2 text-sm font-semibold text-munity-green hover:underline"
        >
          <ArrowLeft className="size-4" /> Back to communities
        </Link>
        <motion.section variants={liveFadeUp} className="mt-6 overflow-hidden rounded-[20px] border border-munity-border bg-white">
          <div
            className="h-40 bg-cover bg-center"
            style={{ backgroundImage: `url(${community.image})` }}
          />
          <div className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="rounded-full bg-munity-lime px-3 py-1 text-xs font-semibold text-munity-olive-text">
                  {community.tag}
                </span>
                <h1 className="mt-3 text-3xl font-bold text-munity-green">
                  {community.name}
                </h1>
                <p className="mt-3 max-w-2xl leading-relaxed text-munity-muted">
                  {community.longDescription}
                </p>
                <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-munity-muted">
                  <Users className="size-4" />
                  {community.membersLabel}
                </p>
                <span className="ml-3"><LivePulse label="Active now" count={Math.max(2, Math.round(community.memberCount / 40))} /></span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!isLoggedIn) {
                    router.push(routes.login);
                    return;
                  }
                  mockStore.toggleMembership(community.id);
                  flash(joined ? `Left ${community.name}` : `Joined ${community.name}`);
                }}
                className="rounded-xl bg-munity-green px-5 py-3 text-sm font-semibold text-white"
              >
                {joined ? "Leave community" : "Join community"}
              </button>
            </div>
          </div>
        </motion.section>
        <motion.section variants={liveFadeUp} className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold text-munity-text">Community posts</h2>
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
                <p className="mt-4 leading-relaxed text-munity-text">{post.content}</p>
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
