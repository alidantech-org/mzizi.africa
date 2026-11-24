---
{id: TSK-1636D651CCD1,name: Repair empty Markdown from malformed HTML bodies,type: task,status: archived,priority: medium,created_at: 2026-11-15T14:27:25.658Z,updated_at: 2026-11-15T14:34:20.876Z,order: 19456,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-15T14:27:43.652Z},{from: in-progress,to: completed,at: 2026-11-15T14:34:19.215Z},{from: completed,to: archived,at: 2026-11-15T14:34:20.876Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-1636D651CCD1/1794752863662-start,started_at: 2026-11-15T14:27:44.534Z,end_ref: refs/tracking/TSK-1636D651CCD1/1794753259219-end,ended_at: 2026-11-15T14:34:19.216Z,summary: {files: 7,insertions: 90,deletions: 6}}]}},archived_at: 2026-11-24T19:25:25.495Z}
---

# Repair empty Markdown from malformed HTML bodies

## Goal

Restore page content in the saved IEBC Markdown files and ensure future conversions of the same HTML work through Mzizi's ordinary entry points.

## Context

The saved pages contain an empty body followed by a populated second body. The HTML parser preserves both, while extraction and change detection select only the first body. Every inspected page therefore produced an empty document and an empty text fingerprint. Existing site repair also considers the matching HTML hash sufficient evidence that a Markdown file is current, so it keeps those empty outputs. Fix the general malformed-document handling without adding a publisher rule. Preserve raw capture bytes and retrieval metadata while replacing the broken derivatives and recording corrected fingerprint evidence. Rebuild the saved IEBC page derivatives and the audit crawl Markdown from their local captures, then verify link and row retention against those same sources.

## Acceptance checklist

- [x] Extract all sibling body content and compute meaningful fingerprints for malformed HTML.
- [x] Ensure automatic Markdown repair recognizes empty derivatives even when their HTML hashes match.
- [x] Rebuild and verify saved IEBC pages and audit crawl Markdown using the existing engine and extraction components.
- [x] Add a regression for malformed bodies, run relevant checks and record the verified outcome.

## Comments

### 2026-11-15T14:32:17.517Z · PETER IRUNGU

Root cause verified on the saved IEBC HTML: an empty body precedes a second body containing the page. Extraction and source fingerprints now include sibling bodies and omit head metadata, comments and doctype text. Automatic site repair retries an empty Markdown derivative even when the raw HTML hash matches. Rebuilt all 46 website Markdown pages plus 41 crawl derivatives, preserved source hashes and retrieval metadata, refreshed the existing 46 engine page/generated-file records, and checked 1,875 PDF URL occurrences with no losses. Party List retains 41 PDF targets and Party List 2022 retains 79. The local repair manifest is .dev/runs/iebc-markdown-repair/report.json.

### 2026-11-15T14:34:17.631Z · PETER IRUNGU

Final focused verification passed 65 tests. Rebuilt 46 website derivatives and 41 historical crawl derivatives, verified nonempty extracted content and all 1,875 PDF URL occurrences, and synchronized the existing engine metadata for 46 pages. Short FAQ output reflects a saved Not Found response. The media/news capture contains a JavaScript redirect to ../news. The repair report identifies each local artifact and its retained PDF count. Root check is running and has already reported pre-existing structure, formatting, lint and mypy failures.

### 2026-11-15T14:36:00.531Z · PETER IRUNGU

Root suite finished with the existing structure, format/lint and mypy failures, 14 filesystem Python test failures and one API test-suite failure. The relevant 65 tests passed. All rebuilt local derivatives remain verified.
