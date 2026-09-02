# Independent verification 15 — PASS

**Candidate:** `ca226432b89f9b3dd2aae8ca100b929d830f6028`
**Live URL:** https://browser-game-replay-capsule.sociobot.in
**Verified:** 2026-09-02 UTC
**Scope:** clean-install claims, repository gates, packed-library consumption, and independent live QA. No product code was changed.

## Verdict

**PASS.** The candidate satisfies the researched brief and the factory acceptance contract. The mandatory first claim sweep passed 25/25 on its first execution. The previously intermittent record/export/replay claim also passed the full suite and 20 additional stress runs. No release-blocking, high, medium, or low product defect was found.

## Mandatory opening gates

`.factory/claims.json` exists and contains 25 claim entries. From the clean candidate checkout I ran `npm ci`, then every listed `test` command sequentially and unchanged. Result: **25 passed, 0 failed**. E2E claim commands exercised desktop Chromium and 390×844 mobile Chromium; unit claim commands selected their tagged Vitest regression.

Cold first-read passed at 1440×900 and 390×844:

- **What:** “Replay browser-game bugs from a small file.”
- **For whom:** “For solo 2D game developers who need a bug report that repeats the player’s inputs and timing.”
- **First action:** **Try it with sample data**, with “Loads a seeded bug run you can replay.”

The action is visible without scrolling and opens `/demo` in one click. The demo immediately shows seed `RC-SAMPLE-FAULT-17`, one event, the `fault-contact` checkpoint, a **Replay sample** action, and the persistent “Demo — sample data, nothing is saved.” banner with **Reset demo** and **Start for real**.

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

The landing, demo, privacy page, terms, and README were cross-checked against the manifest and `.factory/copy-audit.md`. Capability and privacy statements map to claim regressions; no unlisted product claim was found.

## Repository and package gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 217 packages, 0 vulnerabilities |
| every command in `.factory/claims.json` | PASS — 25/25 on the mandatory first sweep |
| `npm run check` | PASS — typecheck, 32/32 Vitest tests, exact production build, 53 Playwright passes with 5 intentional project skips |
| `npm run lint` | PASS |
| `npm pack --dry-run` | PASS — 7 files, 11.9 kB packed, 53.6 kB unpacked |
| `npx playwright test --grep @claim:record-export-replay --repeat-each=10` | PASS — 20/20 additional runs |
| clean local tarball consumer | PASS — ESM and CommonJS |
| clean live-tarball consumer | PASS — ESM and CommonJS installed from the documented URL |

The production build created `dist/index.js`, `dist/index.cjs`, declarations, `dist/site/`, and the versioned 0.1.8 tarball. The package declares zero runtime dependencies. The Node 20 claim ran both module formats from a clean packed consumer. An additional live-tarball consumer passed under the container's Node 22 runtime.

## Independent live product flow

The complete smallest-useful flow passed at 1440×900 and 390×844:

1. Open `/demo` with the seeded sample already loaded.
2. Start recording explicitly.
3. Record four keyboard transitions and the terminal pointer movement/click.
4. Reach the visible `fault-contact` state with six exported events.
5. Download and parse the JSON capsule.
6. Import it and replay the exact recorded end state.

Both viewports reported “Replay complete: the recorded outcome was reproduced.” A malformed JSON file produced “Capsule is not valid JSON. Choose a Replay Capsule JSON file under 1 MB.” Re-importing the valid capsule recovered normally. A 1,000,001-byte file was rejected with the 1 MB limit and **Reset demo** restored the sample seed.

The live Phaser fixture recorded a pointer at normalized coordinates and reproduced **20/20** generated seeded failures, exceeding the 90% requirement.

## Accessibility, keyboard, and responsive behavior

- The factory `verify-url.sh` passed: HTTPS 200, title, `lang=en`, one h1, main landmark, alt text, labeled controls, and zero console errors.
- Axe reported zero violations on `/`, `/demo`, `/privacy/`, `/terms/`, and the real 404 response. Therefore there are zero serious or critical findings.
- Keyboard-only navigation reached the skip link first, then the sample action; Enter opened the demo. The action had a 3 px solid amber focus ring.
- On mobile, all checked header links, buttons, and the file control were at least 44×44 CSS px; the smallest measured target was 44×44. No horizontal overflow occurred at 390 px.
- The complete local suite passed 200% text reflow on all routes.
- With reduced motion, scroll behavior was `auto` and the illustration animation duration was `0.00001s`.
- Desktop and mobile live flows produced no console or page errors.

## Privacy, network, and deployment policy

The cold landing and the full demo flow made only same-origin static GET requests. No API, analytics, tracking, telemetry, third-party font/script, model, or sign-in request occurred. After record, download, import, replay, invalid input, and recovery, localStorage, sessionStorage, IndexedDB, Cache Storage, cookies, and service-worker registrations were all empty.

The document response includes a self-only CSP with `frame-ancestors 'none'`, HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, and a camera/microphone/geolocation permissions policy. HTML revalidates after 30 seconds. Hashed assets and release tarballs use one-year immutable caching, and a conditional asset request returned 304. Unknown paths return the designed page with HTTP 404.

This is a static library/documentation product. It has no server-side product or unlock endpoint, so a 429 allowance test is not applicable. It has no sign-in, so Entra authority validation is not applicable. It is not a PWA and does not claim offline reload; the narrower loaded-page offline claim passed with no service worker.

## Deployment identity

The candidate build and production deployment matched byte-for-byte for **43/43** deployable files: pages, metadata files, images, fonts, hashed CSS/JS, Phaser fixture, and release tarballs. Key hashes:

- `dist/site/index.html` and live `/`: SHA-256 `5a61d284c18582eba9250423b13fb7bb5071663e15e2c18738a3d8fa2c2d3171`
- candidate and live `sociobot-replay-capsule-0.1.8.tgz`: SHA-256 `6384908aa2c5075865065bf75a5458ddeeb795e15778efc9213a629721da36b8`

## Performance and budgets

Live Lighthouse 13.4.1 mobile scored **100 performance, 100 accessibility, 100 best practices, and 100 SEO**. Measurements: FCP 1.2 s, LCP 1.4 s, TBT 80 ms, CLS 0, and 97 KiB total transfer. A measured demo interaction took 24 ms.

The landing loads 8.82 kB transferred JavaScript, 4.63 kB CSS, 68.2 kB self-hosted fonts, and a 13.3 kB hero image. Each is within its stated budget. Vite warns about the 333.25 kB gzip Phaser bundle, but that bundle is isolated to `/phaser-fixture.html` and is not requested by the landing or demo; it does not violate the first-load budget.

## Defects by severity

- Release-blocking: none.
- High: none.
- Medium: none.
- Low: none.

## Final assessment

**PASS.** The live product is the tested candidate, performs the real record/export/import/replay job, satisfies the library packaging contract, and meets the privacy, accessibility, performance, and demo requirements. No AI feature is implied by the deterministic local replay job; adding one would conflict with the product's narrow privacy-first purpose. Registry publication remains a factory-owned follow-up and is not part of this verification.
