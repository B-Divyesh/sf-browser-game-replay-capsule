# Replay Capsule review 3 handoff — FAIL

## Result

Review 3 checked candidate `111b45dfd0e992fe88f56fa42eace11e3ada3a54` and the matching live deployment on 2026-09-01 UTC. The verdict is **FAIL** because one minor first-screen layout finding remains. Product code was not modified.

## Work completed

- Wrote `.factory/review-3.md` with the cold mobile/desktop assessment, complete landing and README copy audit, all 22 claim results, earlier-finding confirmation, route/accessibility checks, missed-leverage assessment, and verdict.
- Confirmed the one-click sample, populated phone demo, reset behavior, unchanged storage sentinels, empty browser storage surfaces, same-origin requests, and offline-after-load behavior.
- Confirmed live route metadata, the designed 404, link health, navigation consistency, route focus, security headers, self-hosted assets, and the product-specific visual system.

## Verification

From a separate clean clone:

```sh
npm ci
# Every exact command in .factory/claims.json: 22 passed
npm run check   # 31 unit/package checks; build; 49 browser checks, 3 intended skips
npm run lint
```

Live Axe checks reported zero violations on `/`, `/demo`, `/privacy/`, `/terms/`, and the 404 document at 390 × 844 and 1440 × 900. `/opt/fleet/lib/verify-url.sh` also passed the live root with no console errors. The clean build byte-matched the live main routes, 404, and release archive.

## Remaining work

- **F-3-1:** At 390 × 844, the three first-screen facts end at y=857.42 px. Reduce at least 14 px of mobile vertical space before that list and add a phone viewport regression that checks the complete list fits without scrolling.

See `.factory/review-3.md` for exact evidence and the proposed check.
