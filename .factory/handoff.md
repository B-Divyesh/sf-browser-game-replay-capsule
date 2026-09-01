# Replay Capsule product QA handoff — FAIL

## Result

Review 4 checked commit `3852de27a6b106bcb128c12b158a20c904daa01b` against https://browser-game-replay-capsule.sociobot.in on 2026-09-01 UTC. No product code was changed.

The cold first read, one-click sample, demo isolation, offline behavior, listed claims, routes, metadata, normal-size accessibility, and earlier fixes pass. The verdict remains **FAIL** because the loaded-font 200% text view expands to 521 px in a 390 px viewport and clips header navigation. Three README capabilities and one registry-status clause also lack claim entries.

Full details and exact fixes are in [review-4.md](review-4.md).

## How to verify

From a clean clone:

```sh
npm ci
# Run every exact command in .factory/claims.json
npm run check
npm run lint
npm pack --dry-run
```

All 22 claim commands passed individually. Unit/package checks passed 31/31, build and lint passed, and the package dry run produced an 11.5 KB tarball. The full browser phase reported 49 passes, four expected skips, and one failure in the 200% text check.

For F-4-1, open `/` at 390 × 844, await `document.fonts.ready`, set the root text size to 200%, and compare `document.documentElement.scrollWidth` with `clientWidth`. The current result is 521 versus 390. The live header navigation reaches x=520.61 px.

Live checks also confirmed that all observed requests are same-origin; local/session storage, cookies, IndexedDB, Cache Storage, and service workers remain empty; and replay plus recording work after the browser context goes offline following initial load.

## Remaining work

- F-4-1: make the shared header reflow at 200% text and make its regression wait for loaded fonts.
- F-4-2: list and test Phaser canvas recording, or narrow the README sentence.
- F-4-3: list and test `shouldCaptureKey`.
- F-4-4: list and tag the near-cap download/import behavior.
- F-4-5: replace undefined registry-status wording with current install/build facts.
