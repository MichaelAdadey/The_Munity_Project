"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { submitReport, type ReportInput } from "@/lib/reports/actions";

const REASONS = [
  "Self-Harm",
  "Spam",
  "Harassment",
  "Hate Speech",
  "Misinformation",
  "Other",
] as const;

export function ReportDialog({
  open,
  onClose,
  targetType,
  targetId,
  flash,
}: {
  open: boolean;
  onClose: () => void;
  targetType: "post" | "comment";
  targetId: string;
  flash: (message: string) => void;
}) {
  const [reason, setReason] = useState<ReportInput["reason"]>("Spam");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (reason === "Other" && !details.trim()) {
      flash("Please describe the issue");
      return;
    }
    setSubmitting(true);
    try {
      const result = await submitReport({
        targetType,
        targetId,
        reason,
        reasonDetails: details,
      });
      if (result.error) {
        flash(result.error);
        return;
      }
      flash("Report submitted — thank you for helping keep Munity safe");
      setDetails("");
      setReason("Spam");
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="border border-[#d8dbcf] bg-white shadow-2xl sm:max-w-md"
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle>
            Report {targetType === "post" ? "post" : "comment"}
          </DialogTitle>
          <DialogDescription>
            Our moderation team will review this. Thank you for helping keep the
            community safe.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-munity-muted">
              Reason
            </span>
            <select
              value={reason}
              onChange={(e) =>
                setReason(e.target.value as ReportInput["reason"])
              }
              className="w-full rounded-xl border border-munity-input-border px-3 py-2.5 text-sm outline-none"
            >
              {REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          {reason === "Other" ? (
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-munity-muted">
                Please describe
              </span>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-munity-input-border px-3 py-2.5 text-sm outline-none"
              />
            </label>
          ) : null}
        </div>
        <DialogFooter className="border-munity-border bg-[#f3f4ee]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border-2 border-munity-gray bg-white px-4 py-2.5 text-sm font-semibold text-munity-text hover:bg-[#eceee6]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={submitting}
            className="rounded-xl bg-[#ba1a1a] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit report"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
