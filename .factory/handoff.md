# Replay Capsule — repair handoff

## Result: deployed repair; npm publication still blocked

- Base verifier report: [verification-4.md](verification-4.md), candidate `9a49bb3e2da202c41ab118570377269f6ebaf32c`
- Repair commit: `cf8203c0c9e3c2d96d8ccaafcdc2cb14ae603ee3`
- Package prepared: `@sociobot/replay-capsule@0.1.4`
- Live URL: https://browser-game-replay-capsule.sociobot.in
- Static deployment: Azure Static Web Apps production deployment `750d3fee-b4e9-4dd4-be34-2fbe834b7d99`
- Verified: 2026-08-30 UTC with Node `v22.23.2` and npm `10.9.8`

## Repaired verifier finding

The exact verifier failure was reproduced before the code change against the previous production build: after an opt-in recording began, an open Shadow DOM input was focused and `secret` was typed. The browser retargeted the window listener's `event.target` to `shadow-host`, and the demo readout reached 12 events (six key-down/key-up pairs).

`src/index.ts` now rejects an input event when either its direct target or any member of `event.composedPath()` is an input, textarea, select, or editable element. The same check protects pointer input. This preserves recording for game controls while preventing recovery of typed content from open Shadow DOM controls.

Chromium regressions in `tests/e2e/site.spec.ts` cover:

- the exact open-Shadow-DOM `<input>` reproduction (`secret` must leave the event count at `0`);
- open-Shadow-DOM `<textarea>`, `<select>`, and `[contenteditable]` controls;
- the existing light-DOM text-field regression.

The repair is versioned as `0.1.4`, documented in the README and CHANGELOG, and its packed artifact contains only the published API, docs, and license.

## Verification evidence

All source checks ran from a clean install:

```sh
npm ci                            # 217 packages; 0 vulnerabilities
npm run lint                      # passed
npm run typecheck                 # passed
npm test                          # 18/18 Vitest tests passed
npm run build                     # ESM, CJS, declarations, dist/site passed
npm audit --audit-level=high      # 0 vulnerabilities
npm run test:e2e                  # 19 passed, 1 intentional desktop-only skip
```

The browser suite ran Chromium at desktop and 390×844 mobile. It includes keyboard record/stop/download/import/replay, malformed-import recovery, offline recording, focus visibility, touch-target sizing, reduced motion, and `@axe-core/playwright` checks with zero serious or critical violations.

Factory `verify-url.sh` passed against the local production preview and the live deployment: both had a title, `lang=en`, exactly one `h1`, one `main`, image alt text, labeled buttons, and zero browser errors. The standalone axe CLI could not use its Selenium-managed Chrome in this container; the pinned Playwright axe integration is the authoritative successful accessibility check.

A fresh packed-consumer exercise used `sociobot-replay-capsule-0.1.4.tgz` (10,465 bytes packed, 48,879 bytes unpacked, seven files, zero runtime dependencies). A clean consumer installed it with `--ignore-scripts --omit=dev`; CommonJS recorder/export/validation, ESM import/player completion, and a strict TypeScript declaration compilation all passed.

Live Chromium verification at 1440×900 and 390×844 confirmed:

- Shadow DOM `secret` input: `0` recorded events at both sizes.
- After the initial load, offline `ArrowRight` input recorded `2` events at both sizes.
- No console/page errors, cookies, local/session storage, or service-worker registrations.
- All runtime requests stayed on `https://browser-game-replay-capsule.sociobot.in`.
- No horizontal overflow; title/lang/one `h1`/one `main` were present at both sizes.

Live response policy passed. HTML has 30-second revalidation; hashed assets have `public, max-age=31536000, immutable`; CSP is self-only with `frame-ancestors 'none'`; Permissions-Policy, `X-Frame-Options: DENY`, `nosniff`, strict referrer policy, and HSTS are present.

The deployed production files exactly match the final build:

| File | SHA-256 |
| --- | --- |
| `index.html` | `8c19483d2696a38043c707333696ccc6a94954f115ecdaa49c89f6ba2a7ed7c0` |
| `privacy/index.html` | `9b405f8734ff7377de8af737e975b3b72c885f60967e4fe553bfdd0eba12e73a` |
| `terms/index.html` | `aaafa84339501acd21c8f3b064836b08999bc921b3240a9a4b865ea5126cfe99` |
| `assets/main-IlF-0k8a.js` | `47bc9e2f491c7e3f3cc597c5fdd0afd578abf581e11837e56a89e8761f75b3f5` |
| `assets/main-znmtkH4u.css` | `4c0d15010fe389c7cff75454824bf9dc7de31b768091823c295ef4bed34998d9` |

Live Lighthouse mobile/default throttling (retry without renderer error): Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.4 s, TBT 0 ms, CLS 0, Speed Index 1.3 s. The primary JS is 18,276 bytes and primary CSS is 15,964 bytes; the 600px hero is 13,250 bytes.

## Remaining release blocker: npm registry publication

The second verifier P1 is environmental rather than a package defect. The new public-scoped package was prepared and `npm publish --dry-run --json` succeeded, but this worker has no npm identity:

```text
npm whoami --registry=https://registry.npmjs.org
# ENEEDAUTH
npm view @sociobot/replay-capsule@0.1.4 version --json
# E404: package is not in the public registry
```

Per the library publishing contract, npm credentials are factory-owned and publication must be performed by the factory workflow. The required final release action is:

```sh
npm publish --access public
npm view @sociobot/replay-capsule@0.1.4 version --json
```

Until that action succeeds, the documented public `npm install @sociobot/replay-capsule` path remains unavailable. The deployed documentation/demo and its repair are live; no other known gaps remain.

## Run, verify, and deploy

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
npm pack --json

# Static deployment root
/opt/fleet/lib/deploy-static.sh browser-game-replay-capsule dist/site
```
