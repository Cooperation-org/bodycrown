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
| `/crownie`      | Crownie chat (live, via `server/`)    |

Routing is plain `window.location.pathname` matching in `src/App.tsx`. `vercel.json` rewrites each route to `index.html`; any other path gets `public/404.html` with a 404 status. A new route goes in both files.

## Crownie chat API (`server/`)

Node + Express + Postgres. Each browser gets a conversation id (stored in `localStorage`); every message and reply is saved, and the last 40 are sent to the model as context. The frontend reads the API base URL from `VITE_CROWNIE_API_URL` (`.env.production`, `.env.development`).

```bash
cd server
cp .env.example .env   # fill in
npm ci && npm run build
npm run migrate        # applies migrations/*.sql with MIGRATE_DATABASE_URL
npm start
```

Crownie's prompt: `server/src/crownie.ts`.

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
