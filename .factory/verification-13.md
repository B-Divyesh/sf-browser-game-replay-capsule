# Independent verification 13 — PASS

**Candidate:** `e119ca8a10198445a945ce207dd5f60d76914108`

**Live URL:** https://browser-game-replay-capsule.sociobot.in

**Verified:** 2026-09-01 UTC

**Scope:** clean claim execution, complete repository gates, packed-library consumption, and independent live product QA. No product code was changed.

## Verdict

**PASS.** Replay Capsule completes the researched job for a solo 2D browser-game developer. It explicitly records input and timing with a developer seed and checkpoints, exports a bounded local JSON capsule, validates imports, and replays the same event sequence. The live one-click sample, normal workflow, recovery paths, package artifacts, privacy behavior, responsive UI, and deployment identity all passed.

## Mandatory opening gates

`.factory/claims.json` exists with 25 entries. After `npm ci`, every listed command ran separately and all 25 passed. The browser claims passed in both configured desktop and 390 px mobile projects.

The cold live first screen answers all three required questions in plain words:

- What it does: **“Replay browser-game bugs from a small file.”**
- Who it is for: **“For solo 2D game developers who need a bug report that repeats the player’s inputs and timing.”**
- What to select first: **“Try it with sample data”**, beside **“Loads a seeded bug run you can replay.”**

The action is visible without scrolling and opens `/demo` in one click. The resulting first phone screen shows seed `RC-SAMPLE-FAULT-17`, one event, the `fault-contact` checkpoint, **Replay sample**, and **“Demo — sample data, nothing is saved.”**

## Claims gate

| Area | Exact result |
| --- | --- |
| Demo and privacy | PASS — `sample-demo`, `no-network-calls`, `opt-in-recording`, `text-entry-excluded`, `no-browser-persistence`, and `capture-surface` |
| Record and replay | PASS — `record-export-replay`, `checkpoint-capture`, `key-filter`, `pointer-normalization`, `gamepad-sampling`, `adapter-callbacks`, and `replay-controls` |
| Limits and validation | PASS — `default-byte-cap`, `capped-export-import`, `custom-cap-range`, and `validated-import` |
| Phaser proof | PASS — `seeded-failure-fixture` and `phaser-recording` |
| Package and license | PASS — `package-formats`, `installable-release`, `zero-runtime-dependencies`, `mit-license`, and `node-20-runtime` |
| Loaded-page offline operation | PASS — `offline-demo` |

Each claim ID occurs in exactly one tagged regression. Landing, demo, legal, and README capabilities are mapped in `.factory/copy-audit.md`; no unsupported or unlisted product claim was found.

## Clean repository and package checks

| Check | Result |
| --- | --- |
| Candidate identity | PASS — clean starting checkout at `e119ca8a10198445a945ce207dd5f60d76914108`; `origin/main` matched |
| `npm ci` | PASS — 217 packages installed; 0 audit vulnerabilities |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm test` | PASS — 32/32 tests |
| `npm run build` | PASS — ESM, CommonJS, declarations, versioned tarball, and `dist/site/` produced |
| `npm run test:e2e` | PASS — 52 passed; 4 intentional project-specific skips |
| `npm pack --dry-run` | PASS — 7 files; 11.6 kB packed; 52.9 kB unpacked |

The production build warns about a 1.21 MB uncompressed Phaser fixture chunk. That chunk is isolated to `/phaser-fixture.html` and is not loaded by the landing page or demo. The actual landing load uses 20,675 decoded JavaScript bytes.

A fresh temporary consumer installed the live `0.1.7` tarball. ESM recorded, exported, imported, and replayed a checkpoint; CommonJS recorded, exported, and validated a capsule. `npm ls --omit=dev --all` contained only `@sociobot/replay-capsule@0.1.7`.

## Independent live workflow and recovery

- Sample flow: PASS. The demo loaded the documented seed/event/checkpoint and replayed it while the browser context was offline after initial load.
- Normal flow: PASS. ArrowRight and ArrowUp produced the exact four down/up events in a 453-byte download with only the documented top-level fields.
- Import and replay: PASS. Importing that file and replaying produced **“Replay complete: the same 4 recorded events were applied.”** The applied event array exactly matched the download.
- Invalid input and recovery: PASS. Malformed JSON produced **“Capsule is not valid JSON. Choose a Replay Capsule JSON file under 1 MB.”** A valid file then imported and replayed successfully.
- Boundaries: PASS through the required claim regressions. Recorder/import caps accepted 4,096, 128,000, and 1,000,000 bytes; rejected lower, higher, fractional, malformed, unsupported, and over-limit inputs; and preserved an importable near-cap download.
- Phaser fixture: PASS. The live scene reached **“Phaser scene ready.”**, recorded normalized canvas input, and reproduced 20/20 independently generated seeded failures, above the 18/20 acceptance threshold.

## Privacy and service boundaries

The request log for the full demo, record, download, malformed-import, valid-import, replay, and route flow contained only `https://browser-game-replay-capsule.sociobot.in`. No analytics, API, third-party runtime, model service, or sign-in request occurred.

After the exercised flow, local storage, session storage, cookies, IndexedDB, Cache Storage, and service-worker registrations were empty. The demo reported namespace `demo:replay-capsule:memory`; real mode uses the separate in-memory namespace.

This is a static library/documentation product. It has no server-side product endpoint or product-unlock call, so an API request allowance and `429 Retry-After` check are not applicable. It has no sign-in, so the Entra authority check is not applicable. It is not a PWA and does not claim offline reload; it accurately promises operation after the page has loaded.

## Accessibility, responsive behavior, and performance

- The factory `verify-url.sh` passed: HTTP 200, title, `lang=en`, one h1, main landmark, no missing image alternatives, no unlabeled buttons, and no console errors.
- Playwright Axe reported zero violations on `/`, `/demo`, `/privacy/`, `/terms/`, and `/404.html`; therefore serious and critical findings are zero.
- Keyboard-only use passed: the first Tab reaches the skip link, the sample action has a visible 3 px amber focus ring, Enter opens the demo, and destination heading focus is restored.
- At 390 × 844, document and viewport widths are both 390 px. The three first-screen facts end at 821.42 px, the seeded demo action ends at 548.33 px, and all visible interactive targets are at least 44 px.
- At 200% text, all five checked routes remain 390 px wide and all header links stay within the viewport.
- With reduced motion requested, scroll behavior is `auto`; animation and transition durations are `0.00001s`.
- Mobile Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; FCP 1.4 s, LCP 1.4 s, total blocking time 30 ms, CLS 0, total transfer 97 KiB.
- Cold decoded resources: JavaScript 20,675 bytes, CSS 17,627 bytes, fonts 68,044 bytes, and hero image 13,250 bytes. All are within the required budgets.

Evidence is in `.factory/verification-artifacts/verify-13-live/`.

## Deployment identity, headers, and caching

All 42 compared public files byte-match the candidate's fresh `dist/site` build, including every HTML document, hashed asset, metadata file, fixture, and hosted tarball. Representative candidate/live SHA-256 values are:

| Artifact | SHA-256 |
| --- | --- |
| `/` | `c502c923054783b81561ce8502647130f464f0fa7dcebb3d911bda32cd816062` |
| `/demo` | `d0c85e901b4b09f2c753571a05a8c1da30b50f82c88fb5cee754c6c19566710f` |
| Main JS | `a68d83b3b99f3b69eb660312fe1821dbb2dac9e4f36f7fe48b537b64b356fa0d` |
| Main CSS | `84309ecfe9b9872987aa92d6fb5cc29c1973cba897abade83e15007ce07f973c` |
| Hosted `0.1.7` tarball | `a1156c75080b556d4fa0d34a6d36ce7e8772e69538b46c3325e351dfd44c859b` |

HTML and real 404 responses use `public, must-revalidate, max-age=30`. Hashed assets and versioned release tarballs use `public, max-age=31536000, immutable`. Responses include HSTS, `nosniff`, `X-Frame-Options: DENY`, strict referrer policy, restrictive permissions policy, and a self-only CSP with `frame-ancestors 'none'`. An unknown route returned the designed page with HTTP 404.

## Defects by severity

- Release-blocking: none.
- High: none.
- Medium: none.
- Low: none.
