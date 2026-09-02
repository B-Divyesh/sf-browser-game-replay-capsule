# Replay Capsule polish 6

**Repair commit:** `ba095784621bc7c163eaae49af1076958de6508c`
**Deployment:** Static Web Apps production deployment to `delightful-flower-0195f770f.7.azurestaticapps.net`
**Live URL:** https://browser-game-replay-capsule.sociobot.in
**Clean clone:** `/tmp/replay-polish6-CfoovJ`

Every finding in reviews 1–6 was checked again after deployment. The live audit is
[`verification-artifacts/polish-6-live/live-audit.json`](verification-artifacts/polish-6-live/live-audit.json).
It records the cold phone landing, demo isolation/reset/offline replay, route metadata,
focus, 200% reflow, Axe scans, request allowlist, and Phaser flow.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Every route heading remains focusable and receives focus after navigation and Back. | `moves focus to the destination heading after document navigation`; live audit focus checks. |
| F-1-2 | `/demo` is canonical and `/demo/` normalizes to it. | `the trailing demo URL resolves to the canonical demo URL`; live audit. |
| F-1-3 | The designed 404 has Open Graph and Twitter metadata. | Live audit: 404, one h1/main, seven OG tags, four Twitter tags, zero Axe violations. |
| F-1-4 | Product navigation is same-site only. | `keeps product navigation local and has no unmarked external GitHub links`; live audit found zero external links. |
| F-1-5 | README sentences remain under the 22-word limit. | `.factory/copy-audit.md`; clean-clone `npm run check`. |
| F-1-6 | Documentation names only the available hosted tarball. | `@claim:installable-release`; live tarball byte match. |
| F-2-1 | The phone demo keeps its banner, seed, summary, and replay action above the canvas. | [live demo phone screenshot](verification-artifacts/polish-6-live/demo-mobile-390x844.png); live quick action bottom 548.328 px. |
| F-2-2 | The shipped Phaser scene imports and replays 20 seeded fault capsules. | `@claim:seeded-failure-fixture`; live audit reproduced 20/20. |
| F-2-3 | The record/export/import/replay regression compares the exact event sequence and outcome. | `@claim:record-export-replay`; clean-clone claim sweep. |
| F-2-4 | Real runs remain in memory and do not mutate browser storage. | `@claim:no-browser-persistence`; live audit found empty local/session storage, caches, IndexedDB, cookies, and service workers. |
| F-2-5 | Exported-field inspection covers excluded page, identity, cookie, and request values. | `@claim:capture-surface`; clean-clone claim sweep. |
| F-2-6 | Subjective sharing language remains replaced by the tested 128 KB default cap. | `@claim:default-byte-cap`; `.factory/copy-audit.md`. |
| F-2-7 | Node 20 support remains a listed ESM and CommonJS clean-consumer claim. | `@claim:node-20-runtime`; clean-clone claim sweep. |
| F-2-8 | Desktop first-screen facts remain visible. | `keeps all first-screen facts visible on desktop`; [live desktop smoke screenshot](verification-artifacts/polish-6-live/verify-url/screenshot-desktop.png). |
| F-2-9 | Demo, Privacy, and Terms remain in every header and footer. | Live route audit over `/`, `/demo`, `/privacy/`, `/terms/`, and 404. |
| F-2-10 | The first screen states offline-after-load behavior, MIT pricing, and privacy scope. | [live landing phone screenshot](verification-artifacts/polish-6-live/landing-mobile-390x844.png); `offline-demo`, `mit-license`, and `no-network-calls` claims. |
| F-2-11 | The Phaser README description stays concise. | `.factory/copy-audit.md`; clean-clone `npm run check`. |
| F-2-12 | The capture control says **Start recording**. | `@claim:opt-in-recording`; live demo audit. |
| F-2-13 | The local counter panel says **Capsule details**. | Live `/demo` Axe scan: zero violations. |
| F-2-14 | The flow uses direct person/API wording. | `.factory/copy-audit.md`; `opt-in-recording` and `adapter-callbacks` claims. |
| F-2-15 | Closed-Shadow-DOM text exclusions remain direct and tested. | `@claim:text-entry-excluded`; clean-clone claim sweep. |
| F-3-1 | Phone hero spacing keeps all three facts inside a 390 × 844 first view. | Live audit fact bottom 821.422 px; [live landing screenshot](verification-artifacts/polish-6-live/landing-mobile-390x844.png). |
| F-4-1 | Shared navigation wraps safely at 200% text on every route. | `reduced motion and 200% text keep the interface usable`; live audit reflow checks. |
| F-4-2 | Phaser canvas recording is a separate documented claim. | `@claim:phaser-recording`; live audit records a normalized canvas event. |
| F-4-3 | `shouldCaptureKey` is listed and covered by a controlled regression. | `@claim:key-filter`; clean-clone claim sweep. |
| F-4-4 | Near-cap downloaded JSON remains within its cap and imports unchanged. | `@claim:capped-export-import`; clean-clone claim sweep. |
| F-4-5 | Release copy states only the available hosted artifact. | `@claim:installable-release`; live SHA-256 matched the local tarball. |
| F-5-1 | The privacy fact says **No tracking or API calls** and the request test permits only known static GET paths. | `@claim:no-network-calls`; live audit recorded ten approved same-origin static requests. |
| F-6-1 | README now says pointer input precedes bubble-phase game handlers and states the capture-phase registration-order limit. Added `pointer-capture-order`. | Clean-clone `@claim:pointer-capture-order`; [live pointer-order screenshot](verification-artifacts/polish-6-live/live-pointer-capture-order.png); live check retained pointer id 13 after a bubble handler stopped recording. |

## Verification

- From the clean clone, all **26/26** exact commands in `.factory/claims.json` passed.
- From that clone, `npm run check` passed: typecheck, 32 unit/package tests, production build, and 55 browser tests with five intentional project skips. `npm run lint` and `npm pack --dry-run` passed.
- Production `verify-url.sh` passed with no console errors. Axe had zero violations on `/`, `/demo`, `/privacy/`, `/terms/`, and the designed 404.
- The live mobile Lighthouse report scored Performance 100, Accessibility 100, Best Practices 100, and SEO 100. LCP was 1.363 s, TBT 9 ms, CLS 0.00019, and transfer was 99,564 bytes. Evidence: [`lighthouse-mobile.json`](verification-artifacts/polish-6-live/lighthouse-mobile.json).
- The served `0.1.8` tarball SHA-256 is `3100d0dedb86a922774a1528063fbe771cdd62d46692d2f52655baae6c263e59`, matching `site/public/releases/sociobot-replay-capsule-0.1.8.tgz`.

No review finding remains unresolved.
