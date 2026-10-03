import SignupForm from "./SignupForm";
import { Crown, SectionHeading } from "./ui";

export default function InvitationSection() {
  return (
    <section className="invitation section-space" id="invitation">
      <div className="invitation-inner reveal">
        <Crown />
        <SectionHeading label="An invitation" align="center">
          Step into the space made <em>for you.</em>
        </SectionHeading>
        <p className="invitation-copy">
          Body &amp; Crown is becoming a place, and a circle is forming at its center. Add your
          name. You will be among the first welcomed in, and among those who shape what it
          becomes.
        </p>
        <SignupForm variant="invitation" />
        <p className="form-note">No spam. Just a gentle note when it&apos;s time. ♛</p>
        <p className="reset-note">Crown Reset, a seven-day return to yourself, opens soon.</p>
      </div>
    </section>
  );
}
