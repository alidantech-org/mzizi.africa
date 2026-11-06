---
{id: TSK-C1D45F1811D1,name: "Author governance, offices and people contracts",type: task,status: completed,priority: medium,created_at: 2026-11-02T04:56:58.682Z,updated_at: 2026-11-02T05:18:41.377Z,order: 7168,due_at: 2026-11-02,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T05:17:41.191Z},{from: in-progress,to: completed,at: 2026-11-02T05:18:41.377Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-C1D45F1811D1/1793596661193-start,started_at: 2026-11-02T05:17:41.265Z,end_ref: refs/tracking/TSK-C1D45F1811D1/1793596721379-end,ended_at: 2026-11-02T05:18:41.377Z,summary: {files: 2,insertions: 264,deletions: 1}}]}},archived_at: 2026-11-04T05:47:26.861Z}
---

# Author governance, offices and people contracts

## Goal

Model institutions, relationships, offices, rules, holders and people neutrally, with Kenyan terms, selection methods and limits held as records.

## Context

Inventory findings: institutions use free-string ke/* types and have no time or legal basis; relationships are only structural; offices embed max_terms, term_duration_years and retirement_age; holders lack a person foreign key; selection rules are single-step; people use a 36 character key and mix PII in profiles. Separate the office as a role from its holder (AGENTS.md section 8). Read .docs/handoffs/neutral-model-and-nestjs-api-handoff.md, .docs/decisions/nestjs-api-and-dryv-placement.md and .docs/docs/audits/LEGACY_MODEL_INVENTORY.md before starting. This task only authors and typechecks contracts (bun run check in dryv/); code generation for all domains happens afterwards in the generate-and-validate task. Keep work on develop, track it through the Task CLI and update the matching .docs files in the same change.

## Acceptance checklist

- [x] Author institution, typed relationship, office, dated office-rule, appointment and holder contracts.
- [x] Model multi-stage selection procedures as ordered stages.
- [x] Author person identity with per-claim evidence and handle profile PII explicitly.
- [x] Compile and document the model including Kenya as records.
- [x] Update .docs/docs/DOMAINS.md.

## Progress

Authored dryv/contracts/domains/governance: Institution (type and branch as jurisdiction-scoped classification ids, legal basis id), typed InstitutionRelationship (has_component, appoints, funds, oversees, accountable_to, delegates_to), Office, dated OfficeRule for term limits, term length and age limits with a legal basis, SelectionProcedure with ordered SelectionStage, Person with per-claim evidence and approximate-date precision, PersonName, and OfficeHolder with substantive/acting status and departure reason. Contact details from the legacy people profile are deliberately not carried over until a privacy review decides how personal data is held. bun run check passes (91 schemas, 33 operations).
