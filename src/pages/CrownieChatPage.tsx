import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Crown, Divider, Quote } from "@/components/ui";
import { crisisSupport, type ChatMessage } from "@/data/content";
import { loadConversation, sendToCrownie } from "@/lib/crownieApi";
import { sitePath } from "@/lib/sitePath";

function CrownieMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`crownie-mark${compact ? " crownie-mark--compact" : ""}`} aria-hidden="true">
      <span className="crownie-mark-orbit" />
      <Crown />
    </span>
  );
}

function ChatHeader() {
  return (
    <header className="chat-header">
      <a className="chat-brand" href={sitePath("/")} aria-label="Body and Crown home">
        Body &amp; Crown™
      </a>
      <div className="crownie-identity" aria-label="Crownie">
        <CrownieMark compact />
        <span>Crownie</span>
      </div>
      <a className="chat-meet-link" href={sitePath("/meet-crownie")} aria-label="Meet Crownie">
        <span>Meet Crownie</span>
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </a>
    </header>
  );
}

function UserMessage({ children }: { children: ReactNode }) {
  return (
    <article className="chat-message chat-message--user">
      <p className="chat-speaker">Her</p>
      <p>{children}</p>
    </article>
  );
}

function CrownieMessage({ children }: { children: ReactNode }) {
  return (
    <article className="chat-message chat-message--crownie">
      <div className="chat-crownie-label">
        <CrownieMark compact />
        <p className="chat-speaker">Crownie</p>
      </div>
      <p>{children}</p>
    </article>
  );
}

function LoadingState() {
  return (
    <div className="crownie-loading" role="status" aria-label="Crownie is responding">
      <CrownieMark compact />
      <span />
    </div>
  );
}

function Composer({
  value,
  onChange,
  onSubmit,
  sending,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  sending: boolean;
  error: string;
}) {
  function submit(event: FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <div className="composer-shell">
      <form className="composer" onSubmit={submit}>
        <textarea
          aria-label="Message Crownie"
          rows={1}
          value={value}
          disabled={sending}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSubmit();
            }
          }}
        />
        <button
          className="send-button"
          type="submit"
          aria-label="Send message"
          disabled={sending || !value.trim()}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M12 19V5M6 11l6-6 6 6" />
          </svg>
        </button>
      </form>
      {error && (
        <p className="composer-error" role="alert">
          {error}
        </p>
      )}
      <p className="composer-note">{crisisSupport}</p>
    </div>
  );
}

export default function CrownieChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const conversationEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversation()
      .then(setMessages)
      .catch(() => setError("Your earlier conversation couldn't be loaded."));
  }, []);

  useEffect(() => {
    conversationEnd.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending]);

  async function sendMessage() {
    const message = draft.trim();
    if (!message || sending) return;

    const pending: ChatMessage = { id: -Date.now(), speaker: "Her", text: message };
    setMessages((current) => [...current, pending]);
    setDraft("");
    setError("");
    setSending(true);
    try {
      const reply = await sendToCrownie(message);
      setMessages((current) => [...current, reply]);
    } catch (failure) {
      // Nothing was saved: take the message back out and return it to the box.
      setMessages((current) => current.filter((m) => m !== pending));
      setDraft(message);
      setError((failure as Error).message);
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="chat-experience">
      <ChatHeader />
      <section className="chat-conversation" aria-live="polite">
        <div className="chat-welcome">
          <CrownieMark />
          <Quote>
            You&apos;ve been strong for everyone else.
            <br />
            This is your space to just… breathe.
          </Quote>
          <Divider />
        </div>
        <div className="message-group">
          {messages.map((message) =>
            message.speaker === "Crownie" ? (
              <CrownieMessage key={message.id}>{message.text}</CrownieMessage>
            ) : (
              <UserMessage key={message.id}>{message.text}</UserMessage>
            ),
          )}
          {sending && <LoadingState />}
          <div ref={conversationEnd} />
        </div>
      </section>
      <Composer
        value={draft}
        onChange={setDraft}
        onSubmit={sendMessage}
        sending={sending}
        error={error}
      />
    </main>
  );
}
