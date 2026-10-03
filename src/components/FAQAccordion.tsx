import { useState } from "react";
import { faqs } from "@/data/content";

export default function FAQAccordion() {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq-list reveal">
      {faqs.map((faq, index) => {
        const isOpen = open === index;
        return (
          <article className={`faq-item${isOpen ? " faq-item--open" : ""}`} key={faq.question}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${index}`}
              onClick={() => setOpen(isOpen ? -1 : index)}
            >
              <span>{faq.question}</span>
              <span className="faq-mark" aria-hidden="true">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            <div className="faq-answer" id={`faq-answer-${index}`}>
              <p>{faq.answer}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
