---
{id: TSK-6B688516A6C3,name: Author statistics and services contracts,type: task,status: planned,priority: medium,created_at: 2026-11-02T04:56:58.962Z,updated_at: 2026-11-02T05:14:40.094Z,order: 10240,due_at: 2026-11-02}
---

# Author statistics and services contracts

## Goal

Provide neutral indicator and public-service contracts with provenance and time, and repair the services domain that never had a migration.

## Context

Statistics models are mostly neutral but lack provenance references and record time, and use denormalised codes and a string verification flag. Services models have dangling foreign keys, Kenyan role and board enums, and no migration. Facility identity should be separated from leadership and boards. Read .docs/handoffs/neutral-model-and-nestjs-api-handoff.md, .docs/decisions/nestjs-api-and-dryv-placement.md and .docs/docs/audits/LEGACY_MODEL_INVENTORY.md before starting. This task only authors and typechecks contracts (bun run check in dryv/); code generation for all domains happens afterwards in the generate-and-validate task. Keep work on develop, track it through the Task CLI and update the matching .docs files in the same change.

## Acceptance checklist

- [ ] Author period, indicator, table, column and observation contracts with provenance and verification state.
- [ ] Author sector, service, amenity and delivery contracts and replace Kenyan role enums with country-config.
- [ ] Separate amenity identity from boards and leadership as office or holder links.
- [ ] Compile and document.
- [ ] Update .docs/docs/DOMAINS.md.
