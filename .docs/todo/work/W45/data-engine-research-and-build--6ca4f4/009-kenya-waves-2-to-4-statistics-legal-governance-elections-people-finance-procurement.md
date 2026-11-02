---
{id: TSK-59EE9BF08CA7,name: "Kenya waves 2 to 4: statistics, legal, governance, elections, people, finance, procurement",type: task,status: planned,priority: medium,created_at: 2026-11-02T07:13:41.251Z,updated_at: 2026-11-02T07:13:41.251Z,due_at: 2026-12-18,order: 9216}
---

# Kenya waves 2 to 4: statistics, legal, governance, elections, people, finance, procurement

## Goal
Plan and then import the remaining Kenya domains from real documents and datasets, in the order set by the intake plan, with extraction profiles, mapping files and review queues for each.

## Context
Read .docs/docs/DATA_INTAKE_PLAN.md and .docs/decisions/data-engine-design.md first; they define the pipeline, staging model and promotion rules. Work only on develop, record progress in this file and tick items with task check. Candidates include KNBS census tables, Kenya Law and the Gazette, IEBC results, Registrar of Political Parties, National Treasury and Controller of Budget reports and the procurement portal. People data needs a privacy review before import. This task is the umbrella; split each wave into its own detailed task when its prerequisites are done.

## Acceptance checklist
- [ ] Wave 2: KNBS statistics, constitution and chosen Acts, institutions and offices.
- [ ] Wave 3: IEBC elections and parties, people with entity resolution after a privacy review.
- [ ] Wave 4: budgets, debt, procurement and organisations with currency and fiscal-year mapping.
- [ ] Legacy seeds imported as reviewed candidates per the mapping table.
- [ ] Remove from api-legacy only what MIGRATION.md accounts for.

## Compliance (added after LEGALITY_SAFETY_AND_COMPLIANCE.md)
Gate each wave on source assessments and the Kenya dossier. People, voter, beneficiary and tender-participant data are personal data: record purpose and lawful basis, apply the default exclusions, and obtain specialist review before importing person-level data. Check licences and rights holders for every document before publication, and avoid reproducing whole protected reports.
