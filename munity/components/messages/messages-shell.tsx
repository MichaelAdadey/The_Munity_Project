"use client"

import { usePathname } from "next/navigation"
import { ConversationList } from "@/components/messages/conversation-list"
import { cn } from "@/lib/utils"
import type { Conversation } from "@/lib/types"

export function MessagesShell({
  conversations,
  children,
}: {
  conversations: Conversation[]
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const hasActiveConversation = pathname !== "/messages"

  return (
    <div className="mx-auto flex h-[calc(100dvh-4rem-4.5rem)] max-w-6xl px-0 lg:h-[calc(100dvh-4rem)] lg:px-8 lg:py-6">
      <div className="flex w-full overflow-hidden rounded-none border-0 lg:rounded-2xl lg:border lg:border-border">
        <div
          className={cn(
            "w-full shrink-0 md:w-80 md:border-r md:border-border",
            hasActiveConversation && "hidden md:block",
          )}
        >
          <ConversationList conversations={conversations} />
        </div>
        <div
          className={cn(
            "min-w-0 flex-1",
            hasActiveConversation ? "flex" : "hidden md:flex",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
