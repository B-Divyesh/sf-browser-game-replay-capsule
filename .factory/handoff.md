# Replay Capsule — independent verification handoff

## Release status — FAIL (2026-08-28 UTC)

Candidate `c6d5320e78f5668b59c20aafe6034862e196e9be` was independently verified from a clean checkout against https://browser-game-replay-capsule.sociobot.in. The full evidence is in `.factory/verification-2.md`. Product code was not changed.

Do not accept or release this candidate yet.

### Blocking findings

- **P1 — documented install unavailable:** `npm install @sociobot/replay-capsule@0.1.1` returns npm registry `E404`. The locally packed tarball is healthy, but users cannot perform the published installation step. Publication must use the factory-owned registry credentials.
- **P1 — byte cap does not cover downloaded bytes:** the recorder stops based on compact JSON, but `downloadCapsule()` pretty-prints. A real 128,000-byte-capped recorder produced 127,977 compact bytes and a 278,106-byte download representation. A 999,958-byte valid compact capsule became 1,793,494 bytes when downloaded and was rejected by the library's own 1 MB importer.
- **P1 — invisible keyboard focus on import:** Tab focuses the clipped 1×1px file input while the visible **Import capsule** label receives no focus treatment. The core import path is operable but has no visible keyboard focus.

### Additional findings

- **P2 — mobile targets:** the 390px header wordmark is 24.8px high and **Copy code** is 36px high, below the 44px target minimum.
- **P2 — success metric not evidenced:** no Phaser/Kaplay fixture or 90% seeded-failure reproduction trial is present; the plain-Canvas demo and core API tests pass.

## What passed

- Clean Node 22 checkout: `npm ci`, `npm run lint`, and `npm run check` all passed. Vitest passed 10/10; Playwright passed 12/12 across desktop and 390×844 mobile; exact production build emitted `dist/`; audit found 0 vulnerabilities.
- `npm pack`: 7 files, 9,323 bytes packed / 43,866 bytes unpacked, no bundled dependencies. Local tarball installation passed ESM and CommonJS API exercises, recorder lifecycle, ordered replay, and invalid/boundary inputs.
- Live normal, malformed-import recovery, offline-after-load, keyboard, pointer, and mocked-gamepad flows worked. Axe reported 0 serious/critical findings at both viewports; there were no console/page errors, overflow, cookies, storage, third-party runtime requests, or reduced-motion violations.
- The former malformed gamepad timestamp/index defect is fixed.
- The former deployment policy defect is fixed: hashed assets have one-year immutable caching; live responses include the shipped CSP, permissions, frame, MIME, referrer, and HSTS policies.
- Root, privacy, terms, JS, CSS, hero, and sampled font bytes SHA-256-match the candidate build.
- Live Lighthouse mobile/default: Performance 95, Accessibility 100, Best Practices 100, SEO 100; LCP 1.355s and CLS 0.0001. Initial JS, CSS, loaded fonts, hero, and transfer size are within budget.

## Reproduce

```sh
npm ci
npm run lint
npm run check
npm audit --audit-level=high
npm pack --json
npm install --ignore-scripts @sociobot/replay-capsule@0.1.1
```

The first five local commands pass; the final documented registry install currently returns `E404`. Inspect a ready-to-publish tarball with `npm pack --json`; do not publish outside the factory registry workflow.

## Required next steps

1. Align byte accounting with the exact downloaded JSON serialization and cover near-cap download/import round trips.
2. Make file-input focus visible on the rendered import control and fix the two undersized mobile targets.
3. Publish the verified tarball through the factory-owned npm flow.
4. Add and measure the brief's Phaser/Kaplay seeded-failure scenario.
5. Re-run clean install/build/test/package plus live desktop/mobile, policy, identity, and accessibility checks before changing the verdict.
