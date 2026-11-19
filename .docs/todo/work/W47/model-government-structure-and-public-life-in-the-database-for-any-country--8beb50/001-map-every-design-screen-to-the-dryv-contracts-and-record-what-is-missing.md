---
{id: TSK-66884B9CFE4E,name: Map every design screen to the Dryv contracts and record what is missing,type: task,status: planned,priority: medium,created_at: 2026-11-19T09:53:15.133Z,updated_at: 2026-11-19T09:53:15.133Z,order: 1024}
---

# Map every design screen to the Dryv contracts and record what is missing

## Goal

The design PDF ("Mzizi design fixes", 18 pages) shows eleven screens. Before any table is added, the owner needs one authoritative map that says, for each visible element, which authored Dryv table and column supplies it today, which new table or column must supply it, and which element is copy or presentation rather than data. This task produces that map as a design document so later tasks add only what the map proves is missing, and so nothing is modelled twice.

## Context

Citations below are to `dryv/contracts/schemas/postgres/` unless stated. The screens and what each needs:

- **Home** (hero place, glance cards, saved places vs national, largest counties, population growth, election countdown, coming up): statistics `Indicators` (statistics.ts:22-40), `Observations` (43-85, place + period + value + citation), `Metrics` (88-118, ranking measures as data); events `Occurrences` carry `statusId` and `knowledgeId` ("projected / announced / confirmed", event.ts:157-159) and `Rules` carry `month`, `weekday`, `nth_weekday`; `Schedules` carry `basisProvisionId` (event.ts:275). These are supported. Gaps: no explicit link from a country to its root geography feature (geography `Features` have no country column, geography.ts:27-42, and `Levels` only gives a feature kind at depth 0, geography.ts:279-297), so "the national figure" is resolved today only by code convention (`ke`); no composite ranking definition behind "Rankings leader".
- **Leadership tree, family tree, matrix, radial, hierarchy map, three arms**: governance `Institutions` (governance.ts:26-48, has `armId`), `Offices` (51-68, one row per office, scoped by `unitFeatureId`, with `officeKindId`), `Holders` (71-87), `Relationships` (116-134, institution to institution only). Missing: how a seat is filled; seat counts; term; who selects, approves, removes; office-to-office links; the "people" and "constitution" roots; plain-language descriptions. Covered by tasks 002 to 004.
- **Your place** (county and national government side by side, also serving your area, who handles what): geography `Relationships` with `systemId` (geography.ts:182-196) separate electoral from administrative hierarchies, which is exactly the constituency-versus-sub-county overlap the page explains; `AuthorityScopes` (governance.ts:137-158) tie an office or institution to a unit. Missing: the Fourth-Schedule-style split of functions (task 005); the point-to-place lookup must be proven against `Geometries`.
- **Institutions**: `Institutions.institutionKindId`/`armId`, `Obligations`/`Reports` (governance.ts:161-228) for "how it is held to account". Missing: institution classes for the sidebar groups; appointer, approver, overseer links; removal grounds (tasks 002, 004).

## Method options

1. A table per screen element (rejected: couples the database to one design).
2. A requirements matrix with one row per element, columns: screen, element, source table.column, status (supported, partial, missing, copy only), owning task, notes. Recommended.
3. Generate the matrix from a machine-readable contract. Defer; a reviewed document is enough now.

## Acceptance checklist

- [ ] Create `.docs/design/data/GOVERNANCE_STRUCTURE_REQUIREMENTS.md` containing the matrix for all eleven screens, citing the Dryv file and line for every "supported" row.
- [ ] Mark each row supported, partial, missing or copy-only and name the task that closes it; confirm the home-page items (election countdown, glance cards, saved-place comparison) as supported and record the two real gaps (country-to-root-feature link, composite ranking).
- [ ] List every existing vocabulary value that carries Kenya-specific meaning, with its scheme code, for task 002 to review.
- [ ] List the screen elements that are plain-language copy (summaries, "why so many boundaries") and confirm they belong in `reference.copy` keyed by code, not in structure tables.
- [ ] Show the matrix to the owner and record their decisions in `.docs/decisions/`.
- [ ] Run `task validate`.
