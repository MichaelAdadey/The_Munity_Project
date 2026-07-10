"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/Button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ImageIcon, Send } from "lucide-react"
import { initials } from "@/lib/utils"
import type { Profile } from "@/lib/types"

export function PostComposer({ user }: { user: Profile }) {
  const [text, setText] = useState("")
  const [anonymous, setAnonymous] = useState(false)

  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={user.avatar_url ?? undefined} alt={user.full_name} />
          <AvatarFallback>{initials(user.full_name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            className="min-h-20 resize-none border-0 bg-muted/50 focus-visible:ring-1"
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <Button type="button" variant="ghost" size="sm" className="text-muted-foreground">
                <ImageIcon className="size-4" />
                Photo
              </Button>
              <div className="flex items-center gap-2">
                <Switch id="anon" checked={anonymous} onCheckedChange={setAnonymous} />
                <Label htmlFor="anon" className="text-sm text-muted-foreground">
                  Post anonymously
                </Label>
              </div>
            </div>
            <Button size="sm" disabled={!text.trim()} onClick={() => setText("")}>
              <Send className="size-4" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
