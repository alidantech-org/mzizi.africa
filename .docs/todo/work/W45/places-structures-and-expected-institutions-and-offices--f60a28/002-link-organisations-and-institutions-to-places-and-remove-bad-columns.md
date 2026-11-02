---
{id: TSK-AA0A323E646D,name: "Governance generalisation: relationships, office scope, units and entity link",type: task,status: in-progress,priority: medium,created_at: 2026-11-02T20:59:35.795Z,updated_at: 2026-11-02T22:32:12.465Z,order: 2048,depends_on: [TSK-2107BCCA74E8],extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T22:32:12.465Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-AA0A323E646D/1793658732467-start,started_at: 2026-11-02T22:32:13.008Z}]}}}
---

# Governance generalisation: relationships, office scope, units and entity link

## Goal
Make existing governance and civic models carry the meanings the assessment requires, by extension rather than by adding parallel tables.

## Context
Decisions accepted: generalise `governance.relationships` from institution-to-institution to subject kind and id with the added kinds owned_by, operated_by, funded_by, regulated_by, overseen_by and part_of (keeping accountable_to, appoints, delegates_to, funds, has_office, has_component, oversees); add an optional soft `entity_id` on `governance.institutions` so the legal person and the public body are one identity; represent branches and regional offices as institution children through `has_component` with types regional-office and operational-unit; add `scope_geo_unit_id` and `definition_code` to `governance.offices` and rename the institution `geo_unit_id` to make clear it is jurisdiction scope; reuse `civic.amenities` as the facility identity, drop its `geo_unit_id`, and link facilities to operators and owners through relationships. Funding amounts remain in finance. Electoral seats stay election-specific and reference the office instance. This task reconciles with TSK-5C5192D034B2 (governance institutions and offices wave 2) and must not duplicate it.

## Acceptance checklist
- [ ] Extend the relationship contract and migrate the 79 existing rows.
- [ ] Add the entity link and fill it for institutions that have a matching entity, reporting unmatched ones without guessing.
- [ ] Add office scope and definition code, and backfill the 421 offices where the scope is known from code or holder.
- [ ] Add unit institution types and change amenity: drop its geography column after data is moved (none exists yet).
- [ ] Update affected API endpoints, DTOs, fixtures and tests.
