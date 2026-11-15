---
{id: TSK-EB89DB1A4A88,name: Document the neutral platform and reference-driven localisation proposal,type: task,status: completed,priority: medium,created_at: 2026-11-15T08:57:11.325Z,updated_at: 2026-11-15T08:57:20.341Z,order: 1024,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-15T08:57:19.245Z},{from: in-progress,to: completed,at: 2026-11-15T08:57:20.341Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-EB89DB1A4A88/1794733039247-start,started_at: 2026-11-15T08:57:19.871Z,end_ref: refs/tracking/TSK-EB89DB1A4A88/1794733040343-end,ended_at: 2026-11-15T08:57:20.341Z,summary: {files: 0,insertions: 0,deletions: 0}}]}}}
---

# Document the neutral platform and reference-driven localisation proposal

## Goal

Record, in the planning documents, the owner's direction that the database, API and engine are neutral and that all Kenyan or other place-specific knowledge lives in seed datasets, manifests, mappings and goals. The outcome is one proposal document so the reasoning, including the review loop that verifies mappings, is not lost in chat. It documents the idea only and approves no schema, migration, seed, vector infrastructure or code.

## Context

AGENTS.md already requires publisher- and jurisdiction-specific data to live in manifests, seed inputs or database records. The proposal extends that into a full chain: hard-coded seeds, then a derived vector index and knowledge base, then source goals and versioned data mappings used by the engine, with clients reading the same reference geography. It lives at .docs/_plan/guides/neutral-platform-and-reference-driven-localisation.md and is linked from .docs/_plan/README.md. Proposals under .docs/_plan/ are not proof of implementation or approval. The owner removed invented pattern-binding schemas in DEC-REFERENCE-REMOVE-PATTERN-LEGAL-20261113, so the proposal must not reintroduce them.

## Acceptance checklist

- [x] The proposal exists under .docs/_plan/guides with valid frontmatter and states clearly that it is unapproved planning.
- [x] The plan index links to it with an accurate one-line purpose.
- [x] The document records the layer rule, the seed-to-mapping chain and the per-mapping review loop, with open questions marked unconfirmed.
- [x] task validate passes with no new findings from these files.
