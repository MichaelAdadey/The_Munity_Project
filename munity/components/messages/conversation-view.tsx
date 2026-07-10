"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, MoreVertical, Send, Stethoscope } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn, initials, timeAgo } from "@/lib/utils"
import type { Conversation, Message } from "@/lib/types"

export function ConversationView({
  conversation,
  initialMessages,
}: {
  conversation: Conversation
  initialMessages: Message[]
}) {
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState("")

  function send() {
    const text = draft.trim()
    if (!text) return
    setMessages((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        conversation_id: conversation.id,
        sender_id: "me",
        is_self: true,
        content: text,
        created_at: new Date().toISOString(),
      },
    ])
    setDraft("")
  }

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col bg-background">
      <header className="flex shrink-0 items-center gap-3 border-b border-border p-4">
        <Link href="/messages" className="md:hidden" aria-label="Back to conversations">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <Avatar className="size-9 border border-border">
          <AvatarFallback className="bg-accent text-accent-foreground text-sm">
            {initials(conversation.participant_name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-semibold">{conversation.participant_name}</span>
            {conversation.is_therapist && <Stethoscope className="size-3.5 text-primary" />}
          </div>
          <span className="text-xs text-muted-foreground">
            {conversation.is_therapist ? "Licensed therapist" : "Peer support"}
          </span>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="More options">
          <MoreVertical className="size-4" />
        </Button>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn("flex", message.is_self ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[65%]",
                message.is_self
                  ? "rounded-br-sm bg-primary text-primary-foreground"
                  : "rounded-bl-sm bg-muted text-foreground",
              )}
            >
              <p className="text-pretty">{message.content}</p>
              <span
                className={cn(
                  "mt-1 block text-[11px]",
                  message.is_self ? "text-primary-foreground/70" : "text-muted-foreground",
                )}
              >
                {timeAgo(message.created_at)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="shrink-0 border-t border-border p-3">
        <div className="flex items-end gap-2">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            placeholder="Write a message..."
            className="min-h-11 flex-1 resize-none"
            rows={1}
          />
          <Button size="icon" className="shrink-0 rounded-full" onClick={send} disabled={!draft.trim()}>
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
