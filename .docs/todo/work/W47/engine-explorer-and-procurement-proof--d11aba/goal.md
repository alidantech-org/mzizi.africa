---
{id: GOAL-GRP-61E2E2D11ABA,name: Engine explorer and procurement proof goal,type: documentation,extra: {created_at: 2026-11-18T03:45:38.656Z,group: GRP-61E2E2D11ABA}}
---

# Engine explorer and procurement proof goal

## Goal

Make the engine's features visible and usable by people in the developer portal: runs and their outputs, file and CSV tools, a read-only database viewer and the engine's term knowledge. Prove with real public Kenyan procurement data that the engine's fetch and extraction capabilities work end to end. People who are not engineers should be able to set up and inspect a collection without reading code.

## Success criteria

- A person opens the portal, starts a collection from a form, watches it finish as a pipeline, and opens the collected CSV in a table.
- The database viewer lists tables by domain with paging, and curated data lists read as meaningful tables.
- The tenders portal collection returns all active tenders with no extraction errors and no personal contact data.

## Scope

In scope: read-only explorer endpoints, the `api.collect` capability, job history in development, the portal pages. Out of scope: loading collected tenders into `civic.*`, moving the tenders source into `seed/`, accounts and per-user permissions.
