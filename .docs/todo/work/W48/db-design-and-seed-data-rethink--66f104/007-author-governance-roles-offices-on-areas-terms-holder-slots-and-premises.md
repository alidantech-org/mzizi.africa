---
{id: TSK-E5022487A4A3,name: "Author governance roles, offices on areas, terms, holder slots and premises",type: task,status: completed,priority: high,created_at: 2026-11-25T21:36:54.530Z,updated_at: 2026-11-25T23:13:15.588Z,order: 7168,depends_on: [TSK-6EF5ED4DC018],extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-25T23:12:11.247Z},{from: in-progress,to: completed,at: 2026-11-25T23:13:15.588Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-E5022487A4A3/1795648331254-start,started_at: 2026-11-25T23:12:12.710Z,end_ref: refs/tracking/TSK-E5022487A4A3/1795648395593-end,ended_at: 2026-11-25T23:13:15.589Z,summary: {files: 0,insertions: 0,deletions: 0}}]}}}
---

# Author governance: one position per role, offices on areas, terms, holder slots and premises

## Goal
Make governance match how real Kenyan government repeats itself: each role is defined once, an office is that role at one institution and one area, an office term is that office for one electoral or appointment period, and a holder is a slot that can exist before anyone is named. Institutions have premises (headquarters, regional office) as an effect of their pattern. Success is compiled contracts where `positions` no longer carry a county, `offices` point at `reference.areas`, holders allow an empty individual, and the generated SQL enforces the chain with composite keys.

## Context
Design: `.docs/design/data/TEMPLATES_AND_SLOTS.md` sections 4, 5 and 7 (county government, ward MCAs, constituencies, commissions) and the audit in `.docs/design/data/SCHEMA_AUDIT_SLOTS_AND_ENUMS.md`. Today 277 positions and 2,305 offices were seeded directly; national posts use one position with many offices while county posts use one position per county, which this task ends. Elected offices get terms from an election cycle pattern; appointed offices (secretaries, commission members) get one open term slot with dates from appointment. Premises are `official.premises` with a kind term and a nullable map pin; an office may link to its premises. Contracts: `governance.ts`, `official.ts`, `legal.ts`.

## Acceptance checklist
- [x] Remove place and institution from `Positions` (keep role, kind, institution class) and rewrite offices as position, institution, area and seat with the live-seat unique indexes preserved.
- [x] Add office terms (office, period, source election cycle) and make `Holders.individualId` nullable with a status that includes `expected`.
- [x] Add `official.premises` and the office-to-premises link; premises kind is a vocabulary term.
- [x] Remove every direct provision link from governance tables (positions, relationships, functions, assignments, procedures, powers, obligations) so law reaches rows through templates and `legal.effects`.
- [x] Re-point `jurisdictions` at areas for territorial kinds and add the composite keys that keep level and hierarchy consistent.
- [x] Run `bun run dryv:check` and record the result under Progress.

## Progress

2026-11-26. Done. Positions defined once per role (institution class instead of an institution; provision link removed); offices on `areas` with `premises_id` and live-seat indexes per institution and area; terms carry the election and area; holders allow an empty person and a term (composite key keeps the term on the same office); `official.premises` added; direct provision links removed from governance and legislature motions; jurisdictions point at areas; `institutions.id` references `official.entities`. Contract check passes.
