---
{id: TSK-21ADAFA38D2C,name: "Wave 1: South Africa, Nigeria and Tanzania proof of concept, Kenya reference seed",type: task,status: completed,priority: medium,created_at: 2026-11-02T07:13:41.093Z,updated_at: 2026-11-02T09:48:07.140Z,due_at: 2026-11-27,order: 8192,extra: {status_history: [{from: planned,to: completed,at: 2026-11-02T09:48:07.140Z}]},archived_at: 2026-11-12T05:47:56.094Z}
---

# Wave 1: South Africa, Nigeria and Tanzania proof of concept, Kenya reference seed

## Goal
Show the pipeline is country-neutral by importing, for each of South Africa, Nigeria and Tanzania, one jurisdiction, administrative boundaries at levels 1 and 2 and one population table, plus the Kenyan classification seed, using only mapping files and no code changes.

## Context
Read .docs/docs/DATA_INTAKE_PLAN.md and .docs/decisions/data-engine-design.md first; they define the pipeline, staging model and promotion rules. Work only on develop, record progress in this file and tick items with task check. Each dataset needs a verified open licence and a publisher row. Country-specific logic is a design failure and must be reported. Classification records (levels, institution types) are scoped by jurisdiction.

## Acceptance checklist
- [x] Kenya classification seed (levels, institution and election types, fiscal stages) as reference seed.
- [x] Boundaries (country and first administrative level) imported for the three countries through the same pipeline; second administrative level is recorded as a gap (ADM2 files carry no parent code, so parents would have to be derived by geometry).
- [x] One national population series each (World Bank SP.POP.TOTL, 1960 to 2025) imported into the statistical schema; census tables from the national statistical offices are a gap.
- [x] Report any country-specific code that was needed.

## Compliance (added after LEGALITY_SAFETY_AND_COMPLIANCE.md)
Each country needs a jurisdiction dossier and a human-reviewed source assessment before collection; until then use only licensed bulk downloads and record licence, rights holder and attribution on the source document. South Africa, Nigeria and Tanzania have different privacy, cybercrime and copyright regimes; do not apply the Kenya baseline mechanically.

## Progress
The same mapping files and pipeline import Kenya, South Africa, Nigeria and Tanzania; the mappings take the jurisdiction code and the level names (read from each jurisdiction's reference data) as variables. The only country-specific thing in code is the ISO3 to jurisdiction code mapping. Reference seed: Kenya's hierarchy and vocabularies and the jurisdictions and level hierarchies of ZA, NG and TZ. Boundaries come from geoBoundaries gbOpen (real files, kept as unmodified test data): ZA 9 provinces, NG 37 states, TZ 30 regions plus the countries; every candidate passes through validation, test-reviewer approval and promotion. Findings, not silently accepted: Tanzania's ADM1 (OpenStreetMap/Wambacher 2015) and ADM0 (Sentinel-2 land cover 2021) disagree: 11 of 30 regions are more than 2 percent outside the country polygon, so 19 regions were promoted and 11 held as invalid. Licences differ per file and are recorded verbatim as unconfirmed: South Africa CC BY 3.0 IGO, Nigeria CC BY 4.0, Tanzania ADM0 CC BY 4.0 and ADM1 ODbL 1.0 (share-alike conditions apply to publication and need review). Population: World Bank SP.POP.TOTL national totals for the four countries, 66 yearly observations each, shared period records, idempotent re-import; the licence (CC BY 4.0 per the World Bank terms) is unconfirmed. Test suite: tests/test_poc_countries.py. Gaps: level 2 boundaries, census tables from the statistical offices, no ISO identifiers stored, the Kenya vocabularies in the reference seed are curated and unsourced, unit names are as published (for example "Abuja Federal Capital Territory", "the Federal Republic of Nigeria").
