---
{id: TSK-008B08FAD3E5,name: Reduce and measure acquisition processing costs,type: task,status: archived,priority: medium,created_at: 2026-11-15T18:49:49.585Z,updated_at: 2026-11-15T18:56:11.644Z,order: 22528,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-15T18:50:09.306Z},{from: in-progress,to: completed,at: 2026-11-15T18:56:11.263Z},{from: completed,to: archived,at: 2026-11-15T18:56:11.644Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-008B08FAD3E5/1794768609307-start,started_at: 2026-11-15T18:50:09.538Z,end_ref: refs/tracking/TSK-008B08FAD3E5/1794768971265-end,ended_at: 2026-11-15T18:56:11.263Z,summary: {files: 53,insertions: 618,deletions: 330}}]}}}
---

## Goal

Reduce avoidable processing costs in the acquisition engine and measure the effects using local representative inputs. The target is steady extraction on ordinary desktop hardware while retaining the current outputs and provenance.

## Context

The previous validation worked through several public listings and a large register, but passing coverage checks alone does not establish efficiency. Structured PDF conversion currently creates a bitmap on pages with no figure to crop. PDF parsing also retains each page's layout cache until closing the document. Web crawl discovery analyzes the same HTML separately for metadata, navigation and references despite those operations being read-only. Reuse compatible parser output and keep original HTML and Markdown workflows intact. Use saved captures to avoid live website changes affecting the measurements. Report CPU time or elapsed time and process memory only where measured, together with any important limits of the sample.

## Acceptance

- [x] Eliminate unnecessary PDF figure renders and exercise text, figure and page-render behavior.
- [x] Reuse the HTML tree for crawl discovery and verify equivalent extraction with regression tests.
- [x] Record controlled performance observations, run the acquisition tests and check workspace validation.

## Comments

### 2026-11-15T18:56:10.981Z · PETER IRUNGU

Discovery benchmark median fell from 1.262 s to 0.782 s for 400 passes with equal results. The synthetic native-text PDF preserved its Markdown hash and fell from 0.359 s to 0.130 s in a single before/after pair. Native-only pages skip OCR probing and PDFium page opens, scan caches are released, and OCR table processing reuses the page raster. The broad acquisition run passed 184 tests, final package run passed 83 tests, and both live-source capture replays passed. The large saved IEBC three-page batch took 97.64 s and about 206 MiB peak RSS. Root failures and workload details are recorded in .dev/runs/acquisition-performance/measurements.md.
