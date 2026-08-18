"use client";

import Image from "next/image";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Phone, Send, Video } from "lucide-react";
import { TherapistAppShell } from "@/components/therapistlayout/TherapistAppShell";
import { CallOverlay } from "@/components/messages/CallOverlay";
import { LivePulse, useLiveToast } from "@/components/live/LiveFeedback";
import { useCallSession, type CallMode } from "@/hooks/useCallSession";
import { assets } from "@/lib/assets";
import { chatIdFromPatient } from "@/lib/therapist-chats";

export { chatIdFromPatient };

type ThreadMessage = {
  id: string;
  from: "me" | "them";
  content: string;
  time: string;
};

type TherapistChat = {
  id: string;
  name: string;
  patientId: string;
  preview: string;
  time: string;
  avatar: string;
  online?: boolean;
};

const chats: TherapistChat[] = [
  {
    id: "marcus-thorne",
    name: "Marcus Thorne",
    patientId: "#MT-82",
    preview: "I’ve joined the waiting room.",
    time: "2:00 PM",
    avatar: assets.avatars.alex,
    online: true,
  },
  {
    id: "sarah-jenkins",
    name: "Sarah Jenkins",
    patientId: "#SJ-41",
    preview: "Hi Doctor — I’m ready whenever you are.",
    time: "4:30 PM",
    avatar: assets.avatars.elena,
    online: true,
  },
  {
    id: "leo-richards",
    name: "Leo Richards",
    patientId: "#LR-2847",
    preview: "The workplace stress worksheet helped today.",
    time: "Yesterday",
    avatar: assets.avatars.leo,
  },
];

const seedMessages: Record<string, ThreadMessage[]> = {
  "marcus-thorne": [
    {
      id: "m1",
      from: "them",
      content: "I’ve joined the waiting room for our video session.",
      time: "1:58 PM",
    },
    {
      id: "m2",
      from: "me",
      content: "Thanks Marcus — I’ll connect in a moment. How are you feeling right now?",
      time: "1:59 PM",
    },
  ],
  "sarah-jenkins": [
    {
      id: "m1",
      from: "them",
      content: "Hi Doctor — I’m ready whenever you are.",
      time: "4:28 PM",
    },
    {
      id: "m2",
      from: "me",
      content: "Thanks for checking in. How has your day felt so far?",
      time: "4:29 PM",
    },
  ],
  "leo-richards": [
    {
      id: "m1",
      from: "them",
      content: "The workplace stress worksheet helped today.",
      time: "Yesterday",
    },
    {
      id: "m2",
      from: "me",
      content: "Glad to hear that. Let’s review what worked in our next session.",
      time: "Yesterday",
    },
  ],
};

function TherapistMessagesContent() {
  const searchParams = useSearchParams();
  const { flash } = useLiveToast();
  const [activeChatId, setActiveChatId] = useState(chats[0]?.id ?? "marcus-thorne");
  const [draft, setDraft] = useState("");
  const [threads, setThreads] = useState(seedMessages);
  const [search, setSearch] = useState("");
  const call = useCallSession();

  useEffect(() => {
    const chatId = searchParams.get("chat");
    if (chatId && chats.some((chat) => chat.id === chatId)) {
      setActiveChatId(chatId);
    }
  }, [searchParams]);

  const filteredChats = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return chats;
    return chats.filter(
      (chat) =>
        chat.name.toLowerCase().includes(query) ||
        chat.patientId.toLowerCase().includes(query),
    );
  }, [search]);

  const activeChat = chats.find((chat) => chat.id === activeChatId) ?? chats[0];
  const activeMessages = activeChat ? threads[activeChat.id] ?? [] : [];

  function sendMessage() {
    if (!activeChat || !draft.trim()) return;
    const message: ThreadMessage = {
      id: `m-${Date.now()}`,
      from: "me",
      content: draft.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    };
    setThreads((prev) => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] ?? []), message],
    }));
    setDraft("");
    flash("Message sent");
  }

  function logMessage(content: string) {
    if (!activeChat) return;
    const message: ThreadMessage = {
      id: `m-${Date.now()}`,
      from: "me",
      content,
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    };
    setThreads((prev) => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] ?? []), message],
    }));
  }

  function startCall(mode: CallMode) {
    if (!activeChat) return;
    call.start(mode);
    flash(
      mode === "video"
        ? `Starting video call with ${activeChat.name}`
        : `Calling ${activeChat.name}…`,
    );
  }

  if (!activeChat) return null;

  return (
    <TherapistAppShell
      active="Messages"
      title="Messages"
      subtitle="Patient consultations and text sessions."
      actions={
        <div className="relative w-full max-w-xs sm:w-64">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patients..."
            className="h-10 w-full rounded-full border border-munity-input-border bg-[#efeded] px-4 text-sm font-medium text-munity-text outline-none focus:border-munity-green"
          />
        </div>
      }
    >
      <div className="flex h-[calc(100dvh-12rem)] overflow-hidden rounded-[20px] border border-munity-border bg-white shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
        <section className="flex w-full shrink-0 flex-col border-r border-munity-border md:w-[320px]">
          <div className="border-b border-munity-border px-4 py-4">
            <h2 className="text-lg font-semibold text-munity-text">Inbox</h2>
          </div>
          <div className="flex-1 space-y-1 overflow-y-auto p-2">
            {filteredChats.map((chat) => {
              const active = chat.id === activeChat.id;
              return (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => setActiveChatId(chat.id)}
                  className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition ${
                    active
                      ? "border-l-4 border-munity-green bg-munity-lime/30 pl-2.5"
                      : "hover:bg-[#f5f3f3]"
                  }`}
                >
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-full">
                    <Image src={chat.avatar} alt={chat.name} fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-munity-text">
                        {chat.name}
                      </p>
                      <span className="shrink-0 text-[11px] text-munity-muted">{chat.time}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-munity-muted">{chat.patientId}</p>
                    <p className="mt-1 truncate text-xs text-munity-muted">{chat.preview}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="hidden min-w-0 flex-1 flex-col md:flex">
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-munity-border px-6">
            <div>
              <h3 className="text-sm font-semibold text-munity-text">{activeChat.name}</h3>
              <p className="text-xs text-munity-muted">{activeChat.patientId}</p>
            </div>
            <div className="flex items-center gap-3">
              {activeChat.online ? <LivePulse label="Active now" /> : null}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => startCall("voice")}
                  className="rounded-full p-2 text-munity-muted transition hover:bg-munity-sidebar hover:text-munity-green"
                  aria-label="Voice call"
                >
                  <Phone className="size-[18px]" />
                </button>
                <button
                  type="button"
                  onClick={() => startCall("video")}
                  className="rounded-full p-2 text-munity-muted transition hover:bg-munity-sidebar hover:text-munity-green"
                  aria-label="Video call"
                >
                  <Video className="size-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-[#fbf9f8] px-6 py-5">
            {activeMessages.map((message) => {
              const mine = message.from === "me";
              return (
                <div
                  key={message.id}
                  className={`flex ${mine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
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
        </section>
      </div>

      <CallOverlay
        session={call}
        participantName={activeChat.name}
        participantAvatar={activeChat.avatar}
        flash={flash}
        onEnd={({ kind, duration }) => {
          logMessage(`${kind} ended · ${duration}`);
          flash(`${kind} ended`);
        }}
      />
    </TherapistAppShell>
  );
}

export function TherapistMessagesView() {
  return (
    <Suspense fallback={null}>
      <TherapistMessagesContent />
    </Suspense>
  );
}
