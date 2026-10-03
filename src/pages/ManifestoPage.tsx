import Header from "@/components/Header";
import { Crown, Divider, Quote } from "@/components/ui";
import { manifestoStatements } from "@/data/content";

function ManifestoStatement({
  statement,
  supporting,
  index,
}: {
  statement: string;
  supporting: string;
  index: number;
}) {
  return (
    <article className={`manifesto-statement manifesto-statement--${index + 1} reveal`}>
      <p className="manifesto-statement-title">{statement}</p>
      <p className="manifesto-statement-supporting">{supporting}</p>
    </article>
  );
}

function ManifestoFooter() {
  return (
    <footer className="manifesto-footer">
      <div className="content-width manifesto-footer-top">
        <div>
          <a className="footer-brand" href="/">
            <Crown />
            Body &amp; Crown™
          </a>
          <p>A living space for emotional wellness.</p>
        </div>
        <nav aria-label="Footer navigation">
          <a href="/">Home</a>
          <a href="/meet-crownie">Meet Crownie</a>
          <a href="/about">Manifesto</a>
          <a href="/join">Join the Circle</a>
        </nav>
      </div>
      <p className="content-width manifesto-footer-copy">
        © 2026 Body &amp; Crown™ · All rights reserved · Built with intention by Lanika
        Johnson · bodyandcrown.co
      </p>
    </footer>
  );
}

export default function ManifestoPage() {
  return (
    <>
      <Header />
      <main className="manifesto-page">
        <section className="manifesto-opening" id="top">
          <div className="manifesto-opening-grid reveal">
            <div className="manifesto-opening-label">
              <Crown />
              <p>The Body &amp; Crown Manifesto</p>
            </div>
            <h1>
              We began with a
              <br />
              simple conviction.
              <br />
              Healing should feel like <em>home.</em>
            </h1>
          </div>
        </section>

        <section className="manifesto-reading">
          <div className="manifesto-lead-in reveal">
            <p>
              Somewhere along the way, wellness became something distant. A luxury, a
              project, a thing you had to earn once you were already worn thin. We believe
              it was always meant to be closer than that. As close as your own breath. As
              familiar as your own name.
            </p>
          </div>
          <div className="manifesto-statements">
            {manifestoStatements.map((item, index) => (
              <ManifestoStatement
                key={item.statement}
                statement={item.statement}
                supporting={item.supporting}
                index={index}
              />
            ))}
          </div>
        </section>

        <section className="manifesto-signature reveal">
          <Crown />
          <Quote>
            Healing doesn&apos;t mean becoming someone new. It means{" "}
            <em>remembering who you&apos;ve always been.</em>
          </Quote>
          <Divider />
        </section>

        <section className="manifesto-closing">
          <div className="manifesto-closing-inner reveal">
            <p className="manifesto-closing-title">
              This is why we are building more than an app.
            </p>
            <p className="manifesto-closing-supporting">
              We are building a movement, and a home, for everyone who has carried the world
              and forgotten they were allowed to be carried too. A place to protect the
              body, honor the mind, and reclaim the crown.
            </p>
            <p className="manifesto-tagline">
              Your crown never fell off.
              <br />
              You just needed space to adjust it. ♛
            </p>
          </div>
        </section>

        <section className="manifesto-actions reveal">
          <a className="manifesto-cta" href="/join">
            Step Into the Space ♛
          </a>
          <a className="manifesto-back-link" href="/">
            ← Back Home
          </a>
        </section>
      </main>
      <ManifestoFooter />
    </>
  );
}
