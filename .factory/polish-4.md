# Polish 4 — zero-finding closure

Reviewed base: `88055b1b88d721bef573095ce7ba9d17bf9f0af3`

Repair code: `5dd6b77abca5ddda3ca5edb0df32eed5720d6e03`

Deployment: `https://browser-game-replay-capsule.sociobot.in` (`8f4b60f4-2c5f-4a77-84c3-da8ae781f135`)

Every finding in reviews 1–4 was rechecked. The current round fixes the loaded-font 200% layout, adds exact claim coverage for all retained README capabilities, and removes undefined registry-status wording.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Retained focusable route headings and document-navigation focus restoration. | `moves focus to the destination heading after document navigation`; live audit verifies Demo and Back focus; [landing](verification-artifacts/polish-4-live/live-landing-mobile-390x844.png). |
| F-1-2 | Retained `/demo` as the canonical URL and `/demo/` normalization. | `the trailing demo URL resolves to the canonical demo URL`; live `/demo/` ended at `/demo`; [demo](verification-artifacts/polish-4-live/live-demo-mobile-390x844.png). |
| F-1-3 | Retained full Open Graph/Twitter metadata on the designed 404. | `legal pages are reachable`; live unknown route returned 404, seven Open Graph tags, four Twitter tags, and zero Axe violations; [404 at 200%](verification-artifacts/polish-4-live/live-404-mobile-200-percent.png). |
| F-1-4 | Retained same-site navigation only, leaving no unmarked external link. | `keeps product navigation local and has no unmarked external GitHub links`; live audit reports zero external links on every route; [desktop crawl capture](verification-artifacts/polish-4-live/verify-url/screenshot-desktop.png). |
| F-1-5 | Retained the split README sentences below the 22-word cap. | `.factory/copy-audit.md`; clean `npm run lint` and `npm run check`; [desktop capture](verification-artifacts/polish-4-live/verify-url/screenshot-desktop.png). |
| F-1-6 | Kept registry availability out of the product promise and now states only the hosted 0.1.7 install fact. | `@claim:installable-release`; live HTTPS tarball installed in ESM and CommonJS consumers; [live install log](verification-artifacts/polish-4-live/live-install.log). |
| F-2-1 | Retained the compact demo with seed, event/checkpoint summary, and replay action above the canvas. | `shows seeded product controls in the first mobile demo viewport`; live bottom `548.328 ≤ 844`; [demo phone](verification-artifacts/polish-4-live/live-demo-mobile-390x844.png). |
| F-2-2 | Retained the real Phaser scene replay and exercised 20 imported capsules live. | `@claim:seeded-failure-fixture runs 20 imported capsules through the shipped Phaser scene`; live `20/20`; [Phaser scene](verification-artifacts/polish-4-live/live-phaser-recording.png). |
| F-2-3 | Retained exact downloaded-versus-replayed event comparison and outcome state. | `@claim:record-export-replay records, exports, imports, and replays the exact input sequence`; [clean claim log](verification-artifacts/polish-4-clean/record-export-replay.log); live demo replay completed offline. |
| F-2-4 | Retained the real-mode storage sentinel regression across record, reset, download, import, replay, and reload. | `@claim:no-browser-persistence keeps a real run in memory and leaves existing browser data untouched`; [clean claim log](verification-artifacts/polish-4-clean/no-browser-persistence.log); live demo storage surfaces stayed empty. |
| F-2-5 | Retained exported-field inspection for DOM, identity, cookie, and request values. | `@claim:capture-surface keeps page, identity, cookie, and network values out of exported capsules`; [clean claim log](verification-artifacts/polish-4-clean/capture-surface.log); live requests were same-origin only. |
| F-2-6 | Retained the precise “default cap is 128 KB” copy. | `@claim:default-byte-cap`; [clean claim log](verification-artifacts/polish-4-clean/default-byte-cap.log); [landing](verification-artifacts/polish-4-live/live-landing-mobile-390x844.png). |
| F-2-7 | Retained a pinned Node 20 clean consumer for both module formats. | `@claim:node-20-runtime runs both ESM and CommonJS from a clean packed consumer`; [clean claim log](verification-artifacts/polish-4-clean/node-20-runtime.log); live tarball installed in both formats. |
| F-2-8 | Retained the desktop hero sizing that keeps all facts within 1440×900. | `keeps all first-screen facts visible on desktop`; clean full browser suite; [desktop capture](verification-artifacts/polish-4-live/verify-url/screenshot-desktop.png). |
| F-2-9 | Retained Demo, Privacy, and Terms in every header/footer; added enlarged-text wrapping without hiding destinations. | `keeps the same header and legal navigation on every route`; live audit confirms the same three links on all five routes; [404 at 200%](verification-artifacts/polish-4-live/live-404-mobile-200-percent.png). |
| F-2-10 | Retained explicit offline, MIT-price, and privacy facts in the first screen. | `@claim:offline-demo`, `@claim:mit-license`, `@claim:no-network-calls`; live facts end at `821.422 ≤ 844`; [landing phone](verification-artifacts/polish-4-live/live-landing-mobile-390x844.png). |
| F-2-11 | Retained the concise two-sentence Phaser description. | `.factory/copy-audit.md`; clean lint/check; live README ships inside the byte-matched tarball; [byte match](verification-artifacts/polish-4-live/byte-match.json). |
| F-2-12 | Retained **Start recording** for the capture action. | `@claim:opt-in-recording`; [clean claim log](verification-artifacts/polish-4-clean/opt-in-recording.log); [demo phone](verification-artifacts/polish-4-live/live-demo-mobile-390x844.png). |
| F-2-13 | Retained **Capsule details** for local counters. | `sample demo has no axe violations`; live Axe reports zero violations; [demo phone](verification-artifacts/polish-4-live/live-demo-mobile-390x844.png). |
| F-2-14 | Retained “A person starts recording” and direct scheduling/event responsibilities. | `.factory/copy-audit.md`; `@claim:opt-in-recording` and `@claim:adapter-callbacks`; [landing phone](verification-artifacts/polish-4-live/live-landing-mobile-390x844.png). |
| F-2-15 | Retained direct closed-Shadow-DOM exclusion wording. | `@claim:text-entry-excluded never records text-field keystrokes`; [clean claim log](verification-artifacts/polish-4-clean/text-entry-excluded.log); live package byte-matches the tested build. |
| F-3-1 | Retained the mobile spacing fix and loaded-font first-screen bound. | `keeps all first-screen facts visible at the exact 390 by 844 phone edge`; live bottom `821.422`; [landing phone](verification-artifacts/polish-4-live/live-landing-mobile-390x844.png). |
| F-4-1 | Added mobile header flex wrapping. The regression now awaits loaded fonts, sets 200% text, and checks document width plus every header link on all routes. | `reduced motion and 200% text keep the interface usable`; live root/demo/privacy/terms/404 each measured `390 ≤ 390` with every link inside; [live 200% landing](verification-artifacts/polish-4-live/live-landing-mobile-200-percent.png). |
| F-4-2 | Added `phaser-recording`. Its browser check arms the running scene, clicks the real canvas, exports, and asserts seed plus normalized pointer input. | `@claim:phaser-recording records normalized pointer input from the Phaser canvas`; [clean claim log](verification-artifacts/polish-4-clean/phaser-recording.log); live fixture recorded seed `live-phaser-recording-proof`; [scene](verification-artifacts/polish-4-live/live-phaser-recording.png). |
| F-4-3 | Added `key-filter` and a controlled unit regression that rejects Enter while retaining ArrowRight. | `@claim:key-filter keeps rejected control keys out of the replay stream`; [clean claim log](verification-artifacts/polish-4-clean/key-filter.log); the byte-matched live tarball is the tested package. |
| F-4-4 | Added `capped-export-import` to the manifest and tagged the near-cap download/import regression. | `@claim:capped-export-import keeps a near-cap download within the configured cap and importable`; [clean claim log](verification-artifacts/polish-4-clean/capped-export-import.log); live tarball installs and byte-matches. |
| F-4-5 | Replaced “registry publication is pending” with “Install version 0.1.7 from this hosted npm tarball.” README now states only that `npm run build` prepares the served tarball. | `@claim:installable-release`; [live install log](verification-artifacts/polish-4-live/live-install.log); [desktop page showing the release fact](verification-artifacts/polish-4-live/verify-url/screenshot-desktop.png). |

## Final verification

- A fresh clone ran `npm ci`, every one of the 25 exact commands in `.factory/claims.json`, `npm run check`, `npm run lint`, and `npm pack --dry-run`. All passed. See [full check](verification-artifacts/polish-4-clean/npm-check.log) and the per-claim logs in `verification-artifacts/polish-4-clean/`.
- The clean full gate passed 32 unit/package tests and 52 browser tests, with four intentional cross-project skips. Browser coverage includes Axe, keyboard, focus, metadata, real routing, 404, privacy, offline, and enlarged text.
- Local Lighthouse: 99 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.7 s, CLS 0, TBT 0 ms. Live Lighthouse: 100/100/100/100; LCP 1.4 s, CLS 0, TBT 0 ms.
- The cold live audit found zero Axe violations on `/`, `/demo`, `/privacy/`, `/terms/`, and the real HTTP-404 route. It found no normal-route console errors and only same-origin requests. The expected browser resource message for the deliberate HTTP 404 is recorded separately.
- All 41 checked deployed files, including HTML, hashed JS/CSS/fonts/images, and the hosted release, byte-match `dist/site`: [byte evidence](verification-artifacts/polish-4-live/byte-match.json).

No review finding remains unresolved.
