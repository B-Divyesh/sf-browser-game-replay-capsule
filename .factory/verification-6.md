# Independent verification 6 — FAIL

**Candidate:** `12b602f8497577e87feabc90cce90e699a5b4974`  
**Live URL:** https://browser-game-replay-capsule.sociobot.in  
**Verified:** 2026-08-30 UTC  
**Work order:** `browser-game-replay-capsule-verify-6`  
**Scope:** clean-checkout claims gate, first-read/demo gate, source quality gates, packed consumers, live end-to-end behavior, privacy boundaries, accessibility, headers, deployment identity, and performance. Product code was not changed.

## Verdict

**FAIL.** The candidate is not blocked by deployment: all 34 deployable files match the clean candidate build byte for byte, and the live site passes its main functional, accessibility, privacy-network, header, cache, and performance checks. Release acceptance is blocked by three P1 findings:

1. the recorder captures keystrokes entered in a text input inside a closed Shadow DOM, contradicting the brief and the product's “never captured” promise;
2. the documented npm package is absent from the public registry, so the real `npm install` path fails with E404; and
3. `.factory/claims.json` omits multiple live and README claims, contrary to the supplied claims contract.

One P3 mobile touch-target defect was also found.

## Release-blocking findings

### P1 — text typed in a closed-Shadow-DOM input is captured

The brief requires text fields to **never** be recorded. The live UI says both “Text fields remain excluded” and “Not captured: typed text.” `.factory/claims.json` makes the same unconditional promise: “Text fields and editable elements are never captured.”

Fresh live reproduction:

1. Open `/demo/` and select **Arm & start**.
2. Add a custom element whose closed shadow root contains a focused `<input type="text">`.
3. Type `secret` into that input.
4. Stop and download the capsule.

Observed result: the event counter became **12**. The downloaded capsule retained key-down and key-up events for `KeyS`, `KeyE`, `KeyC`, `KeyR`, `KeyE`, and `KeyT`. `document.activeElement` was the closed-shadow host, while the actual input was focused inside its root.

The existing `originatesInTextEntry()` protection checks `event.target` and `event.composedPath()`. Closed shadow roots retarget the event to the host and conceal the inner input from the composed path, so this privacy boundary bypasses the check. The exact `@claim:text-entry-excluded` command passes because its tagged test covers only a light-DOM input. Separate untagged tests cover open shadow roots, not closed ones.

Evidence:

- [captured replay file](verification-artifacts/closed-shadow-text-capture.replay.json)
- [live capture screenshot](verification-artifacts/live-closed-shadow-text-capture.png)

This is release-blocking even though no network request occurs: a developer could download and share a capsule containing a player's supposedly excluded input key sequence.

### P1 — documented npm install path returns E404

The landing page and README tell users to run `npm install @sociobot/replay-capsule`. Fresh registry and empty-consumer checks both fail:

```text
npm view @sociobot/replay-capsule@0.1.5 version --json
# npm ERR! 404 '@sociobot/replay-capsule@0.1.5' is not in this registry
# exit 1

npm install --ignore-scripts --omit=dev --prefix <empty-dir> @sociobot/replay-capsule@0.1.5
# npm ERR! 404 '@sociobot/replay-capsule@0.1.5' is not in this registry
# exit 1
```

The locally packed artifact is valid, but the documented real-world entry point cannot currently be used. Publication remains a factory-owned release action; no publish was attempted during verification.

### P1 — claim inventory is incomplete

All ten listed claim commands pass and every listed id appears exactly once as an `@claim:<id>` tag. However, the supplied claims contract also requires every visitor-facing claim to be listed. Material unlisted claims include:

- the core README/landing claim that the product records keyboard, pointer, and gamepad inputs with timing, seed, and checkpoints, then exports a replayable JSON file;
- the landing compatibility claim **Canvas · Phaser · Kaplay · PixiJS · DOM games** (only Phaser's seeded result is listed in the manifest);
- the quantitative README claim that custom caps support the full **4 KB–1 MB** range;
- the README claim that pointer coordinates are normalized to the target;
- the README claim that the package exports ESM, CommonJS, and declarations; and
- the gamepad sampling/timestamp behavior stated in the README.

Some are covered by ordinary tests or this verifier's consumer checks, but they are not inventory entries with their own tagged sandbox tests. Under the acceptance contract, an unlisted claim fails review.

The existing claim inventory also overstates its proof for text exclusion: the listed sandbox says light DOM, while the claim says “never” and is false at the closed-shadow boundary above.

## Additional finding

### P3 — one mobile link target is 43 px wide

At a 390 px viewport, the footer **Demo** link measures **43×44 CSS px**. The supplied design/accessibility baseline requires every touch target to be at least 44×44 px. All principal controls met the target size, and axe reported no violation.

## Mandatory opening gates

### Clean checkout and claims

The initial tree was clean and exactly at the candidate:

```text
## main...origin/main
12b602f8497577e87feabc90cce90e699a5b4974
```

`.factory/claims.json` exists. Each exact command was run independently after `npm ci` and exited 0:

| Claim | Exact command result |
| --- | --- |
| `sample-demo` | 2 Playwright projects passed |
| `no-network-calls` | 2 passed |
| `opt-in-recording` | 2 passed |
| `text-entry-excluded` | 2 passed, but the promise is disproved by the closed-shadow boundary above |
| `default-byte-cap` | 1 Vitest test passed |
| `validated-import` | 1 passed |
| `replay-controls` | 1 passed |
| `seeded-failure-fixture` | 1 passed; 20/20 outcomes reproduced |
| `zero-runtime-dependencies` | 1 passed |
| `offline-demo` | 2 Playwright projects passed |

### Cold first-read and one-click demo

The first-read gate passes. A cold live page states:

- **What:** “Replay browser-game bugs from a small file.”
- **For whom:** “For solo 2D game developers who need a bug report that repeats the player's inputs and timing.”
- **First action:** “Try it with sample data,” with “Loads a seeded bug run you can replay.” beside it.

One click opened `/demo/`, displayed the persistent “Demo — sample data, nothing is saved” banner, and loaded seed `RC-SAMPLE-FAULT-17`, one pointer event, and a fault checkpoint. The demo offers **Reset demo** and **Start for real**. Evidence: [cold page](verification-artifacts/live-first-read-desktop.png) and [one-click demo](verification-artifacts/live-demo-after-one-click.png).

## Clean-checkout quality gates

Environment: Node `v22.23.2`, npm `10.9.8`.

| Gate | Result |
| --- | --- |
| `npm ci` | pass; 217 packages, 0 vulnerabilities |
| `npm run typecheck` | pass |
| `npm run lint` | pass |
| `npm test` | pass; 24/24 |
| `npm run build` | pass; library, declarations, site, and site-build policy check |
| `npm run test:e2e` | pass; 27 passed, 1 intentional project-specific skip |
| `npm audit --audit-level=high` | pass; 0 vulnerabilities |

Production build sizes:

- library ESM: 16.87 KB raw;
- library CJS: 18.21 KB raw;
- declaration: 3.35 KB;
- landing JS: 19.26 KB raw / 7.28 KB gzip;
- landing CSS: 16.84 KB raw / 4.28 KB gzip.

## Packed-library consumer

`npm pack --json` produced `@sociobot/replay-capsule@0.1.5` with 7 files, 10,791 bytes packed / 49,815 bytes unpacked, and no bundled or runtime dependencies.

A fresh temporary consumer installed that tarball with `--ignore-scripts --omit=dev`. `npm ls --omit=dev --all` contained only the package. Independent CommonJS recording/checkpoint/export and invalid-label rejection passed. Independent ESM validation and timed player completion passed. The package therefore appears ready to publish; the registry entry itself is missing.

## End-to-end product behavior

Desktop and 390×844 live flows both passed the normal workflow:

- sample replay reproduced its recorded fault outcome;
- an Arrow key before opt-in left the sample event count at 1;
- starting, pressing Right and Up, and stopping produced 4 key events;
- download produced a valid version-1 `replay-capsule` JSON file;
- malformed JSON produced a clear “not valid JSON” recovery message;
- a 1,000,001-byte file produced the documented over-limit message;
- re-importing the valid download recovered and replayed successfully; and
- no console error, page error, failed request, or horizontal overflow occurred.

Evidence: [desktop flow](verification-artifacts/live-desktop-flow.png) and [390 px flow](verification-artifacts/live-mobile390-flow.png).

Boundary tests in the source suite passed exact 4,096-, 128,000-, and 1,000,000-byte recorder finalization/import behavior, malformed/unsupported imports, gamepad metadata, pause/resume/stop, and the 20-seed Phaser fixture. The independent closed-shadow privacy boundary is the exception.

## Live deployment, privacy, and response policy

Deployment identity is confirmed: SHA-256 comparison of all 34 deployable `dist/site` files against their live URLs found **0 mismatches**.

Routes:

- `/`, `/demo/`, `/privacy/`, and `/terms/`: HTTP 200 with route-specific titles, one H1, `lang=en`, and one main landmark;
- `/definitely-missing-qa`: HTTP 404 with the designed recovery page;
- all intentional links, including GitHub, returned 200; and
- `robots.txt` and `sitemap.xml` are present and list the public routes.

The root and demo flows made 15 requests, all to the product origin and all for documents/static assets. There were no XHR/fetch/beacon calls and no third-party origins. Fresh browser state contained no cookies, localStorage, sessionStorage, IndexedDB databases, Cache Storage entries, or service-worker registration.

The warmed live demo continued recording offline and showed its offline state; one Arrow key yielded 2 key events. This is not a PWA and does not claim offline reload, so service-worker update/reload checks do not apply.

Response headers include the self-only CSP with `frame-ancestors 'none'`, HSTS, `nosniff`, `X-Frame-Options: DENY`, strict referrer policy, and camera/microphone/geolocation denial. HTML uses `public, must-revalidate, max-age=30`; hashed assets use `public, max-age=31536000, immutable`.

The product is fully static and made no product-unlock or other server endpoint requests. API concurrency, persistence, health identity, request allowances/429, and Entra sign-in checks are not applicable.

## Accessibility, responsive behavior, and performance

The factory `verify-url.sh` passed live with zero console errors, one H1, title, `lang=en`, main, image alts, and labeled buttons. Evidence: [verify-url result](verification-artifacts/verify-url-live/verify.json).

Independent axe runs reported zero violations—including zero serious/critical findings—on the landing page at desktop and 390 px and on demo, privacy, terms, and 404 pages. Keyboard-only checks reached the skip link and sample CTA; both showed a 3 px solid amber focus ring, and Enter opened the demo. Reduced-motion mode reduced animation and transition durations to 0.01 ms. A 200% root font-size smoke test at 390 px retained a 390 px layout width. The one 43 px footer link is recorded separately above.

Fresh live mobile/default-throttling Lighthouse:

| Category/metric | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| FCP | 1.2 s |
| LCP | 1.4 s |
| TBT | 0 ms |
| CLS | 0 |

Cold transfer was 98,918 bytes total. Encoded budgets were 7,353 bytes JS, 4,427 bytes CSS, 68,044 bytes fonts, and 13,250 bytes for the hero image. All supplied static-product budgets pass.

## Required next steps

1. Prevent recorder key capture from closed-shadow text entry and add the exact boundary to the tagged `text-entry-excluded` claim test.
2. Complete the claims inventory and add focused tagged tests for every retained landing/README claim.
3. Publish `@sociobot/replay-capsule@0.1.5` through the factory-owned npm release workflow, then verify installation from an empty consumer.
4. Increase the mobile footer Demo target to at least 44 px wide.
5. Re-run every claims command and the full verification after repair/publication.
