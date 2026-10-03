# Body & Crown™

Marketing site and Crownie chat prototype for Body & Crown, a culturally rooted space for emotional wellness. Originally designed in Figma Make.

## Stack

React 19 · TypeScript · Vite 8 · Tailwind CSS v4 (plus hand-written CSS in `src/index.css`)

## Getting started

```bash
pnpm install
pnpm dev       # http://localhost:5173
pnpm build     # typecheck + production build into dist/
pnpm preview   # serve the production build
```

## Routes

| Path            | Page                                  |
| --------------- | ------------------------------------- |
| `/`             | Home                                  |
| `/meet-crownie` | Meet Crownie                          |
| `/philosophy`   | Our Philosophy                        |
| `/about`        | Manifesto                             |
| `/join`         | Join the Circle (Mailchimp waitlist)  |
| `/crownie`      | Crownie chat (demo, canned replies)   |

Routing is plain `window.location.pathname` matching in `src/App.tsx`, so when deploying, the host must serve `index.html` for every path (SPA fallback).

## Structure

```
src/
  App.tsx            route table
  data/content.ts    all copy: FAQs, beliefs, manifesto, chat script, Mailchimp config
  components/        shared UI (Header, Footer, FAQAccordion, SignupForm, primitives in ui.tsx)
  pages/             one file per route
  hooks/useReveal.ts scroll-reveal animation trigger
  index.css          design tokens, all styles and keyframe animations
public/images/       editorial photography
```

## Animations

- **Scroll reveal**: any element with `.reveal` fades and rises in when it enters the viewport (`useReveal` + `.reveal`/`.visible` in `index.css`).
- **Chat**: `message-arrival` (new messages), `crown-breathe` (Crownie mark while thinking), `quiet-progress` (loading bar).
- All motion respects `prefers-reduced-motion`.
