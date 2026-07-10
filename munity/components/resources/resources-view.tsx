'use client'

import { useMemo, useState } from 'react'
import {
  Brain,
  CloudRain,
  Frown,
  Heart,
  HeartHandshake,
  Search,
  Wind,
} from 'lucide-react'
import { FeaturedResourceCard, ResourceCard } from '@/components/resources/resource-card'
import {
  getFeaturedResource,
  getLatestResources,
  getSavedResources,
  getTrendingTopics,
  resourceCategories,
} from '@/lib/data'
import type { ResourceCategory } from '@/lib/types'
import { cn } from '@/lib/utils'

const categoryIcons: Record<ResourceCategory, React.ComponentType<{ className?: string }>> = {
  Anxiety: Brain,
  Depression: CloudRain,
  Stress: Wind,
  Grief: Frown,
  Relationships: Heart,
  Addiction: HeartHandshake,
}

export function ResourcesView() {
  const featured = getFeaturedResource()
  const latest = getLatestResources()
  const saved = getSavedResources()
  const trending = getTrendingTopics()

  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<ResourceCategory | 'All'>('All')

  const filteredLatest = useMemo(() => {
    return latest.filter((resource) => {
      const matchesCategory =
        activeCategory === 'All' || resource.category === activeCategory
      const q = query.toLowerCase()
      const matchesQuery =
        !q ||
        resource.title.toLowerCase().includes(q) ||
        resource.description.toLowerCase().includes(q) ||
        resource.category.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [latest, activeCategory, query])

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-8 lg:px-10">
      <div className="flex flex-col gap-12 xl:flex-row xl:items-start xl:gap-8">
        <div className="min-w-0 flex-1 space-y-12">
          <section className="space-y-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl space-y-2">
                <h1 className="text-4xl font-bold tracking-tight text-[#3e5219] lg:text-5xl">
                  Resource Hub
                </h1>
                <p className="text-lg leading-relaxed text-[#45483c]">
                  Curated knowledge and therapeutic tools to support your journey toward nurtured
                  stability.
                </p>
              </div>
              <div className="relative w-full max-w-sm shrink-0">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#6b7280]" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search articles, videos, and guides..."
                  className="w-full rounded-2xl border border-[#c5c8b8] bg-white py-4 pl-12 pr-4 text-base text-[#1b1c1c] shadow-sm outline-none placeholder:text-[#6b7280] focus:border-[#3e5219] focus:ring-2 focus:ring-[#3e5219]/20"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {resourceCategories.map((category) => {
                const Icon = categoryIcons[category]
                const active = activeCategory === category
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      setActiveCategory(active ? 'All' : category)
                    }
                    className={cn(
                      'flex min-w-[120px] flex-col items-center gap-2.5 rounded-2xl border px-6 py-4 transition-colors',
                      active
                        ? 'border-[#3e5219] bg-[#d6e7a1] text-[#3e5219]'
                        : 'border-[#c5c8b8] bg-white text-[#1b1c1c] hover:border-[#3e5219]/40',
                    )}
                  >
                    <Icon className="size-6" />
                    <span className="text-sm font-semibold tracking-wide">{category}</span>
                  </button>
                )
              })}
            </div>
          </section>

          <FeaturedResourceCard resource={featured} />

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-[#1b1c1c]">Latest Content</h2>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-base text-[#3e5219] hover:underline"
              >
                View All
                <span aria-hidden>→</span>
              </button>
            </div>

            {filteredLatest.length === 0 ? (
              <p className="py-12 text-center text-[#45483c]">
                No resources match your search.
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredLatest.slice(0, 3).map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="w-full shrink-0 space-y-6 xl:w-72">
          <section className="rounded-[20px] border border-[#c5c8b8] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#45483c]/70">
                Saved for Later
              </h3>
              <span className="rounded-full bg-[#d6e7a1] px-2 py-0.5 text-xs font-semibold text-[#5a682f]">
                {saved.length} Items
              </span>
            </div>
            <ul className="space-y-4">
              {saved.map((item) => (
                <li key={item.id} className="border-b border-[#c5c8b8]/40 pb-4 last:border-0 last:pb-0">
                  <p className="text-sm font-semibold leading-snug text-[#1b1c1c]">{item.title}</p>
                  <p className="mt-1 text-xs capitalize text-[#3e5219]">{item.type}</p>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="mt-4 text-sm font-medium text-[#3e5219] hover:underline"
            >
              View All Saved
            </button>
          </section>

          <section className="rounded-[20px] border border-[#c5c8b8] bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#45483c]/70">
              Trending Now
            </h3>
            <ol className="space-y-5">
              {trending.map((topic) => (
                <li key={topic.id} className="flex gap-3">
                  <span className="text-lg font-bold text-[#d6e7a1]">
                    {String(topic.rank).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-sm font-semibold leading-snug text-[#1b1c1c]">
                      {topic.title}
                    </p>
                    <p className="mt-1 text-xs text-[#45483c]">{topic.reads}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-[20px] bg-[#3e5219] p-6 text-white">
            <h3 className="text-xl font-bold leading-tight">
              Need Immediate Help?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/85">
              Connect with a certified peer counselor or therapist within 15 minutes.
            </p>
            <button
              type="button"
              className="mt-5 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#3e5219] transition-opacity hover:opacity-90"
            >
              Get Support
            </button>
          </section>
        </aside>
      </div>

      <footer className="mt-16 border-t border-[#c5c8b8]/50 pt-8">
        <div className="flex flex-col gap-6 text-sm text-[#45483c] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-bold text-[#3e5219]">Munity</p>
            <p className="mt-1 max-w-md text-xs">
              © 2024 Munity Peer Support. For emergencies, contact local crisis services
              immediately.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-medium">
            <a href="/emergency" className="hover:text-[#3e5219]">
              Emergency Support
            </a>
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
        </div>
      </footer>
    </div>
  )
}
