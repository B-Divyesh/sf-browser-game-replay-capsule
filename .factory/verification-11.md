# Independent verification 11 — PASS

**Candidate:** `a1cf0e452ea2316abdc595862b550175e441ea5f`  
**Live URL:** https://browser-game-replay-capsule.sociobot.in  
**Verified:** 2026-09-01 UTC  
**Scope:** clean installation, every claims-manifest command, production build, clean package consumer, and independent live product QA. No product code was changed.

## Verdict

**PASS.** The candidate satisfies the researched library job: a game developer can explicitly record normalized input plus a seed and checkpoints, download a bounded JSON capsule, import it, and replay the same sequence. The hosted application matches the candidate and the prior release blockers are resolved.

## Mandatory opening gates

The cold desktop page passes the first-read check. It says **“Replay browser-game bugs from a small file.”**, identifies **solo 2D game developers**, and places **“Try it with sample data”** beside **“Loads a seeded bug run you can replay.”** One click opens `/demo`, showing **“Demo — sample data, nothing is saved.”**, a seeded capsule, Reset demo, and Start for real.

The cold load returned 200, made 11 requests exclusively to the product origin, and had no console or page errors. Screenshot and request/header record: `verification-artifacts/live-11-cold-desktop.png` and `verification-artifacts/live-11-cold.json`.

## Claims gate

`.factory/claims.json` is present and contains 22 claims. After `npm ci` (217 packages; 0 audit vulnerabilities), each listed command was run exactly as written from the clean workspace. All passed; individual command output is retained in `verification-artifacts/claims-11/`.

| Claim IDs | Result |
| --- | --- |
| sample-demo, no-network-calls, opt-in-recording, text-entry-excluded, record-export-replay, no-browser-persistence, capture-surface | PASS — 2 Playwright projects each |
| checkpoint-capture, default-byte-cap, custom-cap-range, validated-import, gamepad-sampling, adapter-callbacks, replay-controls | PASS — targeted Vitest checks |
| pointer-normalization, offline-demo | PASS — 2 Playwright projects each |
| seeded-failure-fixture | PASS — exact command ran 2 Playwright tests, not zero tests |
| package-formats, installable-release, zero-runtime-dependencies, mit-license, node-20-runtime | PASS — targeted Vitest checks |

## Local quality and package checks

| Check | Result |
| --- | --- |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm test` | PASS — 31 tests |
| `npm run build` | PASS — library formats, declarations, hosted release, and `dist/site/` |
| `npm run test:e2e` | PASS — 49 passed, 3 documented project skips |
| `npm pack --dry-run` | PASS — 7 files, 11.5 kB tarball |

A fresh temporary npm consumer installed the live `0.1.7` tarball. Both ESM and CommonJS created and validated capsules using explicit `EventTarget` options; `npm ls --omit=dev --all` contained only `@sociobot/replay-capsule@0.1.7`.

## Independent live product checks

- Normal flow: PASS. The demo recorded ArrowRight and ArrowUp as exactly four key down/up events, downloaded JSON, imported it, and reported **“Replay complete: the same 4 recorded events were applied.”**
- Invalid input and recovery: PASS. Malformed JSON reported **“Capsule is not valid JSON. Choose a Replay Capsule JSON file under 1 MB.”** The valid downloaded file then imported and replayed.
- Keyboard-only operation: PASS. Enter started/stopped recording and Tab moved to Stop; the exported capsule contained only the four Arrow key events, with no Enter or Tab events.
- Privacy/persistence: PASS for the exercised flow. 21 recorded requests were all same-origin; local and session storage, cookies, IndexedDB, Cache Storage, and service-worker registrations were empty. Demo namespace was `demo:replay-capsule:memory`.
- Offline-after-load: PASS. In a fresh loaded `/demo` context taken offline, a one-event file imported and replayed successfully. This product is not a PWA and makes no offline-reload claim.
- Phaser success measure: PASS. `/phaser-fixture.html` reached **“Phaser scene ready.”** with no console/page errors. Its scoped response policy permitted the required data images. Twenty imported deterministic capsules reproduced 20/20 faults, exceeding the 18/20 threshold.

Detailed records: `verification-artifacts/live-11-workflow.json`, `live-11-offline.json`, `live-11-phaser.png`, and `live-11-desktop-flow.png`.

## Accessibility, responsive behavior, and performance

- Routes `/`, `/demo`, `/privacy/`, `/terms/`, and `/404.html` returned 200.
- Axe WCAG A/AA scans on those five routes reported zero serious or critical findings.
- Keyboard: the first Tab reaches the skip link; the sample action has a visible `3px solid rgb(164, 71, 33)` focus outline and works with Enter.
- At 390 px, the document width remained 390 px, Replay sample was in the first view, and each header link measured 44 × 44 px. At 200% text there was no horizontal overflow.
- Reduced motion used `scroll-behavior: auto` and a 0.00001 s animation duration.
- Cold 390 px transfer was 98,978 bytes: JavaScript 8,640 bytes, CSS 4,625 bytes, fonts 68,287 bytes, image 13,310 bytes. Initial JavaScript is well below the 200 KB budget.

Evidence: `verification-artifacts/live-11-accessibility.json`, `live-11-mobile390.png`, and `live-11-network-budget.json`.

## Deployment identity, headers, and cache policy

The live deployment byte-matches the candidate build for `/`, `/demo`, `/privacy/`, `/terms/`, `/404.html`, core JS/CSS, and the hosted `0.1.7` tarball. Example SHA-256 values:

| Artifact | SHA-256 |
| --- | --- |
| `/` | `35a5f8d9d1f3c8b6230b713d43c8e3091c322d30ef906063fb52ac5bbce1b130` |
| `/demo` | `70169aee491d7bf95dd13bd38f719752db231683012ea4c7cce2d2efb7615751` |
| `assets/main-V0pMKYxP.js` | `a68d83b3b99f3b69eb660312fe1821dbb2dac9e4f36f7fe48b537b64b356fa0d` |
| `releases/sociobot-replay-capsule-0.1.7.tgz` | `b69b0db29d03a9645842759c3d54d13a62e6ebd3661b5aadd43fd6aafc714e41` |

HTML uses `public, must-revalidate, max-age=30`; hashed assets and the release tarball use `public, max-age=31536000, immutable`. Responses include CSP, HSTS, `nosniff`, DENY framing, strict referrer policy, and a restrictive permissions policy. The Phaser route has the narrow additional style allowance it requires.

This is a static library/demo with no product server endpoint or sign-in. Request allowance/429 and Entra tenant checks are not applicable. AI is not needed for this deterministic local replay product.

## Defects by severity

No release-blocking, high, medium, or low product defects were found in this verification.
