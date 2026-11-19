---
id: DEC-SCHEMA-CHANGE-INVENTORY-APPROVED-20261119
name: Owner approval of the schema change inventory of 19 November 2026
type: decision
tags: [database, schema, dryv, approval, owner-direction]
extra: {status: accepted, approved_by: project owner, approved_on: 2026-11-19, scope: dryv_contract_authoring, migrations: pre_release_rebuild_only, group: GRP-F3C7A28BEB50}
---

# Owner approval of the schema change inventory

## Decision

On 19 November 2026 the project owner answered "Approve all" to the inventory in `.docs/design/data/SCHEMA_CHANGE_INVENTORY_20261119.md`. Approved in full:

- the 17 new tables: `reference.templates`, `reference.instances`, `governance.positions`, `procedures`, `powers`, `functions`, `assignments`, `promises`, `fulfilments`, `politics.contributions`, `civic.partners`, `variations`, `officials`, `statistics.components`, `source.disputes`, `contenders`, `community.replies`;
- every changed table and column listed in section B, including removing `governance.offices.office_kind_id`;
- the new vocabulary schemes listed in section C, as schemes. **Value rows are still shown to the owner before any seed file is added** (`AGENTS.md`, seed rules);
- the generated-output consequences in section E.

## Defaults applied where the owner did not choose

- `civic.partners` and `civic.officials` keep their names (alternatives `consortia` and `signatories` were offered and not chosen).
- Pattern design is the smaller model confirmed in `DEC-PATTERNS-GENERATE-EXPECTED-DATA-20261119`; the removed pattern version, binding and dependency tables stay removed.

## Not approved by this decision

Seed files, vocabulary values, the Kenya seed plan, any API read or screen. Each needs its own approval. Task 001 applies this inventory to the contracts and generated models.
