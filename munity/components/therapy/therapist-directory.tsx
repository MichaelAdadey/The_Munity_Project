"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { TherapistCard } from "@/components/therapy/therapist-card"
import { cn } from "@/lib/utils"
import type { Therapist } from "@/lib/types"

export function TherapistDirectory({
  therapists,
  specializations,
}: {
  therapists: Therapist[]
  specializations: string[]
}) {
  const [query, setQuery] = useState("")
  const [active, setActive] = useState("All")

  const filtered = useMemo(() => {
    return therapists.filter((t) => {
      const matchesSpecialization = active === "All" || t.specializations.includes(active)
      const q = query.toLowerCase()
      const matchesQuery =
        !q ||
        t.full_name.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.specializations.some((s) => s.toLowerCase().includes(q))
      return matchesSpecialization && matchesQuery
    })
  }, [therapists, active, query])

  const filters = ["All", ...specializations]

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, title, or specialization..."
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
        <p className="py-12 text-center text-muted-foreground">
          No therapists match your search.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((therapist) => (
            <TherapistCard key={therapist.id} therapist={therapist} />
          ))}
        </div>
      )}
    </div>
  )
}
