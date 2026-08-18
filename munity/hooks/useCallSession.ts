"use client";

import { useCallback, useEffect, useState } from "react";
import { useCallMedia } from "@/hooks/useCallMedia";

export type CallMode = "voice" | "video";
export type CallPhase = "connecting" | "connected";

export function formatCallDuration(seconds: number) {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

/**
 * Shared connecting/duration/minimize state machine for an in-progress call,
 * plus the real camera/mic media behind it (via useCallMedia). Presentation
 * lives in <CallOverlay>; any chat surface (member or therapist) can drive
 * one of these with just a "start a call" button.
 */
export function useCallSession() {
  const [callMode, setCallMode] = useState<CallMode | null>(null);
  const [callPhase, setCallPhase] = useState<CallPhase>("connecting");
  const [callSeconds, setCallSeconds] = useState(0);
  const [minimized, setMinimized] = useState(false);
  const media = useCallMedia();
  const { start: startMedia, stop: stopMedia } = media;

  useEffect(() => {
    if (!callMode) return;
    setCallPhase("connecting");
    setCallSeconds(0);
    setMinimized(false);
    // Permissions are only ever requested here, once a call has actually
    // been started — never on mount or page load.
    startMedia(callMode);
    const connectTimer = window.setTimeout(() => setCallPhase("connected"), 1400);
    return () => window.clearTimeout(connectTimer);
  }, [callMode, startMedia]);

  useEffect(() => {
    if (!callMode || callPhase !== "connected") return;
    const tick = window.setInterval(() => {
      setCallSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(tick);
  }, [callMode, callPhase]);

  const start = useCallback((mode: CallMode) => {
    setCallMode(mode);
  }, []);

  /** Ends the call, stops all media tracks, and returns a summary for logging. */
  const end = useCallback(() => {
    const kind = callMode === "video" ? "Video call" : "Voice call";
    const duration = callPhase === "connected" ? formatCallDuration(callSeconds) : "0:00";
    stopMedia();
    setCallMode(null);
    setCallPhase("connecting");
    setCallSeconds(0);
    setMinimized(false);
    return { kind, duration };
  }, [callMode, callPhase, callSeconds, stopMedia]);

  return {
    callMode,
    callPhase,
    callSeconds,
    minimized,
    setMinimized,
    media,
    start,
    end,
  };
}

export type CallSession = ReturnType<typeof useCallSession>;
