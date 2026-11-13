---
{id: TSK-7CE3E49E6696,name: Enable Patchright and rendered page scraping,type: task,status: archived,priority: medium,created_at: 2026-11-13T18:03:37.704Z,updated_at: 2026-11-13T18:15:18.693Z,order: 11264,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-13T18:03:49.794Z},{from: in-progress,to: completed,at: 2026-11-13T18:15:13.687Z},{from: completed,to: archived,at: 2026-11-13T18:15:18.693Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-7CE3E49E6696/1794593029804-start,started_at: 2026-11-13T18:03:50.671Z,end_ref: refs/tracking/TSK-7CE3E49E6696/1794593713720-end,ended_at: 2026-11-13T18:15:13.687Z,summary: {files: 30,insertions: 530,deletions: 119}}]}}}
---

# Enable Patchright and rendered page scraping

## Goal

Let Mzizi researchers select the installed Patchright Chromium driver from the existing browser and web acquisition commands. Enable extraction from a saved HTML page or an approved source page rendered in Chromium using the existing deterministic selector and field extraction code. Public source collection needs a monitored contact identity but no browser or scraper API key.

## Context

The web acquisition runtime already provides a browser session protocol, a Playwright implementation, and a shared source and block policy. Patchright is present in the optional browser dependency group but the CLI and registry have no path to use it. The scraping package parses module recipes and extracts fields from content. Build on those boundaries, keep the current default driver compatible, and document the narrower single-page extraction scope. Google's published automated query policy requires express permission, and the available source context supplies none.

## Acceptance checklist

- [x] Select Patchright from CLI and capability payloads and use its bundled Chromium with an isolated profile.
- [x] Extract fields from saved HTML and rendered source HTML, preserving the captured page and recording the result and access decisions.
- [x] Verify real Chromium rendering against loopback fixtures and verify that robots denials and access challenges stop extraction.
- [x] Document setup, supported commands and validation outcomes in the repository.

## Comments

### 2026-11-13T18:15:11.638Z · PETER IRUNGU

Verified the Patchright CLI against bundled Chromium and a loopback source, including rendered field extraction, offline replay, crawl, snapshot, robots refusal and challenge reporting. Focused regression suite passed 104 tests with one skip, and the final scrape-specific suite passed all three tests. Ruff, mypy and Task validation passed. The root check reported Dryv typecheck and filesystem integration failures outside this change.

### 2026-11-13T18:23:47.918Z · PETER IRUNGU

Live Patchright smoke test against the AlidanTech homepage returned HTTP 200, robots allowed the request, and no block was recorded. Offline replay matched the live title and heading and both SHA-256 hashes.
