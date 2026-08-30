# Replay Capsule review 2 handoff — FAIL

## Work completed

Completed an adversarial first-read review of commit `f5a17c28fc8354f0ac7db4544edb52828fcb6f45` and the matching live deployment at https://browser-game-replay-capsule.sociobot.in on 2026-08-30 UTC.

The complete evidence, copy inventory, claim results, prior-finding verification, and fixes required are in `.factory/review-2.md`. No product code was changed.

## Verdict

**FAIL** with 15 findings.

Blocking findings:

- F-2-1: the one-click demo's first 390 × 844 viewport does not show the seeded product UI or a replay control.
- F-2-2: the declared 90% Phaser fixture test exercises only the framework-free model and never runs the Phaser scene.
- F-2-3: the record/export/import/replay test accepts a completion message without verifying the replayed sequence or outcome.

The remaining findings cover unlisted privacy and compatibility claims, subjective copy, missing first-screen facts, desktop first-screen layout, inconsistent route navigation, one 23-word README sentence, and four terminology/button clarity issues.

## Verification performed

A clean clone at `/tmp/replay-review2-clean` was installed with `npm ci`.

- Every one of the 19 exact commands in `.factory/claims.json` exited successfully. The two blocking adequacy gaps above remain even though their commands are green.
- `npm run check` passed: typecheck, 30 Vitest tests, production build, and 37 Playwright tests with one expected skip.
- `dist/` was produced. Main site JS is 18,851 bytes raw and 7,089 bytes gzip.
- `/opt/fleet/lib/verify-url.sh` passed the live root with no console errors.
- Live Playwright Axe scans reported zero violations on `/`, `/demo`, `/privacy/`, `/terms/`, and the designed 404.
- Fresh 390 × 844 and 1440 × 900 contexts verified first-read copy, layout bounds, demo entry/reset/exit, real-data sentinels, request isolation, route metadata, focus restoration, touch targets, and links.
- The live demo made only same-origin static requests. Fresh demo storage, cookies, caches, IndexedDB, and service-worker registrations were empty.
- Live recording, download, import, replay, and malformed-import recovery completed without page or console errors.
- Root HTML, demo HTML, main JS, and the hosted release tarball SHA-256-match the reviewed checkout/build.

## Prior history

All six findings from `.factory/review-1.md` remain fixed in the live site and code. The assertions in `.factory/polish-1.md` and the prior handoff were rechecked. The earlier “Known gaps: None” status is superseded by review 2.

## Next steps

Resolve F-2-1 through F-2-15 in `.factory/review-2.md`, add the specified regressions, and rerun every claim command plus `npm run check` and the live mobile/desktop audit. Do not mark the product PASS until the review has zero findings and no untested claim.
