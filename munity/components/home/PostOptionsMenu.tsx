"use client";

import { useState } from "react";
import { Archive, ArchiveRestore, Copy, Flag, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mockStore } from "@/lib/mock-store";
import { routes } from "@/lib/routes";
import type { FeedPost } from "@/lib/mock-db";

interface PostOptionsMenuProps {
  post: FeedPost;
  isOwner: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  flash: (message: string) => void;
}

const reportReasons = [
  "Spam or misleading",
  "Harassment or hate speech",
  "Self-harm or safety concern",
  "Something else",
];

export function PostOptionsMenu({
  post,
  isOwner,
  open,
  onOpenChange,
  onEdit,
  flash,
}: PostOptionsMenuProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  function handleCopyLink() {
    const link = `${window.location.origin}${routes.memberHome}?post=${post.id}`;
    navigator.clipboard
      .writeText(link)
      .then(() => flash("Link copied."))
      .catch(() => flash("Couldn't copy link — please try again."));
  }

  function handleArchive() {
    mockStore.archivePost(post.id);
    flash("Post archived — moved to Saved Posts");
  }

  function handleUnarchive() {
    mockStore.unarchivePost(post.id);
    flash("Post restored to Home Feed");
  }

  function handleDelete() {
    mockStore.deletePost(post.id);
    setConfirmDelete(false);
    flash("Post deleted");
  }

  function handleReport(reason: string) {
    mockStore.reportPost(post.id, reason);
    setReportOpen(false);
    flash("Post reported to moderators");
  }

  return (
    <>
      <DropdownMenu open={open} onOpenChange={onOpenChange}>
        <DropdownMenuTrigger
          className="rounded-full p-1.5 text-munity-muted transition hover:bg-munity-sidebar hover:text-munity-text"
          aria-label="Post options"
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={6}
          className="min-w-56 border border-munity-border bg-white p-1.5 text-munity-text shadow-[0_16px_40px_rgba(62,82,25,0.12)]"
        >
          {isOwner ? (
            <>
              <DropdownMenuItem
                className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium text-munity-text focus:bg-munity-lime/50 focus:text-munity-olive-text"
                onClick={onEdit}
              >
                <Pencil className="size-4 text-munity-green" />
                Edit post
              </DropdownMenuItem>
              {post.archived ? (
                <DropdownMenuItem
                  className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium text-munity-text focus:bg-munity-lime/50 focus:text-munity-olive-text"
                  onClick={handleUnarchive}
                >
                  <ArchiveRestore className="size-4 text-munity-green" />
                  Unarchive post
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium text-munity-text focus:bg-munity-lime/50 focus:text-munity-olive-text"
                  onClick={handleArchive}
                >
                  <Archive className="size-4 text-munity-green" />
                  Archive post
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="my-1 bg-munity-divider" />
              <DropdownMenuItem
                className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium text-munity-text focus:bg-munity-lime/50 focus:text-munity-olive-text"
                onClick={handleCopyLink}
              >
                <Copy className="size-4 text-munity-green" />
                Copy link
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 bg-munity-divider" />
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium focus:bg-red-50 dark:focus:bg-red-950/40"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 className="size-4" />
                Delete post
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem
                className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium text-munity-text focus:bg-munity-lime/50 focus:text-munity-olive-text"
                onClick={handleCopyLink}
              >
                <Copy className="size-4 text-munity-green" />
                Copy link
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 bg-munity-divider" />
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium focus:bg-red-50 dark:focus:bg-red-950/40"
                onClick={() => setReportOpen(true)}
              >
                <Flag className="size-4" />
                Report post
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete post?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="rounded-xl border border-munity-input-border px-4 py-2 text-sm font-semibold text-munity-text transition hover:bg-munity-sidebar"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report post</DialogTitle>
            <DialogDescription>
              Let us know why this post doesn&apos;t belong on Munity. Our moderators will
              review it.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-1.5">
            {reportReasons.map((reason) => (
              <button
                key={reason}
                type="button"
                onClick={() => handleReport(reason)}
                className="rounded-xl border border-munity-input-border px-4 py-2.5 text-left text-sm font-medium text-munity-text transition hover:border-munity-green hover:bg-munity-lime/30"
              >
                {reason}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
