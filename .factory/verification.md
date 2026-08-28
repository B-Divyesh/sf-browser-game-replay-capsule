# Independent verification — FAIL

**Candidate:** `1dabb6fa189282233dac9fc19d76cef6da32b689`  
**Live URL:** https://browser-game-replay-capsule.sociobot.in  
**Verified:** 2026-08-28 (UTC)  
**Scope:** clean-checkout package, production site, packed consumer, and live deployment. Product code was not changed.

## Result

**FAIL.** The built library and site work for the primary record → export → import → replay path, and the live HTML/JS/CSS/image bytes match this candidate. Acceptance is blocked by one deployment response-policy/caching defect and one public-input validation defect.

## Blocking defects

### P1 — live deployment does not apply the shipped security/cache policy

The candidate ships `site/public/_headers`, which requests immutable caching for `/assets/*` and `X-Frame-Options: DENY` plus a restrictive `Permissions-Policy` for all paths. The production host does not deliver those policies.

Fresh `curl` evidence at the live URL:

- `/`, `/assets/main-DpwrdKnB.js`, `/assets/main-DA1QvE5l.css`, the hero WebP, and a WOFF2 font all return `Cache-Control: public, must-revalidate, max-age=30`. Hashed, immutable assets must have long-lived immutable caching under the performance contract; the required policy is not effective.
- The responses include HSTS, `Referrer-Policy`, and `X-Content-Type-Options`, but omit `X-Frame-Options` and `Permissions-Policy`; no Content-Security-Policy is sent either.

This is deployment configuration/hosting behavior rather than an HTML byte mismatch: the root, privacy, and terms HTML documents, main JS, main CSS, and hero image each SHA-256-match the locally built candidate exactly. Configure the deployment to honor equivalent response headers and redeploy, then recheck the URL.

### P2 — malformed gamepad diagnostic metadata is accepted at import

`validateCapsule()` accepts an event with `browserTimestamp: "not-a-number"`:

```js
validateCapsule({
  format: 'replay-capsule', version: 1,
  createdAt: '2026-08-28T00:00:00.000Z', durationMs: 0,
  seed: 0, truncated: false, checkpoints: [],
  events: [{ type: 'gamepad', index: 0, connected: true,
    axes: [], buttons: [], browserTimestamp: 'not-a-number', t: 0 }]
}) // accepted
```

The public `ReplayEvent` type declares this optional field as `number`, while the README promises schema-validated imports that reject malformed files. Validate it as a finite number when present (and reject malformed gamepad index values as appropriate), then add a regression test.

## Passing evidence

### Clean checkout and package

Executed from a clean checkout at the candidate revision:

```sh
npm ci
npm run typecheck
npm test
npm run build
npm pack --dry-run
npm run test:e2e
```

- `npm ci`: 102 packages audited; 0 vulnerabilities.
- Typecheck passed. There is no lint script configured in `package.json`.
- Vitest: 8/8 passed.
- Exact production build passed: library ESM/CJS/declarations plus static `dist/site`.
- Playwright: 10/10 passed across desktop Chromium and the configured 390×844 mobile viewport.
- `npm pack --json`: 7 files, 9,069-byte tarball, 42,950-byte unpacked, no bundled dependencies.
- Installed that tarball into a separate `mktemp` npm consumer. Both CommonJS `require()` and ESM `import` resolved the public package; CJS replay emitted `ArrowRight,done`, and ESM `importCapsule()` returned `replay-capsule 1`.

### End-to-end browser exercise (live URL)

On desktop 1440×900 and mobile 390×844 Chromium, independently exercised:

- keyboard Tab navigation to `Arm & start` (9 tabs desktop, 7 mobile), Enter activation, ArrowRight/ArrowUp input, stop, local download, replay, and malformed JSON import recovery;
- visible focus: `rgb(164, 71, 33) solid 3px`; control sizes were 131×52px desktop and 149×76px mobile;
- normal keyboard run retained 5 events (the Enter keyup used to arm plus Arrow key down/up pairs) and replay completed; no horizontal overflow at either size;
- `@axe-core/playwright`: 0 serious/critical violations on both viewports;
- 0 console errors and 0 page errors;
- only `https://browser-game-replay-capsule.sociobot.in` was requested; no cookies, localStorage, or sessionStorage keys were created;
- reduced-motion emulation produced `scroll-behavior: auto`, a near-instant `0.00001s` timeline transition, and 0 running animations.

The repository Playwright suite separately covers text-field exclusion, legal pages, semantic title/lang/main/h1/image alt, desktop/mobile overflow, malformed input recovery, and the capture/download/replay flow. The source and delivered site contain no analytics, persistence, or third-party runtime URL; GitHub is only an outbound user-activated source link.

### Boundary and invalid-input checks

- Recorder rejects `maxBytes` 4,095 and 1,000,001 with `RangeError`; supported bounds are 4,096–1,000,000.
- Empty and 121-character checkpoint labels reject with `RangeError`; checkpointing after stop returns `false`.
- Importing 1,000,001 bytes rejects with `CapsuleError` code `too-large`.
- Existing tests verify fail-closed 4 KB recorder caps, non-JSON checkpoint rejection, oversized seed rejection, malformed JSON, unsupported versions, signed gamepad axes, and player stop/order behavior.

### Budget and delivered identity

- `dist/site` initial JS: 17,644 bytes raw (well below 200 KB); main CSS: 15,845 bytes raw (below 50 KB); hero WebP: 13,250 bytes.
- The live root, privacy, and terms HTML, main JS, main CSS, and hero image all SHA-256-match this local production build. The public deployment is therefore serving this candidate’s artifact content, despite the failed response-policy configuration.

## Required next verification

1. Make production serve immutable caching for hashed `/assets/*` and the intended clickjacking/permissions policy (and add a CSP suitable for this static app).
2. Reject invalid optional `browserTimestamp` values in capsule validation and add a test.
3. Rebuild/redeploy, then rerun the live header checks and the packed-consumer/browser suites before changing this result to PASS.
