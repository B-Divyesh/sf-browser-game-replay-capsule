# Polish 1 — adversarial review closure

Candidate repaired: `56062dd5045abaabf83adc418307e37814814eda`  
Base reviewed: `6040be77b3c7b9af6abedbe663fbb2a2b702b4a3`

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Added `tabindex="-1"` to every route h1 and `site/route-focus.ts`. Same-site navigation and Back now move focus to the destination heading without changing scroll; direct visits preserve the skip-link tab order. | Browser regression `moves focus to the destination heading after document navigation`, included in clean-clone `npm run check` (35 passed, 1 expected skip). |
| F-1-2 | Made `/demo` the canonical internal URL, retained its rewrite to the demo document, and added a `/demo/` → `/demo` redirect policy. The local production-preview adapter mirrors that hosting behavior. | `static deployment response policy` unit assertion; local curl check returned `302 Location: /demo` for `/demo/` and 200 for `/demo`. |
| F-1-3 | Added complete Open Graph and Twitter metadata, including URL, image, and image dimensions, to the designed 404 document. Also completed URL/dimension metadata on legal pages. | `ships the documented metadata, demo route, and a designed 404 document` in clean-clone `npm run check`. |
| F-1-4 | Marked every GitHub destination with a visible `↗` and accessible “external site” name. | `keeps external GitHub links visibly and accessibly marked as external` in clean-clone `npm run check`; screenshots show `Source ↗` and `GitHub ↗`. |
| F-1-5 | Split the two overlong README sentences into short, direct sentences about the Phaser fixture and cap finalization. | README review in this repair; clean-clone `npm run check`; copy remains within the 22-word cap for the repaired sentences. |
| F-1-6 | Removed the ambiguous present-tense public-registry statement. The README now promises only the tested hosted tarball install path. | README review; clean-clone `@claim:installable-release` passed against that tarball. |

## Demo and visual evidence

- Direct sandbox: `/?demo=1` loads `RC-SAMPLE-FAULT-17`, shows **Demo — sample data, nothing is saved**, **Reset demo**, and **Start for real**, and uses `demo:replay-capsule:memory`.
- One-click action: the landing CTA opens canonical `/demo`; its sample starts with seed, event, checkpoint, and replay controls already visible.
- Local production-preview screenshots: `.factory/verification-artifacts/polish-1-demo-desktop.png` and `.factory/verification-artifacts/polish-1-demo-mobile.png`.
- The 390 px screenshot confirms stacked controls, 44 px actions, the demo banner, readable telemetry, and the mid-century instrument-panel system.

## Verification

- Clean clone: `/tmp/replay-capsule-clean-polish-1` at `56062dd`.
- `npm ci`: pass, 0 audited vulnerabilities.
- Every exact command in `.factory/claims.json`: 19/19 passed (`ALL_CLAIMS_PASSED`).
- `npm run check`: pass — typecheck, 30/30 Vitest tests, production build, 35 Playwright tests passed, 1 desktop-only mobile-target skip.
- The Playwright suite includes Axe scans for landing, demo, legal, and 404 routes at desktop and 390 px, with zero violations.

## Deployment check

The repaired commit was pushed to `origin/main` at 2026-08-30 05:28 UTC. The cold live check must be repeated after the factory static deployment serves `56062dd`; the currently returned public HTML still identifies the predecessor (`repair-6`) at the time this record was written.
