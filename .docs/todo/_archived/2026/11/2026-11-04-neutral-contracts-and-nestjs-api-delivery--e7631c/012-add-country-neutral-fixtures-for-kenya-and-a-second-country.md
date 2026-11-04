---
{id: TSK-F6AB37BA55CE,name: Add country-neutral fixtures for Kenya and a second country,type: task,status: completed,priority: medium,created_at: 2026-11-02T04:56:59.150Z,updated_at: 2026-11-02T05:46:09.958Z,order: 12288,due_at: 2026-11-02,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T05:42:09.169Z},{from: in-progress,to: completed,at: 2026-11-02T05:46:09.958Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-F6AB37BA55CE/1793598129171-start,started_at: 2026-11-02T05:42:09.387Z,end_ref: refs/tracking/TSK-F6AB37BA55CE/1793598369960-end,ended_at: 2026-11-02T05:46:09.958Z,summary: {files: 58,insertions: 3364,deletions: 1}}]}},archived_at: 2026-11-04T15:53:08.080Z}
---

# Add country-neutral fixtures for Kenya and a second country

## Goal

Prove the model is neutral by loading Kenya and one structurally different country as records only, with no schema change.

## Context

The group milestone requires fixtures for Kenya plus another country with different levels, institutions, election systems and fiscal stages. Candidates include a federal or parliamentary system. Fixtures must preserve provenance and valid time and live under the database management engine or test fixtures, not the API. Read .docs/handoffs/neutral-model-and-nestjs-api-handoff.md, .docs/decisions/nestjs-api-and-dryv-placement.md and .docs/docs/audits/LEGACY_MODEL_INVENTORY.md before starting. Keep work on develop, track it through the Task CLI and update the matching .docs files in the same change.

## Acceptance checklist

- [x] Select the second country and justify the structural difference.
- [x] Write fixtures for geography, governance, elections and fiscal configuration for both countries.
- [x] Load both through the contracts and API read endpoints in a test.
- [x] Assert no country-specific columns or enums were needed.
- [x] Record gaps found in the neutral design.

## Progress

Chose South Africa as the second country because it differs from Kenya in several structural ways at once: three place levels (country, province, municipality) against country, county, ward; a President chosen by the National Assembly in nomination then election stages against direct election by the electoral commission; closed-list proportional representation against a general election; a 1 April to 31 March fiscal year in ZAR against 1 July to 30 June in KES; and a different fiscal workflow. Fixtures live in source/backend/db-engine/fixtures/neutral-model (28 rows each, loaded as unverified with source 'Test fixture' so they cannot pass for canonical data). src/neutral/fixture-loader.ts loads both into one synchronised PostgreSQL schema and src/neutral/neutral-model.integration.spec.ts reads them back through the real use cases with a SELECT-only role: 8 tests prove each country returns its own levels, vocabularies, hierarchy, selection stages, office rules, fiscal calendar and currency, that records do not leak across countries, and that no column or enum value in the schema names a country concept. The exercise found a real gap, now fixed: jurisdictions and classification records had no read endpoints (added ReferenceRead). Remaining gaps are recorded in the fixtures README. Full suite: 506 files, 14276 tests.
