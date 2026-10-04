// The site can be served at the domain root (Vercel) or under a path such as
// /bodycrown/ (demos.linkedtrust.us). Vite's `base` sets BASE_URL at build time.
const base = import.meta.env.BASE_URL.replace(/\/$/, "");

/** A site path ("/join") as a URL that works under the current base. */
export function sitePath(path: string) {
  return `${base}${path}`;
}

/** The current route ("/join"), without the base or a trailing slash. */
export function currentRoute() {
  const route = window.location.pathname.slice(base.length).replace(/\/$/, "");
  return route || "/";
}
