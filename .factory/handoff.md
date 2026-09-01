# Replay Capsule review 5 handoff — FAIL

## Result

The reviewer changed no product code. The detailed report is `.factory/review-5.md`.

**FAIL**: F-5-1 is a blocking privacy-claim verification gap. The landing says “No tracking or server calls,” but the associated browser regression only proves that requests share the page origin. It would pass for a same-origin tracking or API request.

## What was verified

- A cold 390 × 844 and desktop visit clearly states the job, audience, and **Try it with sample data** action.
- The one-click `/demo` sample immediately shows seed `RC-SAMPLE-FAULT-17`, one event, `fault-contact`, and **Replay sample**. Its banner, reset, real-mode exit, memory namespace, empty storage surfaces, and loaded-page offline replay work.
- Every listed claims command ran from clean clone `/tmp/replay-review-5-AiB3aj` after `npm ci` and passed.
- `npm run check` passed: typecheck, 32 unit/package tests, build/site verification, and 52 browser tests with four intentional skips. `npm run lint` and `npm pack --dry-run` also passed.
- Live Axe scans on root, demo, privacy, terms, and 404 found zero violations. Titles, metadata, one-h1/main structure, 200% text reflow, routing, focus restoration, footer/header consistency, and designed 404 were checked.

## Required next step

Change the privacy fact to a precise statement, such as “No tracking or API calls,” and strengthen `@claim:no-network-calls` to allow only known static requests while rejecting same-origin API and analytics paths. Then rerun all listed claims, `npm run check`, and the live request-log check.
