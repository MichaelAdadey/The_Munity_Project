"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Maximize2,
  Mic,
  MicOff,
  Minimize2,
  PhoneOff,
  Send,
  Video,
  VideoOff,
} from "lucide-react";
import { useLiveToast } from "@/components/live/LiveFeedback";
import { chatIdFromPatient } from "@/lib/therapist-chats";
import { therapistMessagesPath } from "@/lib/routes";

export type TherapistSessionKind = "video" | "chat";

export type TherapistSessionPatient = {
  name: string;
  patientId: string;
  avatar: string;
  time: string;
  type: string;
};

type ChatMessage = {
  id: string;
  from: "me" | "them";
  content: string;
  time: string;
};

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

export function TherapistSessionOverlays({
  patient,
  kind,
  onClose,
}: {
  patient: TherapistSessionPatient | null;
  kind: TherapistSessionKind | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const { flash } = useLiveToast();
  const [phase, setPhase] = useState<"connecting" | "connected">("connecting");
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!patient || !kind) return;
    setPhase("connecting");
    setSeconds(0);
    setMuted(false);
    setCameraOff(false);
    setMinimized(false);
    setDraft("");
    setMessages([
      {
        id: "m1",
        from: "them",
        content:
          kind === "chat"
            ? "Hi Doctor — I’m ready whenever you are."
            : "I’ve joined the waiting room.",
        time: "Just now",
      },
      {
        id: "m2",
        from: "me",
        content:
          kind === "chat"
            ? "Thanks for checking in. How has your day felt so far?"
            : "Connecting now — we’ll start in a moment.",
        time: "Just now",
      },
    ]);
    const timer = window.setTimeout(() => setPhase("connected"), 1200);
    return () => window.clearTimeout(timer);
  }, [patient, kind]);

  useEffect(() => {
    if (!patient || !kind || kind !== "video" || phase !== "connected") return;
    const tick = window.setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => window.clearInterval(tick);
  }, [patient, kind, phase]);

  useEffect(() => {
    if (kind !== "chat") return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, kind]);

  if (!patient || !kind) return null;

  const activePatient = patient;
  const activeKind = kind;

  function endSession() {
    flash(
      activeKind === "video"
        ? `Video session with ${activePatient.name} ended`
        : `Chat with ${activePatient.name} closed`,
    );
    onClose();
  }

  function expandToMessages() {
    const chatId = chatIdFromPatient(activePatient);
    flash(`Opening full chat with ${activePatient.name}`);
    onClose();
    router.push(therapistMessagesPath({ chatId }));
  }

  function sendMessage() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        from: "me",
        content: trimmed,
        time: new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
      },
    ]);
    setDraft("");
    flash("Message sent");
  }

  return (
    <AnimatePresence>
      {activeKind === "video" && !minimized ? (
        <motion.div
          key="video-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#1a1f14]/88 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-[28px] border border-white/15 bg-[#24301c] text-white shadow-2xl"
          >
            <div className="absolute right-3 top-3 z-10">
              <button
                type="button"
                onClick={() => {
                  setMinimized(true);
                  flash("Session minimized");
                }}
                className="flex size-9 items-center justify-center rounded-full bg-black/35 text-white transition hover:bg-black/50"
                aria-label="Minimize session"
              >
                <Minimize2 className="size-4" />
              </button>
            </div>
            <div className="relative h-[360px] w-full bg-[#1a2214]">
              {!cameraOff ? (
                <Image
                  src={activePatient.avatar}
                  alt={activePatient.name}
                  fill
                  className="object-cover opacity-90"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3">
                  <div className="relative size-24 overflow-hidden rounded-full border-4 border-white/20">
                    <Image
                      src={activePatient.avatar}
                      alt={activePatient.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-sm text-white/70">Camera is off</p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a2214] via-transparent to-black/30" />
              <div className="absolute bottom-4 right-4 flex h-28 w-20 items-center justify-center overflow-hidden rounded-xl border-2 border-white/40 bg-munity-green text-xs font-semibold">
                You
              </div>
            </div>
            <div className="px-8 pb-8 pt-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-munity-lime/90">
                Video session
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">{activePatient.name}</h2>
              <p className="mt-1 text-sm text-white/60">{activePatient.patientId}</p>
              <p className="mt-2 text-sm text-white/70">
                {phase === "connecting" ? "Connecting…" : formatDuration(seconds)}
              </p>
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setMuted((prev) => !prev);
                    flash(muted ? "Microphone on" : "Microphone muted");
                  }}
                  className={`flex size-14 items-center justify-center rounded-full transition ${
                    muted ? "bg-white text-munity-text" : "bg-white/15 hover:bg-white/25"
                  }`}
                  aria-label={muted ? "Unmute" : "Mute"}
                >
                  {muted ? <MicOff className="size-5" /> : <Mic className="size-5" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCameraOff((prev) => !prev);
                    flash(cameraOff ? "Camera on" : "Camera off");
                  }}
                  className={`flex size-14 items-center justify-center rounded-full transition ${
                    cameraOff ? "bg-white text-munity-text" : "bg-white/15 hover:bg-white/25"
                  }`}
                  aria-label={cameraOff ? "Turn camera on" : "Turn camera off"}
                >
                  {cameraOff ? <VideoOff className="size-5" /> : <Video className="size-5" />}
                </button>
                <button
                  type="button"
                  onClick={endSession}
                  className="flex size-14 items-center justify-center rounded-full bg-[#ba1a1a] transition hover:bg-[#9f1515]"
                  aria-label="End session"
                >
                  <PhoneOff className="size-5" />
                </button>
              </div>
              <p className="mt-5 text-xs text-white/50">
                Preview session · scheduled {activePatient.time}
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}

      {activeKind === "video" && minimized ? (
        <motion.div
          key="video-pip"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="fixed bottom-5 right-5 z-[80] w-[280px] overflow-hidden rounded-2xl border border-white/20 bg-[#24301c] text-white shadow-2xl"
        >
          <button
            type="button"
            onClick={() => setMinimized(false)}
            className="flex w-full items-center gap-3 p-3 text-left transition hover:bg-white/5"
          >
            <div className="relative size-12 shrink-0 overflow-hidden rounded-full border-2 border-white/25">
              <Image
                src={activePatient.avatar}
                alt={activePatient.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{activePatient.name}</p>
              <p className="mt-0.5 text-xs text-munity-lime/90">
                Video · {phase === "connecting" ? "Connecting…" : formatDuration(seconds)}
              </p>
            </div>
            <Maximize2 className="size-4 shrink-0 text-white/70" />
          </button>
          <div className="flex items-center justify-between gap-2 border-t border-white/10 px-3 py-2.5">
            <button
              type="button"
              onClick={() => setMinimized(false)}
              className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold transition hover:bg-white/25"
            >
              Expand
            </button>
            <button
              type="button"
              onClick={endSession}
              className="flex size-9 items-center justify-center rounded-full bg-[#ba1a1a] transition hover:bg-[#9f1515]"
              aria-label="End session"
            >
              <PhoneOff className="size-4" />
            </button>
          </div>
        </motion.div>
      ) : null}

      {activeKind === "chat" ? (
        <motion.div
          key="chat-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            onClick={(event) => event.stopPropagation()}
            className="flex h-[min(90dvh,640px)] w-full max-w-lg flex-col overflow-hidden rounded-[24px] border border-[#d8dbcf] bg-white shadow-2xl"
          >
            <div className="flex shrink-0 items-center gap-3 border-b border-munity-border px-5 py-4">
              <div className="relative size-11 overflow-hidden rounded-full">
                <Image
                  src={activePatient.avatar}
                  alt={activePatient.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-munity-text">
                  {activePatient.name}
                </p>
                <p className="text-xs text-munity-muted">
                  Text consultation · {activePatient.patientId} · {activePatient.time}
                </p>
              </div>
              <button
                type="button"
                onClick={expandToMessages}
                className="inline-flex items-center gap-1.5 rounded-xl border border-munity-green px-3 py-2 text-xs font-semibold text-munity-green transition hover:bg-munity-lime/30"
              >
                <Maximize2 className="size-3.5" />
                Expand
              </button>
              <button
                type="button"
                onClick={endSession}
                className="rounded-xl border border-[#c5c8b8] px-3 py-2 text-xs font-semibold text-munity-text transition hover:bg-[#f3f4ee]"
              >
                Close
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#fbf9f8] px-5 py-4">
              <div className="space-y-3">
                {messages.map((message) => {
                  const mine = message.from === "me";
                  return (
                    <div
                      key={message.id}
                      className={`flex ${mine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] break-words rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                          mine
                            ? "rounded-br-md bg-munity-green text-white"
                            : "rounded-bl-md bg-white text-munity-text"
                        }`}
                      >
                        {message.content}
                        <p
                          className={`mt-1 text-[10px] ${
                            mine ? "text-white/70" : "text-munity-muted"
                          }`}
                        >
                          {message.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="shrink-0 border-t border-munity-border bg-white p-4">
              <div className="flex items-center gap-2 rounded-2xl border border-[#c5c8b8] bg-[#f5f3f3] p-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Type a message…"
                  className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-munity-text outline-none"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-munity-green text-white transition hover:bg-munity-green-dark"
                  aria-label="Send message"
                >
                  <Send className="size-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
