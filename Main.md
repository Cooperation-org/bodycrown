# Body & Crown™ — Main

Hub for the Body & Crown website project: where everything lives and how it fits together.

## Links

| What           | Link                                                                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Live site      | https://bodycrown.vercel.app                                                                                                               |
| Client notes   | _TODO: add link_                                                                                                                           |
| GitHub repo    | https://github.com/Cooperation-org/bodycrown                                                                                               |
| Figma design   | https://www.figma.com/make/sGZ96K2oc6cMTICob15BnN/Body---Crown-Animation                                                                   |
| Vercel project | https://vercel.com/sahdasamiers-projects/bodycrown                                                                                         |
| Client site    | bodyandcrown.co                                                                                                                            |

## Pages

| Page            | Live URL                                  |
| --------------- | ----------------------------------------- |
| Home            | https://bodycrown.vercel.app/             |
| Meet Crownie    | https://bodycrown.vercel.app/meet-crownie |
| Our Philosophy  | https://bodycrown.vercel.app/philosophy   |
| Manifesto       | https://bodycrown.vercel.app/about        |
| Join the Circle | https://bodycrown.vercel.app/join         |
| Crownie chat    | https://bodycrown.vercel.app/crownie      |

## Status

- **Done:** site ported from Figma Make into this repo (React + Vite + TypeScript), deployed to Vercel.
- **Done:** "Reserve My Place" signup submits to Mailchimp inline and shows a confirmation on the page.
- **Open:** Crownie chat (`/crownie`) is a demo with canned replies; needs a real backend.
- **Open:** deploys are manual (`npx vercel deploy --prod`); connect the GitHub repo in Vercel for auto-deploys on push.
- **Open:** point the client's domain at the Vercel project when ready.

## Notes

- Signup forms post to the real Body & Crown Mailchimp list, so test signups become real subscribers.
- Developer setup and code structure: see [README.md](README.md).
