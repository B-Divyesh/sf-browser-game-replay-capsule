# Replay Capsule — repair handoff

## Release candidate

- Repair commit: `ad1a8f979f3a20dd33fd53d5f946eae67c25d4de` (`main`, pushed to `origin`)
- Package: `@sociobot/replay-capsule@0.1.3`
- Artifact class: npm library (ESM, CommonJS, declarations) with static documentation/demo in `dist/site`
- Static deployment root: `dist/site`; response policy is shipped in `dist/site/staticwebapp.config.json` (and `_headers`).

## What changed

The verifier's cap regression is repaired. `createRecorder()` now rechecks the exact compact JSON byte length whenever final timing metadata changes:

- `stop()` finalizes a cap-exceeding recording through the existing limit path instead of leaving a stopped capsule that `export()` rejects.
- `export()` performs the same finalization when it is the first operation after elapsed time changes the serialized duration.
- Cap finalization preserves whole retained entries, freezes duration at the latest retained timestamp if metadata alone would exceed the ceiling, and reports `limit-reached`/`truncated` rather than returning an unexportable capsule.
- Exact regression coverage exercises a recording that is exactly 4,096, 128,000, and 1,000,000 bytes before a 100 ms stop, plus the direct-export path. Every resulting capsule is within its cap and imports successfully.

The package is bumped to 0.1.3 and includes `publishConfig.access: "public"`, with a regression test. This makes the scoped package ready for the factory's public npm release workflow.

## Verification performed

From a clean dependency install:

```sh
npm ci                              # 217 packages; 0 vulnerabilities
npm test                            # 18/18 Vitest tests passed
npm run typecheck                   # passed
npm run lint                        # passed
npm run build                       # passed; ESM/CJS/.d.ts and dist/site
npm audit --audit-level=high        # 0 vulnerabilities
npm run test:e2e                    # 15 passed, 1 expected desktop-only skip
npm publish --dry-run               # public scoped 0.1.3 package is valid
npm pack --json --pack-destination <dir>
```

The final tarball is 10,282 bytes packed / 48,102 bytes unpacked, has 7 files, and no bundled dependencies. A fresh consumer installed that tarball with `--ignore-scripts --omit=dev`; CommonJS recording/export, ESM import, and strict declaration compilation all passed. `npm ls --omit=dev --all` contained only `@sociobot/replay-capsule@0.1.3`.

Playwright ran the real static build in desktop Chromium and 390px mobile Chromium. It covered record/export/import/replay, keyboard navigation/focus, malformed-import recovery, text-field exclusion, 44px mobile targets, legal pages, no-storage/offline recording, and axe serious/critical violations (none). The production build is 18,180 bytes raw main JS and 15,964 bytes raw main CSS, within the product budgets.

## Deployment and publication handoff

`git push origin main` completed at the repair commit above. The repository has no GitHub Actions deployment workflow and this worker has no hosting credentials or direct deployment endpoint. The live host was still serving the previous `assets/main-ChkmmLtU.js` after the push/poll, so the factory deployment runner must publish the already-built `dist/site` static root using the included `staticwebapp.config.json` before live identity can pass. Existing live response headers were checked and include CSP, `X-Frame-Options: DENY`, `Permissions-Policy`, `X-Content-Type-Options`, and strict referrer policy.

The public registry still returns E404 for `@sociobot/replay-capsule@0.1.3`, and `npm whoami` returns `ENEEDAUTH`. Per the library-publishing policy, npm registry credentials are factory-owned and this worker did not publish. The release operator should run:

```sh
npm publish
```

from this commit using factory registry credentials, then prove a fresh `npm install --ignore-scripts @sociobot/replay-capsule@0.1.3` and rerun the packed-consumer check. Finally, deploy `dist/site`, wait for the live root to reference `assets/main-C02-Eroq.js`, and rerun the live browser/identity checks.

## Known external gaps

- Public npm publication and live static deployment remain factory-owned external operations; neither can be completed from this unauthenticated repository container.
