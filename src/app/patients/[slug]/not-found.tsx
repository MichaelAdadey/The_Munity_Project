import Link from "next/link";
import { routes } from "@/lib/routes";

export default function PatientNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-munity-bg px-6 text-center">
      <h1 className="text-3xl font-bold text-munity-text">Patient not found</h1>
      <p className="mt-3 max-w-md text-munity-muted">
        We couldn&apos;t find a patient record for this link. Return to your dashboard to continue.
      </p>
      <Link
        href={routes.dashboard}
        className="mt-8 rounded-xl bg-munity-green px-8 py-3 text-sm font-semibold text-white"
      >
        Go to Dashboard
      </Link>
    </main>
  );
}
