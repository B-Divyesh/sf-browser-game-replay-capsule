# Independent verification 4 — FAIL

**Candidate:** `9a49bb3e2da202c41ab118570377269f6ebaf32c`  
**Live URL:** https://browser-game-replay-capsule.sociobot.in  
**Verified:** 2026-08-28 UTC  
**Work order:** `browser-game-replay-capsule-verify-4`  
**Scope:** clean-checkout source, exact production build, packed consumer, public registry, and live deployment. Product code was not changed.

## Verdict

**FAIL.** Candidate source and the live site match, all repository quality gates pass, the strict-cap regression is repaired, and the prior deployment-policy failure is no longer present. Release acceptance remains blocked by two P1 defects:

1. recording captures keystrokes from text inputs inside Shadow DOM, violating the explicit privacy guarantee that text fields are never recorded; and
2. the documented package is still unavailable from the public npm registry.

## Defects

### P1 — text typed in a Shadow DOM input is captured

The library excludes a normal light-DOM `input`, but it checks only `KeyboardEvent.target`. At a listener on `window`, a composed keyboard event from Shadow DOM is retargeted to the shadow host. The input remains visible in `event.composedPath()`, which the candidate does not inspect.

Fresh reproduction against the live candidate:

1. Start recording.
2. Attach an open shadow root containing `<input aria-label="Shadow private text">`.
3. Focus the input and type `secret`.
4. Stop and download the capsule.

Observed evidence:

```json
{
  "activeOuter": "shadow-host",
  "activeInner": "Shadow private text",
  "eventCount": "12",
  "state": "Recording",
  "keyEvents": [
    { "action": "down", "code": "KeyS" }, { "action": "up", "code": "KeyS" },
    { "action": "down", "code": "KeyE" }, { "action": "up", "code": "KeyE" },
    { "action": "down", "code": "KeyC" }, { "action": "up", "code": "KeyC" },
    { "action": "down", "code": "KeyR" }, { "action": "up", "code": "KeyR" },
    { "action": "down", "code": "KeyE" }, { "action": "up", "code": "KeyE" },
    { "action": "down", "code": "KeyT" }, { "action": "up", "code": "KeyT" }
  ]
}
```

Although the library stores key codes rather than characters, this sequence reconstructs ordinary typed content and violates the researched constraint, README promise, live privacy policy, and product UI claim that text fields are never captured. Treat text-entry elements anywhere in `event.composedPath()` as excluded, including shadow-root inputs, textareas, selects, and editable content, and add browser regressions for them.

### P1 — the documented npm package cannot be installed

The README and live site instruct users to run `npm install @sociobot/replay-capsule`, but the public registry does not contain candidate version 0.1.3.

Fresh evidence from a clean temporary consumer:

```text
npm view @sociobot/replay-capsule@0.1.3 version --json
npm ERR! code E404
npm ERR! 404 '@sociobot/replay-capsule@0.1.3' is not in this registry.

npm install --ignore-scripts --prefix <empty-dir> @sociobot/replay-capsule@0.1.3
npm ERR! code E404
```

`npm whoami` returned `ENEEDAUTH`. Per the work order, registry credentials are factory-owned, so publication was not attempted. The locally packed artifact is ready, but the real documented installation path does not work.

## Clean-checkout quality gates

A detached clean worktree was created at the exact candidate. Node was `v22.23.2`; npm was `10.9.8`.

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm audit --audit-level=high
npm run build
npm run test:e2e
```

- `npm ci`: 217 packages installed; 0 vulnerabilities.
- ESLint passed.
- TypeScript passed with no emit.
- Vitest: 18/18 passed across deployment policy, core library, cap regressions, and the Phaser fixture.
- The Phaser fixture reproduced 20/20 seeded failures, exceeding the researched 90% target.
- The exact production build passed and emitted ESM, CommonJS, declarations, and `dist/site`.
- Playwright 1.58.2: 15 passed, 1 intentional desktop-only skip across desktop Chromium and 390×844 mobile Chromium.
- The clean worktree remained clean after verification.

## Packed library and public API

`npm pack --json` and `npm publish --dry-run --json` produced a valid public-scoped `@sociobot/replay-capsule@0.1.3` artifact:

- 7 files; 10,282 bytes packed; 48,102 bytes unpacked;
- integrity `sha512-Ml//M+oXRkwyo3JgL1iLA4UJlT4sO/JINgiztf3dwaYgPPlNcSPBOKv7cqLEaMGrMNKHbnA2/V5XReD4iTx+fQ==`;
- no bundled or runtime dependencies.

A separate clean consumer installed the tarball with `--ignore-scripts --omit=dev`. `npm ls --omit=dev --all` contained only Replay Capsule. Independent checks passed for:

- ESM and CommonJS public exports;
- strict TypeScript declaration compilation;
- recorder start/stop/clear/checkpoint/export and status callbacks;
- string, Blob, and object imports;
- replay order, pause/resume, stop, completion, and invalid playback speed;
- malformed JSON, unsupported versions, negative duration, invalid gamepad index/timestamp, non-JSON seed/checkpoint data, and oversized import recovery;
- `maxBytes` rejection at 4,095 and 1,000,001; and
- exact-cap stop/export/import at 4,096, 128,000, and 1,000,000 bytes after a 100 ms duration change. All final files stayed at or under their cap and reported truncation instead of becoming unexportable.

## Live end-to-end behavior

Independent Chromium runs at 1440×900 and 390×844 exercised the deployed product.

- Before opt-in, arrow input recorded 0 events.
- Keyboard navigation reached **Arm & start** after 9 tabs on desktop and 7 on mobile; Enter started capture.
- Key, pointer, and mocked gamepad activity produced 10 events. The downloaded compact capsule contained all three event types and stayed below 128 KB.
- Keyboard operation stopped, downloaded, focused the visible import control, and replayed the capsule to completion.
- A malformed import showed the JSON/1 MB recovery instruction; importing the valid download immediately afterward recovered.
- A valid empty capsule showed the explicit empty state.
- A normal light-DOM text field recorded 0 events. The Shadow DOM case above failed.
- A warm-loaded page continued recording offline. There is intentionally no service worker and this is not a PWA, so service-worker update/offline-reload testing is not applicable.
- Privacy and terms pages returned 200 and contained the documented policies.
- Screenshots at both sizes matched the documented mid-century instrument-panel thesis, with no clipping or horizontal overflow.

## Accessibility and motion

- Factory `verify-url.sh`: HTTP 200, 768 ms load, title present, `lang="en"`, one `h1`, one `main`, image alt present, no unlabeled buttons, and no browser errors.
- Independent `@axe-core/playwright`: 0 serious/critical findings at both viewports.
- Body text was 17px desktop and 16px mobile; responsive width was exactly 1440/1440 and 390/390 with no horizontal overflow.
- Every visible link, enabled button, file label, focusable canvas, and focusable code region measured at least 44px in both dimensions; minimum target height was 44px.
- Record focus was a visible 3px solid `rgb(164, 71, 33)` ring with 3px offset. The visible import target had the same ring and measured 52.34px tall desktop / 75.59px mobile.
- Reduced-motion emulation produced `scroll-behavior: auto`, a `0.01ms` replay transition, and 0 running animations.

## Privacy, requests, and response policy

- Initial and exercised runtime requests used only `https://browser-game-replay-capsule.sociobot.in`; no third-party runtime request occurred.
- No cookies, local-storage keys, session-storage keys, or service-worker registrations were created.
- Source inspection found no fetch, XHR, WebSocket, beacon, browser persistence, analytics, or service-worker implementation. Runtime scripts, styles, fonts, and images are self-hosted; GitHub appears only as an explicit outbound link.
- There were 0 console errors, page errors, failed requests, or HTTP error responses in either viewport.
- HTML returns `Cache-Control: public, must-revalidate, max-age=30`. Hashed JS, CSS, and image assets return `Cache-Control: public, max-age=31536000, immutable`.
- Root, legal, and asset responses include a self-only CSP with `frame-ancestors 'none'`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and HSTS.

The response-policy/deployment defect reported earlier is fixed.

## Deployment identity

The fresh candidate build and live deployment matched byte-for-byte:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `464fe6b5134a93f99e472dd39d5a483a2c1e63269d5e0d10c415e4c341372a39` |
| `privacy/index.html` | `9b405f8734ff7377de8af737e975b3b72c885f60967e4fe553bfdd0eba12e73a` |
| `terms/index.html` | `aaafa84339501acd21c8f3b064836b08999bc921b3240a9a4b865ea5126cfe99` |
| `assets/main-C02-Eroq.js` | `39986169b3b842bda757808f32e73f3f8313a1930af0d403bc69797438d62c5f` |
| `assets/main-znmtkH4u.css` | `4c0d15010fe389c7cff75454824bf9dc7de31b768091823c295ef4bed34998d9` |
| hero WebP | `00b303ddd7558421684649d60746068a31644ddf84002fa7bb6c5d81db7418ff` |

The live static deployment therefore matches candidate `9a49bb3e2da202c41ab118570377269f6ebaf32c`; there is no current deployment-only identity failure.

## Performance and budgets

- Initial JS: 18,175 bytes raw / 7,000 bytes transferred (budget ≤200 KB).
- Main CSS: 15,964 bytes raw / 4,286 bytes transferred (budget ≤50 KB).
- Four loaded Latin WOFF2 files: 68,044 bytes raw (budget ≤120 KB).
- Hero WebP: 13,250 bytes (budget ≤300 KB).
- Total Lighthouse transfer: 97,367 bytes.
- Lighthouse 13.4.1, live mobile/default throttling: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1,206 ms, LCP 1,356 ms, Speed Index 1,206 ms, TBT 0 ms, CLS 0.0001.
- INP is unavailable from a navigation-only lab run; the full interactive browser flow completed without observed long-task or response errors.

## Required retest

1. Exclude text-entry elements found anywhere in a keyboard event's composed path and add Shadow DOM input/textarea/contenteditable regressions.
2. Publish `@sociobot/replay-capsule@0.1.3` or a repaired successor through the factory-owned npm workflow and prove a fresh registry install.
3. Rebuild and redeploy the repaired site, then rerun the clean packed-consumer, privacy, live identity, and browser suites before changing this result to PASS.
