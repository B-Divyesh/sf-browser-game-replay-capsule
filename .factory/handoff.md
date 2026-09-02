# Replay Capsule polish 6 handoff

**Repair commit:** `ba095784621bc7c163eaae49af1076958de6508c`
**Live URL:** https://browser-game-replay-capsule.sociobot.in
**Deployment target:** `sf-browser-game-replay-capsule` production Static Web App

## Delivered

- Repaired F-6-1. The README now promises only capture before bubble-phase game handlers. It also explains that capture-phase handlers follow browser registration order.
- Added the `pointer-capture-order` claim and a browser regression. A bubble-phase handler stops the recorder, and the exported capsule still contains the pointer event.
- Updated the versioned hosted `0.1.8` tarball, catalog sentence, claim inventory, and copy audit.
- Deployed `dist/site` to production. The live tarball byte-matches the verified local tarball and includes the corrected README wording.

## How to verify

```sh
npm ci
npm run check
npm run lint
npm pack --dry-run
```

Run every exact command listed in `.factory/claims.json`. The one-click isolated sample is available at `/demo` or `/?demo=1`.

## Evidence

- Clean clone `/tmp/replay-polish6-CfoovJ`: all 26/26 claim commands passed. `npm run check` passed with 32 unit/package tests and 55 browser tests; five project-specific skips were intentional. Lint and package dry run passed.
- Live `verify-url.sh` passed: HTTP 200, correct title/lang/main/h1, image alternatives, and no console errors. The full route audit found zero Axe violations, correct metadata/focus/404 behavior, no overflow at 200% text, ten approved same-origin static requests, isolated demo storage, offline replay, and Phaser 20/20 reproduction.
- Live pointer-order test: a bubble handler stopped the recorder, while the downloaded capsule retained pointer id 13 at x=0.2/y=0.8. Screenshot: [`live-pointer-capture-order.png`](verification-artifacts/polish-6-live/live-pointer-capture-order.png).
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.363 s, TBT 9 ms, CLS 0.00019, transfer 99,564 bytes. Report: [`lighthouse-mobile.json`](verification-artifacts/polish-6-live/lighthouse-mobile.json).
- Full finding map: [polish-6.md](polish-6.md).

## Known gaps and next steps

No known product, accessibility, privacy, routing, packaging, or deployment gaps remain. The factory may publish the already-packed artifact with `npm publish` when registry credentials are available; this worker did not publish it.
