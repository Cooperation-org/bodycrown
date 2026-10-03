import { useEffect } from "react";

/**
 * Fades `.reveal` elements in as they scroll into view by adding `.visible`.
 * The transition itself lives in index.css. Respects prefers-reduced-motion.
 */
export default function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.12 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}
