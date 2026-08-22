import { createClient } from "../supabase/client";
import { toFullName } from "../profile/display-name";
import { useCallback, useEffect, useRef, useState } from "react";

export type ChatSummary = {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  time: string;
  preview: string;
  unread: boolean;
  filter: "Therapists" | "Groups";
  therapistId: string | null;
  patientId: string | null;
};

export type ChatMessage =
  | { kind: "date"; id: string; label: string }
  | { kind: "image"; image: string; id: string; caption: string; time: string }
  | {
      kind: "text";
      id: string;
      from: "me" | "them";
      content: string;
      time: string;
    };

const PLACEHOLDER_AVATAR = "/images/avatar-placeholder.png";

type ChatState = {
  chats: ChatSummary[];
  chatsLoading: boolean;
  error: string | null;
  activeChatId: string | null;
  setActiveChatId: (id: string) => void;
  refresh: () => void;
};

const formatChatTime = (iso: string) => {
  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();

  if (sameDay) {
    return date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  }
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const formatBubbleTime = (iso: string) => {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatDateLabel = (iso: string) => {
  const date = new Date(iso);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (date.toDateString() === now.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString(undefined, { month: "long", day: "numeric" });
};

export const fetchChats = async (): Promise<ChatSummary[]> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("chat_thread_previews")
    .select("*")
    .order("last_message_at", { ascending: false, nullsFirst: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    const iAmPatient = row.patient_id === user.id;
    const name = iAmPatient
      ? toFullName(row.therapist_first_name, row.therapist_last_name)
      : toFullName(row.patient_first_name, row.patient_last_name);

    return {
      id: row.id,
      name,
      avatar: PLACEHOLDER_AVATAR,
      online: false, // no presence tracking yet
      time: row.last_message_at ? formatChatTime(row.last_message_at) : "",
      preview:
        row.last_message_kind === "image"
          ? "Photo"
          : (row.last_message_content ?? "No messages yet"),
      unread: (row.unread_count ?? 0) > 0,
      filter: "Therapists" as const,
      therapistId: iAmPatient ? row.therapist_id : null,
      patientId: iAmPatient ? null : row.patient_id,
    };
  });
};

export const fetchMessages = async (
  threadId: string,
): Promise<ChatMessage[]> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("chat_messages")
    .select("id, sender_id, kind, content, image_url, created_at")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  const result: ChatMessage[] = [];
  let lastDateLabel: string | null = null;

  for (const row of data ?? []) {
    const label = formatDateLabel(row.created_at);
    if (label !== lastDateLabel) {
      result.push({ kind: "date", id: `date-${row.id}`, label });
      lastDateLabel = label;
    }

    if (row.kind === "image" && row.image_url) {
      result.push({
        kind: "image",
        id: row.id,
        image: row.image_url,
        caption: row.content ?? "",
        time: formatBubbleTime(row.created_at),
      });
    } else {
      result.push({
        kind: "text",
        id: row.id,
        from: row.sender_id === user?.id ? "me" : "them",
        content: row.content ?? "",
        time: formatBubbleTime(row.created_at),
      });
    }
  }
  return result;
};

export const useChats = (flash: (message: string) => void): ChatState => {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [chatsLoading, setChatsLoading] = useState(true);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const flashRef = useRef(flash);
  useEffect(() => {
    flashRef.current = flash;
  }, [flash]);

  const loadChats = useCallback(() => {
    void (async () => {
      try {
        const data = await fetchChats();
        setChats(data);
        setActiveChatId((current) => current ?? data[0]?.id ?? null);
        setError(null);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load conversations";
        setError(message);
      } finally {
        setChatsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    void loadChats();
  }, [loadChats]);

  return {
    chats,
    chatsLoading,
    error,
    activeChatId,
    setActiveChatId,
    refresh: loadChats,
  };
};

export const useChatMessages = (
  activeChatId: string | null,
  flash: (message: string) => void,
) => {
  const [messagesByChat, setMessagesByChat] = useState<
    Record<string, ChatMessage[]>
  >({});

  const flashRef = useRef(flash);
  useEffect(() => {
    flashRef.current = flash;
  }, [flash]);

  const loadMessages = useCallback((chatId: string) => {
    void (async () => {
      try {
        const data = await fetchMessages(chatId);
        setMessagesByChat((prev) => ({ ...prev, [chatId]: data }));
      } catch (error) {
        flashRef.current(
          error instanceof Error ? error.message : "Failed to load messages",
        );
      }
    })();
  }, []);

  useEffect(() => {
    if (!activeChatId) return;
    loadMessages(activeChatId);
    void markThreadRead(activeChatId);
  }, [activeChatId, loadMessages]);

  return { messagesByChat, loadMessages, setMessagesByChat };
};

export const sendChatMessage = async (threadId: string, content: string) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("chat_messages").insert({
    thread_id: threadId,
    sender_id: user.id,
    kind: "text",
    content,
  });
  if (error) throw new Error(error.message);
};

export const markThreadRead = async (threadId: string) => {
  const supabase = createClient();
  const { error } = await supabase.rpc("mark_messages_read", {
    p_thread_id: threadId,
  });
  if (error) throw new Error(error.message);
};

export const ensureTherapistThread = async (
  therapistId: string,
): Promise<string> => {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_or_create_thread", {
    p_therapist_id: therapistId,
  });
  if (error) throw new Error(error.message);
  return data as string;
};

export const ensurePatientThread = async (
  patientId: string,
): Promise<string> => {
  const supabase = createClient();
  const { data, error } = await supabase.rpc(
    "get_or_create_thread_for_patient",
    {
      p_patient_id: patientId,
    },
  );
  if (error) throw new Error(error.message);
  return data as string;
};
