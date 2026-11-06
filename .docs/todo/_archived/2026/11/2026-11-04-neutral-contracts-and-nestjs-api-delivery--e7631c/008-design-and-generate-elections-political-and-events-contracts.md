---
{id: TSK-8AEAA3F9CA61,name: "Author elections, political and events contracts",type: task,status: completed,priority: medium,created_at: 2026-11-02T04:56:58.763Z,updated_at: 2026-11-02T05:18:48.050Z,order: 8192,due_at: 2026-11-02,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T05:18:41.666Z},{from: in-progress,to: completed,at: 2026-11-02T05:18:48.050Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-8AEAA3F9CA61/1793596721667-start,started_at: 2026-11-02T05:18:41.738Z,end_ref: refs/tracking/TSK-8AEAA3F9CA61/1793596728052-end,ended_at: 2026-11-02T05:18:48.051Z,summary: {files: 2,insertions: 312,deletions: 1}}]}},archived_at: 2026-11-04T05:47:26.861Z}
---

# Author elections, political and events contracts

## Goal

Cover elections, seats, candidates, results, parties and events in a way that works for any electoral system.

## Context

The inventory proposes an election-type registry per country, seats tied to legal provisions and electoral jurisdictions, results with source and verification state, parties with registry identifiers and dated status, and events split into a neutral calendar plus domain records. PartyIdeology looks mis-designed and needs a shared vocabulary with a dated link. Read .docs/handoffs/neutral-model-and-nestjs-api-handoff.md, .docs/decisions/nestjs-api-and-dryv-placement.md and .docs/docs/audits/LEGACY_MODEL_INVENTORY.md before starting. This task only authors and typechecks contracts (bun run check in dryv/); code generation for all domains happens afterwards in the generate-and-validate task. Keep work on develop, track it through the Task CLI and update the matching .docs files in the same change.

## Acceptance checklist

- [x] Author election, seat, candidate, result with result level and declaring authority contracts.
- [x] Author party, membership, structure, position and ideology link contracts.
- [x] Author a neutral event and event-type contract linking to domain records.
- [x] Include evidence and verification state on results and claims.
- [x] Compile and update .docs/docs/DOMAINS.md.

## Progress

Authored dryv/contracts/domains/elections (three groups: elections, political, events). Elections: Election, Seat (now scoped to one election, linked to an office and a legal basis, replacing the legacy hard link to a constitution), Candidate, ElectionResult (result level, declaring institution, verification state), Manifesto and ManifestoCommitment. Political: Party with a registry identifier and issuing authority, PartyMembership, PartyUnit (levels are classification records), Ideology with a dated PartyIdeology link replacing the legacy unique-per-row ideology code, PartyPosition scoped by unit, PartyPositionHolder. Events: a neutral Event calendar plus EventLink to domain records. Election types, result levels and event types are classification ids. bun run check passes (166 schemas, 63 operations).
