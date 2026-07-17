import { Suspense } from "react";
import { MessagesView } from "@/components/messages/MessagesView";

export default function MessagesPage() {
  return (
    <Suspense fallback={null}>
      <MessagesView />
    </Suspense>
  );
}
