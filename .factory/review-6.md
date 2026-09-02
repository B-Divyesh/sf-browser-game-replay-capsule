# Adversarial first-read review 6 — Replay Capsule

**Reviewed:** 2026-09-02 UTC

**Live URL:** https://browser-game-replay-capsule.sociobot.in

**Repository commit:** `b458d021a564b105fe06f6e7e1f5820756879cf5`

**Verdict:** **FAIL**

The product is clear, immediately tryable, and operational on phone and desktop. All 25 listed claim commands pass. The review still fails because one README guarantee is not stated in `.factory/claims.json` and is broader than its incidental browser coverage.

## Finding

### F-6-1 — MAJOR: pointer-handler ordering is an unlisted and overbroad claim

**Exact quote/location:** `README.md`, **Limits and browser behavior**: “Pointer input is captured before the host game handles it, so the input that ends a run remains in the capsule.”

**Why this fails:** `.factory/claims.json` lists pointer-coordinate normalization and end-to-end replay, but no entry states this handler-order guarantee. The `record-export-replay` test incidentally confirms that the demo retains its terminal pointer event; it does not inventory or isolate the public library guarantee. The wording also implies priority over every host handler. The implementation registers a capture-phase listener, but another capture-phase listener registered earlier still runs first under DOM event ordering.

**Concrete fix:** Replace the sentence with: “Pointer input is captured before bubble-phase game handlers. Capture-phase handlers still follow browser registration order.” Add a `pointer-capture-order` claim entry for the first sentence. Its tagged browser test must attach a bubble-phase handler that immediately stops the recorder, dispatch a pointer event, and assert that the exported capsule contains that event. Alternatively, remove the ordering sentence.

## Cold first read

Fresh Chromium contexts opened `/` at 390 × 844 and 1440 × 900. No scrolling occurred before this assessment.

| Question | Answer from the first screen | Evidence |
| --- | --- | --- |
| What does this do? | It records browser-game inputs, timing, and a seed in a small file that the game can replay. | “Replay browser-game bugs from a small file.” |
| For whom? | Solo developers of 2D browser games. | “For solo 2D game developers…” |
| What should I click first? | **Try it with sample data**. | The primary action and “Loads a seeded bug run you can replay” are visible at both sizes. |

The phone facts end at 821.42 px in an 844 px viewport. They state offline behavior, MIT price, and privacy. The desktop view shows the same copy beside the product-specific recorder illustration.

## Copy audit

Counts treat hyphenated terms, code identifiers, and linked phrases as one word. Code blocks and URL targets are excluded. Headings, controls, accessible names, and interaction messages are included because visitors encounter them as product copy.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Replay Capsule | 2 | Pass — product name |
| Demo | 1 | Pass — destination |
| Privacy | 1 | Pass — destination |
| Terms | 1 | Pass — destination |
| Local replay files for browser games | 6 | Pass — section label |
| Replay browser-game bugs from a small file. | 7 | Pass — verb-first job |
| For solo 2D game developers who need a bug report that repeats the player’s inputs and timing. | 17 | Pass |
| Try it with sample data | 5 | Pass — result-naming action |
| Loads a seeded bug run you can replay. | 8 | Pass |
| Copy install command | 3 | Pass — result-naming action |
| Record, import, and replay offline after this page loads | 9 | Pass |
| Free under the MIT License | 5 | Pass |
| No tracking or API calls | 5 | Pass |
| Input sequence | 2 | Pass — diagram label |
| Same sequence | 2 | Pass — diagram label |
| An illustrated cream and petrol recorder passing the same sequence of game-event shapes from one side to the other. | 19 | Pass — image alternative |
| Seed, inputs, and timing in one capped file. | 8 | Pass |
| Start | 1 | Pass — flow heading |
| A person starts recording | 4 | Pass |
| Capture | 1 | Pass — flow heading |
| Inputs, timing, and seed | 4 | Pass |
| Replay | 1 | Pass — flow heading |
| Your game applies events | 4 | Pass |
| Live package demo | 3 | Pass — section label |
| Record and replay a sample bug. | 6 | Pass |
| Start recording, steer the probe, and reach a red fault cell. | 11 | Pass |
| Download the file or import it again to replay the path. | 11 | Pass |
| Capture controls | 2 | Pass — heading |
| Ready | 1 | Pass — state |
| Probe navigation game. | 3 | Pass — canvas name |
| Use arrow keys or click to move; avoid striped fault cells and reach the round beacon. | 16 | Pass — canvas instruction |
| Ready to record | 3 | Pass — empty-state heading |
| Start recording to begin a seeded run. | 7 | Pass — empty-state instruction |
| Arrow keys steer; pointer moves probe; avoid fault cells | 9 | Pass — control hint |
| Start recording | 2 | Pass — result-naming action |
| Stop recording | 2 | Pass — result-naming action |
| Reset run | 2 | Pass — result-naming action |
| Download capsule | 2 | Pass — result-naming action |
| Import capsule | 2 | Pass — result-naming action |
| Replay capsule | 2 | Pass — result-naming action |
| Replay progress | 2 | Pass — control name |
| No input has been captured yet. | 6 | Pass |
| This tab does not save your run. | 7 | Pass |
| Capsule details | 2 | Pass — heading |
| Seed | 1 | Pass — field label |
| Events | 1 | Pass — field label |
| Elapsed | 1 | Pass — field label |
| Payload | 1 | Pass — field label |
| Network | 1 | Pass — field label |
| Capsule capacity used | 3 | Pass — control name |
| Captured: key codes, pointer positions, changed gamepad samples, your seed, and checkpoints. | 12 | Pass |
| Not captured: typed text, DOM content, identity, cookies, or network traffic. | 11 | Pass |
| What the library does | 4 | Pass — section label |
| Keep the bug report small and private. | 7 | Pass |
| Use your game adapter | 4 | Pass — heading |
| Your game adapter receives each stored event through a callback. | 10 | Pass |
| Stay inside the byte cap | 5 | Pass — heading |
| The recorder stops before it crosses the configured cap. | 9 | Pass |
| The default cap is 128 KB. | 6 | Pass |
| Control replay timing | 3 | Pass — heading |
| Replay at normal speed or faster. | 6 | Pass |
| Pause, resume, and stop are available in the public API. | 10 | Pass |
| Install the library | 3 | Pass — section label |
| Add replay capture to your game loop. | 7 | Pass |
| Copy code | 2 | Pass — result-naming action |
| Install version 0.1.8 from this hosted npm tarball. | 9 | Pass |
| Local replay files for browser-game debugging. | 6 | Pass |
| Built by Param Factory · v0.1.8 · repair-9 | 6 | Pass — build label |

### Landing interaction messages

| Copy | Words | Result |
| --- | ---: | --- |
| Demo — sample data, nothing is saved. | 6 | Pass |
| This run stays in memory and is discarded when you leave. | 11 | Pass |
| Reset demo | 2 | Pass — result-naming action |
| Start for real | 3 | Pass — prescribed demo exit |
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
| Fault reproduced. | 2 | Pass |
| The run ended on a striped fault cell. | 8 | Pass |
| Beacon reached. | 2 | Pass |
| The successful path is ready to replay. | 7 | Pass |
| The run ended at the round beacon. | 7 | Pass |
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
| Replay matched the end state. | 5 | Pass |
| The recorded run reached the same game result. | 8 | Pass |
| You are offline. | 3 | Pass |
| You can record, import, and replay after this page loads. | 10 | Pass |
| Install command copied. | 3 | Pass |
| Copy unavailable. | 2 | Pass |
| Select the install command in the package section. | 8 | Pass |
| Copied | 1 | Pass — result state |

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
| Open the sample demo, or select Try it with sample data on the landing page. | 15 | Pass |
| It loads a seeded fault capsule with one pointer input and checkpoint. | 12 | Pass |
| The demo is isolated in `demo:replay-capsule:memory`, writes no browser storage, and is discarded when you reset or leave it. | 19 | Pass |
| Install | 1 | Pass — heading |
| This versioned npm tarball is available now. | 7 | Pass |
| Record | 1 | Pass — heading |
| Recording is always opt-in: connect `start()` to a clear user action. | 11 | Pass |
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
| `createRecorder(options)` → `start`, `stop`, `clear`, `checkpoint`, `export`, plus live `state` and `status` getters. | 13 | Pass — API summary |
| `importCapsule(string | Blob | object, maxBytes?)` → validates and resolves a versioned `ReplayCapsule`. | 13 | Pass — API summary |
| `validateCapsule(value)` → synchronously validates trusted in-memory input. | 7 | Pass — API summary |
| `createPlayer(capsule, options)` → `play`, `pause`, `resume`, and `stop` with event, checkpoint, state, and progress callbacks. | 15 | Pass — API summary |
| `downloadCapsule(capsule, filename?)` → starts a local JSON download. | 8 | Pass — API summary |
| The package exports ESM, CommonJS, and declarations. | 7 | Pass |
| The `ReplayEvent`, `ReplayCheckpoint`, `ReplayCapsule`, recorder/player option, state, and status types are public. | 12 | Pass |
| Limits and browser behavior | 4 | Pass — heading |
| Default cap: 128 KB; supported range: 4 KB–1 MB. | 9 | Pass |
| The recorder stops before an event would cross the cap and reports `limit-reached`. | 13 | Pass |
| On `stop()` or `export()`, the recorder rechecks the cap after timing changes. | 12 | Pass |
| It keeps only whole entries that fit. | 7 | Pass |
| Accounting and the downloaded file use the same compact JSON bytes, so a capped recorder export stays importable. | 18 | Pass |
| Pointer coordinates are normalized to the configured target when possible. | 10 | Pass |
| Pointer input is captured before the host game handles it, so the input that ends a run remains in the capsule. | 21 | **F-6-1 — claim inventory and scope** |
| Key identity uses `KeyboardEvent.code`, not typed characters. | 7 | Pass |
| Text-entry events are ignored in light, open-shadow, and closed-shadow DOM. | 10 | Pass |
| If an event may come from a text field in closed Shadow DOM, the library does not record it. | 19 | Pass |
| Set `shouldCaptureKey` to keep a game surface’s control keys out of its replay stream. | 14 | Pass |
| After its first load, the demo can record, import, and replay while the browser is offline. | 16 | Pass |
| It does not claim that an offline reload works. | 9 | Pass — explicit limit |
| Gamepads are sampled once per animation frame, but browser gamepad timestamps are inconsistent. | 13 | Pass |
| Replay Capsule timestamps the sample at observation time and stores the browser timestamp only as optional diagnostic metadata. | 18 | Pass |
| Capsule imports are schema-validated and reject malformed, unsupported, or over-limit files. | 11 | Pass |
| The library makes no API or tracking calls. | 8 | Pass |
| The demo uses only known same-origin static files. | 8 | Pass |
| Development | 1 | Pass — heading |
| Requires Node.js 20+. | 3 | Pass |
| Deploy `dist/site` as the static root. | 6 | Pass — deployment instruction |
| Run every command listed in `.factory/claims.json` when changing a listed product claim. | 12 | Pass — contributor instruction |
| `npm run build` prepares the versioned tarball served by the site. | 11 | Pass — confirmed by the build gate |

No sentence exceeds 22 words. No banned marketing adjective, metaphor heading, unexplained slogan, inconsistent core term, or non-result-naming product action was found. `capsule`, `recording`, `seed`, `checkpoint`, and `demo` are used consistently. F-6-1 is the only copy-related claim gap.

## Demo and sandbox behaviour

- The landing action reaches `/demo` in one click.
- The first 390 px demo view contains the persistent “Demo — sample data, nothing is saved” banner, seed `RC-SAMPLE-FAULT-17`, `1 event · fault-contact`, and **Replay sample**. The quick action ends at 548.33 px.
- **Reset demo** restored the original seed and one-event sample after new input.
- **Start for real** returned to `/` and removed the demo banner.
- Demo state identified itself as `demo:replay-capsule:memory`. Local storage, session storage, IndexedDB, cookies, Cache Storage, and service-worker registrations remained empty.
- The sample replay completed after the fresh context was put offline.
- The full demo request log contained ten approved same-origin static GETs and no API, tracking, telemetry, data-bearing, or third-party request.
- The live Phaser fixture recorded normalized pointer input and reproduced 20 of 20 seeded failures.

## Claims gate

A separate clean clone ran `npm ci`, followed by every exact `test` command in `.factory/claims.json`. Result: **25/25 commands passed**.

| Claim ID | Result |
| --- | --- |
| `sample-demo` | Pass |
| `no-network-calls` | Pass |
| `opt-in-recording` | Pass |
| `text-entry-excluded` | Pass |
| `record-export-replay` | Pass |
| `no-browser-persistence` | Pass |
| `capture-surface` | Pass |
| `checkpoint-capture` | Pass |
| `key-filter` | Pass |
| `default-byte-cap` | Pass |
| `capped-export-import` | Pass |
| `custom-cap-range` | Pass |
| `validated-import` | Pass |
| `pointer-normalization` | Pass |
| `gamepad-sampling` | Pass |
| `adapter-callbacks` | Pass |
| `replay-controls` | Pass |
| `seeded-failure-fixture` | Pass |
| `phaser-recording` | Pass |
| `package-formats` | Pass |
| `installable-release` | Pass |
| `zero-runtime-dependencies` | Pass |
| `offline-demo` | Pass |
| `mit-license` | Pass |
| `node-20-runtime` | Pass |

No listed claim test failed. F-6-1 remains an unlisted claim even though an end-to-end test incidentally exercises the demo case.

## Earlier-finding regression check

Every earlier review and polish report was read. Each prior finding was checked on the live site and in current code.

| Earlier finding | Current verification |
| --- | --- |
| F-1-1 — route focus | Fixed: Home → Demo focuses the demo h1; Back focuses the landing h1. `site/route-focus.ts` and the full browser suite agree. |
| F-1-2 — duplicate demo URL | Fixed: `/demo/` finishes at canonical `/demo`; links, metadata, and sitemap use `/demo`. |
| F-1-3 — 404 social metadata | Fixed: the live HTTP 404 has one h1, a return action, canonical, favicon, seven Open Graph tags, and four Twitter tags. |
| F-1-4 — external-link indication | Fixed: product pages contain no external links. |
| F-1-5 — long README sentences | Fixed: the prior sentences remain split and every current sentence is at most 21 words. |
| F-1-6 — registry availability statement | Fixed: copy promises only the tested hosted tarball, not npm-registry publication. |
| F-2-1 — phone demo lacked sample UI | Fixed: the seed, event/checkpoint summary, and replay action end at 548.33 px. |
| F-2-2 — Phaser claim used only a model | Fixed: the real Phaser scene imported and replayed 20 capsules; 20/20 faults reproduced. |
| F-2-3 — replay sequence was not verified | Fixed: the claim compares the downloaded events with applied events and checks the visible end state. |
| F-2-4 — real-mode persistence unlisted | Fixed: `no-browser-persistence` preserves sentinels and checks all browser storage surfaces. |
| F-2-5 — capture exclusions partly covered | Fixed: `capture-surface` inspects the exported schema and serialized content. |
| F-2-6 — subjective sharing copy | Fixed: the site states the exact 128 KB default. |
| F-2-7 — Node 20 unlisted | Fixed: the pinned clean-consumer claim passed for ESM and CommonJS. |
| F-2-8 — desktop facts below first screen | Fixed: all facts are visible in the 1440 × 900 cold view. |
| F-2-9 — inconsistent route navigation | Fixed: Demo, Privacy, and Terms appear in every checked header and footer. |
| F-2-10 — missing price/offline facts | Fixed: the phone first screen states offline-after-load behavior, MIT price, and privacy. |
| F-2-11 — long Phaser README sentence | Fixed: the description remains split into concise sentences. |
| F-2-12 — unclear recording button | Fixed: the control says **Start recording**. |
| F-2-13 — telemetry terminology | Fixed: the panel says **Capsule details**. |
| F-2-14 — ambiguous player wording | Fixed: the page distinguishes the person, library player, and game adapter. |
| F-2-15 — “fail closed” jargon | Fixed: the README directly describes closed-Shadow-DOM exclusion. |
| F-3-1 — third phone fact below first screen | Fixed: the complete fact list ends at 821.42 px in the 844 px view. |
| F-4-1 — 200% text clipping | Fixed: all five checked routes remain 390 px wide and keep every header link in view at 200% text. |
| F-4-2 — Phaser recording unlisted | Fixed: `phaser-recording` passed against the running scene. |
| F-4-3 — key filter unlisted | Fixed: `key-filter` passed with rejected Enter and retained ArrowRight input. |
| F-4-4 — capped download/import unlisted | Fixed: `capped-export-import` passed against the downloaded bytes. |
| F-4-5 — registry-status wording | Fixed: the current copy names only hosted version 0.1.8. |
| F-5-1 — privacy request scope | Fixed: copy says “No tracking or API calls”; the live allowlist recorded only ten known same-origin static GETs. |

No earlier finding is unfixed, half-fixed, or regressed.

## Structure, accessibility, and build checks

- `/`, `/demo`, `/privacy/`, and `/terms/` returned 200. An unknown route returned the designed HTTP 404. All live anchors resolve to those working destinations.
- Titles are route-specific: `Replay Capsule — replay browser-game bugs`, `Demo — Replay Capsule`, `Privacy — Replay Capsule`, `Terms — Replay Capsule`, and `Page not found — Replay Capsule`.
- Every checked route has `lang="en"`, one h1, one main landmark, a description, canonical, favicon, Apple icon, Open Graph data, Twitter data, and the same header/footer navigation.
- `robots.txt` and `sitemap.xml` are present. The sitemap lists all public product routes.
- Security headers include a self-only CSP, `frame-ancestors 'none'`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and `X-Frame-Options: DENY`.
- Axe found zero violations on landing, demo, privacy, terms, and 404. The factory URL smoke check reported no console errors, one h1, one main, and no missing image alternatives or button names.
- The mid-century instrument-panel palette, self-hosted type, physical controls, recorder illustration, and restrained motion match `.factory/design.md`. The result is not a generic SaaS template.
- The normal landing/demo JavaScript is about 8.6 KB gzip. The 333 KB gzip Phaser bundle is isolated to its explicit fixture route.
- Clean-clone `npm run check` passed: 32/32 Vitest tests, build output in `dist/`, and 53 Playwright passes with five intentional project skips. `npm run lint` and `npm pack --dry-run` also passed.

## Missed leverage

No additional feature is required by the brief. Import, export, local replay, offline-after-load behavior, and a real Phaser fixture are present. AI assistance or sync would add data movement and nondeterminism without improving the core replay job.

## What would make this perfect

Resolve F-6-1 by narrowing and listing the pointer-order guarantee with a dedicated tagged test, or remove the sentence. Then rerun all 25 existing claim commands plus the new claim command and repeat the live request, storage, route, and copy checks. Nothing else was found.
