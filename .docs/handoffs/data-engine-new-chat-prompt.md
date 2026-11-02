---
{id: HANDOFF-DATA-ENGINE-PROMPT,name: Prompt for the data engine planning chat,type: handoff,tags: [data-engine,prompt]}
---

# Prompt to paste into the new chat

```text
You are continuing work on the Mzizi Africa repository (working directory: the main checkout, branch develop). Your job is to RESEARCH AND PLAN the data engine, and then start building its first thin slice. Do not start by writing engine code.

Read, in this order:
1. AGENTS.md (repository contract; the hard boundaries in section 2 matter), then .docs/rules/branching-and-task-usage.md and .docs/rules/task-writing.md.
2. .docs/handoffs/data-engine-research-build-plan-handoff.md. It is your brief: what exists, what is missing, constraints, nine research questions, and the section "Start here: survey the schemas, then plan how data enters".
3. .docs/docs/DATABASE_DESIGN.md, SOURCING_DESIGN.md, FILESYSTEM_DESIGN.md, PEOPLE_DESIGN.md, DATA_LIFECYCLE.md, ARCHITECTURE.md, MIGRATION.md, and .docs/rules/database-naming.md.

Then look at what we actually have, not just the docs: start the local database (docker start postgis, create mzizi_dev, then `cd source/backend/api && DATABASE_URL=postgres://postgres@localhost:5432/mzizi_dev bun run db:reset`) and inspect the 18 schemas and 91 tables with psql, and read the contracts in dryv/contracts. The shared postgis container also holds other projects' databases: only touch mzizi_* databases.

Rules: work only on develop, no branches or worktrees, never push, do not touch .github. Every piece of work goes through the Task CLI (task list, then task show TSK-BD46EDE97821, which is the first task in the group "Data engine research and build"); update it with progress and tick its checklist with task check. Write decisions to .docs/decisions/ and run task validate after any .docs change. Use the local Dryv checkout (not the published packages) if you change contracts: see dryv/README.md.

Your first deliverables, in order:
A. Confirm with me the proposed layout source/backend/engine/{data,database} (two separate packages, files and intelligence stay siblings) before moving anything.
B. .docs/docs/DATA_INTAKE_PLAN.md: for each schema group, which real, openly licensed datasets or documents would feed it, and the full path from raw artifact to canonical row (register, preserve, extract, normalise, candidates, validate, review, promote), including exactly which rows are written in the source and filesystem schemas at each step, entity resolution, idempotent re-runs and superseding instead of overwriting, and how the legacy CSV seeds in source/backend/api-legacy map across.
C. Decision records for the research questions (languages and toolchain, where schema truth lives so generated entities and migrations cannot drift, shared contracts across TypeScript and Python, job model, staging model, promotion rules, files service boundary), each backed by a small experiment where possible (for example run a legacy extractor on a real sample; try generating a Python model from a Dryv contract).
D. Detailed Task tasks (with acceptance checklists and due dates) for the build, starting with a thin vertical slice: geography boundaries from a real open GeoJSON dataset, through to GET /v1/geography/entities/{id}/boundary.

Ask me when a decision is genuinely mine (layout, which datasets, privacy). Report anything in the handoff or schemas that looks wrong or missing instead of working around it.
```
