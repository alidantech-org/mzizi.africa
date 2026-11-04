---
{id: TSK-6B688516A6C3,name: Author statistics and services contracts,type: task,status: completed,priority: medium,created_at: 2026-11-02T04:56:58.962Z,updated_at: 2026-11-02T05:20:21.165Z,order: 10240,due_at: 2026-11-02,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T05:19:58.487Z},{from: in-progress,to: completed,at: 2026-11-02T05:20:21.165Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-6B688516A6C3/1793596798489-start,started_at: 2026-11-02T05:19:58.560Z,end_ref: refs/tracking/TSK-6B688516A6C3/1793596821167-end,ended_at: 2026-11-02T05:20:21.165Z,summary: {files: 2,insertions: 209,deletions: 1}}]}},archived_at: 2026-11-04T15:53:08.080Z}
---

# Author statistics and services contracts

## Goal

Provide neutral indicator and public-service contracts with provenance and time, and repair the services domain that never had a migration.

## Context

Statistics models are mostly neutral but lack provenance references and record time, and use denormalised codes and a string verification flag. Services models have dangling foreign keys, Kenyan role and board enums, and no migration. Facility identity should be separated from leadership and boards. Read .docs/handoffs/neutral-model-and-nestjs-api-handoff.md, .docs/decisions/nestjs-api-and-dryv-placement.md and .docs/docs/audits/LEGACY_MODEL_INVENTORY.md before starting. This task only authors and typechecks contracts (bun run check in dryv/); code generation for all domains happens afterwards in the generate-and-validate task. Keep work on develop, track it through the Task CLI and update the matching .docs files in the same change.

## Acceptance checklist

- [x] Author period, indicator, table, column and observation contracts with provenance and verification state.
- [x] Author sector, service, amenity and delivery contracts and replace Kenyan role enums with country-config.
- [x] Separate amenity identity from boards and leadership as office or holder links.
- [x] Compile and document.
- [x] Update .docs/docs/DOMAINS.md.

## Progress

Authored dryv/contracts/domains/statistics as two groups. Statistics: Period, IndicatorCategory, Indicator, IndicatorColumn, StatisticsTable and Observation with provenance, record time and a confidence-level enum; the legacy string is_verified flag is replaced by the shared verification state. Services: PublicService, Amenity, AmenityOffice (boards and leadership become office links into governance, typed by a classification, replacing the Kenyan role and board enums) and ServiceDelivery. Sectors are classification records. The services domain no longer carries dangling foreign keys to legal and governance tables; links are ids resolved at read time. bun run check passes (311 schemas, 121 operations).
