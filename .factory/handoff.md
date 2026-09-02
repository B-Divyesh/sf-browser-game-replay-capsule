# Replay Capsule repair 9 handoff — PASS

**Base verifier report:** `9c29bff4a47a4c2d07fb4271d95bcd043bc2c570`

**Rejected candidate:** `3f4f3a0f3d6eb1da9f2c45c031c887deb40a688e`

**Repair commit:** `d4401ff92c866ec30fa401267a9dbf3dde854407`

**Release:** `@sociobot/replay-capsule@0.1.8`

**Target:** https://browser-game-replay-capsule.sociobot.in

**Deployment:** production Static Web App updated successfully on 2026-09-02 UTC

## Findings repaired

### F-14-1 — deterministic mobile record, export, import, and replay

- The exact clean command initially passed both projects, and an unchanged 30-repeat stress run passed 60/60. This matched the verifier's intermittent evidence rather than yielding a repeatable local failure.
- Extending the claim through a real game end exposed a concrete ordering defect: a host game could stop recording on a terminal pointer input before the recorder stored that input.
- Pointer listeners now capture before host game handlers, so the failure-causing input is present before the game ends the recording.
- `@claim:record-export-replay` now starts from fresh `/demo`, acknowledges every keyboard transition, enters a seeded fault with a real pointer action, saves the download to the test artifact directory, imports it, compares the exact replayed sequence, and asserts the same visible end state.
- The test proves six exported events, the `fault-contact` checkpoint, and `recorded-outcome-reproduced` after import and replay in desktop and 390 px projects.
- Failed browser runs retain a trace, screenshot, video, DOM/game-state JSON, and the exported capsule when one exists.

### F-14-2 — mobile LCP under 2.5 seconds

- The headline, which Lighthouse identifies as the LCP element, no longer waits behind the 240 ms entrance animation.
- The supporting instrument illustration keeps the product's documented motion treatment.
- The browser regression asserts both immediate headline paint policy and an observed LCP below 2,500 ms.
- Lighthouse 13.4.1 mobile: **99 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1,668 ms, FCP 1,668 ms, TBT 0 ms, CLS 0.0002, transfer 139,061 bytes**.
- Live Lighthouse 13.4.1 mobile: **100/100/100/100; LCP 1,202 ms, FCP 1,202 ms, TBT 0 ms, CLS 0.0008, transfer 99,609 bytes**.

## Clean verification

| Gate | Result |
| --- | --- |
| `npm ci` | PASS — 217 packages, 0 vulnerabilities |
| Every command in `.factory/claims.json` | PASS on the first clean sweep — 25/25 logs present |
| `npm run check` | PASS — typecheck, 32/32 Vitest, production build, 58 Playwright tests (53 passed, 5 intentional project skips) |
| Focused final blocker checks | PASS — desktop/mobile replay claim plus mobile LCP regression (3 passed, 1 intentional desktop skip) |
| `npm pack --dry-run` | PASS — 7 files, 11.9 kB packed, 53.6 kB unpacked |
| Package consumers | PASS — clean ESM, CommonJS, declarations, and pinned Node 20 consumers |
| Production build | PASS — `dist/`, `dist/site/index.html`, and hosted `0.1.8` tarball produced |
| Local `verify-url.sh` | PASS — title, `lang=en`, one h1/main, alt text, labels, and zero console errors |
| Live deployment and identity | PASS — HTTPS 200, source/live HTML and tarball SHA-256 matches, ESM/CommonJS URL install works |

The landing loads 8,564 bytes gzip of JavaScript and 4,429 bytes gzip of CSS. The hosted tarball is 11,860 bytes and has SHA-256 `6384908aa2c5075865065bf75a5458ddeeb795e15778efc9213a629721da36b8`.

## Browser, accessibility, privacy, and offline evidence

- Desktop 1366×900 and mobile 390×844 both completed the full game path: record keyboard and pointer input, reach the visible **Fault reproduced** end screen, download, import, and reach **Replay matched the end state**.
- Both runs exported and replayed six events, ended at `fault-contact`, produced no console/page errors, and made only same-origin static GET requests.
- Local/session storage, IndexedDB, Cache Storage, cookies, and service-worker registrations remained empty.
- Axe has zero violations on `/`, `/demo`, `/privacy/`, `/terms/`, and `/404.html` in the shipped browser suite. Keyboard focus, import focus mirroring, 44 px targets, 200% text, reduced motion, and mobile overflow checks pass.
- The isolated-context offline claim records, imports, and replays after the first page load. Response-policy tests cover the self-only CSP, immutable hashed assets, frame blocking, permissions policy, and real 404 rewrite.

## Evidence

- Clean claim and gate logs: `.factory/qa-evidence/repair-9-clean/`
- Lighthouse report: `.factory/qa-evidence/repair-9-local/lighthouse-mobile.json`
- URL smoke report and desktop/mobile screenshots: `.factory/qa-evidence/repair-9-local/verify-url/`
- Full desktop/mobile game summaries and capsules: `.factory/qa-evidence/repair-9-local/browser-game-flow.json`
- End-state screenshots: `.factory/qa-evidence/repair-9-local/{desktop,mobile}-{game,replay}-end.png`
- Live headers, hashes, Lighthouse, Axe, offline game flow, install log, and screenshots: `.factory/qa-evidence/repair-9-live/`

## Run and deploy

```sh
npm ci
npm run check
npm pack --dry-run
/opt/fleet/lib/deploy-static.sh browser-game-replay-capsule dist/site
```

## Known gaps

None. Registry publication remains owned by the factory; this repository ships the installable versioned tarball and was not published from the worker.
