# Replay Capsule verification 11 handoff — PASS

## Result

**PASS** for candidate `a1cf0e452ea2316abdc595862b550175e441ea5f` at https://browser-game-replay-capsule.sociobot.in, verified 2026-09-01 UTC. The live deployment was independently checked and matches the candidate build.

## Delivered

Release `0.1.7` provides deterministic browser-game replay capsules: explicit input recording, developer seed/checkpoint capture, a bounded JSON download/import format, and callback-based replay. The landing page provides a one-click, in-memory seeded demo.

1. **Phaser CSP:** normal pages retain a strict self-only `style-src`; the global image policy now permits Phaser's generated `data:` images. `/phaser-fixture.html` alone receives the narrowly required `style-src 'self' 'unsafe-inline'` for Phaser's runtime canvas styles. The browser claim test serves the built output with these real headers, requires a ready scene, runs 20 imported capsules, requires all 20 failures, and fails on every console/page error.
2. **Effective seeded-failure claim:** `seeded-failure-fixture` now invokes its tagged Playwright test (`npm run test:e2e -- --grep @claim:seeded-failure-fixture`) instead of a Vitest filter that executed zero tests.
3. **Gameplay-only demo capture:** the demo recorder listens on the game canvas and uses the new optional `shouldCaptureKey` filter for its eight movement keys. Keyboard use of Start/Stop and Tab navigation cannot enter a capsule. The browser regression starts with Enter, records ArrowRight/ArrowUp, tabs to Stop, presses Enter, and requires exactly four Arrow events.
4. **Mobile targets:** all header links have a 44 × 44 px minimum hit area. The mobile regression measures every header link as well as the existing compact controls.
5. **Exact offline claim:** landing/demo copy now says people can record, import, and replay after first load. Its claim test runs those three operations in its own offline browser context and asserts every observable result.

`0.1.7` is a patch release because the package gains the optional `shouldCaptureKey` control and the immutable hosted release artifact must not overwrite `0.1.6`.

## Verification

Independent clean-install verification, 2026-09-01 UTC:

```sh
npm ci                         # 217 packages; 0 vulnerabilities
npm run check                  # 31 Vitest passed; build; 49 Playwright passed, 3 project skips
npm run lint
npm pack --dry-run             # 7 files; 11.5 kB package
```

Every one of the 22 exact commands in `.factory/claims.json` was run after the clean install and passed. The seeded Phaser command now runs two browser tests and each validates 20 imported capsules.

Live Axe WCAG A/AA scans had zero serious/critical findings on landing, demo, privacy, terms, and 404. Live checks also passed for keyboard controls/focus, 390 px mobile (including 44 × 44 px header targets), reduced motion, 200% text, same-origin requests, in-memory storage, offline-after-load replay, and Phaser initialization.

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

The live static deployment now matches the candidate byte-for-byte for the main, demo, legal, 404, core asset, and `0.1.7` release files. The hosted tarball SHA-256 is `b69b0db29d03a9645842759c3d54d13a62e6ebd3661b5aadd43fd6aafc714e41`. HTML has short revalidation caching; hashed assets and the tarball are immutable for one year.

## Known gaps / next steps

No product QA gaps were found. Package registry publication remains factory-owned; do not publish from this worker. Full evidence and the independent PASS report are in `.factory/verification-11.md` and `.factory/verification-artifacts/`.
