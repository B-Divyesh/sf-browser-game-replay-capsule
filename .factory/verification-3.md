# Independent verification 3 — FAIL

**Candidate:** `032a0beba0a03710f07f78f1d5c42023091f3034`

**Live URL:** https://browser-game-replay-capsule.sociobot.in

**Verified:** 2026-08-28 UTC

**Work order:** `browser-game-replay-capsule-verify-3`

**Scope:** clean-checkout source, package, clean packed consumer, and live deployment. No product code was changed.

## Verdict

**FAIL.** The candidate and deployment are substantially functional, the live site byte-matches the candidate build, and the previous download-serialization and visible-import-focus defects are repaired. Release acceptance is still blocked by two P1 defects: the documented npm package is unavailable from the public registry, and a valid near-cap recording can grow past its configured cap when manually stopped, making `export()` fail.

## Defects

### P1 — the documented npm package still cannot be installed

The README and live site tell users to run `npm install @sociobot/replay-capsule`, but a fresh consumer received:

```text
npm install --ignore-scripts @sociobot/replay-capsule@0.1.2
npm ERR! code E404
npm ERR! 404 '@sociobot/replay-capsule@0.1.2' is not in this registry.
```

`npm view @sociobot/replay-capsule versions --json` independently returned the same E404. The candidate tarball is healthy when installed by local path, but the real documented installation path is unavailable. Publishing remains a factory-owned operation and was not attempted.

### P1 — stopping a valid near-cap recording can violate the cap and make export impossible

`append()` checks the serialized size while recording, but `stop()` later updates `durationMs` without rechecking or invoking the cap-handling path (`src/index.ts:145-159`, `194-203`, `268-274`). A clean consumer of the packed candidate reproduced the failure at the ordinary 128 KB default cap with a 100 ms clock advance:

```json
{"payloadChars":127813,"checkpointAccepted":true,"beforeStopBytes":128000,"maxBytes":128000}
{"afterStopBytes":128002,"state":"stopped","result":"CapsuleError:too-large: Capsule exceeds its configured size limit."}
```

The checkpoint was accepted and status reported an exactly capped, valid recording. Calling `stop()` changed the serialized duration from `0` to `100`, grew the stopped capsule to 128,002 bytes, and made `export()` throw. The same defect reproduced at the minimum 4,096-byte cap (4,096 bytes before stop, 4,098 after).

This violates the researched strict-cap requirement and can prevent the core download/import handoff precisely at a supported boundary. Re-evaluate final serialized size whenever time-bearing state changes, including manual `stop()` and an `export()` performed while recording; preserve the newest complete entries that fit and add regressions for exact-cap recordings with advancing time.

## Clean-checkout gates

The repository began clean at the exact candidate and `origin/main` independently resolved to the same SHA. Node was `v22.23.2`; npm was `10.9.8`.

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm audit --audit-level=high
npm run test:e2e
```

- Clean install: 217 packages installed; audit reported 0 vulnerabilities.
- ESLint and TypeScript passed.
- Vitest: 13/13 passed across deployment config, the core library, and the Phaser fixture.
- Exact production build passed and emitted ESM, CommonJS, declarations, and `dist/site`.
- Playwright 1.58.2: 15 passed and one intentionally skipped desktop duplicate across desktop Chromium and 390×844 Chromium.
- The repository was clean after the verification commands and before report changes.

## Packed-library and public API exercise

`npm pack --json --pack-destination <clean-temp-dir>` produced `@sociobot/replay-capsule@0.1.2`: 7 files, 9,900 bytes packed, 46,050 bytes unpacked, integrity `sha512-1YP7iTwTEyQWUNooMPvOauEzRKVPuuSQ7VwdETOg+RBVbDhgQDfEWOxLUpWp5VJmo9S5yYbJientnGE+W0MEoA==`, and no bundled dependencies. Installing that tarball into a fresh npm project succeeded; `npm ls --omit=dev --all` showed only Replay Capsule.

- CommonJS `require()` exposed all documented runtime exports.
- ESM recorded a post-opt-in key and checkpoint, imported the JSON, and replayed both in timestamp order to `finished`.
- `pause()` prevented an event from firing during a 70 ms pause; `resume()` completed it; `stop()` resolved an active play promise as `stopped`.
- String, Blob, and object imports worked. Malformed JSON returned `CapsuleError: invalid`; a version-2 file returned `unsupported`; a 4,095-byte maximum returned `RangeError`.
- `clear()` returned a stopped recorder to an empty `idle` state.
- A strict standalone TypeScript consumer compiled against the packed public declarations.
- The candidate's near-128 KB and near-1 MB compact-download regressions passed, but the independent post-stop boundary above exposed the remaining cap defect.

The Phaser fixture imports and replays 20 seeded capsules through the fixture model and reproduced 20/20 seeded failures, exceeding the researched 90% target.

## Live end-to-end behavior

Fresh Chromium runs at 1440×900 and 390×844 exercised the deployed product rather than the local preview.

- Before opt-in, arrow input left the event count at 0.
- Keyboard navigation reached **Arm & start**, recording began, and real key and pointer inputs plus a mocked browser gamepad sample were downloaded in one capsule. The downloaded files were valid compact `replay-capsule:1` JSON and contained all three event types.
- Typing `do not capture` into an injected text input did not change the event count.
- A malformed JSON import displayed `Capsule is not valid JSON` and the under-1 MB recovery instruction. Importing the valid downloaded capsule immediately afterward recovered, and replay completed at both viewports.
- A warm-loaded 390px page continued recording while Chromium was offline (two key events, state `Recording`, no console error).
- The product had no horizontal overflow. Body text was 17px desktop and 16px mobile. All visible product targets measured at least 44×44 CSS px on mobile.

## Accessibility and motion

- Factory `verify-url.sh`: HTTP 200, 747 ms browser load, title, `lang="en"`, one `h1`, one `main`, image alt, labeled buttons, and zero browser errors.
- Independent `@axe-core/playwright`: 0 serious/critical findings at desktop and mobile.
- Keyboard-only operation covered start, stop, download, import focus, and replay. The start button and visible import label both rendered the designed `rgb(164, 71, 33) solid 3px` focus ring with 3px offset.
- The visible import target measured 162×52.34px desktop and 149×75.59px mobile.
- Under `prefers-reduced-motion: reduce`, root scrolling was `auto`, the replay transition duration was `0.01ms`, and the two entrance animations were finished rather than running.
- There were no console errors, page errors, failed requests, or HTTP error responses during either run.

## Privacy, requests, and browser policy

- Each initial live load made 8 requests, all to `https://browser-game-replay-capsule.sociobot.in`.
- No cookies, local-storage keys, session-storage keys, telemetry, or service-worker registrations were present.
- Source inspection found no fetch, XHR, WebSocket, beacon, analytics, browser storage, cookie, or service-worker implementation. Runtime fonts, scripts, styles, and imagery are self-hosted; GitHub appears only as a user-activated link.
- The root, legal pages, and runtime assets returned HTTP 200. HTML uses `Cache-Control: public, must-revalidate, max-age=30`; the hashed JS response uses `Cache-Control: public, max-age=31536000, immutable`.
- Root and asset responses include `default-src 'self'` CSP with `frame-ancestors 'none'`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and HSTS.
- There is intentionally no service worker and this is not a PWA, so service-worker update/offline-reload testing does not apply. Offline operation after an initial load passed.

## Deployment identity

The following live files exactly matched the fresh candidate build by SHA-256:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `48a744497aee68421f538240df65f34cace2c66357f9ddd83acdd55290ac1204` |
| `privacy/index.html` | `9b405f8734ff7377de8af737e975b3b72c885f60967e4fe553bfdd0eba12e73a` |
| `terms/index.html` | `aaafa84339501acd21c8f3b064836b08999bc921b3240a9a4b865ea5126cfe99` |
| `assets/main-ChkmmLtU.js` | `c89d8711ff69f09df95abfafe16cd7f307f7942953bed009d1c6ec1396a190c1` |
| `assets/main-znmtkH4u.css` | `4c0d15010fe389c7cff75454824bf9dc7de31b768091823c295ef4bed34998d9` |
| Hero WebP | `00b303ddd7558421684649d60746068a31644ddf84002fa7bb6c5d81db7418ff` |
| Sampled Atkinson WOFF2 | `b09653e3ba9d95e26da5c408979f40451990a4573ce5f96abe6982e2fcb09e6c` |

The deployed product therefore matches candidate `032a0beba0a03710f07f78f1d5c42023091f3034` for all checked runtime content. There is no deployment-only failure.

## Performance and bundle budgets

- Initial JS: 17,942 bytes raw / 6,934 bytes transferred (budget ≤200 KB).
- Main CSS: 15,964 bytes raw / 4,286 bytes transferred (budget ≤50 KB).
- Four loaded Latin WOFF2 files: 68,044 bytes raw (budget ≤120 KB).
- Hero WebP: 13,250 bytes (budget ≤300 KB).
- Lighthouse 13.4.1, live mobile/default throttling: Performance 98, Accessibility 100, Best Practices 100, SEO 100; FCP 949 ms, LCP 1,367 ms, Speed Index 949 ms, TBT 164 ms, CLS 0.0001, total transfer 97,263 bytes. INP is unavailable in a navigation-only lab run.

## Required retest

1. Publish `@sociobot/replay-capsule@0.1.2` (or a repaired successor) through the factory-owned npm workflow and prove a fresh registry install.
2. Make manual stop/export preserve the configured byte ceiling after duration metadata changes; test exact-cap recordings at 4,096, 128,000, and 1,000,000 bytes with an advancing clock.
3. Re-run the packed-consumer API suite and live identity check after the package fix and publication.
