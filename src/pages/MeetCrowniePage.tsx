import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SignupForm from "@/components/SignupForm";
import { Crown } from "@/components/ui";
import { faqs, sampleConversation } from "@/data/content";
import { sitePath } from "@/lib/sitePath";
import "./MeetCrowniePage.css";

const stays = "She doesn't rush you. She doesn't judge you. She simply stays.";

export default function MeetCrowniePage() {
  return (
    <>
      <Header />
      <main className="mc">
        <section className="mc-hero" id="top">
          <div className="mc-hero-inner">
            <div className="mc-hero-copy">
              <p className="mc-eyebrow mc-eyebrow--dark">Meet Crownie</p>
              <Crown className="mc-hero-crown" />
              <h1 className="mc-display">
                What it feels like <em>to be met.</em>
              </h1>
              <p className="mc-lede">
                Crownie is the first voice you meet, not the last. She welcomes you into Body
                &amp; Crown, a living space for emotional wellness that grows with you. A place
                to reconnect with yourself, with each other, and with the world.
              </p>
              <a className="mc-btn" href={sitePath("/crownie")}>
                Step Inside ♛
              </a>
            </div>
            <figure className="mc-hero-media">
              <img
                src={sitePath("/images/meet-crownie-hero.jpg")}
                alt="Five women in white shirts hugging and laughing together"
                width={1000}
                height={1500}
              />
              <figcaption>{stays}</figcaption>
            </figure>
          </div>
        </section>

        <section className="mc-convo" id="conversation">
          <div className="mc-convo-glow" aria-hidden="true" />
          <div className="mc-convo-inner reveal">
            <div className="mc-convo-rule" aria-hidden="true" />
            {sampleConversation.map((turn, index) => (
              <div
                className={`mc-msg mc-msg--${turn.speaker.toLowerCase()}`}
                key={`${turn.speaker}-${index}`}
              >
                <span className="mc-msg-who">
                  {turn.speaker === "Crownie" && <Crown />}
                  {turn.speaker}
                </span>
                <p>{turn.text}</p>
              </div>
            ))}
            <p className="mc-convo-sign">{stays}</p>
          </div>
        </section>

        <section className="mc-voice" id="voice">
          <div className="mc-voice-inner">
            <figure className="mc-voice-media reveal">
              <img
                src={sitePath("/images/meet-crownie-voice.jpg")}
                alt="Woman in glasses looking over her shoulder against a warm stone wall"
                width={1000}
                height={1500}
                loading="lazy"
              />
            </figure>
            <div className="mc-voice-copy reveal">
              <p className="mc-eyebrow">Culturally intelligent by design</p>
              <h2 className="mc-display mc-display--md">
                She meets you in the voice that feels like <em>home.</em>
              </h2>
              <span className="mc-rule" aria-hidden="true" />
              <p>
                Crownie is built to recognize context, culture, tone, and lived experience, so
                support feels familiar, thoughtful, and human rather than generic.
              </p>
              <p>
                Body &amp; Crown is diaspora-rooted and designed to meet women across cultures,
                identities, and ways of moving through the world.
              </p>
              <blockquote>
                Because feeling understood should never depend on sounding the same.
              </blockquote>
            </div>
          </div>
        </section>

        <section className="mc-faq" id="faq">
          <div className="mc-faq-inner">
            <div className="reveal">
              <p className="mc-eyebrow">Questions &amp; answers</p>
              <h2 className="mc-display mc-display--md">
                Everything you need <em>to know.</em>
              </h2>
              <span className="mc-rule" aria-hidden="true" />
            </div>
            <div className="mc-faq-list reveal">
              {faqs.map((faq, index) => (
                <details key={faq.question} open={index === 0}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="mc-waitlist" id="invitation">
          <div className="mc-waitlist-card reveal">
            <Crown />
            <p className="mc-eyebrow">An invitation</p>
            <h2 className="mc-display mc-display--md">
              Step into the space made <em>for you.</em>
            </h2>
            <p className="mc-waitlist-sub">
              Body &amp; Crown is becoming a place, and a circle is forming at its center. Add
              your name. You will be among the first welcomed in, and among those who shape
              what it becomes.
            </p>
            <SignupForm variant="invitation" />
            <p className="mc-waitlist-note">No spam. Just a gentle note when it&apos;s time. ♛</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
