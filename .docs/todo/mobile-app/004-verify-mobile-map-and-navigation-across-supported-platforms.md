---
{id: TSK-62F7658798F7,name: Verify mobile map and navigation across supported platforms,type: task,status: blocked,priority: medium,created_at: 2026-11-01T00:36:55.074Z,updated_at: 2026-11-01T05:47:47.465Z,tags: [mobile,qa,accessibility],depends_on: [TSK-471C902B718F],extra: {description: "Validate modernized mobile pages and map on Chrome and representative Android hardware, covering interaction, layout, error paths, accessibility, and performance.",acceptance_criteria: ["API success, offline, HTTP error, empty search, and rapid selection paths are exercised.","Small screen, large text, focus, and screen-reader labels are checked.","Frame rate, memory, and map interaction latency are recorded for Android before rollout."],status_history: [{from: planned,to: blocked,at: 2026-11-01T05:47:47.465Z}]},due_at: 2026-11-14}
---

# Verify mobile map and navigation across supported platforms

## Goal

Collect evidence that the geography map and navigation behave correctly on supported software targets and a representative Android device before production rollout. Automated client checks can cover parsing, request contracts, verified-only geometry, empty responses, error responses, and stale query races. Interactive layout and performance measurements require a running app and a real target device; do not mark them complete based on code inspection or mock tests. Record the device, build mode, API state, and observed results so follow-up work is reproducible.

## Context

The repository includes `apps/mobile/test/geography_api_test.dart`, which uses mocked HTTP responses and does not require a live API. Flutter analysis/tests can validate source and client behavior, but this sandbox may not expose an Android device or the writable Flutter SDK cache. `adb devices` must be able to start its local daemon to detect a device. For a manual API-backed run, follow the host-specific commands in `apps/mobile/README.md` and use verified backend data; an empty verified boundary collection is valid and should not be replaced with sample polygons. Reduced motion, text scaling, keyboard focus, and error recovery should be inspected in the app.

## Acceptance checklist

- [x] Exercise API success, no matches, offline state, HTTP errors, and rapid selection on available software targets.
- [ ] Check responsive layout, large text, keyboard focus, and screen-reader labels on running app targets.
- [ ] Record Android device/build, memory, frame rate, and map interaction latency before marking this activity complete.

## Comments

### 2026-11-01T05:47:47.671Z · Ruth Moraa

Automated client verification is complete for API success, no matches, connection failure, HTTP 503, and stale-search responses. Device verification is blocked because adb reports no attached devices in this environment. Responsive/large-text/screen-reader inspection and Android memory, frame-rate, and latency measurements remain unverified.
