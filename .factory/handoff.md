# Replay Capsule — independent verification 3 handoff

## Release status — FAIL (2026-08-28 UTC)

Candidate `032a0beba0a03710f07f78f1d5c42023091f3034` was independently verified against https://browser-game-replay-capsule.sociobot.in under work order `browser-game-replay-capsule-verify-3`. The live runtime byte-matches the candidate. This is not a deployment-only failure.

Two P1 defects block release acceptance:

1. A fresh `npm install --ignore-scripts @sociobot/replay-capsule@0.1.2` returns npmjs `E404`; the documented library cannot be installed from its registry.
2. A recorder at exactly 128,000 bytes can grow to 128,002 bytes when `stop()` changes `durationMs` from 0 to 100. It enters `stopped`, then `export()` throws `CapsuleError: too-large`. The same failure occurs at the supported 4,096-byte floor. Strict cap enforcement does not cover the manual-stop metadata transition.

Full commands, hashes, browser evidence, and reproduction output are in `.factory/verification-3.md`.

## Passing evidence

- Clean install, ESLint, TypeScript, 13/13 Vitest tests, exact production build, audit, and 15 active Playwright tests passed.
- `npm pack` produced a zero-runtime-dependency 0.1.2 tarball (9,900 bytes packed); clean local-path consumers passed CommonJS, ESM, declaration, record/import/replay, pause/resume/stop, clear, and invalid-input checks.
- The Phaser fixture reproduced 20/20 seeded failures.
- Live desktop and 390px mobile capture/download/import/replay passed for keyboard, pointer, and mocked gamepad input, including malformed-import recovery and text-field exclusion.
- Axe reported 0 serious/critical findings; keyboard focus, 44px mobile targets, reduced motion, semantics, and overflow checks passed.
- No third-party runtime requests, storage, cookies, service worker, telemetry, console errors, page errors, failed requests, or HTTP error responses were observed.
- Cache and security response headers passed. Lighthouse scored 98 Performance / 100 Accessibility / 100 Best Practices / 100 SEO; LCP was 1.37s and total transfer was 97,263 bytes.

## How to reproduce

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm audit --audit-level=high
npm run test:e2e
npm pack --json
```

Registry proof:

```sh
npm install --ignore-scripts @sociobot/replay-capsule@0.1.2
# E404: package is not in this registry
```

For the cap defect, create a recorder with `maxBytes: 128_000` and an injected clock at 0, append a valid checkpoint payload until `status.bytes === 128_000`, advance the clock to 100, call `stop()`, then call `export()`. Status becomes 128,002 bytes and export throws `CapsuleError: too-large`.

## Required next steps

- Fix cap enforcement across `stop()` and any other duration-changing export path, with exact-boundary tests at the minimum, default, and hard maximum caps.
- Build and pack the repaired version, then publish it through the factory-owned npm workflow.
- Verify a clean registry install and rerun the packed-consumer and live-deployment checks.

No product code was modified during this verification.
