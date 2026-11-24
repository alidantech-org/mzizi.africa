---
{id: TSK-FAD4FA7F64EB,name: "Model patterns, pattern parts and the expected-versus-verified ledger",type: task,status: archived,priority: medium,created_at: 2026-11-19T10:29:41.887Z,updated_at: 2026-11-24T19:24:59.090Z,order: 10240,extra: {status_history: [{from: planned,to: archived,at: 2026-11-24T19:24:59.090Z}]},archived_at: 2026-11-24T19:25:18.937Z}
---

# Model patterns, pattern parts and the expected-versus-verified ledger

## Goal

Generate the structure of government before names are known: a county government with its assembly, governor, deputy governor, speaker and one assembly seat per ward; a cabinet with one position per ministry; independent commissions with their members. The generated records must be clearly "expected", never invented people, and the system must be able to say how many are expected, sourced and verified. This must work for any country through seed rows, not code.

## Context

`reference.patterns` is a stub with only `title` (`dryv/contracts/schemas/postgres/reference.ts:313-322`, `schema.sql:2583`) and no seed rows in `seed/data`. The earlier pattern version, binding and dependency tables were removed by owner order (`.docs/decisions/DEC-REFERENCE-REMOVE-PATTERN-LEGAL-20261113.md`); the owner's new direction is recorded in `.docs/decisions/DEC-PATTERNS-GENERATE-EXPECTED-DATA-20261119.md`, and that decision must stay the guard: no versions, no bindings, no dependency graph. A draft exists in `seed/drafts/constitution-patterns/` (11 patterns, 33 institutions, 44 offices, 182 legal bases; county governments left as one pattern). Generic "any row" references exist in `dryv/contracts/schemas/_subjects.ts` (closed enum of table names). The Python `patterns` package (`source/packages/patterns`) reads documents with term lists and is not the generator. Full design: `.docs/design/data/POWER_MONEY_PATTERNS_AND_SITES.md` section 1.

## Proposed contract

`reference.patterns` extended (kind scheme `gov.pattern.kind`, optional country, description); `reference.templates` (pattern, code, what it produces from a closed enum, `fanOutLevelId` to `geography.levels`, `parentPartId` self, name and code templates, the position or institution attributes it carries, citation); `reference.instances` (part, unit feature, real foreign keys to the generated row (exactly one of institution, position, office, domain, contact), `statusId` from scheme `gov.evidence.status`: expected, sourced, verified, not-found, disputed, generated-at, verifying citation). Templates use named tokens bound to typed normalisers in `seed/terms/` (slug, remove kind word), never code.

## Method options

A. Manifests only (small DB, no queries). B. Patterns, parts and a ledger. Recommended. C. Placeholder flags on every table (rejected, spreads one concept). D. Restore removed tables (rejected by owner order).

Generation runs in the engine as an operation that is idempotent: re-running creates no duplicates because the ledger keys on part and unit.

Table names follow the one-word rule: `reference.templates` and `reference.instances`. Full column lists are in `.docs/design/data/SCHEMA_CHANGE_INVENTORY_20261119.md`.

## Acceptance checklist

- [ ] Owner confirms in a decision record that this smaller model is the intended pattern design and the removed tables stay removed.
- [ ] Author the three tables and the `gov.evidence.status` and `gov.pattern.kind` schemes; owner approves each field and value before generation.
- [ ] Define the token and normaliser vocabulary in `seed/terms/` with tests for kind-word removal and diacritics, and confirm no code carries a country, place or domain literal.
- [ ] Move the approved parts of `seed/drafts/constitution-patterns/` into pattern rows only after owner approval, one set at a time.
- [ ] Paper-test the county-government, cabinet, independent-commission and ward-seat patterns, plus one pattern from a country with a different structure.
- [ ] Define the completeness read ("1,450 expected, 312 verified") and confirm it needs no stored counts.
- [ ] Prove generation never writes an individual or a holder row.
- [ ] Run `task validate`.
