"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminAppShell } from "@/components/admin/AdminAppShell";
import { useLiveToast } from "@/components/live/LiveFeedback";
import {
  approveModeratorApplication,
  rejectModeratorApplication,
} from "@/lib/admin/moderator-applications-actions";
import type { AdminModeratorApplication } from "@/lib/admin/moderator-applications-queries";

export function AdminModeratorApplicationsView({
  adminName,
  applications,
}: {
  adminName: string;
  applications: AdminModeratorApplication[];
}) {
  const router = useRouter();
  const { flash } = useLiveToast();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleDecision(id: string, decision: "approve" | "reject") {
    setBusyId(id);
    try {
      const result =
        decision === "approve"
          ? await approveModeratorApplication(id)
          : await rejectModeratorApplication(id);
      if (result.error) {
        flash(result.error);
        return;
      }
      flash(
        decision === "approve"
          ? "Application approved"
          : "Application rejected",
      );
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  const pending = applications.filter((a) => a.status === "pending");
  const decided = applications.filter((a) => a.status !== "pending");

  return (
    <AdminAppShell adminName={adminName} title="Moderator Applications">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <p className="rounded-xl bg-munity-lime/30 px-4 py-3 text-sm text-munity-olive-text">
          Approving an application records the decision and notifies the
          applicant. No moderator permissions are granted automatically yet —
          that system isn&apos;t built.
        </p>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-munity-text">
            Pending ({pending.length})
          </h2>
          <div className="overflow-hidden rounded-2xl border border-munity-border bg-white">
            {pending.length === 0 ? (
              <p className="p-6 text-sm text-munity-muted">
                No pending applications.
              </p>
            ) : (
              pending.map((app) => (
                <div
                  key={app.id}
                  className="flex flex-wrap items-start justify-between gap-3 border-b border-munity-border p-5 last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-munity-text">
                      {app.applicantName}
                    </p>
                    <p className="text-sm text-munity-muted">
                      {app.applicantEmail}
                    </p>
                    <p className="mt-2 text-sm text-munity-text">
                      Wants to moderate:{" "}
                      <span className="font-semibold">{app.focus}</span>
                    </p>
                    {app.why ? (
                      <p className="mt-1 text-sm italic text-munity-muted">
                        &quot;{app.why}&quot;
                      </p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      disabled={busyId === app.id}
                      onClick={() => void handleDecision(app.id, "approve")}
                      className="rounded-lg bg-munity-green px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={busyId === app.id}
                      onClick={() => void handleDecision(app.id, "reject")}
                      className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {decided.length > 0 ? (
          <section>
            <h2 className="mb-4 text-lg font-semibold text-munity-text">
              Past decisions
            </h2>
            <div className="overflow-hidden rounded-2xl border border-munity-border bg-white">
              {decided.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between gap-3 border-b border-munity-border p-5 last:border-0"
                >
                  <div>
                    <p className="font-semibold text-munity-text">
                      {app.applicantName}
                    </p>
                    <p className="text-sm text-munity-muted">{app.focus}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      app.status === "approved"
                        ? "bg-munity-lime/60 text-munity-olive-text"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </AdminAppShell>
  );
}
