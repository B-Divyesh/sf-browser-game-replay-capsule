# Replay Capsule polish 2 handoff

## Delivered

Repair commit: `3847829c9346243d8b5ba0df2d185db7c10ee936` (`fix: close replay capsule polish findings`), pushed to `origin/main`.

All 15 review-2 findings are repaired. The product keeps its mid-century instrument-panel identity while the direct demo becomes a compact, seeded application view. `/demo` and `?demo=1` show the isolated sample banner, seed `RC-SAMPLE-FAULT-17`, one event, a `fault-contact` checkpoint, and an immediate replay action on a 390×844 phone.

The repair adds two privacy claims (real-mode browser persistence and capture surface), a pinned Node 20 package-runtime claim, exact replay-sequence/outcome proof, and a browser-running Phaser scene claim that imports 20 capsules and reproduces 20 failures. Navigation, legal links, titles, route focus, 404, copy, metadata, and first-screen facts were also rechecked. Details are mapped in `.factory/polish-2.md`.

## Run and verify

```sh
npm ci
npm run check
```

`npm run check` runs typecheck, the 31-unit/package-test suite, production build, and 50 Playwright desktop/mobile tests. Every exact command in `.factory/claims.json` was also run from fresh clone `/tmp/replay-capsule-clean-zJPqAJ` after `npm ci`; all passed. The clean clone then passed `npm run check`.

Build output is `dist/` and the documentation site is `dist/site/`. Use `npm pack --dry-run` to inspect the publishable package; do not publish from this worker.

## Evidence

- Local `npm run check`: pass.
- Fresh clone `npm run check`: pass (31 unit/package tests; 50 browser tests).
- All claim commands: pass, including `@claim:seeded-failure-fixture`, `@claim:record-export-replay`, `@claim:no-browser-persistence`, `@claim:capture-surface`, and `@claim:node-20-runtime`.
- Axe browser scans on landing, demo, legal pages, and 404: zero violations. Browser regressions check title, `lang`, one h1, main, alt text, focus, mobile targets, routing, and console errors.
- [Local desktop demo evidence](verification-artifacts/polish-2-local/demo-desktop.png) and [390×844 demo evidence](verification-artifacts/polish-2-local/demo-mobile.png).

## Deployment status

The static deployment source was pushed to `origin/main`. At 2026-08-30 08:08 UTC, the public hostname still served the preceding `polish-1` build (`ETag "65239227"`), so it has not yet been possible to truthfully record a successful cold live recheck. The deployment configuration is not present in this repository and no scoped Static Web App deployment command completed from the worker. Once the factory static deploy has picked up `3847829`, open `https://browser-game-replay-capsule.sociobot.in/demo` cold at 390×844 and 1440×900, then run the same live Axe/basic checks before declaring the release live.

## Known gaps

No code or test gaps remain. The only outstanding external state is the static host serving the pushed commit; the prior live build is still cached/deployed as noted above.
