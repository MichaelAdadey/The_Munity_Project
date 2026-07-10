"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

export function JoinCommunityButton({
  defaultJoined = false,
  className,
}: {
  defaultJoined?: boolean
  className?: string
}) {
  const [joined, setJoined] = useState(defaultJoined)

  return (
    <Button
      variant={joined ? "outline" : "default"}
      className={cn("rounded-full", className)}
      onClick={() => setJoined((v) => !v)}
    >
      {joined ? "Joined" : "Join Community"}
    </Button>
  )
}
