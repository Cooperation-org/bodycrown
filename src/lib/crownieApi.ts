import { chatUnavailable, type ChatMessage } from "@/data/content";

const apiUrl = import.meta.env.VITE_CROWNIE_API_URL;
const visitorKey = "crownie-visitor";

type ApiMessage = { id: number; speaker: "her" | "crownie"; text: string };

// A conversation is its id plus a secret token. The server hands the token over once, when it creates
// the conversation, and wants it back on every request. `token` is null for a conversation started
// before tokens existed, and while the server has not been updated yet.
type Conversation = { id: string; token: string | null };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function toChatMessage(message: ApiMessage): ChatMessage {
  return { id: message.id, speaker: message.speaker === "her" ? "Her" : "Crownie", text: message.text };
}

/** The conversation lives in this browser only; storage can be blocked, so every access is guarded. */
function storedConversation(): Conversation | null {
  try {
    const raw = window.localStorage.getItem(visitorKey);
    if (!raw) return null;
    if (UUID.test(raw)) return { id: raw, token: null }; // saved by the first version, as a bare id
    const saved = JSON.parse(raw) as Partial<Conversation>;
    if (typeof saved.id !== "string" || !UUID.test(saved.id)) return null;
    return { id: saved.id, token: typeof saved.token === "string" ? saved.token : null };
  } catch {
    return null;
  }
}

function storeConversation(conversation: Conversation | null) {
  try {
    if (conversation) window.localStorage.setItem(visitorKey, JSON.stringify(conversation));
    else window.localStorage.removeItem(visitorKey);
  } catch {
    // Without storage the conversation still works; it just starts fresh on reload.
  }
}

async function request<T>(path: string, init?: RequestInit, token?: string | null): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${apiUrl}${path}`, { ...init, headers });
  } catch {
    // The browser's own wording ("Failed to fetch") is not for her.
    throw new Error(chatUnavailable);
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.error ?? "Something went wrong. Please try again.");
    (error as Error & { status: number; code?: string }).status = response.status;
    (error as Error & { status: number; code?: string }).code = typeof body.code === "string" ? body.code : undefined;
    throw error;
  }
  return body as T;
}

// Only the server's own "this conversation is not available" counts. A 404 from a misrouted proxy has no such
// code, and must not make the browser forget a token it can never get back.
const isGone = (error: unknown) =>
  (error as { status?: number; code?: string }).status === 404 &&
  (error as { code?: string }).code === "conversation_not_found";

/** Earlier messages from this browser's conversation, or none if there is no conversation to open. */
export async function loadConversation(): Promise<ChatMessage[]> {
  const conversation = storedConversation();
  if (!conversation) return [];
  try {
    const { messages } = await request<{ messages: ApiMessage[] }>(
      `/visitors/${conversation.id}/messages`,
      undefined,
      conversation.token,
    );
    return messages.map(toChatMessage);
  } catch (error) {
    // Not found covers a conversation the server no longer lets this browser open (one started before
    // tokens, for instance). She starts a fresh one without an error she cannot act on.
    if (isGone(error)) {
      storeConversation(null);
      return [];
    }
    throw error;
  }
}

export async function sendToCrownie(text: string): Promise<ChatMessage> {
  let conversation = storedConversation();
  if (!conversation) {
    const created = await request<{ id: string; token?: string }>("/visitors", { method: "POST" });
    conversation = { id: created.id, token: created.token ?? null };
    storeConversation(conversation);
  }
  try {
    const { reply } = await request<{ reply: ApiMessage }>(
      `/visitors/${conversation.id}/messages`,
      { method: "POST", body: JSON.stringify({ text }) },
      conversation.token,
    );
    return toChatMessage(reply);
  } catch (error) {
    if (isGone(error)) {
      // The next message starts a new conversation; this one gets the same gentle line as any other failure.
      storeConversation(null);
      throw new Error(chatUnavailable);
    }
    throw error;
  }
}
