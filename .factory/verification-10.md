# Independent verification 10 — FAIL

**Candidate:** `2d6af00c47fe220f3585c8155cbbb098676c2f09`

**Live URL:** https://browser-game-replay-capsule.sociobot.in

**Verified:** 2026-09-01 UTC

**Scope:** clean-install claims gate, exact production build, npm consumer, and independent live QA. No product code was changed.

## Verdict

**FAIL.** The visible sample and npm library work well, and the live files match the candidate. Release is blocked by the broken live Phaser acceptance fixture, an ineffective required claim command, and an inaccurate keyboard-only capture. Mobile header targets also miss the 44 px baseline.

## Findings by severity

### P1 — Live Phaser acceptance fixture does not initialize

`https://browser-game-replay-capsule.sociobot.in/phaser-fixture.html` returns 200 but remains at **“Starting Phaser.”** after 30 seconds. `window.runPhaserReplay` is undefined, so the required 20-capsule run cannot start on the deployed product.

Fresh browser evidence:

- Four console errors report that `data:image/png;base64,...` violates `img-src 'self'`.
- A page error follows: `TypeError: Cannot read properties of undefined (reading 'get')`.
- The response CSP is `img-src 'self'`; Phaser creates built-in data-URI images.
- The same fixture passes locally because the Vite preview used by Playwright does not apply the deployment CSP.

This blocks the researched success measure that the Phaser/Kaplay sample reproduce at least 90% of 20 seeded failures. Evidence: [live Phaser fixture](qa-evidence/live-phaser-fixture.png).

### P1 — Required seeded-failure claim command executes zero tests

The exact `.factory/claims.json` command is:

```sh
npm test -- --testNamePattern @claim:seeded-failure-fixture
```

It exits zero but reports **5 test files skipped and 31 tests skipped**, with no executed test. The only matching tag is in `tests/e2e/site.spec.ts`, which Vitest does not run. The full Playwright suite does exercise the fixture locally, but the mandated per-claim command does not. Under the claims contract, this is a missing effective claim test and is release-blocking.

### P1 — Keyboard-only recording includes the demo's own controls

A live keyboard-only run used Tab to reach **Start recording**, Enter to start, ArrowRight and ArrowUp for gameplay, Tab to reach **Stop recording**, and Enter to stop. The downloaded capsule contained eight events instead of the four gameplay key events:

1. `Enter` up from starting the recorder
2. `ArrowRight` down/up
3. `ArrowUp` down/up
4. `Tab` down/up while moving to Stop
5. `Enter` down while stopping

This makes a keyboard-operated replay include interface-navigation keys that were not game input. Games that use Enter or Tab can therefore replay a different outcome. Evidence: [keyboard flow](qa-evidence/live-keyboard-flow.png).

### P2 — Mobile header links are narrower than 44 px

At a 390 px viewport, the header targets measure:

| Link | Size |
| --- | --- |
| Demo | 33 × 44 px |
| Privacy | 41 × 44 px |
| Terms | 34 × 44 px |

This misses the required 44 × 44 px touch-target baseline on the landing, demo, privacy, and terms routes. The existing mobile regression named for compact navigation does not inspect these three links.

### P2 — Offline import/replay copy is not covered by its listed claim test

The live demo says **“Recording, import, and replay still work after this page loads.”** The `offline-demo` claim and its test assert recording only. Independent live checking confirmed that importing and replaying a one-event capsule currently work after the loaded page is taken offline, but the stronger published copy has no matching regression assertion.

## Mandatory opening gates

The cold first screen passes. It says **“Replay browser-game bugs from a small file.”**, identifies solo 2D game developers, and presents **“Try it with sample data”** beside **“Loads a seeded bug run you can replay.”** The action opens `/demo` in one click with the persistent **“Demo — sample data, nothing is saved.”** banner. Desktop and 390 px screenshots are in `qa-evidence/`.

`.factory/claims.json` exists with 22 entries. A bare-clone invocation before dependency installation stopped at missing Playwright/Vitest packages, as expected for a non-vendored npm checkout. `npm ci` then installed 217 packages from the lockfile with zero audit vulnerabilities. Every exact claim command was rerun in manifest order:

| Claim | Exact-command result |
| --- | --- |
| `sample-demo` | PASS — 2 Playwright projects |
| `no-network-calls` | PASS — 2 Playwright projects |
| `opt-in-recording` | PASS — 2 Playwright projects |
| `text-entry-excluded` | PASS — 2 Playwright projects |
| `record-export-replay` | PASS — 2 Playwright projects |
| `no-browser-persistence` | PASS — 2 Playwright projects |
| `capture-surface` | PASS — 2 Playwright projects |
| `checkpoint-capture` | PASS — 1 Vitest test |
| `default-byte-cap` | PASS — 1 Vitest test |
| `custom-cap-range` | PASS — 1 Vitest test |
| `validated-import` | PASS — 1 Vitest test |
| `pointer-normalization` | PASS — 2 Playwright projects |
| `gamepad-sampling` | PASS — 1 Vitest test |
| `adapter-callbacks` | PASS — 1 Vitest test |
| `replay-controls` | PASS — 1 Vitest test |
| `seeded-failure-fixture` | **FAIL — zero tests executed; 31 skipped** |
| `package-formats` | PASS — 1 Vitest test |
| `installable-release` | PASS — 1 Vitest test |
| `zero-runtime-dependencies` | PASS — 1 Vitest test |
| `offline-demo` | PASS for recording — 2 Playwright projects; published import/replay copy is not asserted |
| `mit-license` | PASS — 1 Vitest test |
| `node-20-runtime` | PASS — 1 Vitest test |

## Local quality gates

| Command | Result |
| --- | --- |
| `npm ci` | PASS — 217 packages, 0 vulnerabilities |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm test` | PASS — 31/31 tests |
| `npm run build` | PASS — ESM, CommonJS, declarations, hosted tarball, and `dist/site` |
| `npm run test:e2e` | PASS — 47 passed, 3 expected project-specific skips |
| `npm pack --dry-run` | PASS — 7 files, 11.1 kB tarball |

The full suites passing does not override the ineffective per-claim command or the live CSP failure.

## Independent live and library exercise

- Seeded sample replay: PASS — reported “Replay complete: the recorded outcome was reproduced.”
- Normal record/export/import/replay: PASS — four Arrow key events downloaded as JSON, re-imported, and replayed with `recorded-sequence-applied`.
- Invalid input and recovery: PASS — malformed JSON reported “Capsule is not valid JSON. Choose a Replay Capsule JSON file under 1 MB.” A valid file then imported and replayed normally.
- Privacy: PASS for the exercised visible flow — 32 observed requests all used the product origin; localStorage, sessionStorage, cookies, IndexedDB, Cache Storage, and service-worker registrations remained empty.
- Package consumer: PASS — a new temporary npm project installed the hosted `0.1.6` tarball. CommonJS and ESM consumers each created, checkpointed, exported, imported/validated a capsule. `npm ls --omit=dev --all` showed only `@sociobot/replay-capsule@0.1.6`.
- Routes and links: PASS — `/`, `/demo`, `/privacy/`, and `/terms/` return 200; an unknown path returns the designed 404. All internal page links return 200.
- Normal-page console/page errors: none. The Phaser fixture errors are detailed above.

## Deployment identity, headers, caching, and budgets

The live deployment matches the candidate. Byte comparisons passed for root, demo, privacy, terms, designed 404, release tarball, hero image, and all core JS/CSS chunks. Examples:

| Artifact | SHA-256 |
| --- | --- |
| `/` | `16d7da8ab9ad3cb391139be8137f7627605123bc80ad8a8eb28648048e46eddb` |
| `/demo` | `c520df5dadac780a0dc6320c36c5ee40c4ddbe97f5f97aabfcf74a68092fc882` |
| `main-CbQnEBVy.js` | `780424466c3a582a8762df485381e09ffdd4ca910049dc82db134f939c44493d` |
| hosted `0.1.6` tarball | `87a7e529f884fcd30d925d5850163a5654c689f7442a26a16cf16bfad038d007` |

HTML uses `public, must-revalidate, max-age=30`. Hashed assets and the release tarball use `public, max-age=31536000, immutable`. Root headers include CSP, HSTS, nosniff, DENY framing, strict referrer policy, and denied camera/microphone/geolocation. The CSP itself causes the Phaser defect above.

Observed first-load transfer sizes are within budget: JavaScript 8.4 kB encoded / 20.6 kB decoded, CSS 4.6 kB encoded / 17.5 kB decoded, fonts 68.0 kB, hero image 13.3 kB, and total page weight about 99.4 kB. The 1.21 MB Phaser chunk is not loaded by the landing or visible demo.

Mobile Lighthouse 13 measured:

| Category/metric | Result |
| --- | --- |
| Performance | 94 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| LCP | 1.38 s |
| CLS | 0.00051 |
| Total blocking time | 280 ms |

## Accessibility and responsive checks

- `/opt/fleet/lib/verify-url.sh`: PASS — title, `lang=en`, one h1, main landmark, alt text, labeled buttons, and no normal-page errors.
- Playwright axe WCAG A/AA: zero violations, including zero serious/critical findings, on `/`, `/demo`, `/privacy/`, `/terms/`, and the designed 404.
- Keyboard focus: first Tab reaches the skip link; the sample action shows a 3 px solid amber outline and opens with Enter.
- Reduced motion: zero running animations on the 390 px demo.
- 200% text at 390 px: no horizontal overflow; the sample action remains visible.
- 390 px layout: document width equals viewport width. The sample replay action is visible in the first viewport.
- Touch targets: FAIL for the three header links as detailed above.

This is a static library/demo with no server-side product or unlock endpoints and no sign-in. Rate-limit/429 and Entra checks are not applicable. It is not a PWA and registers no service worker; its offline promise concerns the already-loaded page. AI features would not improve the brief's deterministic replay job, so no missed-leverage finding applies.

## Required release work

1. Make the deployed CSP compatible with the Phaser fixture without weakening unrelated directives, then verify 20 imported capsules on the live origin.
2. Point `seeded-failure-fixture` at the runner that contains its tagged test and ensure the exact command executes one source test.
3. Keep demo-control Enter/Tab events out of recorded gameplay while preserving keyboard operation.
4. Increase all mobile header link hit areas to at least 44 × 44 px.
5. Add offline import and replay assertions or narrow the published offline copy.
