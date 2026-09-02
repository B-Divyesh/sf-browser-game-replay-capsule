# Independent verification 16 — PASS

**Candidate:** `6cff66ceac89a82e2d2c0ea8376d060d55f7d5b7`

**Live URL:** https://browser-game-replay-capsule.sociobot.in

**Verified:** 2026-09-02 UTC

**Scope:** clean-install claim gates, repository quality gates, packed-library consumption, and independent live desktop/mobile QA. No product code was changed.

## Verdict

**PASS.** The candidate satisfies the researched brief and the factory acceptance contract. All 26 manifest claim commands passed after the clean dependency install. The complete local gate passed, the live product completed the core record → download → import → replay job on desktop and 390 px mobile, and all 43 browser-served production files match this candidate byte-for-byte. No product defect was found.

## Mandatory opening gates

`.factory/claims.json` exists and contains 26 entries. The first literal command invocation in the dependency-free clone could not load `@playwright/test`; `npm ci` then installed the locked dependencies with zero audit vulnerabilities. I reran every manifest command, sequentially and unchanged, after that required install: **26 passed, 0 failed**.

The cold live first-read passes at 1440×900 and at 390×844:

- **What:** “Replay browser-game bugs from a small file.”
- **For whom:** “For solo 2D game developers who need a bug report that repeats the player’s inputs and timing.”
- **First action:** **Try it with sample data**, with the adjacent explanation “Loads a seeded bug run you can replay.”

The action is visible without scrolling and opens `/demo` in one click. The next screen already contains seed `RC-SAMPLE-FAULT-17`, one pointer event, the `fault-contact` checkpoint, and **Replay sample**. Its persistent banner says “Demo — sample data, nothing is saved.” and provides **Reset demo** and **Start for real**. Evidence: [cold desktop](artifacts/live-first-read.png) and [mobile demo](artifacts/verification-16-live/demo-mobile-390x844.png).

## Claim results

| Claim | Result |
| --- | --- |
| `sample-demo` | PASS |
| `no-network-calls` | PASS |
| `opt-in-recording` | PASS |
| `text-entry-excluded` | PASS |
| `record-export-replay` | PASS |
| `no-browser-persistence` | PASS |
| `capture-surface` | PASS |
| `checkpoint-capture` | PASS |
| `key-filter` | PASS |
| `default-byte-cap` | PASS |
| `capped-export-import` | PASS |
| `custom-cap-range` | PASS |
| `validated-import` | PASS |
| `pointer-normalization` | PASS |
| `pointer-capture-order` | PASS |
| `gamepad-sampling` | PASS |
| `adapter-callbacks` | PASS |
| `replay-controls` | PASS |
| `seeded-failure-fixture` | PASS — live and local fixture reproduced 20/20 seeded failures |
| `phaser-recording` | PASS |
| `package-formats` | PASS |
| `installable-release` | PASS |
| `zero-runtime-dependencies` | PASS |
| `offline-demo` | PASS |
| `mit-license` | PASS |
| `node-20-runtime` | PASS |

The landing, demo, legal pages, README, and `.factory/copy-audit.md` were cross-checked against this inventory. Capability, privacy, compatibility, package, license, offline, size, capture, import, and integration statements have matching tests. No unsupported or unlisted product claim was found.

## Repository and package gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 217 packages; 0 vulnerabilities |
| every exact command in `.factory/claims.json` | PASS — 26/26 |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm test` | PASS — 32/32 |
| `npm run build` | PASS — ESM, CommonJS, declarations, hosted tarball, and `dist/site/` |
| `npm run test:e2e` | PASS — 55 passed; 5 intentional project-specific skips |
| `npm run check` | PASS — typecheck, 32/32 tests, exact production build, and 55 browser passes |
| `npm pack --dry-run` | PASS — 7 files; 11.9 kB packed; 53.6 kB unpacked |
| fresh local-tarball consumer | PASS — ESM and CommonJS imports exercised |
| fresh hosted-tarball consumer | PASS — ESM and CommonJS imports exercised |

The package is version `0.1.8`, exposes TypeScript declarations, has zero runtime dependencies, and declares MIT licensing. Fresh consumers used `validateCapsule` and `createPlayer`, not merely module loading.

## End-to-end behavior and edge cases

The production-adapted repository suite passed **53 tests** across desktop Chromium and 390×844 mobile Chromium, with five intentional viewport-project skips. This includes first-screen behavior, full recording, exact JSON download, re-import, replayed-event equality, deterministic end-state reproduction, keyboard-only controls, typed-text exclusion, malformed import messaging, pointer normalization/order, privacy surfaces, routes, and legal pages.

Two additional runner cases attempted the local-only URL hard-coded in the offline test (`http://127.0.0.1:4173/demo`) and therefore returned `ERR_CONNECTION_REFUSED`; they did not exercise or fail production. The independent live audit loaded the real `/demo`, switched that browser context offline, and successfully replayed the seeded capsule. The ordinary local `@claim:offline-demo` command and full local suite both pass.

Normal live flow exported six ordered key/pointer events plus the `fault-contact` checkpoint, imported the downloaded JSON, and ended with “Replay complete: the recorded outcome was reproduced.” Malformed JSON produced “Capsule is not valid JSON. Choose a Replay Capsule JSON file under 1 MB.” Reset restored the original sample. Unit and package regressions separately cover empty capsules, invalid schema/version/labels, non-JSON-safe checkpoints, caps below 4 KB and above 1 MB, fractional caps, a near-128 KB round trip, the default 128 KB truncation boundary, and the hard 1 MB import boundary.

The live Phaser fixture recorded pointer input at normalized coordinates and reproduced **20/20** generated seeded failures, above the 90% acceptance target. The audit report is [live-audit.json](artifacts/verification-16-live/live-audit.json).

## Accessibility and responsive behavior

- The factory `verify-url.sh` passed: HTTPS 200, correct title and `lang`, one h1, one main landmark, complete image alternatives, labeled buttons, and zero console/page errors.
- Axe reported **zero violations** on `/`, `/demo`, `/privacy/`, `/terms/`, and a real HTTP 404 page; therefore serious and critical findings are zero.
- Keyboard-only tests reach the skip link first, show a 3 px solid amber focus ring, activate the sample action with Enter, operate recording, and retain visible focus on the import control.
- At 390 px, no audited route overflows. Header, footer, code, and form controls meet the 44 px target regression. The sample summary and **Replay sample** remain within the first 844 px.
- At 200% text, all five audited routes reflow without horizontal overflow. With reduced motion, scroll behavior is `auto` and the entrance duration is effectively zero.

Screenshots and the URL-check report are under [`artifacts/verification-16-live`](artifacts/verification-16-live/).

## Privacy, headers, and deployment behavior

The live demo’s full replay request log contains ten requests: one document and nine same-origin scripts, stylesheet, fonts, and images. Every request is GET, has no query data, and targets a known static path. No API, analytics, tracking, telemetry, third-party runtime, AI model, or sign-in request occurred. After demo interactions, localStorage, sessionStorage, IndexedDB, Cache Storage, cookies, and service-worker registrations remained empty.

Browser-observed root response headers include:

- `Content-Security-Policy: default-src 'self'; … connect-src 'self'; … frame-ancestors 'none'`
- `Strict-Transport-Security: max-age=10886400; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

HTML uses `public, must-revalidate, max-age=30`. Hashed assets and release tarballs use `public, max-age=31536000, immutable`; an asset request with its ETag returned 304. An unknown path returned the designed page with HTTP 404.

This is a static library/documentation product with no server-side endpoint, product-unlock call, or account system. A request allowance and `429 Retry-After` test is therefore not applicable. Entra authority validation is not applicable. It is not a PWA and registers no service worker; it claims loaded-page offline operation rather than offline reload.

## Candidate/deployment identity

Fresh `dist/site` and production matched byte-for-byte for **43/43** browser-served files. `_headers` and `staticwebapp.config.json` are deployment configuration and were correctly excluded from public-file comparison.

- Candidate `dist/site/index.html` and live root SHA-256: `5a61d284c18582eba9250423b13fb7bb5071663e15e2c18738a3d8fa2c2d3171`
- Candidate and live `sociobot-replay-capsule-0.1.8.tgz` SHA-256: `3100d0dedb86a922774a1528063fbe771cdd62d46692d2f52655baae6c263e59`

## Performance and budgets

Lighthouse 13.4.1 mobile scored **100 performance, 100 accessibility, 100 best practices, and 100 SEO**. FCP and LCP were 0.91 s, TBT was 68 ms, CLS was 0.00019, and total transfer was 99,570 bytes.

The cold landing transferred 9,763 bytes of JavaScript, 4,873 bytes of CSS, 69,244 bytes of self-hosted fonts, and 13,550 bytes of imagery. All are comfortably within the factory budgets. The build warning is for the 333.25 kB gzip Phaser test fixture, which is isolated to `/phaser-fixture.html` and is absent from landing/demo requests.

## Defects by severity

- Release-blocking: none.
- High: none.
- Medium: none.
- Low: none.

## Final assessment

**PASS.** The deployed library and demo match candidate `6cff66ceac89a82e2d2c0ea8376d060d55f7d5b7`, perform the brief’s real job end to end, and meet the claims, packaging, privacy, accessibility, routing, and performance contracts. Registry publication remains factory-owned and was not attempted.
