---
{id: TSK-A521E270FD2E,name: Build the meaning package and VectorIndex for semantic matching,type: task,status: planned,priority: medium,created_at: 2026-11-13T10:12:18.337Z,updated_at: 2026-11-13T10:12:18.337Z,order: 5120}
---

# Build the meaning package and VectorIndex for semantic matching

## Goal

Add the semantic matcher: embed text and look up the nearest known meanings in a versioned vector index built from reference labels, aliases and review decisions, returning scored candidates with provenance. It serves purpose detection, header classification and name resolution after the rule matcher.

## Context

See `PATTERN_MATCHING.md`. The index sits behind a `VectorIndex` port with an in-memory adapter; pgvector in the operations database or a dedicated vector store is an open decision, as are the embedding model (hosted or local) and licensing. Hard negatives (similar names that are different entities) and per-domain thresholds come from manifests and reviewed decisions. Vectors are never used for identifiers, numbers, dates, amounts or legal wording, and a vector match is always a proposal. Each result records model version and index version; changing the model re-embeds and re-versions the index.

## Acceptance checklist

- [ ] The vector store and embedding model decisions are recorded in `.docs/decisions/`.
- [ ] The `VectorIndex` port, an in-memory adapter and a production adapter exist with contract tests.
- [ ] An index builder creates entries from reference data, aliases and hard negatives, and records model and index versions.
- [ ] Threshold and margin calibration from reviewed pairs is implemented, with a fine-tuning path documented for later.
