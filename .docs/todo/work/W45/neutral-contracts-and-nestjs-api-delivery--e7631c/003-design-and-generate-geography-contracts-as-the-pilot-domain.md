---
{id: TSK-202EE9F68B65,name: Design and generate geography contracts as the pilot domain,type: task,status: planned,priority: medium,created_at: 2026-11-02T04:56:58.372Z,updated_at: 2026-11-02T04:56:58.372Z,order: 3072}
---

# Design and generate geography contracts as the pilot domain

## Goal

Model geography in the neutral design and express it as Dryv contracts, because geography is the pilot domain and the mobile app already depends on its contract.

## Context

Legacy geography has geo_levels with a Kenyan level seed, geo_units with two unique codes, geo_relationships, versioned boundaries with provenance, name versions and change relationships. The mobile contract is in .docs/docs/geography-api-contract.md and the inventory lists dispositions: levels become jurisdiction-scoped records, units gain a jurisdiction type, boundaries and names are reused as templates. Historical polities must not be forced into modern borders (AGENTS.md section 6). Depends on the shared contracts task. Read .docs/handoffs/neutral-model-and-nestjs-api-handoff.md, .docs/decisions/nestjs-api-and-dryv-placement.md and .docs/docs/audits/LEGACY_MODEL_INVENTORY.md before starting. Keep work on develop, track it through the Task CLI and update the matching .docs files in the same change.

## Acceptance checklist

- [ ] Author units, jurisdiction-scoped levels, versioned boundaries, name history and lineage contracts using the shared contracts.
- [ ] Represent a historical polity that does not map to a modern state in a worked example.
- [ ] Map each field of the mobile geography contract to the new contracts and list gaps.
- [ ] Compile to Runtime IR and record the field mapping in the domain doc.
- [ ] Update .docs/docs/DOMAINS.md for the geography ownership.
