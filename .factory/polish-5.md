# Replay Capsule polish 5

**Repair commit:** `3f4f3a0f3d6eb1da9f2c45c031c887deb40a688e`  
**Deployment:** `4b0df294-6c2c-4fbe-a89b-e2dd0f0a37ed`  
**Live URL:** https://browser-game-replay-capsule.sociobot.in

All current and earlier review findings were rechecked after the deployment. Test evidence is from clean clone `/tmp/replay-polish5-NQnBs1`; live evidence is in `verification-artifacts/polish-5-live/`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Route h1 elements remain focusable; document navigation and Back move focus to the destination h1. | `moves focus to the destination heading after document navigation`; live audit focus assertions. |
| F-1-2 | `/demo` remains canonical; `/demo/` normalizes to `/demo`; links, metadata, and sitemap use `/demo`. | `the trailing demo URL resolves to the canonical demo URL`; live audit canonical-route assertion. |
| F-1-3 | The HTTP 404 retains complete Open Graph and Twitter metadata. | Live audit: 404 status, one h1/main, seven OG and four Twitter tags; zero Axe violations. |
| F-1-4 | Product navigation remains same-site only, so no unmarked external link remains. | `keeps product navigation local and has no unmarked external GitHub links`; live audit found zero external links. |
| F-1-5 | README replacements remain under the 22-word cap. | `.factory/copy-audit.md`; clean-clone `npm run check`. |
| F-1-6 | Documentation names only the tested hosted tarball and makes no public-registry availability promise. | `@claim:installable-release`; clean-clone claim run. |
| F-2-1 | `/demo` keeps seed, event/checkpoint summary, replay control, and banner in the first phone view. | `shows seeded product controls in the first mobile demo viewport`; [live phone demo](verification-artifacts/polish-5-live/demo-mobile-390x844.png), bottom 548.328 px. |
| F-2-2 | The real Phaser scene imports and replays 20 seeded capsule failures. | `@claim:seeded-failure-fixture`; live audit reports 20/20 reproduced. |
| F-2-3 | The replay claim compares the downloaded event sequence with applied events and checks the recorded outcome. | `@claim:record-export-replay`; clean-clone claim run. |
| F-2-4 | Real-mode no-persistence remains listed and tested with browser storage/cookie sentinels. | `@claim:no-browser-persistence`; live demo storage audit. |
| F-2-5 | The exported capsule surface is explicitly inspected for excluded page, identity, cookie, and request values. | `@claim:capture-surface`; clean-clone claim run. |
| F-2-6 | Subjective sharing copy remains replaced by the exact 128 KB default cap. | `@claim:default-byte-cap`; `.factory/copy-audit.md`. |
| F-2-7 | Node 20 support remains a listed clean-consumer claim for ESM and CommonJS. | `@claim:node-20-runtime`; clean-clone claim run. |
| F-2-8 | Hero sizing keeps every desktop first-screen fact visible. | `keeps all first-screen facts visible on desktop`; clean-clone browser suite. |
| F-2-9 | Demo, Privacy, and Terms remain in every header and footer. | `keeps the same header and legal navigation on every route`; live audit. |
| F-2-10 | The three landing facts state offline-after-load behavior, MIT price, and privacy. | `@claim:offline-demo`, `@claim:mit-license`, `@claim:no-network-calls`; [live landing](verification-artifacts/polish-5-live/landing-mobile-390x844.png). |
| F-2-11 | Phaser README prose remains split into concise sentences. | `.factory/copy-audit.md`; clean-clone `npm run check`. |
| F-2-12 | The capture action remains **Start recording**. | `@claim:opt-in-recording`; live demo screenshot. |
| F-2-13 | The local counter panel remains **Capsule details**. | `sample demo has no axe violations`; live demo Axe result. |
| F-2-14 | Person/API wording remains direct and unambiguous. | `.factory/copy-audit.md`; `@claim:opt-in-recording` and `@claim:adapter-callbacks`. |
| F-2-15 | Closed-Shadow-DOM text exclusions remain described in plain language and tested. | `@claim:text-entry-excluded`; clean-clone claim run. |
| F-3-1 | Mobile hero spacing keeps all three facts in a 390 × 844 first screen. | `keeps all first-screen facts visible at the exact 390 by 844 phone edge`; live facts bottom 821.422 px. |
| F-4-1 | Shared navigation wraps safely at 200% text. | `reduced motion and 200% text keep the interface usable`; live audit measured 390 px scroll/client widths on every route. |
| F-4-2 | Phaser canvas recording is a separately listed behavior and claim. | `@claim:phaser-recording`; live audit captured normalized pointer input with seed `polish-5-live`. |
| F-4-3 | The documented `shouldCaptureKey` behavior is listed and has a controlled regression. | `@claim:key-filter`; clean-clone claim run. |
| F-4-4 | Near-cap download/importability is listed and tested against the downloaded JSON bytes. | `@claim:capped-export-import`; clean-clone claim run. |
| F-4-5 | Release wording states only the available hosted 0.1.7 tarball. | `@claim:installable-release`; `.factory/copy-audit.md`. |
| F-5-1 | Rewrote the hero fact to **“No tracking or API calls.”** The README and privacy page use the same scope. The listed request regression now permits only known same-origin static GETs and fails on API, analytics, tracking, telemetry, non-static, query-data, non-GET, or third-party requests. | `@claim:no-network-calls` from clean clone; [live request log](verification-artifacts/polish-5-live/live-audit.json) records only 10 approved static requests. |

## Verification

- Clean clone: `npm ci`, all 25 exact commands from `.factory/claims.json`, `npm run check`, `npm run lint`, and `npm pack --dry-run` passed.
- Live: `verify-url.sh` passed with no console errors. The live audit checked cold landing copy, demo isolation/reset/offline replay, routing/focus, titles/metadata/404, 200% reflow, all route Axe scans, full Phaser flow, and the request allowlist.
- Mobile Lighthouse: performance 100 and accessibility 100; LCP 1.4 s and CLS 0. Evidence: `verification-artifacts/polish-5-live/lighthouse-mobile.json`.

No finding remains unresolved.
