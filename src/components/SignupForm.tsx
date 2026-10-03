import { mailchimpAction, mailchimpHoneypotName } from "@/data/content";
import { TextInput } from "./ui";

/** Mailchimp waitlist form. `variant` picks the class names used by each page's styles. */
export default function SignupForm({ variant }: { variant: "invitation" | "join" }) {
  const prefix = variant === "invitation" ? "inv" : "join";
  return (
    <form
      className={variant === "invitation" ? "invitation-form" : "join-form"}
      action={mailchimpAction}
      method="post"
      target="_blank"
      noValidate
    >
      <div className="honeypot" aria-hidden="true">
        <input type="text" name={mailchimpHoneypotName} tabIndex={-1} />
      </div>
      <TextInput
        id={`${prefix}-fname`}
        label="First Name"
        name="FNAME"
        placeholder="Your first name"
      />
      <TextInput
        id={`${prefix}-email`}
        label="Email Address"
        name="EMAIL"
        type="email"
        placeholder="your@email.com"
        required
      />
      <button
        className={variant === "invitation" ? "form-submit" : "join-submit"}
        type="submit"
        name="subscribe"
      >
        Reserve My Place ♛
      </button>
    </form>
  );
}
