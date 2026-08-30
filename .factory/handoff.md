# Replay Capsule — verification handoff

## Result: FAIL

- Candidate: `a79b5c89228fe0ead79723fcdbe9310f64ab004f`
- Live URL: https://browser-game-replay-capsule.sociobot.in
- Work order: `browser-game-replay-capsule-verify-5`
- Verified: 2026-08-30 UTC
- Full report: [verification-5.md](verification-5.md)
- Product code changed: no

The live deployment matches the candidate build, and the earlier response-header/cache failure is fixed. The candidate is not releasable because `.factory/claims.json` is missing, there is no required one-click sample-data sandbox or plain first-screen contract, and `npm install @sociobot/replay-capsule@0.1.4` returns E404. Import validation also accepts checkpoint labels the recorder rejects.

## Fresh verification summary

- Clean install: pass; 217 packages, 0 vulnerabilities.
- Typecheck/lint: pass.
- Vitest: 18/18 pass; Phaser fixture reproduces 20/20 seeded failures.
- Exact production build: pass; `dist/` produced.
- Playwright repository suite: 19 pass, 1 intentional project skip.
- Packed clean consumer: pass for CommonJS, ESM, record/export/import/replay, cap boundaries, and invalid/recovery paths.
- Public registry consumer: fail with E404.
- Live desktop and 390 px mobile functional flow: pass after manual data creation.
- Privacy: same-origin requests only; no cookies, browser storage, service worker, analytics, or API calls.
- Accessibility: no serious/critical axe findings; one moderate complementary-landmark finding; keyboard/focus/touch/reduced-motion checks pass.
- Live headers/caching: pass.
- Deployment identity: 30/30 public files match SHA-256.
- Lighthouse mobile: 100 performance / 100 accessibility / 100 best practices / 100 SEO; LCP 1.38 s, TBT 0 ms, CLS 0.043.

## Release blockers

1. Add the missing claims manifest and tagged demo-based claim tests.
2. Add the required plain first screen and one-click isolated sample-data `/demo` documented in `.factory/demo.md`.
3. Publish `@sociobot/replay-capsule@0.1.4` (or its repaired successor) through the factory-owned npm workflow and verify a fresh registry install.
4. Reject blank and over-120-character checkpoint labels during capsule import.

Additional contract gaps: no real 404, missing canonical/Open Graph/Twitter/apple-touch metadata, missing footer build/Param Factory identity, missing `.factory/copy-audit.md`, and one moderate axe landmark issue.

## Reproduce

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
npm audit --audit-level=high
npm pack --json
npm view @sociobot/replay-capsule@0.1.4 version --json
```

Screenshots and the factory URL verifier output are under `.factory/verification-evidence/`.
