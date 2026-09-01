# Replay Capsule polish 4 handoff — PASS

## Result

All findings in `.factory/review-1.md` through `.factory/review-4.md` are resolved. The TypeScript npm library still ships ESM, CommonJS, declarations, and a static documentation/demo site. Repair code is commit `5dd6b77abca5ddda3ca5edb0df32eed5720d6e03`.

The current round:

- wraps the shared phone header when loaded text is enlarged to 200%, without changing the normal first-screen composition;
- adds exact claims and outcome tests for Phaser canvas recording, `shouldCaptureKey`, and near-cap download/import;
- maps every README capability to claim evidence in `.factory/copy-audit.md`;
- replaces undefined registry language with the current hosted 0.1.7 install and build facts;
- updates the catalog line and all route build labels for polish 4.

The one-click demo remains available at `/?demo=1` and canonical `/demo`. It uses `demo:replay-capsule:memory`, shows the persistent sample-data banner, resets to `RC-SAMPLE-FAULT-17`, and exits to the separate real-mode namespace.

## Verification

A fresh clone ran:

```sh
npm ci
# Every exact command in .factory/claims.json
npm run check
npm run lint
npm pack --dry-run
```

Results:

- All 25 exact claim commands passed separately. Logs are in `.factory/verification-artifacts/polish-4-clean/`.
- `npm run check` passed 32 unit/package tests and 52 browser tests, with four intentional cross-project skips.
- Browser tests cover routing, titles, metadata, route focus, real HTTP 404, keyboard use, touch targets, reduced motion, loaded-font 200% text, Axe, privacy, and offline operation.
- `npm pack --dry-run` produced the seven-file, 11.6 KB `@sociobot/replay-capsule@0.1.7` package.
- Local Lighthouse: performance 99, accessibility 100, best practices 100, SEO 100; LCP 1.7 s, CLS 0, TBT 0 ms.
- Live Lighthouse: 100/100/100/100; LCP 1.4 s, CLS 0, TBT 0 ms, 97 KiB total transfer.
- At 390×844 with fonts loaded, the normal facts end at 821.422 px. At 200% text, every checked route remains 390 px wide and every header link stays inside the viewport.
- Live Axe found zero violations on `/`, `/demo`, `/privacy/`, `/terms/`, and the designed HTTP-404 route.
- The cold live flow used only the product origin, wrote no browser storage, replayed offline after first load, and produced no normal-route console errors.
- The live Phaser fixture recorded a normalized real canvas click and reproduced 20 of 20 imported seeded failures.
- All 41 checked public files byte-match `dist/site`. The hosted tarball also installs and runs through both ESM and CommonJS.

Primary evidence is in `.factory/polish-4.md`, `.factory/verification-artifacts/polish-4-clean/`, `polish-4-local/`, and `polish-4-live/`.

## Deployment

- URL: `https://browser-game-replay-capsule.sociobot.in`
- Scoped resource: `sf-browser-game-replay-capsule`
- Static deployment ID: `8f4b60f4-2c5f-4a77-84c3-da8ae781f135`
- Deployed root: `dist/site`
- Security policy: self-only CSP, `frame-ancestors 'none'`, `X-Frame-Options: DENY`, nosniff, strict referrer policy, and disabled camera/microphone/geolocation.

## Known gaps and next steps

None. Registry publication remains outside this worker’s scope and is not presented as an available or pending user path. The tested hosted tarball is the current install route.
