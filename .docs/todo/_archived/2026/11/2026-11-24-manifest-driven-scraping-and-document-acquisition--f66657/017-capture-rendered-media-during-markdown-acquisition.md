---
{id: TSK-509C17C0E211,name: Capture rendered media during Markdown acquisition,type: task,status: archived,priority: medium,created_at: 2026-11-15T12:05:26.474Z,updated_at: 2026-11-15T12:11:58.942Z,order: 17408,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-15T12:05:38.539Z},{from: in-progress,to: completed,at: 2026-11-15T12:11:58.045Z},{from: completed,to: archived,at: 2026-11-15T12:11:58.942Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-509C17C0E211/1794744338541-start,started_at: 2026-11-15T12:05:39.071Z,end_ref: refs/tracking/TSK-509C17C0E211/1794744718047-end,ended_at: 2026-11-15T12:11:58.045Z,summary: {files: 11,insertions: 361,deletions: 23}}]}},archived_at: 2026-11-24T19:25:25.495Z}
---

# Capture rendered media during Markdown acquisition

## Goal

Record image and media references that become visible after a browser applies style rules or selects a responsive source. Associate each reference with evidence from its DOM element so reviewers and later acquisition stages can identify the listing or document in which the asset appears.

## Context

The Markdown-first acquisition roadmap in the crawl and purpose detection design calls for a rendered media inventory. HTTP and inline CSS extraction already expose links written directly in the document, but class-based backgrounds and the browser's responsive image selection need an observed browser state. Make this capability opt-in through single-page Markdown acquisition and use the shared Chromium adapter code. Keep the saved page snapshot available as evidence, keep the existing inline option usable, and record media URLs and element context before any separate decision to retain asset bodies.

## Acceptance checklist

- [x] Capture computed background URLs, responsive alternatives and selected images on a real browser page and retain element context in a typed JSON inventory.
- [x] Reference the rendered media in Markdown, preserve the HTML snapshot, and verify that the Markdown path does not archive media attachments.
- [x] Verify class-based CSS and responsive selection with a controlled browser test and run the generic command against the Nairobi Assembly members page.
- [x] Document the opt-in workflow and its coverage limits and run repository checks.

## Comments

### 2026-11-15T12:11:57.372Z · PETER IRUNGU

Chrome verified external stylesheet-relative backgrounds, a JavaScript-added class, a pseudo-element, and responsive picture selection in the loopback fixture. The live Nairobi run at .dev/runs/2026-11-15/120951-web-markdown matched all 12 computed portrait URLs to their source card names and member profile links. Its three evidence artifacts and two CLI metadata files total 85,055 bytes. The focused browser, crawler, scraper and extraction suite passed 81 tests. The runtime guide records the single-document scope and explains the temporary browser profile.
