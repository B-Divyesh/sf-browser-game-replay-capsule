# Replay Capsule demo

- URL: `https://browser-game-replay-capsule.sociobot.in/demo` (or `/?demo=1`).
- The landing page action **Try it with sample data** opens the same sandbox in one click.
- The sample is a deterministic capsule for seed `RC-SAMPLE-FAULT-17`. It contains one normalized pointer input and a `fault-contact` checkpoint. The page shows its seed, event count, bytes, and replay controls immediately.
- Demo state is kept only in the `demo:replay-capsule:memory` namespace. It never writes localStorage, sessionStorage, IndexedDB, cookies, or the real `real:replay-capsule:memory` namespace.
- **Reset demo** replaces the in-memory sample with a fresh copy. **Start for real** navigates to `/` and discards the demo state.
- The sample, recorder, import, and replay use the shipped library in the browser. No account, network API, or real player data is involved.
