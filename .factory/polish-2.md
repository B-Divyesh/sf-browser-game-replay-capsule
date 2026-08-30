# Polish 2 — adversarial review closure

Reviewed base: `f5a17c28fc8354f0ac7db4544edb52828fcb6f45`  
Repair: `3847829c9346243d8b5ba0df2d185db7c10ee936`

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | `/demo` is now a compact application view. It places the seeded ID, event/checkpoint summary, and **Replay sample** above the canvas. `?demo=1` canonically opens this same view. | `shows seeded product controls in the first mobile demo viewport`; [mobile screenshot](verification-artifacts/polish-2-local/demo-mobile.png); `/demo` and `/?demo=1` browser checks. |
| F-2-2 | Added a real browser Phaser fixture. The claim creates a Phaser canvas, imports 20 capsules through `SeededFailureScene.replayImportedCapsule`, and asserts 20/20 reproduced failures. | `@claim:seeded-failure-fixture runs 20 imported capsules through the shipped Phaser scene`. |
| F-2-3 | Replay records applied events and outcome in observable state. The claim parses the downloaded capsule and compares every replayed event exactly. | `@claim:record-export-replay records, exports, imports, and replays the exact input sequence`. |
| F-2-4 | Added the `no-browser-persistence` inventory claim. The regression retains local/session/cookie sentinels while recording, reset, download, import, replay, and reload complete. | `@claim:no-browser-persistence keeps a real run in memory and leaves existing browser data untouched`. |
| F-2-5 | Added `capture-surface`; UI copy names the tested surfaces. The exported capsule has only documented fields and excludes DOM, cookie/identity, and request values. | `@claim:capture-surface keeps page, identity, cookie, and network values out of exported capsules`. |
| F-2-6 | Replaced subjective sharing copy with “The default cap is 128 KB.” | `@claim:default-byte-cap`; copy audit. |
| F-2-7 | Added a pinned Node 20 clean-consumer claim for both CommonJS and ESM. | `@claim:node-20-runtime runs both ESM and CommonJS from a clean packed consumer`. |
| F-2-8 | Reduced desktop hero scale and spacing. The entire trust list fits in a 1440×900 first view. | `keeps all first-screen facts visible on desktop`; [desktop screenshot](verification-artifacts/polish-2-local/demo-desktop.png). |
| F-2-9 | Every route now has identical Demo, Privacy, and Terms header/footer navigation; mobile no longer hides arbitrary destinations. | `keeps the same header and legal navigation on every route`. |
| F-2-10 | First-screen facts now explicitly state offline behavior, free MIT price, and privacy. | `@claim:offline-demo`, `@claim:mit-license`, `@claim:no-network-calls`; copy audit. |
| F-2-11 | Split the Phaser README sentence into two direct sentences. | Copy audit. |
| F-2-12 | Renamed **Arm & start** to **Start recording** on landing and demo. | `@claim:opt-in-recording`; copy audit. |
| F-2-13 | Renamed the local counter panel **Capsule details**. | Browser route/accessibility suite; copy audit. |
| F-2-14 | Replaced overloaded “player” and metaphorical README wording with direct terms. | Copy audit. |
| F-2-15 | Replaced “fail closed” wording with an explicit closed-Shadow-DOM behavior. | Copy audit and `@claim:text-entry-excluded`. |

## Verification

- Fresh clone `/tmp/replay-capsule-clean-zJPqAJ`: `npm ci`, every distinct command listed in `.factory/claims.json`, then `npm run check` all passed.
- `npm run check` passed locally and in the fresh clone: typecheck, 31 unit/package tests, build, and 50 Playwright desktop/mobile tests.
- Axe scans are part of the browser suite for landing, demo, legal pages, and 404; all report zero violations. Browser checks also verify title, `lang`, one h1, main landmark, image alt text, focus, routing, 404, and console errors.
- Local cold evidence: [desktop demo](verification-artifacts/polish-2-local/demo-desktop.png) and [390×844 demo](verification-artifacts/polish-2-local/demo-mobile.png). Both show `RC-SAMPLE-FAULT-17`; phone view includes the sample replay action.
- Published URL to recheck after static deployment: `https://browser-game-replay-capsule.sociobot.in/demo`.
