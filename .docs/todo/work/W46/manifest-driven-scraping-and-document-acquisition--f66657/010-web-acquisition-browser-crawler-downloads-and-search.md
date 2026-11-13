---
{id: TSK-4D0E185BCE65,name: "Web acquisition, browser, crawler, downloads and search",type: task,status: completed,priority: medium,created_at: 2026-11-13T17:56:34.683Z,updated_at: 2026-11-13T17:56:38.945Z,order: 10240,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-13T17:56:37.821Z},{from: in-progress,to: completed,at: 2026-11-13T17:56:38.945Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-4D0E185BCE65/1794592597824-start,started_at: 2026-11-13T17:56:38.605Z,end_ref: refs/tracking/TSK-4D0E185BCE65/1794592598947-end,ended_at: 2026-11-13T17:56:38.946Z,summary: {files: 0,insertions: 0,deletions: 0}}]}}}
---

# Web acquisition, browser, crawler, downloads and search

## Goal

Give the Mzizi engine a reusable web acquisition capability: identified HTTP access with source and block policies, a real-browser adapter, a resumable crawler that produces separate inventories, safe streaming downloads, official-API search, and an HTML to Markdown converter that keeps link targets and learns repeated headers and footers. All of it is reachable through the existing `mzizi` CLI and engine registry.

## Context

The work follows `AGENTS.md` (research acquisition and browser automation), `.docs/rules/typed-code.md` (typed contracts, one parsing boundary, classification as data, absolute imports, mypy strict) and the plan in `.docs/_plan/mzizi-engine/`. The runtime design is `.docs/design/acquisition/WEB_ACQUISITION_RUNTIME.md`. Robots handling defaults to respect, an override needs a recorded authorisation, and challenge resolution is manual or an approved adapter; no automated CAPTCHA solving or stealth patching is implemented.

## Acceptance checklist

- [x] The HTML to Markdown link-target and whitespace bug is fixed with regression tests.
- [x] `mzizi-fetch` has a web core: URL utilities, source policy, block policy, HTTP client and streaming downloader, with classification data in `source/schema/web/`.
- [x] The engine has a browser adapter interface, a Playwright adapter on installed Chrome, action scripts and challenge detection.
- [x] The crawler produces pages, paths, links, external hosts, images, documents, files, media and errors as CSV, JSON and JSON Lines, and can resume.
- [x] Brave and Google search use their official APIs behind one interface and are tested with mocked responses.
- [x] CLI groups web, download, browser and search call real implementations; status and doctor report availability.
- [x] Package tests, mypy strict, ruff and the structure check pass; documentation is updated.

## Notes

Live search credentials were not available, so the provider integrations are verified only against mocked responses. The 13 filesystem tests that need a database fail before and after this change.
