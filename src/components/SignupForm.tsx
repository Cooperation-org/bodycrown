import { useState, type FormEvent } from "react";
import { mailchimpAction, mailchimpHoneypotName } from "@/data/content";
import { Crown, TextInput } from "./ui";

type MailchimpResponse = { result: "success" | "error"; msg: string };
type Status =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "done"; message: string }
  | { state: "error"; message: string };

/**
 * Mailchimp's form endpoint has no CORS, but its `post-json` variant supports
 * JSONP, which lets us subscribe without navigating away from the page.
 */
function subscribe(form: HTMLFormElement): Promise<MailchimpResponse> {
  return new Promise((resolve, reject) => {
    const callback = `bodycrownSignup${Date.now()}`;
    const params = new URLSearchParams();
    for (const [key, value] of new FormData(form)) params.append(key, String(value));
    params.append("c", callback);

    const script = document.createElement("script");
    const callbacks = window as unknown as Record<string, unknown>;
    const timeout = window.setTimeout(() => finish(new Error("Request timed out")), 15000);

    function finish(error: Error | null, response?: MailchimpResponse) {
      window.clearTimeout(timeout);
      delete callbacks[callback];
      script.remove();
      if (error) reject(error);
      else resolve(response!);
    }

    callbacks[callback] = (response: MailchimpResponse) => finish(null, response);
    script.onerror = () => finish(new Error("Network error"));
    script.src = `${mailchimpAction.replace("/post?", "/post-json?")}&${params}`;
    document.body.appendChild(script);
  });
}

/** Mailchimp messages can start with "0 - " and contain HTML links; keep the plain text. */
function cleanMessage(msg: string) {
  const text = new DOMParser().parseFromString(msg, "text/html").body.textContent ?? msg;
  return text.replace(/^\d+\s*-\s*/, "").trim();
}

/** Mailchimp waitlist form. `variant` picks the class names used by each page's styles. */
export default function SignupForm({ variant }: { variant: "invitation" | "join" }) {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const prefix = variant === "invitation" ? "inv" : "join";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setStatus({ state: "sending" });
    try {
      const response = await subscribe(form);
      if (response.result === "success") {
        setStatus({ state: "done", message: "Your place is reserved." });
      } else if (/already subscribed/i.test(response.msg)) {
        setStatus({ state: "done", message: "You're already in the circle." });
      } else {
        setStatus({ state: "error", message: cleanMessage(response.msg) });
      }
    } catch {
      setStatus({ state: "error", message: "Something went wrong. Please try again." });
    }
  }

  if (status.state === "done") {
    return (
      <div className={`signup-success signup-success--${variant}`} role="status">
        <Crown />
        <p className="signup-success-title">{status.message}</p>
        <p>
          Thank you for stepping in. Check your inbox for a gentle note from us, and we will
          let you know when it&apos;s time. ♛
        </p>
      </div>
    );
  }

  const sending = status.state === "sending";

  return (
    <form
      className={variant === "invitation" ? "invitation-form" : "join-form"}
      action={mailchimpAction}
      method="post"
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="honeypot" aria-hidden="true">
        <input type="text" name={mailchimpHoneypotName} tabIndex={-1} defaultValue="" />
      </div>
      <TextInput
        id={`${prefix}-fname`}
        label="First Name"
        name="FNAME"
        placeholder="Your first name"
        autoComplete="given-name"
      />
      <TextInput
        id={`${prefix}-email`}
        label="Email Address"
        name="EMAIL"
        type="email"
        placeholder="your@email.com"
        autoComplete="email"
        required
      />
      <button
        className={variant === "invitation" ? "form-submit" : "join-submit"}
        type="submit"
        name="subscribe"
        disabled={sending}
      >
        {sending ? "Reserving…" : "Reserve My Place ♛"}
      </button>
      {status.state === "error" && (
        <p className="signup-error" role="alert">
          {status.message}
        </p>
      )}
    </form>
  );
}
