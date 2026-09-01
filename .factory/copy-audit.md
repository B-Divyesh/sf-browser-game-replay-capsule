# Copy audit

Audited: 2026-09-01 after polish 4. Visible landing, demo-state, README, and legal copy was checked. Code samples, URLs, and generated values are excluded. No sentence exceeds 22 words or uses a banned marketing term.

## Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Replay Capsule | 2 | Pass — product label |
| Demo / Privacy / Terms | 3 | Pass — destinations |
| Local replay files for browser games | 6 | Pass — section label |
| Replay browser-game bugs from a small file. | 7 | Pass — verb-first job |
| For solo 2D game developers who need a bug report that repeats the player’s inputs and timing. | 17 | Pass |
| Try it with sample data | 5 | Pass — result-naming action |
| Loads a seeded bug run you can replay. | 8 | Pass |
| Copy install command | 3 | Pass — result-naming action |
| Record, import, and replay offline after this page loads | 9 | Pass — `offline-demo` |
| Free under the MIT License | 5 | Pass — `mit-license` |
| No tracking or server calls | 5 | Pass — `no-network-calls` |
| Input sequence / Same sequence | 4 | Pass — diagram labels |
| An illustrated cream and petrol recorder passing the same sequence of game-event shapes from one side to the other. | 19 | Pass — image alternative |
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
| Use arrow keys or click to move; avoid striped fault cells and reach the round beacon. | 16 | Pass — canvas instruction |
| Ready to record | 3 | Pass — empty-state heading |
| Start recording to begin a seeded run. | 7 | Pass — empty-state instruction |
| Arrow keys steer; pointer moves probe; avoid fault cells | 9 | Pass — control hint |
| Start recording / Stop recording / Reset run | 6 | Pass — result-naming actions |
| Download capsule / Import capsule / Replay capsule | 6 | Pass — result-naming actions |
| Replay progress | 2 | Pass — control name |
| No input has been captured yet. | 6 | Pass |
| This tab does not save your run. | 7 | Pass — `no-browser-persistence` |
| Capsule details | 2 | Pass — section heading |
| Seed / Events / Elapsed / Payload / Network | 5 | Pass — detail labels |
| Capsule capacity used | 3 | Pass — control name |
| Captured: key codes, pointer positions, changed gamepad samples, your seed, and checkpoints. | 12 | Pass |
| Not captured: typed text, DOM content, identity, cookies, or network traffic. | 11 | Pass — `capture-surface` |
| What the library does | 4 | Pass — section label |
| Keep the bug report small and private. | 7 | Pass |
| Use your game adapter | 4 | Pass |
| Your game adapter receives each stored event through a callback. | 10 | Pass — `adapter-callbacks` |
| Stay inside the byte cap | 5 | Pass |
| The recorder stops before it crosses the configured cap. | 9 | Pass — `default-byte-cap` |
| The default cap is 128 KB. | 6 | Pass — `default-byte-cap` |
| Control replay timing | 3 | Pass |
| Replay at normal speed or faster. | 6 | Pass — `replay-controls` |
| Pause, resume, and stop are available in the public API. | 10 | Pass — `replay-controls` |
| Install the library | 3 | Pass — section label |
| Add replay capture to your game loop. | 7 | Pass |
| Copy code | 2 | Pass — result-naming action |
| Install version 0.1.7 from this hosted npm tarball. | 9 | Pass — `installable-release` |
| Local replay files for browser-game debugging. | 6 | Pass |
| Built by Param Factory · v0.1.7 · polish-4 | 6 | Pass — build label |

## Landing interaction and demo state

| Copy | Words | Result |
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

## README capability coverage

Every README capability is tied to an exact claim regression. Audience descriptions, caveats, and contributor commands are not product claims.

| README capability | Claim evidence |
| --- | --- |
| Dependency-free TypeScript package | `zero-runtime-dependencies`, `package-formats` |
| Records keyboard, pointer, and gamepad input with timing, seed, and checkpoints | `checkpoint-capture`, `pointer-normalization`, `gamepad-sampling` |
| Exports a capped JSON file that can be replayed | `default-byte-cap`, `record-export-replay` |
| Does not record typed text or send data to a service | `text-entry-excluded`, `no-network-calls` |
| Seeded, isolated, resettable sample without browser storage | `sample-demo` |
| Hosted version 0.1.7 tarball installs now | `installable-release` |
| Recording starts only after opt-in | `opt-in-recording` |
| Replay callbacks receive normalized stored events | `adapter-callbacks` |
| Replay can pause, resume, stop, and accelerate | `replay-controls` |
| Phaser scene records from its canvas | `phaser-recording` |
| Phaser scene replays imported files and reproduces 20 of 20 seeded faults | `seeded-failure-fixture` |
| ESM, CommonJS, declarations, and public types ship | `package-formats` |
| Cap range is 4 KB–1 MB and defaults to 128 KB | `custom-cap-range`, `default-byte-cap` |
| Near-cap downloaded JSON stays within its cap and imports unchanged | `capped-export-import` |
| Pointer positions are target-normalized | `pointer-normalization` |
| Key identity uses codes; text-entry keys are excluded | `checkpoint-capture`, `text-entry-excluded` |
| `shouldCaptureKey` excludes rejected control keys | `key-filter` |
| Demo records, imports, and replays after first load while offline | `offline-demo` |
| Changed gamepad samples use observation time and optional browser timestamps | `gamepad-sampling` |
| Imports reject malformed, unsupported, and over-limit files | `validated-import` |
| No persistence, cookies, telemetry, network requests, or runtime dependencies | `no-browser-persistence`, `no-network-calls`, `zero-runtime-dependencies` |
| Node.js 20 runs both package formats | `node-20-runtime` |
| MIT license | `mit-license` |
| `npm run build` prepares the served tarball | Full `npm run build`; `installable-release` installs that artifact |

## Terminology

| Concept | One term used |
| --- | --- |
| Exported replay JSON | capsule |
| Recording operation | recording |
| Deterministic game value | seed |
| Game-state marker | checkpoint |
| Isolated sample experience | demo |
| Local UI counters | capsule details |

The first screen states the job, audience, action, result, offline behavior, price, and privacy in one view. The catalog line is verb-first: “Record and replay browser-game bugs from one small local file.”
