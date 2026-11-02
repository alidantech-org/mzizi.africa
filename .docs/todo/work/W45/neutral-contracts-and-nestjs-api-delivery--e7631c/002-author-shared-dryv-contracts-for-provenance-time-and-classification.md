---
{id: TSK-067E739172A7,name: "Author shared Dryv contracts for provenance, time and classification",type: task,status: planned,priority: medium,created_at: 2026-11-02T04:56:58.288Z,updated_at: 2026-11-02T04:56:58.288Z,order: 2048}
---

# Author shared Dryv contracts for provenance, time and classification

## Goal

Create the dryv/ folder at the repository root with the shared contracts every domain will reuse, so provenance, time and verification are never optional afterthoughts.

## Context

AGENTS.md sections 4 to 6 require every claim to answer where it came from, when it was obtained, what time and place it describes, how it was produced, how confident we are and which version is current. The audit .docs/docs/audits/COUNTRY_NEUTRAL_GOVERNANCE_MODEL_RESEARCH.md defines layers A to D and the auditability contract. The inventory in .docs/docs/audits/LEGACY_MODEL_INVENTORY.md shows legacy gaps: mixed primary key types, doubled id and code foreign keys, strong provenance only on geo_boundary_versions. Dryv authoring is available through dryv_author in Python and compiles with dryv-py compile. Read .docs/handoffs/neutral-model-and-nestjs-api-handoff.md, .docs/decisions/nestjs-api-and-dryv-placement.md and .docs/docs/audits/LEGACY_MODEL_INVENTORY.md before starting. Keep work on develop, track it through the Task CLI and update the matching .docs files in the same change.

## Acceptance checklist

- [ ] Define provenance (source, artifact reference, retrieval time, method of extracted, inferred, curated or ai_assisted, confidence).
- [ ] Define valid time versus record time, verification state and version chain.
- [ ] Define a single hierarchical business code, a jurisdiction record and jurisdiction-scoped classification records.
- [ ] Define standard failure and pagination contracts.
- [ ] Compile the contracts to Runtime IR without errors and document usage in dryv/README.md.
