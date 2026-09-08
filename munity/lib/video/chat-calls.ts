"use server";

const DAILY_API_BASE = "https://api.daily.co/v1";

/** In-memory cache so two people opening the same thread within the same
 *  server instance's lifetime reuse the same room rather than creating two.
 *  Not durable across deploys/restarts — acceptable for ad-hoc, non-persisted
 *  chat calls. */
const roomCache = new Map<string, string>();

export async function getChatCallRoomUrl(
  threadId: string,
): Promise<{ url?: string; error?: string }> {
  const cached = roomCache.get(threadId);
  if (cached) return { url: cached };

  const apiKey = process.env.DAILY_API_KEY;
  if (!apiKey) return { error: "Video calling isn't configured yet." };

  const response = await fetch(`${DAILY_API_BASE}/rooms`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `thread-${threadId}`,
      properties: {
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour, ad-hoc calls should be short-lived
      },
    }),
  });

  if (response.status === 400) {
    // Room with this name likely already exists (created by the other participant
    // moments ago) — fetch it instead of treating this as a failure.
    const getResponse = await fetch(
      `${DAILY_API_BASE}/rooms/thread-${threadId}`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
      },
    );
    if (getResponse.ok) {
      const room = (await getResponse.json()) as { url: string };
      roomCache.set(threadId, room.url);
      return { url: room.url };
    }
  }

  if (!response.ok) {
    const body = await response.text();
    return { error: `Couldn't create video room: ${body}` };
  }

  const room = (await response.json()) as { url: string };
  roomCache.set(threadId, room.url);
  return { url: room.url };
}
