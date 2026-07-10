import Link from "next/link"
import { Star, Video, MapPin } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { initials } from "@/lib/utils"
import type { Therapist } from "@/lib/types"

export function TherapistCard({ therapist }: { therapist: Therapist }) {
  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-start gap-3">
        <Avatar className="size-14 border border-border">
          <AvatarImage src={therapist.avatar_url || undefined} alt={therapist.full_name} />
          <AvatarFallback className="bg-accent text-accent-foreground">
            {initials(therapist.full_name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <Link href={`/therapy/${therapist.id}`} className="font-semibold hover:underline">
            {therapist.full_name}
          </Link>
          <p className="text-sm text-muted-foreground">{therapist.title}</p>
          <div className="mt-1 flex items-center gap-1 text-sm">
            <Star className="size-3.5 fill-primary text-primary" />
            <span className="font-medium">{therapist.rating}</span>
            <span className="text-muted-foreground">({therapist.review_count})</span>
          </div>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {therapist.bio}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {therapist.specializations.map((s) => (
          <Badge key={s} variant="secondary" className="font-normal">
            {s}
          </Badge>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="size-3.5" />
          {therapist.location}
        </span>
        <span className="flex items-center gap-1">
          <Video className="size-3.5" />
          {therapist.session_types.join(" · ")}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
        <div>
          <span className="font-semibold">${therapist.hourly_rate}</span>
          <span className="text-sm text-muted-foreground">/session</span>
        </div>
        <Button asChild size="sm" className="rounded-full">
          <Link href={`/therapy/${therapist.id}`}>View Profile</Link>
        </Button>
      </div>
    </Card>
  )
}
