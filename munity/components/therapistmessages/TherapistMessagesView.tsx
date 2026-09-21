"use client";

import Image from "next/image";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Mic, Phone, Search, Send, Video } from "lucide-react";
import { TherapistAppShell } from "@/components/therapistlayout/TherapistAppShell";
import { CallOverlay } from "@/components/messages/CallOverlay";
import { useCallSession } from "@/hooks/useCallSession";
import { useLiveToast } from "@/components/live/LiveFeedback";
import { chatIdFromPatient } from "@/lib/therapist-chats";
import {
  sendChatMessage,
  useChatMessages,
  useChats,
} from "@/lib/messages/client-queries";
import { IncomingCall, useIncomingCall } from "@/lib/video/call-signals";

export { chatIdFromPatient };

function TherapistMessagesContent() {
  const searchParams = useSearchParams();
  const { flash } = useLiveToast();
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
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
    if (!query) return chats;
    return chats.filter(
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

  useIncomingCall(activeChat?.id ?? null, (incoming) => {
    setIncomingCall(incoming);
  });

  async function handleCallEnded(summary: { kind: string; duration: string }) {
    if (!activeChat) return;
    try {
      await sendChatMessage(
        activeChat.id,
        `${summary.kind} ended · ${summary.duration}`,
      );
      loadMessages(activeChat.id);
      loadChats();
    } catch (error) {
      flash(error instanceof Error ? error.message : "Couldn't log call end");
    }
    flash(`${summary.kind} ended`);
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
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4.5 -translate-y-1/2 text-munity-gray" />
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

        <section className="hidden min-w-0 flex-1 flex-col bg-munity-bg md:flex">
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={async () => {
                  const error = await call.start("voice", activeChat.id);
                  if (error) flash(error);
                }}
                className="rounded-full p-2 text-munity-muted transition hover:bg-white hover:text-munity-green"
                aria-label="Voice call"
              >
                <Phone className="size-4.5" />
              </button>
              <button
                type="button"
                onClick={async () => {
                  const error = await call.start("video", activeChat.id);
                  if (error) flash(error);
                }}
                className="rounded-full p-2 text-munity-muted transition hover:bg-white hover:text-munity-green"
                aria-label="Video call"
              >
                <Video className="size-5" />
              </button>
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
              {draft ? (
                <span className="text-xs font-medium text-munity-muted">
                  Typing…
                </span>
              ) : null}
              <button
                type="button"
                className="rounded-xl p-2 text-munity-muted transition hover:bg-white"
                aria-label="Voice message"
              >
                <Mic className="size-4.5" />
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

      {incomingCall ? (
        <div className="fixed inset-x-0 top-4 z-90 mx-auto w-fit rounded-full bg-munity-green px-6 py-3 text-sm font-semibold text-white shadow-xl">
          {activeChat?.name} is calling ({incomingCall.mode})
          <button
            type="button"
            onClick={async () => {
              const error = await call.join(incomingCall.mode, activeChat!.id);
              if (error) flash(error);
              setIncomingCall(null);
            }}
            className="ml-3 underline"
          >
            Join
          </button>
          <button
            type="button"
            onClick={() => setIncomingCall(null)}
            className="ml-3 underline"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <CallOverlay
        session={call}
        participantName={activeChat.name}
        participantAvatar={activeChat.avatar}
        flash={flash}
        onEnd={(summary) => void handleCallEnded(summary)}
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
