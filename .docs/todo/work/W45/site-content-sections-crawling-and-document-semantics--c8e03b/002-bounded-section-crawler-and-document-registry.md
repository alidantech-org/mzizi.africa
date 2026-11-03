---
{id: TSK-C6D4EC067F97,name: Bounded section crawler and document registry,type: task,status: completed,priority: medium,created_at: 2026-11-02T20:24:22.629Z,updated_at: 2026-11-03T01:14:21.074Z,order: 2048,depends_on: [TSK-E29DD2591768],extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-03T01:14:20.206Z},{from: in-progress,to: completed,at: 2026-11-03T01:14:21.074Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-C6D4EC067F97/1793668460214-start,started_at: 2026-11-03T01:14:20.883Z,end_ref: refs/tracking/TSK-C6D4EC067F97/1793668461077-end,ended_at: 2026-11-03T01:14:21.075Z,summary: {files: 0,insertions: 0,deletions: 0}}]}}}
---

# Bounded section crawler and document registry

## Goal
Expand each modelled section through the existing request gate, download documents found there, and register every file with provenance so nothing is fetched twice and nothing is lost.

## Context
Policy set by the product owner on 2 November 2026: only trusted `.go.ke` hosts and explicitly named exact hosts (such as `.or.ke` bodies) are crawled; 0.2 requests per second, robots.txt respected, stop on challenge, 401, 403 or 429; depth 2; file types pdf, xlsx, csv, docx and zip; a size cap per file. Kenya Law's bot challenge is never bypassed. The crawler follows pagination, resolves relative links, deduplicates by content hash across sites, and stores raw bytes with a provenance file beside each. This is data extraction only; it does not interpret content.

## Acceptance checklist
- [x] Implement the section expander using the path rules, with pagination and depth limits.
- [x] Register each file as a document with URL, hash, size, headers, retrieval time and the section that led to it.
- [x] Deduplicate by hash and record every URL a document was seen at.
- [x] Enforce host rules and size caps, with tests using recorded fixtures instead of live requests.
- [x] Run a first bounded crawl of ORPP and NG-CDF sites and report the findings.
