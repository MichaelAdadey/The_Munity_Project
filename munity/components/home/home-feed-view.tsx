'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, MessageCircle, Plus, Sparkles } from 'lucide-react'
import {
  feedPosts,
  feedTherapists,
  homeProfile,
  joinedCommunities,
  mindfulMoment,
  moodOptions,
  suggestedGroups,
} from '@/lib/home-feed-data'
import { cn } from '@/lib/utils'

export function HomeFeedView() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [postText, setPostText] = useState('')

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-8 lg:px-10">
      <div className="grid gap-8 xl:grid-cols-[280px_minmax(0,1fr)_280px]">
        <aside className="space-y-6">
          <ProfileCard />
          <CommunitiesCard />
        </aside>

        <section className="space-y-6">
          <PostComposer
            postText={postText}
            setPostText={setPostText}
            selectedMood={selectedMood}
            setSelectedMood={setSelectedMood}
          />
          {feedPosts.map((post) => (
            <FeedPostCard key={post.id} post={post} />
          ))}
        </section>

        <aside className="space-y-6">
          <MindfulMomentCard />
          <SuggestedGroupsCard />
          <TherapistsCard />
        </aside>
      </div>

      <footer className="mt-12 border-t border-[#c5c8b8]/50 pt-8 text-xs text-[#45483c]">
        <p>
          © 2024 Munity Peer Support. For emergencies, contact local crisis services
          immediately.
        </p>
        <div className="mt-2 flex flex-wrap gap-4 font-medium">
          <a href="#" className="hover:text-[#3e5219]">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-[#3e5219]">
            Terms of Service
          </a>
          <a href="#" className="hover:text-[#3e5219]">
            Help Center
          </a>
        </div>
      </footer>
    </div>
  )
}

function ProfileCard() {
  return (
    <article className="rounded-[20px] border border-[#e5e5e1] bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
      <div className="flex flex-col items-center text-center">
        <div className="rounded-full border-4 border-[#d6e7a1] p-1">
          <Image
            src={homeProfile.avatarUrl}
            alt={homeProfile.name}
            width={80}
            height={80}
            className="size-20 rounded-full object-cover"
          />
        </div>
        <h2 className="mt-4 text-2xl font-semibold text-[#1b1c1c]">{homeProfile.name}</h2>
        <p className="text-xs font-medium text-[#45483c]">{homeProfile.tagline}</p>
        <div className="mt-4 flex w-full gap-3">
          <div className="flex-1 rounded-xl bg-[#efeded] px-3 py-3 text-center">
            <p className="text-sm font-semibold text-[#3e5219]">{homeProfile.dayStreak}</p>
            <p className="text-xs text-[#45483c]">Day Streak</p>
          </div>
          <div className="flex-1 rounded-xl bg-[#efeded] px-3 py-3 text-center">
            <p className="text-sm font-semibold text-[#3e5219]">{homeProfile.groups}</p>
            <p className="text-xs text-[#45483c]">Groups</p>
          </div>
        </div>
      </div>
    </article>
  )
}

function CommunitiesCard() {
  return (
    <article className="rounded-[20px] border border-[#e5e5e1] bg-white p-5 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-[#1b1c1c]">Your Communities</h3>
        <button
          type="button"
          aria-label="Add community"
          className="text-[#3e5219] hover:opacity-70"
        >
          <Plus className="size-5" />
        </button>
      </div>
      <ul className="space-y-5">
        {joinedCommunities.map((community) => (
          <li key={community.id} className="flex items-center gap-3">
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-[#3e5219]"
              style={{ backgroundColor: community.color }}
            >
              {community.initial}
            </span>
            <div className="min-w-0">
              <p className="truncate font-semibold text-[#1b1c1c]">{community.name}</p>
              <p className="text-xs text-[#45483c]">{community.activity}</p>
            </div>
          </li>
        ))}
      </ul>
      <Link
        href="/Communities"
        className="mt-5 block text-center text-xs font-medium text-[#3e5219] hover:underline"
      >
        View all communities
      </Link>
    </article>
  )
}

function PostComposer({
  postText,
  setPostText,
  selectedMood,
  setSelectedMood,
}: {
  postText: string
  setPostText: (v: string) => void
  selectedMood: string | null
  setSelectedMood: (v: string | null) => void
}) {
  return (
    <article className="rounded-[20px] border border-[#e5e5e1] bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
      <div className="flex gap-4">
        <Image
          src={homeProfile.avatarUrl}
          alt=""
          width={48}
          height={48}
          className="size-12 shrink-0 rounded-full object-cover"
        />
        <textarea
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder={`What's on your mind, ${homeProfile.name.split(' ')[0]}?`}
          className="min-h-[100px] flex-1 resize-none rounded-2xl bg-[#f5f3f3] p-4 text-sm text-[#1b1c1c] outline-none placeholder:text-[#45483c]/70 focus:ring-2 focus:ring-[#3e5219]/20"
        />
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {['Mood', 'Photo', 'Anonymous'].map((label) => (
            <button
              key={label}
              type="button"
              className="rounded-lg bg-[#efeded] px-4 py-2 text-xs font-medium text-[#45483c] hover:bg-[#d6e7a1]/40"
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="rounded-full bg-[#3e5219] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          Post
        </button>
      </div>

      <div className="mt-4 flex justify-between rounded-2xl border border-[#c5c8b8]/30 bg-[#fbf9f8] p-4">
        {moodOptions.map((mood) => (
          <button
            key={mood.label}
            type="button"
            onClick={() =>
              setSelectedMood(selectedMood === mood.label ? null : mood.label)
            }
            className={cn(
              'flex flex-col items-center gap-1',
              selectedMood === mood.label && 'opacity-100',
            )}
          >
            <span
              className="flex size-10 items-center justify-center rounded-full text-lg"
              style={{ backgroundColor: mood.bg }}
            >
              {mood.emoji}
            </span>
            <span className="text-xs text-[#45483c]">{mood.label}</span>
          </button>
        ))}
      </div>
    </article>
  )
}

function FeedPostCard({ post }: { post: (typeof feedPosts)[number] }) {
  return (
    <article className="rounded-[20px] border border-[#e5e5e1] bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#d6e7a1] text-sm font-bold text-[#3e5219]">
          {post.isAnonymous ? '?' : post.author[0]}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-[#1b1c1c]">{post.author}</p>
            <span className="text-xs text-[#45483c]">{post.timeAgo}</span>
          </div>
          <p className="mt-1 text-sm text-[#45483c]">
            Feeling {post.mood} {post.moodEmoji}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-[#45483c]">{post.content}</p>

      {post.imageUrl && (
        <div className="mt-4 overflow-hidden rounded-2xl">
          <Image
            src={post.imageUrl}
            alt=""
            width={640}
            height={360}
            className="h-auto w-full object-cover"
          />
        </div>
      )}

      <div className="mt-4 flex items-center gap-4 text-sm text-[#45483c]">
        <button type="button" className="inline-flex items-center gap-1.5 hover:text-[#3e5219]">
          <Heart className="size-4" />
          {post.supportCount}
        </button>
        <button type="button" className="inline-flex items-center gap-1.5 hover:text-[#3e5219]">
          <MessageCircle className="size-4" />
          {post.commentCount}
        </button>
      </div>
    </article>
  )
}

function MindfulMomentCard() {
  return (
    <article className="rounded-[20px] border border-[#e5e5e1] bg-[#556b2f] p-6">
      <div className="flex items-center gap-2 text-[#d0eba1]">
        <Sparkles className="size-4" />
        <p className="text-sm font-semibold uppercase tracking-wide">Mindful Moment</p>
      </div>
      <p className="mt-4 text-base italic leading-relaxed text-[#d0eba1]">{mindfulMoment}</p>
      <button
        type="button"
        className="mt-4 text-xs text-[#d0eba1] underline underline-offset-2 hover:opacity-80"
      >
        Try it now
      </button>
    </article>
  )
}

function SuggestedGroupsCard() {
  return (
    <article className="rounded-[20px] border border-[#e5e5e1] bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
      <h3 className="mb-4 font-semibold text-[#1b1c1c]">Suggested Groups</h3>
      <ul className="space-y-4">
        {suggestedGroups.map((group) => (
          <li key={group.id} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex size-10 items-center justify-center rounded-full bg-[#d9eaa3] text-sm font-bold text-[#3e5219]">
                {group.initial}
              </span>
              <div>
                <p className="text-xs font-medium text-[#1b1c1c]">{group.name}</p>
                <p className="text-[10px] text-[#45483c]">{group.members}</p>
              </div>
            </div>
            <button
              type="button"
              className="rounded-lg border border-[#3e5219] px-3 py-1 text-xs font-medium text-[#3e5219] hover:bg-[#d6e7a1]/30"
            >
              Join
            </button>
          </li>
        ))}
      </ul>
    </article>
  )
}

function TherapistsCard() {
  return (
    <article className="rounded-[20px] border border-[#e5e5e1] bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-[#1b1c1c]">Available Therapists</h3>
        <Link href="/Therapy" className="text-xs font-medium text-[#3e5219] hover:underline">
          See all
        </Link>
      </div>
      <ul className="space-y-5">
        {feedTherapists.map((therapist) => (
          <li key={therapist.id} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Image
                src={therapist.avatarUrl}
                alt={therapist.name}
                width={40}
                height={40}
                className="size-10 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-medium text-[#1b1c1c]">{therapist.name}</p>
                <p className="text-[10px] text-[#45483c]">{therapist.specialty}</p>
              </div>
            </div>
            <span
              className={cn(
                'size-2 rounded-full',
                therapist.status === 'online' ? 'bg-[#22c55e]' : 'bg-[#fb923c]',
              )}
            />
          </li>
        ))}
      </ul>
    </article>
  )
}
