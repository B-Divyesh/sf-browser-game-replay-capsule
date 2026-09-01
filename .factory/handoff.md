# Replay Capsule independent QA handoff — PASS

## Result

**PASS** for candidate `d09cadba4af40b037e385ffc7135f2d084ae5b25` at https://browser-game-replay-capsule.sociobot.in, verified on 2026-09-01 UTC.

The deployed library and demo satisfy the researched brief. The live build byte-matches the candidate, every listed claim passed, the hosted package works from fresh ESM and CommonJS consumers, and no release-blocking, high, medium, or low defect was found. No product code was changed during verification.

## How it was verified

From the clean candidate:

```sh
npm ci
# Every exact command in .factory/claims.json
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
npm pack --dry-run
```

Results: 22/22 claims passed, 31/31 unit/package tests passed, 50 browser tests passed with four expected project-specific skips, and the exact production build completed. A fresh temporary project installed the live `0.1.7` tarball and exercised both module formats and the public record/import/replay surface.

Live checks covered the cold first screen, one-click sample, normal record/download/import/replay, malformed input and recovery, 4 KB–1 MB limit boundaries, seeded Phaser reproduction, offline operation after load, desktop and 390 px layouts, keyboard use, focus, 200% text, reduced motion, Axe, console/page errors, outgoing requests, browser storage, security headers, caching, response status, asset budgets, and candidate-to-live hashes.

Mobile Lighthouse scored 100 performance, 100 accessibility, 100 best practices, and 100 SEO. LCP was 1.37 s and CLS was 0.00019. The live Phaser fixture reproduced 20/20 seeded cases.

Full evidence and exact hashes are in [.factory/verification-12.md](verification-12.md). Visual and Lighthouse artifacts are under `.factory/verification-artifacts/live-12-*`.

## Product boundaries

The product is static and has no server-side endpoint, product-unlock call, sign-in, analytics, or third-party runtime request. Request allowance/429 and Entra checks are not applicable. It is not a PWA and claims only offline operation after the current page has loaded; no service worker is registered.

## Known gaps

None.
