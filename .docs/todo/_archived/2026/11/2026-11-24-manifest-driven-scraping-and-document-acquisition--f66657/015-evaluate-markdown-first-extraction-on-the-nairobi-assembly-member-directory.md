---
{id: TSK-B549189EFA91,name: Evaluate Markdown-first extraction on the Nairobi Assembly member directory,type: task,status: archived,priority: medium,created_at: 2026-11-15T09:04:47.025Z,updated_at: 2026-11-15T09:16:37.206Z,order: 15360,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-15T09:04:54.455Z},{from: in-progress,to: completed,at: 2026-11-15T09:16:36.465Z},{from: completed,to: archived,at: 2026-11-15T09:16:37.206Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-B549189EFA91/1794733494457-start,started_at: 2026-11-15T09:04:54.988Z,end_ref: refs/tracking/TSK-B549189EFA91/1794734196475-end,ended_at: 2026-11-15T09:16:36.466Z,summary: {files: 12,insertions: 157,deletions: 11}}]}},archived_at: 2026-11-24T19:25:25.495Z}
---

# Evaluate Markdown-first extraction on the Nairobi Assembly member directory

## Goal

Assess whether Mzizi can convert a real multi-page listing into useful Markdown with complete pagination and references to portraits. Determine what can be deferred until after the HTML pass without changing how the existing download workflow works.

## Context

The public Third Assembly directory is a real test of semantic and weak HTML, because its member names and profile links are present in the document and the pictures may be represented by CSS. A copy of the listing and its pages is already available in the local website workspace. Compare observed outputs against the source page and distinguish semantic HTML tables from a tabular view derived from repeated cards. Source-specific selectors or expectations belong in assessment data, while reusable parsing behavior should work on unrelated HTML. Evaluation runs have bounded page scope and collect references for media and attachments.

## Acceptance checklist

- [x] Measure saved HTML, Markdown and rendering behavior across the listing, including pagination and missing pictures.
- [x] Produce inspectable Markdown variants and verify coverage against the saved source.
- [x] Document the remaining gaps and assess an HTML-first pass that defers attachment downloads.

## Comments

### 2026-11-15T09:16:35.954Z · PETER IRUNGU

The read-only live HTTP crawl completed all 11 listing pages, and saved HTML confirmed all forward and previous links and 125 distinct profile URLs. Baseline Markdown retained the profiles and no portraits. Generic --css-images for web markdown and web crawl now captures 125 portrait references (112 distinct URLs), verified as parsed Markdown; first-page Chromium render returned HTTP 200 and recovered 12 portraits after correcting the command's use of the single-page URL. Produced plain, CSS-aware and manifest-driven roster Markdown plus coverage and native-table assessment under .dev/runs/nairobi-assembly-markdown-assessment. Recovered PDF links missing from icon-only table anchors. Merged headers and a nested table still demonstrate unsafe grids, computed stylesheet-only backgrounds are not covered and the original media inventory excludes CSS references. Existing download behavior was left as configured and the HTTP test did not fetch attachment bodies. Package extraction/scraping checks passed (64 tests), plus three browser/listing integration tests. The root suite continues to report existing formatting, lint, typing, layout and other tests.
