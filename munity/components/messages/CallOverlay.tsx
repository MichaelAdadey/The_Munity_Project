"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Mic,
  MicOff,
  Minimize2,
  Maximize2,
  PhoneOff,
  Video,
  VideoOff,
} from "lucide-react";
import { VideoStream } from "@/components/messages/VideoStream";
import { formatCallDuration, type CallSession } from "@/hooks/useCallSession";

interface CallOverlayProps {
  session: CallSession;
  participantName: string;
  participantAvatar: string;
  flash: (message: string) => void;
  /** Called right before media/state resets, so the caller can log a "call ended" message. */
  onEnd?: (summary: { kind: string; duration: string }) => void;
}

/**
 * Full-screen call UI (+ minimized PiP variant) shared by member and
 * therapist messages. All the connecting/duration/minimize state and the
 * real camera/mic stream live in useCallSession — this component is purely
 * presentational.
 */
export function CallOverlay({
  session,
  participantName,
  participantAvatar,
  flash,
  onEnd,
}: CallOverlayProps) {
  const { callMode, callPhase, callSeconds, minimized, setMinimized, media, end } = session;
  const muted = !media.micEnabled;
  const cameraOff = !media.cameraEnabled || !media.hasCameraTrack;

  function handleEndCall() {
    if (!callMode) return;
    onEnd?.(end());
  }

  function handleToggleMic() {
    if (!media.hasMicTrack) {
      flash("Microphone unavailable");
      return;
    }
    const willBeMuted = media.micEnabled;
    media.toggleMic();
    flash(willBeMuted ? "Microphone muted" : "Microphone on");
  }

  function handleToggleCamera() {
    if (!media.hasCameraTrack) {
      flash("Camera unavailable");
      return;
    }
    const willBeOff = media.cameraEnabled;
    media.toggleCamera();
    flash(willBeOff ? "Camera off" : "Camera on");
  }

  return (
    <>
      <AnimatePresence>
        {callMode && !minimized ? (
          <motion.div
            key="call-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[#1a1f14]/88 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-[28px] border border-white/15 bg-[#24301c] text-white shadow-2xl"
            >
              <div className="absolute right-3 top-3 z-10 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMinimized(true);
                    flash("Call minimized — keep chatting while you stay on the line");
                  }}
                  className="flex size-9 items-center justify-center rounded-full bg-black/35 text-white transition hover:bg-black/50"
                  aria-label="Minimize call"
                >
                  <Minimize2 className="size-4" />
                </button>
              </div>

              {callMode === "video" ? (
                <div className="relative h-[360px] w-full bg-[#1a2214]">
                  {/* Remote participant. There's no signaling/WebRTC layer yet, so
                      media.remoteStream is always null and we fall back to their
                      avatar — the same placeholder we'd show if their camera were off. */}
                  {media.remoteStream ? (
                    <VideoStream
                      stream={media.remoteStream}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <Image
                      src={participantAvatar}
                      alt={participantName}
                      fill
                      className="object-cover opacity-90"
                    />
                  )}
                  {callPhase === "connecting" ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#1a2214]/70">
                      <span className="size-8 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                      <p className="text-sm text-white/80">Connecting…</p>
                    </div>
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a2214] via-transparent to-black/30" />

                  {/* Your own camera preview. */}
                  <div className="absolute bottom-4 right-4 h-28 w-20 overflow-hidden rounded-xl border-2 border-white/40 bg-munity-green shadow-lg">
                    {!cameraOff && media.stream ? (
                      <VideoStream
                        stream={media.stream}
                        muted
                        mirrored
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-1 text-center text-white/90">
                        <VideoOff className="size-4" />
                        <p className="text-[10px] font-semibold">
                          {media.hasCameraTrack ? "Camera off" : "No camera"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center px-8 pb-4 pt-12">
                  <div className="relative size-28 overflow-hidden rounded-full border-4 border-white/20 shadow-xl">
                    <Image
                      src={participantAvatar}
                      alt={participantName}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="px-8 pb-8 pt-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-munity-lime/90">
                  {callMode === "video" ? "Video call" : "Voice call"}
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">{participantName}</h2>
                <p className="mt-2 text-sm text-white/70">
                  {callPhase === "connecting" ? "Connecting…" : formatCallDuration(callSeconds)}
                </p>

                {media.error ? (
                  <div className="mx-auto mt-4 flex max-w-sm items-start gap-2 rounded-xl border border-[#ba1a1a]/40 bg-[#ba1a1a]/15 px-3 py-2 text-left text-xs text-white/90">
                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-[#ff8a80]" />
                    <span>{media.error}</span>
                  </div>
                ) : null}

                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={handleToggleMic}
                    className={`flex size-14 items-center justify-center rounded-full transition ${
                      muted
                        ? "bg-white text-munity-text"
                        : "bg-white/15 text-white hover:bg-white/25"
                    }`}
                    aria-label={muted ? "Unmute" : "Mute"}
                  >
                    {muted ? <MicOff className="size-5" /> : <Mic className="size-5" />}
                  </button>

                  {callMode === "video" ? (
                    <button
                      type="button"
                      onClick={handleToggleCamera}
                      className={`flex size-14 items-center justify-center rounded-full transition ${
                        cameraOff
                          ? "bg-white text-munity-text"
                          : "bg-white/15 text-white hover:bg-white/25"
                      }`}
                      aria-label={cameraOff ? "Turn camera on" : "Turn camera off"}
                    >
                      {cameraOff ? <VideoOff className="size-5" /> : <Video className="size-5" />}
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={handleEndCall}
                    className="flex size-14 items-center justify-center rounded-full bg-[#ba1a1a] text-white shadow-lg transition hover:bg-[#9f1515]"
                    aria-label="End call"
                  >
                    <PhoneOff className="size-5" />
                  </button>
                </div>
                <p className="mt-5 text-xs text-white/50">
                  Your camera and mic are live — the other side is simulated in this preview
                </p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {callMode && minimized ? (
          <motion.div
            key="call-pip"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            className="fixed bottom-5 right-5 z-[80] w-[280px] overflow-hidden rounded-2xl border border-white/20 bg-[#24301c] text-white shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setMinimized(false)}
              className="flex w-full items-center gap-3 p-3 text-left transition hover:bg-white/5"
            >
              <div className="relative size-12 shrink-0 overflow-hidden rounded-full border-2 border-white/25">
                <Image
                  src={participantAvatar}
                  alt={participantName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{participantName}</p>
                <p className="mt-0.5 text-xs text-munity-lime/90">
                  {callMode === "video" ? "Video" : "Voice"} ·{" "}
                  {callPhase === "connecting" ? "Connecting…" : formatCallDuration(callSeconds)}
                </p>
              </div>
              <Maximize2 className="size-4 shrink-0 text-white/70" />
            </button>
            <div className="flex items-center justify-between gap-2 border-t border-white/10 px-3 py-2.5">
              <button
                type="button"
                onClick={handleToggleMic}
                className={`flex size-9 items-center justify-center rounded-full transition ${
                  muted ? "bg-white text-munity-text" : "bg-white/15 hover:bg-white/25"
                }`}
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
              </button>
              <button
                type="button"
                onClick={() => setMinimized(false)}
                className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold transition hover:bg-white/25"
              >
                Expand
              </button>
              <button
                type="button"
                onClick={handleEndCall}
                className="flex size-9 items-center justify-center rounded-full bg-[#ba1a1a] transition hover:bg-[#9f1515]"
                aria-label="End call"
              >
                <PhoneOff className="size-4" />
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
