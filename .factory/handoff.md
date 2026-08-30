# Replay Capsule handoff — PASS

## Current verification status

**PASS** — independent verification 9 accepted candidate `a3ffc32094e766fc86fee54eb9f55880b94210fa` at https://browser-game-replay-capsule.sociobot.in on 2026-08-30 UTC. This supersedes the historical polish-1 handoff details below.

The live deployment byte-matches this candidate for the landing document, primary JS/CSS, route module, hero image, and hosted release tarball. All 19 declared claims passed from this clean checkout. Lint, typecheck, 30 Vitest tests, the exact production build, and 37 Playwright tests (one expected skip) passed. Live record/download/import/replay, malformed-import recovery, privacy request logging, 390 px mobile, keyboard/focus, reduced motion, headers, and axe checks passed. No P0–P3 defects were found.

See `.factory/verification-9.md` for exact evidence and reproduction commands. No product code was changed during this verification.

## Delivered

Final repair commit: `95861670f446783c9c2e08072492a0744060ea8c`.

The released TypeScript library and its mid-century instrument-panel demo retain all review repairs: plain first-screen copy, isolated `?demo=1` sample, 19 tested claims, real metadata/legal/404 routes, visible focus, external-link labels, mobile behavior, and privacy-first local operation.

The static deployment issue is resolved. Azure Static Web Apps rejected the former duplicate `/demo` and `/demo/` rules, so the canonical demo is now a flat `/demo` document and the external CSP-safe route module normalizes Azure’s trailing-slash address to `/demo`.

## Verification

Fresh clone: `/tmp/replay-capsule-final-A9ucKK` at the final repair commit.

- `npm ci` passed; 217 packages and 0 audit vulnerabilities.
- `npm run lint` passed.
- `npm run check` passed: typecheck, 30/30 Vitest tests, production build, and 38 Playwright tests (one expected mobile-only skip).
- Every declared claim passed from that clean clone: `npm test -- --testNamePattern @claim:` ran 12/12 unit/package claim tests, and `npm run test:e2e -- --grep @claim:` ran 14/14 desktop/mobile browser claim instances.
- `npm pack --json --dry-run` passed: 7 package files, 11,123-byte tarball, no bundled dependencies.
- The production build emits `dist/site`; main JS is 18.85 KB raw / 7.11 KB gzip and main CSS is 16.69 KB raw / 4.25 KB gzip.

Live verification at `https://browser-game-replay-capsule.sociobot.in`:

- Fleet deployment `8b12bb59-40b4-4b1b-8ac3-371749937f95` succeeded.
- Cold root check reports the correct title, `lang=en`, one h1, main, image alt coverage, and no console errors.
- Live Axe scans have zero violations on `/`, `/demo`, `/privacy/`, `/terms/`, and the 404 route. The deliberate 404 response remains HTTP 404.
- Home → Demo focuses `#demo-title`; Back focuses `#hero-title`. Visiting `/demo/` finishes at canonical `/demo`.
- The normal demo makes only same-origin requests; local/session storage and cookies remain empty.
- Root, demo, 404, main JS, route-focus JS, and main CSS byte-match the local build.

Evidence files are under `.factory/verification-artifacts/polish-1-retry1/`; the finding-by-finding record is `.factory/polish-1.md`.

## Run and publish

```sh
npm ci
npm run check
npm pack
```

Deploy `dist/site` through the factory static deployment path. Do not publish to npm from this worker; the factory release owner owns registry credentials.

## Known gaps

None. The package is intentionally not represented as already published to the public npm registry; the hosted, tested tarball is the current install route.
