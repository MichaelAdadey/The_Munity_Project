"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BadgeCheck, Users } from "lucide-react"
import { formatCount } from "@/lib/utils"
import type { Community } from "@/lib/types"

export function CommunityCard({ community }: { community: Community }) {
  const [joined, setJoined] = useState(false)

  return (
    <Card className="group overflow-hidden pt-0">
      <Link href={`/communities/${community.slug}`} className="relative block aspect-[16/9] overflow-hidden">
        <Image
          src={community.image_url || "/placeholder.svg"}
          alt={community.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {community.verified && (
          <Badge className="absolute left-3 top-3 gap-1 bg-background/90 text-foreground backdrop-blur">
            <BadgeCheck className="size-3.5 text-primary" />
            Verified
          </Badge>
        )}
      </Link>
      <div className="px-5 pb-5">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/communities/${community.slug}`} className="font-semibold hover:underline">
            {community.name}
          </Link>
          <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
            <Users className="size-3.5" />
            {formatCount(community.member_count)}
          </span>
        </div>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{community.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="font-normal">
            {community.category}
          </Badge>
        </div>
        <Button
          variant={joined ? "outline" : "default"}
          className="mt-4 w-full"
          onClick={() => setJoined((v) => !v)}
        >
          {joined ? "Joined" : "Join Community"}
        </Button>
      </div>
    </Card>
  )
}
