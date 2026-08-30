# Independent verification 9 — PASS

**Candidate:** `a3ffc32094e766fc86fee54eb9f55880b94210fa`  
**Live URL:** https://browser-game-replay-capsule.sociobot.in  
**Verified:** 2026-08-30 UTC  
**Scope:** clean-checkout claims gate, npm library/release artifact, exact production build, and independent live QA. No product code was changed.

## Verdict

**PASS.** Replay Capsule meets the researched job: a solo browser-game developer can opt in to capture input timing, a seed, and checkpoints; export a bounded JSON replay; import it; and replay it locally. The fresh deployment evidence disproves the earlier deployment-only concern: the deployed root, primary JS/CSS, route module, hero image, and versioned tarball are byte-identical to this candidate's production build.

**Defects by severity:** none found (P0–P3).

## Mandatory opening gates

`.factory/claims.json` exists and contains 19 required claims. From the clean candidate checkout, `npm ci` completed with 217 packages and zero audit vulnerabilities. I then ran every `test` value in that file individually, before broader inspection. All passed:

| Claims | Result |
| --- | --- |
| `sample-demo`, `no-network-calls`, `opt-in-recording`, `text-entry-excluded` | PASS |
| `record-export-replay`, `pointer-normalization`, `offline-demo` | PASS |
| `checkpoint-capture`, `default-byte-cap`, `custom-cap-range`, `validated-import` | PASS |
| `gamepad-sampling`, `adapter-callbacks`, `replay-controls`, `seeded-failure-fixture` | PASS |
| `package-formats`, `installable-release`, `zero-runtime-dependencies`, `mit-license` | PASS |

Cold first-read of the live home page passed the plain-words and demo gates. It says **“Replay browser-game bugs from a small file.”**, identifies **“solo 2D game developers”**, and presents the one-click **“Try it with sample data”** action with **“Loads a seeded bug run you can replay.”** The action opens `/demo`; its persistent banner says **“Demo — sample data, nothing is saved.”**

## Local quality gates

| Command | Result |
| --- | --- |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm test` | PASS — 30/30 Vitest tests |
| `npm run build` | PASS — ESM, CommonJS, declarations, hosted tarball, and `dist/site` |
| `npm run test:e2e` | PASS — 37 passed, 1 expected skip |
| `npm pack --dry-run` | PASS — 7 files; 11.1 kB tarball; zero runtime dependencies |

The production build contains 18,851 bytes raw / 7.11 kB gzip main JavaScript and 16,693 bytes raw / 4.25 kB gzip main CSS, inside the static budgets. A mobile Lighthouse run against live production measured **99 performance** and **100 accessibility** (LCP 1.4 s, CLS 0, total transfer 96 KiB). Lighthouse reported a post-audit browser-tab crash while collecting its full-page screenshot/BFCache artifact; the completed category scores and core metrics above were present in its saved JSON report, so this is recorded as harness noise, not a product failure.

## Independent end-to-end and package exercise

- On live `/demo`, keyboard-only **Arm & start** → ArrowUp/ArrowRight → **Stop recording** → **Download capsule** produced valid version-1 replay JSON. Keyboard activation also operated Replay.
- Invalid JSON import showed: “Capsule is not valid JSON. Choose a Replay Capsule JSON file under 1 MB.” Importing the just-downloaded valid file immediately afterwards recovered to “Imported 2 events. Seed and checkpoints validated locally.”
- Claim coverage additionally exercised the 128 KB default cap; 4 KB–1 MB custom caps; malformed, unsupported, and oversize imports; gamepad sampling; checkpoint/event callback ordering; player pause/resume/stop/speed; text-field exclusion including Shadow DOM; pointer normalization; and 20/20 deterministic Phaser fixture failures.
- A new temporary npm consumer installed the hosted `sociobot-replay-capsule-0.1.6.tgz`; both ESM `import` and CommonJS `require` created, exported, and validated a capsule using explicit `EventTarget`s. `npm ls --omit=dev --all` showed only `@sociobot/replay-capsule@0.1.6`.

## Live, privacy, deployment, and accessibility evidence

- SHA-256 matched local `dist/site` for `index.html`, `assets/main-C31palb8.js`, `assets/main-BmCgS-59.css`, `assets/route-focus-BzYwfy7g.js`, `assets/replay-instrument-600-kwAaNgdf.webp`, and `releases/sociobot-replay-capsule-0.1.6.tgz`.
- A fresh normal demo flow requested only same-origin static files. It made no API, analytics, beacon, or third-party requests; localStorage, sessionStorage, and cookies stayed empty; there were no console or page errors.
- Live headers provide self-only CSP including `frame-ancestors 'none'`, HSTS, nosniff, DENY framing, strict referrer policy, and denied camera/microphone/geolocation. HTML uses 30-second revalidation; hashed assets and the release tarball use one-year immutable caching.
- At 390 px, document width equals viewport width (390 px); the primary sample action is a 350 × 51 px link and opens `/demo`. All visible interactive controls meet the 44 px height target. Desktop Tab first reaches the skip link with an amber `3px` visible focus ring. With `prefers-reduced-motion: reduce`, no active animations were reported.
- Playwright axe WCAG A/AA scans found zero serious or critical issues on `/` (200), `/demo` (200), `/privacy` (200), `/terms` (200), and `/not-a-real-route` (designed 404 response).

This is a static library/demo with no product server endpoints or sign-in. Rate-limit/429 and Entra-tenant checks are not applicable. It is not a PWA, so service-worker update behavior is not applicable; the separately declared offline demo claim passed in its own browser context.

## Reproduce

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
npm pack --dry-run
```

Run every command listed in `.factory/claims.json` individually before release. Detailed command outputs and screenshots from this run are available locally in `.factory/verification-artifacts/` (logs are ignored by Git).
