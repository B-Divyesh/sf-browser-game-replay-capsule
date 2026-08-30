# Independent verification 8 — PASS

**Candidate:** `238bb5e85964b148e59b77adf45204978b34f3bd`
**Live URL:** https://browser-game-replay-capsule.sociobot.in
**Verified:** 2026-08-30 UTC
**Scope:** clean-checkout claims gate, library package, exact production build, live deployment, privacy, accessibility, and performance. Product code was not changed.

## Verdict

**PASS.** The candidate satisfies the researched library job: a game developer can explicitly record normalized input, a seed, and checkpoints; export a capped JSON capsule; import it; and replay it locally. The previous deployment-only concern is not present: the fresh candidate build and public deployment match exactly, and live security/cache headers are present.

**Defects by severity:** none found (P0–P3).

## Mandatory opening gates

`.factory/claims.json` exists and declares 19 claims. After `npm ci` from the specified clean commit, every exact listed command passed. Browser claim commands ran against the local production demo entry point in both configured desktop and 390 px projects.

| Claim | Result |
| --- | --- |
| `sample-demo`, `no-network-calls`, `opt-in-recording`, `text-entry-excluded` | PASS |
| `record-export-replay`, `pointer-normalization`, `offline-demo` | PASS |
| `checkpoint-capture`, `default-byte-cap`, `custom-cap-range`, `validated-import` | PASS |
| `gamepad-sampling`, `adapter-callbacks`, `replay-controls`, `seeded-failure-fixture` | PASS |
| `package-formats`, `installable-release`, `zero-runtime-dependencies`, `mit-license` | PASS |

The formerly failing exact command is now reliable:

```text
npm test -- --testNamePattern @claim:package-formats
1 passed, 28 skipped; claim body 8.29 s; Vitest duration 11.74 s
```

Cold first-read result: the live first screen says it will “Replay browser-game bugs from a small file,” names “solo 2D game developers,” and presents **Try it with sample data** with “Loads a seeded bug run you can replay.” The one-click action opened `/demo/`, where the persistent banner says “Demo — sample data, nothing is saved.” This passes the plain-words and demo-sandbox gates.

## Clean-checkout quality gates

| Command/check | Result |
| --- | --- |
| `npm ci` | PASS — 217 packages; audit reported 0 vulnerabilities |
| `npm test` | PASS — 29/29 tests |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS — ESM, CommonJS, declarations, release tarball, and `dist/site` |
| `npm run test:e2e` | PASS — 32 tests across desktop/mobile projects |
| `npm pack --json --dry-run` | PASS — 7 files, 11,188-byte tarball, no bundled/runtime dependencies |

The production landing payload is within budget: JavaScript 19,573 bytes raw / 7,420 bytes gzip; CSS 16,693 / 4,250 bytes gzip; delivery hero WebP 13,250 bytes. Mobile Lighthouse against the live page measured **98 performance, 100 accessibility, 100 best practices, and 100 SEO** (LCP 1.4 s, CLS 0, TBT 150 ms).

## Independent product and package exercise

- Live `/demo/` began with sample seed `RC-SAMPLE-FAULT-17`, one event, isolated `demo:replay-capsule:memory`, and no local/session storage or cookies.
- Fresh live flow: input before **Arm & start** left the sample event count at 1; starting, pressing ArrowRight and ArrowUp, stopping, and downloading produced a valid version-1 `replay-capsule` JSON file with four events (448 bytes in this run). The file imported and replayed to “Replay complete.”
- A malformed JSON import gave the actionable error “Capsule is not valid JSON. Choose a Replay Capsule JSON file under 1 MB.” The immediately following valid import recovered successfully.
- The claim suite covers the 128 KB default limit, full 4 KB–1 MB custom-cap range, malformed/unsupported/oversize validation, checkpoints, gamepad sampling, callback order, player controls, pointer normalization, closed/open Shadow-DOM text exclusion, and 20/20 seeded Phaser fixture reproduction.
- A fresh temporary consumer installed the served `https://browser-game-replay-capsule.sociobot.in/releases/sociobot-replay-capsule-0.1.6.tgz` with no dependencies. Both `require` and `import` loaded the public API; a consumer recorder/checkpoint/export/validate/player flow completed with player state `finished`.

The public npm registry does not yet contain `@sociobot/replay-capsule@0.1.6` (`npm view` returned E404). This is not a candidate defect: the README documents the working hosted-tarball install command, and the factory contract reserves registry publication for the release owner. Registry publication remains an external release follow-up, not an acceptance blocker.

## Live deployment, privacy, and accessibility

- Fresh `dist/site` output matched all **35/35** browser-served live files byte-for-byte. Host-only `_headers` and `staticwebapp.config.json` were correctly excluded; `/not-a-real-route` returned the designed HTTP 404.
- The normal live landing/demo flow made only same-origin static-file requests: no API, analytics, beacon, third-party runtime, or console/page error. Offline after first `/demo/` load still showed the offline notice and captured ArrowRight (two key events); before going offline, localStorage, sessionStorage, IndexedDB, Cache Storage, service-worker registrations, and cookies were empty.
- Response headers include the self-only CSP with `frame-ancestors 'none'`, HSTS, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, strict referrer policy, and denied camera/microphone/geolocation. HTML uses 30-second revalidation; hashed JS/CSS and the hosted tarball use one-year immutable cache headers.
- Playwright axe scans on `/`, `/demo`, `/privacy/`, `/terms/`, and the live 404 route found zero serious or critical violations. At 390 px there was no horizontal overflow and the sample CTA was 350 × 51 px. Keyboard Tab reached the skip link and the CTA’s visible 3 px amber focus ring; Enter opened the demo. Reduced motion computed to `scroll-behavior: auto` and a 0.01 ms hero animation.

The product is a static library/demo with no server endpoint and no sign-in flow; rate-limit/429 and Entra-tenant checks are not applicable.

## Handoff

No product-code changes were made during this verification. The working tree only adds this verification record and updates `.factory/handoff.md`. The live deployment is confirmed to be this candidate and is ready for the factory release workflow.
