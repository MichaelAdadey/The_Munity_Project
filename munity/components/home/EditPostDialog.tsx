"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mockStore } from "@/lib/mock-store";
import type { FeedPost } from "@/lib/mock-db";

interface EditPostDialogProps {
  post: FeedPost | null;
  onOpenChange: (open: boolean) => void;
  flash: (message: string) => void;
}

export function EditPostDialog({ post, onOpenChange, flash }: EditPostDialogProps) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);

  // Re-seed the draft whenever a different post is opened for editing.
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  if (post && post.id !== editingPostId) {
    setEditingPostId(post.id);
    setContent(post.content);
    setImage(post.image);
  }

  function handleSave() {
    if (!post) return;
    if (!content.trim() && !image) return;
    mockStore.updatePost(post.id, { content, image });
    flash("Post updated");
    onOpenChange(false);
  }

  return (
    <Dialog open={post !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit post</DialogTitle>
          <DialogDescription>Update your post&apos;s text or photo.</DialogDescription>
        </DialogHeader>

        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={5}
          placeholder="What's on your mind?"
          className="w-full resize-none rounded-xl border border-munity-input-border bg-munity-bg p-3 text-sm text-munity-text outline-none transition focus:border-munity-green focus:shadow-[0_0_0_3px_rgba(62,82,25,0.12)]"
        />

        {image ? (
          <div className="relative overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="Post attachment" className="max-h-64 w-full object-cover" />
            <button
              type="button"
              onClick={() => setImage(null)}
              className="absolute right-3 top-3 rounded-full bg-black/55 p-2 text-white backdrop-blur-sm"
              aria-label="Remove photo"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : null}

        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-xl border border-munity-input-border px-4 py-2 text-sm font-semibold text-munity-text transition hover:bg-munity-sidebar"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!content.trim() && !image}
            className="rounded-xl bg-munity-green px-4 py-2 text-sm font-semibold text-white transition hover:bg-munity-green-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save changes
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
