---
id: DOC-MZIZI-NEUTRAL-PLATFORM-REFERENCE-20261115
name: Neutral platform and reference-driven localisation
type: architecture-proposal
tags: [architecture, neutral-engine, seed, manifests, knowledge-base, vector, review-loop, kenya]
extra:
  status: working_proposal
  approval: not_approved
  implementation: not_authorized
  recorded_on: 2026-11-15
---

# Neutral platform and reference-driven localisation

> **STATUS: PLANNING PROPOSAL.** Records an architectural direction stated by the project owner. It is not approval for SQL, migrations, API work, seed data, vector infrastructure or deployment, and nothing here claims the described loop is implemented. Verify against active code before citing any capability as built.

## 1. Purpose

Mzizi needs to cover Kenya first and any other country or region later without rewriting code. This document records the rule that makes that possible: **the database, API and engine are neutral; everything specific to Kenya (or any place, source or subject) is data.** It also records the consequence: neutral machinery can only give data meaning if it is steered by reference data, a knowledge base, goals and mappings, and a review loop keeps that steering honest.

This restates and extends `AGENTS.md`: "keep publisher- and jurisdiction-specific data in manifests, seed inputs or database records rather than generic package code."

## 2. The rule

| Layer | Holds | May contain Kenya-specific content? |
|---|---|---|
| Database store, named operations | Generic entities, relationships with valid time, claims with source and confidence, artifacts | Never in code or table shape; only as rows |
| Product API | Neutral read and write contracts | Never |
| Engine and packages | Fetch, extract, embed, match, propose | Never |
| Seed datasets (`seed/`) | Hard-coded reference data for a place or topic: geography, bodies, code lists, name variants | Yes, as curated data with provenance |
| Source manifests | Which sources exist, their purpose, access method, scope, request ceilings, robots mode | Yes, as data |
| Mappings and goals | How a source's fields map onto neutral concepts; what the engine is trying to learn from a source | Yes, as versioned data |
| Clients | Region selection, filtering and presentation driven by reference data | Configuration only |

Adding a new country means adding seed data, manifests and mappings. If that cannot be done without a code change, the engine is missing a generic capability and the capability, not a country special case, is what gets built.

## 3. How reference data becomes machinery

1. **Hard-code first, as data.** Anything about a place or subject is first written down in seed datasets and manifests, curated by hand with source and scope metadata (see `seed/README.md`). This is the trusted starting point.
2. **Build the vector index from the seeds.** Names, aliases, descriptions and code lists are embedded so the neutral engine can match raw text to known entities (for example a spelling variant of a county to its reference place). The index is derived and rebuildable; the seed data remains authoritative.
3. **Build the knowledge base.** Seeds plus accepted data form the knowledge base the engine consults when interpreting a document: what kinds of bodies exist, how they relate, what a plausible value looks like.
4. **Attach goals to sources.** A source record states its purpose (what the project expects to learn from it). The engine uses the goal to decide which extractions matter.
5. **Store data mappings.** A mapping says how a source's structure (a column, a field, a page pattern) maps to a neutral concept and to which reference entity. Mappings are versioned data, owned by the database, and reused on later runs of the same source.
6. **Let clients use the same data.** A mobile app that detects or lets the user choose a region loads that region's reference geography and filters data and views accordingly, with no region-specific client code.

## 4. The review loop

Neutral processing cannot fully understand data by itself, so a verifier (human or AI; approvals may be either, per `DEC-AUTO-APPROVAL`) stays in the loop. The aim is to keep that loop small, evidence-led and shrinking, not to remove it.

```text
raw artifact -> extraction -> proposed mapping to neutral schema
  -> matched against reference data and vector neighbours -> confidence + reasons
  -> auto-accept above threshold, otherwise review queue
  -> decision recorded -> becomes a versioned mapping -> reused next run
```

Design requirements:

- **Review per mapping, not per record.** Approving that "column 3 of this table is an amount in KES" once should cover every later run of that source. Reviewing thousands of individual rows indicates a design fault.
- **Show the evidence.** Each item shows the raw snippet, the proposed target concept and field, the reference match and its reason, and the confidence.
- **Record why.** Accept, reject and correct decisions store the reason and the verifier, so judgements can be audited and learned from.
- **Pin versions.** Accepted data records which mapping version and reference-data version produced it, so an improved mapping re-runs only what it affects.
- **Model output is a proposal.** Nothing the engine infers becomes canonical without passing this loop or a recorded auto-accept rule.

## 5. Risks and guards

- **Reference quality is the ceiling.** Matching is only as good as the seed data. Curate geography, bodies and code lists first and carefully.
- **Special cases leak into code.** Guard: any country- or source-specific behaviour must be expressible as a manifest, seed or mapping row, or it does not ship.
- **Neutral does not mean schemaless.** The core model stays small and generic; per-type attribute shapes are data, promoted to columns only when a question needs it. Respect the owner's removal of invented pattern-binding schemas (`DEC-REFERENCE-REMOVE-PATTERN-LEGAL-20261113`); do not reintroduce them through this proposal.
- **Vector similarity is a hint.** It proposes candidates; it does not decide identity. Entity resolution rules live in `.docs/design/data/ENTITY_RESOLUTION.md`.

## 6. Open questions

- Where do mappings and source goals live in the Phase 01 schemas, and is a new owning table needed? Unconfirmed; no schema is approved here.
- What confidence threshold permits auto-accept, and per concept or per source?
- Which first source should prove the loop end to end, and how is mapping reuse across a second, different source measured?
- How are reference-data versions recorded so a re-run can be scoped?

## 7. Related documents

- [Data classification and pattern generation](data-categories-and-patterns.md)
- [Connected reference geography and legal foundation](connected-reference-geography-legal-foundation.md)
- [Public accountability map and international comparison](public-accountability-map-and-international-comparison.md)
- `.docs/design/architecture/ENGINE_JOB_MODEL.md`, `.docs/design/architecture/PATTERN_MATCHING.md`, `.docs/design/data/ENTITY_RESOLUTION.md`
