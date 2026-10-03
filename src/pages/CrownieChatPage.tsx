import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Crown, Divider, Quote } from "@/components/ui";
import { crownieDemoResponses, initialChatMessages, type ChatMessage } from "@/data/content";

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
      <a className="chat-brand" href="/" aria-label="Body and Crown home">
        Body &amp; Crown™
      </a>
      <div className="crownie-identity" aria-label="Crownie">
        <CrownieMark compact />
        <span>Crownie</span>
      </div>
      <a className="chat-meet-link" href="/meet-crownie" aria-label="Meet Crownie">
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
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  sending: boolean;
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
    </div>
  );
}

export default function CrownieChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const responseIndex = useRef(0);
  const conversationEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    conversationEnd.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending]);

  function sendMessage() {
    const message = draft.trim();
    if (!message || sending) return;

    setMessages((current) => [...current, { id: Date.now(), speaker: "Her", text: message }]);
    setDraft("");
    setSending(true);

    // Demo only: cycle through canned replies until a real Crownie backend exists.
    window.setTimeout(() => {
      const reply = crownieDemoResponses[responseIndex.current % crownieDemoResponses.length];
      responseIndex.current += 1;
      setMessages((current) => [
        ...current,
        { id: Date.now() + 1, speaker: "Crownie", text: reply },
      ]);
      setSending(false);
    }, 900);
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
      <Composer value={draft} onChange={setDraft} onSubmit={sendMessage} sending={sending} />
    </main>
  );
}
