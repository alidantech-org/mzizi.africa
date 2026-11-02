---
{id: TSK-21ADAFA38D2C,name: "Wave 1: South Africa, Nigeria and Tanzania proof of concept, Kenya reference seed",type: task,status: planned,priority: medium,created_at: 2026-11-02T07:13:41.093Z,updated_at: 2026-11-02T07:13:41.093Z,due_at: 2026-11-27,order: 8192}
---

# Wave 1: South Africa, Nigeria and Tanzania proof of concept, Kenya reference seed

## Goal
Show the pipeline is country-neutral by importing, for each of South Africa, Nigeria and Tanzania, one jurisdiction, administrative boundaries at levels 1 and 2 and one population table, plus the Kenyan classification seed, using only mapping files and no code changes.

## Context
Read .docs/docs/DATA_INTAKE_PLAN.md and .docs/decisions/data-engine-design.md first; they define the pipeline, staging model and promotion rules. Work only on develop, record progress in this file and tick items with task check. Each dataset needs a verified open licence and a publisher row. Country-specific logic is a design failure and must be reported. Classification records (levels, institution types) are scoped by jurisdiction.

## Acceptance checklist
- [ ] Kenya classification seed (levels, institution and election types, fiscal stages) as reference seed.
- [ ] Boundaries levels 1 and 2 imported for the three countries through the same pipeline.
- [ ] One national population table each imported into the statistical schema.
- [ ] Report any country-specific code that was needed.

## Compliance (added after LEGALITY_SAFETY_AND_COMPLIANCE.md)
Each country needs a jurisdiction dossier and a human-reviewed source assessment before collection; until then use only licensed bulk downloads and record licence, rights holder and attribution on the source document. South Africa, Nigeria and Tanzania have different privacy, cybercrime and copyright regimes; do not apply the Kenya baseline mechanically.
