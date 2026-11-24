---
{id: TSK-99A24A6E4776,name: Assess the saved website corpus for database ingestion,type: task,status: archived,priority: medium,created_at: 2026-11-15T06:38:02.403Z,updated_at: 2026-11-15T06:38:51.047Z,order: 14336,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-15T06:38:08.514Z},{from: in-progress,to: completed,at: 2026-11-15T06:38:50.383Z},{from: completed,to: archived,at: 2026-11-15T06:38:51.047Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-99A24A6E4776/1794724688524-start,started_at: 2026-11-15T06:38:09.316Z,end_ref: refs/tracking/TSK-99A24A6E4776/1794724730385-end,ended_at: 2026-11-15T06:38:50.383Z,summary: {files: 0,insertions: 0,deletions: 0}}]}},archived_at: 2026-11-24T19:25:25.495Z}
---

# Assess the saved website corpus for database ingestion

## Goal

Determine how the material already stored under .dev/websites can become attributable candidate records for Mzizi. Give the research team a concrete first batch and an evaluation method before considering a bulk import.

## Context

The website workspace contains crawl inventories, page snapshots, Markdown derivatives and downloaded files. Inventory rows can record discoveries even when a capture was never made, and a single file can be observed at several URLs. The evidence lifecycle requires preserving source bytes, recording extraction lineage and separating candidates from versioned accepted data. Review the active engine, extraction package and database boundary to identify what can be reused and where work is still needed. This assessment uses existing local artifacts and does not change runtime behavior or load data.

## Acceptance checklist

- [x] Count local file types and inventory observations separately and inspect representative saved evidence.
- [x] Verify active file ranking and extraction entry points and identify the gap to reviewed publication.
- [x] Recommend a bounded first batch with evidence locators, deduplication and review quality measures.

## Comments

### 2026-11-15T06:38:49.887Z · PETER IRUNGU

The local tree contained approximately 29 GiB and 47,704 files across 48 host directories with inventories, including 13,920 HTML files, 14,029 Markdown files and 8,363 PDFs. Inventories contained 1,211,434 link observations, 12,801 page inventory rows and 28,258 document sightings marked not_downloaded, despite the presence of downloaded documents. Reconcile the inventories with local file paths, page metadata and download queue records; retain each source sighting while deduplicating bytes by full hash. Two differently named Kasarani PDFs had the same full SHA-256.

The checked-in web.rank handler reads download catalog metadata and emits ranked expectations. The existing PDF capability ran against Kasarani's FY 2023–24 approved project proposal and returned eight text segments with page locators and zero table segments. Page extraction success does not establish structured field accuracy. The checked-in NG-CDF ranking/mapping fixture targets constituency transfers and cannot establish that project-level approved allocations represent transfers. Verify target ownership and amount semantics against the active Dryv contracts before mapping.

Recommend a local, read-only pilot on Kasarani NG-CDF project proposal PDFs, plus a small sample from another constituency held aside for evaluation. Label document purpose, project code, constituency, financial year, status, and amount/currency against PDF page and row evidence. Stage typed proposals with versioned mapping and extraction lineage, leave uncertain items unresolved, and report classification precision/recall, numeric and identifier exact-match rates, and the abstention rate. Re-running the same artifact/configuration should produce no duplicate candidates. Wire reviewed publication through the database owner only after the target mapping and promotion route are verified. This assessment did not import data.
