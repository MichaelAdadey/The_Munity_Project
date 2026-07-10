'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Share2 } from 'lucide-react'
import type { Post } from '@/lib/types'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/Button'
import { cn, initials, timeAgo } from '@/lib/utils'

export function PostCard({ post }: { post: Post }) {
  const [supported, setSupported] = useState(false)
  const [saved, setSaved] = useState(false)
  const supportCount = post.support_count + (supported ? 1 : 0)
  const displayName = post.is_anonymous ? 'Anonymous Member' : post.author.full_name

  return (
    <Card className="border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <Avatar className="size-10 border border-border">
          <AvatarFallback className="bg-accent text-accent-foreground text-sm">
            {post.is_anonymous ? '?' : initials(post.author.full_name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold">{displayName}</span>
            {post.community_name && (
              <span className="truncate text-xs text-muted-foreground">
                in {post.community_name}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">{timeAgo(post.created_at)}</span>
        </div>
        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground" aria-label="Post options">
          <MoreHorizontal className="size-4" />
        </Button>
      </div>

      <p className="mt-3 text-pretty text-sm leading-relaxed text-foreground">{post.content}</p>

      {post.image_url && (
        <div className="mt-3 overflow-hidden rounded-2xl border border-border">
          <Image
            src={post.image_url || '/placeholder.svg'}
            alt="Post attachment"
            width={640}
            height={360}
            className="h-auto w-full object-cover"
          />
        </div>
      )}

      {post.is_anonymous && (
        <Badge variant="secondary" className="mt-3 rounded-full text-xs">
          Anonymous Post
        </Badge>
      )}

      <div className="mt-4 flex items-center gap-1 text-muted-foreground">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSupported((s) => !s)}
          className={cn('gap-1.5 rounded-full', supported && 'text-primary')}
        >
          <Heart className={cn('size-4', supported && 'fill-current')} />
          {supportCount}
        </Button>
        <Button variant="ghost" size="sm" className="gap-1.5 rounded-full">
          <MessageCircle className="size-4" />
          {post.comment_count}
        </Button>
        <Button variant="ghost" size="sm" className="gap-1.5 rounded-full">
          <Share2 className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSaved((s) => !s)}
          className={cn('ml-auto size-8 rounded-full', saved && 'text-primary')}
          aria-label="Save post"
        >
          <Bookmark className={cn('size-4', saved && 'fill-current')} />
        </Button>
      </div>
    </Card>
  )
}
