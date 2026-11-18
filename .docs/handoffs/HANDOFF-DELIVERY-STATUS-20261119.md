---
id: HANDOFF-DELIVERY-STATUS-20261119
name: Delivery status after phase A and the first part of phase C
type: handoff
tags: [delivery, status, api, database, handoff]
extra: {status: in_progress, date: 2026-11-19, plan: backend-web-dev-delivery-plan}
---

# Delivery status (2026-11-19)

Plan: [backend-web-dev-delivery-plan](../_plan/guides/backend-web-dev-delivery-plan.md). Task group "Backend, API, web and dev delivery"; the Flutter task is blocked on the web task.

## Done and verified

| Phase | Item | State | Evidence |
| --- | --- | --- | --- |
| A | Database restarted from migrations at day one, database `mzizi_ux`, 148 tables | done | `db status` shows 2 releases; `dryv:database:verify` passes |
| A | `filesystem.contents.slug` removed; addresses are `source.slugs` rows | done | 5,922 slug rows loaded |
| A | Seed: 66 new schemes with about 500 values (proposed), Kenya geography levels, countries context columns | done, awaiting owner review | `mzizi-manifest data seed` 0 problems |
| A | Dev data for every new table that visitors do not create | done | 372,507 rows loaded: 28 events, 47 occurrences, 3,711 facilities, 1,353 polling stations and polls, 9,916 station and other results, 4 bills with stages, 188 reports, coverage rows |
| C | Hand-written reads moved off the removed schemas (`activities`, `facts`, `contents.slug`) | done | API typechecks; `/v1/motions`, `/v1/leaders/tree`, `/v1/elections`, `/v1/institutions` return data from `mzizi_ux` |
| move | `source/ui` to `source/sdk/ui` | done | web typecheck clean |

## Known breakage (expected, owned by later phases)

- `GET /v1/facts` is gone (the generated controller no longer has it); fun facts are content of the `fun-fact` category and need a composed read in the API contract (phase B). The web `fact-strip` and the Flutter facts screens call the removed operation.
- Content is addressed by subject or by the new clean slugs, not by the old `institution/iebc` style; the web content pages must change with the address map (phase E).
- The hand-written reads still return `dynamic` shaped JSON; replacing it with typed sections is phase B.

## Not started (in order)

Phase B (typed sections, composed reads, metric engine, context and slug operations, interactions), the rest of phase C (full regeneration with actions, manifest, every operation exercised), phase D (Dryv frontend capabilities in the TypeScript author), phase E (web app), phase F (dev app), phase G (Flutter, after the web app is verified).

## Honest notes

- Phases B to F are weeks of work for a person; this run reached the end of phase A and the first part of phase C and stopped at a green gate rather than starting phase B half way.
- Browser verification of web pages and device runs have not happened because no new pages exist yet.
- Community rows (actors, devices, posts) are not seeded: visitors create them at runtime.
