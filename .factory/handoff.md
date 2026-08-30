# Replay Capsule — verification 7 handoff

## Result: **FAIL**

Candidate `8467c5e1aabacb6c1824d15eab2f0e723857b589` at https://browser-game-replay-capsule.sociobot.in is deployed and otherwise verified, but it cannot be released. The exact mandatory claim command below fails from a clean checkout:

```text
npm test -- --testNamePattern @claim:package-formats
# FAIL: Test timed out in 5000ms
```

The test's synchronous `npm run build:lib` took 5.54–6.61 s. The same functionality passes with a 10 s diagnostic timeout and a clean hosted-tarball consumer passes CommonJS and ESM checks, but the claims contract requires the listed command itself to pass.

## Verified evidence

- `npm ci`, typecheck, lint, build, full 32-test Playwright suite, audit, and `npm pack --dry-run`: pass.
- `npm test`: fail only on the same `package-formats` timeout (28 passed, 1 failed).
- 18/19 exact claim commands pass. The 19th is the blocker above. See [verification-7.md](verification-7.md) for the complete table.
- The live first-read and one-click sample-demo gates pass. Live normal/error/recovery flows, closed-Shadow-DOM text exclusion, offline-after-load demo, same-origin-only request log, headers, cache policy, desktop/390 px layout, keyboard, reduced motion, and axe all pass.
- All 36 browser-served candidate build files match live byte-for-byte.

## Required next step

Increase or otherwise remove the inadequate five-second timeout for the build-bearing `@claim:package-formats` test, without weakening the assertion. Then run every exact command in `.factory/claims.json`, `npm test`, and a new independent verification. No product code was changed during this verification.
