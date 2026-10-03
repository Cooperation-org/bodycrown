import type { ChatMessage } from "@/data/content";

const apiUrl = import.meta.env.VITE_CROWNIE_API_URL;
const visitorKey = "crownie-visitor";

type ApiMessage = { id: number; speaker: "her" | "crownie"; text: string };

function toChatMessage(message: ApiMessage): ChatMessage {
  return { id: message.id, speaker: message.speaker === "her" ? "Her" : "Crownie", text: message.text };
}

/** The conversation id lives in this browser only; storage can be blocked, so every access is guarded. */
function storedVisitor(): string | null {
  try {
    return window.localStorage.getItem(visitorKey);
  } catch {
    return null;
  }
}

function storeVisitor(id: string | null) {
  try {
    if (id) window.localStorage.setItem(visitorKey, id);
    else window.localStorage.removeItem(visitorKey);
  } catch {
    // Without storage the conversation still works; it just starts fresh on reload.
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json" },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.error ?? "Something went wrong. Please try again.");
    (error as Error & { status: number }).status = response.status;
    throw error;
  }
  return body as T;
}

/** Earlier messages from this browser's conversation, or none if there is no conversation yet. */
export async function loadConversation(): Promise<ChatMessage[]> {
  const visitor = storedVisitor();
  if (!visitor) return [];
  try {
    const { messages } = await request<{ messages: ApiMessage[] }>(`/visitors/${visitor}/messages`);
    return messages.map(toChatMessage);
  } catch (error) {
    if ((error as { status?: number }).status === 404) storeVisitor(null);
    throw error;
  }
}

export async function sendToCrownie(text: string): Promise<ChatMessage> {
  let visitor = storedVisitor();
  if (!visitor) {
    visitor = (await request<{ id: string }>("/visitors", { method: "POST" })).id;
    storeVisitor(visitor);
  }
  const { reply } = await request<{ reply: ApiMessage }>(`/visitors/${visitor}/messages`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
  return toChatMessage(reply);
}
