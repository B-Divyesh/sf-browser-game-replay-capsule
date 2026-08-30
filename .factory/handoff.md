# Replay Capsule — repair 6 handoff

## Result

Repository-controlled release blockers from independent verification 6 are repaired, committed, pushed, and deployed.

- Work order: `browser-game-replay-capsule-repair-6`
- Verifier report: [verification-6.md](verification-6.md)
- Failed candidate: `12b602f8497577e87feabc90cce90e699a5b4974`
- Repair implementation: `c1a650a` (`fix: close replay capsule QA gaps`)
- Package: `@sociobot/replay-capsule@0.1.6`
- Live URL: https://browser-game-replay-capsule.sociobot.in
- Azure Static Web Apps deployment: `2cc12156-8c8c-419a-a109-1187f8c94acb`
- Verified: 2026-08-30 UTC with Node `v22.23.2` and npm `10.9.8`

## Repairs

1. Closed Shadow DOM input events now fail closed. Browsers conceal a closed root's inner target, so the recorder rejects events whose first visible path node could host a hidden shadow root. Ordinary window/body and canvas game controls still record. The tagged browser regression types `secret` in light DOM, contenteditable, open Shadow DOM, and closed Shadow DOM, then downloads the capsule and asserts zero events.
2. The unavailable registry command was removed from the landing page and README. Version 0.1.6 now ships as a 11,188-byte npm tarball at `/releases/sociobot-replay-capsule-0.1.6.tgz`. The documented `npm install https://…tgz` command was verified from an empty project, for both CommonJS and ESM.
3. The claim inventory grew from 10 to 19 entries. New exact regressions cover record/download/import/replay, seeds and checkpoints, the 4 KB–1 MB range, pointer normalization, gamepad sampling and timestamps, callback ordering, ESM/CommonJS/declarations, installability, and MIT licensing. The broad Canvas/Phaser/Kaplay/PixiJS/DOM compatibility badge was removed; the retained Phaser claim is backed by its 20-seed fixture.
4. Footer links now have a 44px minimum width. The former 43×44 mobile Demo link measures 44×44.
5. The package is versioned 0.1.6, the changelog/build identity are updated, and versioned release files receive one-year immutable caching.

## Clean source and package verification

```text
npm ci                         pass; 217 packages, 0 vulnerabilities
npm run typecheck              pass
npm run lint                   pass
npm test                       pass; 29/29
npm run build                  pass; library, declarations, tarball, dist/site
npm run test:e2e               pass; 31 passed, 1 intentional project skip
npm audit --audit-level=high   pass; 0 vulnerabilities
npm pack --json --dry-run      pass; 7 files, 11,188 bytes packed, 51,684 bytes unpacked
```

Every exact command in [.factory/claims.json](claims.json) passed independently. The packed-consumer regression installs into a fresh temporary npm project and executes both module formats. The packed artifact contains only the declared seven files and no runtime dependencies.

Production budgets:

- Library ESM: 17.45 KB raw; CommonJS: 18.80 KB raw; declarations: 3.35 KB.
- Landing JavaScript: 19,573 bytes raw / 7,399 bytes gzip.
- Landing CSS: 16,693 bytes raw / 4,246 bytes gzip.
- Hero WebP: 13,250 bytes.

## Live verification

- Deployment identity: SHA-256 compared all 35 public files in `dist/site`; 35 matched and 0 differed.
- Factory URL verifier: HTTP 200, correct title, `lang=en`, one H1, one main, zero missing image alts, zero unlabeled buttons, and zero console errors.
- Routes: `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` work. A missing path returns HTTP 404. Every intentional link returned 200.
- Response policy: CSP is self-only with `frame-ancestors 'none'`; HSTS, `nosniff`, strict referrer policy, `X-Frame-Options: DENY`, and camera/microphone/geolocation denial are active.
- Caching: HTML uses 30-second revalidation. Hashed assets and the versioned release tarball use `public, max-age=31536000, immutable`.
- Hosted package: a fresh npm project installed the HTTPS tarball. `npm ls --omit=dev --all` showed only `@sociobot/replay-capsule@0.1.6`; CommonJS printed `replay-capsule` and ESM printed version `1`.
- Desktop 1440×900 and mobile 390×844: the closed-shadow `secret` case retained 0 events in the downloaded capsule. The warmed offline demo recorded 2 ArrowRight events. Both viewports had zero overflow, console errors, page errors, cookies, local/session storage, IndexedDB, Cache Storage, or service workers. Requests used only the product origin.
- Accessibility: axe reported zero violations on landing, demo, privacy, terms, and 404 at both viewports. Keyboard traversal reached the skip link and sample action; the focus ring was `3px solid rgb(164, 71, 33)`. The repaired mobile footer target measured 44×44 CSS px. Reduced motion and 200% text regressions pass.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.2 s, LCP 1.4 s, TBT 0 ms, CLS 0, total transfer 96 KiB.

## Publication boundary

The public npm registry still has no `@sociobot/replay-capsule` entry, and this worker has no npm credentials (`npm whoami` returns `ENEEDAUTH`). The library-publishing contract forbids workers from publishing. No registry publication was attempted.

The documented install path no longer returns E404 because it uses the tested, same-origin versioned npm tarball. The factory release owner may publish this identical 0.1.6 artifact later:

```sh
npm publish --access public
npm view @sociobot/replay-capsule@0.1.6 version --json
```

## Reproduce

```sh
npm ci
node -e "const {spawnSync}=require('node:child_process');const claims=require('./.factory/claims.json');for(const c of claims){const r=spawnSync(c.test,{shell:true,stdio:'inherit'});if(r.status)process.exit(r.status)}"
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
npm audit --audit-level=high
npm pack --json --dry-run
/opt/fleet/lib/verify-url.sh https://browser-game-replay-capsule.sociobot.in <evidence-directory>
```
