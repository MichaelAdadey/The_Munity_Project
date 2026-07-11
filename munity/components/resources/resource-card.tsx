'use client'

import Image from 'next/image'
import { ArrowRight, Clock, Play } from 'lucide-react'
import type { Resource } from '@/lib/types'
import { cn } from '@/lib/utils'

const formatLabels: Record<Resource['type'], string> = {
  article: 'Article',
  video: 'Video',
  guide: 'Guide',
  meditation: 'Meditation',
  journal: 'Journal',
  exercise: 'Exercise',
}

export function ResourceCard({ resource }: { resource: Resource }) {
  const isVideo = resource.type === 'video'

  return (
    <article className="flex flex-col overflow-hidden rounded-[20px] border border-[#c5c8b8] bg-white shadow-sm">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={resource.image_url}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="flex size-10 items-center justify-center rounded-full bg-white/90">
              <Play className="ml-0.5 size-5 fill-[#3e5219] text-[#3e5219]" />
            </div>
          </div>
        )}
        <span className="absolute bottom-3 left-3 rounded-lg bg-white/90 px-2 py-1 text-xs font-medium text-[#3e5219] backdrop-blur-sm">
          {formatLabels[resource.type]}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-tight text-[#3e5219]">
            {resource.category}
          </span>
          {resource.duration && (
            <span className="font-medium text-[#45483c]">{resource.duration}</span>
          )}
        </div>
        <h3 className="mb-3 text-xl leading-snug text-[#1b1c1c]">{resource.title}</h3>
        <p className="mb-4 line-clamp-2 flex-1 text-sm leading-5 text-[#45483c]">
          {resource.description}
        </p>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-base text-[#3e5219] hover:underline"
        >
          {resource.action_label ?? 'Read More'}
          <ArrowRight className="size-4" />
        </button>
      </div>
    </article>
  )
}

export function FeaturedResourceCard({ resource }: { resource: Resource }) {
  return (
    <article className="overflow-hidden rounded-[20px] border border-[#c5c8b8] bg-white shadow-[0_4px_20px_rgba(85,107,47,0.05)]">
      <div className="grid md:grid-cols-2">
        <div className="relative min-h-[280px] md:min-h-[466px]">
          <Image
            src={resource.image_url}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          <span className="absolute left-4 top-4 rounded-full bg-[#3e5219] px-3 py-1 text-xs font-medium uppercase tracking-wide text-white">
            Featured Guide
          </span>
        </div>
        <div className="flex flex-col justify-center p-8">
          <div className="mb-3 flex items-center gap-2 text-xs font-medium text-[#3e5219]">
            <Clock className="size-3.5" />
            {resource.duration}
          </div>
          <h2 className="mb-4 text-[32px] font-bold leading-tight text-[#1b1c1c]">
            {resource.title}
          </h2>
          <p className="mb-6 text-base leading-relaxed text-[#45483c]">{resource.description}</p>
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="rounded-xl bg-[#3e5219] px-6 py-3 text-base text-white transition-opacity hover:opacity-90"
            >
              {resource.action_label ?? 'Start Reading'}
            </button>
            <button
              type="button"
              aria-label="Bookmark"
              className="text-[#3e5219] hover:opacity-70"
            >
              <BookmarkIcon />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function BookmarkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('size-4', className)}
      viewBox="0 0 16 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M2 2.5C2 1.67 2.67 1 3.5 1H12.5C13.33 1 14 1.67 14 2.5V17L8 13.5L2 17V2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}
