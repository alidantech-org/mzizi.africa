---
{id: TSK-4C9B273FEC42,name: "Document how geography, reference and governance connect",type: task,status: planned,priority: medium,created_at: 2026-11-25T15:56:58.691Z,updated_at: 2026-11-25T15:56:58.691Z,order: 1024}
---

# Document how geography, reference and governance connect

## Goal

Produce one document, `.docs/design/data/GEOGRAPHY_REFERENCE_AND_GOVERNANCE_RETHINK.md`, that the owner and agents can read to understand exactly how countries, hierarchies, levels, places, patterns, templates, positions, offices, holders and legal effects connect, and what the target design is. This is a discussion and documentation task: no contracts, seeds or migrations change here.

## Context

Findings from the live `mzizix` database and the Dryv contracts in `dryv/contracts/schemas/postgres`:

- `governance.patterns`, `templates` and `instances` have 0 rows. All 277 positions and 2,305 offices were seeded directly, and no position has a provision, level, seat level, seat count or term rules.
- MP, senator and woman representative are one position with many place offices; governor, deputy governor and county assembly member are one position per county.
- A seat's place is stored in the institution, the position code and the office's `feature_id`.
- Templates fan out over `reference.levels`, but instances record the place as a raw `geography.features` row, so there is no official administrative unit between a level and a feature.
- Several governance tables point straight at `legal.provisions` through `provision_id`, while `legal.effects` already links wordings to any identity. The owner wants legal basis reached only through patterns, templates and effects.

Related: [FOUNDATION_REDESIGN](../../design/data/FOUNDATION_REDESIGN.md), [LEGAL_SCHEMA](../../design/data/LEGAL_SCHEMA.md).

## Acceptance checklist

- [ ] The document explains the chain country, hierarchy, level, administrative unit, feature, with where the country is needed and where it is implied.
- [ ] The document explains how a pattern and its templates generate institutions, positions and offices from a level, and how the database verifies the result with keys, checks and triggers.
- [ ] The document states the rule that governance tables never link to legal provisions directly, and lists every current `provision_id` column that would move to patterns, templates or effects.
- [ ] The document compares linking governance to raw features against a dedicated official administrative unit, with a recommendation and the owner's decision.
- [ ] Open questions and owner decisions are recorded, each decision also written to `.docs/decisions/`, and `task validate` passes.
