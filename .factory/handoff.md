# Replay Capsule — build handoff

## Shipped

- `@sociobot/replay-capsule` v0.1.0 as a zero-runtime-dependency TypeScript package with ESM, CommonJS, and `.d.ts` outputs.
- Explicitly started recorder for keyboard, normalized pointer, and changed gamepad input samples. Events from inputs, textareas, selects, and editable content are excluded.
- Developer-provided JSON seed and checkpoints, a 128 KB default cap, a 1 MB hard maximum, fail-closed cap behavior, versioned schema, detailed import errors, and local JSON download.
- Timed player with speed, pause, resume, stop, event/checkpoint callbacks, and progress/state reporting.
- Mid-century instrument-panel documentation site with a working seeded Canvas capture → download/import → replay bench; keyboard and pointer paths; empty, invalid-file, cap, recording, success, and offline states; and responsive 390 px layout.
- Original factory-generated hero art, self-hosted Atkinson Hyperlegible and Space Mono fonts, local favicon, immutable asset cache headers, robots/sitemap, privacy, and terms pages. No analytics, cookies, telemetry, or runtime CDN requests.
- README API/usage/bounds/browser caveats, changelog, and MIT license.

## Build and deploy

Requires Node.js 20+.

```sh
npm ci
npm run build
```

The exact deploy root is `./dist/site`; `index.html` is at that root. The package outputs are `dist/index.js`, `dist/index.cjs`, and `dist/index.d.ts`.

The package is ready for the factory registry flow. Inspect it with:

```sh
npm pack --dry-run
```

The dry run produced a 9,069-byte tarball (42,950 bytes unpacked), 7 files, with no bundled dependencies. It was not published.

## Verification

`npm run check` passed on 2026-08-28. It runs:

- strict TypeScript typecheck;
- 8 Vitest unit tests for opt-in capture, timing, checkpoints, JSON safety, initial and incremental hard-cap enforcement, import/schema errors, signed gamepad axes, player ordering, and stop behavior;
- reproducible package/site production build;
- 10 Playwright tests in desktop Chromium and a 390×844 Chromium mobile viewport, including axe serious/critical checks, console errors, mobile overflow, keyboard capture/download/replay, malformed import recovery, text-field exclusion, and legal routes.

Additional verification:

- `npm audit`: 0 vulnerabilities.
- ESM and CommonJS smoke imports both returned `replay-capsule 1`.
- Factory `verify-url.sh` against the local production preview: HTTP 200, 600 ms load, 0 console/page errors, title present, `lang=en`, exactly one h1, main landmark present, 0 images missing alt, 0 unlabeled buttons.
- Lighthouse 13 mobile/default throttling against the production preview: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.4 s, LCP 1.4 s, TBT 0 ms, CLS 0, Speed Index 1.4 s, interactive 1.4 s.
- Initial JavaScript 17.64 KB raw / 6.66 KB gzip; CSS 15.85 KB raw / 4.11 KB gzip; delivered hero WebP 13.25 KB. The Latin WOFF2 font files total 68.04 KB.

## Known limits and next steps

- Deterministic results still require the integrating game to seed every relevant random source and avoid nondeterministic external state. Checkpoints make divergence visible but cannot correct it.
- Gamepad timestamps vary by browser; capsules use observation time for replay and retain a browser timestamp only as diagnostic metadata.
- Pointer coordinates normalize when an `Element` is supplied; a generic `EventTarget` records client coordinates because it has no bounds.
- Engine-specific Phaser/Kaplay adapters are intentionally not bundled in v0.1.0; the callback contract works with both and keeps the core dependency-free. Add thin community adapters only after real integration feedback.
- The factory must publish the npm package and deploy `dist/site`; no registry, DNS, billing, or infrastructure changes were made here.
