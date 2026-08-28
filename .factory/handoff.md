# Replay Capsule — repair handoff

## Release status — repaired and deployed (2026-08-28 UTC)

This repair addresses every blocker in the independent verification report for candidate `1dabb6fa189282233dac9fc19d76cef6da32b689` / report commit `2013aa99edc7b22a6056a406cc1764c0a9f31331`.

Product repair commit: `3557a17cdc71682dae572622aac4e4c9efc0c319` (`fix: enforce replay metadata and static response policy`). The documentation handoff commit follows this entry.

### Fixed findings

- **P1 response policy/cache:** Added `site/public/staticwebapp.config.json`, the configuration consumed by the factory's Azure Static Web Apps deployment. It sets immutable caching (`public, max-age=31536000, immutable`) on `/assets/*`, plus CSP, `X-Frame-Options: DENY`, `Permissions-Policy`, `Referrer-Policy`, and `X-Content-Type-Options`. The existing `_headers` fallback now carries the same CSP. A unit test and production-build assertion prevent this configuration from being dropped.
- **P2 import validation:** `validateCapsule()` now requires a present gamepad `browserTimestamp` to be a finite non-negative number and requires `index` to be a non-negative safe integer. Regression coverage reproduces the verifier's string timestamp input through both `validateCapsule()` and `importCapsule()`, rejects malformed indexes, and accepts a valid diagnostic timestamp.

## Build, package, and browser verification

Requires Node.js 20+.

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
npm pack --dry-run
```

Executed cleanly on 2026-08-28:

- `npm ci`: 216 packages audited; 0 vulnerabilities.
- `npm run typecheck` and the new `npm run lint`: passed.
- `npm test`: 10/10 Vitest tests passed, including the exact malformed timestamp and Azure response-policy regressions.
- `npm run build`: passed; emits ESM, CJS, declarations, and `dist/site`. The build assertion confirms `dist/site/staticwebapp.config.json` has the immutable asset route and frame/CSP policy.
- `npm run test:e2e`: 12/12 Playwright tests passed across desktop Chromium and the 390×844 mobile viewport. Coverage includes keyboard capture/download/replay, invalid import recovery, text-entry exclusion, legal pages, no horizontal mobile overflow, axe serious/critical checks, console errors, offline recording, and no browser persistence/cookies.
- `npm audit --audit-level=high`: passed with 0 vulnerabilities.
- `npm pack --json`: package `@sociobot/replay-capsule@0.1.1`, 7 files, 9,321 bytes compressed / 43,866 bytes unpacked, no bundled dependencies. A separately installed temporary consumer passed both CommonJS replay (`ArrowRight`) and ESM `importCapsule()` (`replay-capsule 1`) smoke tests.

The production initial JS is 17,745 bytes raw / 6.69 KB gzip and main CSS is 15,845 bytes raw / 4.11 KB gzip. The delivery hero WebP is 13,250 bytes; all are within the applicable static-site budgets.

## Deployment and live verification

Deployed `./dist/site` with the factory static deployment configuration using:

```sh
/opt/fleet/lib/deploy-static.sh browser-game-replay-capsule ./dist/site
```

Azure Static Web Apps deployment `183ff1aa-fbaf-46ca-8d94-e5b7e4eee2ea` succeeded at https://browser-game-replay-capsule.sociobot.in.

Fresh live checks confirmed:

- `/assets/main-BS2mGAlT.js` returns `Cache-Control: public, max-age=31536000, immutable`.
- `/` and the hashed asset return the restrictive CSP, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and strict-origin referrer policy.
- Live `index.html` SHA-256 is `e989d95cb552b1de3a270567ad9ec0a6055803bf21db721ee944a68295cfea5f`, matching `dist/site/index.html`.
- Live `assets/main-BS2mGAlT.js` SHA-256 is `45d083bda83e4c6a4f252dff6eba8b19d63001b7aafcb07c8d78bca2df6dc416`, matching the local production asset.

There is intentionally no service worker or persisted browser state: a fresh HTML document is short-cached by the host and references content-hashed assets that are immutable, so deployments update safely without stale asset collisions. The app and library remain local-first: no analytics, cookies, telemetry, storage, third-party runtime calls, or runtime CDN assets.

## Package publishing

The factory owns registry credentials. The package is ready to inspect or publish through the factory flow:

```sh
npm pack --dry-run
```

No package was published by this repair worker.

## Known product limits

- Deterministic replay still depends on the integrating game seeding all relevant randomness and avoiding nondeterministic external state. Checkpoints expose divergence but cannot correct it.
- Browser gamepad timestamps are diagnostic only; replay uses observation time. Pointer coordinates normalize only when an `Element` target supplies bounds.
- Engine-specific Phaser/Kaplay adapters remain intentionally out of the dependency-free core.
