# Adversarial first-read review 5 — Replay Capsule

**Reviewed:** 2026-09-01 UTC  
**Live URL:** https://browser-game-replay-capsule.sociobot.in  
**Commit reviewed:** `334fc7f6cf4ee5848aa3de99f94650f279ac3fe3`  
**Verdict:** **FAIL**

The real job, audience, and first action are clear on a cold phone and desktop visit. The sample is useful and isolated. The verdict is nevertheless FAIL: a first-screen privacy claim is broader than its listed test. The existing test would pass if the site added a same-origin tracking or API call.

## Cold first read

Fresh Chromium contexts loaded `/` at 390 × 844 and 1440 × 900 without scrolling. Fonts were allowed to finish loading before the assessment.

| Question | Answer available on the first screen | Exact text |
| --- | --- | --- |
| What does this do? | It replays a browser-game bug from a small capture file. | “Replay browser-game bugs from a small file.” |
| For whom? | Solo developers of 2D browser games. | “For solo 2D game developers who need a bug report that repeats the player’s inputs and timing.” |
| What should I select first? | Try the seeded sample. | **“Try it with sample data”** — “Loads a seeded bug run you can replay.” |

This passes the first-read gate. At 390 px the three facts end at y=821 px, inside the 844 px viewport. At desktop size the first screen also contains the job, audience, action, outcome, and facts.

## Findings

### F-5-1 — BLOCKING: “No tracking or server calls” is broader than the privacy regression proves

**Location / exact quote:** Landing hero fact: **“No tracking or server calls”**. The referenced `no-network-calls` declaration in `.factory/claims.json` says that the demo has “no API, analytics, or third-party runtime service.” Its sole tagged check, `tests/e2e/site.spec.ts` (`@claim:no-network-calls`), only asserts that every request has the same origin as the page.

**Evidence:** A fresh live demo flow made eleven same-origin static requests (HTML, JavaScript, CSS, image, and fonts) and no external requests. The current test would also pass if an implementation made a request such as `https://browser-game-replay-capsule.sociobot.in/api/track` or `/analytics/collect`, because it checks origin only. It therefore does not prove the precise no-tracking/no-server-call statement, and the words are literally broader than the observable behavior: loading a static site necessarily makes requests to its server.

**Why this matters:** Privacy is a decision-making fact on the first screen. A solo developer can reasonably read the statement as “this product does not contact a server.” The test does not guard against a future first-party analytics or API addition, so the promise could regress while all listed claims remain green.

**Concrete fix:** Replace the hero fact with **“No tracking or API calls”** (or **“No tracking or API calls after this page loads”** if that is the intended scope). Update `no-network-calls` so its observable assertion permits only the known static document and asset paths and explicitly rejects API/analytics paths and non-static request methods. Keep a separate same-origin assertion. Re-run the tagged claim from a fresh browser context and record the request-path allowlist in the test.

## Copy audit

Counts are whitespace-separated words. Code blocks, URLs, and generated values are excluded. A slash-separated control row contains each adjacent one- or two-word control label. Every static landing sentence/control and every README sentence is included below. No item exceeds 22 words. No marketing adjective, metaphor heading, inconsistent product term, or non-result-naming button was found. The one privacy claim marked below is F-5-1, not a length or plain-language failure.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Replay Capsule | 2 | Pass — product label |
| Demo / Privacy / Terms | 3 | Pass — destinations |
| Local replay files for browser games | 6 | Pass — section label |
| Replay browser-game bugs from a small file. | 7 | Pass |
| For solo 2D game developers who need a bug report that repeats the player’s inputs and timing. | 17 | Pass |
| Try it with sample data | 5 | Pass — result-naming action |
| Loads a seeded bug run you can replay. | 8 | Pass |
| Copy install command | 3 | Pass — result-naming action |
| Record, import, and replay offline after this page loads | 9 | Pass |
| Free under the MIT License | 5 | Pass |
| No tracking or server calls | 5 | **F-5-1** |
| Input sequence / Same sequence | 4 | Pass — diagram labels |
| Seed, inputs, and timing in one capped file. | 8 | Pass |
| Start / A person starts recording | 5 | Pass |
| Capture / Inputs, timing, and seed | 5 | Pass |
| Replay / Your game applies events | 5 | Pass |
| Live package demo | 3 | Pass — section label |
| Record and replay a sample bug. | 6 | Pass |
| Start recording, steer the probe, and reach a red fault cell. | 11 | Pass |
| Download the file or import it again to replay the path. | 11 | Pass |
| Capture controls / Ready | 3 | Pass |
| Probe navigation game. | 3 | Pass — canvas name |
| Use arrow keys or click to move; avoid striped fault cells and reach the round beacon. | 16 | Pass |
| Ready to record | 3 | Pass |
| Start recording to begin a seeded run. | 7 | Pass |
| Arrow keys steer; pointer moves probe; avoid fault cells | 9 | Pass |
| Start recording / Stop recording / Reset run | 6 | Pass — result-naming actions |
| Download capsule / Import capsule / Replay capsule | 6 | Pass — result-naming actions |
| Replay progress | 2 | Pass |
| No input has been captured yet. | 6 | Pass |
| This tab does not save your run. | 7 | Pass |
| Capsule details | 2 | Pass — section heading |
| Seed / Events / Elapsed / Payload / Network | 5 | Pass |
| Capsule capacity used | 3 | Pass |
| Captured: key codes, pointer positions, changed gamepad samples, your seed, and checkpoints. | 12 | Pass |
| Not captured: typed text, DOM content, identity, cookies, or network traffic. | 11 | Pass |
| What the library does | 4 | Pass — section label |
| Keep the bug report small and private. | 7 | Pass — mapped to privacy/cap claims |
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
| Install version 0.1.7 from this hosted npm tarball. | 9 | Pass |
| Local replay files for browser-game debugging. | 6 | Pass |
| Built by Param Factory · v0.1.7 · polish-4 | 6 | Pass — build label |

The image alternative is also plain and useful: “An illustrated cream and petrol recorder passing the same sequence of game-event shapes from one side to the other.” (19 words). The demo-only state strings are all under 22 words and use result-naming actions: **Reset demo**, **Start for real**, **Start recording**, **Download capsule**, **Import capsule**, and **Replay capsule**.

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Replay Capsule | 2 | Pass — title |
| Replay Capsule is a dependency-free TypeScript library for reproducible browser-game bug reports. | 12 | Pass |
| It records keyboard, pointer, and gamepad inputs with timing, a deterministic seed, and small checkpoints. | 15 | Pass |
| It then exports one capped JSON file your game can replay. | 11 | Pass |
| It is for solo developers shipping small 2D browser games. | 10 | Pass |
| It does not record typed text or send data to a service. | 12 | Pass |
| Try the sample demo | 4 | Pass — heading |
| Open the sample demo, or select Try it with sample data on the landing page. | 14 | Pass |
| It loads a seeded fault capsule with one pointer input and checkpoint. | 12 | Pass |
| The demo is isolated in `demo:replay-capsule:memory`, writes no browser storage, and is discarded when you reset or leave it. | 16 | Pass |
| Install | 1 | Pass — heading |
| This versioned npm tarball is available now. | 7 | Pass |
| Record | 1 | Pass — heading |
| Recording is always opt-in: connect `start()` to a clear user action. | 10 | Pass |
| Text inputs, textareas, selects, and editable elements are never captured. | 10 | Pass |
| Import and replay | 3 | Pass — heading |
| Replay Capsule schedules stored events. | 5 | Pass |
| Your game decides what each event does. | 7 | Pass |
| `onEvent` receives the same normalized event shape stored in the capsule. | 11 | Pass |
| `pause()`, `resume()`, and `stop()` are available for debugger controls. | 9 | Pass |
| Use `speed` to accelerate playback. | 5 | Pass |
| See the live documentation and working Canvas demo at browser-game-replay-capsule.sociobot.in. | 10 | Pass |
| Phaser integration fixture | 3 | Pass — heading |
| The repository includes a small Phaser 3 scene. | 8 | Pass |
| It records from Phaser’s canvas and replays imported files through the scene adapter. | 13 | Pass |
| Its deterministic game model lives beside it for auditing without bundling Phaser into this package. | 15 | Pass |
| The browser fixture imports 20 generated replay files under the deployed content-security policy. | 13 | Pass |
| It reproduces all 20 seeded fault outcomes. | 7 | Pass |
| The target is 18 of 20 (90%). | 7 | Pass |
| Run its exact regression with: | 5 | Pass |
| API | 1 | Pass — heading |
| `createRecorder(options)` returns start, stop, clear, checkpoint, export, state, and status. | 10 | Pass — API summary |
| `importCapsule(...)` validates and resolves a versioned `ReplayCapsule`. | 6 | Pass — API summary |
| `validateCapsule(value)` synchronously validates trusted in-memory input. | 6 | Pass — API summary |
| `createPlayer(...)` provides playback callbacks and pause, resume, and stop controls. | 9 | Pass — API summary |
| `downloadCapsule(...)` starts a local JSON download. | 5 | Pass — API summary |
| The package exports ESM, CommonJS, and declarations. | 7 | Pass |
| The ReplayEvent, ReplayCheckpoint, ReplayCapsule, recorder/player option, state, and status types are public. | 12 | Pass |
| Limits and browser behavior | 4 | Pass — heading |
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
| Development | 1 | Pass — heading |
| Requires Node.js 20+. | 3 | Pass |
| Deploy `dist/site` as the static root. | 6 | Pass |
| Run every command listed in `.factory/claims.json` when changing a listed product claim. | 12 | Pass |
| `npm run build` prepares the versioned tarball served by the site. | 10 | Pass |

The existing terminology remains consistent: **capsule** (exported JSON), **recording** (operation), **seed** (deterministic value), **checkpoint** (game-state marker), and **demo** (isolated sample). All meaningful capability sentences map to a listed claim except the overbroad landing formulation in F-5-1.

## Demo and sandbox verification

- One click on the landing action opened canonical `/demo` and focused the destination h1.
- At 390 × 844, the first demo view showed `RC-SAMPLE-FAULT-17`, “1 event · fault-contact”, **Replay sample**, and the demo banner. The quick action ended at y=548.33.
- **Replay sample** immediately produced “Replay complete: the recorded outcome was reproduced.”
- The visible banner states **“Demo — sample data, nothing is saved.”** and supplies **Reset demo** and **Start for real**.
- **Reset demo** restored the original seed, one event, and “Sample capsule loaded. Replay it or start a new recording.”
- The live page used `demo:replay-capsule:memory`. Local storage, session storage, cookies, Cache Storage, IndexedDB, and service-worker registrations were empty.
- After the first load, setting the fresh browser context offline still allowed replay to complete.
- The observed live request log contained only this origin. F-5-1 is about the test’s inability to exclude future same-origin non-static calls, not an observed third-party request.

## Claims and clean-clone checks

A fresh clone at `/tmp/replay-review-5-AiB3aj` ran `npm ci` and every one of the 25 exact commands listed in `.factory/claims.json`. All commands completed successfully. `npm run check` also passed its typecheck, 32 unit/package tests, production build, site-build verification, and complete Playwright suite (52 browser tests, four intentional cross-project skips). `npm run lint` and `npm pack --dry-run` passed.

The claim inventory is otherwise complete for the landing and README behavior: demo sandbox, first-party request origin, opt-in recording, typed-text exclusion, exact record/export/import/replay, in-memory real mode, capture surface, caps, validation, pointer and gamepad handling, callbacks and controls, Phaser fixture/recording, package formats, hosted install, offline-after-load behavior, MIT terms, and Node 20 runtime all have exact tagged regressions. F-5-1 remains because the network test’s assertion is weaker than both its claim text and the hero’s privacy wording.

## Earlier finding confirmation

Every earlier review, polish record, and handoff was read and checked against live behavior and current code.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 route focus | Fixed: Home → Demo focused `#demo-title`; Back focused the landing h1. |
| F-1-2 canonical demo address | Fixed for browser visitors: `/demo/` executes `location.replace('/demo')`; internal links, canonical, sitemap, and Open Graph use `/demo`. |
| F-1-3 404 social metadata | Fixed: the 404 has its own title, description, canonical, 7 Open Graph tags, and 4 Twitter tags. |
| F-1-4 external-link indication | Fixed: product navigation has no external links. |
| F-1-5/F-2-11 long README copy | Fixed: all audited sentences are at most 19 words. |
| F-1-6/F-4-5 registry wording | Fixed: copy identifies the tested hosted 0.1.7 tarball and makes no registry-status promise. |
| F-2-1 demo first screen | Fixed: seed, sample summary, replay action, and banner are visible on phone. |
| F-2-2/F-4-2 Phaser evidence | Fixed: real Phaser recording and 20 imported fixture replays have separate claims. |
| F-2-3 replay proof | Fixed: the regression compares the downloaded event list with applied events. |
| F-2-4/F-2-5 privacy surface | Fixed: separate tests preserve storage sentinels and inspect the downloaded capsule. |
| F-2-6/F-2-7/F-2-8 | Fixed: exact 128 KB wording, Node 20 consumer proof, and desktop first-screen facts remain present. |
| F-2-9/F-3-1/F-4-1 | Fixed: shared navigation is consistent; the phone facts fit; all checked routes stay 390 px wide at 200% text. |
| F-2-10/F-2-12–15 | Fixed: first-screen facts, **Start recording**, **Capsule details**, person/API wording, and closed-Shadow-DOM wording remain clear. |
| F-4-3/F-4-4 | Fixed: `key-filter` and `capped-export-import` are listed and tagged. |

## Structure, accessibility, and visual identity

- `/`, `/demo`, `/privacy/`, `/terms/`, `/404.html`, `robots.txt`, `sitemap.xml`, and the hosted release returned 200. An unknown route returned the designed page with HTTP 404.
- Live root, demo, privacy, terms, and 404 pages each have `lang="en"`, one h1, one main landmark, a route-specific title, description, canonical URL, favicon, Apple touch icon, and complete Open Graph/Twitter metadata.
- At 200% text on 390 px, every checked route had `scrollWidth === clientWidth === 390`; all header links ended inside the viewport.
- Live Axe scans had zero violations on root, demo, privacy, terms, and 404. Normal pages emitted no console/page errors. The browser’s expected resource message for the deliberate HTTP-404 navigation was the only 404-route console entry.
- Header/footer destinations are consistent. Deep links and Back work, and route focus moves to the new h1.
- The cream enamel, petrol, amber, self-hosted Atkinson Hyperlegible/Space Mono pairing, instrument-panel drawing, ticks, and physical-control motion match `.factory/design.md`. This is a distinct mid-century instrument panel, not a generic SaaS layout.

## Missed leverage

No additional feature is required by the brief. Import, download, replay, seed, checkpoints, and the real Phaser fixture cover the expected debugging workflow. Sync would contradict the local-first privacy boundary. An AI feature would not improve deterministic input capture and would add an unnecessary data path. No provider key or decorative AI feature is present.

## What would make this perfect

Resolve F-5-1. Use a privacy statement whose scope is exact, and make its claim test reject every same-origin API or analytics request rather than checking only request origin. Then rerun the tagged claim, the full check, and a fresh live request-log audit. No other change is indicated by this review.
