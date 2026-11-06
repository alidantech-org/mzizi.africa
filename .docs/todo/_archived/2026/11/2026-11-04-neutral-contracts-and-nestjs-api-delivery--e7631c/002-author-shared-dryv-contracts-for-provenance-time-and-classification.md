---
{id: TSK-067E739172A7,name: "Author shared Dryv contracts for provenance, time and classification",type: task,status: completed,priority: medium,created_at: 2026-11-02T04:56:58.288Z,updated_at: 2026-11-02T04:59:09.155Z,order: 2048,due_at: 2026-11-02,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T04:58:15.188Z},{from: in-progress,to: completed,at: 2026-11-02T04:59:09.155Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-067E739172A7/1793595495190-start,started_at: 2026-11-02T04:58:15.249Z,end_ref: refs/tracking/TSK-067E739172A7/1793595549157-end,ended_at: 2026-11-02T04:59:09.155Z,summary: {files: 7,insertions: 316,deletions: 0}}]}},archived_at: 2026-11-04T05:47:26.861Z}
---

# Author shared Dryv contracts for provenance, time and classification

## Goal

Create the dryv/ folder at the repository root with the shared contracts every domain will reuse, so provenance, time and verification are never optional afterthoughts.

## Context

AGENTS.md sections 4 to 6 require every claim to answer where it came from, when it was obtained, what time and place it describes, how it was produced, how confident we are and which version is current. The audit .docs/docs/audits/COUNTRY_NEUTRAL_GOVERNANCE_MODEL_RESEARCH.md defines layers A to D and the auditability contract. The inventory in .docs/docs/audits/LEGACY_MODEL_INVENTORY.md shows legacy gaps: mixed primary key types, doubled id and code foreign keys, strong provenance only on geo_boundary_versions. Dryv authoring is available through dryv_author in Python and compiles with dryv-py compile. Read .docs/handoffs/neutral-model-and-nestjs-api-handoff.md, .docs/decisions/nestjs-api-and-dryv-placement.md and .docs/docs/audits/LEGACY_MODEL_INVENTORY.md before starting. Keep work on develop, track it through the Task CLI and update the matching .docs files in the same change.

## Acceptance checklist

- [x] Define provenance (source, artifact reference, retrieval time, method of extracted, inferred, curated or ai_assisted, confidence).
- [x] Define valid time versus record time, verification state and version chain.
- [x] Define a single hierarchical business code, a jurisdiction record and jurisdiction-scoped classification records.
- [x] Define standard failure and pagination contracts.
- [x] Compile the contracts to Runtime IR without errors and document usage in dryv/README.md.

## Progress

`dryv/contracts/shared.py` compiles to Runtime IR (`dryv-py compile`, 32 items). Findings: string `pattern` takes structured constraints, not regular expressions, so business code format is enforced by length and later by service validation; inline numeric and boolean properties must be registered through `properties()`; arbitrary JSON (for example GeoJSON) has no direct property, so the geography task must decide between a record type and a string with `json` format.

## Rework note

The contracts were later rewritten from Python to TypeScript authoring to match the Alidantech backend structure (DEC-DRYV-PACK-SOURCE); the shared contracts now live in `dryv/contracts/foundation/shared` and `foundation/reference`.
