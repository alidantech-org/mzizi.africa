---
{id: GRP-1E8DA9A0E58E,name: "Rebuild Mzizi from contracts up: schemas, apps, database, API, web, UX",type: documentation,extra: {created_at: 2026-11-24T19:52:40.258Z}}
---

# Plan: one wave, six large ordered tasks

## Approach

The wave deliberately holds a few very large tasks instead of many small ones. Each task is one layer of the stack and carries every step for that layer as headed checklists, so progress is tracked inside one file and the order is obvious. Each task depends on the one before it and must not start until the earlier one is completed.

## Order and milestones

1. **Dryv schemas review** (`dryv/contracts/schemas`): schema by schema, table by table, connections and an ERD per schema. Milestone: the owner approves the reviewed design.
2. **Dryv app contracts** (`dryv/contracts/apps`): every API module, query, input, output and type designed in contracts, including cache rules. Milestone: contracts compile and generate.
3. **Database and migrations** (`source/backend/database`): regenerate SQL, restart the schemas from a fresh baseline migration, reload dev data, add the indexes the reads need. Milestone: fresh dev database passes checks.
4. **API work** (`source/backend/api`): regenerate, restructure modules in the defytickets style, add Redis caching, measure. Milestone: every route served from the new modules with timings recorded.
5. **Frontend design and speed** (`source/apps/web`): design the real app's screens, server-render them through the regenerated SDK, remove client fetches, meet loading-state rules. Milestone: main pages measured faster.
6. **UI/UX improvements**: usability review and fixes once the app works.

## Risks and how they are handled

- **Restarting schemas loses data:** only the dev and scratch databases are reset; seed and dev data are reloaded with the documented recipe. Production is never touched in this wave.
- **Dryv lacks a feature a design needs:** record it as a Dryv gap, keep the design in the contract, and do not hand-write around it silently.
- **Scope creep:** later layers do not start early. If a later need is found, it is written into the later task's notes.
- **Speed work changes answers:** every performance change is checked before and after on the same data, following the performance investigation plan in `.docs/_plan/the-new-mzizi/performance-investigation.md`.
