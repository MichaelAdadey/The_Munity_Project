import { Suspense } from "react";
import { TherapistMessagesView } from "@/components/therapistmessages/TherapistMessagesView";
import { requireMockRole } from "@/lib/require-session";

export default async function TherapistMessagesPage() {
  await requireMockRole("therapist");
  return (
    <Suspense fallback={null}>
      <TherapistMessagesView />
    </Suspense>
  );
}
