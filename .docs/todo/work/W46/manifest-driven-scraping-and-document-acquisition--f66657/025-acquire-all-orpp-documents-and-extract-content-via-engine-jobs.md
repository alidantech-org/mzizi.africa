---
{id: TSK-697DB64ED705,name: Acquire all ORPP documents and extract content via engine jobs,type: task,status: in-progress,priority: medium,created_at: 2026-11-17T06:49:21.647Z,updated_at: 2026-11-17T06:49:27.311Z,order: 25600,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-17T06:49:27.311Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-697DB64ED705/1794898167313-start,started_at: 2026-11-17T06:49:27.566Z}]}}}
---

# Acquire all ORPP documents and extract their content through engine jobs

## Goal

Run the Mzizi engine against https://orpp.or.ke/ so every PDF the site publishes is discovered through pagination, downloaded and extracted into real text. The earlier .dev crawl found 76 document links but downloaded only 7 and extracted no real content.

## Context

The site is WordPress with paginated document listings (document-category pages) and a slider-heavy theme. The earlier run left documents as not_downloaded. Every defect found must be fixed in the engine or packages (crawler, browser, fetch, extraction), driven by manifests and job specs. Nothing about orpp.or.ke may be hard-coded in package code.

## Acceptance checklist

- [ ] Run a job spec through the engine that crawls orpp.or.ke with pagination, hunting and downloading.
- [ ] Every PDF linked from the site (listing pages and detail pages) is downloaded with its source page recorded.
- [ ] Extraction produces non-empty text for the PDFs, with OCR used for scanned ones.
- [ ] Engine gaps found are fixed in the packages with tests, not worked around in the job.
- [ ] Results and remaining gaps are reported honestly.
