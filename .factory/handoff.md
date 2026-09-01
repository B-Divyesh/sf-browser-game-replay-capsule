# Replay Capsule polish 5 handoff — PASS

## Result

Commit `3f4f3a0f3d6eb1da9f2c45c031c887deb40a688e` repairs the final blocking finding from review 5 and is pushed to `main`. Deployment `4b0df294-6c2c-4fbe-a89b-e2dd0f0a37ed` is live at https://browser-game-replay-capsule.sociobot.in.

The former overbroad first-screen privacy fact now says **“No tracking or API calls.”** The matching claim test logs the full `/demo` replay flow. It permits only known same-origin static GET document/script/stylesheet/font/image paths. It rejects API, analytics, tracking, telemetry, non-static, query-data, non-GET, and third-party requests.

## What changed

- Updated the privacy fact, README, privacy policy, claim inventory, and copy audit to the exact tested scope.
- Strengthened `@claim:no-network-calls`; it is now an observable request allowlist regression, not an origin-only assertion.
- Updated the verb-first catalog line: “Replay browser-game bugs from a small local file.”
- Added `scripts/audit-live.mjs` for repeatable live route, accessibility, demo, Phaser, reflow, and request-log checks.
- Recorded the complete finding-by-finding repair in `.factory/polish-5.md`.

## Verification

From clean clone `/tmp/replay-polish5-NQnBs1` at `3f4f3a0`:

- `npm ci` passed.
- All 25 exact commands listed in `.factory/claims.json` passed.
- `npm run check` passed: typecheck, 32 unit/package tests, production build/site verification, and full Playwright browser suite.
- `npm run lint` and `npm pack --dry-run` passed.

After deployment:

- `/opt/fleet/lib/verify-url.sh https://browser-game-replay-capsule.sociobot.in .factory/verification-artifacts/polish-5-live/verify-url` passed: HTTPS 200, title, `lang=en`, one h1, main landmark, image alt text, and no console errors.
- `node scripts/audit-live.mjs https://browser-game-replay-capsule.sociobot.in .factory/verification-artifacts/polish-5-live` passed. It confirms cold mobile first-screen bounds (facts bottom 821.422/844 px), `/demo` isolation/reset/offline replay, route focus, canonical `/demo`, titles/metadata/404, 200% text reflow, zero Axe violations on five routes, normalized Phaser recording, and 20/20 seeded Phaser failures.
- The live request log records ten approved same-origin static GETs only; see `.factory/verification-artifacts/polish-5-live/live-audit.json`.
- Mobile Lighthouse: performance 100, accessibility 100, LCP 1.4 s, CLS 0; see `.factory/verification-artifacts/polish-5-live/lighthouse-mobile.json`.

## Run and publish

```sh
npm ci
npm run check
npm run lint
npm pack --dry-run
```

Deploy `dist/site` as the static root. The package is ready for factory-owned registry publication; do not publish from this worker.

## Known gaps

None. All review findings through review 5 are resolved and rechecked live.
