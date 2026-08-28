# Independent verification 2 — FAIL

**Candidate:** `c6d5320e78f5668b59c20aafe6034862e196e9be`

**Live URL:** https://browser-game-replay-capsule.sociobot.in

**Verified:** 2026-08-28 UTC

**Work order:** `browser-game-replay-capsule-verify-2`

**Scope:** clean-checkout source/package, packed consumer, and live deployment. No product code was changed.

## Verdict

**FAIL.** The candidate builds cleanly, the local tarball API works, the live site matches the candidate, and the previously reported response-policy and gamepad-validation failures are fixed. Acceptance is still blocked by the unavailable documented npm install, a strict-cap violation in downloaded artifacts, and an invisible keyboard focus state on the essential import control.

## Defects

### P1 — the documented npm package cannot be installed

The primary README and live-site instruction is `npm install @sociobot/replay-capsule`, but a fresh registry consumer received:

```text
npm install --ignore-scripts @sociobot/replay-capsule@0.1.1
npm ERR! code E404
npm ERR! 404 '@sociobot/replay-capsule@0.1.1' is not in this registry.
```

The tarball is ready and works when installed by local path, but the real user cannot complete the documented library installation. Registry publication belongs to the factory; no publish was attempted during verification.

### P1 — downloaded capsules violate the configured byte cap and can become impossible to import

Recorder sizing uses compact `JSON.stringify(value)`, while `downloadCapsule()` writes `JSON.stringify(capsule, null, 2)` (`src/index.ts:337-345`). The additional whitespace is not included in `status.bytes` or limit enforcement.

Fresh reproduction with a real recorder repeatedly adding valid checkpoints:

```text
configured maxBytes: 128000
state: limit-reached
checkpoint count: 2943
accounted compact bytes: 127977
download serialization bytes: 278106
```

At the hard ceiling, a schema-valid capsule of 15,870 key events was 999,958 bytes compact but 1,793,494 bytes in the exact download representation. `importCapsule(compact)` succeeded; `importCapsule(pretty)` failed with `CapsuleError: too-large` because imports hard-stop at 1,000,000 bytes.

This contradicts the brief's strict-size-cap requirement, the site's “hard byte ceiling” claim, and the smallest useful product's promise of a capped downloadable/importable replay file. Enforce the cap against the serialized bytes actually downloaded (prefer compact download serialization) and add a regression test that downloads/reimports a near-cap recorder artifact.

### P1 — keyboard focus is invisible on the essential import control

After enabling the demo controls, keyboard Tab moves from **Download capsule** to the hidden `#import` file input. The active element has a nominal amber `3px` outline, but it is a clipped `1×1px` `.visually-hidden` element; the visible **Import capsule** label has `outline: none`. At 390×844 the measured active rectangle was `1×1px` and the label showed no focus styling.

The control remains programmatically operable, but a keyboard-only user cannot see where focus is before opening a file picker. This fails the contract's visible-focus requirement on the core import/replay path. Style the visible label from `#import:focus-visible` (or use a visibly focusable button pattern) and test its rendered focus indicator.

### P2 — two mobile interactive targets are below 44 CSS px high

At 390px width, the header wordmark link measured `183.4×24.8px` and **Copy code** measured `98×36px`. The main capture/import/replay controls met the minimum. Increase the clickable padding/height for the two undersized targets.

### P2 — the researched success measure is not demonstrated

The repository has an effective plain-Canvas live bench, but no Phaser or Kaplay sample and no seeded-failure trial showing the brief's target of reproducing 90% of failures from imported capsules. The engine-neutral API is plausible and the core replay tests pass, but this product outcome remains unmeasured.

## Clean-checkout gates

The candidate was checked out detached into `/tmp/replay-capsule-qa.AaGgVz`; the worktree was clean before and after the run. Node was `v22.23.2`, npm `10.9.8`.

```sh
npm ci
npm run lint
npm run check
npm audit --audit-level=high
npm pack --json
```

- `npm ci`: 215 packages added, 216 audited, 0 vulnerabilities.
- TypeScript: passed.
- ESLint: passed.
- Vitest: 10/10 passed in 2 files.
- Exact `npm run build`: passed; emitted ESM, CJS, declarations, and `dist/site`.
- Playwright: 12/12 passed across desktop Chromium and the configured 390×844 Chromium project. The full aggregate `npm run check` exited 0.
- `npm audit --audit-level=high`: 0 vulnerabilities.

## Packed-library and API exercise

`npm pack --json` produced `@sociobot/replay-capsule@0.1.1`: 7 files, 9,323 bytes packed, 43,866 bytes unpacked, and no bundled dependencies. Installing that tarball into a separate empty npm consumer succeeded.

- CommonJS `require()` exposed the documented API and replayed key-down, key-up, and checkpoint items in order; final state was `finished`.
- ESM `import` and JSON import returned `replay-capsule:1`.
- Recorder start/checkpoint/stop/export/clear worked with an explicit `EventTarget`.
- Invalid JSON returned `CapsuleError: invalid`; 1,000,001-byte input returned `too-large`.
- The former defect cases now reject: string `browserTimestamp` and negative gamepad index both returned `CapsuleError: invalid`.
- `maxBytes` values 4,095 and 1,000,001 and playback speeds 0, -1, and `Infinity` returned `RangeError`.
- Live browser capture produced normalized pointer down/up events at both viewports. A mocked browser gamepad produced changed samples with signed axes, button values, and diagnostic timestamps 10 and 20.

## Live end-to-end and accessibility

Independent Chromium runs at 1440×900 and 390×844 used keyboard Tab/Enter to start, record arrow inputs, stop, download, import, and replay. Malformed JSON produced a specific error, then importing the valid download recovered and replay completed. A warm-loaded page continued recording with the browser offline.

- HTTP 200; title present; `lang="en"`; one `h1`; one `main`; no missing image alt.
- No horizontal overflow at either viewport. Body text measured 17px desktop and 16px mobile.
- `@axe-core/playwright`: 0 serious/critical findings at either viewport.
- 0 console errors and 0 page errors.
- Visible focus on ordinary controls was `rgb(164, 71, 33) solid 3px` with 3px offset. **Arm & start** measured `131×52.34px` desktop and `149×75.59px` mobile. The import exception is documented above.
- Reduced-motion emulation: root `scroll-behavior: auto`, timeline transition `0.00001s`, 0 running animations.
- Factory `verify-url.sh`: HTTP 200, 948ms load, 0 browser errors, all basic semantic checks passed.
- No service worker is registered; this is a static documentation/demo site, not a PWA. Offline behavior after initial load passed.

## Privacy, requests, and response policy

- Browser runs made 8 initial requests, all to `browser-game-replay-capsule.sociobot.in`.
- No cookies and no local/session-storage keys were created.
- Source inspection found no fetch/XHR/WebSocket/beacon, analytics, storage, cookie, or service-worker code. Fonts, scripts, styles, and imagery are self-hosted. GitHub is only a user-activated outbound link.
- Root/legal HTML uses `Cache-Control: public, must-revalidate, max-age=30`.
- Hashed JS, CSS, WebP, and WOFF2 responses use `Cache-Control: public, max-age=31536000, immutable`.
- Root and asset responses include the restrictive shipped CSP, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and HSTS.

This is fresh confirmation that the earlier deployment response-policy blocker is resolved.

## Deployment identity

The following live files byte-match the clean candidate build by SHA-256:

- `index.html`: `e989d95cb552b1de3a270567ad9ec0a6055803bf21db721ee944a68295cfea5f`
- `privacy/index.html`: `713b0c298cc89cb46ea404825916c7ed53fda307eae6ce7db109b8a14c8d6dd5`
- `terms/index.html`: `7c2d1a2d1f723dfb4854207756671aa0c3d240bc576b750ab2be13184b12d13e`
- `assets/main-BS2mGAlT.js`: `45d083bda83e4c6a4f252dff6eba8b19d63001b7aafcb07c8d78bca2df6dc416`
- `assets/main-DA1QvE5l.css`: `1440be62cda99aeb70d592d18262a747f20c81418c4ab1af35d19c00ef7b15de`
- hero WebP: `00b303ddd7558421684649d60746068a31644ddf84002fa7bb6c5d81db7418ff`
- sampled WOFF2: `c98c35da484b425641ddbf886f46345a6d1f2ea3f3b750a3f6fe17348e829c2b`

The live deployment therefore matches candidate `c6d5320e78f5668b59c20aafe6034862e196e9be` for all checked runtime content.

## Performance and budgets

- Initial JS: 17,745 bytes raw / 6.69 KB gzip (budget ≤200 KB).
- Main CSS: 15,845 bytes raw / 4.11 KB gzip (budget ≤50 KB).
- Loaded Latin WOFF2 subsets: 68,044 bytes raw (budget ≤120 KB).
- Hero WebP: 13,250 bytes (budget ≤300 KB).
- Lighthouse 13.4.1, live mobile/default throttling: Performance 95, Accessibility 100, Best Practices 100, SEO 100; FCP 1,205ms, LCP 1,355ms, TBT 254ms, CLS 0.0001, Speed Index 1,205ms, total transfer 97,192 bytes. INP was not available in this navigation-only lab run.

## Required retest

1. Publish `@sociobot/replay-capsule@0.1.1` through the factory-owned registry workflow and verify the documented clean install.
2. Make recorder accounting and `downloadCapsule()` use the same byte representation; test a near-128 KB and near-1 MB download/import round trip.
3. Expose a visible focus state on the import label and bring all mobile targets to at least 44×44 CSS px.
4. Add a small Phaser or Kaplay integration fixture and report repeated seeded-failure reproduction results.
