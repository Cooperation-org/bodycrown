import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Crown, Divider, Quote, SecondaryLink, SectionHeading } from "@/components/ui";
import { beliefs, manifestoHref } from "@/data/content";
import { sitePath } from "@/lib/sitePath";

function PhilosophyStatement({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <article className="philosophy-statement reveal">
      <h2>{title}</h2>
      <p>{children}</p>
    </article>
  );
}

export default function PhilosophyPage() {
  return (
    <>
      <Header />
      <main className="philosophy-page">
        <section className="philosophy-page-opening" id="top">
          <div className="philosophy-page-opening-inner reveal">
            <p className="section-label">Our philosophy</p>
            <Crown className="philosophy-page-mark" />
            <h1>
              Healing happens in <em>relationship.</em>
            </h1>
            <Divider />
            <p className="philosophy-page-lede">
              With yourself. With your community. With the world around you. With your body,
              your emotions, and your purpose. Body &amp; Crown exists to nurture every one
              of those bonds.
            </p>
          </div>
          <p className="philosophy-margin-note reveal">
            A culturally rooted home for emotional wellness, growing with you over time.
          </p>
        </section>

        <section className="philosophy-page-principles">
          <div className="content-width">
            <div className="philosophy-principles-heading reveal">
              <span>Our philosophy</span>
              <Divider />
            </div>
            <div className="philosophy-statements">
              <PhilosophyStatement title="You were never broken.">
                Only tired of holding it all alone.
              </PhilosophyStatement>
              <PhilosophyStatement title="Technology should feel like compassion,">
                not a transaction.
              </PhilosophyStatement>
              <PhilosophyStatement title="This will never replace human connection.">
                It exists to bring more of it to you.
              </PhilosophyStatement>
            </div>
          </div>
        </section>

        <section className="philosophy-page-founder">
          <div className="content-width philosophy-page-founder-grid reveal">
            <div className="philosophy-page-founder-image">
              <img
                src={sitePath("/images/lanika-portrait.jpg")}
                alt="Lanika Johnson, Founder and CEO of Body & Crown"
              />
            </div>
            <div className="philosophy-page-founder-copy">
              <Crown />
              <Quote>“I didn&apos;t research this problem. I lived it. So I built the space.”</Quote>
              <p className="philosophy-page-founder-name">Lanika Johnson · Founder &amp; CEO</p>
              <Divider />
              <p>
                Twenty one years in behavioral health and community advocacy, holding space
                for people in their hardest seasons. She knows this terrain from the inside,
                not from research. Body &amp; Crown is the space she kept wishing existed.
              </p>
            </div>
          </div>
        </section>

        <section className="philosophy-page-beliefs">
          <div className="content-width">
            <SectionHeading label="What we believe">
              A few things we hold to be <em>true.</em>
            </SectionHeading>
            <ol className="philosophy-page-belief-list reveal">
              {beliefs.map((belief) => (
                <li key={belief}>{belief}</li>
              ))}
            </ol>
            <SecondaryLink href={manifestoHref}>
              Read the Body &amp; Crown Manifesto →
            </SecondaryLink>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
