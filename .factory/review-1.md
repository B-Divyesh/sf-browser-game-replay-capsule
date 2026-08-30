# Adversarial first-read review 1 — Replay Capsule

**Reviewed:** 2026-08-30 UTC  
**Live URL:** https://browser-game-replay-capsule.sociobot.in  
**Commit tested:** `1f24ac0eb6bf3da16a63bd35e7c899ea528808ec`  
**Verdict:** **FAIL**

The core job is understandable and tryable on the first screen, and the declared product claims passed. The verdict remains FAIL because six concrete issues remain. None prevents the sample from running, but acceptance requires zero findings.

## Cold first read

Fresh Chromium contexts were opened at 390 × 844 and 1440 × 900. No scroll occurred before this assessment.

- **What it does:** Records a browser-game bug's inputs, timing, and seed in a small replay file so a developer can replay it.
- **For whom:** Solo developers of 2D browser games.
- **What to click first:** **Try it with sample data**.

This passes the five-second first-read check. The 390 px screen shows the exact headline, audience sentence, CTA, outcome note, and three facts without scrolling. The first screen does not create a blocking comprehension issue.

## Findings

### F-1-1 — P2: navigation does not move focus to the destination heading

**Location/evidence:** From `/`, activating header **Demo** navigated to `/demo/`. Immediately after the new document loaded, `document.activeElement` was `BODY#`; the destination heading is `<h1 id="demo-title">` with no `tabindex`. Going Back also left focus on `BODY#`.

**Why this fails:** A keyboard or screen-reader visitor receives no announced page context after navigation. This misses the required route-change focus behavior even though the URLs and Back navigation work.

**Concrete fix:** Give each route's sole `<h1>` `tabindex="-1"`; on `DOMContentLoaded`, move focus to it without scrolling (or retain focus only for a meaningful returning control). Add a browser test that follows Home → Demo and Back, then asserts the current route's `<h1>` is focused.

### F-1-2 — P3: the demo has two live canonical URLs

**Location/evidence:** Both `https://browser-game-replay-capsule.sociobot.in/demo` and `/demo/` return HTTP 200. The sitemap, canonical tag, and Open Graph URL use `/demo`, while every landing/demo CTA uses `/demo/`.

**Why this fails:** Visitors, crawlers, and shared links receive two equally valid page URLs. The canonical signal is present but internal navigation contradicts it.

**Concrete fix:** Choose one form. Prefer `/demo`; change internal links to it and configure `/demo/` as a redirect to `/demo` (or choose the trailing-slash form everywhere, including sitemap, canonical, and OG URL). Add an HTTP redirect/canonical consistency test.

### F-1-3 — P3: the designed 404 route lacks social metadata

**Location/evidence:** `site/404.html` has a title, description, canonical, favicon, and Apple touch icon, but contains no `og:*` or `twitter:*` tags. `/not-a-real-route` correctly returns the designed 404 page and HTTP 404.

**Why this fails:** The route does not meet the required per-route Open Graph and Twitter metadata baseline. A shared broken link has no product preview metadata.

**Concrete fix:** Add `og:type`, title, description, URL, image (with dimensions), and matching Twitter-card title, description, and image to `site/404.html`. Extend the metadata route test to include the 404 document.

### F-1-4 — P3: external navigation is not identified as external

**Location/evidence:** The landing header exposes the GitHub URL as **“Source”**; the footer uses **“GitHub”**. The same unqualified links occur on the demo and legal routes. They navigate away from `browser-game-replay-capsule.sociobot.in` and have no visible or accessible external-site indication.

**Why this fails:** A visitor cannot tell that activating the link leaves the product. This misses the external-link requirement and is especially surprising from the prominent mobile header.

**Concrete fix:** Use text such as **“Source on GitHub (external)”**, or add a visible external-link icon with an accessible name that says “external site”, consistently on every route. Add a crawl/DOM assertion for the external-link affordance.

### F-1-5 — P3: two README sentences exceed the 22-word hard cap

**Location/evidence:**

- `README.md`, **Phaser integration fixture**: “`tests/phaser-fixture.test.ts` imports 20 generated replay files into that model and reproduces all 20 seeded fault outcomes (the researched target is at least 18/20, or 90%).” — **25 words**.
- `README.md`, **Limits and browser behavior**: “It also rechecks the cap when final timing metadata changes on `stop()` or `export()`; it preserves whole retained entries and finalizes at the last retained timestamp when necessary.” — **28 words**.

**Why this fails:** Both break the plain-words hard cap and make implementation detail harder to scan during the first read of the documentation.

**Concrete fix:** Replace the first with: “`tests/phaser-fixture.test.ts` imports 20 generated replay files. It reproduces all 20 seeded fault outcomes. The target is 18 of 20 (90%).” Replace the second with: “On `stop()` or `export()`, the recorder rechecks the cap after timing changes. It keeps only whole entries that fit.”

### F-1-6 — P3: README makes an unlisted, ambiguous public-registry statement

**Location/evidence:** `README.md`, **Install**: “The factory release owner publishes the same package to the public npm registry.” The landing instead says registry publication is pending. `.factory/claims.json` has no claim or sandbox test for public-registry publication.

**Why this fails:** The present-tense sentence can reasonably be read as saying the package is available on npm, while the working documented route is the hosted tarball. It is also a claim-like promise not covered by the required claim inventory.

**Concrete fix:** Delete the sentence. The preceding tested sentence and install command are sufficient. If registry publication later becomes part of the product promise, state the exact package/version and add a clean-consumer registry-install claim test.

## Copy audit

Word counts count displayed words; code blocks, URLs as markup targets, and generated telemetry values are excluded. Technical API names are retained where the surrounding developer documentation defines them. No landing sentence exceeds 22 words. The two hard-cap failures above are the only copy findings.

### Landing page sentences and labels

| Copy | Words | Result |
| --- | ---: | --- |
| Local replay files for browser games | 6 | Pass |
| Replay browser-game bugs from a small file. | 7 | Pass |
| For solo 2D game developers who need a bug report that repeats the player’s inputs and timing. | 17 | Pass |
| Try it with sample data | 5 | Pass — result-naming CTA |
| Loads a seeded bug run you can replay. | 8 | Pass |
| Copy install command | 3 | Pass — result-naming verb |
| Runs locally | 2 | Pass |
| 128 KB default cap | 4 | Pass |
| No tracking or server calls | 5 | Pass |
| Input sequence / Same sequence | 4 | Pass |
| Seed, inputs, and timing in one capped file. | 9 | Pass |
| Start / The player opts in | 5 | Pass |
| Capture / Inputs, timing, and seed | 5 | Pass |
| Replay / Your game applies events | 5 | Pass |
| Live package demo | 3 | Pass |
| Record and replay a sample bug. | 7 | Pass |
| Start recording, steer the probe, and reach a red fault cell. | 11 | Pass |
| Download the file or import it again to replay the path. | 12 | Pass |
| Capture controls / Ready to record. / Start recording to begin a seeded run. | 12 | Pass |
| Arm & start / Stop recording / Reset run / Download capsule / Import capsule / Replay capsule | 13 | Pass — result-naming controls |
| No input has been captured yet. | 6 | Pass |
| Your run stays only in this tab until you download it. | 11 | Pass |
| Capsule telemetry | 2 | Pass |
| Captured: key codes, pointer positions, changed gamepad samples, your seed, and checkpoints. | 11 | Pass |
| Not captured: typed text, video, DOM content, identity, cookies, or network traffic. | 11 | Pass |
| What the library does / Keep the bug report small and private. | 12 | Pass |
| Use your game adapter / Your game adapter receives each stored event through a callback. | 14 | Pass |
| Stay inside the byte cap / The recorder stops before it crosses the configured cap. / Capped files stay small enough to share. | 23 | Pass — cap claim covers this copy |
| Control replay timing / Replay at normal speed or faster. / Pause, resume, and stop are available in the public API. | 20 | Pass |
| Install the library / Add replay capture to your game loop. | 11 | Pass |
| This versioned npm tarball is hosted with the documentation while registry publication is pending. | 14 | Pass |
| Local replay files for browser-game debugging. | 6 | Pass |

### README sentences

| Copy | Words | Result |
| --- | ---: | --- |
| Replay Capsule is a dependency-free TypeScript library for reproducible browser-game bug reports. | 12 | Pass — audience-specific technical terms |
| It records keyboard, pointer, and gamepad inputs with timing, a deterministic seed, and small checkpoints. | 15 | Pass |
| It then exports one capped JSON file your game can replay. | 11 | Pass |
| It is for solo developers shipping small 2D browser games. | 10 | Pass |
| It is not video recording, analytics, session tracking, server playback, or anti-cheat. | 12 | Pass |
| Open the sample demo, or select Try it with sample data on the landing page. | 15 | Pass |
| It loads a seeded fault capsule with one pointer input and checkpoint. | 12 | Pass |
| The demo is isolated in `demo:replay-capsule:memory`, writes no browser storage, and is discarded when you reset or leave it. | 19 | Pass |
| This versioned npm tarball is available now. | 7 | Pass |
| The factory release owner publishes the same package to the public npm registry. | 13 | **F-1-6** |
| Recording is always opt-in: connect `start()` to a clear user action. | 11 | Pass |
| Text inputs, textareas, selects, and editable elements are never captured. | 10 | Pass |
| The player owns scheduling; your game owns meaning. | 8 | Pass — API distinction is explained by the next sentence |
| `onEvent` receives the same normalized event shape stored in the capsule. | 11 | Pass |
| `pause()`, `resume()`, and `stop()` are available for debugger controls. | 9 | Pass |
| Use `speed` to accelerate playback. | 5 | Pass |
| See the live documentation and working Canvas demo at the product site. | 10 | Pass |
| The repository includes a small Phaser 3 scene that records from Phaser’s canvas and replays an imported file through the scene’s input adapter. | 21 | Pass |
| Its deterministic game model lives beside it so the behavior is easy to audit without bundling Phaser into this dependency-free package. | 21 | Pass |
| `tests/phaser-fixture.test.ts` imports 20 generated replay files into that model and reproduces all 20 seeded fault outcomes (the researched target is at least 18/20, or 90%). | 25 | **F-1-5** |
| Run it with the full test suite. | 6 | Pass |
| The package exports ESM, CommonJS, and declarations. | 7 | Pass |
| The `ReplayEvent`, `ReplayCheckpoint`, `ReplayCapsule`, recorder/player option, state, and status types are public. | 12 | Pass |
| Default cap: 128 KB; supported range: 4 KB–1 MB. | 10 | Pass |
| The recorder stops before an event would cross the cap and reports `limit-reached`. | 13 | Pass |
| It also rechecks the cap when final timing metadata changes on `stop()` or `export()`; it preserves whole retained entries and finalizes at the last retained timestamp when necessary. | 28 | **F-1-5** |
| Accounting and the downloaded file use the same compact JSON bytes, so a capped recorder export stays importable. | 18 | Pass |
| Pointer coordinates are normalized to the configured target when possible. | 11 | Pass |
| Key identity uses `KeyboardEvent.code`, not typed characters. | 7 | Pass |
| Text-entry events are ignored in light, open-shadow, and closed-shadow DOM. | 10 | Pass |
| Ambiguous events retargeted from a possible closed-shadow host fail closed. | 10 | Pass |
| Gamepads are sampled once per animation frame, but browser gamepad timestamps are inconsistent. | 14 | Pass |
| Replay Capsule timestamps the sample at observation time and stores the browser timestamp only as optional diagnostic metadata. | 18 | Pass |
| Capsule imports are schema-validated and reject malformed, unsupported, or over-limit files. | 12 | Pass |
| No network requests, persistence, telemetry, cookies, or third-party runtime dependencies. | 11 | Pass |
| Requires Node.js 20+. | 3 | Pass |
| Deploy `dist/site` as the static root. | 6 | Pass |
| Run every command listed in `.factory/claims.json` when changing a listed product claim. | 12 | Pass |
| Package registry publication is left to the factory release workflow; `npm run build` also prepares the versioned tarball served by the site. | 22 | Pass |

The README API bullet labels are commands/signatures rather than reader-facing sentences. The landing and README use **capsule**, **seed**, **checkpoint**, **recording**, and **demo** consistently. The review found no banned marketing adjective, generic SaaS hero, metaphor-only heading, or non-result-naming primary button.

## Demo, privacy, and behaviour

- The landing CTA reaches `/demo/` in one click. The first demo screen already displays seed `RC-SAMPLE-FAULT-17`, one event, a `fault-contact` checkpoint, replay controls, and **Demo — sample data, nothing is saved.**
- **Reset demo** restored the same fresh sample. **Start for real** returned to `/` and changed the in-memory namespace from `demo:replay-capsule:memory` to `real:replay-capsule:memory`.
- In a fresh 390 px context, localStorage, sessionStorage, cookies, IndexedDB data, cache storage, and service-worker registrations were empty through the demo path. Request logging recorded only same-origin static URLs. No console or page error occurred.
- The product needs no additional AI feature: the brief is an offline/local replay library, and the already present import/export/replay flow is the direct job-to-be-done.

## Claims gate

A separate clean clone at the reviewed commit ran `npm ci`, then every exact command listed in `.factory/claims.json`. All 19 claim commands passed. The subsequent complete suites also passed: `npm test` (29/29), `npm run typecheck`, `npm run lint`, `npm run build`, and `npm run test:e2e` (32 passed, one expected desktop-only skip).

| Claims | Result |
| --- | --- |
| `sample-demo`, `no-network-calls`, `opt-in-recording`, `text-entry-excluded`, `record-export-replay`, `pointer-normalization`, `offline-demo` | Pass |
| `checkpoint-capture`, `default-byte-cap`, `custom-cap-range`, `validated-import`, `gamepad-sampling`, `adapter-callbacks`, `replay-controls`, `seeded-failure-fixture` | Pass |
| `package-formats`, `installable-release`, `zero-runtime-dependencies`, `mit-license` | Pass |

All claim-like landing and README statements were cross-checked against the inventory. F-1-6 is the one uncovered registry statement. The request log confirms the privacy/network claim in the browser demo; the sample path does not persist real data. The library's packaged consumer and playground are covered by the passing release/demo tests.

## Earlier-review regression check

There are no earlier `review-*.md` or `polish-*.md` files. Every finding in the existing verification and handoff history was rechecked live and in code rather than accepted from its prior status.

| Earlier finding | Current confirmation |
| --- | --- |
| Missing live CSP/cache/clickjacking policy | Fixed: live headers include self-only CSP, `frame-ancestors 'none'`, `X-Frame-Options: DENY`, permissions policy, and immutable asset policy. |
| Malformed gamepad metadata accepted | Fixed: `validated-import` and the full unit suite pass. |
| Public npm install unavailable | Fixed documentation now uses the working tested hosted tarball; no registry install is promised as the install path. F-1-6 separately flags the ambiguous remaining sentence. |
| Downloaded or stopped near-cap capsule can exceed its cap | Fixed: `default-byte-cap` and full library suite pass. |
| Hidden import control has no visible focus | Fixed: focusing `#import` produces a 3 px amber outline on the visible 149 × 75.6 px import label. |
| Mobile targets are under 44 px | Fixed: all visible link/button targets across landing, demo, legal, and 404 routes meet 44 × 44 px at 390 px. |
| No Phaser success-measure fixture | Fixed: the shipped fixture claim passed with all 20 seeded outcomes. |
| Shadow-DOM text can be recorded | Fixed: `text-entry-excluded` passes in both desktop and mobile projects, including closed-shadow coverage. |
| Claims manifest/inventory absent or incomplete | Fixed: 19 declared claims each have a tagged test; every command passed in the fresh clone. |
| Cold demo contract, 404 route, metadata baseline, landmark, and copy-audit artifact absent | Fixed except for the new, narrower F-1-3 404 social-metadata gap. The sample/demo, designed 404, landmark checks, and existing copy audit are present. |
| `package-formats` exact command times out | Fixed: its exact claim command and the complete unit suite pass from this clean clone. |

## Structure and accessibility checks

- `/`, `/demo/`, `/privacy/`, and `/terms/` returned 200; an unknown route returned the designed HTTP 404. Routes have one `<h1>`, `<main>`, `lang="en"`, title, description, canonical, favicon, and Apple touch icon.
- `robots.txt` and `sitemap.xml` are present. Headers and footers consistently include the wordmark, legal links, and product/build line.
- The hero is a distinct, documented mid-century instrument-panel system rather than a generic SaaS template. It matches `.factory/design.md` in palette, self-hosted type, instrument illustration, and reduced-motion behavior.
- The demo and site navigation had no console/page errors in the normal flow. The deliberate HTTP-404 document naturally logs the browser's failed-resource message; it has no page-script error.
- The focus and external-link findings above remain. The 404 social-metadata and duplicate demo-URL findings remain.

## What would make this perfect

Resolve F-1-1 through F-1-6, add the proposed regression checks, and rerun the exact claim commands plus the live mobile/desktop route crawl. At that point the product would have a clear first read, an immediate isolated demo, tested claims, and no remaining acceptance findings.
