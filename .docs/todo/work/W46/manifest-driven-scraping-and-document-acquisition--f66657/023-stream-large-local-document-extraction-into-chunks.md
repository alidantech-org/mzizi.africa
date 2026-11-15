---
{id: TSK-5AD49F9D056A,name: Stream large local document extraction into chunks,type: task,status: archived,priority: medium,created_at: 2026-11-15T19:07:56.475Z,updated_at: 2026-11-15T19:15:22.971Z,order: 23552,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-15T19:08:36.782Z},{from: in-progress,to: completed,at: 2026-11-15T19:15:21.307Z},{from: completed,to: archived,at: 2026-11-15T19:15:22.971Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-5AD49F9D056A/1794769716784-start,started_at: 2026-11-15T19:08:37.061Z,end_ref: refs/tracking/TSK-5AD49F9D056A/1794770121321-end,ended_at: 2026-11-15T19:15:21.307Z,summary: {files: 36,insertions: 1046,deletions: 198}}]}}}
---

## Goal

Process large local datasets through an explicit Mzizi command that writes useful extraction artifacts incrementally. Reduce peak memory and remove the need to load or transmit the entire input through a JSON request.

## Context

A three-page selection from the saved IEBC register took roughly 98 seconds because the structured PDF reader still enumerated the original page tree. Copy a small set of source pages into an in-memory derived PDF and feed that to the existing Markdown and table extractor. Keep original page locations and save each batch immediately. For CSV, JSON and XLSX, stream rows or array records into JSON Lines files and preserve row or sheet coordinates. Emit a journal of published chunks so that an interrupted attempt leaves an auditable prefix. Preserve original input bytes and the existing extraction commands. Check known data values, row coverage, malformed input and peak memory on reproducible inputs.

## Acceptance

- [x] Ship local PDF page batches and streamed CSV, JSON and XLSX extraction.
- [x] Verify source coordinates, chunk boundaries and visible failures with tests.
- [x] Exercise the normal CLI on real and generated large files and record limits and measurement.

## Comments

### 2026-11-15T19:15:19.563Z · PETER IRUNGU

Implemented local mzizi extract stream. Verified all 1,024 pages in a synthetic full PDF, 2 million CSV/JSON data records, 100,002 XLSX rows and the real IEBC and nutrition PDF sample outputs. Same three IEBC pages now took 2.06 seconds, and gzip reduced synthetic JSON output from 99.7 MB to 8.35 MB with identical decompressed bytes. Extraction and CLI tests passed 79 cases. Measurements and journal locations are under .dev/runs/stream-proof.
