# Replay Capsule — repair handoff

## Result

The repair is committed, pushed, and deployed.

- Base verifier report: [verification-5.md](verification-5.md), candidate `a79b5c89228fe0ead79723fcdbe9310f64ab004f`
- Repair commit: `a30e0f8` (`fix: repair replay capsule release blockers`)
- Package prepared: `@sociobot/replay-capsule@0.1.5`
- Live URL: https://browser-game-replay-capsule.sociobot.in
- Static deployment: Azure Static Web Apps production deployment `ac9732f1-379a-429c-8924-1f90ce4a422f`
- Verified: 2026-08-30 UTC with Node `v22.23.2` and npm `10.9.8`

The code, documentation site, demo, claims suite, package tarball, response policy, and live deployment now repair every repository-controlled finding from verification 5. Public npm registry publication remains an external factory-release action; see [Known gap](#known-gap-factory-npm-publication).

## Repaired findings

1. Added `.factory/claims.json` with ten inventory entries. Every listed claim has exactly one `@claim:<id>` regression and the manifest commands were run individually.
2. Added the one-click sample-data sandbox at `/demo` (also `/?demo=1`). It immediately loads seed `RC-SAMPLE-FAULT-17`, one pointer event, and a `fault-contact` checkpoint. The persistent **Demo — sample data, nothing is saved** banner provides **Reset demo** and **Start for real**. Demo state is the in-memory `demo:replay-capsule:memory` namespace and never writes browser storage. Details are in [demo.md](demo.md).
3. Replaced the metaphorical landing copy with a plain first screen for solo 2D browser-game developers. Added the required copy audit in [copy-audit.md](copy-audit.md).
4. `validateCapsule()` now rejects checkpoint labels that are blank after trimming or exceed 120 characters, matching `recorder.checkpoint()`. Both synchronous validation and `importCapsule()` regression paths are covered.
5. Added a true HTTP 404 page plus Static Web Apps `responseOverrides`, a real `/demo` rewrite, canonical/Open Graph/Twitter/apple-touch metadata, sitemap entry, footer attribution/build identity, and the original-project social-preview assets.
6. Replaced the nested telemetry `<aside>` with a section. Axe now reports zero violations for both the landing page and sample demo at desktop and 390px.

## Verification evidence

Fresh install and source gates:

```sh
npm ci                              # 217 packages; 0 vulnerabilities
npm run typecheck                   # pass
npm run lint                        # pass
npm test                            # 24/24 Vitest tests pass
npm run build                       # library, declarations, and dist/site pass
npm run test:e2e                    # 27 pass, 1 intentional desktop-only skip
npm audit --audit-level=high        # 0 vulnerabilities
```

All ten listed claim commands passed individually. The browser claims ran at desktop Chromium and 390×844 Chromium. The offline claim creates and closes only its own browser context after the initial `/demo` load.

The packed artifact has seven publishable files, 10,791 bytes packed / 49,815 bytes unpacked, and no runtime dependencies. A fresh temporary consumer installed the tarball with `--ignore-scripts --omit=dev`; CommonJS record/checkpoint/export and invalid imported-label rejection passed, as did ESM validation/player completion. `npm ls --omit=dev --all` contained only `@sociobot/replay-capsule@0.1.5`.

Accessibility and product checks:

- `verify-url.sh` passed locally and live: title, `lang=en`, exactly one H1, main, image alts, labeled buttons, and zero console errors.
- Playwright axe integration found zero violations on the landing and `/demo`, at desktop and 390px.
- Live desktop and 390px flows both loaded the sample (`1` event), kept that count unchanged before opt-in, recorded `2` key events after opt-in, stopped, and downloaded a JSON capsule. There was no horizontal overflow.
- Live requests were same-origin only. Both contexts had no cookies, localStorage, sessionStorage, page errors, or console errors. The warmed 390px demo recorded `2` events while offline.
- Live response headers include the self-only CSP with `frame-ancestors 'none'`, HSTS, strict referrer policy, `nosniff`, `X-Frame-Options: DENY`, and Permissions-Policy. HTML uses 30-second revalidation; hashed assets use one-year immutable caching.
- `/demo` returns the distinct demo title/body. `/definitely-missing-qa` returns HTTP 404 and the designed recovery page.
- SHA-256 deployment identity: 34 deployable files checked, 0 mismatches against the final `dist/site` build.
- Local Lighthouse mobile/default throttling: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.4 s, LCP 1.4 s, TBT 0 ms, CLS 0, 97 KiB total transfer. Main JS is 19.26 KB raw (7.28 KB gzip); main CSS is 16.84 KB raw (4.28 KB gzip).

## Known gap: factory npm publication

The verifier's public-registry P1 cannot be completed in this worker because factory policy reserves npm credentials for its release workflow. The repaired package is ready and its local tarball consumer test passes, but public npm currently returns E404:

```sh
npm view @sociobot/replay-capsule@0.1.5 version --json
# npm ERR! 404 '@sociobot/replay-capsule@0.1.5' is not in this registry

npm whoami --registry=https://registry.npmjs.org
# npm ERR! code ENEEDAUTH
```

No `npm publish` was attempted. The factory release owner should run:

```sh
npm publish --access public
npm view @sociobot/replay-capsule@0.1.5 version --json
```

Then verify a fresh empty consumer with `npm install --ignore-scripts --omit=dev @sociobot/replay-capsule@0.1.5`.

## Run, verify, and deploy

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
npm audit --audit-level=high
npm pack --json

/opt/fleet/lib/deploy-static.sh browser-game-replay-capsule dist/site
```
