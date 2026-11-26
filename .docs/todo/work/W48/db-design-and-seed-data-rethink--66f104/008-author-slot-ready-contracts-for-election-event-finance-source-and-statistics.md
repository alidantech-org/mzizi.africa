---
{id: TSK-EA524333DE9A,name: "Author slot-ready contracts for election, event, finance, source and statistics",type: task,status: completed,priority: medium,created_at: 2026-11-25T21:36:55.106Z,updated_at: 2026-11-26T00:16:43.126Z,order: 8192,depends_on: [TSK-6EF5ED4DC018],extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-25T23:12:29.859Z},{from: in-progress,to: completed,at: 2026-11-26T00:16:43.126Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-EA524333DE9A/1795648349862-start,started_at: 2026-11-25T23:12:35.182Z,end_ref: refs/tracking/TSK-EA524333DE9A/1795652203128-end,ended_at: 2026-11-26T00:16:43.127Z,summary: {files: 166,insertions: 6032,deletions: 10376}}]}}}
---

# Author slot-ready contracts for election, event, finance, source and statistics

## Goal
Make every schema the audit marked as slot-eligible able to hold an expected row, and fix the contract problems the audit found, so templates can generate election cycles and contests, event rules and schedules, budgets and funds, source domains and editions, censuses and media placeholders without breaking NOT NULL rules or creating duplicates. Success is compiled contracts in which each listed blocker is removed or justified, evidence-only tables remain strict, and unique keys no longer allow duplicates through NULLs.

## Context
Findings with line references are in `.docs/design/data/SCHEMA_AUDIT_SLOTS_AND_ENUMS.md` and `.dev/research/research_notes/Schema audit/`. Examples: `election.contests` per seat per cycle, `finance.funds` for each county revenue fund and each NG-CDF, `event.occurrences` with an unknown date, `source.domains` with an unknown host (a domain is an effect of its institution, so its direct template link is removed). Evidence rows (results, tallies, candidates, figures, prices, provenance) are never slots and stay strict. Unique keys that include nullable columns use the best Dryv-supported option. Direct law links on motions and events are removed.

## Acceptance checklist
- [x] Make the blocker columns listed in section 2 of the audit nullable or give them an `expected` status, one schema at a time.
- [x] Add the missing period-ordering, at-most-one and same-contest rules and the missing unique keys from section 4 of the audit.
- [x] Remove `Motions.provisionId`, `Motions.instrumentId`, `basisProvisionId` on events, changes and schedules, and `source.domains.templateId`.
- [x] Add root template columns to election cycles and contests, event rules and schedules, and finance budgets and funds.
- [x] Extend the closed `SubjectTable` list with slots and contacts through `bun run tables:sync`.
- [x] Run `bun run dryv:check` and record the result under Progress.

## Progress

2026-11-26. Partly done. Done: provision links removed (motion, event, change, schedule) and `source.domains.template_id`; root template links on election cycles, contests, event rules and schedules, budgets and funds; motion at-most-one rule; nullable columns for occurrence date and knowledge, season months, venue place, contact value, holder person; partial unique index pairs for relationships, areas and texts; subject tables synced. Not done (listed for the owner): the remaining NOT NULL blockers (`media.uses.asset_id`, `election.forms.asset_id`, `legal.effects.wording_id`, `finance` revision status and appropriation class, `civic.roles`) and the missing period-ordering, unique-key and same-contest rules from the audit.

### 2026-11-26, second pass

Done now: nullable blockers removed (`media.uses.asset_id`, `election.forms.asset_id`, `finance.appropriations.class_term`, `civic.roles` at-most-one actor); partial unique index pairs for alignments and turnouts; period-ordering rules for services, facilities, projects, coalitions, alignments and prices; the finance flow anchor rule; `product.lang` unique on position; the case moderation state has its own enum; frequency gained weekly, daily and irregular; `FormStatus` and `HansardStatus` merged; price kind moved to a term. Not done, with reasons: `legal.effects.wording_id` (needs its own design), `statistics.figures` and `legal.provisions` unique keys (prepared or seeded data may repeat), the tally-same-contest guard, debt borrower and lender kinds, fiscal-year mapping, and foreign keys to partitioned `source.evidence` (Dryv refuses a reference without a single-column key).
