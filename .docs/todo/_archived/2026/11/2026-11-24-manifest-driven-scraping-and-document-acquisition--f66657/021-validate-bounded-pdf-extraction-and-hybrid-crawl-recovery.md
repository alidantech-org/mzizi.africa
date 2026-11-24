---
{id: TSK-EEB5DB0E2F8B,name: Validate bounded PDF extraction and hybrid crawl recovery,type: task,status: archived,priority: medium,created_at: 2026-11-15T18:38:32.971Z,updated_at: 2026-11-15T18:44:52.569Z,order: 21504,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-15T18:38:38.703Z},{from: in-progress,to: completed,at: 2026-11-15T18:44:52.100Z},{from: completed,to: archived,at: 2026-11-15T18:44:52.569Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-EEB5DB0E2F8B/1794767918707-start,started_at: 2026-11-15T18:38:39.707Z,end_ref: refs/tracking/TSK-EEB5DB0E2F8B/1794768292102-end,ended_at: 2026-11-15T18:44:52.100Z,summary: {files: 20,insertions: 237,deletions: 17}}]}},archived_at: 2026-11-24T19:25:25.495Z}
---

## Goal

Make long PDF extraction practical in bounded batches and verify that web content already obtained by the crawler is preserved when optional browser enrichment fails.

## Context

The acquisition validation exercised saved replay cases and live assembly listings. Some large documents cannot be converted in one pass, and whole document limits are useful to keep. Callers need explicit inclusive page ranges. Source page numbers must survive through the published document structure and all generated assets so that reviewers can trace evidence back to the original file. Scope should be reported with the source total even when only a batch is extracted. A second concern is the hybrid crawler: usable HTTP content can be thrown away when browser enrichment encounters a recoverable failure. Record any fallback and leave explicit policy refusals and challenges intact. Preserve the existing default extraction and downloader behavior.

## Acceptance

- [x] Expose and test PDF page ranges with original numbering and correct limit handling.
- [x] Add or verify safe hybrid fallback and coverage reporting.
- [x] Run focused tests and the root checks and record any failures.

## Comments

### 2026-11-15T18:44:45.666Z · PETER IRUNGU

The 177-case acquisition and CLI suite passed. Later focused runs passed 71 cases and all 18 regressions for ranges, source-located table rows, OCR timeout recovery and hybrid fallback. Engine extraction processed requested pages 9000–9002 of the 18324-page IEBC PDF. Nutrition page 2 retained all ten rows and numeric values, with a stray OCR header character and some interleaved two-column prose still present. Root checks have unrelated failures; targeted Ruff and Task validation pass.
