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
- **Done:** Crownie chat (`/crownie`) answers live (MiniMax-M3) and remembers the conversation per browser. API: `server/`, running at https://demos.linkedtrust.us/bodycrown-api/ on the shared dev VM; DB `bodycrown` on the shared Postgres.
- **Open:** Crownie's instructions in `server/src/crownie.ts` are AI-written placeholders around the site's own copy; replace with the founder's guidance.
- **Open:** API moves to its own VM: `cobox/ansible/vms/bodycrown/` (needs VM IP and API domain).
- **Open:** journal.
- **Done:** the GitHub repo is connected to Vercel; every merge to `main` deploys to production (checked against the deployment list). The VM 200 demo and API are separate: the API changes only when its code is rebuilt and the service restarted, and the demo only when `scripts/build-subpath.sh` is run and copied to `/var/www/demos/bodycrown`.
- **Done:** each conversation is protected by a secret token (migration `002_visitor_token.sql`); without it a conversation cannot be read or written. This holds whenever `AUTH_REQUIRED` is on, which is the default. `AUTH_REQUIRED=false` exists only for a short rollout window and turns the protection off while it lasts, so the VM 200 `.env` must not keep it.
- **Open:** point the client's domain at the Vercel project when ready.

## Notes

- Signup forms post to the real Body & Crown Mailchimp list, so test signups become real subscribers.
- Developer setup and code structure: see [README.md](README.md).
