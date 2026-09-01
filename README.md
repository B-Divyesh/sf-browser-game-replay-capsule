# Replay Capsule

Replay Capsule is a dependency-free TypeScript library for reproducible browser-game bug reports. It records keyboard, pointer, and gamepad inputs with timing, a deterministic seed, and small checkpoints. It then exports one capped JSON file your game can replay.

It is for solo developers shipping small 2D browser games. It does not record typed text or send data to a service.

## Try the sample demo

Open [the sample demo](https://browser-game-replay-capsule.sociobot.in/demo), or select **Try it with sample data** on the landing page. It loads a seeded fault capsule with one pointer input and checkpoint. The demo is isolated in `demo:replay-capsule:memory`, writes no browser storage, and is discarded when you reset or leave it.

## Install

```sh
npm install https://browser-game-replay-capsule.sociobot.in/releases/sociobot-replay-capsule-0.1.7.tgz
```

This versioned npm tarball is available now.

## Record

Recording is always opt-in: connect `start()` to a clear user action. Text inputs, textareas, selects, and editable elements are never captured.

```ts
import { createRecorder, downloadCapsule } from '@sociobot/replay-capsule'

const recorder = createRecorder({
  seed: 'level-7:attempt-42',
  target: document.querySelector('canvas')!,
  maxBytes: 128_000,
  onStatus: ({ state, bytes }) => console.log(state, bytes),
})

document.querySelector('#record')!.addEventListener('click', () => {
  recorder.start() // explicit opt-in
})

recorder.checkpoint('boss-spawned', { hp: 80, wave: 3 })

document.querySelector('#export')!.addEventListener('click', () => {
  downloadCapsule(recorder.export(), 'boss-bug.replay.json')
})
```

## Import and replay

Replay Capsule schedules stored events. Your game decides what each event does. `onEvent` receives the same normalized event shape stored in the capsule.

```ts
import { createPlayer, importCapsule } from '@sociobot/replay-capsule'

const capsule = await importCapsule(file)
resetGame(capsule.seed)

const player = createPlayer(capsule, {
  onEvent(event) {
    gameInput.apply(event)
  },
  onCheckpoint(checkpoint) {
    assertGameState(checkpoint.data)
  },
})

await player.play()
```

`pause()`, `resume()`, and `stop()` are available for debugger controls. Use `speed` to accelerate playback. See the live documentation and working Canvas demo at [browser-game-replay-capsule.sociobot.in](https://browser-game-replay-capsule.sociobot.in).

## Phaser integration fixture

The repository includes [a small Phaser 3 scene](examples/phaser-seeded-failure.ts). It records from Phaser’s canvas and replays imported files through the scene adapter. Its deterministic game model lives beside it for auditing without bundling Phaser into this package.

The browser fixture imports 20 generated replay files under the deployed content-security policy. It reproduces all 20 seeded fault outcomes. The target is 18 of 20 (90%). Run its exact regression with:

```sh
npm run test:e2e -- --grep @claim:seeded-failure-fixture
```

## API

- `createRecorder(options)` → `start`, `stop`, `clear`, `checkpoint`, `export`, plus live `state` and `status` getters.
- `importCapsule(string | Blob | object, maxBytes?)` → validates and resolves a versioned `ReplayCapsule`.
- `validateCapsule(value)` → synchronously validates trusted in-memory input.
- `createPlayer(capsule, options)` → `play`, `pause`, `resume`, and `stop` with event, checkpoint, state, and progress callbacks.
- `downloadCapsule(capsule, filename?)` → starts a local JSON download.

The package exports ESM, CommonJS, and declarations. The `ReplayEvent`, `ReplayCheckpoint`, `ReplayCapsule`, recorder/player option, state, and status types are public.

## Limits and browser behavior

- Default cap: 128 KB; supported range: 4 KB–1 MB. The recorder stops before an event would cross the cap and reports `limit-reached`. On `stop()` or `export()`, the recorder rechecks the cap after timing changes. It keeps only whole entries that fit. Accounting and the downloaded file use the same compact JSON bytes, so a capped recorder export stays importable.
- Pointer coordinates are normalized to the configured target when possible.
- Key identity uses `KeyboardEvent.code`, not typed characters. Text-entry events are ignored in light, open-shadow, and closed-shadow DOM. If an event may come from a text field in closed Shadow DOM, the library does not record it. Set `shouldCaptureKey` to keep a game surface's control keys out of its replay stream.
- After its first load, the demo can record, import, and replay while the browser is offline. It does not claim that an offline reload works.
- Gamepads are sampled once per animation frame, but browser gamepad timestamps are inconsistent. Replay Capsule timestamps the sample at observation time and stores the browser timestamp only as optional diagnostic metadata.
- Capsule imports are schema-validated and reject malformed, unsupported, or over-limit files.
- No network requests, persistence, telemetry, cookies, or third-party runtime dependencies.

## Development

Requires Node.js 20+.

```sh
npm ci
npm test
npm run build       # library -> dist/, site -> dist/site/
npm run typecheck
npm run lint
npm run test:e2e
npm pack --dry-run  # inspect the publishable package
```

Deploy `dist/site` as the static root. Run every command listed in [.factory/claims.json](.factory/claims.json) when changing a listed product claim. Package registry publication is left to the factory release workflow; `npm run build` also prepares the versioned tarball served by the site.
