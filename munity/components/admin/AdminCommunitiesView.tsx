"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Plus, ShieldCheck, ShieldOff, Trash2 } from "lucide-react";
import { AdminAppShell } from "@/components/admin/AdminAppShell";
import { useLiveToast } from "@/components/live/LiveFeedback";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createCommunity,
  setCommunityVerified,
  deleteCommunity,
  type CommunityInput,
} from "@/lib/admin/communities-actions";
import { uploadResourceMedia } from "@/lib/resources/media-upload";
import { communityPath } from "@/lib/routes";
import type { AdminCommunity } from "@/lib/admin/communities-queries";

function emptyDraft(): CommunityInput {
  return {
    name: "",
    tag: "",
    description: "",
    longDescription: "",
    category: "",
    imageUrl: null,
  };
}

export function AdminCommunitiesView({
  adminName,
  communities,
}: {
  adminName: string;
  communities: AdminCommunity[];
}) {
  const { flash } = useLiveToast();
  const [items, setItems] = useState(communities);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<CommunityInput>(emptyDraft());
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  async function handleImageUpload(file: File) {
    setUploadingImage(true);
    try {
      const result = await uploadResourceMedia(file, "image");
      if ("error" in result) {
        flash(result.error);
        return;
      }
      setDraft((d) => ({ ...d, imageUrl: result.url }));
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleCreate() {
    setSaving(true);
    try {
      const result = await createCommunity(draft);
      if (result.error) {
        flash(result.error);
        return;
      }
      flash(`Created ${draft.name}`);
      setCreating(false);
      setDraft(emptyDraft());
      window.location.reload();
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleVerified(community: AdminCommunity) {
    const next = !community.verified;
    try {
      await setCommunityVerified(community.id, next);
      setItems((current) =>
        current.map((c) =>
          c.id === community.id ? { ...c, verified: next } : c,
        ),
      );
      flash(next ? "Community verified" : "Verification removed");
    } catch (err) {
      flash(
        err instanceof Error ? err.message : "Couldn't update verification",
      );
    }
  }

  async function handleDelete(community: AdminCommunity) {
    if (
      !window.confirm(
        `Delete "${community.name}" permanently? Memberships will be removed and its posts will be un-categorized. This cannot be undone.`,
      )
    )
      return;
    try {
      await deleteCommunity(community.id);
      setItems((current) => current.filter((c) => c.id !== community.id));
      flash("Community deleted");
    } catch (err) {
      flash(err instanceof Error ? err.message : "Couldn't delete community");
    }
  }

  return (
    <AdminAppShell adminName={adminName} title="Community Management">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-munity-muted">
            {items.length} total communities
          </p>
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-munity-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-munity-green-dark"
          >
            <Plus className="size-4" />
            New community
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {items.map((community) => (
            <article
              key={community.id}
              className="rounded-2xl border border-munity-border bg-white p-5"
            >
              <div className="flex items-start gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-munity-sidebar">
                  {community.image ? (
                    <Image
                      src={community.image}
                      alt={community.name}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-semibold text-munity-text">
                    {community.name}
                  </p>
                  <p className="mt-1 text-sm text-munity-muted">
                    {community.memberCount} member
                    {community.memberCount === 1 ? "" : "s"}
                    {community.tag ? ` · ${community.tag}` : ""}
                  </p>
                </div>
                <Link
                  href={communityPath(community.slug)}
                  className="shrink-0 rounded-lg bg-munity-lime/60 px-3 py-1.5 text-xs font-semibold text-munity-olive-text transition hover:bg-munity-lime"
                >
                  View
                </Link>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-munity-muted">
                  {community.verified
                    ? "Verified community"
                    : "Verification pending"}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void handleToggleVerified(community)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-munity-border px-3 py-1.5 text-xs font-semibold text-munity-text transition hover:bg-munity-sidebar"
                  >
                    {community.verified ? (
                      <>
                        <ShieldOff className="size-3.5" />
                        Unverify
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="size-3.5" />
                        Verify
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(community)}
                    className="rounded-lg p-1.5 text-[#93000a] transition hover:bg-red-50"
                    aria-label="Delete community"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Dialog
        open={creating}
        onOpenChange={(open) => !open && setCreating(false)}
      >
        <DialogContent
          className="max-h-[85vh] overflow-y-auto border border-[#d8dbcf] bg-white shadow-2xl sm:max-w-md"
          showCloseButton
        >
          <DialogHeader>
            <DialogTitle>New community</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-munity-muted">
                Name
              </span>
              <input
                value={draft.name}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, name: e.target.value }))
                }
                className="w-full rounded-xl border border-munity-input-border px-3 py-2.5 text-sm outline-none"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-munity-muted">
                Category
              </span>
              <input
                value={draft.category}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, category: e.target.value }))
                }
                placeholder="Freeform, e.g. Student Support"
                className="w-full rounded-xl border border-munity-input-border px-3 py-2.5 text-sm outline-none"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-munity-muted">
                Short tag
              </span>
              <input
                value={draft.tag}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, tag: e.target.value }))
                }
                className="w-full rounded-xl border border-munity-input-border px-3 py-2.5 text-sm outline-none"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-munity-muted">
                Short description
              </span>
              <textarea
                value={draft.description}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, description: e.target.value }))
                }
                rows={2}
                className="w-full resize-none rounded-xl border border-munity-input-border px-3 py-2.5 text-sm outline-none"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-munity-muted">
                Long description
              </span>
              <textarea
                value={draft.longDescription}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, longDescription: e.target.value }))
                }
                rows={4}
                className="w-full resize-none rounded-xl border border-munity-input-border px-3 py-2.5 text-sm outline-none"
              />
            </label>
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-munity-muted">
                Cover image
              </span>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-munity-input-border px-3 py-2 text-xs font-semibold text-munity-text hover:bg-munity-sidebar">
                {uploadingImage ? "Uploading..." : "Upload image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingImage}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (file) void handleImageUpload(file);
                  }}
                />
              </label>
            </div>
          </div>
          <DialogFooter className="border-munity-border bg-[#f3f4ee]">
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="rounded-xl border-2 border-munity-gray bg-white px-4 py-2.5 text-sm font-semibold text-munity-text hover:bg-[#eceee6]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleCreate()}
              disabled={saving}
              className="rounded-xl bg-munity-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-munity-green-dark disabled:opacity-60"
            >
              {saving ? "Creating..." : "Create"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminAppShell>
  );
}
