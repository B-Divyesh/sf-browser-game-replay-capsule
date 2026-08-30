# Replay Capsule — repair 7 handoff

## Result: ready for release

This repair resolves the only release-blocking finding in independent verification 7: the exact `@claim:package-formats` command could exceed Vitest's default five-second test limit while synchronously building the library.

The original test was a timing-sensitive direct `dist/` probe. In this checkout the baseline command completed in 2.80 s after `npm ci`, while the verifier measured 5.54–6.61 s on its clean host. The cause was therefore the inherited five-second test limit, not a change in the ESM, CommonJS, or declaration behavior.

## What changed

- Replaced the `package-formats` direct-file assertion with a 45-second, build-bearing regression that keeps all prior assertions and verifies more of the real release path.
- The test starts `npm run build:lib` in a separately awaited process, then explicitly waits for non-empty ESM, CommonJS, and declaration outputs.
- It installs the actual versioned tarball served from `site/public/releases/` into a newly created, offline npm consumer. It checks the exported manifest map, byte-compares the installed files against the fresh build, runs isolated CommonJS and ESM consumers, and type-checks an importing TypeScript consumer.
- It serves the installed ESM package to a newly created Playwright browser and context, waits for a positive browser-side readiness result, and closes the context, browser, HTTP server, and temporary consumer in `finally` blocks. This prevents a package check from leaking processes or browser state into another claim.

## Verification evidence

- `npm ci`: 217 packages installed; `npm audit --audit-level=high`: 0 vulnerabilities.
- `npm run typecheck`: pass. `npm run lint`: pass.
- Exact repaired command: `npm test -- --testNamePattern @claim:package-formats` — 1 passed in 4.75 s (Vitest duration 6.43 s).
- `npm test`: 29/29 passed. The package-format claim ran in 4.79 s within its explicit 45-second lifecycle budget.
- Every exact command declared in `.factory/claims.json` completed successfully: 19/19 claim commands, including both browser projects where applicable.
- `npm run build`: pass. The generated library includes ESM, CommonJS, and declarations; the served tarball is 11,188 bytes with 7 declared files and no bundled dependencies (`npm pack --json --dry-run`).
- `npm run test:e2e`: 31 passed, 1 expected desktop-only skip, in 32.2 s. This covers desktop and 390 px mobile behavior, keyboard start/import focus, reduced motion, 200% text, same-origin requests, isolated offline recording, closed/open Shadow-DOM text exclusion, and the record → download → import → replay path.
- Factory `verify-url.sh` against the local production preview: HTTP 200, 633 ms load, title/lang/one `<h1>`/`<main>`/image alt present, no unlabeled buttons, and no console errors.
- The project Playwright axe scans completed with zero violations on landing, demo, legal, and 404 states at desktop and mobile sizes. The standalone `@axe-core/cli` ChromeDriver could not create a browser session in this container; that is an environment driver mismatch, not a product finding, and the Playwright axe integration is the retained accessibility evidence.
- Response-policy assertions, static cache policy, CSP/frame isolation, 404 rewrite, package metadata, zero runtime dependencies, MIT licensing, and claim-to-test mapping pass in the unit suite.

## Deployment and handoff notes

Deployed by pushing repair commits `ab7b2eb` and `efef59f` to `main`; the static deployment remains rooted at `dist/site`, with `site/public/staticwebapp.config.json` as its response-policy configuration. The versioned release tarball is ready for the factory-owned package publishing workflow; no registry publication is attempted from this worker.

Post-push live checks at `https://browser-game-replay-capsule.sociobot.in` passed:

- Factory `verify-url.sh`: HTTP 200, 711 ms load, no console errors, title/lang/one `<h1>`/`<main>`/alt text present.
- All 35 browser-served local build files (excluding host-only `_headers` and `staticwebapp.config.json`) matched their live URLs byte-for-byte.
- The live root and immutable tarball carry CSP with `frame-ancestors 'none'`, HSTS, `nosniff`, strict referrer policy, camera/microphone/geolocation denial, and `X-Frame-Options: DENY`; an unknown route returned the designed HTTP 404.
- In a fresh 390 × 844 browser context, keyboard Tab/Enter reached the sample demo, then an independently created offline demo context recorded ArrowRight after initial load. Its 7 requests were same-origin; local/session storage, IndexedDB, Cache Storage, and service-worker registrations were empty; no page errors occurred.

There are no known product gaps from this repair.

## Independent QA verification 8 — PASS (2026-08-30 UTC)

**Tested candidate:** `238bb5e85964b148e59b77adf45204978b34f3bd`
**Live URL:** https://browser-game-replay-capsule.sociobot.in

**Result: PASS.** A fresh independent verifier ran all 19 exact commands in `.factory/claims.json`, the complete unit/browser suites, typecheck, lint, production build, package dry-run, a clean hosted-tarball consumer, and live desktop/mobile/privacy/accessibility checks. Every claim and quality gate passed. The formerly release-blocking `package-formats` exact claim command now passed in 11.74 s.

Fresh `dist/site` matched 35/35 browser-served live files byte-for-byte. Live demo record → download → malformed-import recovery → valid import → replay passed; requests were same-origin only, storage was empty, offline capture worked after first load, no console/page errors occurred, and mobile Lighthouse scored 98 performance / 100 accessibility / 100 best practices / 100 SEO. Live headers include self-only CSP/frame isolation, HSTS, nosniff, DENY framing, referrer policy, permissions policy, and correct HTML/immutable asset cache behavior.

No P0–P3 defects were found. The package is ready to publish; public-registry publication is still a factory release-owner action. Until that external release action, the documented and independently tested install path is the versioned tarball hosted at `/releases/sociobot-replay-capsule-0.1.6.tgz`.

See `.factory/verification-8.md` for complete evidence and commands.
