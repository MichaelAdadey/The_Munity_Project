"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Stethoscope } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn, initials, timeAgo } from "@/lib/utils"
import type { Conversation } from "@/lib/types"

export function ConversationList({ conversations }: { conversations: Conversation[] }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="shrink-0 border-b border-border p-4">
        <h1 className="text-lg font-semibold tracking-tight">Messages</h1>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search conversations" className="h-9 pl-9" aria-label="Search conversations" />
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <nav className="flex flex-col p-2">
          {conversations.map((conversation) => {
            const active = pathname === `/messages/${conversation.id}`
            return (
              <Link
                key={conversation.id}
                href={`/messages/${conversation.id}`}
                className={cn(
                  "flex items-start gap-3 rounded-xl px-3 py-3 transition-colors",
                  active ? "bg-accent" : "hover:bg-accent/50",
                )}
              >
                <Avatar className="size-11 shrink-0 border border-border">
                  <AvatarFallback className="bg-accent text-accent-foreground text-sm">
                    {initials(conversation.participant_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold">
                      {conversation.participant_name}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {timeAgo(conversation.last_message_at)}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    {conversation.is_therapist && (
                      <Stethoscope className="size-3 shrink-0 text-primary" />
                    )}
                    <p
                      className={cn(
                        "truncate text-sm text-muted-foreground",
                        conversation.unread_count > 0 && "font-medium text-foreground",
                      )}
                    >
                      {conversation.last_message}
                    </p>
                  </div>
                </div>
                {conversation.unread_count > 0 && (
                  <Badge className="mt-1 h-5 min-w-5 shrink-0 justify-center rounded-full px-1.5 text-xs">
                    {conversation.unread_count}
                  </Badge>
                )}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>
    </div>
  )
}
