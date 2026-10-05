import type { ReactNode } from "react";
import FAQAccordion from "@/components/FAQAccordion";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import InvitationSection from "@/components/InvitationSection";
import { Crown, Divider, PrimaryCTA, Quote, SecondaryLink, SectionHeading } from "@/components/ui";
import { beliefs, manifestoHref, pathways, sampleConversation } from "@/data/content";
import { sitePath } from "@/lib/sitePath";

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-copy reveal">
        <p className="hero-kicker">Body &amp; Crown™</p>
        <Crown className="hero-crown" />
        <h1>
          Your crown deserves somewhere <em>safe to rest.</em>
        </h1>
        <Quote>
          “You&apos;ve been strong for everyone else.
          <br />
          This is your space to just… breathe.”
        </Quote>
        <p className="hero-positioning">
          A culturally rooted home for emotional wellness, growing with you over time.
        </p>
        <div className="hero-action">
          <PrimaryCTA href={sitePath("/crownie")}>Step Inside ♛</PrimaryCTA>
          <small>A gentle space, alive and growing ♛</small>
        </div>
      </div>
      <div className="hero-visual reveal">
        <div className="hero-image-wrap">
          <img
            src={sitePath("/images/hero-editorial.jpg")}
            alt="Woman wrapped in flowing white fabric in warm light"
          />
        </div>
        <p className="hero-caption">Take a breath &amp; enter</p>
      </div>
    </section>
  );
}

function CrownieSection() {
  return (
    <section className="crownie-section section-space" id="crownie">
      <div className="content-width">
        <SectionHeading label="Meet Crownie">
          What it feels like <em>to be met.</em>
        </SectionHeading>
        <div className="conversation reveal">
          {sampleConversation.map((turn, index) => (
            <article
              className={`conversation-turn conversation-turn--${turn.speaker.toLowerCase()}`}
              key={`${turn.speaker}-${index}`}
            >
              <p className="speaker">{turn.speaker}</p>
              <p>{turn.text}</p>
            </article>
          ))}
        </div>
        <p className="conversation-close reveal">
          She doesn&apos;t rush you. She doesn&apos;t judge you. She simply stays.
        </p>
        <div className="conversation-action reveal">
          <PrimaryCTA href={sitePath("/crownie")}>Step Inside ♛</PrimaryCTA>
        </div>
      </div>
    </section>
  );
}

function PathwaysSection() {
  return (
    <section className="pathways section-space">
      <div className="content-width">
        <SectionHeading label="The wider space">
          More than one way to come <em>home.</em>
        </SectionHeading>
        <p className="section-intro reveal">
          Crownie is the first voice you meet, not the last. She welcomes you into Body &amp;
          Crown, a living space for emotional wellness that grows with you. A place to
          reconnect with yourself, with each other, and with the world.
        </p>
        <div className="pathway-list reveal">
          {pathways.map((pathway) => (
            <article className="pathway" key={pathway.title}>
              <Crown />
              <h3>{pathway.title}</h3>
              <p>{pathway.description}</p>
            </article>
          ))}
        </div>
        <p className="season-note reveal">
          Some of this is here now. More arrives, season by season. You are early, and that
          is the gift.
        </p>
      </div>
    </section>
  );
}

function PhilosophySection() {
  return (
    <section className="philosophy section-space" id="philosophy">
      <div className="content-width philosophy-grid">
        <SectionHeading label="Our philosophy">
          Healing happens in <em>relationship.</em>
        </SectionHeading>
        <div className="philosophy-copy reveal">
          <p className="section-intro">
            With yourself. With your community. With the world around you. With your body,
            your emotions, and your purpose. Body &amp; Crown exists to nurture every one of
            those bonds.
          </p>
          <ul>
            <li>
              <strong>You were never broken.</strong> Only tired of holding it all alone.
            </li>
            <li>
              <strong>Technology should feel like compassion,</strong> not a transaction.
            </li>
            <li>
              <strong>This will never replace human connection.</strong> It exists to bring
              more of it to you.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function FounderSection() {
  return (
    <section className="founder section-space">
      <div className="content-width founder-grid reveal">
        <div className="founder-image">
          <img
            src={sitePath("/images/lanika-portrait.jpg")}
            alt="Lanika Johnson, Founder and CEO of Body & Crown"
          />
        </div>
        <div className="founder-copy">
          <Crown />
          <Quote>“I didn&apos;t research this problem. I lived it. So I built the space.”</Quote>
          <p className="founder-name">Lanika Johnson · Founder &amp; CEO</p>
          <Divider />
          <p>
            Twenty one years in behavioral health and community advocacy, holding space for
            people in their hardest seasons. She knows this terrain from the inside, not from
            research. Body &amp; Crown is the space she kept wishing existed.
          </p>
        </div>
      </div>
    </section>
  );
}

function BeliefsSection() {
  return (
    <section className="beliefs section-space">
      <div className="content-width">
        <SectionHeading label="What we believe">
          A few things we hold to be <em>true.</em>
        </SectionHeading>
        <ol className="belief-list reveal">
          {beliefs.map((belief) => (
            <li key={belief}>{belief}</li>
          ))}
        </ol>
        <SecondaryLink href={manifestoHref}>Read the Body &amp; Crown Manifesto →</SecondaryLink>
      </div>
    </section>
  );
}

function Testimonial({
  children,
  author,
  featured = false,
}: {
  children: ReactNode;
  author: ReactNode;
  featured?: boolean;
}) {
  return (
    <figure className={`testimonial${featured ? " testimonial--featured" : ""}`}>
      {featured && <Crown />}
      <Quote>{children}</Quote>
      <figcaption>{author}</figcaption>
    </figure>
  );
}

function VoicesSection() {
  return (
    <section className="voices section-space">
      <div className="content-width">
        <SectionHeading label="Community voices">
          Women felt it <em>immediately.</em>
        </SectionHeading>
        <Testimonial
          featured
          author={
            <>
              <strong>Licensed Clinician</strong>
              <span>Founding Beta Circle Member</span>
            </>
          }
        >
          “I went in with no instructions. No context. I just started using it. I came out
          feeling emotional, seen, and lighter. I didn&apos;t expect that.”
        </Testimonial>
        <div className="testimonial-grid reveal">
          <Testimonial author="Founding Beta Circle Member">
            “It feels like talking to my grandmother, or Tabitha Brown.”
          </Testimonial>
          <Testimonial author="Founding Beta Circle Member">
            “I&apos;ve never seen anything built for us, for the diaspora. This is it.”
          </Testimonial>
          <Testimonial author="Founding Beta Circle Member">
            “Someone built this from love. You can feel it. This isn&apos;t a product. This is
            a space.”
          </Testimonial>
        </div>
      </div>
    </section>
  );
}

function CultureSection() {
  return (
    <section className="culture section-space">
      <div className="content-width culture-grid">
        <div className="culture-image reveal">
          <img
            src={sitePath("/images/cultural-editorial.jpg")}
            alt="Woman in profile against a warm earth-toned background"
          />
        </div>
        <div className="culture-copy reveal">
          <SectionHeading label="Culturally intelligent by design">
            She meets you in the voice that feels like <em>home.</em>
          </SectionHeading>
          <p>
            Crownie is built to recognize context, culture, tone, and lived experience, so
            support feels familiar, thoughtful, and human rather than generic.
          </p>
          <p>
            Body &amp; Crown is diaspora-rooted and designed to meet women across cultures,
            identities, and ways of moving through the world.
          </p>
          <Quote>Because feeling understood should never depend on sounding the same.</Quote>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="faq section-space">
      <div className="content-width faq-grid">
        <SectionHeading label="Questions & answers">
          Everything you need <em>to know.</em>
        </SectionHeading>
        <FAQAccordion />
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <CrownieSection />
        <PathwaysSection />
        <PhilosophySection />
        <FounderSection />
        <BeliefsSection />
        <VoicesSection />
        <CultureSection />
        <InvitationSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
