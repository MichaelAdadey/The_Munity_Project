"use client";

import Image from "next/image";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ImageIcon, Mic, Phone, Plus, Search, Send, Video } from "lucide-react";
import { TherapistAppShell } from "@/components/therapistlayout/TherapistAppShell";
import { CallOverlay } from "@/components/messages/CallOverlay";
import { LivePulse, useLiveToast } from "@/components/live/LiveFeedback";
import { useCallSession, type CallMode } from "@/hooks/useCallSession";
import { mockStore, useMockStore } from "@/lib/mock-store";
import { chatIdFromPatient } from "@/lib/therapist-chats";

export { chatIdFromPatient };

function TherapistMessagesContent() {
  const store = useMockStore();
  const searchParams = useSearchParams();
  const { flash } = useLiveToast();
  const [activeChatId, setActiveChatId] = useState(
    () => store.therapistChats[0]?.id ?? "marcus-thorne",
  );
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const call = useCallSession();

  useEffect(() => {
    const chatId = searchParams.get("chat");
    if (chatId && store.therapistChats.some((chat) => chat.id === chatId)) {
      setActiveChatId(chatId);
      mockStore.markTherapistChatRead(chatId);
    }
  }, [searchParams, store.therapistChats]);

  const filteredChats = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return store.therapistChats;
    return store.therapistChats.filter(
      (chat) =>
        chat.name.toLowerCase().includes(query) ||
        chat.patientId.toLowerCase().includes(query),
    );
  }, [search, store.therapistChats]);

  const activeChat =
    store.therapistChats.find((chat) => chat.id === activeChatId) ?? store.therapistChats[0];
  const activeMessages = activeChat ? store.therapistMessages[activeChat.id] ?? [] : [];

  function sendMessage() {
    if (!activeChat || !draft.trim()) return;
    mockStore.sendTherapistMessage(activeChat.id, draft);
    setDraft("");
    flash("Message sent");
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
        <div className="relative hidden sm:block">
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
      <div className="flex h-[calc(100dvh-12rem)] overflow-hidden rounded-2xl border border-[rgba(197,200,184,0.3)] bg-[#fbf9f8]">
        <section className="flex w-full shrink-0 flex-col border-r border-[rgba(197,200,184,0.3)] bg-white md:w-[384px]">
          <div className="flex flex-col gap-4 overflow-y-auto p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-munity-text">Inbox</h1>
            </div>

            <div className="flex flex-col gap-1">
              {filteredChats.map((chat) => {
                const active = chat.id === activeChat.id;
                return (
                  <button
                    key={chat.id}
                    type="button"
                    onClick={() => {
                      setActiveChatId(chat.id);
                      mockStore.markTherapistChatRead(chat.id);
                    }}
                    className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition ${
                      active
                        ? "rounded-l-none border-l-4 border-munity-green bg-[rgba(214,231,161,0.3)] pl-4"
                        : "hover:bg-[#f5f3f3]"
                    }`}
                  >
                    <div className="relative size-12 shrink-0">
                      <div className="relative size-12 overflow-hidden rounded-full">
                        <Image src={chat.avatar} alt={chat.name} fill className="object-cover" />
                      </div>
                      {chat.online ? (
                        <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-[#22c55e]" />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-end justify-between gap-2">
                        <p className="truncate text-sm font-semibold tracking-wide text-munity-text">
                          {chat.name}
                        </p>
                        <span className="shrink-0 text-xs font-medium text-munity-muted">
                          {chat.time}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-[11px] font-medium text-munity-muted">
                        {chat.patientId}
                      </p>
                      <p
                        className={`mt-0.5 truncate text-xs ${
                          chat.unread
                            ? "font-semibold text-munity-green"
                            : "font-medium text-munity-muted"
                        }`}
                      >
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
          </div>
        </section>

        <section className="hidden min-w-0 flex-1 flex-col bg-[#fbf9f8] md:flex">
          <div className="flex h-16 items-center justify-between border-b border-[rgba(197,200,184,0.3)] px-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold tracking-wide text-munity-text">
                  {activeChat.name}
                </h2>
                <span className="text-xs font-medium text-munity-muted">
                  {activeChat.patientId}
                </span>
              </div>
              {activeChat.online ? (
                <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-[#16a34a]">
                  <LivePulse label="Active now" />
                </p>
              ) : (
                <p className="mt-0.5 text-xs font-medium text-munity-muted">Offline</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => startCall("voice")}
                className="rounded-full p-2 text-munity-muted transition hover:bg-white hover:text-munity-green"
                aria-label="Voice call"
              >
                <Phone className="size-[18px]" />
              </button>
              <button
                type="button"
                onClick={() => startCall("video")}
                className="rounded-full p-2 text-munity-muted transition hover:bg-white hover:text-munity-green"
                aria-label="Video call"
              >
                <Video className="size-5" />
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeChat.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="flex-1 space-y-6 overflow-y-auto px-6 py-6"
            >
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

                  const isMe = message.from === "me";
                  return (
                    <div
                      key={message.id}
                      className={`flex items-end gap-3 ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      {!isMe ? (
                        <div className="relative size-8 shrink-0 overflow-hidden rounded-full">
                          <Image
                            src={activeChat.avatar}
                            alt={activeChat.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : null}
                      <div className={`max-w-[374px] ${isMe ? "items-end" : "items-start"}`}>
                        <div
                          className={`px-4 py-4 text-base leading-relaxed shadow-sm ${
                            isMe
                              ? "rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl bg-munity-green text-white"
                              : "rounded-tl-2xl rounded-tr-2xl rounded-br-2xl bg-[#eae8e7] text-munity-text"
                          }`}
                        >
                          {message.content}
                        </div>
                        <p
                          className={`mt-1 text-xs font-medium text-munity-muted ${
                            isMe ? "pr-1 text-right" : "pl-1"
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
                  <p className="text-sm font-medium">Conversation with {activeChat.name}</p>
                  <p className="max-w-sm text-xs">No messages yet. Start the conversation below.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="border-t border-[rgba(197,200,184,0.3)] bg-[#fbf9f8] px-4 py-4">
            <div className="flex items-center gap-3 rounded-2xl border border-[rgba(197,200,184,0.2)] bg-[#f5f3f3] p-2">
              <button
                type="button"
                className="rounded-xl p-2 text-munity-muted transition hover:bg-white"
                aria-label="Add attachment"
              >
                <Plus className="size-5" />
              </button>
              <button
                type="button"
                className="rounded-xl p-2 text-munity-muted transition hover:bg-white"
                aria-label="Add image"
              >
                <ImageIcon className="size-[18px]" />
              </button>
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessage();
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
                onClick={sendMessage}
                className="flex size-10 items-center justify-center rounded-xl bg-munity-green text-white transition hover:bg-munity-green-dark"
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
