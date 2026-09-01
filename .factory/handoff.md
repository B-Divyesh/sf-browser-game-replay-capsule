# Replay Capsule polish 3 handoff — PASS

## Result

Repair code `a473738af5f319537ff9a6c8739caab0d83a2ff2` closes the only remaining review-3 finding: at a loaded-font 390 × 844 viewport, the complete offline, price, and privacy list now ends at **827.263 px**, leaving 16.737 px of visible space. The exact bottom-edge browser regression protects that boundary.

The repair is deployed at https://browser-game-replay-capsule.sociobot.in through Static Web Apps deployment `ffda1d32-de66-4d50-a17e-54a62c829cfc`.

## What changed

- Reduced mobile-only space before the required first-screen facts without changing the desktop layout or instrument-panel visual system.
- Added the exact 390 × 844 loaded-font regression. It asserts all three facts and requires the fact list bottom to be at most 844 px.
- Kept the one-click `/demo` sandbox, direct `?demo=1` entry, demo banner/reset/real-mode exit, isolated in-memory namespace, routing, focus handling, metadata, 404 route, legal links, and prior claim coverage intact.
- Updated the consistent footer build label to `polish-3` and the verb-first catalog description to “Replay browser-game bugs from small local files.”
- Added local and live cold screenshots plus Lighthouse evidence.

## Verification

From a separate fresh clone (`/tmp/replay-capsule-polish3-clean-C4pRfX`):

```sh
npm ci
# All 22 exact commands listed in .factory/claims.json
npm run check
npm run lint
```

All 22 claim commands passed. `npm run check` passed typecheck, 31 unit/package tests, production build, and 50 browser tests (four intentional project skips). `npm run lint` passed.

The work-order build command also passed before deployment:

```sh
npm ci && npm test && npm run build:site
```

Live verification after deployment:

- `verify-url.sh` on the root: title, `lang=en`, one h1, main landmark, image alt coverage, labeled controls, and no console errors.
- Axe in a fresh live Chromium context: zero violations on `/`, `/demo`, `/privacy/`, `/terms/`, and HTTP 404.
- Live first-screen facts bottom: 827.263 px at 390 × 844. See [live phone capture](verification-artifacts/polish-3-live/landing-mobile-390x844.png).
- Live demo: `?demo=1` reached canonical `/demo`, used `demo:replay-capsule:memory`, showed the persistent banner/reset/real-mode actions, and replayed the seeded sample. See [live demo capture](verification-artifacts/polish-3-live/demo-mobile-390x844.png).
- Live integrations: record → download → import → replay preserved all four recorded events; the deployed Phaser scene reproduced 20/20 seeded failures; the loaded offline demo replayed its sample.
- Mobile Lighthouse: 99 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.7 s, CLS 0, TBT 0 ms, 134 KiB transfer. See [report](verification-artifacts/polish-3-local/lighthouse-mobile.json).

The complete finding-by-finding trace is in [.factory/polish-3.md](polish-3.md).

## Publish and deploy

The package is ready for the factory release owner to publish; inspect with `npm pack --dry-run`. Deploy `dist/site` as the static root.

## Known gaps

None.
