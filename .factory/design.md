# Replay Capsule — visual system

## Direction: mid-century instrument panel

Replay Capsule should feel like a trustworthy flight recorder a solo game developer can understand at a glance: a warm enamel faceplate, inked labels, physical switches, a single oscilloscope-like game display, and an amber status lamp. It borrows the legibility and restraint of 1950s laboratory equipment, not skeuomorphic chrome or a generic developer-tool dashboard. Decoration always carries meaning: tick marks suggest bounded time, screws establish a contained artifact, and the illustrated capsule explains capture → export → replay.

The treatment is intentionally light-only. A cream workbench is part of the physical-panel thesis; a dark mode would turn the product into a different, modern terminal metaphor. Every surface is explicitly painted.

## Tokens

- `--bench: #e7dfca` — warm workbench background.
- `--panel: #f7f0da` — enamel panel surface.
- `--panel-deep: #d9c9a5` — recessed wells and separators.
- `--ink: #1e2b2a` — near-black green ink, 12.9:1 on panel.
- `--muted: #5c625a` — secondary copy, 5.6:1 on panel.
- `--petrol: #164c4a` — primary action and instrument bezel.
- `--petrol-contrast: #fff9e9` — action label, 9.1:1 on petrol.
- `--amber: #a44721` — active/recording accent and focus cue; 4.8:1 on panel.
- `--success: #2f684e`, `--warning: #8a531e`, `--danger: #9c382f` — always paired with a word or icon.

Typography uses self-hosted **Atkinson Hyperlegible** for readable prose and controls, paired with self-hosted **Space Mono** for telemetry, code, labels, and tabular numbers. The display scale is 56/44, 36, 25, 20, 16, and 13px; body copy never falls below 16px. Code and copy measures stay under 72 characters.

Spacing follows an 8px base rhythm with 4px micro-adjustments: 4, 8, 12, 16, 24, 32, 48, 64, 96. Controls are at least 44px tall and separated by at least 8px. The desktop hero is an asymmetric two-column instrument bay; at 760px it stacks, drops minor dial decoration, and puts the recording controls before the canvas.

## Interaction grammar and motion

- Primary controls depress 2px like sprung keys and immediately change their verb/status.
- Recording is shown by a static amber lamp plus the explicit word “Recording”; no surveillance-style pulsing.
- Replay progress travels across the timeline in 180ms transform transitions. Panels enter once with a 240ms opacity/translate reveal.
- With `prefers-reduced-motion: reduce`, transforms and smooth scrolling are removed, progress updates instantly, and the game loop remains functional without ornamental motion.
- Focus is a 3px amber outer ring with a cream buffer. Hover never communicates anything that focus does not.

## Original asset plan and provenance

The hero includes one generated raster illustration used as an explanatory instrument-panel cutaway, not wallpaper. It depicts an input pulse entering a compact black-box capsule and returning as an identical pulse, with room for live HTML status labels beside it. No text is baked into the image.

- Files: `site/assets/replay-instrument.webp` (1200px archive) and `site/assets/replay-instrument-600.webp` (600px delivery asset)
- Generation tool: `/opt/fleet/lib/gen-image.sh` using the factory `factory-image` deployment.
- License/provenance: original AI-generated project asset, created for Replay Capsule on 2026-08-28; no source artwork or trademarks used.
- Final prompt: “Use case: stylized-concept. Asset type: explanatory landing-page hero illustration. A compact 1950s laboratory flight recorder for a tiny 2D browser game: cream enamel faceplate, deep petrol-green bezel, one amber lamp, two circular input sockets, a paper timeline entering the machine and the exact same sequence leaving it. Flat screen-print gouache illustration with subtle paper grain, precise geometric shapes, restrained mid-century industrial design. Three-quarter tabletop view, instrument centered with generous cream negative space, no people. Palette limited to cream, dark green-black, petrol, burnt orange and muted brass. No words, letters, numbers, logos, gradients, photorealism, neon, generic laptop UI, watermark.”

CSS-drawn screws, ticks, lamps, and waveform marks complete the system. They are original, deterministic interface decoration and require no external asset license.
