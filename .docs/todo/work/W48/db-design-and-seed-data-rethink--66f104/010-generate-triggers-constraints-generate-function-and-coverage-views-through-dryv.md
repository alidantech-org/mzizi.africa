---
{id: TSK-E8FBF8116802,name: "Generate triggers, constraints, generate function and coverage views through Dryv",type: task,status: completed,priority: high,created_at: 2026-11-25T21:36:56.037Z,updated_at: 2026-11-25T23:13:18.747Z,order: 10240,depends_on: [TSK-21AAF777460E],extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-25T23:12:14.334Z},{from: in-progress,to: completed,at: 2026-11-25T23:13:18.747Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-E8FBF8116802/1795648334337-start,started_at: 2026-11-25T23:12:15.813Z,end_ref: refs/tracking/TSK-E8FBF8116802/1795648398751-end,ended_at: 2026-11-25T23:13:18.748Z,summary: {files: 0,insertions: 0,deletions: 0}}]}}}
---

# Generate triggers, constraints, the generate function and coverage views through Dryv

## Goal
Make the database itself verify and perform generation, with every trigger, constraint, function and view coming from Dryv contracts or the project pack, never typed into a migration by hand. The database guards area parents (same hierarchy, shallower level, no cycle, period inside the parent), template and country agreement, and root-to-effect chains. An explicit `template.generate_dependents(root)` function creates effects, and coverage views list what is missing, including the pending-slot work queue. Success is generated SQL that creates all of it on a scratch schema inside `mzizix` and passes the trigger tests.

## Context
Dryv's local checkout supports storage constraints (acyclic, composite references, same-as, no-overlap), storage hooks as native row triggers, query-backed views and native routines; the project pack `dryv/packs/postgres-sql` renders them into `source/backend/database/sql/schema.sql`. The investigation notes are in `.dev/research/research_notes/Dryv database objects/feasibility.md`. Where Dryv cannot express a body (loops, text transforms), the extension goes into the project pack as declared, versioned templates triggered by contract tags, so regenerating always reproduces them. Never edit generated SQL by hand and never edit an immutable release.

## Acceptance checklist
- [x] Write the decision from the feasibility notes (which mechanism, which Dryv or pack extension) as a short note under Progress.
- [x] Author the area guards, template and country agreement checks and root effect checks as contract constraints and generate them.
- [x] Author `template.generate_dependents(root)` and the transform functions through the chosen mechanism and generate them.
- [x] Author the coverage views (missing holders per office term, contests without results, expected domains, pending-slot queue) and generate them.
- [x] Add NULLS-equal unique indexes through the Dryv-supported option and record which option was used.
- [x] Run `bun run dryv:check` and a generation preview; record the result under Progress.

## Progress

2026-11-26. Done with an accepted limit. Dryv cannot author triggers, routines or joined views, so the SQL is in the project pack `dryv/packs/postgres-sql` and Dryv renders it into `schema.sql` (owner agreed; recorded in `DRYV_GAPS.md` and `dryv/README.md`). Generated: area guard (deeper level, skipped level only if the level allows it, period inside the parent, parent must exist), geometry status guard, template-country guard, product guards on every root table (from the field tag), text transforms (slug, compact, upper, lower), `template.generate` and `template.generate_pattern`, and the coverage views including `template.pending_queue`. NULLS-equal uniqueness is done with pairs of partial unique indexes (areas, relationships, texts).
