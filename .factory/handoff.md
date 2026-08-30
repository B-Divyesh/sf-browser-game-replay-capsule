# Replay Capsule — polish 1 handoff

## Repair

Commit `56062dd5045abaabf83adc418307e37814814eda` repairs every finding in adversarial review 1.

- Route focus now lands on each destination h1 after in-site navigation and browser Back.
- `/demo` is the sole canonical demo URL; `/demo/` redirects to it.
- `?demo=1` remains a direct, isolated sample path with its persistent demo banner, reset, and real-mode exit.
- The 404 and legal documents now have complete route metadata. GitHub links visibly and accessibly identify external navigation.
- README copy meets the plain-words cap and no longer suggests an unverified public-registry release.
- `.factory/catalog-description.txt` now contains the required verb-first catalog sentence.

The product remains the same dependency-free TypeScript npm library with its original mid-century instrument-panel demo identity. No analytics, APIs, browser persistence, or third-party runtime resources were added.

## How to verify

```sh
npm ci
npm run check
```

Run the direct sample at `https://browser-game-replay-capsule.sociobot.in/?demo=1` or canonical demo at `/demo`. Reset uses only the in-memory `demo:replay-capsule:memory` namespace.

## Evidence

- Fresh clone `/tmp/replay-capsule-clean-polish-1`: `npm ci` passed with 0 audited vulnerabilities.
- All 19 exact claim commands from `.factory/claims.json` passed; the runner ended `ALL_CLAIMS_PASSED`.
- Clean-clone `npm run check` passed: 30/30 Vitest tests, build, and 35 Playwright tests passed with one expected desktop-only skip.
- Browser coverage includes focus navigation, canonical demo behavior, direct `?demo=1` isolation, keyboard/mobile/reduced-motion behavior, same-origin requests, offline recording, import/export/replay, and Axe scans with no violations.
- Local production-preview screenshots: `.factory/verification-artifacts/polish-1-demo-desktop.png` and `.factory/verification-artifacts/polish-1-demo-mobile.png`.
- `npm run build` emits `dist/`; main JS is 18.85 KB raw (7.11 KB gzip), and main CSS is 16.69 KB raw (4.25 KB gzip).

## Deployment

Pushed `56062dd` to `origin/main` at 2026-08-30 05:28 UTC. Static deployment is configured from `dist/site` and `site/public/staticwebapp.config.json`.

At the last cold URL check, the public endpoint was still serving the predecessor artifact (`repair-6`; last-modified 04:16 UTC), so the new live URL evidence cannot honestly be claimed yet. The source repair is committed, pushed, and independently buildable; once the factory serves this commit, rerun the cold root/demo/404 checks documented in `.factory/polish-1.md`.

## Known gap

No product gap remains locally. The only outstanding external state is propagation of the factory static deployment to the pushed commit.
