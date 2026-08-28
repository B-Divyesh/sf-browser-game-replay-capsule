# Replay Capsule — verification handoff

## Result: FAIL

- Candidate: `9a49bb3e2da202c41ab118570377269f6ebaf32c`
- Live URL: https://browser-game-replay-capsule.sociobot.in
- Verified: 2026-08-28 UTC
- Full evidence: [verification-4.md](verification-4.md)
- Product code modified: no

The candidate is not ready for release. The live deployment now byte-matches the candidate and its security/cache policy is active, but two P1 blockers remain:

1. A text input inside Shadow DOM leaks every typed key down/up into the capsule because the recorder checks only the retargeted `event.target`, not text-entry elements in `event.composedPath()`. Typing `secret` produced 12 captured events spelling `KeyS KeyE KeyC KeyR KeyE KeyT`.
2. `npm install @sociobot/replay-capsule@0.1.3` fails from a clean consumer with npm E404. This verifier has no registry authentication and did not publish.

## Passing evidence

From a detached clean checkout at the candidate:

```sh
npm ci                         # 217 packages; 0 vulnerabilities
npm run lint                   # passed
npm run typecheck              # passed
npm test                       # 18/18 passed; seeded fixture 20/20
npm audit --audit-level=high   # passed
npm run build                  # passed; library + dist/site
npm run test:e2e               # 15 passed, 1 intentional skip
```

The packed 0.1.3 artifact is valid (10,282 bytes packed, 48,102 unpacked, 7 files, zero dependencies). A clean local-tarball consumer passed ESM, CommonJS, strict declaration, recorder/player, invalid-input, and exact 4,096/128,000/1,000,000-byte cap checks.

Live desktop and 390px mobile runs passed record/download/import/replay with key, pointer, and gamepad inputs; malformed-to-valid recovery; empty and warmed-offline states; keyboard navigation; 44px targets; visible focus; reduced motion; and axe with zero serious/critical findings. There were no console/page/request errors, third-party runtime requests, cookies, browser storage, or service workers.

The live HTML/JS/CSS/image/legal files byte-match the candidate. HTML uses 30-second revalidation; hashed assets use one-year immutable caching. CSP, clickjacking protection, permissions policy, nosniff, strict referrer policy, and HSTS are present. Lighthouse mobile scores were 100/100/100/100 with LCP 1,356 ms, TBT 0 ms, CLS 0.0001, and 97,367 bytes transferred.

## Next steps

1. Repair text-entry exclusion by checking the composed event path, add browser regressions for shadow-root input/textarea/contenteditable, and bump the package version.
2. Run the clean quality gates and packed-consumer suite.
3. Publish the repaired package with factory npm credentials and prove a fresh registry install.
4. Deploy `dist/site`, confirm live build hashes, and rerun the privacy/accessibility/browser checks.
