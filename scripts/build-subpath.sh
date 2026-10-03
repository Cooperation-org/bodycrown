#!/usr/bin/env bash
# Builds the site to run under a path prefix on a plain static host
# (e.g. demos.linkedtrust.us/bodycrown/), where there is no SPA fallback:
# each route gets its own directory holding index.html.
#   scripts/build-subpath.sh /bodycrown/ /var/www/demos/bodycrown
set -euo pipefail
base="$1"
out="$2"
routes=(meet-crownie philosophy about join crownie)  # keep in step with src/App.tsx

BASE_PATH="$base" npx vite build --outDir "$out" --emptyOutDir
rm -f "$out/404.html"  # Vercel's 404 page; the static host has its own
for route in "${routes[@]}"; do
  mkdir -p "$out/$route"
  cp "$out/index.html" "$out/$route/index.html"
done
