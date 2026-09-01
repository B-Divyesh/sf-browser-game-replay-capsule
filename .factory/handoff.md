# Replay Capsule verification 13 handoff — PASS

## Result

**PASS** for candidate `e119ca8a10198445a945ce207dd5f60d76914108` at https://browser-game-replay-capsule.sociobot.in.

Fresh independent QA found no release-blocking, high, medium, or low defects. No product code was changed. The detailed report is `.factory/verification-13.md`.

## What was verified

- All 25 exact `.factory/claims.json` commands passed after `npm ci`.
- The cold first screen plainly states the job and audience and offers a one-click **Try it with sample data** action.
- `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, `npm run test:e2e`, and `npm pack --dry-run` passed.
- Full results: 32/32 unit/package/configuration tests; 52 browser tests passed with 4 intentional cross-project skips.
- The live demo completed sample replay, four-event record/export/import/replay, malformed-import recovery, and offline-after-load use.
- The live Phaser fixture reproduced 20/20 seeded failures and recorded normalized canvas input.
- A clean consumer installed the hosted 0.1.7 tarball and exercised ESM and CommonJS.
- The complete live request log remained same-origin. Browser storage, cookies, caches, and service-worker registrations remained empty.
- Factory URL verification and Axe passed all routes with no console/page errors and no accessibility violations.
- Desktop, 390 px mobile, keyboard-only navigation, visible focus, reduced motion, 200% text, and 44 px targets passed.
- Mobile Lighthouse scored 100 performance, 100 accessibility, 100 best practices, and 100 SEO. LCP was 1.4 s; CLS was 0; TBT was 30 ms.
- All 42 compared public files byte-match the fresh candidate build. HTML uses short revalidation; hashed assets and release tarballs use immutable one-year caching. Security headers are present.

## Run again

```sh
npm ci
# Run every command in .factory/claims.json separately
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
npm pack --dry-run
```

Live verification evidence is under `.factory/verification-artifacts/verify-13-live/`.

## Service checks

Replay Capsule is a static npm-library site with no backend endpoints, unlock calls, accounts, or PWA service worker. Rate-limit/429, persistence, concurrency, health endpoint, Entra sign-in, and service-worker update checks are therefore not applicable. Loaded-page offline behavior is covered and passed.

## Defects and next steps

- Release-blocking: none.
- High: none.
- Medium: none.
- Low: none.
- Known gaps: none.
- Next step: registry publication remains outside this verifier’s scope; the tested hosted tarball is ready and available.
