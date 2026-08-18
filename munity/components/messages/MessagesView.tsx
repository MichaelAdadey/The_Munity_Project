"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Ban,
  BellOff,
  Bookmark,
  Calendar,
  ImageIcon,
  Mic,
  Phone,
  Plus,
  SquarePen,
  Send,
  Video,
} from "lucide-react";
import { MemberAppShell } from "@/components/memberlayout/MemberAppShell";
import { CallOverlay } from "@/components/messages/CallOverlay";
import { LivePulse, useLiveToast } from "@/components/live/LiveFeedback";
import { useCallSession, type CallMode } from "@/hooks/useCallSession";
import { mockStore, useMockStore } from "@/lib/mock-store";
import { therapyPath } from "@/lib/routes";

type ChatFilter = "All" | "Therapists" | "Groups";

export function MessagesView() {
  const store = useMockStore();
  const searchParams = useSearchParams();
  const { flash } = useLiveToast();
  const [filter, setFilter] = useState<ChatFilter>("All");
  const [activeChatId, setActiveChatId] = useState(
    () => store.chats[0]?.id ?? "sarah",
  );
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const call = useCallSession();

  useEffect(() => {
    const therapistId = searchParams.get("therapist");
    const chatId = searchParams.get("chat");

    if (therapistId) {
      const ensured = mockStore.ensureTherapistChat(therapistId);
      if (ensured) {
        setActiveChatId(ensured);
        mockStore.markChatRead(ensured);
        setFilter("Therapists");
      }
      return;
    }

    if (chatId) {
      setActiveChatId(chatId);
      mockStore.markChatRead(chatId);
    }
  }, [searchParams]);

  const filteredChats = store.chats.filter((chat) => {
    const matchesFilter = filter === "All" || chat.filter === filter;
    const matchesSearch = chat.name.toLowerCase().includes(search.trim().toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const activeChat = store.chats.find((chat) => chat.id === activeChatId) ?? store.chats[0];
  if (!activeChat) return null;
  const activeMessages = activeChat ? store.messages[activeChat.id] ?? [] : [];
  const showTherapistPanel = activeChat.filter === "Therapists";
  const therapistProfileHref = activeChat.therapistId
    ? therapyPath(activeChat.therapistId)
    : null;
  const therapistMeta = activeChat.therapistId
    ? store.therapists.find((item) => item.id === activeChat.therapistId)
    : undefined;
  const sharedMedia = [
    "/images/messages/media-stones.jpg",
    "/images/messages/media-brain.jpg",
    "/images/messages/media-coffee.jpg",
  ];

  function sendMessage() {
    if (!draft.trim()) return;
    mockStore.sendMessage(activeChat.id, draft);
    setDraft("");
    flash("Message sent");
  }

  function startCall(mode: CallMode) {
    call.start(mode);
    flash(
      mode === "video"
        ? `Starting video call with ${activeChat.name}`
        : `Calling ${activeChat.name}…`,
    );
  }

  return (
    <MemberAppShell
      flush
      showSearch
      searchPlaceholder="Search conversations..."
      searchValue={search}
      onSearchChange={setSearch}
    >
      <div className="flex h-[calc(100dvh-4rem)] bg-[#fbf9f8]">
        <section className="flex w-full shrink-0 flex-col border-r border-[rgba(197,200,184,0.3)] bg-white md:w-[384px]">
          <div className="flex flex-col gap-4 overflow-y-auto p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-munity-text">Chats</h1>
              <button
                type="button"
                className="rounded-full p-2 text-munity-muted transition hover:bg-[#f5f3f3]"
                aria-label="Compose message"
              >
                <SquarePen className="size-5" />
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {(["All", "Therapists", "Groups"] as const).map((item) => {
                const active = filter === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFilter(item)}
                    className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold tracking-wide transition ${
                      active
                        ? "bg-munity-lime text-munity-olive-text"
                        : "bg-[#eae8e7] text-munity-muted hover:bg-[#e4e4cc]"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
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
                      mockStore.markChatRead(chat.id);
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
              <h2 className="text-sm font-semibold tracking-wide text-munity-text">
                {activeChat.name}
              </h2>
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
          <motion.div key={activeChat.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
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
                      <div className="max-w-[374px]">
                        <div className="overflow-hidden rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl bg-munity-green p-2 shadow-sm">
                          <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                            <Image
                              src={message.image}
                              alt="Shared media"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="px-2 pb-2 pt-2 text-base leading-relaxed text-white">
                            {message.caption}
                          </p>
                        </div>
                        <p className="mt-1 pr-1 text-right text-xs font-medium text-munity-muted">
                          {message.time}
                        </p>
                      </div>
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
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
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

        {showTherapistPanel ? (
          <aside className="hidden w-80 shrink-0 flex-col overflow-y-auto border-l border-[rgba(197,200,184,0.3)] bg-[#f5f3f3] xl:flex">
            <div className="px-6 pt-6">
              <div className="flex flex-col items-center">
                <div className="relative size-24">
                  <div className="relative size-24 overflow-hidden rounded-full border-4 border-white shadow-md">
                    <Image
                      src={activeChat.avatar}
                      alt={activeChat.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {activeChat.online ? (
                    <span className="absolute bottom-1 right-1 size-5 rounded-full border-2 border-white bg-[#22c55e]" />
                  ) : null}
                </div>
                <h3 className="mt-3 text-sm font-bold tracking-wide text-munity-text">
                  {activeChat.name}
                </h3>
                <p className="mt-1 text-xs font-medium text-munity-muted">
                  {therapistMeta?.credentials ?? "Therapist"}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  {therapistProfileHref ? (
                    <Link
                      href={therapistProfileHref}
                      className="rounded-xl bg-munity-green px-4 py-3 text-xs font-medium text-white transition hover:bg-munity-green-dark"
                    >
                      View Profile
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    className="rounded-xl bg-munity-lime p-2 text-munity-olive-text transition hover:brightness-95"
                    aria-label="Save contact"
                  >
                    <Bookmark className="size-[18px]" />
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-semibold tracking-wide text-munity-muted">
                    Shared Media
                  </h4>
                  <button type="button" className="text-xs font-medium text-munity-green">
                    See all
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {sharedMedia.map((src) => (
                    <div
                      key={src}
                      className="relative aspect-square overflow-hidden rounded-lg bg-[#eae8e7]"
                    >
                      <Image src={src} alt="Shared media" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pb-8">
                <h4 className="mb-3 px-1 text-sm font-semibold tracking-wide text-munity-muted">
                  Settings &amp; Privacy
                </h4>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    className="flex items-center gap-3 rounded-xl p-3 text-sm font-semibold tracking-wide text-munity-text transition hover:bg-white/70"
                  >
                    <Calendar className="size-[18px]" />
                    Schedule Session
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-3 rounded-xl p-3 text-sm font-semibold tracking-wide text-munity-text transition hover:bg-white/70"
                  >
                    <BellOff className="size-[18px]" />
                    Mute Notifications
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-3 rounded-xl p-3 text-sm font-semibold tracking-wide text-[#ba1a1a] transition hover:bg-white/70"
                  >
                    <Ban className="size-5" />
                    Report / Block
                  </button>
                </div>
              </div>
            </div>
          </aside>
        ) : null}
      </div>

      <CallOverlay
        session={call}
        participantName={activeChat.name}
        participantAvatar={activeChat.avatar}
        flash={flash}
        onEnd={({ kind, duration }) => {
          mockStore.sendMessage(activeChat.id, `${kind} ended · ${duration}`);
          flash(`${kind} ended`);
        }}
      />
    </MemberAppShell>
  );
}
