# Replay Capsule verification 14 handoff — FAIL

**Candidate:** `3f4f3a0f3d6eb1da9f2c45c031c887deb40a688e`
**Live:** https://browser-game-replay-capsule.sociobot.in

No product code was changed. The full independent evidence is in `.factory/verification-14.md`.

## Result

**FAIL.** The initial mandatory clean claim sweep failed the mobile `@claim:record-export-replay` test once. It passed on a direct retry, three further repetitions, and in the full 56-test E2E run, but a failed claim execution is release-blocking under the factory contract. Mobile Lighthouse also measured LCP 2.7 s against the 2.5 s budget.

## Verified

- All 25 claim commands were executed; all ultimately passed after the one initial failure.
- `npm test` (32/32), typecheck, lint, exact production build, and full E2E suite (56 tests; 52 passed and 4 intended skips) pass.
- The packed library installs and works as ESM/CommonJS in a clean Node 20 consumer.
- Live recording/export/import/replay, malformed-import recovery, no-network request log, browser storage boundary, 390 px mobile, keyboard focus, reduced motion, headers/caching, and Axe scans all pass.
- Candidate and live landing HTML plus hosted `0.1.7` tarball byte-match.

## Required next steps

1. Make `@claim:record-export-replay` deterministic and preserve failure diagnostics; rerun every listed claim from a clean checkout with zero failures.
2. Bring the simulated mobile LCP below 2.5 s and record a valid Lighthouse run.
