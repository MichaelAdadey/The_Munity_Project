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
import { updatePost } from "@/lib/feed/actions";
import { uploadPostImage } from "@/lib/feed/upload-image";
import type { FeedPost } from "@/types/feed";

interface EditPostDialogProps {
  post: FeedPost | null;
  onOpenChange: (open: boolean) => void;
  flash: (message: string) => void;
  onSaved: () => void;
}

export function EditPostDialog({
  post,
  onOpenChange,
  flash,
  onSaved,
}: EditPostDialogProps) {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  if (post && post.id !== editingPostId) {
    setEditingPostId(post.id);
    setContent(post.content);
    setImageUrl(post.imageUrl);
  }

  async function handlePickFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadPostImage(file);
      if ("error" in result) {
        flash(result.error);
        return;
      }
      setImageUrl(result.url);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!post) return;
    if (!content.trim() && !imageUrl) return;

    setSaving(true);
    try {
      const result = await updatePost({ postId: post.id, content, imageUrl });
      if (result.error) {
        flash(result.error);
        return;
      }
      flash("Post updated");
      onSaved();
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={post !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit post</DialogTitle>
          <DialogDescription>
            Update your post&apos;s text or photo.
          </DialogDescription>
        </DialogHeader>

        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={5}
          placeholder="What's on your mind?"
          className="w-full resize-none rounded-xl border border-munity-input-border bg-munity-bg p-3 text-sm text-munity-text outline-none transition focus:border-munity-green focus:shadow-[0_0_0_3px_rgba(62,82,25,0.12)]"
        />

        {imageUrl ? (
          <div className="relative overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Post attachment"
              className="max-h-64 w-full object-cover"
            />
            <button
              type="button"
              onClick={() => setImageUrl(null)}
              className="absolute right-3 top-3 rounded-full bg-black/55 p-2 text-white backdrop-blur-sm"
              aria-label="Remove photo"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-munity-input-border px-3 py-2 text-xs font-semibold text-munity-text hover:bg-munity-sidebar">
            {uploading ? "Uploading..." : "Add a photo"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={handlePickFile}
            />
          </label>
        )}

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
            onClick={() => void handleSave()}
            disabled={saving || (!content.trim() && !imageUrl)}
            className="rounded-xl bg-munity-green px-4 py-2 text-sm font-semibold text-white transition hover:bg-munity-green-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
