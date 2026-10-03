import { manifestoHref } from "@/data/content";
import { Crown, Quote } from "./ui";
import { sitePath } from "@/lib/sitePath";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="content-width footer-top">
        <div>
          <a className="footer-brand" href={sitePath("/")}>
            <Crown />
            Body &amp; Crown™
          </a>
          <p>A living space for emotional wellness.</p>
        </div>
        <Quote>“Your crown never fell off. You just needed space to adjust it.” ♛</Quote>
      </div>
      <div className="content-width footer-nav">
        <nav aria-label="Footer navigation">
          <a href={sitePath("/meet-crownie")}>Meet Crownie</a>
          <a href={sitePath("/philosophy")}>Philosophy</a>
          <a href={manifestoHref}>Manifesto</a>
          <a href={sitePath("/join")}>Join the Circle</a>
        </nav>
        <p>
          © 2026 Body &amp; Crown™ · All rights reserved · Built with intention by Lanika
          Johnson · bodyandcrown.co
        </p>
      </div>
    </footer>
  );
}
