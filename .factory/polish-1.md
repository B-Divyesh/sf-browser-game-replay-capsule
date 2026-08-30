# Polish 1 — adversarial review closure

Reviewed base: `6040be77b3c7b9af6abedbe663fbb2a2b702b4a3`
Final repair: `95861670f446783c9c2e08072492a0744060ea8c`

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Each route h1 has `tabindex="-1"`. `site/route-focus.ts` moves focus after same-site navigation and Back. | Live audit: Home → Demo focuses `#demo-title`; Back focuses `#hero-title`. `moves focus to the destination heading after document navigation` passes. |
| F-1-2 | `/demo` rewrites to a flat canonical `demo.html`. The duplicate SWA rules were removed because the host rejects them. A static `/demo/` redirect document plus the CSP-safe route module normalizes Azure’s trailing-slash response to `/demo`. | Cold live browser check: `/demo/` finishes at `/demo`. `the trailing demo URL resolves to the canonical demo URL` passes. Fleet deployment `8b12bb59-40b4-4b1b-8ac3-371749937f95` succeeded. |
| F-1-3 | The designed 404 includes Open Graph and Twitter card title, description, URL, image, and dimensions. | Live `/not-a-real-route`: HTTP 404, title `Page not found — Replay Capsule`, one h1, zero Axe violations. Metadata regression passes. |
| F-1-4 | Every GitHub link shows `↗` and has an accessible name that says “external site”. | External-link regression passes; live screenshots show marked source links. |
| F-1-5 | The two flagged README sentences were split into direct sentences under the 22-word cap. | `.factory/copy-audit.md` records the repaired README check; final clean-clone `npm run check` passes. |
| F-1-6 | Removed the ambiguous claim that the package is already on the public npm registry. The hosted versioned tarball is the documented, tested install path. | Final clean-clone `@claim:installable-release` passes; README makes no public-registry availability promise. |

## Required product checks

- The first screen states the job, audience, sample action, outcome, and three plain facts.
- `/?demo=1` opens the isolated seeded sample with its persistent banner, reset, and real-mode exit. It uses `demo:replay-capsule:memory` and does not persist browser data.
- `.factory/claims.json` has 19 claims, each mapped to one `@claim:` test. A final clean clone passed all 12 unit/package claim tests and all 14 desktop/mobile browser claim instances.
- `.factory/catalog-description.txt` remains the required verb-first line: “Replay browser-game bugs from a small local file.”

## Final live evidence

- Audit: `.factory/verification-artifacts/polish-1-retry1/live-audit.json`.
- Screenshots: `.factory/verification-artifacts/polish-1-retry1/live-demo-desktop.png` and `.factory/verification-artifacts/polish-1-retry1/live-demo-mobile.png`.
- Basic check: `.factory/verification-artifacts/polish-1-retry1/verify.json` reports title, `lang=en`, one h1, main, image alt coverage, and no console errors.
- Live `/`, `/demo`, `/privacy/`, and `/terms/` return 200; the designed unknown route returns 404. Live Axe scans report zero violations on all five routes.
- The deployed root, `/demo`, `/404.html`, main JS, route-focus JS, and main CSS SHA-256-match `dist/site`.
