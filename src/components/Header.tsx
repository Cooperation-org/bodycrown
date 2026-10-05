import { useEffect, useState } from "react";
import { navLinks } from "@/data/content";
import { Crown, PrimaryCTA } from "./ui";
import { sitePath } from "@/lib/sitePath";

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header className="site-header">
      <a className="brand" href={sitePath("/")} aria-label="Body and Crown home">
        <Crown />
        <span>Body &amp; Crown™</span>
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {navLinks.map((link) => (
          <a key={link.label} href={link.href}>
            {link.label}
          </a>
        ))}
        <PrimaryCTA href={sitePath("/join")}>Join the Circle ♛</PrimaryCTA>
      </nav>
      <button
        className="menu-button"
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
      </button>
      <nav
        className={`mobile-nav${open ? " mobile-nav--open" : ""}`}
        id="mobile-navigation"
        aria-label="Mobile navigation"
      >
        {navLinks.map((link) => (
          <a key={link.label} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
        <PrimaryCTA href={sitePath("/join")}>Join the Circle ♛</PrimaryCTA>
      </nav>
    </header>
  );
}
