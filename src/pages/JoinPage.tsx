import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SignupForm from "@/components/SignupForm";
import { Crown, Divider } from "@/components/ui";

export default function JoinPage() {
  return (
    <>
      <Header />
      <main className="join-page" id="top">
        <section className="join-invitation">
          <div className="join-copy reveal">
            <div className="join-label">
              <Crown />
              <p>An invitation</p>
            </div>
            <h1>
              Step into the space made <em>for you.</em>
            </h1>
            <Divider />
            <p className="join-intro">
              Body &amp; Crown is becoming a place, and a circle is forming at its center.
              Add your name. You will be among the first welcomed in, and among those who
              shape what it becomes.
            </p>
          </div>

          <div className="join-form-wrap reveal">
            <Crown className="join-form-crown" />
            <SignupForm variant="join" />
            <p className="join-fineprint">No spam. Just a gentle note when it&apos;s time. ♛</p>
            <p className="join-reset">Crown Reset, a seven-day return to yourself, opens soon.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
