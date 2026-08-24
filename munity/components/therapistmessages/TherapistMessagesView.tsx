"use client";

import Image from "next/image";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ImageIcon, Mic, Phone, Plus, Search, Send, Video } from "lucide-react";
import { TherapistAppShell } from "@/components/therapistlayout/TherapistAppShell";
import { CallOverlay } from "@/components/messages/CallOverlay";
import { LivePulse, useLiveToast } from "@/components/live/LiveFeedback";
// import { assets } from "@/lib/assets";
import { chatIdFromPatient } from "@/lib/therapist-chats";
import {
  sendChatMessage,
  useChatMessages,
  useChats,
} from "@/lib/messages/client-queries";

export { chatIdFromPatient };

// type ThreadMessage = {
//   id: string;
//   from: "me" | "them";
//   content: string;
//   time: string;
// };

// type TherapistChat = {
//   id: string;
//   name: string;
//   patientId: string;
//   preview: string;
//   time: string;
//   avatar: string;
//   online?: boolean;
// };

// const chats: TherapistChat[] = [
//   {
//     id: "marcus-thorne",
//     name: "Marcus Thorne",
//     patientId: "#MT-82",
//     preview: "I’ve joined the waiting room.",
//     time: "2:00 PM",
//     avatar: assets.avatars.alex,
//     online: true,
//   },
//   {
//     id: "sarah-jenkins",
//     name: "Sarah Jenkins",
//     patientId: "#SJ-41",
//     preview: "Hi Doctor — I’m ready whenever you are.",
//     time: "4:30 PM",
//     avatar: assets.avatars.elena,
//     online: true,
//   },
//   {
//     id: "leo-richards",
//     name: "Leo Richards",
//     patientId: "#LR-2847",
//     preview: "The workplace stress worksheet helped today.",
//     time: "Yesterday",
//     avatar: assets.avatars.leo,
//   },
// ];

// const seedMessages: Record<string, ThreadMessage[]> = {
//   "marcus-thorne": [
//     {
//       id: "m1",
//       from: "them",
//       content: "I’ve joined the waiting room for our video session.",
//       time: "1:58 PM",
//     },
//     {
//       id: "m2",
//       from: "me",
//       content: "Thanks Marcus — I’ll connect in a moment. How are you feeling right now?",
//       time: "1:59 PM",
//     },
//   ],
//   "sarah-jenkins": [
//     {
//       id: "m1",
//       from: "them",
//       content: "Hi Doctor — I’m ready whenever you are.",
//       time: "4:28 PM",
//     },
//     {
//       id: "m2",
//       from: "me",
//       content: "Thanks for checking in. How has your day felt so far?",
//       time: "4:29 PM",
//     },
//   ],
//   "leo-richards": [
//     {
//       id: "m1",
//       from: "them",
//       content: "The workplace stress worksheet helped today.",
//       time: "Yesterday",
//     },
//     {
//       id: "m2",
//       from: "me",
//       content: "Glad to hear that. Let’s review what worked in our next session.",
//       time: "Yesterday",
//     },
//   ],
// };

function TherapistMessagesContent() {
  const store = useMockStore();
  const searchParams = useSearchParams();
  const { flash } = useLiveToast();
  // const [activeChatId, setActiveChatId] = useState(chats[0]?.id ?? "marcus-thorne");
  const [draft, setDraft] = useState("");
  // const [threads, setThreads] = useState(seedMessages);
  const [search, setSearch] = useState("");
  const call = useCallSession();

  const {
    chats,
    chatsLoading,
    activeChatId,
    setActiveChatId,
    refresh: loadChats,
  } = useChats(flash);
  const { messagesByChat, loadMessages } = useChatMessages(activeChatId, flash);

  // Deep-link support: /therapistmessages?chat=<thread-uuid>
  const chatIdParam = searchParams.get("chat");
  if (
    chatIdParam &&
    chatIdParam !== activeChatId &&
    chats.some((c) => c.id === chatIdParam)
  ) {
    setActiveChatId(chatIdParam);
  }

  const filteredChats = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return store.therapistChats;
    return store.therapistChats.filter(
      (chat) =>
        chat.name.toLowerCase().includes(query) ||
        (chat.patientId ?? "").toLowerCase().includes(query),
    );
  }, [search, chats]);

  const activeChat = chats.find((chat) => chat.id === activeChatId) ?? chats[0];
  const activeMessages = activeChat
    ? (messagesByChat[activeChat.id] ?? [])
    : [];

  async function sendMessage() {
    if (!activeChat || !draft.trim()) return;
    const content = draft.trim();
    setDraft("");
    try {
      await sendChatMessage(activeChat.id, content);
      loadMessages(activeChat.id);
      loadChats();
      flash("Message sent");
    } catch (error) {
      setDraft(content);
      flash(error instanceof Error ? error.message : "Couldn't send message");
    }
  }

  if (chatsLoading) {
    return (
      <TherapistAppShell
        active="Messages"
        title="Messages"
        subtitle="Patient consultations and text sessions."
      >
        <div className="flex h-[calc(100dvh-12rem)] items-center justify-center text-sm text-munity-muted">
          Loading conversations…
        </div>
      </TherapistAppShell>
    );
  }

  if (!activeChat) {
    return (
      <TherapistAppShell
        active="Messages"
        title="Messages"
        subtitle="Patient consultations and text sessions."
      >
        <div className="flex h-[calc(100dvh-12rem)] flex-col items-center justify-center gap-2 text-center text-munity-muted">
          <p className="text-sm font-medium">No conversations yet</p>
          <p className="max-w-sm text-xs">
            Threads appear here once a patient has a booking with you.
          </p>
        </div>
      </TherapistAppShell>
    );
  }

  return (
    <TherapistAppShell
      active="Messages"
      headerVariant="compact"
      actions={
        <div className="relative mr-auto hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-munity-gray" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patients..."
            className="h-9 w-64 rounded-full bg-munity-sidebar py-2 pl-10 pr-4 text-xs font-medium text-munity-text outline-none placeholder:text-munity-gray"
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
                      : "hover:bg-munity-sidebar"
                  }`}
                >
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={chat.avatar}
                      alt={chat.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-munity-text">
                        {chat.name}
                      </p>
                      <span className="shrink-0 text-[11px] text-munity-muted">
                        {chat.time}
                      </span>
                    </div>
                    {chat.patientId ? (
                      <p className="mt-0.5 text-xs text-munity-muted">
                        #{chat.patientId.slice(0, 6).toUpperCase()}
                      </p>
                    ) : null}
                    <p className="mt-1 truncate text-xs text-munity-muted">
                      {chat.preview}
                    </p>
                  </div>
                  {chat.unread ? (
                    <span className="mt-2 size-2 shrink-0 rounded-full bg-munity-green" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </section>

        <section className="hidden min-w-0 flex-1 flex-col bg-[#fbf9f8] md:flex">
          <div className="flex h-16 items-center justify-between border-b border-[rgba(197,200,184,0.3)] px-6">
            <div>
              <h3 className="text-sm font-semibold text-munity-text">
                {activeChat.name}
              </h3>
              {activeChat.patientId ? (
                <p className="text-xs text-munity-muted">
                  #{activeChat.patientId.slice(0, 6).toUpperCase()}
                </p>
              ) : null}
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-munity-bg px-6 py-5">
            {activeMessages.length > 0 ? (
              activeMessages.map((message) => {
                if (message.kind === "date") {
                  return (
                    <div key={message.id} className="flex justify-center">
                      <span className="rounded-full bg-[#efeded] px-4 py-1 text-xs font-medium text-munity-muted">
                        {message.label}
                      </span>
                    </div>
                  );
                }
                if (message.kind === "image") {
                  return (
                    <div key={message.id} className="flex justify-end">
                      <div className="max-w-[70%] overflow-hidden rounded-2xl rounded-br-md bg-munity-green p-2 shadow-sm">
                        <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                          <Image
                            src={message.image}
                            alt="Shared media"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="px-2 pb-1 pt-2 text-sm text-white">
                          {message.caption}
                        </p>
                      </div>
                    </div>
                  );
                }
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
              })
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-munity-muted">
                <p className="text-sm font-medium">
                  Conversation with {activeChat.name}
                </p>
                <p className="max-w-sm text-xs">No messages yet.</p>
              </div>
            )}
          </div>

          <div className="shrink-0 border-t border-munity-border bg-white p-4">
            <div className="flex items-center gap-2 rounded-2xl border border-munity-input-border bg-munity-sidebar p-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void sendMessage();
                  }
                }}
                placeholder="Type a message..."
                className="min-w-0 flex-1 bg-transparent px-1 py-2 text-base text-munity-text outline-none placeholder:text-[rgba(69,72,60,0.5)]"
              />
              {draft ? <span className="text-xs font-medium text-munity-muted">Typing…</span> : null}
              <button
                type="button"
                className="rounded-xl p-2 text-munity-muted transition hover:bg-white"
                aria-label="Voice message"
              >
                <Mic className="size-[18px]" />
              </button>
              <button
                type="button"
                onClick={() => void sendMessage()}
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
          mockStore.sendTherapistMessage(activeChat.id, `${kind} ended · ${duration}`);
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
