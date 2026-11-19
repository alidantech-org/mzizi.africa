---
{id: TSK-6F20FE56D2AE,name: "Prove place resolution: from a point or name to every office, body and court serving it",type: task,status: planned,priority: medium,created_at: 2026-11-19T09:53:17.657Z,updated_at: 2026-11-19T09:53:17.657Z,order: 7168}
---

# Prove place resolution: from a point or name to every office, body and court serving it

## Goal

The "your place" screens take a typed name or a location and must show the county government and national government that serve it, the ward, constituency and sub-county, and "also serving your area": the magistrates' court, the electoral commission's local coordinator, the police station command and the auditor. They must also handle ambiguity ("Kasarani" is a constituency and a ward). This task proves, at schema level, that the existing geography and authority tables can answer this for any country, and adds only what is missing, before any API read is written.

## Context

Geography (`dryv/contracts/schemas/postgres/geography.ts`): `Names` per language (46-), `Geometries` with a polygon, `from_year`, role and basis (120-), `Relationships` with `systemId` so electoral and administrative parentage are separate dated systems (182-196), `Levels` per country with `hierarchyKindId`, `depth` and `isRoutingHierarchy` (279-297). The Kenya seed has 47 counties, 290 constituencies, 1,450 wards and 305 sub-counties; levels mark electoral as the routing hierarchy and administrative as not (`seed/data/ke/geo/levels.csv`). Governance: `AuthorityScopes` give an institution or office authority over a unit (governance.ts:137-158), `Offices.unitFeatureId` scopes one seat. Civic: `civic.facilities` (civic.ts) hold physical places such as police stations and courts. Politics: `Contests` connect a seat to a unit (politics.ts:132-151).

Open questions the task must answer by reading the contracts, not guessing:

- Is a member's seat reachable from a ward by `Offices.unitFeatureId`, or must authority scopes always be used? Choose one rule for all levels.
- How is a "court that covers this place" or "constituency election coordinator" stored: an authority scope with a kind, or an office scoped to the unit? Define the authority kind vocabulary (task 002) so a court's jurisdiction and a police command area are not conflated with an elected seat.
- Geometry is a listed Dryv gap (DRYV_GAPS gap 6: geometry has no type in generated Dryv, though `schema.sql` has `geometry(geometry,4326)` columns); confirm that point-in-polygon lookup works from the generated tables and record the supported method.
- Ambiguity by name: confirm that a name search returns every feature with that name and kind, and the parent chain so the person chooses the right ward.

## Method options

A. Resolve by geometry (point in polygon at each routing level) then walk `Relationships` upward; names resolve to a feature then the same walk. Recommended.
B. Pre-compute a place-to-office lookup table. Defer; only if the query plan shows it is needed, since it duplicates facts.
C. Resolve by code prefix. Rejected: codes are identities, not geography.

## Acceptance checklist

- [ ] Write a requirements note listing each "you are in" and "serving your area" row and the table and column that supplies it, using only authored contracts.
- [ ] Decide the single rule that links a seat or body to a place (office unit, authority scope, or both) and record it in a decision.
- [ ] Define the authority kind vocabulary and confirm that jurisdiction by area (courts, police, electoral coordination, audit) is representable for two structurally different countries.
- [ ] Show with a worked example on the Kenya seed that a ward resolves up to constituency and county in the electoral system and to sub-county in the administrative system, and that the two systems are not mixed.
- [ ] Confirm the generated `schema.sql` supports a point lookup and note any Dryv gap found.
- [ ] Owner review recorded; run `task validate`.
