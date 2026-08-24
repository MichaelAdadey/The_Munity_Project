"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CallMediaMode = "voice" | "video";
export type CallMediaStatus = "idle" | "requesting" | "ready" | "error";

function describeMediaError(err: unknown): string {
  const name = err instanceof DOMException ? err.name : "";
  switch (name) {
    case "NotAllowedError":
    case "PermissionDeniedError":
      return "Camera and microphone access was denied. Please allow access in your browser's settings to start the call.";
    case "NotFoundError":
    case "DevicesNotFoundError":
      return "No camera or microphone was found on this device.";
    case "NotReadableError":
    case "TrackStartError":
      return "Your camera or microphone is already in use by another app.";
    default:
      return "We couldn't access your camera or microphone. You can still continue, but audio/video may be unavailable.";
  }
}

/**
 * Owns the local camera/microphone stream for an in-progress call.
 *
 * This is intentionally the only place that talks to `getUserMedia` —
 * everything else (mute/camera UI state) is derived from the real
 * MediaStreamTracks it holds, so there's a single source of truth instead
 * of UI state that can drift from what the hardware is actually doing.
 *
 * There is no signaling/WebRTC layer yet, so `remoteStream` is always
 * `null` — it exists as the seam a future peer-connection implementation
 * would fill in without changing anything that consumes this hook.
 */
export function useCallMedia() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<CallMediaStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const streamRef = useRef<MediaStream | null>(null);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setStream(null);
    setStatus("idle");
    setError(null);
    setMicEnabled(true);
    setCameraEnabled(true);
  }, []);

  // Safety net: release the camera/mic indicator if the component unmounts
  // (e.g. navigation away) without an explicit end-call.
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const start = useCallback(async (mode: CallMediaMode) => {
    setStatus("requesting");
    setError(null);
    setMicEnabled(true);
    setCameraEnabled(mode === "video");

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("This browser doesn't support camera/microphone access.");
      setStatus("error");
      return;
    }

    try {
      const media = await navigator.mediaDevices.getUserMedia(
        mode === "video" ? { video: true, audio: true } : { audio: true },
      );
      streamRef.current = media;
      setStream(media);
      setStatus("ready");
    } catch (err) {
      if (mode === "video") {
        // The camera specifically may be the problem — fall back to
        // audio-only so the call can still proceed rather than failing
        // outright.
        try {
          const audioOnly = await navigator.mediaDevices.getUserMedia({ audio: true });
          streamRef.current = audioOnly;
          setStream(audioOnly);
          setCameraEnabled(false);
          setStatus("ready");
          setError("Camera unavailable — continuing with audio only.");
          return;
        } catch (audioErr) {
          setError(describeMediaError(audioErr));
          setStatus("error");
          return;
        }
      }
      setError(describeMediaError(err));
      setStatus("error");
    }
  }, []);

  const toggleMic = useCallback(() => {
    const tracks = streamRef.current?.getAudioTracks() ?? [];
    if (tracks.length === 0) return;
    const nextEnabled = !tracks[0].enabled;
    tracks.forEach((track) => {
      track.enabled = nextEnabled;
    });
    setMicEnabled(nextEnabled);
  }, []);

  const toggleCamera = useCallback(() => {
    const tracks = streamRef.current?.getVideoTracks() ?? [];
    if (tracks.length === 0) return;
    const nextEnabled = !tracks[0].enabled;
    tracks.forEach((track) => {
      track.enabled = nextEnabled;
    });
    setCameraEnabled(nextEnabled);
  }, []);

  return {
    stream,
    /** Always null until a real signaling/WebRTC layer supplies the peer's stream. */
    remoteStream: null as MediaStream | null,
    status,
    error,
    micEnabled,
    cameraEnabled,
    hasCameraTrack: (stream?.getVideoTracks().length ?? 0) > 0,
    hasMicTrack: (stream?.getAudioTracks().length ?? 0) > 0,
    start,
    stop,
    toggleMic,
    toggleCamera,
  };
}
