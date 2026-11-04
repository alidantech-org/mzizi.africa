---
{id: TSK-7C92F20B477C,name: Verify mobile data readiness against the canonical database and API,type: task,status: blocked,priority: high,created_at: 2026-11-02T21:15:41.330Z,updated_at: 2026-11-02T21:15:50.206Z,order: 1024,extra: {status_history: [{from: planned,to: blocked,at: 2026-11-02T21:15:50.206Z}]}}
---

# Verify mobile data readiness against the canonical database and API

## Goal

Establish which canonical Mzizi records can safely power public mobile screens. The mobile roadmap relies on real database contents and API responses, so each dataset must be checked before it is represented in a screen. This is a read-only audit of the real database and public API, not a seed, migration, or promotion task.

## Context

The repository handoff lists geography, governance, people, legal, NG-CDF, supplier, site and portrait records, but those counts are dated and may not reflect current state. The last session could not reach PostgreSQL because the local PostGIS container/daemon was unavailable. The API already has read routes for several domains. Keep the mobile app behind the NestJS API and use a read-only database/API role. Never query or expose staging candidates as canonical, and do not print credentials.

## Acceptance checklist

- [ ] Connect to the intended real Mzizi database using the approved read-only connection and record current counts for mobile-relevant canonical datasets.
- [ ] For representative rows, verify stable IDs, place/time links, source attribution, currency/unit where applicable, and public-safe fields.
- [ ] Exercise geography, governance, people, event, legal, finance, procurement and source API routes for pagination, filters, linked detail and empty behavior.
- [ ] Record which screen slices are ready, which need API contract changes, and which lack canonical sourced records.
- [ ] Update the mobile data display plan with verified findings and concrete follow-up dependencies.


## Progress (2026-11-03)

This task is blocked on local database access. The environment has no database connection variables or `.data` connection files, `localhost:5432` did not respond in the prior check, and the current Docker socket request returned permission denied. A Docker start attempt then found no daemon socket. No database contents were queried or changed. Resume when the PostGIS service or an approved read-only database/API connection is available.
