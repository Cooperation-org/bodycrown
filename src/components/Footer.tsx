import { manifestoHref } from "@/data/content";
import { Crown, Quote } from "./ui";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="content-width footer-top">
        <div>
          <a className="footer-brand" href="#top">
            <Crown />
            Body &amp; Crown™
          </a>
          <p>A living space for emotional wellness.</p>
        </div>
        <Quote>“Your crown never fell off. You just needed space to adjust it.” ♛</Quote>
      </div>
      <div className="content-width footer-nav">
        <nav aria-label="Footer navigation">
          <a href="/meet-crownie">Meet Crownie</a>
          <a href="/philosophy">Philosophy</a>
          <a href={manifestoHref}>Manifesto</a>
          <a href="/join">Join the Circle</a>
        </nav>
        <p>
          © 2026 Body &amp; Crown™ · All rights reserved · Built with intention by Lanika
          Johnson · bodyandcrown.co
        </p>
      </div>
    </footer>
  );
}
