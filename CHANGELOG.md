# Changelog

## 0.1.7 polish 4 — 2026-09-01

- Keep every shared route within a 390 px viewport when text is enlarged to 200% after local fonts load.
- Add claim-gated Phaser canvas recording, key filtering, and capped download/import checks.
- State the current hosted install and build facts without implying an undefined registry status.

## 0.1.7 — 2026-09-01

- Allow Phaser's self-generated `data:` images under the fixture's otherwise self-only image policy, and run the browser fixture under that deployment CSP.
- Scope the demo recorder to the game canvas and its movement keys, so Tab and Enter used to operate controls are never written into a gameplay capsule.
- Bring every header navigation link to the 44 px touch-target baseline.
- Exercise offline recording, import, and replay together and point the seeded-failure claim at its real browser fixture.

## 0.1.6 — 2026-08-30

- Exclude ambiguous keyboard and pointer events retargeted from closed Shadow DOM hosts, preventing hidden text-entry capture.
- Inventory and test the core capture, pointer, gamepad, cap-range, package-format, license, and install claims.
- Ship a directly installable versioned npm tarball while public registry publication remains factory-owned.
- Bring every mobile footer link to the 44px minimum touch target.

## 0.1.5 — 2026-08-30

- Reject imported checkpoint labels that are blank after trimming or longer than 120 characters, matching the recorder API.
- Add a one-click, in-memory sample-data demo at `/demo`, a claim manifest with exact regressions, a real 404 response, and complete route metadata.

## 0.1.4 — 2026-08-30

- Exclude keyboard and pointer events that originate in input, textarea, select, or editable controls anywhere in an event's composed path, including open Shadow DOM controls.
- Add Chromium regressions for the verifier's Shadow DOM input leak and adjacent text-entry controls.

## 0.1.3 — 2026-08-28

- Enforce the strict recorder cap again when stopping or exporting changes duration metadata, preserving a valid, importable capped artifact at the 4 KB, 128 KB, and 1 MB boundaries.
- Mark the scoped package for public npm publication by the factory release workflow.

## 0.1.2 — 2026-08-28

- Account for the exact compact JSON representation that downloads use, so a capped recorder export remains downloadable and importable.
- Mirror keyboard focus from the native import input onto its visible control and bring compact navigation/code controls to 44px touch targets.
- Add a tested Phaser integration fixture with repeated seeded-failure replay trials.

## 0.1.1 — 2026-08-28

- Reject malformed gamepad diagnostic timestamps and non-integer gamepad indexes during capsule validation.
- Ship Azure Static Web Apps response policy configuration for immutable hashed assets, CSP, frame protection, and permissions policy.

## 0.1.0 — 2026-08-28

- Record bounded keyboard, pointer, and gamepad input capsules.
- Add deterministic seeds and game-owned checkpoints.
- Import, validate, download, and replay capsules with timing controls.
- Ship a live Canvas integration demo and complete API documentation.
