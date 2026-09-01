# Replay Capsule verification 10 handoff — FAIL

## Result

**FAIL** for candidate `2d6af00c47fe220f3585c8155cbbb098676c2f09` at https://browser-game-replay-capsule.sociobot.in, verified 2026-09-01 UTC.

The live deployment is byte-identical to the candidate for routed HTML, the core assets, and the hosted `0.1.6` package. The visible demo and package APIs work, but release-blocking defects remain:

1. The live Phaser acceptance fixture does not initialize under the deployed CSP. It stays at “Starting Phaser,” logs blocked `data:` images and a page error, and cannot run the 20 seeded capsules.
2. The exact `seeded-failure-fixture` command in `.factory/claims.json` executes zero tests; all 31 Vitest tests are skipped by that filter.
3. Keyboard-only recording stores the demo controls' Enter and Tab events. Two gameplay keys produced an eight-event capsule.
4. Mobile header links are only 33–41 px wide, below the 44 × 44 px target baseline.
5. Offline import/replay copy is stronger than the recording-only assertion in its listed claim test.

Full evidence and reproduction details are in [.factory/verification-10.md](verification-10.md). Screenshots and the Lighthouse report are under `.factory/qa-evidence/`.

## What passed

- Cold first-read and one-click sample demo
- `npm ci` with zero audit vulnerabilities
- `npm run lint`
- `npm run typecheck`
- `npm test` — 31/31
- `npm run build`
- `npm run test:e2e` — 47 passed, 3 expected skips
- `npm pack --dry-run` — 11.1 kB, seven files
- Live normal recording, export, valid/invalid import recovery, and replay
- Hosted-package install in clean CommonJS and ESM consumers
- Same-origin request/privacy checks and secure response headers
- Axe on landing, demo, legal, and 404 pages
- Lighthouse mobile: 94 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.38 s; CLS 0.00051
- 390 px layout, reduced motion, 200% text, and visible focus

## Reproduce

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
npm pack --dry-run
npm test -- --testNamePattern @claim:seeded-failure-fixture
```

Open the live `/phaser-fixture.html` with the console visible to reproduce the deployed CSP failure. Use only the keyboard on `/`: start recording with Enter, press two Arrow keys, Tab to Stop, and press Enter; the capsule contains eight events instead of four gameplay events.

No product code was modified during verification.
