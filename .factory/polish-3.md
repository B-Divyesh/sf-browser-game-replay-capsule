# Polish 3 — zero-finding closure

Reviewed base: `111b45dfd0e992fe88f56fa42eace11e3ada3a54`  
Repair code: `a473738af5f319537ff9a6c8739caab0d83a2ff2`  
Evidence commit: `331977f594f1fbed301df3c39bb8910efc3612eb`

The cold phone view is the only product-code change in this round. The earlier repairs were rechecked instead of assumed. The live deployment is `https://browser-game-replay-capsule.sociobot.in` (Static Web Apps deployment `ffda1d32-de66-4d50-a17e-54a62c829cfc`).

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Each route h1 remains focusable with `tabindex="-1"`; `route-focus.ts` moves focus after in-site navigation and history traversal. | `moves focus to the destination heading after document navigation`; live cold audit: Home → Demo and Back both focused the destination h1. |
| F-1-2 | `/demo` remains the only canonical demo URL; the static trailing route normalizes to `/demo`. | `the trailing demo URL resolves to the canonical demo URL`; live `https://browser-game-replay-capsule.sociobot.in/demo/` ended at `/demo`. |
| F-1-3 | The designed 404 retains route-specific Open Graph and Twitter metadata. | `legal pages are reachable`; live `/not-a-real-route` returned HTTP 404 with one h1, 7 `og:*` and 4 Twitter tags, and zero Axe violations. |
| F-1-4 | Product pages contain no external links, so no unmarked external navigation remains. | Live audit counted zero `a[href^="http"]` links. |
| F-1-5 | The flagged README sentences remain split into direct sentences under the hard cap. | `.factory/copy-audit.md`; fresh-clone `npm run check` passed. |
| F-1-6 | README names the tested hosted tarball and makes no public-registry availability promise. | Fresh-clone `@claim:installable-release`; README and claim inventory rechecked. |
| F-2-1 | `/demo` keeps the seeded ID, event/checkpoint summary, and replay action above the canvas on a phone. | `shows seeded product controls in the first mobile demo viewport`; [live phone demo](verification-artifacts/polish-3-live/demo-mobile-390x844.png); live controls ended at y=548.33 px. |
| F-2-2 | The browser fixture continues to boot the shipped Phaser scene and replay 20 imported capsules. | Fresh-clone `@claim:seeded-failure-fixture`; live fixture reported “Phaser scene ready.” with one canvas and reproduced 20/20 faults. |
| F-2-3 | The replay flow exposes applied events and outcome so the downloaded sequence can be compared exactly. | Fresh-clone `@claim:record-export-replay`; live record → download → import → replay exported 4 events, matched all events exactly, and reported `recorded-sequence-applied`. |
| F-2-4 | The `no-browser-persistence` claim and sentinel regression remain in the inventory. | Fresh-clone `@claim:no-browser-persistence`; live `?demo=1` used `demo:replay-capsule:memory` with the persistent banner and reset/exit controls. |
| F-2-5 | The `capture-surface` claim verifies documented capsule fields and excludes page, identity, cookie, and request values. | Fresh-clone `@claim:capture-surface`; fresh-clone claim suite passed all 22 exact commands. |
| F-2-6 | The subjective sharing statement remains replaced with the tested 128 KB cap. | `.factory/copy-audit.md`; fresh-clone `@claim:default-byte-cap`. |
| F-2-7 | The pinned Node 20 clean-consumer regression remains part of the claim inventory. | Fresh-clone `@claim:node-20-runtime` passed for ESM and CommonJS. |
| F-2-8 | Desktop facts remain inside the first viewport. | `keeps all first-screen facts visible on desktop`; [local desktop capture](verification-artifacts/polish-3-local/landing-desktop-1440x900.png). |
| F-2-9 | Every route retains the same Demo, Privacy, and Terms navigation in its header and footer. | `keeps the same header and legal navigation on every route`; live audit confirmed the three links on `/`, `/demo`, `/privacy/`, `/terms/`, and 404. |
| F-2-10 | The first-screen facts explicitly state offline behavior, MIT price, and no tracking/server calls. | `.factory/copy-audit.md`; fresh-clone `@claim:offline-demo`, `@claim:mit-license`, and `@claim:no-network-calls`; [live phone landing](verification-artifacts/polish-3-live/landing-mobile-390x844.png). |
| F-2-11 | The Phaser README description remains two concise sentences. | `.factory/copy-audit.md`; fresh-clone `npm run check`. |
| F-2-12 | The recording control remains “Start recording.” | Fresh-clone `@claim:opt-in-recording`; live demo screenshot shows the capture controls. |
| F-2-13 | The local counter panel remains “Capsule details,” avoiding the privacy-term conflict. | Browser route/accessibility suite; live `/demo` audit passed Axe with zero violations. |
| F-2-14 | The page uses “A person starts recording”; README directly separates scheduling from game behavior. | `.factory/copy-audit.md`; fresh-clone `npm run check`. |
| F-2-15 | README describes the closed-Shadow-DOM behavior directly. | `.factory/copy-audit.md`; fresh-clone `@claim:text-entry-excluded`. |
| F-3-1 | Reduced only mobile hero top padding and the mobile pre-fact gap. Added a loaded-font, exact `390 × 844` regression for all three required facts. | `keeps all first-screen facts visible at the exact 390 by 844 phone edge`; local and live loaded-font bottom: **827.263 px ≤ 844 px**; [live phone landing](verification-artifacts/polish-3-live/landing-mobile-390x844.png). |

## Final verification

- A separate fresh clone at `/tmp/replay-capsule-polish3-clean-C4pRfX` ran `npm ci`, each of the 22 exact commands in `.factory/claims.json`, `npm run check`, and `npm run lint`. All claim commands passed. The full check passed 31 unit/package tests and 50 browser tests, with four intentional project skips.
- Local evidence: [phone first view](verification-artifacts/polish-3-local/landing-mobile-390x844.png), [desktop first view](verification-artifacts/polish-3-local/landing-desktop-1440x900.png), and [basic URL audit](verification-artifacts/polish-3-local/verify-url/verify.json).
- Local mobile Lighthouse: 99 performance, 100 accessibility, 100 best practices, and 100 SEO; LCP 1.7 s, CLS 0, TBT 0 ms, 134 KiB transfer ([report](verification-artifacts/polish-3-local/lighthouse-mobile.json)).
- The live root passed `verify-url.sh` with no console errors, a title, `lang=en`, one h1, one main landmark, and complete image alt text. The live cold audit found zero Axe violations on `/`, `/demo`, `/privacy/`, `/terms/`, and the HTTP-404 route.

No review finding remains unresolved.
