---
{id: TSK-DDD6D63FEC2E,name: "Database: website schema migration, tag vocabulary seed and integrity checks",type: task,status: completed,priority: medium,created_at: 2026-11-02T07:26:37.193Z,updated_at: 2026-11-02T08:58:14.932Z,due_at: 2026-11-13,order: 12288,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T08:57:18.440Z},{from: in-progress,to: completed,at: 2026-11-02T08:58:14.932Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-DDD6D63FEC2E/1793609838441-start,started_at: 2026-11-02T08:57:18.779Z,end_ref: refs/tracking/TSK-DDD6D63FEC2E/1793609894934-end,ended_at: 2026-11-02T08:58:14.932Z,summary: {files: 4,insertions: 714,deletions: 1}}]}}}
---

# Database: website schema migration, tag vocabulary seed and integrity checks

## Goal
Create the website schema through the database package migrations, seed the site-tag classification scheme, and extend the integrity checks to the new soft links so the site registry is trustworthy.

## Context
Read .docs/docs/WEBSITE_DESIGN.md, .docs/docs/SITE_STRUCTURE_SPEC.md and .docs/decisions/website-schema-and-structure.md first. A site is not its domain: domains are dated and many per site. Work only on develop, record progress here and tick items with task check. Depends on the database package v1 task and the website contracts task. Tag vocabulary lives in reference.classifications under a site-tag scheme so it is data. Domains must allow the same hostname on different sites over time but never two overlapping primary domains for one site.

## Acceptance checklist
- [x] Migration for the website tables, indexes and per-schema grants, passing the drift check.
- [x] Constraint or check preventing overlapping primary domains for a site.
- [x] Seed of site-tag classifications (kind, time, label, geo, jurisdiction, tier, licence).
- [x] Integrity checks for publisher, folder, file-version and method ids, with tests.

## Progress
Seven family tables authored (families, domain_patterns, members, subjects, traits, relations, fingerprints) and exposed as read endpoints; 14 service methods added by hand to the project-owned service implementation. Membership and trait confidence is named `score` because the contract audit forbids a `confidence` column on data rows. Worked examples: `fixtures/neutral-model/kenya-sites.json` (four families with patterns, six sites, a legacy domain, a hostname reused by two sites over time, shared traits and a shares_module relation) with an integration test. Contract check, generated:check, API typecheck, 13999 unit tests and the neutral integration tests pass; the website schema has 14 tables, 103 in total.

## Compliance (added after LEGALITY_SAFETY_AND_COMPLIANCE.md)
The migration part of this task is already covered by the database engine's generated migrations (site, family and structure tables exist in migration 1793607856459). What remains is the site-tag classification seed and extra integrity checks; add the assessment links when the legal assessment task lands.

## Progress
Migrations come from the database engine (already applied). Added the site-tag vocabulary (62 classification records under a jurisdiction-neutral world jurisdiction) as a reference seed, and integrity rules for overlapping primary domains (a database constraint was not possible because TypeORM drops indexes it does not know), assessment links and soft ids for publisher, folder, file-version and method.
