---
{id: TSK-8AEAA3F9CA61,name: "Design and generate elections, political and events contracts",type: task,status: planned,priority: medium,created_at: 2026-11-02T04:56:58.763Z,updated_at: 2026-11-02T04:58:12.029Z,order: 8192,due_at: 2026-11-02}
---

# Design and generate elections, political and events contracts

## Goal

Cover elections, seats, candidates, results, parties and events in a way that works for any electoral system.

## Context

The inventory proposes an election-type registry per country, seats tied to legal provisions and electoral jurisdictions, results with source and verification state, parties with registry identifiers and dated status, and events split into a neutral calendar plus domain records. PartyIdeology looks mis-designed and needs a shared vocabulary with a dated link. Read .docs/handoffs/neutral-model-and-nestjs-api-handoff.md, .docs/decisions/nestjs-api-and-dryv-placement.md and .docs/docs/audits/LEGACY_MODEL_INVENTORY.md before starting. Keep work on develop, track it through the Task CLI and update the matching .docs files in the same change.

## Acceptance checklist

- [ ] Author election, seat, candidate, result with result level and declaring authority contracts.
- [ ] Author party, membership, structure, position and ideology link contracts.
- [ ] Author a neutral event and event-type contract linking to domain records.
- [ ] Include evidence and verification state on results and claims.
- [ ] Compile and update .docs/docs/DOMAINS.md.
