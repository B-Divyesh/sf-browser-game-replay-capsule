# First-read product QA review 3 — Replay Capsule

**Reviewed:** 2026-09-01 UTC  
**Live URL:** https://browser-game-replay-capsule.sociobot.in  
**Commit tested:** `111b45dfd0e992fe88f56fa42eace11e3ada3a54`  
**Verdict:** **FAIL**

The product explains its job, audience, and first action on both tested screens. The one-click demo, all 22 listed claims, route structure, accessibility checks, and earlier fixes pass. One minor first-screen layout finding remains, so the required zero-finding standard is not met.

## Cold first read

Fresh Chromium contexts opened `/` at 390 × 844 and 1440 × 900. No scrolling occurred before this assessment.

| Question | Answer from the first screen | Exact evidence |
| --- | --- | --- |
| What does this do? | It makes a small file that repeats a browser-game bug's inputs and timing. | “Replay browser-game bugs from a small file.” |
| For whom? | Solo developers of 2D browser games. | “For solo 2D game developers who need a bug report that repeats the player’s inputs and timing.” |
| What should I click first? | **Try it with sample data**. | The primary action and “Loads a seeded bug run you can replay.” are visible at both widths. |

All three required questions are answerable from the first screen. This check does not create a blocking finding.

## Findings

### F-3-1 — MINOR: the third required fact falls below the phone’s first screen

**Location and exact text:** Live `/` at 390 × 844, the three-fact list in `site/index.html:51-55`: “Record, import, and replay offline after this page loads”, “Free under the MIT License”, and “No tracking or server calls”. The list ends at y=857.42 px, 13.42 px below the 844 px viewport. The last line is therefore not fully visible before scrolling. The same list ends at y=729.17 px on the 1440 × 900 view.

**Why this matters:** The required first-screen structure includes three short facts for offline behavior, price, and privacy. A phone visitor sees the job, audience, and action, but cannot read the complete privacy fact in the first screen.

**Concrete fix:** Reduce at least 14 px of mobile-only vertical space before `.trust-line`, for example by reducing the mobile hero top padding or the list’s top margin. Add a 390 × 844 regression that confirms `.trust-line` has a bottom no greater than 844 px.

## Copy audit

Counts use whitespace-separated visible words. Punctuation, decorative symbols, code blocks, and link destinations are not words. Repeated header/footer labels are listed once. Initial landing copy, accessible image/canvas copy, headings, controls, and conditional status copy were checked. No copy exceeds 22 words, uses a banned marketing term, changes the established terminology, or uses a non-result-naming action. F-3-1 concerns placement, not wording.

### Landing page

| Copy | Words | Check |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Replay Capsule | 2 | Pass — product label |
| Demo / Privacy / Terms | 3 | Pass — clear destinations |
| Local replay files for browser games | 6 | Pass — section label |
| Replay browser-game bugs from a small file. | 7 | Pass — verb-first job headline |
| For solo 2D game developers who need a bug report that repeats the player’s inputs and timing. | 17 | Pass |
| Try it with sample data | 5 | Pass — result-naming action |
| Loads a seeded bug run you can replay. | 8 | Pass |
| Copy install command | 3 | Pass — result-naming action |
| Record, import, and replay offline after this page loads | 9 | Pass — F-3-1 concerns visibility |
| Free under the MIT License | 5 | Pass |
| No tracking or server calls | 5 | Pass — F-3-1 concerns visibility |
| Input sequence | 2 | Pass |
| Same sequence | 2 | Pass |
| An illustrated cream and petrol recorder passing the same sequence of game-event shapes from one side to the other. | 19 | Pass — image alternative |
| Seed, inputs, and timing in one capped file. | 8 | Pass |
| Start | 1 | Pass — flow step |
| A person starts recording | 4 | Pass |
| Capture | 1 | Pass — flow step |
| Inputs, timing, and seed | 4 | Pass |
| Replay | 1 | Pass — flow step |
| Your game applies events | 4 | Pass |
| Live package demo | 3 | Pass — section label |
| Record and replay a sample bug. | 6 | Pass |
| Start recording, steer the probe, and reach a red fault cell. | 11 | Pass |
| Download the file or import it again to replay the path. | 11 | Pass |
| Capture controls | 2 | Pass |
| Ready | 1 | Pass — state |
| Probe navigation game. | 3 | Pass — canvas name |
| Use arrow keys or click to move; avoid striped fault cells and reach the round beacon. | 16 | Pass — canvas instruction |
| Ready to record | 3 | Pass — empty-state heading |
| Start recording to begin a seeded run. | 7 | Pass — empty-state instruction |
| Arrow keys steer; pointer moves probe; avoid fault cells | 9 | Pass — keyboard/pointer hint; arrow symbols excluded |
| Start recording | 2 | Pass — result-naming action |
| Stop recording | 2 | Pass — result-naming action |
| Reset run | 2 | Pass — result-naming action |
| Download capsule | 2 | Pass — result-naming action |
| Import capsule | 2 | Pass — result-naming action |
| Replay capsule | 2 | Pass — result-naming action |
| Replay progress | 2 | Pass — accessible progress name |
| No input has been captured yet. | 6 | Pass — empty state |
| This tab does not save your run. | 7 | Pass |
| Capsule details | 2 | Pass |
| Seed / Events / Elapsed / Payload / Network | 5 | Pass — detail labels |
| Capsule capacity used | 3 | Pass — accessible progress name |
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
| This versioned npm tarball is hosted with the documentation while registry publication is pending. | 14 | Pass |
| Local replay files for browser-game debugging. | 6 | Pass |
| Built by Param Factory · v0.1.7 · repair-8 | 6 | Pass — build label |

### Conditional and interaction copy on the landing/demo interface

| Copy | Words | Check |
| --- | ---: | --- |
| Demo — sample data, nothing is saved. | 6 | Pass |
| This run stays in memory and is discarded when you leave. | 11 | Pass |
| Reset demo | 2 | Pass — result-naming action |
| Start for real | 3 | Pass — clear demo exit |
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
| Move the probe after starting to create a useful capsule. | 10 | Pass — recovery instruction |
| The 128 KB cap was reached. | 6 | Pass |
| The last complete event is preserved; download or reset the capsule. | 11 | Pass — recovery instruction |
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
| Choose a Replay Capsule JSON file under 1 MB. | 9 | Pass — recovery instruction |
| Replaying recorded timing at 2× speed… | 6 | Pass |
| Replay complete: the recorded outcome was reproduced. | 7 | Pass |
| Replay complete: the same [count] recorded events were applied. | 9 | Pass |
| You are offline. | 3 | Pass |
| You can record, import, and replay after this page loads. | 10 | Pass |
| Install command copied. | 3 | Pass |
| Copy unavailable. | 2 | Pass |
| Select the install command in the package section. | 8 | Pass — recovery instruction |

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
| It records from Phaser’s canvas and replays imported files through the scene adapter. | 13 | Pass |
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
| Accounting and the downloaded file use the same compact JSON bytes, so a capped recorder export stays importable. | 18 | Pass |
| Pointer coordinates are normalized to the configured target when possible. | 10 | Pass |
| Key identity uses `KeyboardEvent.code`, not typed characters. | 7 | Pass |
| Text-entry events are ignored in light, open-shadow, and closed-shadow DOM. | 10 | Pass |
| If an event may come from a text field in closed Shadow DOM, the library does not record it. | 19 | Pass |
| Set `shouldCaptureKey` to keep a game surface's control keys out of its replay stream. | 14 | Pass |
| After its first load, the demo can record, import, and replay while the browser is offline. | 16 | Pass |
| It does not claim that an offline reload works. | 9 | Pass |
| Gamepads are sampled once per animation frame, but browser gamepad timestamps are inconsistent. | 13 | Pass |
| Replay Capsule timestamps the sample at observation time and stores the browser timestamp only as optional diagnostic metadata. | 18 | Pass |
| Capsule imports are schema-validated and reject malformed, unsupported, or over-limit files. | 11 | Pass |
| No network requests, persistence, telemetry, cookies, or third-party runtime dependencies. | 10 | Pass |
| Development | 1 | Pass — section heading |
| Requires Node.js 20+. | 3 | Pass |
| Deploy `dist/site` as the static root. | 6 | Pass |
| Run every command listed in `.factory/claims.json` when changing a listed product claim. | 12 | Pass |
| Package registry publication is left to the factory release workflow; `npm run build` also prepares the versioned tarball served by the site. | 22 | Pass |

Terminology is consistent: the exported JSON is a **capsule**, the operation is **recording**, the deterministic value is a **seed**, a state marker is a **checkpoint**, and the isolated sample is the **demo**.

## Demo and sandbox checks

- One click on **Try it with sample data** opens canonical `/demo`. At 390 × 844, the sample ID `RC-SAMPLE-FAULT-17`, “1 event · fault-contact”, and **Replay sample** all end above y=549 px.
- The first demo screen is populated before interaction. It shows the seed, event count, checkpoint, capsule details, replay action, and capture controls.
- The persistent banner says **Demo — sample data, nothing is saved.** It provides **Reset demo** and **Start for real**.
- A live run changed the seed and event count. **Reset demo** restored `RC-SAMPLE-FAULT-17`, one event, and the initial sample message.
- A pre-existing local-storage, session-storage, and cookie sentinel remained unchanged through the demo and reset. IndexedDB, Cache Storage, and service-worker registrations remained empty.
- Every request in the landing-to-demo flow was same-origin. No API, analytics, third-party script, or runtime font request was present.
- After first load, the live demo replayed the sample and recorded input with its browser context offline.

## Claims gate

A separate clean clone at the reviewed commit ran `npm ci` and every exact command in `.factory/claims.json`. All 22 commands passed. The assertions were checked for their observable outcomes; no listed claim remains untested.

| Claim | Exact command | Result |
| --- | --- | --- |
| `sample-demo` | `npm run test:e2e -- --grep @claim:sample-demo` | Pass |
| `no-network-calls` | `npm run test:e2e -- --grep @claim:no-network-calls` | Pass |
| `opt-in-recording` | `npm run test:e2e -- --grep @claim:opt-in-recording` | Pass |
| `text-entry-excluded` | `npm run test:e2e -- --grep @claim:text-entry-excluded` | Pass |
| `record-export-replay` | `npm run test:e2e -- --grep @claim:record-export-replay` | Pass |
| `no-browser-persistence` | `npm run test:e2e -- --grep @claim:no-browser-persistence` | Pass |
| `capture-surface` | `npm run test:e2e -- --grep @claim:capture-surface` | Pass |
| `checkpoint-capture` | `npm test -- --testNamePattern @claim:checkpoint-capture` | Pass |
| `default-byte-cap` | `npm test -- --testNamePattern @claim:default-byte-cap` | Pass |
| `custom-cap-range` | `npm test -- --testNamePattern @claim:custom-cap-range` | Pass |
| `validated-import` | `npm test -- --testNamePattern @claim:validated-import` | Pass |
| `pointer-normalization` | `npm run test:e2e -- --grep @claim:pointer-normalization` | Pass |
| `gamepad-sampling` | `npm test -- --testNamePattern @claim:gamepad-sampling` | Pass |
| `adapter-callbacks` | `npm test -- --testNamePattern @claim:adapter-callbacks` | Pass |
| `replay-controls` | `npm test -- --testNamePattern @claim:replay-controls` | Pass |
| `seeded-failure-fixture` | `npm run test:e2e -- --grep @claim:seeded-failure-fixture` | Pass |
| `package-formats` | `npm test -- --testNamePattern @claim:package-formats` | Pass |
| `installable-release` | `npm test -- --testNamePattern @claim:installable-release` | Pass |
| `zero-runtime-dependencies` | `npm test -- --testNamePattern @claim:zero-runtime-dependencies` | Pass |
| `offline-demo` | `npm run test:e2e -- --grep @claim:offline-demo` | Pass |
| `mit-license` | `npm test -- --testNamePattern @claim:mit-license` | Pass |
| `node-20-runtime` | `npm test -- --testNamePattern @claim:node-20-runtime` | Pass |

The live landing page and README were cross-checked sentence by sentence against this inventory. Capability, privacy, compatibility, package, license, offline, size, capture, import, and integration statements all have matching entries. No unlisted claim was found.

## Earlier finding confirmation

Every finding in `review-1.md` and `review-2.md`, plus both polish records and the current handoff, was checked on the live site and in current code.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 route focus | Fixed. Home → Demo focuses the demo h1; Back focuses the landing h1. `site/route-focus.ts` and the browser regression confirm this. |
| F-1-2 duplicate demo address | Fixed. `/demo/` finishes at canonical `/demo`; internal links, metadata, and sitemap use `/demo`. |
| F-1-3 404 social metadata | Fixed. The live HTTP-404 document has canonical, Open Graph, Twitter, favicon, Apple icon, one h1, and a return action. |
| F-1-4 external-link indication | Fixed by removing external site links from the product pages. The current crawl contains only same-site links. |
| F-1-5 long README sentences | Fixed. The replacement sentences are individually below 22 words. |
| F-1-6 ambiguous registry statement | Fixed. The README names only the tested hosted release as available. |
| F-2-1 phone demo lacks sample UI | Fixed. The sample summary and replay action end above y=549 px at 390 × 844. |
| F-2-2 Phaser claim checks only a model | Fixed. The tagged browser check starts the shipped Phaser scene and confirms 20 imported outcomes. |
| F-2-3 replay sequence is not compared | Fixed. The tagged check compares the complete replayed sequence with the downloaded capsule and checks the outcome state. |
| F-2-4 real-mode persistence claim absent | Fixed. `no-browser-persistence` retains storage/cookie sentinels and checks all browser storage surfaces. |
| F-2-5 capture exclusions only partly checked | Fixed. `capture-surface` inspects capsule keys and serialized content after DOM, identity-like, cookie, and request values are present. |
| F-2-6 subjective sharing statement | Fixed. The page now states the tested 128 KB default cap. |
| F-2-7 Node 20 claim absent | Fixed. A pinned Node 20 clean consumer checks ESM and CommonJS. |
| F-2-8 desktop facts below first screen | Fixed. The list ends at y=729.17 px in the 900 px desktop view. |
| F-2-9 inconsistent navigation | Fixed. Demo, Privacy, and Terms appear in every live header and footer at both widths. |
| F-2-10 facts omit offline and price | Fixed in wording. The list states offline behavior, MIT price, and privacy; F-3-1 separately records the phone placement issue. |
| F-2-11 long Phaser README sentence | Fixed. It is split into 8-word and 13-word sentences. |
| F-2-12 metaphorical recording button | Fixed. The action is **Start recording**. |
| F-2-13 conflicting “telemetry” panel term | Fixed. The panel is **Capsule details**. |
| F-2-14 ambiguous “player” wording | Fixed. The page says **A person starts recording** and the README directly explains scheduling and event handling. |
| F-2-15 unclear closed-Shadow-DOM wording | Fixed. The README states that the library does not record a possible text-field event. |

None of the earlier findings is unfixed, partial, or regressed under its original scope. F-3-1 is a new mobile placement finding.

## Structure, accessibility, and quality checks

- `/`, `/demo`, `/privacy/`, and `/terms/` return 200. An unknown path returns the designed 404 with HTTP 404.
- Each route has `lang="en"`, one h1, one main landmark, a route-specific title, a description, canonical metadata, Open Graph/Twitter metadata, SVG favicon, and Apple touch icon.
- All crawled links resolve. Skip links target `#main`; `/demo/` normalizes to `/demo`; deep links and Back work; route changes focus the destination h1.
- Headers and footers consistently contain Demo, Privacy, and Terms. The footer also contains the product description and build ID.
- Live Axe checks report zero violations on all five routes at 390 × 844 and 1440 × 900. The factory URL check confirms title, language, h1, main, image alternatives, labeled buttons, and no console errors.
- Keyboard focus is visible, controls are keyboard-operable, mobile targets are at least 44 × 44 px, 200% text remains usable, and reduced motion removes ornamental transitions.
- The live response includes the documented content policy, frame restriction, content-type protection, referrer policy, and permissions policy.
- The first landing load transfers about 97.3 KB of resources, including about 9.7 KB of JavaScript. Fonts and runtime assets are self-hosted.
- The live root, demo, Privacy, Terms, 404, and `0.1.7` release files byte-match the clean build.
- The mid-century instrument-panel palette, self-hosted type pairing, original recorder illustration, control shapes, and restrained motion match `.factory/design.md`. The interface is visually specific to this product.
- Clean-clone `npm run check` passes: 31 unit/package checks, build output in `dist/`, and 49 browser checks with 3 intended project skips. `npm run lint` also passes.

## Missed leverage

No additional expected feature is missing. Import, download, and replay already cover the brief’s obvious workflow. Sync would conflict with the local, in-memory product boundary. Model-assisted processing would not improve deterministic event capture and would add an unrelated data path. No runtime model feature or provider credential is present.

## What would make this perfect

Resolve F-3-1 so all three facts fit within the 390 × 844 first screen, and add the specified mobile bounding-box regression. Then rerun the clean claim commands and the live mobile first-read check. No other product change is indicated by this review.
