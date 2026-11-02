---
{id: TSK-D16F9399E4B6,name: "Claims, corroboration and conflicts across sources",type: task,status: planned,priority: medium,created_at: 2026-11-02T20:24:23.315Z,updated_at: 2026-11-02T21:36:48.412Z,order: 5120,depends_on: [TSK-BF88B31E115A]}
---

# Claims, corroboration and conflicts across sources

## Goal
Make multi-source reinforcement a first-class mechanism: the same fact seen in many sources is stored as separate claims, ranked by source trust, with corroboration counts and disputes, and the canonical value is derived, never overwritten.

## Context
Decision by the product owner on 2 November 2026: keep all claims, rank by source trust. Each claim records source, retrieval time, method (extracted, inferred, curated, AI-assisted), confidence and validity period. Canonical value is the highest-trust, most recent claim; disagreements are flagged as disputed; the number of independent corroborating sources is recorded. Deduplication uses existing entity matching (DEC-ENTITY-MATCHING): scores and flags, never a name-only merge. This extends the reinforcement framework task with the conflict rule and ties into evidence and provenance.

## Acceptance checklist
- [ ] Design the claim, corroboration and dispute tables and the source trust ranking, with a decision record.
- [ ] Record, per canonical field, which claim currently wins and why.
- [ ] Report corroboration and dispute counts in coverage reports and the gap queue.
- [ ] Add tests with two agreeing and two disagreeing sources.
