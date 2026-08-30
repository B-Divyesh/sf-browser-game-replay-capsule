# Adversarial first-read review 2 — Replay Capsule

**Reviewed:** 2026-08-30 UTC  
**Live URL:** https://browser-game-replay-capsule.sociobot.in  
**Commit tested:** `f5a17c28fc8354f0ac7db4544edb52828fcb6f45`  
**Verdict:** **FAIL**

The landing page explains the job, audience, and first action. The live library flow also records, downloads, imports, and replays. Acceptance still fails because the phone demo does not show the seeded product UI in its first viewport, two claim tests do not prove their stated outcomes, and twelve lower-severity copy, claims-inventory, and structure findings remain.

## Cold first read

Fresh Chromium contexts opened `/` at 390 × 844 and 1440 × 900. No scroll occurred before this assessment.

| Question | Answer from the first screen | Evidence |
| --- | --- | --- |
| What does this do? | It records browser-game inputs, timing, and a seed in a small file that a game can replay. | “Replay browser-game bugs from a small file.” and “Loads a seeded bug run you can replay.” |
| For whom? | Solo developers of 2D browser games. | “For solo 2D game developers…” |
| What should I click first? | **Try it with sample data**. | The primary action is visible without scrolling at both sizes. |

The required three questions pass. At 390 px, the three short facts end at 831 px and remain inside the 844 px viewport. At 1440 × 900, the facts begin at 930 px and fail the first-screen layout requirement; see F-2-8.

## Findings

### F-2-1 — BLOCKING: the phone demo does not show the product in use in its first screen

**Location/evidence:** Follow **Try it with sample data** from a fresh 390 × 844 landing page. The resulting `/demo` viewport shows the 175 px demo banner, a large empty gap, the four-line heading “Replay a sample browser-game bug.”, and its explanation. The `.workbench` begins at 826.7 px, the canvas at 904.7 px, and the sample telemetry at 1508.6 px. Only the workbench border reaches the first viewport; the seed, event count, game, and **Replay capsule** control are all below it. `site/style.css:88-96` supplies 112 px section padding, a 24 px demo-page margin, a 48 px intro margin, and the large global h1; the mobile rule at `site/style.css:175-176` changes this to 80 px padding and a larger 72 px top margin.

**Why this fails:** The first screen after the one-click demo does not already look like the product being used with realistic sample data. A phone visitor must scroll before seeing any evidence that a capsule loaded or any action that replays it. This is the explicit blocking condition in the demo contract.

**Concrete fix:** Make `/demo` a compact application view on phones. Keep the banner, reduce demo-only top spacing and heading size, and place a visible sample summary such as **Seed RC-SAMPLE-FAULT-17 · 1 event · fault-contact** beside **Replay sample** above the canvas. Add a 390 × 844 test that asserts the sample summary and primary replay control have bounding-box bottoms no greater than the viewport height.

### F-2-2 — BLOCKING: the Phaser success claim never runs the Phaser fixture

**Location/evidence:** `.factory/claims.json:94-98` says, “The Phaser fixture reproduces at least 90% of 20 seeded failures.” `tests/phaser-fixture.test.ts:1-31` imports only `createPlayer`, `importCapsule`, and `examples/seeded-failure-model.ts`. It never imports or instantiates `SeededFailureScene` from `examples/phaser-seeded-failure.ts`, never starts Phaser, and never passes events through the scene adapter. The exact command passes 20 pure-model trials, not 20 Phaser fixture trials. README lines 68-72 repeat the Phaser integration claim.

**Why this fails:** The researched success measure is specifically a Phaser/Kaplay integration outcome. The tagged test can remain green if the Phaser scene cannot initialize, cannot record from its canvas, or cannot replay its imported file. The declared claim is therefore untested despite a passing command.

**Concrete fix:** Run the shipped `SeededFailureScene` in a browser-based Phaser fixture, import 20 generated capsules through `replayImportedCapsule`, and assert at least 18 scene failures reproduce. If a real Phaser test is not intended, rename the claim and README section to **Deterministic model fixture** and stop claiming Phaser integration.

### F-2-3 — BLOCKING: the record/export/import/replay test does not verify the replayed sequence or outcome

**Location/evidence:** `.factory/claims.json:31-35` promises that the demo “replays the same event sequence.” In `tests/e2e/site.spec.ts:131-151`, the test records four key events, checks the imported message says four events, clicks replay, and accepts any message containing “Replay complete”. It does not inspect the downloaded event sequence, the replay callbacks, the final probe position, or a reproduced checkpoint. `site/main.ts` can emit a generic “Replay complete” message even when no recorded outcome is reproduced.

**Why this fails:** The tagged test proves that the workflow finishes, not that the imported sequence is the one replayed. This misses the observable result in the claim and would pass a replay loop that ignores or reorders events.

**Concrete fix:** Parse the downloaded capsule and retain its exact ordered events. After import and replay, assert an observable game-state result or instrument the demo adapter to expose the applied event sequence, then compare it exactly with the capsule. Require the reproduced-outcome message rather than a substring shared by the generic fallback.

### F-2-4 — P2: real-mode no-persistence statements are not listed as a claim

**Location/evidence:** Landing: “Your run stays only in this tab until you download it.” (`site/index.html:107`). README: “No network requests, persistence, telemetry, cookies, or third-party runtime dependencies.” (`README.md:95`). Privacy: “A capsule remains in the current browser tab until it is downloaded” and “Replay Capsule does not upload, persist, sell, or share capsule data.” (`site/privacy/index.html:22`). `sample-demo` covers demo storage only; no claim entry covers real-mode persistence.

**Why this fails:** A visitor can rely on these privacy statements for real recordings, but the manifest has no matching test. The manual sentinel check passed in this review, but that is not a repeatable product claim gate.

**Concrete fix:** Add a `no-browser-persistence` claim and browser test. Record, reset, download, import, replay, reload, and leave real mode while asserting no localStorage, sessionStorage, IndexedDB, Cache Storage, cookie, or service-worker write. Retain a pre-existing real-data sentinel to confirm the tool does not alter host data.

### F-2-5 — P2: broad capture-exclusion statements are only partially covered

**Location/evidence:** Landing and demo: “Not captured: typed text, video, DOM content, identity, cookies, or network traffic.” (`site/index.html:121`, `site/demo.html:59`). README also says the library is not “video recording, analytics, session tracking, server playback, or anti-cheat” (`README.md:5`). The `text-entry-excluded` claim tests typed text. `no-network-calls` tests outgoing requests. Neither claim tests whether DOM content, identity, cookies, network traffic, or video-derived data can enter an exported capsule.

**Why this fails:** The sentence makes several privacy promises under one label, but only one capture exclusion has a matching regression. “Makes no network calls” is not the same as “does not capture network traffic.”

**Concrete fix:** Either narrow the copy to **Not captured: typed text** or add a `capture-surface` claim. Its browser test should set DOM text, identity-like values, cookies, and a same-origin request while recording, then download and inspect every capsule field to confirm that only the documented event, seed, and checkpoint fields exist.

### F-2-6 — P2: “small enough to share” is subjective, unlisted, and untestable

**Location/evidence:** “Capped files stay small enough to share.” (`site/index.html:134`). No `.factory/claims.json` entry defines a sharing limit or test.

**Why this fails:** Different channels have different size limits, so a visitor cannot know what “small enough” guarantees. The phrase adds an untestable marketing claim beside a precise cap claim.

**Concrete fix:** Replace it with the listed fact: **The default cap is 128 KB.**

### F-2-7 — P2: the Node.js compatibility requirement is an unlisted claim

**Location/evidence:** “Requires Node.js 20+.” (`README.md:99`). The package declares `engines.node >=20`, but `.factory/claims.json` has no compatibility entry and the review ran under Node 22.23.2.

**Why this fails:** Consumers rely on the minimum runtime version. Metadata declaration alone does not prove the built ESM and CommonJS artifacts work on Node 20.

**Concrete fix:** Add a `node-20-runtime` claim tested in a pinned Node 20 clean consumer for both `import` and `require`, or state only that the development scripts are maintained on the actually tested Node version.

### F-2-8 — P2: the desktop first screen omits the three required facts

**Location/evidence:** On a fresh 1440 × 900 context, `.trust-line` begins at y=930.3 px. “Runs locally”, “128 KB default cap”, and “No tracking or server calls” require scrolling. The title, audience, CTA, and CTA outcome remain visible.

**Why this fails:** The standard first-screen structure requires its three short facts without scrolling. The unusually large five-line headline consumes the available height. F-2-10 separately covers the content of those facts.

**Concrete fix:** Reduce the desktop hero top padding or headline scale/measure so the entire trust line ends within a 900 px viewport. Add a desktop viewport assertion for the bottom of `.trust-line`.

### F-2-9 — P2: header and footer navigation is not consistent across routes

**Location/evidence:** At widths below 680 px, `site/style.css:164` hides every header link except `:last-child`. That leaves **Source** on `/` and `/demo`, **Terms** on `/privacy/`, and **Privacy** on `/terms/` and the 404. The 404 footer contains only **Home** and **Terms** (`site/404.html:29`), omitting the required Privacy link. Other footers include Privacy and Terms.

**Why this fails:** The same header position produces an arbitrary destination depending on route, and the designed 404 loses a required legal link. A phone visitor cannot build a stable navigation model.

**Concrete fix:** Use one shared mobile nav with the same destinations and a compact menu when space is tight. Include Privacy and Terms in every footer, including the 404. Add route-by-route desktop and 390 px assertions for the expected navigation set.

### F-2-10 — P2: the first-screen facts omit price and do not state offline behavior

**Location/evidence:** The three facts are “Runs locally”, “128 KB default cap”, and “No tracking or server calls” (`site/index.html:52-56`). “Runs locally” does not say whether the tool survives loss of network access, and none of the facts says that the product is free. The terms page later calls it free under MIT.

**Why this fails:** The required first-screen fact set is privacy, offline behavior, and price. A local library can still require network services, and a visitor should not have to find the Terms page to learn the price.

**Concrete fix:** Use three precise, already testable facts such as **Works offline after this page loads**, **Free under the MIT License**, and **No tracking or server calls**. Move the 128 KB cap beside the feature explanation. Keep the offline and MIT wording aligned with the existing `offline-demo` and `mit-license` claims.

### F-2-11 — P3: one README sentence exceeds the 22-word limit

**Location/evidence:** “The repository includes a small Phaser 3 scene that records from Phaser's canvas and replays an imported file through the scene's input adapter.” (`README.md:70`) — **23 words** by whitespace-separated visible-word count.

**Why this fails:** It exceeds the plain-words hard cap and combines existence, recording, importing, and adapter behavior.

**Concrete fix:** Use: **The repository includes a small Phaser 3 scene. It records from Phaser’s canvas and replays imported files through the scene adapter.**

### F-2-12 — P3: “Arm & start” is a metaphorical, non-result-naming button

**Location/evidence:** The primary recording control says **Arm & start** on both landing and demo (`site/index.html:95`, `site/demo.html:49`).

**Why this fails:** “Arm” borrows the instrument-panel metaphor and does not name the result. The rest of the interface uses the plain term “recording.”

**Concrete fix:** Rename the button **Start recording** and update its test locators and the `opt-in-recording` sandbox description.

### F-2-13 — P3: “telemetry” contradicts the privacy terminology

**Location/evidence:** The visible panel heading is **Capsule telemetry** (`site/index.html:111`, `site/demo.html:55`), while README line 95 promises “No … telemetry”.

**Why this fails:** One word describes local counters in the UI and prohibited data collection in the privacy copy. A first-time visitor cannot know which meaning applies.

**Concrete fix:** Rename the panel **Capsule details**. Keep “telemetry” only for the statement that the library sends none.

### F-2-14 — P3: “player” names two different concepts and the README uses a metaphor

**Location/evidence:** Landing: “The player opts in” (`site/index.html:66`) means the person playing the game. README: “The player owns scheduling; your game owns meaning.” (`README.md:46`) means the `ReplayPlayer` object and uses “owns meaning” as metaphor.

**Why this fails:** The same word refers to a person and an API object, and the README sentence does not state the actual division of work directly.

**Concrete fix:** Use **A person starts recording** on the landing flow. Replace the README sentence with **Replay Capsule schedules stored events. Your game decides what each event does.**

### F-2-15 — P3: “fail closed” is unexplained security jargon

**Location/evidence:** “Ambiguous events retargeted from a possible closed-shadow host fail closed.” (`README.md:92`).

**Why this fails:** A developer must decode both event retargeting and “fail closed” to learn the useful behavior.

**Concrete fix:** Use: **If an event may come from a text field in closed Shadow DOM, the library does not record it.**

## Copy audit

Counts use whitespace-separated visible words; a hyphenated term, inline API name, or rendered link label counts as one word. Code blocks and generated values are excluded. Every landing-page sentence, heading, status, fact, and button label in the initial state is listed because the button and heading rules apply beyond grammatical sentences.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Local replay files for browser games | 6 | Pass |
| Replay browser-game bugs from a small file. | 7 | Pass |
| For solo 2D game developers who need a bug report that repeats the player’s inputs and timing. | 17 | Pass |
| Try it with sample data | 5 | Pass; result-naming action |
| Loads a seeded bug run you can replay. | 8 | Pass |
| Copy install command | 3 | Pass; result-naming action |
| Runs locally | 2 | **F-2-10: does not state the tested offline condition** |
| 128 KB default cap | 4 | Pass |
| No tracking or server calls | 5 | Pass; the first-screen set still lacks price under F-2-10 |
| Input sequence | 2 | Pass |
| Same sequence | 2 | Pass |
| Seed, inputs, and timing in one capped file. | 8 | Pass |
| Start | 1 | Pass as a flow step |
| The player opts in | 4 | **F-2-14: inconsistent term** |
| Capture | 1 | Pass as a flow step |
| Inputs, timing, and seed | 4 | Pass |
| Replay | 1 | Pass as a flow step |
| Your game applies events | 4 | Pass |
| Live package demo | 3 | Pass |
| Record and replay a sample bug. | 6 | Pass |
| Start recording, steer the probe, and reach a red fault cell. | 11 | Pass |
| Download the file or import it again to replay the path. | 11 | Pass |
| Capture controls | 2 | Pass |
| Ready | 1 | Pass |
| Ready to record | 3 | Pass |
| Start recording to begin a seeded run. | 7 | Pass |
| Arrow keys steer; pointer moves probe; avoid fault cells | 9 | Pass |
| Arm & start | 3 | **F-2-12: metaphorical button** |
| Stop recording | 2 | Pass |
| Reset run | 2 | Pass |
| Download capsule | 2 | Pass |
| Import capsule | 2 | Pass |
| Replay capsule | 2 | Pass |
| No input has been captured yet. | 6 | Pass |
| Your run stays only in this tab until you download it. | 11 | **F-2-4: unlisted claim** |
| Capsule telemetry | 2 | **F-2-13: inconsistent jargon** |
| Captured: key codes, pointer positions, changed gamepad samples, your seed, and checkpoints. | 12 | Pass |
| Not captured: typed text, video, DOM content, identity, cookies, or network traffic. | 12 | **F-2-5: partially unlisted claim** |
| What the library does | 4 | Pass |
| Keep the bug report small and private. | 7 | Pass |
| Use your game adapter | 4 | Pass |
| Your game adapter receives each stored event through a callback. | 10 | Pass |
| Stay inside the byte cap | 5 | Pass |
| The recorder stops before it crosses the configured cap. | 9 | Pass |
| Capped files stay small enough to share. | 7 | **F-2-6: subjective unlisted claim** |
| Control replay timing | 3 | Pass |
| Replay at normal speed or faster. | 6 | Pass |
| Pause, resume, and stop are available in the public API. | 10 | Pass |
| Install the library | 3 | Pass |
| Add replay capture to your game loop. | 7 | Pass |
| Copy code | 2 | Pass; result-naming action |
| This versioned npm tarball is hosted with the documentation while registry publication is pending. | 14 | Pass; mapped to `installable-release` |
| Local replay files for browser-game debugging. | 6 | Pass |
| An illustrated cream and petrol recorder passing the same sequence of game-event shapes from one side to the other. | 19 | Pass; hero image alt text |
| Probe navigation game. | 3 | Pass; canvas accessible description |
| Use arrow keys or click to move; avoid striped fault cells and reach the round beacon. | 16 | Pass; canvas accessible instruction |

The demo-mode banner adds: “Demo — sample data, nothing is saved.” (6, pass), “This run stays in memory and is discarded when you leave.” (10, mapped to `sample-demo`), **Reset demo** (2, pass), and **Start for real** (3, pass).

The remaining non-sentence labels are destination or control names: **Replay Capsule** (2), **Demo** (1), **Install** (1), **Privacy** (1), **Terms** (1), **Source** (1), **GitHub** (1), **Replay progress** (2), **Capsule capacity used** (3), and **TypeScript recorder example** (3). They are clear in context.

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Replay Capsule is a dependency-free TypeScript library for reproducible browser-game bug reports. | 12 | Pass |
| It records keyboard, pointer, and gamepad inputs with timing, a deterministic seed, and small checkpoints. | 15 | Pass |
| It then exports one capped JSON file your game can replay. | 11 | Pass |
| It is for solo developers shipping small 2D browser games. | 10 | Pass |
| It is not video recording, analytics, session tracking, server playback, or anti-cheat. | 12 | **F-2-5 for the unlisted capture/privacy parts** |
| Open the sample demo, or select Try it with sample data on the landing page. | 15 | Pass |
| It loads a seeded fault capsule with one pointer input and checkpoint. | 12 | Pass |
| The demo is isolated in demo:replay-capsule:memory, writes no browser storage, and is discarded when you reset or leave it. | 19 | Pass; mapped to `sample-demo` |
| This versioned npm tarball is available now. | 7 | Pass; mapped to `installable-release` |
| Recording is always opt-in: connect start() to a clear user action. | 11 | Pass |
| Text inputs, textareas, selects, and editable elements are never captured. | 10 | Pass |
| The player owns scheduling; your game owns meaning. | 8 | **F-2-14: ambiguous term and metaphor** |
| onEvent receives the same normalized event shape stored in the capsule. | 11 | Pass |
| pause(), resume(), and stop() are available for debugger controls. | 9 | Pass |
| Use speed to accelerate playback. | 5 | Pass |
| See the live documentation and working Canvas demo at browser-game-replay-capsule.sociobot.in. | 10 | Pass |
| The repository includes a small Phaser 3 scene that records from Phaser’s canvas and replays an imported file through the scene’s input adapter. | 23 | **F-2-11: over 22 words; F-2-2: behavior not exercised** |
| Its deterministic game model lives beside it so the behavior is easy to audit without bundling Phaser into this dependency-free package. | 21 | Pass |
| tests/phaser-fixture.test.ts imports 20 generated replay files. | 6 | Pass |
| It reproduces all 20 seeded fault outcomes. | 7 | **F-2-2: test does not run Phaser** |
| The target is 18 of 20 (90%). | 7 | **F-2-2: test does not run Phaser** |
| Run it with the full test suite. | 7 | Pass |
| createRecorder(options) → start, stop, clear, checkpoint, export, plus live state and status getters. | 13 | Pass |
| importCapsule(string \| Blob \| object, maxBytes?) → validates and resolves a versioned ReplayCapsule. | 13 | Pass |
| validateCapsule(value) → synchronously validates trusted in-memory input. | 7 | Pass |
| createPlayer(capsule, options) → play, pause, resume, and stop with event, checkpoint, state, and progress callbacks. | 15 | Pass |
| downloadCapsule(capsule, filename?) → starts a local JSON download. | 8 | Pass |
| The package exports ESM, CommonJS, and declarations. | 7 | Pass |
| The ReplayEvent, ReplayCheckpoint, ReplayCapsule, recorder/player option, state, and status types are public. | 12 | Pass |
| Default cap: 128 KB; supported range: 4 KB–1 MB. | 9 | Pass |
| The recorder stops before an event would cross the cap and reports limit-reached. | 13 | Pass |
| On stop() or export(), the recorder rechecks the cap after timing changes. | 12 | Pass |
| It keeps only whole entries that fit. | 7 | Pass |
| Accounting and the downloaded file use the same compact JSON bytes, so a capped recorder export stays importable. | 18 | Pass |
| Pointer coordinates are normalized to the configured target when possible. | 10 | Pass |
| Key identity uses KeyboardEvent.code, not typed characters. | 7 | Pass |
| Text-entry events are ignored in light, open-shadow, and closed-shadow DOM. | 10 | Pass |
| Ambiguous events retargeted from a possible closed-shadow host fail closed. | 10 | **F-2-15: unexplained jargon** |
| Gamepads are sampled once per animation frame, but browser gamepad timestamps are inconsistent. | 13 | Pass |
| Replay Capsule timestamps the sample at observation time and stores the browser timestamp only as optional diagnostic metadata. | 18 | Pass |
| Capsule imports are schema-validated and reject malformed, unsupported, or over-limit files. | 11 | Pass |
| No network requests, persistence, telemetry, cookies, or third-party runtime dependencies. | 10 | **F-2-4 for the unlisted real-mode persistence part** |
| Requires Node.js 20+. | 3 | **F-2-7: unlisted compatibility claim** |
| Deploy dist/site as the static root. | 6 | Pass |
| Run every command listed in .factory/claims.json when changing a listed product claim. | 12 | Pass |
| Package registry publication is left to the factory release workflow; npm run build also prepares the versioned tarball served by the site. | 22 | Pass |

README headings are also plain and contextual: **Replay Capsule** (2), **Try the sample demo** (4), **Install** (1), **Record** (1), **Import and replay** (3), **Phaser integration fixture** (3), **API** (1), **Limits and browser behavior** (4), and **Development** (1). Executable code blocks are excluded from sentence counts.

No banned marketing adjective appears. The landing and README otherwise use **capsule**, **seed**, **checkpoint**, **recording**, and **demo** consistently.

## Demo, sandbox, and live behavior

- One click from the landing page reaches canonical `/demo`. The sample seed is `RC-SAMPLE-FAULT-17`, with one pointer event and a `fault-contact` checkpoint.
- The persistent banner says **Demo — sample data, nothing is saved.** **Reset demo** restored the one-event sample after a new recording changed the count to two. **Start for real** returned to `/` and changed the in-memory namespace to `real:replay-capsule:memory`.
- In a fresh context, demo localStorage, sessionStorage, IndexedDB, Cache Storage, cookies, and service-worker registrations were empty. A separate `real:review-sentinel` in localStorage and sessionStorage survived demo entry, reset, and exit unchanged.
- The complete landing → demo → replay request log contained only same-origin HTML, JS, CSS, fonts, and image files. No console or page error occurred.
- A live record/download/import/replay flow produced a four-event JSON capsule, imported four events, and completed replay. A malformed JSON import explained that the file was invalid and requested a Replay Capsule JSON file under 1 MB.
- F-2-1 remains because the loaded sample and replay control are below the first phone viewport.

## Claims gate

The repository was cloned without local changes to `/tmp/replay-review2-clean`, checked out at the reviewed commit, and installed with `npm ci`. Every exact command in `.factory/claims.json` returned exit status 0.

| Claim | Exact-command result | Adequacy |
| --- | --- | --- |
| `sample-demo` | Pass, 2 browser projects | Adequate for seeded data/reset/exit; F-2-1 is the separate first-screen failure |
| `no-network-calls` | Pass, 2 browser projects | Pass |
| `opt-in-recording` | Pass, 2 browser projects | Pass |
| `text-entry-excluded` | Pass, 2 browser projects | Pass |
| `record-export-replay` | Pass, 2 browser projects | **Fail — F-2-3** |
| `checkpoint-capture` | Pass, 1 tagged unit test | Pass |
| `default-byte-cap` | Pass, 1 tagged unit test | Pass |
| `custom-cap-range` | Pass, 1 tagged unit test | Pass |
| `validated-import` | Pass, 1 tagged unit test | Pass |
| `pointer-normalization` | Pass, 2 browser projects | Pass |
| `gamepad-sampling` | Pass, 1 tagged unit test | Pass |
| `adapter-callbacks` | Pass, 1 tagged unit test | Pass |
| `replay-controls` | Pass, 1 tagged unit test | Pass |
| `seeded-failure-fixture` | Pass, 1 tagged unit test | **Fail — F-2-2** |
| `package-formats` | Pass, 1 tagged package test | Pass |
| `installable-release` | Pass, 1 tagged clean-consumer test | Pass; live tarball also returned 200 and byte-matched the repository artifact |
| `zero-runtime-dependencies` | Pass, 1 tagged manifest test | Pass |
| `offline-demo` | Pass, 2 isolated browser contexts | Pass |
| `mit-license` | Pass, 1 tagged package test | Pass |

The commands pass, but the claims gate fails because F-2-2 and F-2-3 leave promised outcomes untested. F-2-4 through F-2-7 identify claim-like copy without a complete manifest entry.

## Earlier-review and handoff verification

The full `.factory/review-1.md`, `.factory/polish-1.md`, and current `.factory/handoff.md` were read. Each prior finding was checked live and in code rather than accepted from its recorded status.

| Earlier finding | Review 2 result |
| --- | --- |
| F-1-1 route-change focus | Fixed. Home → Demo focused the demo h1; Back focused the home h1. Both headings have `tabindex="-1"`, and `site/route-focus.ts` handles same-origin and history navigation. |
| F-1-2 duplicate demo URLs | Fixed. `/demo/` finishes at `/demo`; internal links, canonical, Open Graph URL, and sitemap use `/demo`. |
| F-1-3 missing 404 social metadata | Fixed. The live 404 has Open Graph and Twitter metadata, a canonical, favicon, description, one h1, and an HTTP 404 response for unknown paths. |
| F-1-4 external links unmarked | Fixed. Every existing GitHub link has a visible ↗ and an accessible name containing “external site”. |
| F-1-5 two long README sentences | Fixed as written. Both previously quoted sentences were split. F-2-11 is a separate 23-word sentence that review 1 miscounted as 21. |
| F-1-6 ambiguous npm-registry statement | Fixed. The statement was removed; only the hosted tarball is presented as available. |

The handoff's build, live-byte-match, request-isolation, accessibility, and route assertions were also rechecked. Root HTML, demo HTML, main JS, and the live tarball SHA-256-match the current checkout/build. The handoff's “Known gaps: None” is superseded by this review.

## Structure, accessibility, and quality checks

- `/`, `/demo`, `/privacy/`, and `/terms/` return 200. An unknown path returns the designed 404 with HTTP 404. Every HTML page has `lang="en"`, one h1, one main landmark, a route-specific title, description, canonical, Open Graph/Twitter metadata, favicon, and Apple touch icon.
- The root title is **Replay Capsule — replay browser-game bugs**, which follows the required product/job pattern and is under 60 characters. Legal and demo titles follow the route pattern.
- Every internal link and hash target on the 200 routes returned 200. The 404 skip link correctly remains within its HTTP-404 document. GitHub, favicon, Apple icon, social image, and the release tarball returned 200. `/demo/` normalized to `/demo`.
- Back navigation and route focus work. All visible interactive targets measured at least 44 × 44 px at 390 px. Live Playwright Axe scans found zero violations on the landing, demo, Privacy, Terms, and 404 documents.
- `/opt/fleet/lib/verify-url.sh` passed the live root: title, `lang=en`, one h1, main, complete image alt coverage, labeled buttons, and no console errors.
- Live response headers include the self-only CSP, `frame-ancestors 'none'`, `X-Content-Type-Options`, Referrer Policy, Permissions Policy, and `X-Frame-Options: DENY`. Normal HTML flows logged no console or page errors.
- `npm run check` passed in the clean clone: typecheck; 30/30 Vitest tests; production build; 37 Playwright tests passed with one expected skip. The build produced `dist/`; main JS is 18,851 bytes raw and 7,089 bytes gzip.
- The 1200 × 630 social image, 180 × 180 Apple icon, and 600 × 400 hero image have the documented dimensions. Fonts and runtime assets are self-hosted.
- The mid-century instrument-panel palette, type, illustration, control shapes, and motion match `.factory/design.md`. The result is visually distinct and not a generic SaaS layout. Reduced motion is implemented and tested.
- F-2-8 through F-2-10 are the remaining first-screen and structure failures.

## Missed leverage

The brief does not justify AI or sync. Both would conflict with the focused, local-first replay job unless a user explicitly chose them. Import, export, and local replay already exist. The one obvious missing proof is a real runnable Phaser integration, covered by F-2-2; the current test exercises only the framework-free model.

No provider key, Azure endpoint, Sociobot gateway call, analytics script, or third-party runtime request was found.

## What would make this perfect

Resolve F-2-1 through F-2-15. In particular, show the loaded sample and replay action inside the first 390 × 844 demo viewport, replace the two inadequate claim tests with outcome-level assertions, register or remove every unlisted claim, and apply the proposed first-screen, copy, and navigation fixes. Then rerun every exact claim command, `npm run check`, the live request/storage audit, route crawl, focus flow, Axe scan, and both cold first-screen measurements. There is no zero-finding path to PASS before those checks are clean.
