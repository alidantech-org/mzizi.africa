---
{id: TSK-F6AB37BA55CE,name: Add country-neutral fixtures for Kenya and a second country,type: task,status: planned,priority: medium,created_at: 2026-11-02T04:56:59.150Z,updated_at: 2026-11-02T04:56:59.150Z,order: 12288}
---

# Add country-neutral fixtures for Kenya and a second country

## Goal

Prove the model is neutral by loading Kenya and one structurally different country as records only, with no schema change.

## Context

The group milestone requires fixtures for Kenya plus another country with different levels, institutions, election systems and fiscal stages. Candidates include a federal or parliamentary system. Fixtures must preserve provenance and valid time and live under the database management engine or test fixtures, not the API. Read .docs/handoffs/neutral-model-and-nestjs-api-handoff.md, .docs/decisions/nestjs-api-and-dryv-placement.md and .docs/docs/audits/LEGACY_MODEL_INVENTORY.md before starting. Keep work on develop, track it through the Task CLI and update the matching .docs files in the same change.

## Acceptance checklist

- [ ] Select the second country and justify the structural difference.
- [ ] Write fixtures for geography, governance, elections and fiscal configuration for both countries.
- [ ] Load both through the contracts and API read endpoints in a test.
- [ ] Assert no country-specific columns or enums were needed.
- [ ] Record gaps found in the neutral design.
