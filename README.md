# Replay Capsule

Replay Capsule is a tiny, dependency-free TypeScript library for reproducible browser-game bug reports. It records keyboard, pointer, and gamepad inputs with their timing, a developer-supplied deterministic seed, and small checkpoints—then exports one strictly capped JSON file your game can replay.

It is for solo developers shipping plain Canvas, Phaser, Kaplay, Pixi, or similarly small 2D browser games. It is not video recording, analytics, session tracking, server playback, or anti-cheat.

## Install

```sh
npm install @sociobot/replay-capsule
```

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

The player owns scheduling; your game owns meaning. `onEvent` receives the same normalized event shape stored in the capsule, so it works without synthetic DOM events or an engine adapter.

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

## Limits and browser behavior

- Default cap: 128 KB; supported range: 4 KB–1 MB. The recorder stops before an event would cross the cap and reports `limit-reached`.
- Pointer coordinates are normalized to the configured target when possible.
- Key identity uses `KeyboardEvent.code`, not typed characters. Events originating in text-entry controls are ignored.
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
npm pack --dry-run  # inspect the publishable package
```

Deploy `dist/site` as the static root. Package publication is intentionally left to the factory.
