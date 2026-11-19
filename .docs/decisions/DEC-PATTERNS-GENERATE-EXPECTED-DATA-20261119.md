---
id: DEC-PATTERNS-GENERATE-EXPECTED-DATA-20261119
name: Owner direction - patterns generate expected institutions, offices and site candidates
type: decision
tags: [database, patterns, reference, governance, source, owner-direction]
extra: {status: accepted_contracts_pending_review, recorded_on: 2026-11-19, relates_to: DEC-REFERENCE-REMOVE-PATTERN-LEGAL-20261113}
---

# Owner direction: patterns generate expected data

## Decision

On 19 November 2026 the project owner asked, in chat, for patterns to be modelled in Reference so the system can generate expected data and placeholders before real names and offices are found. Named examples: county governments, members of county assemblies, any institutions and cabinets, and website domain patterns such as a county name normalised under the government domain, a constituency name normalised under the constituency fund domain, and a ministry short name under the government domain. Sites link to entities and institutions through `official.entities`, and candidate sites are possible sources in the source schema.

## Relation to the earlier order

`DEC-REFERENCE-REMOVE-PATTERN-LEGAL-20261113` ordered pattern versions, bindings and dependencies removed and said not to reintroduce them without a new explicit owner decision. This is that new request for a *different, smaller* model: patterns, the parts a pattern produces, and a ledger of generated records with their evidence status. The removed tables are not restored. No version fields are added (`.docs/rules/versioning.md`).

## Conditions

- Placeholders are structure only: institutions, positions, offices and candidate hosts. Never people, never invented names.
- A candidate host is never a source until verified (`POWER_MONEY_PATTERNS_AND_SITES.md`, section 2).
- Each table and vocabulary is shown to the owner and approved before it is authored.
- Pattern content is seed data under owner approval, not code.

## Where it is designed

`.docs/design/data/POWER_MONEY_PATTERNS_AND_SITES.md` sections 1 and 2, and task 010 and 011 in group GRP-F3C7A28BEB50.

## Confirmations of 19 November 2026 (second message)

- The owner confirmed that patterns are added back in the smaller form described above.
- No `official.sites` table: contacts are enough for a website.
- Adopted: completeness meter, one evidence-status vocabulary, as-of reading rule, keeping both sources in a dispute, right of reply, standards mappings (OCDS, BODS, Popolo), reuse terms per source, a defined meaning of "person with power" and "relative or associate".
- Table names: one word, plural, unless two words are really needed.
- Unstructured material (videos, social posts, long statements, replies) lives in `filesystem.media` and `filesystem.contents`, attached to the subject record, never in new domain tables.
- Before any task counts as approved, every table, column change and vocabulary is listed in `.docs/design/data/SCHEMA_CHANGE_INVENTORY_20261119.md`; task 001 then applies the approved inventory to the Dryv contracts and generated models.
