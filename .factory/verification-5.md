# Independent verification 5 — FAIL

**Candidate:** `a79b5c89228fe0ead79723fcdbe9310f64ab004f`  
**Live URL:** https://browser-game-replay-capsule.sociobot.in  
**Verified:** 2026-08-30 UTC  
**Work order:** `browser-game-replay-capsule-verify-5`  
**Scope:** clean-checkout claims gate, package, exact production build, packed consumer, public registry, live deployment, accessibility, privacy, and performance. Product code was not changed.

## Verdict

**FAIL.** The package implementation, production build, core record/export/import/replay flow, privacy behavior, response policy, and performance all pass. The live deployment matches the candidate. Release acceptance is nevertheless blocked by three P1 findings:

1. `.factory/claims.json` is missing, so the mandatory claim suite does not exist;
2. the first screen and `/demo` do not provide the required one-click sample-data sandbox; and
3. the documented npm package cannot be installed from the public registry.

This is not the previously reported deployment-only response-header failure. Fresh browser and curl evidence shows the expected security and cache headers, and 30/30 deployed files match the candidate build.

## Release-blocking findings

### P1 — required claim manifest and claim tests are missing

The first clean-checkout gate found no `.factory/claims.json`. There were therefore no manifest-listed claim commands to run. Under the acceptance contract, a missing manifest is itself release-blocking.

The landing page and README contain material claims with no registered `@claim:<id>` tests, including:

- “Zero runtime dependencies”;
- “128 KB default cap” and “A hard byte ceiling”;
- “No network calls”;
- text inputs and editable elements are never captured;
- recording is opt-in;
- imported capsules are schema validated;
- replay can pause, resume, stop, and accelerate; and
- the Phaser fixture reproduces at least 90% of seeded failures.

Repository tests happen to cover several of these behaviors, and the independent checks below confirm many of them, but that does not satisfy the required claim inventory, exact tagged test mapping, or demo-only sandbox execution.

### P1 — cold first screen and `/demo` fail the mandatory demo contract

Cold rendered first screen at 1440×900:

- H1: **“Make the bug play itself.”**
- Supporting text: “Capture input timing, your random seed, and the checkpoints that matter…”
- Actions: **“Test the recorder”** and **“Copy install command”**
- “Try it with sample data” count: **0**
- “Demo — sample data, nothing is saved” banner count: **0**

The screen suggests the mechanism but does not name the intended solo 2D browser-game developer in plain words, and the metaphorical H1 does not state the job. Most importantly, there is no one-click sample-data action.

Fresh requests to `/demo` return the same 9,391-byte landing document and normal landing title. It does not seed a realistic capsule/run, use a demo storage namespace, show the required persistent banner, offer **Reset demo** or **Start for real**, or enter a distinct sandbox. `.factory/demo.md` is also missing. The existing workbench requires the visitor to create the example manually.

Evidence: [cold desktop screenshot](verification-evidence/live-cold-desktop.png), [desktop exercised flow](verification-evidence/live-desktop-flow.png), and [mobile exercised flow](verification-evidence/live-mobile-flow.png).

### P1 — documented npm install path returns E404

The landing page and README tell users to install `@sociobot/replay-capsule`, but a fresh registry lookup and clean-consumer install both fail:

```text
npm view @sociobot/replay-capsule@0.1.4 version --json
npm install --ignore-scripts --omit=dev --prefix <empty-dir> @sociobot/replay-capsule@0.1.4

npm ERR! code E404
npm ERR! 404 '@sociobot/replay-capsule@0.1.4' is not in this registry.
```

The local tarball is sound, but the real job-to-be-done begins with the documented registry install. Publishing requires the factory-owned npm release workflow.

## Additional findings

### P2 — import validation accepts checkpoint labels the recorder rejects

The public recorder enforces checkpoint labels of 1–120 non-whitespace characters. The packed package's `validateCapsule()` accepts both a whitespace-only label and a 121-character label. These files cannot be produced through the recorder's public checkpoint API but pass the claimed schema validation at import.

Fresh packed-consumer result:

```text
blankCheckpoint ACCEPTED
longCheckpoint ACCEPTED
```

Apply the same trimmed 1–120 character invariant in `validateCapsule()` and add a regression test and claim mapping.

### P2 — no real 404 route and required metadata are absent

- `/definitely-missing-qa` returns HTTP 200 and the landing page.
- `/404.html` also resolves through the landing fallback; there is no designed 404 document.
- The root has no canonical URL, Open Graph metadata/image, Twitter card, or apple-touch icon.
- The sitemap omits `/demo` (which is not a real demo route in this candidate).
- Footers do not include the required “Built by Param Factory” attribution or version/build identity.

### P3 — axe reports one moderate landmark issue

Independent `@axe-core/playwright` runs at 1440×900 and 390×844 report no serious or critical findings. Both report `landmark-complementary-is-top-level` (moderate, one node) because the telemetry `<aside>` is nested where it does not represent a top-level complementary landmark.

### P3 — plain-words audit artifact is missing

`.factory/copy-audit.md` is absent. The first screen and section copy also use metaphor/brand-lore phrasing prohibited by the supplied plain-words contract, including “Make the bug play itself,” “flight recorder,” “Bench test,” and “No exhaust trail.”

## Clean-checkout quality gates

The initial tree was clean, on `main`, and exactly at the requested candidate.

| Gate | Result |
| --- | --- |
| `.factory/claims.json` and every listed command | **FAIL — file missing; zero claim commands available** |
| `npm ci` | PASS — 217 packages, 0 vulnerabilities |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm test` | PASS — 18/18 Vitest tests |
| Phaser seeded-failure fixture | PASS — 20/20 reproduced (100%, target 90%) |
| `npm run build` | PASS — ESM, CJS, declarations, and `dist/site/` |
| `npm run test:e2e` | PASS — 19 passed, 1 intentional desktop-project skip |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities |
| `npm pack` | PASS — 7 files, 10,465 bytes packed, 48,879 bytes unpacked, no bundled dependencies |

The repository E2E suite uses the pinned Playwright 1.58.2 and covers desktop Chromium and 390×844 mobile Chromium.

## Packed library and public API

A fresh temporary consumer installed the generated `sociobot-replay-capsule-0.1.4.tgz` with `--ignore-scripts --omit=dev`. `npm ls --omit=dev --all` contained only `@sociobot/replay-capsule@0.1.4`.

- CommonJS recorder/checkpoint/export flow passed.
- ESM validation/player flow emitted `ArrowRight,done` and finished.
- `maxBytes=4095` and `1,000,001` reject; `4,096` accepts.
- Empty and 121-character recorder checkpoint labels reject.
- An oversized checkpoint returns `false`, changes state to `limit-reached`, and leaves a 157-byte export under its 4,096-byte cap.
- Unsupported versions, invalid gamepad timestamp/index, events after duration, non-JSON seeds, zero playback speed, malformed JSON, and imports over 1 MB reject with the expected error categories.
- A valid import immediately after invalid inputs succeeds.

The separate schema inconsistency for imported checkpoint labels is recorded above.

## Independent live end-to-end exercise

The live flow was exercised independently at 1440×900 and 390×844, not only through repository tests.

- Before opt-in, ArrowLeft leaves the event count at 0.
- Keyboard-only Tab navigation reaches **Arm & start** (9 stops desktop, 7 mobile); Enter starts recording.
- The focused control shows a 3 px solid `rgb(164, 71, 33)` ring with 3 px offset.
- Key and mocked gamepad events were downloaded in bounded JSON capsules; a separate real browser click produced normalized pointer move/down/up events.
- Light-DOM input and open-Shadow-DOM input, textarea, select, and editable controls all remained at 0 captured events while typing/selecting.
- A malformed JSON import says what failed and directs the user to choose a Replay Capsule JSON file under 1 MB.
- Importing the just-downloaded valid capsule recovers immediately; keyboard focus advances from the import control to **Replay capsule**, and replay completes.
- A warm-loaded page records, imports, and replays while offline.
- No horizontal overflow occurred at either viewport.
- All checked visible interactive targets were at least 44×44 CSS px.
- No console errors, page errors, failed requests, or HTTP error responses occurred.
- Reduced-motion mode produced `scroll-behavior: auto`, a 0.00001 s timeline transition, and zero running animations.

Factory `verify-url.sh` passed with HTTP 200, title, `lang=en`, one H1, one main landmark, image alt text, labeled buttons, and no browser errors. Evidence: [verify-url JSON](verification-evidence/verify-url/verify.json).

## Privacy, network, and response policy

The complete initial and exercised request logs used only `https://browser-game-replay-capsule.sociobot.in`; there were no third-party runtime requests. Both browser contexts had:

- zero cookies;
- zero localStorage/sessionStorage keys; and
- zero service-worker registrations.

Source inspection found no fetch, XHR, WebSocket, beacon, analytics, browser persistence, product-unlock call, or authentication flow. The package/site is static, has no server-side product endpoint, and does not require sign-in. API rate-limit/429, backend concurrency/persistence, Entra authority, and PWA service-worker update tests are therefore not applicable.

Playwright observed these live response headers:

- HTML: `Cache-Control: public, must-revalidate, max-age=30`;
- hashed JS/CSS/assets: `Cache-Control: public, max-age=31536000, immutable`;
- self-only CSP with `frame-ancestors 'none'`;
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`;
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`;
- strict-origin referrer policy; and
- HSTS with includeSubDomains/preload.

The previously reported deployment-policy defect is fixed.

## Deployment identity

The exact local production build was compared to the public deployment after the build. All 30 deployable files checked (HTML, JS, CSS, images, fonts, favicon, robots, and sitemap; host-only configuration files excluded) returned 200 and matched SHA-256: **30 checked, 0 mismatches**.

Representative hashes:

| Artifact | SHA-256 (local and live) |
| --- | --- |
| `index.html` | `8c19483d2696a38043c707333696ccc6a94954f115ecdaa49c89f6ba2a7ed7c0` |
| `privacy/index.html` | `9b405f8734ff7377de8af737e975b3b72c885f60967e4fe553bfdd0eba12e73a` |
| `terms/index.html` | `aaafa84339501acd21c8f3b064836b08999bc921b3240a9a4b865ea5126cfe99` |
| `assets/main-IlF-0k8a.js` | `47bc9e2f491c7e3f3cc597c5fdd0afd578abf581e11837e56a89e8761f75b3f5` |
| `assets/main-znmtkH4u.css` | `4c0d15010fe389c7cff75454824bf9dc7de31b768091823c295ef4bed34998d9` |
| hero WebP | `00b303ddd7558421684649d60746068a31644ddf84002fa7bb6c5d81db7418ff` |

## Performance and budgets

Fresh Lighthouse 13.0.1 mobile/default throttling, after retrying a Chromium renderer crash with `--disable-dev-shm-usage --disable-gpu`:

- Performance 100, Accessibility 100, Best Practices 100, SEO 100;
- FCP 1.23 s, LCP 1.38 s, Speed Index 1.23 s;
- TBT 0 ms, CLS 0.043; and
- total transfer 97,429 bytes.

Built asset sizes are within contract:

- initial JS 18,276 bytes raw (budget 200 KB; site-structure budget 150 KB gzip);
- main CSS 15,964 bytes raw (budget 50 KB);
- four actually requested Latin WOFF2 files total 68,044 bytes (budget 120 KB); and
- mobile hero WebP 13,250 bytes (budget 300 KB).

Navigation-only Lighthouse does not provide a meaningful INP measurement. The independent interactive flow completed without long-task, console, or response errors.

## Required release work

1. Add `.factory/claims.json`, one tagged observable test per claim, and run every claim through the sample-data demo entry point.
2. Replace the first-screen H1/support/action with the required plain description and add a genuine one-click `/demo` sandbox, banner, reset/exit actions, sample capsule/run, separate namespace, and `.factory/demo.md`.
3. Publish the package through the factory-owned npm workflow and prove install from an empty consumer.
4. Align imported checkpoint-label validation with the recorder.
5. Add a real 404 response/page and required canonical/social/apple metadata, sitemap route, footer attribution/build identity, and `.factory/copy-audit.md`.
6. Rerun all clean-checkout claim, package, browser, privacy, identity, and performance checks before changing the verdict.
