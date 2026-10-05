import type { ReactNode } from "react";

export function Crown({ className = "" }: { className?: string }) {
  return (
    <span className={`crown ${className}`} aria-hidden="true">
      ♛
    </span>
  );
}

export function Divider() {
  return <span className="divider" aria-hidden="true" />;
}

export function PrimaryCTA({
  href,
  children,
  light = false,
}: {
  href: string;
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <a className={`primary-cta${light ? " primary-cta--light" : ""}`} href={href}>
      {children}
    </a>
  );
}

export function SecondaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="secondary-link" href={href}>
      {children}
    </a>
  );
}

export function SectionHeading({
  label,
  children,
  align = "left",
}: {
  label: string;
  children: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <header className={`section-heading section-heading--${align}`}>
      <p className="section-label">{label}</p>
      <h2>{children}</h2>
      <Divider />
    </header>
  );
}

export function Quote({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <blockquote className={`quote ${className}`}>{children}</blockquote>;
}

export function TextInput({
  id,
  label,
  name,
  type = "text",
  placeholder,
  required,
  autoComplete,
}: {
  id: string;
  label: string;
  name: string;
  type?: "text" | "email";
  placeholder: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
      />
    </label>
  );
}
