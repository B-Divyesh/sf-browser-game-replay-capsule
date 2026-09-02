# Adversarial first-read review 7 — Replay Capsule

**Reviewed:** 2026-09-02 UTC  
**Live URL:** https://browser-game-replay-capsule.sociobot.in  
**Repository commit reviewed:** `1ad10bc3b98bd5537fb4d4a45bee1b908b787cfc`  
**Verdict:** **PASS**

No blocking, major, minor, or untested-claim finding remains. This review was run as a cold visitor review, not a diff-only check. No product code was changed.

## Cold first read

Fresh Chromium contexts opened the live landing page without scrolling at 390 × 844 and 1440 × 900.

| Question | Answer available before scrolling | Exact first-screen evidence |
| --- | --- | --- |
| What does this do? | It makes a small replay file for reproducing browser-game bugs. | “Replay browser-game bugs from a small file.” |
| For whom? | Solo developers of 2D browser games. | “For solo 2D game developers who need a bug report that repeats the player’s inputs and timing.” |
| What should I click first? | **Try it with sample data**. | The visible primary action, with “Loads a seeded bug run you can replay.” |

This passes at both sizes. The mobile three-fact list ends within the 844 px viewport; the desktop list ends at 729 px in a 900 px viewport. The distinct mid-century instrument-panel treatment matches the documented design direction; it is not a generic SaaS layout.

## Copy audit

Counts use visible whitespace-separated words. Code blocks, URLs as destinations, generated values, and code signatures are excluded. Technical API names are retained where they name a public library surface. No sentence exceeds 22 words. No banned marketing adjective, unexplained metaphor heading, inconsistent core term, or non-result-naming button was found.

### Landing-page copy

| Copy | Words | Check |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Replay Capsule | 2 | Pass — product label |
| Demo / Privacy / Terms | 3 | Pass — destinations |
| Local replay files for browser games | 6 | Pass — context label |
| Replay browser-game bugs from a small file. | 7 | Pass — job headline |
| For solo 2D game developers who need a bug report that repeats the player’s inputs and timing. | 17 | Pass — audience and outcome |
| Try it with sample data | 5 | Pass — result-naming first action |
| Loads a seeded bug run you can replay. | 8 | Pass |
| Copy install command | 3 | Pass — result-naming action |
| Record, import, and replay offline after this page loads | 9 | Pass — `offline-demo` |
| Free under the MIT License | 5 | Pass — `mit-license` |
| No tracking or API calls | 5 | Pass — `no-network-calls` |
| Input sequence / Same sequence | 4 | Pass — diagram labels |
| An illustrated cream and petrol recorder passing the same sequence of game-event shapes from one side to the other. | 19 | Pass — image alternative |
| Seed, inputs, and timing in one capped file. | 8 | Pass |
| Start / A person starts recording | 5 | Pass |
| Capture / Inputs, timing, and seed | 5 | Pass |
| Replay / Your game applies events | 5 | Pass |
| Live package demo | 3 | Pass — context label |
| Record and replay a sample bug. | 6 | Pass — section heading |
| Start recording, steer the probe, and reach a red fault cell. | 11 | Pass |
| Download the file or import it again to replay the path. | 11 | Pass |
| Capture controls / Ready | 3 | Pass |
| Probe navigation game. | 3 | Pass — canvas name |
| Use arrow keys or click to move; avoid striped fault cells and reach the round beacon. | 16 | Pass — canvas instruction |
| Ready to record / Start recording to begin a seeded run. | 10 | Pass — empty state |
| Arrow keys steer; pointer moves probe; avoid fault cells | 9 | Pass |
| Start recording / Stop recording / Reset run | 6 | Pass — result-naming actions |
| Download capsule / Import capsule / Replay capsule | 6 | Pass — result-naming actions |
| Replay progress | 2 | Pass |
| No input has been captured yet. | 6 | Pass |
| This tab does not save your run. | 7 | Pass — `no-browser-persistence` |
| Capsule details / Seed / Events / Elapsed / Payload / Network | 7 | Pass |
| Capsule capacity used | 3 | Pass |
| Captured: key codes, pointer positions, changed gamepad samples, your seed, and checkpoints. | 12 | Pass — capture claims |
| Not captured: typed text, DOM content, identity, cookies, or network traffic. | 11 | Pass — `capture-surface` |
| You are offline. | 3 | Pass |
| You can record, import, and replay after this page loads. | 10 | Pass — `offline-demo` |
| What the library does / Keep the bug report small and private. | 11 | Pass — clear section and outcome |
| Use your game adapter / Your game adapter receives each stored event through a callback. | 14 | Pass — `adapter-callbacks` |
| Stay inside the byte cap / The recorder stops before it crosses the configured cap. | 14 | Pass — `default-byte-cap` |
| The default cap is 128 KB. | 6 | Pass — `default-byte-cap` |
| Control replay timing / Replay at normal speed or faster. | 9 | Pass — `replay-controls` |
| Pause, resume, and stop are available in the public API. | 10 | Pass — `replay-controls` |
| Install the library / Add replay capture to your game loop. | 11 | Pass — clear section and outcome |
| Copy code | 2 | Pass — result-naming action |
| Install version 0.1.8 from this hosted npm tarball. | 9 | Pass — `installable-release` |
| Local replay files for browser-game debugging. | 6 | Pass |
| Built by Param Factory · v0.1.8 · repair-9 | 6 | Pass — build label |
| Demo — sample data, nothing is saved. | 6 | Pass — demo banner |
| This run stays in memory and is discarded when you leave. | 11 | Pass — demo scope |
| Reset demo / Start for real | 5 | Pass — result-naming actions |
| Sample capsule loaded. / Replay it or start a new recording. | 10 | Pass |
| Capsule loaded. / Press “Replay capsule” to reproduce the run. | 9 | Pass |
| Empty capsule. / This valid file has no input events to replay. | 11 | Pass |
| Recording this game surface now. / Text fields remain excluded. | 9 | Pass — `text-entry-excluded` |
| Recording stopped. / Download or replay the capsule. | 7 | Pass |
| Stopped with no inputs. / Move the probe after starting to create a useful capsule. | 14 | Pass |
| The 128 KB cap was reached. / The last complete event is preserved; download or reset the capsule. | 17 | Pass — cap claim |
| Fault reproduced and checkpointed. / Download this capsule or replay it here. | 11 | Pass |
| Fault reproduced. / The run ended on a striped fault cell. | 10 | Pass |
| Beacon reached. / The successful path is ready to replay. | 9 | Pass |
| The run ended at the round beacon. | 7 | Pass |
| Capsule downloaded. / It contains no video or typed text. | 9 | Pass — `capture-surface`, `text-entry-excluded` |
| Imported [count] events. / Seed and checkpoints validated locally. | 8 | Pass — validated import |
| The imported capsule is valid but contains no input events. | 10 | Pass |
| Import failed. / Choose a Replay Capsule JSON file under 1 MB. | 11 | Pass — recovery text |
| Replaying recorded timing at 2× speed… | 6 | Pass |
| Replay complete: the recorded outcome was reproduced. | 7 | Pass — `record-export-replay` |
| Replay complete: the same [count] recorded events were applied. | 9 | Pass — `record-export-replay` |
| Replay matched the end state. / The recorded run reached the same game result. | 13 | Pass |
| Install command copied. | 3 | Pass |
| Copy unavailable. / Select the install command in the package section. | 10 | Pass — recovery text |

### README copy

| Copy | Words | Check |
| --- | ---: | --- |
| Replay Capsule | 2 | Pass — title |
| Replay Capsule is a dependency-free TypeScript library for reproducible browser-game bug reports. | 12 | Pass — `zero-runtime-dependencies` |
| It records keyboard, pointer, and gamepad inputs with timing, a deterministic seed, and small checkpoints. | 15 | Pass — capture claims |
| It then exports one capped JSON file your game can replay. | 11 | Pass — replay/cap claims |
| It is for solo developers shipping small 2D browser games. | 10 | Pass — audience |
| It does not record typed text or send data to a service. | 11 | Pass — privacy claims |
| Try the sample demo | 4 | Pass — descriptive heading |
| Open the sample demo, or select Try it with sample data on the landing page. | 15 | Pass — demo action |
| It loads a seeded fault capsule with one pointer input and checkpoint. | 12 | Pass — `sample-demo` |
| The demo is isolated in `demo:replay-capsule:memory`, writes no browser storage, and is discarded when you reset or leave it. | 19 | Pass — demo/persistence claims |
| Install | 1 | Pass — descriptive heading |
| This versioned npm tarball is available now. | 7 | Pass — `installable-release` |
| Record | 1 | Pass — descriptive heading |
| Recording is always opt-in: connect `start()` to a clear user action. | 11 | Pass — `opt-in-recording` |
| Text inputs, textareas, selects, and editable elements are never captured. | 10 | Pass — `text-entry-excluded` |
| Import and replay | 3 | Pass — descriptive heading |
| Replay Capsule schedules stored events. | 5 | Pass — API description |
| Your game decides what each event does. | 7 | Pass — API distinction |
| `onEvent` receives the same normalized event shape stored in the capsule. | 11 | Pass — `adapter-callbacks` |
| `pause()`, `resume()`, and `stop()` are available for debugger controls. | 9 | Pass — `replay-controls` |
| Use `speed` to accelerate playback. | 5 | Pass — `replay-controls` |
| See the live documentation and working Canvas demo at browser-game-replay-capsule.sociobot.in. | 10 | Pass |
| Phaser integration fixture | 3 | Pass — descriptive heading |
| The repository includes a small Phaser 3 scene. | 9 | Pass |
| It records from Phaser’s canvas and replays imported files through the scene adapter. | 13 | Pass — `phaser-recording` |
| Its deterministic game model lives beside it for auditing without bundling Phaser into this package. | 15 | Pass |
| The browser fixture imports 20 generated replay files under the deployed content-security policy. | 13 | Pass — fixture claim |
| It reproduces all 20 seeded fault outcomes. | 7 | Pass — `seeded-failure-fixture` |
| The target is 18 of 20 (90%). | 7 | Pass — tested quantity |
| Run its exact regression with: | 5 | Pass |
| API | 1 | Pass — descriptive heading |
| The package exports ESM, CommonJS, and declarations. | 7 | Pass — `package-formats` |
| The `ReplayEvent`, `ReplayCheckpoint`, `ReplayCapsule`, recorder/player option, state, and status types are public. | 12 | Pass — package format claim |
| Limits and browser behavior | 4 | Pass — descriptive heading |
| Default cap: 128 KB; supported range: 4 KB–1 MB. | 10 | Pass — cap claims |
| The recorder stops before an event would cross the cap and reports `limit-reached`. | 13 | Pass — `default-byte-cap` |
| On `stop()` or `export()`, the recorder rechecks the cap after timing changes. | 12 | Pass — capped-export claim |
| It keeps only whole entries that fit. | 7 | Pass |
| Accounting and the downloaded file use the same compact JSON bytes, so a capped recorder export stays importable. | 18 | Pass — `capped-export-import` |
| Pointer coordinates are normalized to the configured target when possible. | 11 | Pass — `pointer-normalization` |
| Pointer input is captured before bubble-phase game handlers. | 8 | Pass — `pointer-capture-order` |
| Capture-phase handlers still follow browser registration order. | 7 | Pass — documented limit |
| Key identity uses `KeyboardEvent.code`, not typed characters. | 7 | Pass — capture claim |
| Text-entry events are ignored in light, open-shadow, and closed-shadow DOM. | 10 | Pass — `text-entry-excluded` |
| If an event may come from a text field in closed Shadow DOM, the library does not record it. | 19 | Pass — `text-entry-excluded` |
| Set `shouldCaptureKey` to keep a game surface's control keys out of its replay stream. | 14 | Pass — `key-filter` |
| After its first load, the demo can record, import, and replay while the browser is offline. | 17 | Pass — `offline-demo` |
| It does not claim that an offline reload works. | 9 | Pass — explicit limit |
| Gamepads are sampled once per animation frame, but browser gamepad timestamps are inconsistent. | 14 | Pass — `gamepad-sampling` |
| Replay Capsule timestamps the sample at observation time and stores the browser timestamp only as optional diagnostic metadata. | 18 | Pass — `gamepad-sampling` |
| Capsule imports are schema-validated and reject malformed, unsupported, or over-limit files. | 12 | Pass — `validated-import` |
| The library makes no API or tracking calls. | 8 | Pass — `no-network-calls` |
| The demo uses only known same-origin static files. | 8 | Pass — `no-network-calls` |
| Development | 1 | Pass — descriptive heading |
| Requires Node.js 20+. | 3 | Pass — `node-20-runtime` |
| Deploy `dist/site` as the static root. | 6 | Pass — deployment instruction |
| Run every command listed in `.factory/claims.json` when changing a listed product claim. | 12 | Pass — contributor instruction |
| `npm run build` prepares the versioned tarball served by the site. | 10 | Pass — `installable-release` |

The terminology is consistent: **capsule** is the exported replay JSON; **seed** is the deterministic game value; **checkpoint** is a game-state marker; **recording** is the opt-in operation; and **demo** is the isolated sample. The landing and README have no unlisted claim-like sentence after cross-checking them against `.factory/claims.json`.

## Demo, privacy, and core job

The landing action reaches `/demo` in one click. The first mobile demo screen already shows `RC-SAMPLE-FAULT-17`, one event, `fault-contact`, **Replay sample**, and the persistent **“Demo — sample data, nothing is saved.”** banner. **Reset demo** restored the sample; **Start for real** returned to real mode without retaining the banner.

A fresh request log during demo replay recorded ten same-origin static GET requests only. It found no API, tracking, analytics, telemetry, third-party, or data-bearing request. The live audit confirmed empty localStorage, sessionStorage, IndexedDB, Cache Storage, cookies, and service-worker registrations in demo mode. The recorded/replayed sample worked after the initial page load with that browser context offline. The brief does not imply a missing AI feature or sync: capture, export, import, and replay are the direct local-first job, and adding AI would not improve that path.

## Claims and quality gates

After `npm ci` in this checkout, every exact command in `.factory/claims.json` passed. The first sequential run demonstrably reached claim 19 only after claims 1–18 completed; claims 19–26 were then rerun individually and passed.

| Claim IDs | Result |
| --- | --- |
| `sample-demo`, `no-network-calls`, `opt-in-recording`, `text-entry-excluded`, `record-export-replay`, `no-browser-persistence`, `capture-surface` | PASS |
| `checkpoint-capture`, `key-filter`, `default-byte-cap`, `capped-export-import`, `custom-cap-range`, `validated-import` | PASS |
| `pointer-normalization`, `pointer-capture-order`, `gamepad-sampling`, `adapter-callbacks`, `replay-controls` | PASS |
| `seeded-failure-fixture`, `phaser-recording`, `package-formats`, `installable-release`, `zero-runtime-dependencies` | PASS |
| `offline-demo`, `mit-license`, `node-20-runtime` | PASS |

Additional checks passed: `npm test` (32/32), `npm run typecheck`, `npm run lint`, and `npm run build`. The full browser suite recorded `status: passed` with 55 passes and five intentional desktop/mobile project skips. The build's 333.25 kB gzip Phaser bundle is isolated to `/phaser-fixture.html`; the landing entry is 4.07 kB gzip JavaScript, so it does not violate the first-load limit.

## Earlier-finding regression check

I read every `review-*.md`, `polish-*.md`, the prior handoff, and the verification history. Each earlier finding was confirmed on the live site and in current code/tests.

| Earlier ID | Current confirmation |
| --- | --- |
| F-1-1 | Home → Demo and browser Back focus the destination `<h1>`. |
| F-1-2 | `/demo/` normalizes in-browser to canonical `/demo`; internal URLs, canonical tags, and sitemap use `/demo`. |
| F-1-3 | The designed HTTP 404 has complete Open Graph and Twitter metadata. |
| F-1-4 | Product pages have no external links requiring an external-site warning. |
| F-1-5 | The previously long README sentences remain split and below 22 words. |
| F-1-6 | No public-registry availability statement remains; the tested hosted tarball is named. |
| F-2-1 | The mobile demo exposes banner, sample facts, and replay action above the first viewport. |
| F-2-2 | The shipped Phaser scene, rather than only a model, replays 20 imported fault capsules. |
| F-2-3 | The record/export/import/replay test compares exact events and the visible end state. |
| F-2-4 | Real mode has storage/cookie sentinel coverage across record, reset, export, import, replay, and reload. |
| F-2-5 | The exported capsule-surface test excludes DOM, identity-like, cookie, and request values. |
| F-2-6 | Subjective sharing language is replaced by the tested 128 KB default-cap fact. |
| F-2-7 | A pinned Node 20 clean consumer tests ESM and CommonJS. |
| F-2-8 | All desktop first-screen facts remain visible. |
| F-2-9 | Demo, Privacy, and Terms are consistent across header and footer routes. |
| F-2-10 | The first screen states offline-after-load behavior, MIT price, and privacy scope. |
| F-2-11 | The Phaser README description remains concise. |
| F-2-12 | The capture action is **Start recording**. |
| F-2-13 | The details panel uses **Capsule details**, not privacy-conflicting jargon. |
| F-2-14 | Person and API responsibilities are stated directly. |
| F-2-15 | Closed-Shadow-DOM exclusion wording is direct and covered. |
| F-3-1 | At 390 × 844, all three landing facts remain within the cold first screen. |
| F-4-1 | At 200% text, all audited routes wrap without horizontal overflow. |
| F-4-2 | Phaser canvas recording has its own listed regression. |
| F-4-3 | `shouldCaptureKey` behavior has its own listed regression. |
| F-4-4 | Near-cap downloads are checked against their byte cap and re-imported. |
| F-4-5 | Undefined registry-status wording was removed. |
| F-5-1 | The privacy claim says “No tracking or API calls”; its test permits only approved static GETs. |
| F-6-1 | Pointer capture-before-bubble behavior and its capture-phase limit are documented and tested. |

## Structure and route checks

`/`, `/demo`, `/privacy/`, `/terms/`, robots, sitemap, favicon, Apple icon, social image, and the hosted tarball returned 200. An unknown route returned the designed HTTP 404. The five page routes have one `<h1>`, one `<main>`, `lang="en"`, route-specific title, description, canonical URL, Open Graph/Twitter metadata, favicon, visible focus, header/footer navigation, and a skip link. Axe found zero violations on landing, demo, both legal pages, and 404. The route audit also confirmed reduced-motion behavior, 200% reflow, visible focus, back-navigation focus, and no ordinary console/page error.

## What would make this perfect

Keep the exact claim inventory synchronized with future copy and rerun this cold mobile/desktop, storage/request, and route audit on every release. No current product change is indicated.
