import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/Button"
import { Progress } from "@/components/ui/progress"
import { Flame, Sparkles, Users, Wind } from "lucide-react"
import { formatCount } from "@/lib/utils"
import type { Community } from "@/lib/types"

export function HomeSidebar({ suggested }: { suggested: Community[] }) {
  return (
    <aside className="hidden w-80 shrink-0 space-y-5 lg:block">
      <Card className="overflow-hidden">
        <div className="bg-primary p-5 text-primary-foreground">
          <div className="flex items-center gap-2">
            <Wind className="size-5" />
            <h3 className="font-semibold">Daily Anchor</h3>
          </div>
          <p className="mt-2 text-sm text-primary-foreground/90">
            Take 3 deep breaths. Focus on the sensation of air entering your lungs.
          </p>
          <Button asChild variant="secondary" size="sm" className="mt-4 w-full">
            <Link href="/emergency#breathe">Start Breathing Exercise</Link>
          </Button>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="size-5 text-primary" />
            <h3 className="font-semibold">Wellness Streak</h3>
          </div>
          <span className="text-2xl font-bold tabular-nums">14</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">14 days of consistent mindfulness</p>
        <Progress value={70} className="mt-3" />
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          <h3 className="font-semibold">Suggested for you</h3>
        </div>
        <ul className="mt-4 space-y-4">
          {suggested.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <Link href={`/communities/${c.slug}`} className="block truncate text-sm font-medium hover:underline">
                  {c.name}
                </Link>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="size-3" />
                  {formatCount(c.member_count)} members
                </span>
              </div>
              <Button size="sm" variant="outline" className="shrink-0">
                Join
              </Button>
            </li>
          ))}
        </ul>
        <Button asChild variant="ghost" size="sm" className="mt-3 w-full">
          <Link href="/communities">Explore All</Link>
        </Button>
      </Card>
    </aside>
  )
}
