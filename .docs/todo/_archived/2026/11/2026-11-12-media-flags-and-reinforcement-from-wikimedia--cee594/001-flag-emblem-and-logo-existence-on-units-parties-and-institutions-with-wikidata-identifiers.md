---
{id: TSK-A6C9B9251A15,name: "Flag, emblem and logo existence on units, parties and institutions, with Wikidata identifiers",type: task,status: completed,priority: medium,created_at: 2026-11-02T20:02:42.294Z,updated_at: 2026-11-03T01:26:31.075Z,order: 1024,extra: {status_history: [{from: planned,to: completed,at: 2026-11-03T01:26:31.075Z}]},archived_at: 2026-11-12T05:47:53.215Z}
---

# Flag, emblem and logo existence on units, parties and institutions, with Wikidata identifiers

## Goal

Let the schema say whether a geography level, unit, party or institution has a flag, emblem or logo (known to have, known not to have, unknown), and carry Wikidata identifiers, all nullable.

## Context

Almost every field in the system is nullable because data is expected to be incomplete and to be reinforced later. For flags this means a three-valued marker rather than a boolean: unknown is the default and must be distinguishable from known absent, so that the refill loop knows what to search for. Geography levels need a flag expectation (counties and the country have flags; wards generally do not), units need the marker and a link to the stored file, parties and institutions need a logo marker, and units, parties and people need a Wikidata identifier. Media files are stored as raw artifacts in the file service, with licence, author, source URL and retrieval time recorded; the link between an entity and its media file records the role (flag, emblem, logo, portrait). Changes go through the Dryv contracts as additive nullable columns or a small link table, and the drift check stays clean.

## Acceptance checklist

- [x] Decide marker design (enum with unknown, has, none) and where it lives for each entity.
- [x] Add the nullable markers, expectation per geography level and Wikidata identifier fields through the contracts and a migration.
- [x] Add or reuse a media link record with role, licence, author and source URL.
- [x] Regenerate the API and keep the schema integration spec green.
- [x] Add tests for the three marker states.
