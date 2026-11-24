---
{id: TSK-8A0652B2AD28,name: Validate and export schema-aware draft CSVs through engine HTTP,type: task,status: archived,priority: medium,created_at: 2026-11-17T07:36:52.114Z,updated_at: 2026-11-17T08:25:58.266Z,order: 29696,depends_on: [TSK-583968232F6B],links: [{type: relates,task: TSK-C5499450BD6D}],extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-17T08:14:06.668Z},{from: in-progress,to: completed,at: 2026-11-17T08:25:57.576Z},{from: completed,to: archived,at: 2026-11-17T08:25:58.266Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-8A0652B2AD28/1794903246674-start,started_at: 2026-11-17T08:14:07.603Z,end_ref: refs/tracking/TSK-8A0652B2AD28/1794903957579-end,ended_at: 2026-11-17T08:25:57.577Z,summary: {files: 649,insertions: 6932,deletions: 3246}}]}},archived_at: 2026-11-24T19:25:25.495Z}
---

# Validate and export schema-aware draft CSVs through engine HTTP

## Goal

Let a developer or API client prepare and validate draft CSVs against the selected generated table contract and existing portable reference data, then export the evidence-linked draft for owner review.

## Context

The portal design uses the IEBC office-location PDF as a backend-first example. The existing loader resolves identity paths and writes canonical data only on explicit application. The draft workflow should share the manifest package's validation and operate against a pinned reference snapshot, with a report that distinguishes table shape errors, unresolved or ambiguous links and fields with no representation in the target. Draft export cannot silently register a seed input or start a PostgreSQL write. Before implementation, settle the draft workspace and artifact-reference lifecycle and reuse the catalog and replay work.

## Acceptance checklist

- [x] Provide typed HTTP operations to validate a draft and retrieve its report and evidence.
- [x] Preserve IEBC location details outside any unsupported seed target and report the contract gap.
- [x] Prove repeatable report and draft output from an HTTP client without canonical writes.

## Comments

### 2026-11-17T08:25:56.797Z · PETER IRUNGU

Implemented /v1/research/table-draft over verified PDF and pinned reference CSV artifacts. The standalone HTTP engine ran page 1 of the saved IEBC constituency office PDF using a scratch Mongo ledger and local run storage. Two equivalent requests produced identical reports. Ten source rows were exported, nine exact constituency links resolved, and Lungalunga remained unresolved. The report retains office location, landmark and distance fields and reports the missing required governance.offices mappings. Output is local at .dev/runs/iebc-http-pilot-e00c94f1, with draft.csv, report.json and request.json. No PostgreSQL, seed or portal writes. Focused tests passed (167 with 4 skips in the broader focused suite). The root suite still fails repository-wide format, lint, typing and tests, including missing policy/seed fixtures and the admin catalog mismatch.
