# First-read product QA review 4 — Replay Capsule

**Reviewed:** 2026-09-01 UTC  
**Live URL:** https://browser-game-replay-capsule.sociobot.in  
**Commit tested:** `3852de27a6b106bcb128c12b158a20c904daa01b`  
**Verdict:** **FAIL**

The product communicates its job, audience, and first action in the initial phone and desktop views. The sample is useful in one click, all 22 listed claim commands pass, and earlier findings remain fixed. Acceptance still fails because 200% text clips the shared navigation and fails the full browser suite. Three README capabilities and one registry-status clause also lack matching claim entries.

## Cold first read

Fresh Chromium contexts opened `/` at 390 × 844 and 1440 × 900. No scrolling occurred before this assessment.

| Question | Answer from the first screen | Exact evidence |
| --- | --- | --- |
| What does this do? | It creates a small file that repeats browser-game inputs and timing. | “Replay browser-game bugs from a small file.” |
| For whom? | Solo developers of 2D browser games. | “For solo 2D game developers who need a bug report that repeats the player’s inputs and timing.” |
| What should I click first? | **Try it with sample data**. | The action and “Loads a seeded bug run you can replay.” are visible at both sizes. |

All three questions are answerable from the first screen. With fonts loaded, the three facts end at y=821.42 px on the 390 × 844 view and y=729.17 px on the 1440 × 900 view.

## Findings

### F-4-1 — BLOCKING: 200% text clips the shared navigation and fails the quality gate

**Location and exact text:** Live `/` at 390 px after increasing the root text size to 200%. The header text “Replay Capsule · Demo · Privacy · Terms” extends to x=520.61 px in a 390 px viewport. **Privacy** and **Terms** are outside the initial visible width. The document width becomes 521 px. The same rule set is shared by the other routes. In code, `site/style.css:167-171` keeps the wordmark and three-link navigation on one flex row without wrapping.

**Check evidence:** The clean-clone `npm run check` run failed `tests/e2e/site.spec.ts:114` with “Expected: <= 390; Received: 521”. A loaded-font check against both the clean local build and the live page produced the same 521 px document width. The current test does not wait for `document.fonts.ready`, so an isolated rerun can pass before the final font metrics apply.

**Why this matters:** A person who enlarges text must scroll sideways to find standard navigation. The product’s accessibility baseline requires usable 200% text, and the required full quality gate is not consistently green.

**Concrete fix:** At the mobile breakpoint, let `.site-header` wrap or place the navigation on its own full-width row. Keep all three links visible within 390 px. Update the regression to await `document.fonts.ready`, set 200% text, then confirm the document width is no greater than the viewport and every header link’s right edge is within it.

### F-4-2 — MAJOR: the Phaser recording statement is an unlisted claim

**Location and exact quote:** `README.md`, **Phaser integration fixture**: “It records from Phaser’s canvas and replays imported files through the scene adapter.”

**Why this matters:** `seeded-failure-fixture` confirms only imported replay files. The tagged browser check calls `replayImportedCapsule`; it never calls `armRecording`, sends input to the Phaser canvas, or exports the result. A reader cannot distinguish the tested replay path from the untested recording statement.

**Concrete fix:** Add a `phaser-recording` entry to `.factory/claims.json`. Its tagged browser check should call `armRecording`, send a real pointer or key event to the running Phaser canvas, export the capsule, and confirm the seed and normalized event. Keep the existing replay claim separate.

### F-4-3 — MAJOR: the documented key filter is an unlisted claim

**Location and exact quote:** `README.md`, **Limits and browser behavior**: “Set `shouldCaptureKey` to keep a game surface's control keys out of its replay stream.”

**Why this matters:** No claim entry names this public option. An untagged demo check confirms that the site filters Tab and Enter, but the claims gate can pass without checking the documented library option directly.

**Concrete fix:** Add a `key-filter` claim and one tagged unit check. Configure `shouldCaptureKey`, send an allowed and a rejected key, then confirm the exported capsule contains only the allowed key.

### F-4-4 — MAJOR: capped-download importability is not represented by a listed claim

**Location and exact quote:** `README.md`, **Limits and browser behavior**: “Accounting and the downloaded file use the same compact JSON bytes, so a capped recorder export stays importable.”

**Why this matters:** `default-byte-cap` confirms serialized size, but its tagged check does not download and re-import a near-cap capsule. Separate untagged checks cover that behavior, so the copy can change or the checks can disappear without the claim inventory detecting it.

**Concrete fix:** Add a `capped-export-import` claim and tag one near-cap download/import check. Confirm the downloaded byte count stays within the configured cap and `importCapsule` accepts that exact downloaded content.

### F-4-5 — MINOR: registry-status copy makes an unlisted future statement

**Locations and exact quotes:** Landing package section: “This versioned npm tarball is hosted with the documentation while registry publication is pending.” README development section: “Package registry publication is left to the factory release workflow; `npm run build` also prepares the versioned tarball served by the site.”

**Why this matters:** `installable-release` confirms the hosted tarball, but nothing can confirm the undefined “pending” registry state. The factory-workflow clause does not help a package user install or evaluate the current release.

**Concrete fix:** Replace the landing sentence with: “Install version 0.1.7 from this hosted npm tarball.” Replace the README sentence with: “`npm run build` prepares the versioned tarball served by the site.”

## Copy audit

Counts use whitespace-separated visible words. Hyphenated terms and inline API names count as one word. Code blocks, link destinations, and generated values are excluded. Initial copy, headings, controls, accessible descriptions, and interaction states are included. No sentence exceeds 22 words or uses a banned marketing adjective. Findings F-4-2 through F-4-5 are claim-inventory or usefulness issues.

### Landing page

| Copy | Words | Check |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Replay Capsule | 2 | Pass — product label |
| Demo / Privacy / Terms | 3 | Pass — destinations |
| Local replay files for browser games | 6 | Pass — section label |
| Replay browser-game bugs from a small file. | 7 | Pass — verb-first headline |
| For solo 2D game developers who need a bug report that repeats the player’s inputs and timing. | 17 | Pass |
| Try it with sample data | 5 | Pass — result-naming action |
| Loads a seeded bug run you can replay. | 8 | Pass |
| Copy install command | 3 | Pass — result-naming action |
| Record, import, and replay offline after this page loads | 9 | Pass |
| Free under the MIT License | 5 | Pass |
| No tracking or server calls | 5 | Pass |
| Input sequence / Same sequence | 4 | Pass — diagram labels |
| An illustrated cream and petrol recorder passing the same sequence of game-event shapes from one side to the other. | 19 | Pass — image alternative |
| Seed, inputs, and timing in one capped file. | 8 | Pass |
| Start / A person starts recording | 5 | Pass — flow step |
| Capture / Inputs, timing, and seed | 5 | Pass — flow step |
| Replay / Your game applies events | 5 | Pass — flow step |
| Live package demo | 3 | Pass — section label |
| Record and replay a sample bug. | 6 | Pass |
| Start recording, steer the probe, and reach a red fault cell. | 11 | Pass |
| Download the file or import it again to replay the path. | 11 | Pass |
| Capture controls / Ready | 3 | Pass |
| Probe navigation game. | 3 | Pass — canvas name |
| Use arrow keys or click to move; avoid striped fault cells and reach the round beacon. | 16 | Pass — canvas instruction |
| Ready to record | 3 | Pass — empty-state heading |
| Start recording to begin a seeded run. | 7 | Pass — empty-state instruction |
| Arrow keys steer; pointer moves probe; avoid fault cells | 9 | Pass — control hint |
| Start recording / Stop recording / Reset run | 6 | Pass — result-naming actions |
| Download capsule / Import capsule / Replay capsule | 6 | Pass — result-naming actions |
| Replay progress | 2 | Pass — control name |
| No input has been captured yet. | 6 | Pass |
| This tab does not save your run. | 7 | Pass |
| Capsule details | 2 | Pass — section heading |
| Seed / Events / Elapsed / Payload / Network | 5 | Pass — detail labels |
| Capsule capacity used | 3 | Pass — control name |
| Captured: key codes, pointer positions, changed gamepad samples, your seed, and checkpoints. | 12 | Pass |
| Not captured: typed text, DOM content, identity, cookies, or network traffic. | 11 | Pass |
| What the library does | 4 | Pass — section label |
| Keep the bug report small and private. | 7 | Pass — section heading |
| Use your game adapter | 4 | Pass |
| Your game adapter receives each stored event through a callback. | 10 | Pass |
| Stay inside the byte cap | 5 | Pass |
| The recorder stops before it crosses the configured cap. | 9 | Pass |
| The default cap is 128 KB. | 6 | Pass |
| Control replay timing | 3 | Pass |
| Replay at normal speed or faster. | 6 | Pass |
| Pause, resume, and stop are available in the public API. | 10 | Pass |
| Install the library | 3 | Pass — section label |
| Add replay capture to your game loop. | 7 | Pass |
| Copy code | 2 | Pass — result-naming action |
| This versioned npm tarball is hosted with the documentation while registry publication is pending. | 14 | **F-4-5** |
| Local replay files for browser-game debugging. | 6 | Pass |
| Built by Param Factory · v0.1.7 · polish-3 | 6 | Pass — build label |

### Landing interaction and demo-state copy

| Copy | Words | Check |
| --- | ---: | --- |
| Demo — sample data, nothing is saved. | 6 | Pass |
| This run stays in memory and is discarded when you leave. | 11 | Pass |
| Reset demo / Start for real | 5 | Pass — result-naming actions |
| Sample capsule loaded. | 3 | Pass |
| Replay it or start a new recording. | 7 | Pass |
| Capsule loaded. | 2 | Pass |
| Press “Replay capsule” to reproduce the run. | 7 | Pass |
| Empty capsule. | 2 | Pass |
| This valid file has no input events to replay. | 9 | Pass |
| Recording this game surface now. | 5 | Pass |
| Text fields remain excluded. | 4 | Pass |
| Recording stopped. | 2 | Pass |
| Download or replay the capsule. | 5 | Pass |
| Stopped with no inputs. | 4 | Pass |
| Move the probe after starting to create a useful capsule. | 10 | Pass |
| The 128 KB cap was reached. | 6 | Pass |
| The last complete event is preserved; download or reset the capsule. | 11 | Pass |
| Fault reproduced and checkpointed. | 4 | Pass |
| Download this capsule or replay it here. | 7 | Pass |
| Beacon reached. | 2 | Pass |
| The successful path is ready to replay. | 7 | Pass |
| Capsule downloaded. | 2 | Pass |
| It contains no video or typed text. | 7 | Pass |
| Imported [count] events. | 3 | Pass |
| Seed and checkpoints validated locally. | 5 | Pass |
| The imported capsule is valid but contains no input events. | 10 | Pass |
| Import failed. | 2 | Pass |
| Choose a Replay Capsule JSON file under 1 MB. | 9 | Pass |
| Replaying recorded timing at 2× speed… | 6 | Pass |
| Replay complete: the recorded outcome was reproduced. | 7 | Pass |
| Replay complete: the same [count] recorded events were applied. | 9 | Pass |
| You are offline. | 3 | Pass |
| You can record, import, and replay after this page loads. | 10 | Pass |
| Install command copied. | 3 | Pass |
| Copy unavailable. | 2 | Pass |
| Select the install command in the package section. | 8 | Pass |

### README

| Copy | Words | Check |
| --- | ---: | --- |
| Replay Capsule | 2 | Pass — document heading |
| Replay Capsule is a dependency-free TypeScript library for reproducible browser-game bug reports. | 12 | Pass |
| It records keyboard, pointer, and gamepad inputs with timing, a deterministic seed, and small checkpoints. | 15 | Pass |
| It then exports one capped JSON file your game can replay. | 11 | Pass |
| It is for solo developers shipping small 2D browser games. | 10 | Pass |
| It does not record typed text or send data to a service. | 12 | Pass |
| Try the sample demo | 4 | Pass — section heading |
| Open the sample demo, or select Try it with sample data on the landing page. | 15 | Pass |
| It loads a seeded fault capsule with one pointer input and checkpoint. | 12 | Pass |
| The demo is isolated in `demo:replay-capsule:memory`, writes no browser storage, and is discarded when you reset or leave it. | 19 | Pass |
| Install | 1 | Pass — section heading |
| This versioned npm tarball is available now. | 7 | Pass |
| Record | 1 | Pass — section heading |
| Recording is always opt-in: connect `start()` to a clear user action. | 11 | Pass |
| Text inputs, textareas, selects, and editable elements are never captured. | 10 | Pass |
| Import and replay | 3 | Pass — section heading |
| Replay Capsule schedules stored events. | 5 | Pass |
| Your game decides what each event does. | 7 | Pass |
| `onEvent` receives the same normalized event shape stored in the capsule. | 11 | Pass |
| `pause()`, `resume()`, and `stop()` are available for debugger controls. | 9 | Pass |
| Use `speed` to accelerate playback. | 5 | Pass |
| See the live documentation and working Canvas demo at browser-game-replay-capsule.sociobot.in. | 10 | Pass |
| Phaser integration fixture | 3 | Pass — section heading |
| The repository includes a small Phaser 3 scene. | 8 | Pass |
| It records from Phaser’s canvas and replays imported files through the scene adapter. | 13 | **F-4-2** |
| Its deterministic game model lives beside it for auditing without bundling Phaser into this package. | 15 | Pass |
| The browser fixture imports 20 generated replay files under the deployed content-security policy. | 13 | Pass |
| It reproduces all 20 seeded fault outcomes. | 7 | Pass |
| The target is 18 of 20 (90%). | 7 | Pass |
| Run its exact regression with: | 5 | Pass |
| API | 1 | Pass — section heading |
| `createRecorder(options)` → `start`, `stop`, `clear`, `checkpoint`, `export`, plus live `state` and `status` getters. | 12 | Pass — interface summary |
| `importCapsule(string \| Blob \| object, maxBytes?)` → validates and resolves a versioned `ReplayCapsule`. | 10 | Pass — interface summary |
| `validateCapsule(value)` → synchronously validates trusted in-memory input. | 6 | Pass — interface summary |
| `createPlayer(capsule, options)` → `play`, `pause`, `resume`, and `stop` with event, checkpoint, state, and progress callbacks. | 14 | Pass — interface summary |
| `downloadCapsule(capsule, filename?)` → starts a local JSON download. | 7 | Pass — interface summary |
| The package exports ESM, CommonJS, and declarations. | 7 | Pass |
| The `ReplayEvent`, `ReplayCheckpoint`, `ReplayCapsule`, recorder/player option, state, and status types are public. | 12 | Pass |
| Limits and browser behavior | 4 | Pass — section heading |
| Default cap: 128 KB; supported range: 4 KB–1 MB. | 9 | Pass |
| The recorder stops before an event would cross the cap and reports `limit-reached`. | 13 | Pass |
| On `stop()` or `export()`, the recorder rechecks the cap after timing changes. | 12 | Pass |
| It keeps only whole entries that fit. | 7 | Pass |
| Accounting and the downloaded file use the same compact JSON bytes, so a capped recorder export stays importable. | 18 | **F-4-4** |
| Pointer coordinates are normalized to the configured target when possible. | 10 | Pass |
| Key identity uses `KeyboardEvent.code`, not typed characters. | 7 | Pass |
| Text-entry events are ignored in light, open-shadow, and closed-shadow DOM. | 10 | Pass |
| If an event may come from a text field in closed Shadow DOM, the library does not record it. | 19 | Pass |
| Set `shouldCaptureKey` to keep a game surface's control keys out of its replay stream. | 14 | **F-4-3** |
| After its first load, the demo can record, import, and replay while the browser is offline. | 16 | Pass |
| It does not claim that an offline reload works. | 9 | Pass — scope clarification |
| Gamepads are sampled once per animation frame, but browser gamepad timestamps are inconsistent. | 13 | Pass |
| Replay Capsule timestamps the sample at observation time and stores the browser timestamp only as optional diagnostic metadata. | 18 | Pass |
| Capsule imports are schema-validated and reject malformed, unsupported, or over-limit files. | 11 | Pass |
| No network requests, persistence, telemetry, cookies, or third-party runtime dependencies. | 10 | Pass |
| Development | 1 | Pass — section heading |
| Requires Node.js 20+. | 3 | Pass |
| Deploy `dist/site` as the static root. | 6 | Pass — instruction |
| Run every command listed in `.factory/claims.json` when changing a listed product claim. | 12 | Pass — contributor instruction |
| Package registry publication is left to the factory release workflow; `npm run build` also prepares the versioned tarball served by the site. | 22 | **F-4-5** |

Terminology is otherwise consistent: the exported JSON is a **capsule**, the operation is **recording**, the deterministic value is a **seed**, a state marker is a **checkpoint**, and the isolated sample is the **demo**.

## Demo and sandbox checks

- One click on **Try it with sample data** opens canonical `/demo`.
- At 390 × 844, the initial demo shows `RC-SAMPLE-FAULT-17`, “1 event · fault-contact”, **Replay sample**, and the game canvas. The quick-action block ends at y=548.33 px.
- The banner says **Demo — sample data, nothing is saved.** It provides **Reset demo** and **Start for real**.
- Recording changed the event count to two. **Reset demo** restored the one-event sample and original message. **Start for real** returned to `/` and changed the namespace from `demo:replay-capsule:memory` to `real:replay-capsule:memory`.
- Local storage, session storage, cookies, IndexedDB, Cache Storage, and service-worker registrations remained empty.
- Every recorded request was same-origin. With the context offline after first load, sample replay and a new recording still completed.

## Claims gate

A separate clone at `/tmp/replay-review4-clean` checked out commit `3852de27a6b106bcb128c12b158a20c904daa01b`, ran `npm ci`, and ran every exact command in `.factory/claims.json` separately.

| Claim | Result |
| --- | --- |
| `sample-demo` | Pass |
| `no-network-calls` | Pass |
| `opt-in-recording` | Pass |
| `text-entry-excluded` | Pass |
| `record-export-replay` | Pass |
| `no-browser-persistence` | Pass |
| `capture-surface` | Pass |
| `checkpoint-capture` | Pass |
| `default-byte-cap` | Pass |
| `custom-cap-range` | Pass |
| `validated-import` | Pass |
| `pointer-normalization` | Pass |
| `gamepad-sampling` | Pass |
| `adapter-callbacks` | Pass |
| `replay-controls` | Pass |
| `seeded-failure-fixture` | Pass — 20/20 outcomes |
| `package-formats` | Pass |
| `installable-release` | Pass |
| `zero-runtime-dependencies` | Pass |
| `offline-demo` | Pass |
| `mit-license` | Pass |
| `node-20-runtime` | Pass |

No listed claim test failed. F-4-2 through F-4-5 are statements outside the current inventory, so the product still has untested claim-like copy.

The additional clean-clone checks produced 31 passing unit/package checks, a successful production build, a successful lint run, and a valid 11.5 KB package. The full `npm run check` browser phase had 49 passes, four expected skips, and the F-4-1 failure.

## Earlier finding confirmation

Every earlier review, polish record, and handoff was read. Each earlier finding was checked live and in current code.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 route-change focus | Fixed. Home → Demo focuses the demo h1; Back focuses the landing h1. |
| F-1-2 duplicate demo address | Fixed in browser navigation. `/demo/` finishes at canonical `/demo`; internal links and metadata use `/demo`. |
| F-1-3 404 social metadata | Fixed. The live HTTP-404 document has complete route metadata and one h1. |
| F-1-4 external-link indication | Fixed. Product pages contain no external links. |
| F-1-5 long README sentences | Fixed. The replacements remain below 22 words. |
| F-1-6 ambiguous registry-availability promise | Fixed under its original scope. The README does not claim registry availability; F-4-5 covers the remaining undefined status wording. |
| F-2-1 phone demo lacked sample UI | Fixed. Sample facts and replay action appear before y=549 px. |
| F-2-2 Phaser reproduction checked only a model | Fixed. The tagged check starts the real Phaser scene and replays 20 imported capsules. F-4-2 is the separate recording statement. |
| F-2-3 replay sequence was not compared | Fixed. The tagged check compares every replayed event with the downloaded capsule. |
| F-2-4 real-mode persistence claim absent | Fixed. The listed check covers all browser storage surfaces and preserves sentinels. |
| F-2-5 capture exclusions only partly checked | Fixed. The listed check inspects capsule fields and serialized content. |
| F-2-6 subjective sharing statement | Fixed. The page uses the exact 128 KB default. |
| F-2-7 Node 20 claim absent | Fixed. The listed clean-consumer check uses pinned Node 20 for ESM and CommonJS. |
| F-2-8 desktop facts below the first screen | Fixed. The list ends at y=729.17 px. |
| F-2-9 inconsistent route navigation | Fixed at normal text size. Every route exposes Demo, Privacy, and Terms. F-4-1 covers enlarged-text reflow. |
| F-2-10 first-screen facts omitted offline and price | Fixed. All three required facts are present. |
| F-2-11 long Phaser README sentence | Fixed. It remains split into concise sentences. |
| F-2-12 unclear recording button | Fixed. The action remains **Start recording**. |
| F-2-13 conflicting telemetry term | Fixed. The panel remains **Capsule details**. |
| F-2-14 ambiguous player wording | Fixed. Person and API responsibilities remain distinct. |
| F-2-15 unclear closed-Shadow-DOM wording | Fixed. The README states the behavior directly. |
| F-3-1 third phone fact below the first screen | Fixed. With fonts loaded, the list ends at y=821.42 px. |

## Structure, accessibility, and visual identity

- `/`, `/demo`, `/privacy/`, and `/terms/` return 200. An unknown route returns the designed 404 with HTTP 404.
- Every checked route has `lang="en"`, one h1, one main landmark, a route-specific title, a description, canonical metadata, Open Graph/Twitter metadata, an SVG favicon, and an Apple touch icon.
- All visible site links resolve. The hosted release returns 200 and byte-matches the clean build. Root, demo, legal, 404, and release files also byte-match the deployed copies.
- Deep links and browser Back work. Route navigation focuses the destination h1. Headers and footers consistently show Demo, Privacy, Terms, the product description, and build label.
- Playwright Axe reports zero violations on the landing, demo, legal, and 404 routes at the checked sizes. The factory URL check reports a title, `lang=en`, one h1, one main landmark, complete image alternatives, labeled buttons, and no console errors.
- F-4-1 remains the 200% text failure. Normal-size controls have visible focus, at least 44 px targets, and reduced-motion behavior.
- The root loads about 8.5 KB of first-load JavaScript gzip. Fonts and runtime assets are self-hosted.
- The cream, petrol, amber, Space Mono, Atkinson Hyperlegible, instrument illustration, panel controls, and restrained motion match `.factory/design.md`. The result is product-specific rather than a generic software template.

## Missed leverage

No additional product feature is indicated by the brief. Import, download, and replay cover the expected workflow. Sync would conflict with the intentionally local, in-memory boundary. A model-assisted feature would not improve deterministic input capture and would add an unrelated data path. No runtime model credential or provider call is present.

## What would make this perfect

Resolve F-4-1 through F-4-5. Confirm loaded-font 200% reflow in the full browser suite, add one tagged test and manifest entry for each retained capability statement, and remove the vague registry-status wording. Then rerun all 22 exact claim commands, `npm run check`, and the live mobile/desktop checks. No other change is indicated by this review.
