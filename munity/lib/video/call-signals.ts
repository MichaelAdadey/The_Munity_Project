"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

export async function sendCallSignal(threadId: string, mode: "voice" | "video"): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to start a call");

  const { error } = await supabase
    .from("call_signals")
    .insert({ thread_id: threadId, caller_id: user.id, mode });
  if (error) throw new Error(error.message);
}

export type IncomingCall = {
  mode: "voice" | "video";
  callerId: string;
};

/** Listens for a call signal in this specific thread, from someone else,
 *  while this hook is mounted (i.e. while the thread is open). */
export function useIncomingCall(threadId: string | null, onIncoming: (call: IncomingCall) => void) {
  const onIncomingRef = useRef(onIncoming);
  useEffect(() => {
    onIncomingRef.current = onIncoming;
  }, [onIncoming]);

  useEffect(() => {
    if (!threadId) return;
    const supabase = createClient();
    let myUserId: string | null = null;

    const channel = supabase
      .channel(`call-signals-${threadId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "call_signals", filter: `thread_id=eq.${threadId}` },
        (payload) => {
          const row = payload.new as { caller_id: string; mode: "voice" | "video" };
          if (row.caller_id === myUserId) return; // ignore our own outgoing signal
          onIncomingRef.current({ mode: row.mode, callerId: row.caller_id });
        },
      )
      .subscribe();

    void supabase.auth.getUser().then(({ data }) => {
      myUserId = data.user?.id ?? null;
    });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [threadId]);
}