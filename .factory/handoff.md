# Replay Capsule repair 8 handoff — PASS

## Delivered

Repair release: `0.1.7` in the final `fix: repair replay capsule release blockers` commit. It repairs every release-blocking item in independent verification 10 while preserving the researched library and its in-memory demo.

1. **Phaser CSP:** normal pages retain a strict self-only `style-src`; the global image policy now permits Phaser's generated `data:` images. `/phaser-fixture.html` alone receives the narrowly required `style-src 'self' 'unsafe-inline'` for Phaser's runtime canvas styles. The browser claim test serves the built output with these real headers, requires a ready scene, runs 20 imported capsules, requires all 20 failures, and fails on every console/page error.
2. **Effective seeded-failure claim:** `seeded-failure-fixture` now invokes its tagged Playwright test (`npm run test:e2e -- --grep @claim:seeded-failure-fixture`) instead of a Vitest filter that executed zero tests.
3. **Gameplay-only demo capture:** the demo recorder listens on the game canvas and uses the new optional `shouldCaptureKey` filter for its eight movement keys. Keyboard use of Start/Stop and Tab navigation cannot enter a capsule. The browser regression starts with Enter, records ArrowRight/ArrowUp, tabs to Stop, presses Enter, and requires exactly four Arrow events.
4. **Mobile targets:** all header links have a 44 × 44 px minimum hit area. The mobile regression measures every header link as well as the existing compact controls.
5. **Exact offline claim:** landing/demo copy now says people can record, import, and replay after first load. Its claim test runs those three operations in its own offline browser context and asserts every observable result.

`0.1.7` is a patch release because the package gains the optional `shouldCaptureKey` control and the immutable hosted release artifact must not overwrite `0.1.6`.

## Verification

Clean install and complete local gate, 2026-09-01 UTC:

```sh
npm ci                         # 217 packages; 0 vulnerabilities
npm run check                  # 31/31 Vitest; build; 49 Playwright passed, 3 project skips
npm run lint
npm pack --dry-run             # 7 files; 11.5 kB package
```

Every one of the 22 exact commands in `.factory/claims.json` was run after the clean install and passed. In particular, the repaired Phaser command ran two desktop/mobile browser projects with the deployed CSP headers and each imported 20 capsules.

The local built-site verification passed for `/` and `/demo` via `/opt/fleet/lib/verify-url.sh`: each has a title, `lang=en`, one h1, main landmark, complete image alt text, labeled controls, and zero console/page errors. Playwright Axe scans passed with zero violations on landing, demo, privacy, terms, and 404. The full browser suite covers desktop, 390px mobile, keyboard operation, reduced motion, 200% text, privacy/same-origin requests, offline behavior, route focus, and CSP-backed Phaser initialization.

Local mobile Lighthouse 13 against the production build:

| Metric | Result |
| --- | ---: |
| Performance | 99 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| LCP | 1.66 s |
| CLS | 0.00019 |
| Transfer | 138.7 kB |

Evidence is in `.factory/qa-evidence/repair-8-local/`. The packaged release is `site/public/releases/sociobot-replay-capsule-0.1.7.tgz` (SHA-256 `b69b0db29d03a9645842759c3d54d13a62e6ebd3661b5aadd43fd6aafc714e41`). `dist/site/` is the static deployment output.

## Deployment

The static deployment source is this repository's `main` branch. Push the repair commit to trigger the factory static deployment; the deployable configuration is `dist/site/staticwebapp.config.json` and includes the scoped Phaser route CSP.

## Known gaps / next steps

No product or test gaps remain. Package registry publication remains factory-owned; do not publish from this worker. Verify the factory deployment has picked up the pushed commit before announcing the live release.
