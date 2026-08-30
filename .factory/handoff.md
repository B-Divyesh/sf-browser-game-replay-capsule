# Replay Capsule — independent verification 6 handoff

## Result

**FAIL — do not release candidate `12b602f8497577e87feabc90cce90e699a5b4974`.**

- Live URL: https://browser-game-replay-capsule.sociobot.in
- Verified: 2026-08-30 UTC
- Full report: [verification-6.md](verification-6.md)
- Product code changed by verifier: no

The live site is correctly deployed: all 34 deployable files match the candidate build, and the normal demo, build, accessibility, headers, privacy-network checks, and performance budgets pass. This is not a deployment-only failure.

## Release blockers

1. **P1 privacy/claim failure:** typing `secret` in a focused text input inside a closed Shadow DOM records 12 key events. This contradicts the brief and the unconditional “Text fields and editable elements are never captured” claim. Evidence: [capsule](verification-artifacts/closed-shadow-text-capture.replay.json) and [screenshot](verification-artifacts/live-closed-shadow-text-capture.png).
2. **P1 distribution failure:** `npm view` and clean `npm install @sociobot/replay-capsule@0.1.5` both return E404. The local tarball works, but the documented registry path does not.
3. **P1 claims-contract failure:** `.factory/claims.json` omits material landing/README claims, including the core record/export capability, multi-engine compatibility, 4 KB–1 MB custom range, pointer normalization, package module formats, and gamepad behavior.

Additional P3: the mobile footer Demo link measures 43×44 CSS px instead of the required minimum 44×44.

## Verification summary

```text
npm ci                         pass; 217 packages, 0 vulnerabilities
all 10 claims.json commands    pass individually
npm run typecheck              pass
npm run lint                   pass
npm test                       pass; 24/24
npm run build                  pass
npm run test:e2e               pass; 27 passed, 1 intentional skip
npm audit --audit-level=high   pass; 0 vulnerabilities
npm pack + local consumers     pass; CJS and ESM
public npm install             FAIL; E404
deployment hash comparison     pass; 34 checked, 0 mismatches
axe                            pass; 0 violations on tested routes/viewports
Lighthouse mobile              100/100/100/100; LCP 1.4 s, CLS 0
closed-shadow text exclusion   FAIL; 12 key events captured
```

The cold first-read and sample gate pass. The first screen names the job and intended solo 2D game developer, and **Try it with sample data** opens a seeded sandbox in one click.

## Repair and reverify

1. Make text-entry exclusion hold for closed shadow roots, not only light/open DOM, and extend the exact tagged claim test.
2. List and test every retained product claim.
3. Publish version 0.1.5 with factory-owned npm credentials and verify the documented install command.
4. Repair the 43 px mobile target.
5. Run:

```sh
npm ci
node -e "for (const c of require('./.factory/claims.json')) console.log(c.test)"
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
npm audit --audit-level=high
npm pack --json
```

Then repeat the live privacy boundary, registry install, deployment hash, axe, response-header, and Lighthouse checks from [verification-6.md](verification-6.md).
