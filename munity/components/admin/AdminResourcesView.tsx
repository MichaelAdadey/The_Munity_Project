"use client";

import Image from "next/image";
import { useState } from "react";
import { Pencil, Plus, Trash2, Upload } from "lucide-react";
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
  saveResource,
  deleteResource,
  setResourceStatus,
  type ResourceInput,
} from "@/lib/admin/resources-actions";
import { uploadResourceMedia } from "@/lib/resources/media-upload";
import type { AdminResource } from "@/lib/admin/resources-queries";

const CATEGORIES = [
  "Anxiety",
  "Depression",
  "Stress",
  "Grief",
  "Relationships",
  "Addiction",
] as const;
const TYPES = ["Article", "Video", "Guide", "Exercise"] as const;

type CaptionCue = { start: number; end: number; text: string };

function emptyDraft(): ResourceInput {
  return {
    title: "",
    description: "",
    category: "Anxiety",
    type: "Article",
    duration: "",
    imageUrl: null,
    cta: "Read More",
    isFeatured: false,
    featuredBadge: null,
    bodyParagraphs: [],
    videoUrl: null,
    captions: [],
    status: "draft",
  };
}

function toDraft(resource: AdminResource): ResourceInput {
  return {
    id: resource.id,
    title: resource.title,
    description: resource.description,
    category: resource.category,
    type: resource.type,
    duration: resource.duration,
    imageUrl: resource.imageUrl,
    cta: resource.cta,
    isFeatured: resource.isFeatured,
    featuredBadge: resource.featuredBadge,
    bodyParagraphs: resource.bodyParagraphs,
    videoUrl: resource.videoUrl,
    captions: resource.captions,
    status: resource.status,
  };
}

export function AdminResourcesView({
  adminName,
  resources,
}: {
  adminName: string;
  resources: AdminResource[];
}) {
  const { flash } = useLiveToast();
  const [items, setItems] = useState(resources);
  const [editing, setEditing] = useState<ResourceInput | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  function openCreate() {
    setEditing(emptyDraft());
  }

  function openEdit(resource: AdminResource) {
    setEditing(toDraft(resource));
  }

  function updateDraft(patch: Partial<ResourceInput>) {
    setEditing((current) => (current ? { ...current, ...patch } : current));
  }

  function addCaptionCue() {
    if (!editing) return;
    updateDraft({
      captions: [...editing.captions, { start: 0, end: 0, text: "" }],
    });
  }

  function updateCaptionCue(index: number, patch: Partial<CaptionCue>) {
    if (!editing) return;
    const next = editing.captions.map((cue, i) =>
      i === index ? { ...cue, ...patch } : cue,
    );
    updateDraft({ captions: next });
  }

  function removeCaptionCue(index: number) {
    if (!editing) return;
    updateDraft({ captions: editing.captions.filter((_, i) => i !== index) });
  }

  async function handleImageUpload(file: File) {
    setUploadingImage(true);
    try {
      const result = await uploadResourceMedia(file, "image");
      if ("error" in result) {
        flash(result.error);
        return;
      }
      updateDraft({ imageUrl: result.url });
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleVideoUpload(file: File) {
    setUploadingVideo(true);
    try {
      const result = await uploadResourceMedia(file, "video");
      if ("error" in result) {
        flash(result.error);
        return;
      }
      updateDraft({ videoUrl: result.url });
    } finally {
      setUploadingVideo(false);
    }
  }

  async function handleSave() {
    if (!editing) return;
    if (!editing.title.trim()) {
      flash("Title is required");
      return;
    }
    setSaving(true);
    try {
      const result = await saveResource(editing);
      if (result.error) {
        flash(result.error);
        return;
      }
      flash(editing.id ? "Resource updated" : "Resource created");
      setEditing(null);
      // Optimistic-ish: just reload from the server for correctness rather
      // than hand-merging the shape back into AdminResource.
      window.location.reload();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (
      !window.confirm(
        "Delete this resource permanently? This cannot be undone.",
      )
    )
      return;
    try {
      await deleteResource(id);
      setItems((current) => current.filter((r) => r.id !== id));
      flash("Resource deleted");
    } catch (err) {
      flash(err instanceof Error ? err.message : "Couldn't delete resource");
    }
  }

  async function handleToggleStatus(resource: AdminResource) {
    const nextStatus = resource.status === "published" ? "draft" : "published";
    try {
      await setResourceStatus(resource.id, nextStatus);
      setItems((current) =>
        current.map((r) =>
          r.id === resource.id ? { ...r, status: nextStatus } : r,
        ),
      );
      flash(nextStatus === "published" ? "Published" : "Unpublished");
    } catch (err) {
      flash(err instanceof Error ? err.message : "Couldn't update status");
    }
  }

  return (
    <AdminAppShell adminName={adminName} title="Resources">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-munity-muted">
            {items.length} total resources
          </p>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-munity-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-munity-green-dark"
          >
            <Plus className="size-4" />
            New resource
          </button>
        </div>

        <div className="overflow-hidden rounded-[20px] border border-munity-border bg-white">
          {items.length === 0 ? (
            <p className="p-8 text-center text-sm text-munity-muted">
              No resources yet.
            </p>
          ) : (
            items.map((resource) => (
              <div
                key={resource.id}
                className="flex flex-wrap items-center gap-4 border-b border-munity-border p-5 last:border-0"
              >
                <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-munity-sidebar">
                  {resource.imageUrl ? (
                    <Image
                      src={resource.imageUrl}
                      alt={resource.title}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-munity-text">
                    {resource.title}
                  </p>
                  <p className="text-sm text-munity-muted">
                    {resource.category} · {resource.type} · {resource.viewCount}{" "}
                    views
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    resource.status === "published"
                      ? "bg-munity-lime/60 text-munity-olive-text"
                      : "bg-[#eae8e7] text-munity-muted"
                  }`}
                >
                  {resource.status}
                </span>
                <button
                  type="button"
                  onClick={() => void handleToggleStatus(resource)}
                  className="rounded-lg border border-munity-border px-3 py-1.5 text-xs font-semibold text-munity-text transition hover:bg-munity-sidebar"
                >
                  {resource.status === "published" ? "Unpublish" : "Publish"}
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(resource)}
                  className="rounded-lg p-2 text-munity-muted transition hover:bg-munity-sidebar hover:text-munity-text"
                  aria-label="Edit"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(resource.id)}
                  className="rounded-lg p-2 text-[#93000a] transition hover:bg-red-50"
                  aria-label="Delete"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <Dialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent
          className="max-h-[85vh] overflow-y-auto border border-[#d8dbcf] bg-white shadow-2xl sm:max-w-2xl"
          showCloseButton
        >
          <DialogHeader>
            <DialogTitle>
              {editing?.id ? "Edit resource" : "New resource"}
            </DialogTitle>
          </DialogHeader>

          {editing ? (
            <div className="space-y-4">
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-munity-muted">
                  Title
                </span>
                <input
                  value={editing.title}
                  onChange={(e) => updateDraft({ title: e.target.value })}
                  className="w-full rounded-xl border border-munity-input-border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-munity-green/30"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-munity-muted">
                  Description
                </span>
                <textarea
                  value={editing.description}
                  onChange={(e) => updateDraft({ description: e.target.value })}
                  rows={2}
                  className="w-full resize-none rounded-xl border border-munity-input-border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-munity-green/30"
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-munity-muted">
                    Category
                  </span>
                  <select
                    value={editing.category}
                    onChange={(e) => updateDraft({ category: e.target.value })}
                    className="w-full rounded-xl border border-munity-input-border px-3 py-2.5 text-sm outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-munity-muted">
                    Type
                  </span>
                  <select
                    value={editing.type}
                    onChange={(e) =>
                      updateDraft({
                        type: e.target.value as ResourceInput["type"],
                      })
                    }
                    className="w-full rounded-xl border border-munity-input-border px-3 py-2.5 text-sm outline-none"
                  >
                    {TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-munity-muted">
                    Duration label
                  </span>
                  <input
                    value={editing.duration}
                    onChange={(e) => updateDraft({ duration: e.target.value })}
                    placeholder="e.g. 8 min read"
                    className="w-full rounded-xl border border-munity-input-border px-3 py-2.5 text-sm outline-none"
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-munity-muted">
                    Button label
                  </span>
                  <input
                    value={editing.cta}
                    onChange={(e) => updateDraft({ cta: e.target.value })}
                    className="w-full rounded-xl border border-munity-input-border px-3 py-2.5 text-sm outline-none"
                  />
                </label>
              </div>

              <label className="flex items-center gap-2 text-sm text-munity-text">
                <input
                  type="checkbox"
                  checked={editing.isFeatured}
                  onChange={(e) =>
                    updateDraft({ isFeatured: e.target.checked })
                  }
                  className="size-4 accent-munity-green"
                />
                Featured for this category
              </label>
              {editing.isFeatured ? (
                <input
                  value={editing.featuredBadge ?? ""}
                  onChange={(e) =>
                    updateDraft({ featuredBadge: e.target.value || null })
                  }
                  placeholder="Badge text, e.g. Featured Guide"
                  className="w-full rounded-xl border border-munity-input-border px-3 py-2.5 text-sm outline-none"
                />
              ) : null}

              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-munity-muted">
                  Cover image
                </span>
                <div className="flex items-center gap-3">
                  {editing.imageUrl ? (
                    <div className="relative size-16 overflow-hidden rounded-xl bg-munity-sidebar">
                      <Image
                        src={editing.imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-munity-input-border px-3 py-2 text-xs font-semibold text-munity-text hover:bg-munity-sidebar">
                    <Upload className="size-3.5" />
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

              {editing.type === "Video" ? (
                <>
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-munity-muted">
                      Video file
                    </span>
                    <div className="flex items-center gap-3">
                      {editing.videoUrl ? (
                        <p className="max-w-xs truncate text-xs text-munity-muted">
                          {editing.videoUrl}
                        </p>
                      ) : null}
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-munity-input-border px-3 py-2 text-xs font-semibold text-munity-text hover:bg-munity-sidebar">
                        <Upload className="size-3.5" />
                        {uploadingVideo ? "Uploading..." : "Upload video"}
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          disabled={uploadingVideo}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            e.target.value = "";
                            if (file) void handleVideoUpload(file);
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-munity-muted">
                        Captions
                      </span>
                      <button
                        type="button"
                        onClick={addCaptionCue}
                        className="text-xs font-semibold text-munity-green hover:underline"
                      >
                        + Add caption
                      </button>
                    </div>
                    {editing.captions.map((cue, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="number"
                          value={cue.start}
                          onChange={(e) =>
                            updateCaptionCue(index, {
                              start: Number(e.target.value),
                            })
                          }
                          className="w-16 rounded-lg border border-munity-input-border px-2 py-1.5 text-xs"
                          placeholder="start"
                        />
                        <input
                          type="number"
                          value={cue.end}
                          onChange={(e) =>
                            updateCaptionCue(index, {
                              end: Number(e.target.value),
                            })
                          }
                          className="w-16 rounded-lg border border-munity-input-border px-2 py-1.5 text-xs"
                          placeholder="end"
                        />
                        <input
                          value={cue.text}
                          onChange={(e) =>
                            updateCaptionCue(index, { text: e.target.value })
                          }
                          className="flex-1 rounded-lg border border-munity-input-border px-2 py-1.5 text-xs"
                          placeholder="Caption text"
                        />
                        <button
                          type="button"
                          onClick={() => removeCaptionCue(index)}
                          className="text-xs font-semibold text-[#93000a] hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-munity-muted">
                    Body (separate paragraphs with a blank line)
                  </span>
                  <textarea
                    value={editing.bodyParagraphs.join("\n\n")}
                    onChange={(e) =>
                      updateDraft({
                        bodyParagraphs: e.target.value
                          .split(/\n\s*\n/)
                          .map((p) => p.trim())
                          .filter(Boolean),
                      })
                    }
                    rows={8}
                    className="w-full resize-none rounded-xl border border-munity-input-border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-munity-green/30"
                  />
                </label>
              )}

              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-munity-muted">
                  Status
                </span>
                <select
                  value={editing.status}
                  onChange={(e) =>
                    updateDraft({
                      status: e.target.value as "draft" | "published",
                    })
                  }
                  className="w-full rounded-xl border border-munity-input-border px-3 py-2.5 text-sm outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>
            </div>
          ) : null}

          <DialogFooter className="border-munity-border bg-[#f3f4ee]">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-xl border-2 border-munity-gray bg-white px-4 py-2.5 text-sm font-semibold text-munity-text hover:bg-[#eceee6]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className="rounded-xl bg-munity-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-munity-green-dark disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminAppShell>
  );
}
