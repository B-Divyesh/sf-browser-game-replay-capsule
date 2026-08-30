# Independent verification 7 — FAIL

**Candidate:** `8467c5e1aabacb6c1824d15eab2f0e723857b589`  
**Live URL:** https://browser-game-replay-capsule.sociobot.in  
**Verified:** 2026-08-30 UTC  
**Work order:** `browser-game-replay-capsule-verify-7`

## Verdict

**FAIL — release blocked.** The candidate is deployed and the actual library/package/demo work correctly in the checks below, but the required claim command for `package-formats` fails from a clean checkout. The acceptance contract explicitly makes any failed claim test release-blocking.

## Release-blocking finding

### P1 — required `package-formats` claim test times out

After `npm ci`, the exact required command failed twice:

```text
npm test -- --testNamePattern @claim:package-formats
Test timed out in 5000ms.
```

The test invokes `npm run build:lib` synchronously and has Vitest's default five-second test limit. It took 5.54 s on the first claim run and 6.61 s during the complete `npm test` run. The package format functionality itself is healthy: the same test passed in 5.56 s when run diagnostically with `--testTimeout=10000`, and a clean consumer installed the hosted tarball and exercised both CommonJS and ESM. That does not repair the exact listed claim command. This is an automation-time-budget defect, not evidence of a deployment-only failure.

Required repair: make the exact claim command reliable on a clean checkout (for example, give this build-bearing test an explicit adequate timeout), then rerun all claim commands and this verification.

## Mandatory opening gates

The checkout was clean at the specified candidate before installation:

```text
## main...origin/main
8467c5e1aabacb6c1824d15eab2f0e723857b589
```

`.factory/claims.json` exists and declares 19 claims. Each exact command was run independently after `npm ci`:

| Claim | Result |
| --- | --- |
| `sample-demo` | pass — 2 Playwright projects |
| `no-network-calls` | pass — 2 Playwright projects |
| `opt-in-recording` | pass — 2 Playwright projects |
| `text-entry-excluded` | pass — 2 Playwright projects |
| `record-export-replay` | pass — 2 Playwright projects |
| `checkpoint-capture` | pass — 1 Vitest test |
| `default-byte-cap` | pass — 1 Vitest test |
| `custom-cap-range` | pass — 1 Vitest test |
| `validated-import` | pass — 1 Vitest test |
| `pointer-normalization` | pass — 2 Playwright projects |
| `gamepad-sampling` | pass — 1 Vitest test |
| `adapter-callbacks` | pass — 1 Vitest test |
| `replay-controls` | pass — 1 Vitest test |
| `seeded-failure-fixture` | pass — 1 Vitest test |
| `package-formats` | **FAIL — 5 s timeout** |
| `installable-release` | pass — 1 Vitest test |
| `zero-runtime-dependencies` | pass — 1 Vitest test |
| `offline-demo` | pass — 2 Playwright projects |
| `mit-license` | pass — 1 Vitest test |

The cold live first screen passes the plain-words and demo gates. It says what it does (“Replay browser-game bugs from a small file”), who it serves (“solo 2D game developers…”), and what to do first. The visible first action is **Try it with sample data**, alongside “Loads a seeded bug run you can replay.” The CTA is a working one-click link to `/demo/`.

## Clean-checkout quality gates

| Gate | Result |
| --- | --- |
| `npm ci` | pass — 217 packages, 0 audit vulnerabilities |
| `npm run typecheck` | pass |
| `npm run lint` | pass |
| `npm test` | **FAIL — 28 passed, 1 timeout (`package-formats`)** |
| `npm run build` | pass — library, declarations, tarball, site, site-build policy |
| `npm run test:e2e` | pass — 32 tests |
| `npm audit --audit-level=high` | pass — 0 vulnerabilities |
| `npm pack --json --dry-run` | pass — 7 files, 11,188 bytes packed, no bundled dependencies |

Build output is within the static budgets: landing JS is 19,573 bytes raw / 7,399 bytes gzip; landing CSS is 16,693 bytes raw / 4,246 bytes gzip; the hero WebP is 13,250 bytes. The browser loads only the four required self-hosted Latin fonts (68,044 bytes total), not the other build-time subsets.

## Independent library and product checks

- A fresh temporary npm consumer installed `https://browser-game-replay-capsule.sociobot.in/releases/sociobot-replay-capsule-0.1.6.tgz` with `--ignore-scripts --omit=dev`. `npm ls` contained only `@sociobot/replay-capsule@0.1.6`.
- Its CommonJS consumer created a recorder with explicit `EventTarget`s, checkpointed, exported, and validated a `replay-capsule` artifact. Its ESM consumer imported and validated a version-1 capsule.
- In the live demo, start → ArrowRight/ArrowUp → stop → download yielded a valid version-1 JSON capsule with four events. Malformed JSON gave “Capsule is not valid JSON…” and a 1,000,001-byte file gave the documented over-limit recovery message.
- The live closed-Shadow-DOM test focused a closed-root text input, typed `secret`, stopped, and downloaded **zero events**. This verifies the previously reported privacy boundary repair.
- In a 390×844 context, after first loading `/demo/`, setting that context offline, starting, pressing ArrowRight, and stopping produced two captured events.

## Deployment, privacy, headers, and accessibility

- The local candidate build and live deployment agree: all **36 browser-served files** in `dist/site` compared byte-for-byte with their live URLs. `staticwebapp.config.json` was deliberately excluded from this identity comparison because it is deployment configuration, not a public URL; requesting it correctly returns 404.
- The live normal demo flow made 15 requests, all same-origin static resources. It made no API/XHR/beacon/third-party request. At flow end it had no cookies, localStorage, sessionStorage, IndexedDB, Cache Storage, or service-worker registration.
- Root HTML uses the self-only CSP (`frame-ancestors 'none'`), HSTS, `nosniff`, `X-Frame-Options: DENY`, strict referrer policy, and camera/microphone/geolocation denial. HTML has 30-second revalidation; hashed JS and the versioned tarball have one-year immutable caching. A missing route returns HTTP 404 with the designed page.
- The product is static. It exposes no server endpoint or sign-in flow, so rate-limit/429 and Entra tenant checks do not apply.
- Independent axe scans on `/`, `/demo/`, `/privacy/`, `/terms/`, and the 404 route at desktop and 390 px returned zero violations, including zero serious/critical findings. No horizontal overflow occurred. Keyboard Tab reached the visible skip link and the 3 px amber focus ring; Enter on the sample link opened `/demo/`. Reduced-motion computed animation duration was `0.01ms`.
- There were no console/page errors on ordinary landing, demo, privacy, or terms loads. Chromium reports the expected failed-document resource message when deliberately loading the HTTP-404 route; there is no script/page exception.

## Handoff

No product code was changed during verification. The live deployment is current for this candidate, but the candidate must not be accepted until its exact `@claim:package-formats` command passes from a clean checkout.
