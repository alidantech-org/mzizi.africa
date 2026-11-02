---
{id: TSK-59EE9BF08CA7,name: "Kenya waves 2 to 4: statistics, legal, governance, elections, people, finance, procurement",type: task,status: planned,priority: medium,created_at: 2026-11-02T07:13:41.251Z,updated_at: 2026-11-02T07:13:41.251Z,due_at: 2026-12-18,order: 9216}
---

# Kenya waves 2 to 4: statistics, legal, governance, elections, people, finance, procurement

## Goal
Plan and then import the remaining Kenya domains from real documents and datasets, in the order set by the intake plan, with extraction profiles, mapping files and review queues for each.

## Context
Read .docs/docs/DATA_INTAKE_PLAN.md and .docs/decisions/data-engine-design.md first; they define the pipeline, staging model and promotion rules. Work only on develop, record progress in this file and tick items with task check. Candidates include KNBS census tables, Kenya Law and the Gazette, IEBC results, Registrar of Political Parties, National Treasury and Controller of Budget reports and the procurement portal. People data needs a privacy review before import. This task is the umbrella; split each wave into its own detailed task when its prerequisites are done.

## Acceptance checklist
- [x] Split the waves into detailed tasks with prerequisites (done 2026-11-02): Tier B extractors, constitution and Acts, constituency and ward units, KNBS statistics, governance institutions, IEBC elections and parties, people with entity resolution, budgets, debt and procurement, review dashboard, files service, intelligence layer, operations readiness, legacy retirement (see the numbered task files after 022 in this group).
- [ ] All child tasks completed or consciously dropped, each with its own acceptance checklist.
- [ ] Legacy seeds: measured (done, see audits/LEGACY_SEED_FINDINGS.md), none imported; any later candidate comes from a sourced, reviewed import.

## Progress
Legacy seed quality was measured and the seeds are not imported as they stand. The wave work itself is now tracked in the child tasks.
