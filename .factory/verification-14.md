# Independent verification 14 — FAIL

**Candidate:** `3f4f3a0f3d6eb1da9f2c45c031c887deb40a688e`
**Live URL:** https://browser-game-replay-capsule.sociobot.in
**Verified:** 2026-09-01–02 UTC
**Scope:** clean-install claims and repository gates, packed-library consumption, and independent live QA. No product code was changed.

## Verdict

**FAIL.** The product and the live deployment are otherwise in very good shape, but the mandatory first claim sweep had one failed claim execution. The factory contract makes any failed claim test release-blocking, even when a retry passes. There is also a measured mobile LCP budget overrun.

## Mandatory opening gates

`.factory/claims.json` exists and declares 25 claim tests. After `npm ci` from a clean checkout, I ran every command listed in that file via the shipped demo entry point.

The first sequential claim sweep reached `@claim:record-export-replay` after the first four claims had passed and then failed its **mobile** project. Playwright wrote a failed run (`test-results/.last-run.json` named failed test id `5c02723ad68c2a0d50c5-53f8e2587d60d4618e4b` and created a mobile failure trace). A direct exact-command retry passed both projects. The remaining listed commands then all passed. Three additional exact-command repetitions and the complete 56-test Playwright suite also passed. This is evidence of an intermittent claim regression, not a clean first-pass claim gate.

Cold live first-read passes. The first screen says:

- **What:** “Replay browser-game bugs from a small file.”
- **For whom:** “For solo 2D game developers who need a bug report that repeats the player’s inputs and timing.”
- **First action:** **Try it with sample data**, with “Loads a seeded bug run you can replay.”

That action is visible without scrolling and opens `/demo` in one click. The demo has the required persistent “Demo — sample data, nothing is saved.” banner, Reset demo, and Start for real controls.

## Claim and product checks

All 25 claimed behaviors were subsequently exercised successfully: isolated demo data, known-static-only request behavior, opt-in capture, typed-text exclusion (including Shadow DOM), export/import/replay, no browser persistence, capture scope, checkpoints, key filtering, byte caps and range validation, pointer normalization, gamepad sampling, replay callbacks and controls, Phaser fixture/replay recording, ESM/CommonJS/types, clean package installation, zero runtime dependencies, loaded-page offline operation, MIT licensing, and Node 20 operation.

Independent live normal flow passed: recording ArrowRight and ArrowUp exported four events under a generated seed; importing the download reported “Imported 4 events. Seed and checkpoints validated locally.”; replay completed with “the same 4 recorded events were applied.” Malformed JSON produced the actionable recovery text “Capsule is not valid JSON. Choose a Replay Capsule JSON file under 1 MB.”

## Local checks

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 217 packages installed; 0 audit vulnerabilities |
| `npm test` | PASS — 32/32 |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS — ESM, CommonJS, declarations, hosted tarball, and `dist/site/` |
| `npm run test:e2e` | PASS — 56 tests (52 passed, 4 intentional project-specific skips) |
| package clean consumer / Node 20 | PASS through `@claim:installable-release` and `@claim:node-20-runtime` |

The landing’s initial JavaScript is 18.46 KB gzip (three scripts); CSS is 4.43 KB gzip. The 333.25 KB gzip Phaser fixture is a separate `/phaser-fixture.html` route and is not requested by the landing/demo.

## Privacy, accessibility, and deployment

- Playwright’s live request log for a cold landing visit contained only same-origin static GETs: document, scripts, stylesheet, image, and self-hosted fonts. No API, telemetry, analytics, third-party, model, or sign-in request was observed. The page emitted no console or page errors.
- The live record/import/replay flow retained empty local/session storage and cookies. The product is static: no server-side product API, product-unlock call, sign-in, rate allowance, or `429 Retry-After` behavior exists to test.
- Axe found zero violations on `/`, `/demo`, `/privacy/`, `/terms/`, and `/404.html` at 390 px. Each had `lang=en`, one h1, and one main landmark; there was no horizontal overflow. First Tab reached the visible 3 px skip-link focus ring. Reduced motion set scroll behavior to `auto` and hero animation to `0.00001s`.
- Headers include HSTS, `nosniff`, strict referrer policy, `X-Frame-Options: DENY`, permissions policy, and a self-only CSP with `frame-ancestors 'none'`. HTML uses 30-second revalidation; hashed assets and the tarball use one-year immutable caching. Unknown routes return HTTP 404.
- Candidate/live identity passes: fresh candidate `dist/site/index.html` and live `/` have SHA-256 `172f0fe735abc724ad39ee8d8a071c7f8ac1a5b91b60022e8e28f2d0ce59405e`; candidate and live `sociobot-replay-capsule-0.1.7.tgz` both have SHA-256 `fc9b5f0cfc69d52f964435c04e668e15c59a02568586acb657271ec5a4f1edd1`.

## Performance

A valid mobile Lighthouse run (with full-page screenshot disabled because the first attempt crashed while capturing it) scored Performance 96, Accessibility 100, Best Practices 100, SEO 100; FCP 1.7 s, TBT 40 ms, CLS 0.001, transfer 97 KiB. Its LCP was **2.7 s**, over the 2.5 s product budget. The first attempt, whose tab crashed only at screenshot capture, measured LCP 3.0 s and must not be treated as a valid scored audit.

## Defects by severity

1. **Release-blocking — F-14-1: fresh claim sweep is not clean.** `@claim:record-export-replay` failed once in the mandated initial mobile claim execution, although its direct retry, three subsequent repetitions, and the full suite passed. Make this browser test deterministic (and retain diagnostics on failure), then rerun every command in `.factory/claims.json` from a clean checkout with no failures.
2. **Medium — F-14-2: mobile simulated LCP is 2.7 s, above the 2.5 s budget.** Re-measure after reducing critical-path work or response/render delay and record a compliant run.

No other high, serious, or critical accessibility, functional, privacy, packaging, header, or deployment-identity defects were found.
