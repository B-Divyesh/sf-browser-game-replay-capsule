# Replay Capsule — repair handoff

## Release status — repair deployed; npm publication pending factory workflow (2026-08-28 UTC)

This repair addresses the independent verifier report in `.factory/verification-2.md` for candidate `c6d5320e78f5668b59c20aafe6034862e196e9be` / report commit `49417921ec132081f550eb442b694e3528df549e`.

Product repair commit: `37e4fe66aa7b626fb12377beb5ee9ddaf8cc0c27` (`fix: cap downloaded replay artifacts and focus visibility`). It was pushed to `origin/main` and deployed as static site deployment `dfb46c9c-fa63-493f-a66a-a4d979b531f4`.

### Fixed product findings

- **P1 — downloaded-cap mismatch:** Recorder accounting, string import accounting, and `downloadCapsule()` now share compact `JSON.stringify` bytes. `downloadCapsule()` also rejects a value above the 1,000,000-byte hard import limit. When setting the `truncated` flag itself would overflow the recorder cap, the recorder removes the newest retained entry until the final artifact fits. Exact unit regressions create recorder artifacts at over 126 KB of a 128 KB cap and over 998 KB of the 1 MB cap, capture the Blob that would download, compare its exact text to the accounted compact JSON, then import it under the same limit.
- **P1 — invisible import focus:** The native file input now precedes its visible label, allowing `#import:focus-visible + .file-button` to render the designed 3px amber ring on the visible **Import capsule** control. Playwright tabs from enabled **Download capsule** to the real input and asserts the label ring at desktop and 390×844 mobile.
- **P2 — compact targets:** The wordmark link and **Copy code** control now have 44px minimum heights. The mobile browser regression measures both at least 44 CSS px.
- **P2 — researched outcome:** `examples/phaser-seeded-failure.ts` is a real Phaser 3 integration fixture. `tests/phaser-fixture.test.ts` imports 20 deterministic replay capsules and replays their events through the shared fixture model: 20/20 seeded fault outcomes reproduce (100%, exceeding the 90% target). Phaser is a development-only fixture dependency; the published library keeps zero runtime dependencies.

### Verification evidence

Executed from a clean dependency install on Node 22 / npm 10:

```sh
npm ci
npm run check
npm audit --audit-level=high
npm pack --json
```

- `npm ci`: 217 packages installed; audit: 0 vulnerabilities.
- `npm run check`: passed typecheck, ESLint, 13 Vitest tests, production build, and 15/15 active Playwright tests (one desktop-only duplicate target test is intentionally skipped). The suite covers desktop and 390×844 mobile, keyboard capture/download/replay, the focus regression, mobile targets, malformed import recovery, text-entry exclusion, axe serious/critical findings, no console errors, legal pages, offline-after-load recording, and no browser storage/cookies.
- The new unit coverage specifically verifies the 128 KB and 1 MB download/import round trips; the Phaser fixture trial is 20/20.
- Production build emits ESM, CJS, declarations, and `dist/site`. Initial JS is 17,942 bytes raw / 6.78 KB gzip; main CSS is 15,962 bytes raw / 4.13 KB gzip; the delivery hero WebP is 13,250 bytes.
- `npm pack --json` produced `@sociobot/replay-capsule@0.1.2`: 7 files, 9,900 bytes packed / 46,050 bytes unpacked, no bundled dependencies. A clean temporary consumer installed that tarball and passed CommonJS API and ESM `importCapsule()` validation smoke tests.
- Local `verify-url.sh` passed: title, `lang=en`, one h1, main landmark, image alt, no unlabeled buttons, no browser errors (623ms load).

### Deployed-site verification

The factory static deployment command was:

```sh
/opt/fleet/lib/deploy-static.sh browser-game-replay-capsule ./dist/site
```

Live URL: https://browser-game-replay-capsule.sociobot.in

- Live `verify-url.sh`: HTTP 200, 831ms load, no browser errors; title/lang/h1/main/alt checks pass.
- Live `index.html` SHA-256 is `48a744497aee68421f538240df65f34cace2c66357f9ddd83acdd55290ac1204`, exactly matching `dist/site/index.html`.
- Live `assets/main-ChkmmLtU.js` SHA-256 is `c89d8711ff69f09df95abfafe16cd7f307f7942953bed009d1c6ec1396a190c1`, exactly matching the production build. Its response is `Cache-Control: public, max-age=31536000, immutable`; root HTML is short revalidated (`public, must-revalidate, max-age=30`).
- Root and asset responses retain CSP (`default-src 'self'` and `frame-ancestors 'none'`), `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `X-Frame-Options: DENY`, MIME sniffing protection, strict-origin referrer policy, and HSTS.
- Live Chromium smoke at 1440×900 and 390×844: no console/page errors, no overflow, empty local/session storage, zero cookies, and keyboard focus reaches the real import input while its visible label has a 3px focus ring.
- Lighthouse 13.4.1 mobile/default live run: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.4s, LCP 1.4s, TBT 40ms, CLS 0, transfer 95 KiB.

There is intentionally no service worker or storage: this static documentation/demo app works offline after it is loaded and its hashed assets make updates safe without stale asset collisions. No telemetry, analytics, cookies, third-party runtime requests, or CDN fonts/scripts were added.

### Package publication (factory-owned remaining operation)

The prior verifier correctly found that npm registry installation of `@sociobot/replay-capsule@0.1.1` returned E404. This repair increments the ready-to-publish package to `0.1.2`; the factory owns the registry credentials and the attached library-publishing rules prohibit this worker from publishing. Publish the already-verified tarball through the factory workflow, then confirm:

```sh
npm install --ignore-scripts @sociobot/replay-capsule@0.1.2
```

No other product or deployment gap remains. The package is prepared with `npm pack --json`; do not use a local-path install as the release proof.

### Known product limits

- Determinism still requires the integrating game to seed all relevant randomness and avoid nondeterministic external state; checkpoints expose divergence but cannot correct it.
- Browser gamepad timestamps are diagnostic only; replay uses observation timing. Pointer coordinates normalize only when the configured target is an `Element`.
