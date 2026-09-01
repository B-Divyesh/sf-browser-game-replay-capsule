# Independent verification 12 — PASS

**Candidate:** `d09cadba4af40b037e385ffc7135f2d084ae5b25`

**Live URL:** https://browser-game-replay-capsule.sociobot.in

**Verified:** 2026-09-01 UTC

**Scope:** clean installation, every claims-manifest command, full repository gates, packaged-library consumption, and independent live product QA. No product code was changed.

## Verdict

**PASS.** Replay Capsule completes the brief's smallest useful job. A solo 2D browser-game developer can explicitly record normalized input with a seed and checkpoints, download a capped JSON file, validate an imported file, and replay the same sequence. The one-click sample, normal flow, recovery paths, privacy behavior, package formats, and live deployment all passed.

The previously reported deployment-only concern was not reproduced. Live HTML, core assets, and the hosted package byte-match this candidate's production build.

## Mandatory opening gates

`.factory/claims.json` exists and contains 22 entries. Every listed command ran exactly as written after `npm ci`; all 22 passed.

The live first screen passes the cold first-read check:

- What it does: **“Replay browser-game bugs from a small file.”**
- Who it is for: **“For solo 2D game developers who need a bug report that repeats the player’s inputs and timing.”**
- What to select first: **“Try it with sample data”**, beside **“Loads a seeded bug run you can replay.”**
- One click opens `/demo`, which immediately shows seed `RC-SAMPLE-FAULT-17`, one captured event, **Replay sample**, and **“Demo — sample data, nothing is saved.”**

The three required first-screen facts are visible on desktop and at 390 × 844. On the phone viewport their bottom edge was 821.42 px.

## Claims gate

| Claims | Exact result |
| --- | --- |
| `sample-demo`, `no-network-calls`, `opt-in-recording`, `text-entry-excluded`, `record-export-replay`, `no-browser-persistence`, `capture-surface` | PASS — each exact Playwright command passed in both configured projects |
| `checkpoint-capture`, `default-byte-cap`, `custom-cap-range`, `validated-import` | PASS — pre-start exclusion, 128 KB default, 4 KB–1 MB boundaries, and malformed/unsupported/over-limit input checks passed |
| `pointer-normalization`, `gamepad-sampling`, `adapter-callbacks`, `replay-controls` | PASS — normalized coordinates, frame sampling, ordered callbacks, pause/resume/stop/speed checks passed |
| `seeded-failure-fixture` | PASS — both configured browser projects passed; the live fixture separately reproduced 20/20 seeded cases |
| `package-formats`, `installable-release`, `zero-runtime-dependencies` | PASS — ESM, CommonJS, declarations, clean installation, and dependency checks passed |
| `offline-demo`, `mit-license`, `node-20-runtime` | PASS — loaded-page offline flow, license, and pinned Node 20 consumers passed |

The landing page, legal pages, demo, and README claims are represented by the manifest. No unsupported marketing or quantitative claim was found. The plain-words banned-term scan was empty.

## Clean repository and package checks

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 217 packages installed; 0 audit vulnerabilities |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm test` | PASS — 31/31 tests |
| `npm run build` | PASS — ESM, CommonJS, declarations, release tarball, and `dist/site/` produced |
| `npm run test:e2e` | PASS — 50 passed; 4 expected project-specific skips |
| `npm pack --dry-run` | PASS — 7 files; 11.5 kB packed; 52.6 kB unpacked |

The build reports a 1.21 MB uncompressed Phaser fixture chunk. It is isolated to `/phaser-fixture.html` and is not loaded by the landing page or demo. The production landing page loads only 20,675 decoded bytes of JavaScript, so this warning does not breach the initial-load budget.

A new temporary npm project installed the live `0.1.7` tarball. Its ESM consumer recorded, imported, and played a checkpoint capsule; its CommonJS consumer recorded and validated another capsule. `npm ls --omit=dev --all` showed only `@sociobot/replay-capsule@0.1.7`.

## Independent live workflow and recovery checks

- Sample flow: PASS. **Replay sample** finished with **“Replay complete: the recorded outcome was reproduced.”**
- Normal flow: PASS. ArrowRight and ArrowUp produced exactly four key down/up events. The 450-byte download contained only the documented top-level fields. Import and replay returned the same four events in the same order.
- Invalid input and recovery: PASS. Malformed JSON produced **“Capsule is not valid JSON. Choose a Replay Capsule JSON file under 1 MB.”** in an `aria-live="polite"` region. A valid capsule then imported and replayed.
- Boundary values: PASS through the claim regressions. Recorder/import limits accepted 4,096, 128,000, and 1,000,000 bytes and rejected smaller, larger, and fractional limits; cap and schema failure paths remained recoverable.
- Keyboard-only use: PASS. First Tab exposed the skip link. The sample action received a visible 3 px amber focus outline and opened the demo with Enter. The full browser suite confirmed Enter/Tab operation does not enter control keys into the capsule.
- Offline after load: PASS. A fresh loaded demo context replayed the sample after network access was disabled and displayed the documented offline notice.
- Phaser fixture: PASS. The live scene reached **“Phaser scene ready.”** and reproduced 20/20 generated cases without console or page errors, exceeding the 18/20 acceptance threshold.

## Privacy and product boundaries

The full exercised demo flow made 21 requests; every request was to `browser-game-replay-capsule.sociobot.in`. No API, analytics, third-party runtime, sign-in, or model service was contacted. After record, download, malformed import, valid import, and replay, local storage, session storage, cookies, IndexedDB, Cache Storage, and service-worker registrations were all empty.

This is a static library/documentation product with no server-side product endpoint and no product-unlock call. A request allowance and 429 response are therefore not applicable. Sign-in and Microsoft Entra tenant checks are also not applicable. The product is not a PWA and does not claim offline reload; it accurately claims operation after the page has loaded.

## Accessibility, responsive behavior, and performance

- `/`, `/demo`, `/privacy/`, `/terms/`, and the designed HTTP 404 each have a route-specific title, one h1, and one main landmark.
- Axe WCAG A/AA scans reported zero violations on every route, including zero serious or critical findings. The documented light-only theme was checked.
- The worker `verify-url.sh` passed: `lang=en`, one h1, main present, no missing image alternatives, no unlabeled buttons, and no console errors.
- At 390 px, document width and scroll width were both 390 px. The seeded demo summary and Replay sample control ended above 549 px. The only 1 × 1 control reported by a raw size scan was the intentionally hidden file input; its visible label is at least 44 px and has its own tested focus treatment.
- At 200% text, no horizontal overflow appeared and the primary action remained visible.
- With reduced motion requested, scroll behavior was `auto` and the hero animation duration was `0.00001s`.
- Mobile Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; FCP 1.22 s, LCP 1.37 s, total blocking time 73 ms, CLS 0.00019, and 99,471 transferred bytes.
- Cold decoded resource sizes: JavaScript 20,675 bytes, CSS 17,612 bytes, fonts 68,044 bytes, and image 13,250 bytes. Each is within its product budget.

Evidence: `verification-artifacts/live-12-cold-desktop.png`, `live-12-cold-mobile.png`, `live-12-desktop-flow.png`, `live-12-demo-mobile.png`, `live-12-phaser.png`, `live-12-lighthouse-mobile.json`, and `live-12-verify-url/`.

## Deployment identity, headers, and caching

Candidate and live SHA-256 values match:

| Artifact | SHA-256 |
| --- | --- |
| `/` | `e6c4e2f6a234c3faca98bce9330bf1951d1bb029126f2da84c05f7bc5f052fc0` |
| `/demo` | `38b3de84b0279bcae0bd88b6ea1a46bfe70ed2db97e1235308b82e863d300f7f` |
| `/privacy/` | `0da6d54593e6eec84aa9d332f880d6b9b9c9d57a75720868b8f35a6a08d934c1` |
| `/terms/` | `a0a86efe8854e25ff449d59ea25f699b2c6682eca1e0ad041018385d1dc2a334` |
| `/404.html` | `4f0ff5032190610c32c439b358b51192f51c5277fd8236e3159433e09854c1d7` |
| Main JS | `a68d83b3b99f3b69eb660312fe1821dbb2dac9e4f36f7fe48b537b64b356fa0d` |
| Main CSS | `4b5e1e9beca26db38dda78556573f4476a010cbd60ac4acb99c11eb729980d51` |
| Hosted `0.1.7` tarball | `b69b0db29d03a9645842759c3d54d13a62e6ebd3661b5aadd43fd6aafc714e41` |

HTML uses `public, must-revalidate, max-age=30`. Hashed assets and the versioned tarball use `public, max-age=31536000, immutable`. Responses include CSP, HSTS, `nosniff`, DENY framing, strict referrer policy, and a restrictive permissions policy. An unknown path returned the designed page with HTTP 404. All landing links returned 200.

## Defects by severity

- Release-blocking: none.
- High: none.
- Medium: none.
- Low: none.
