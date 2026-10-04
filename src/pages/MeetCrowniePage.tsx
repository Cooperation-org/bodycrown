import type { ReactNode } from "react";
import FAQAccordion from "@/components/FAQAccordion";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import InvitationSection from "@/components/InvitationSection";
import { Crown, PrimaryCTA, Quote, SectionHeading } from "@/components/ui";
import { sampleConversation } from "@/data/content";
import { sitePath } from "@/lib/sitePath";

function ConversationBlock() {
  return (
    <div className="crownie-conversation reveal">
      {sampleConversation.map((turn, index) => (
        <article
          className={`crownie-conversation-block crownie-conversation-block--${turn.speaker.toLowerCase()}`}
          key={`${turn.speaker}-${index}`}
        >
          <div className="crownie-voice">
            {turn.speaker === "Crownie" && <Crown />}
            <p>{turn.speaker}</p>
          </div>
          <Quote>{turn.text}</Quote>
        </article>
      ))}
    </div>
  );
}

function ContentSection({
  className = "",
  children,
  id,
}: {
  className?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section className={`crownie-content-section ${className}`} id={id}>
      {children}
    </section>
  );
}

export default function MeetCrowniePage() {
  return (
    <>
      <Header />
      <main className="crownie-page">
        <section className="crownie-page-hero" id="top">
          <div className="crownie-page-hero-copy reveal">
            <p className="section-label">Meet Crownie</p>
            <Crown className="crownie-page-mark" />
            <h1>
              What it feels like <em>to be met.</em>
            </h1>
            <p className="crownie-page-intro">
              Crownie is the first voice you meet, not the last. She welcomes you into Body
              &amp; Crown, a living space for emotional wellness that grows with you. A place
              to reconnect with yourself, with each other, and with the world.
            </p>
            <PrimaryCTA href={sitePath("/crownie")}>Step Inside ♛</PrimaryCTA>
          </div>
          <div className="crownie-page-hero-image reveal">
            <img src={sitePath("/images/hero-editorial.jpg")} alt="Woman resting in warm natural light" />
            <Quote>She doesn&apos;t rush you. She doesn&apos;t judge you. She simply stays.</Quote>
          </div>
        </section>

        <ContentSection className="crownie-arrival" id="conversation">
          <div className="content-width">
            <div className="crownie-conversation-marker" aria-hidden="true">
              <span />
              <Crown />
              <span />
            </div>
            <ConversationBlock />
            <p className="crownie-stays reveal">
              She doesn&apos;t rush you. She doesn&apos;t judge you. She simply stays.
            </p>
          </div>
        </ContentSection>

        <ContentSection className="crownie-explanation">
          <div className="content-width crownie-explanation-grid">
            <div className="crownie-explanation-image reveal">
              <img
                src={sitePath("/images/cultural-editorial.jpg")}
                alt="Woman in profile against a warm earth-toned background"
              />
            </div>
            <div className="crownie-explanation-copy reveal">
              <SectionHeading label="Culturally intelligent by design">
                She meets you in the voice that feels like <em>home.</em>
              </SectionHeading>
              <p>
                Crownie is built to recognize context, culture, tone, and lived experience,
                so support feels familiar, thoughtful, and human rather than generic.
              </p>
              <p>
                Body &amp; Crown is diaspora-rooted and designed to meet women across
                cultures, identities, and ways of moving through the world.
              </p>
              <Quote>Because feeling understood should never depend on sounding the same.</Quote>
            </div>
          </div>
        </ContentSection>

        <ContentSection className="crownie-reassurance">
          <div className="content-width crownie-reassurance-grid">
            <SectionHeading label="Questions & answers">
              Everything you need <em>to know.</em>
            </SectionHeading>
            <FAQAccordion />
          </div>
        </ContentSection>

        <InvitationSection />
      </main>
      <Footer />
    </>
  );
}
