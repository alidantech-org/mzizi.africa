---
{id: TSK-DDD6D63FEC2E,name: "Database: website schema migration, tag vocabulary seed and integrity checks",type: task,status: planned,priority: medium,created_at: 2026-11-02T07:26:37.193Z,updated_at: 2026-11-02T07:26:37.193Z,due_at: 2026-11-13,order: 12288}
---

# Database: website schema migration, tag vocabulary seed and integrity checks

## Goal
Create the website schema through the database package migrations, seed the site-tag classification scheme, and extend the integrity checks to the new soft links so the site registry is trustworthy.

## Context
Read .docs/docs/WEBSITE_DESIGN.md, .docs/docs/SITE_STRUCTURE_SPEC.md and .docs/decisions/website-schema-and-structure.md first. A site is not its domain: domains are dated and many per site. Work only on develop, record progress here and tick items with task check. Depends on the database package v1 task and the website contracts task. Tag vocabulary lives in reference.classifications under a site-tag scheme so it is data. Domains must allow the same hostname on different sites over time but never two overlapping primary domains for one site.

## Acceptance checklist
- [ ] Migration for the website tables, indexes and per-schema grants, passing the drift check.
- [ ] Constraint or check preventing overlapping primary domains for a site.
- [ ] Seed of site-tag classifications (kind, time, label, geo, jurisdiction, tier, licence).
- [ ] Integrity checks for publisher, folder, file-version and method ids, with tests.
