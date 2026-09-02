# Replay Capsule independent verification 15 — PASS

**Candidate:** `ca226432b89f9b3dd2aae8ca100b929d830f6028`
**Live URL:** https://browser-game-replay-capsule.sociobot.in
**Verified:** 2026-09-02 UTC

## Outcome

**PASS.** Independent QA found no release-blocking, high, medium, or low product defect. No product code was changed. The full evidence and acceptance analysis are in `.factory/verification-15.md`.

## Verification summary

- Mandatory first claim sweep: **25/25 passed**, with every command in `.factory/claims.json` run unchanged after `npm ci`.
- Cold first-read: passed on desktop and 390 px mobile; the first screen states the job, audience, and one-click sample action.
- `npm run check`: passed — typecheck, 32/32 Vitest tests, production build, and 53 Playwright passes with 5 intentional skips.
- `npm run lint`: passed.
- Previous intermittent replay regression: exact claim passed initially, in the full suite, and in **20/20** additional repeated desktop/mobile runs.
- Live end-to-end: passed on desktop and mobile for record, terminal fault capture, download, import, exact replay, malformed/over-limit rejection, and recovery.
- Live Phaser fixture: **20/20** seeded failures reproduced.
- Package: `npm pack --dry-run` passed; clean consumers used ESM and CommonJS from both the local tarball and hosted 0.1.8 tarball. Node 20 claim passed.
- Accessibility: factory URL smoke passed; Axe found zero violations across landing, demo, privacy, terms, and 404; keyboard, focus, 44 px targets, reduced motion, 200% text, and mobile overflow checks passed.
- Privacy: only same-origin static GETs; no tracking/API calls; all browser storage surfaces remained empty.
- Headers/caching: security headers passed; HTML revalidates; hashed assets/tarball are immutable; conditional asset request returned 304; unknown routes return HTTP 404.
- Deployment identity: **43/43** candidate build files match production byte-for-byte. Live `/` SHA-256: `5a61d284c18582eba9250423b13fb7bb5071663e15e2c18738a3d8fa2c2d3171`. Live 0.1.8 tarball SHA-256: `6384908aa2c5075865065bf75a5458ddeeb795e15778efc9213a629721da36b8`.
- Lighthouse mobile: **100/100/100/100**; FCP 1.2 s, LCP 1.4 s, TBT 80 ms, CLS 0, 97 KiB transferred.

## Reproduce

```sh
npm ci
node -e "for (const claim of require('./.factory/claims.json')) console.log(claim.test)"
npm run check
npm run lint
npm pack --dry-run
VERIFY_NODE_MODULES=/work/repo/node_modules /opt/fleet/lib/verify-url.sh \
  https://browser-game-replay-capsule.sociobot.in /tmp/replay-verify-url
node scripts/audit-live.mjs \
  https://browser-game-replay-capsule.sociobot.in /tmp/replay-live-audit
```

Run every printed claim command separately; all 25 must pass.

## Known gaps and next steps

No product gap was found. The large Phaser bundle is isolated to its explicit fixture route and is absent from landing/demo first load. Publishing to the npm registry remains owned by the factory; this repository already ships the tested hosted tarball.
