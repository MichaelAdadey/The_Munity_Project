"use client";

import { useState, useTransition } from "react";
import { approveTherapist, rejectTherapist } from "@/app/admin/therapy/actions";

type TherapistRow = {
  profile_id: string;
  professional_title: string | null;
  licensing_body: string | null;
  license_number: string | null;
  years_of_experience: number | null;
  verification_status: string | null;
  specialties: string[] | null;
  profiles: { first_name: string; last_name: string; email: string } | null;
};

export function AdminTherapyReviewView({
  adminName,
  therapists,
}: {
  adminName: string;
  therapists: TherapistRow[];
}) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [rows, setRows] = useState(therapists);

  function handleApprove(id: string) {
    startTransition(async () => {
      const result = await approveTherapist(id);
      if (result?.error) {
        setMessage(`Error: ${result.error}`);
      } else {
        setMessage("Therapist approved.");
        setRows((prev) => prev.filter((t) => t.profile_id !== id));
      }
    });
  }

  function handleReject(id: string) {
    startTransition(async () => {
      const result = await rejectTherapist(id);
      if (result?.error) {
        setMessage(`Error: ${result.error}`);
      } else {
        setMessage("Therapist rejected.");
        setRows((prev) => prev.filter((t) => t.profile_id !== id));
      }
    });
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold text-munity-text">Therapist Verification Queue</h1>
      <p className="mt-1 text-sm text-munity-muted">Signed in as {adminName}</p>

      {message ? (
        <div className="mt-4 rounded-lg bg-munity-lime/40 px-4 py-2 text-sm text-munity-olive-text">
          {message}
        </div>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-2xl border border-munity-border bg-white">
        {rows.length === 0 ? (
          <p className="p-6 text-sm text-munity-muted">No pending applications.</p>
        ) : (
          rows.map((t) => (
            <div
              key={t.profile_id}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-munity-border p-5 last:border-0"
            >
              <div>
                <p className="font-semibold text-munity-text">
                  {t.profiles?.first_name} {t.profiles?.last_name}
                </p>
                <p className="text-sm text-munity-muted">
                  {t.professional_title} · {t.licensing_body} · License #{t.license_number}
                </p>
                <p className="text-xs text-munity-muted">
                  {t.years_of_experience ?? 0} yrs experience ·{" "}
                  {(t.specialties ?? []).join(", ") || "No specialties listed"}
                </p>
                <p className="text-xs text-munity-muted">{t.profiles?.email}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleApprove(t.profile_id)}
                  className="rounded-lg bg-munity-green px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleReject(t.profile_id)}
                  className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
