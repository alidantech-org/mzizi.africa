---
{id: TSK-2362DF38FDF6,name: Capture tabbed web listings and verify their coverage,type: task,status: archived,priority: medium,created_at: 2026-11-15T11:48:27.302Z,updated_at: 2026-11-15T12:02:00.735Z,order: 16384,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-15T11:48:59.443Z},{from: in-progress,to: completed,at: 2026-11-15T12:01:58.299Z},{from: completed,to: archived,at: 2026-11-15T12:02:00.735Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-2362DF38FDF6/1794743339446-start,started_at: 2026-11-15T11:49:00.289Z,end_ref: refs/tracking/TSK-2362DF38FDF6/1794744118316-end,ended_at: 2026-11-15T12:01:58.299Z,summary: {files: 14,insertions: 940,deletions: 80}}]}}}
---

# Capture tabbed web listings and verify their coverage

## Goal

Add generic support for extracting multiple listing views from one public page, including tabs whose content is present in the first HTML and panels that appear after a browser action. Produce inspectable Markdown and a report that shows which controls were covered and why traversal stopped.

## Context

A listing can keep the same URL while switching panels, append more rows after a button press, or store all rows in hidden HTML. URL discovery alone therefore cannot verify coverage. The first live proof uses the Nairobi County Assembly Bills and Acts pages, with the example URLs confined to the evaluation. Reusable code should recognize standardized HTML and accessibility relationships and widely used tab and disclosure markup. Preserve attachment links as evidence and keep the established downloader available. Use the acquisition guide to retain the broader roadmap for quality checks, rendered media, table fidelity, pagination, and selective downloading.

## Acceptance checklist

- [x] Add a generic HTML-first listing section extraction capability with typed coverage and bounded browser fallback.
- [x] Verify static tabs and JavaScript controls on fixtures, including partial outcomes on failed or capped traversal.
- [x] Run the tool against live Acts and Bills pages, verify all advertised sections and counts against captured HTML, and expose the local artifacts.
- [x] Save the wider extraction roadmap in the acquisition guide and document exactly which behavior is now implemented.

## Comments

### 2026-11-15T12:01:56.479Z · PETER IRUNGU

Implemented web sections with bounded, policy-checked HTTP-first capture, generic ARIA/tab/disclosure discovery, isolated browser verification, scoped Next and Load More, and separate stop reasons. Completed the live Nairobi Acts and Bills runs in both auto and browser mode. Each page exposed 14 year panels. Acts yielded 62 rows and 62 distinct PDF references; Bills yielded 112 rows and 98 PDF references. Independently compared original and rendered table cell contents for every year, verified stored fragment hashes and verified PDF references in Markdown. None of these runs downloaded a PDF. Local browser fixtures prove AJAX panel activation, button-based Next, Load More, partial caps and repeated views. Targeted checks passed; root suite continues to report pre-existing failures. Coverage proof: .dev/runs/nairobi-assembly-sections-proof.json.
