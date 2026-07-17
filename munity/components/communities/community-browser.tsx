"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { CommunityCard } from "@/components/community-card"
import { cn } from "@/lib/utils"
import type { Community } from "@/lib/types"

export function CommunityBrowser({
  communities,
  categories,
}: {
  communities: Community[]
  categories: string[]
}) {
  const [query, setQuery] = useState("")
  const [active, setActive] = useState("All")

  const filtered = useMemo(() => {
    return communities.filter((c) => {
      const matchesCategory = active === "All" || c.category === active
      const matchesQuery =
        !query ||
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase()) ||
        c.category.toLowerCase().includes(query.toLowerCase())
      return matchesCategory && matchesQuery
    })
  }, [communities, active, query])

  const filters = ["All", ...categories]

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search communities..."
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActive(filter)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              active === filter
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-muted",
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">No communities match your search.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      )}
    </div>
  )
}
