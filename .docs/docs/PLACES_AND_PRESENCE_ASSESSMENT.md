---
{id: DOC-PLACES-PRESENCE-ASSESSMENT,name: Places and presence architecture assessment,type: documentation,tags: [places,governance,organisations,facilities,architecture,assessment]}
---

# Places, presence and expected placement: architecture assessment

Written 3 November 2026 from the code and the live `mzizi` database (read-only; nothing implemented). It supersedes the first draft of `DEC-PLACES-AND-OFFICE-PATTERNS` where they differ (see section 9).

## 1. Executive assessment

The current architecture cannot yet describe "what should exist, what exists, who is responsible, where it operates, where it physically sits, who occupies which space, who funds it, and how that changes". Most logical concepts already exist and should be reused. The physical layer, expected placement, scoped contacts and non-governance relationships are missing, and one existing table (`organization.locations`) mixes three meanings. The design is coherent enough to approve once the decisions in section 8 are answered.

## 2. Inventory: what exists (verified in code and data)

| Concept | Where | State |
|---|---|---|
| Legal identity | `organization.entities` (66,222 rows; types company, county-government, hospital, ministry, school, state-corporation, tertiary-institution, other-public-entity), `parentEntityId`, `ownerships` (equity), `identifiers` (11,908, including contact-email and contact-phone schemes) | Used by procurement and NG-CDF |
| Institutional identity | `governance.institutions` (194), `relationships` (79: oversees 69, has_component 10; kinds also accountable_to, appoints, delegates_to, funds, has_office) | Public bodies only, institution to institution only |
| Post | `governance.offices` (421), `holders` (424), `rules` (term, age), selection procedures and stages | Offices carry no geography scope |
| Contested seat | `electoral.seats` (empty): per election, with `geoUnitId`, `officeId`, `positions` | Election-specific, correctly not permanent |
| Facility | `civic.amenities` (empty; code, sector, jurisdiction, `geoUnitId`), `civic.services`, `civic.deliveries` (amenity, service, responsible office, budget), `civic.posts` (amenity to office) | Already the "recognised service-delivery facility" concept, but unused and unlinked to any entity or place |
| Location | `organization.locations` (1,704; all active; kind null; address text; `geoUnitId` set on 1,685) | Samples are schools, colleges and DCC offices from procurement. `geoUnitId` is the county (jurisdiction/containment), the address is free text, no coordinates |
| Geography | `geography.units`, boundaries, relationships, name versions, changes; classification `geography/place-kind/address` is an orphaned hint | Jurisdiction only, no points of interest |
| Contacts | `person.person_contacts` (people, privacy-governed), organisation contacts as identifiers hidden from the public API | No contact at place, branch or department scope |
| Provenance | `source.attributions` (152,823: target kind and id, optional field, document, locator, method, confidence, supports/contradicts/derived_from), `source.verifications` (append-only, 152,732: unverified, under_review, verified, disputed, rejected, superseded) | Soft references by `targetKind` string; to be reused by everything new |
| Funding | `finance` (budgets, budgetary units, transfers, expenditure); `governance.relationships.funds` | Money is in finance; the funds link is a hierarchy edge between institutions |
| Seeds | `ke-governance-structure.json` (100 institutions: 30 state corporations, 22 ministries, 14 commissions, 11 regulators, 8 judiciary, 5 executive, 4 independent offices, 3 legislature, 3 security) | No offices, facilities or places in it |
| Websites | `website.sites` with `subjects` linking a site to a target | Official website is already a site, not a contact field |

## 3. Conflicts and gaps

1. **`organization.locations` mixes** jurisdiction (county), containment ("located in") and address text, with no place identity. Retire it.
2. **Institution and organisation entity overlap.** A ministry exists as an institution and can also exist as an entity (entity-type ministry, county-government, school). No link states they are the same identity.
3. **`geoUnitId` has three meanings**: institution jurisdiction (94 county bodies), amenity location, and location county. Only containment of a physical place and the jurisdiction scope are legitimate, and they must be named differently.
4. **Facility is modelled but empty and floating**: no operator, owner or place.
5. **No branch or operational unit** concept; DCC offices and school-like units were forced into entities with locations.
6. **No geographic seat instance**: offices have no scope, so "MCA of ward X" is encoded in a code string.
7. **No relationships for non-governance subjects** (owned_by, operated_by, regulated_by, funded_by).
8. **No scoped contacts.**
9. **No expected placement.**
10. **My own work today conflicts with principle 14**: the new `website.domain_zones.source`/`source_note` and `website.domains.source_note` text columns duplicate provenance. See section 9.

## 4. Unified conceptual model

Ownership by domain; relationships cross schemas by plain ids (`kind` + `id`), never foreign keys.

```text
IDENTITY (who)                         POSTS (what role)               FACILITY (service site identity)
organization.entities  <--1:1--  governance.institutions   offices (+scope geo unit)    civic.amenities
 legal person            (public profile)   |  parent_office            |                 (hospital, school campus)
 parent_entity           has_component -> units (branches)             holders (people)   deliveries -> services
        |                                                                                  
        +------ relationships (owned_by, operated_by, funded_by, regulated_by, overseen_by, part_of) ------+
                         subjects: entity | institution | unit | amenity     (money amounts stay in finance)

WHERE IT SHOULD BE                      WHERE IT IS                              WHO IS WHERE
place.expectations                      place.places  (one self-referencing tree) place.occupancies
 subject, role, scope geo unit,          site > structure > floor/wing > room      subject -> place|structure|space
 facility type, min/max, basis,          kind, name, building type, point,         role, status, valid_from/to
 status, resolved_by occupancy           located-in geo unit, available_from,      links: moved_to / split / merged
                                         place status (own lifecycle)
CONTACTS (any scope, with fallback)     JURISDICTION                              PROVENANCE
contact.points: scope kind+id,          geography.units (scope of service;        source.attributions + verifications
 channel, value, visibility, validity    never a building)                        on every target above
```

Shared capabilities (new, domain-neutral): the place tree, occupancy, expectation, contact points. Everything else stays with its current owner.

### Which kinds of thing answer which question

| Question | Concept |
|---|---|
| Is it a legal person? | `organization.entities` |
| Is it a public body with a legal mandate? | `governance.institutions` linked to its entity |
| Is it a branch or regional office? | unit: an institution child via `has_component`, type regional-office or operational-unit, with a scope geo unit |
| Is it a post? | `governance.offices`; instance scope in `scope_geo_unit_id` |
| Is it a school or hospital as a service site? | `civic.amenities`; operator and owner by relationships |
| A maternity department? | a unit of the amenity's operator, occupying a space; not an amenity |
| Is it a building or room? | `place.places` |

## 5. Expected placement versus place versus occupancy

- **Expectation** says a subject should have a presence of a role within a scope. It never contains an address. It has min and max cardinality, a basis (legal rule, plan, pattern), and a status: `expected`, `researching`, `identified`, `no_details_found`, `not_applicable`, `ceased`. When identified it points to the occupancy that resolves it. Several expectations per subject (HQ, regional offices, residence).
- **Place** exists only with evidence. Its lifecycle (`planned`, `in_use`, `vacant`, `closed`, `demolished`) is independent.
- **Occupancy** says a subject uses a place, structure or space for a role during a period. Its end does not affect the place. Successors are a link table (move, split, merge), so one occupancy can have many successors.

Generated expectations are never evidence. Evidence is only an attribution to a document.

## 6. Diagrams for the eight scenarios

1. **Governor of Nairobi, unknown building**
```text
governance.offices: ke/county/047/governor  (scope: Nairobi City County)
 -> place.expectations: role official_workplace, scope Nairobi, status expected, basis pattern county-executive
 (no place row, no address, no coordinates)
```
2. **IEBC, HQ and offices**
```text
institution IEBC --has_component--> units: 47 county offices, 290 constituency offices (each: scope geo unit)
IEBC expectations: HQ x1 (national), county office per county, constituency office per constituency
IEBC HQ occupancy -> place: compound (site) > structure
```
3. **Government-funded private school**
```text
entity School X (type school)  --owned_by--> entity Trust Y        (not government)
amenity School X campus         --operated_by--> entity Trust Y
amenity                         --funded_by--> institution Ministry of Education (basis grant, amounts in finance)
amenity                         --regulated_by--> institution TSC / MoE
occupancy amenity -> place (campus site)
```
4. **County hospital**
```text
amenity Hospital --owned_by/operated_by/funded_by--> County Government (separate links, each with legal basis)
place: site > structure Block A (maternity unit space), Block B (laboratory)
units: Maternity (occupies space in Block A), Administration (occupies Block B floor 1)
contacts: reception on amenity; maternity contact on the unit
```
5. **Shared compound**
```text
place Harambee Annex (site) > structures
occupancy: Ministry A -> floors 1-3 of structure 1;  Commission B -> whole structure 2;  no ownership implied
```
6. **One institution, many buildings**: one subject, many concurrent occupancies with roles headquarters, annex, records centre.
7. **A move**: occupancy 1 `valid_to` set, place 1 unchanged; occupancy 2 starts; `moved_to` link occupancy 1 -> 2. Consolidation: several occupancies link to one successor; split: one links to several.
8. **Multi-tenant building**: structure > floor 2 > room 201 (occupancy: Agency P), room 202 (occupancy: Agency Q); contact on each room only where genuine; fallback to floor, structure, then the occupant's own contact.

## 7. Data lifecycle

```text
Catalogue/seed (institutions, units, offices, facilities)
 -> pattern expansion (offices with scope, units, expectations; deterministic ids; idempotent)
 -> research (documents attached by attribution; expectation moves to researching)
 -> identified place (only with evidence; may be partial: name and address text, no point)
 -> occupancy confirmed (attribution + verification verified)
 -> enrichment (structures, spaces, building types, contacts, coordinates)
 -> verification ledger and history (moves, closures, disputes)
```
Missing info stays null. Conflicting sources create `contradicts` attributions and a `disputed` verification, never an overwrite. A newly found exception creates a seed override that the pattern respects. A rule change versions the pattern; rows no longer justified are marked `superseded`, never deleted.

Research states map onto existing parts: expected by rule or plan = expectation basis; identified by official source / reported by secondary / corroborated / contradicted = attribution relation plus verification state; not researched / researched-no-details / confirmed closed = expectation status.

## 8. Decisions needed (with recommendation)

1. **Place tree**: one self-referencing `place.places` table with a kind, or three tables (site, structure, space)? Recommend one table: arbitrary depth, fewer joins.
2. **Institution and entity**: make the entity the legal identity and add an optional soft `entity_id` on `governance.institutions` (recommended), or keep them parallel.
3. **Cross-subject relationships**: generalise `governance.relationships` to subject kind+id (recommended, since oversees/funds/has_component already live there) or create a new relationship table in `organization`.
4. **Branches**: represent as institution children (units) via `has_component` (recommended) or as entities with `parentEntityId`.
5. **Office scope**: add `scope_geo_unit_id` and `definition_code` to `governance.offices`; reusable definitions live in pattern JSON, not tables (recommended).
6. **Facility**: reuse `civic.amenities` as the facility identity and drop its `geoUnitId` (recommended).
7. **Contacts**: a neutral `contact.points` table with scope and fallback; move organisation contact identifiers into it and keep person contacts in `person` (recommended).
8. **Pattern/seed provenance**: register each seed or pattern file as a source document (publisher "Mzizi curated research") and attribute generated rows to it with method pattern or curated.
9. **Self-correction**: drop `source_note` and `domain_zones.source` added today; keep an `origin` enum on domains only if you agree it is classification, not evidence.

## 9. Changes to what was already planned

- `DEC-PLACES-AND-OFFICE-PATTERNS` is revised: no `source` columns on new records; occupancy successor becomes a link table; expectation is its own table; place status independent from occupancy.
- The domain work from 2 November (`15c8b4e`) has the provenance-column issue in decision 9 above.

## 10. Migration and data preservation

1. Inventory: `organization.locations` (1,704), its attributions (re-pointed by target id), 94 institutions with `geoUnitId`, API entity-location endpoints and DTOs, `engine/data/dedup.py`, integrity spec.
2. Map: each location becomes a place (kind site, address text, located-in the county unit) plus an occupancy (role from the entity type: school campus, official workplace); the entity stays.
3. Institution `geoUnitId` becomes the office/unit scope, not a place.
4. Backfill expectations for institutions and offices from seeds and patterns.
5. Re-point attributions and verifications, rebuild API endpoints and contracts, update tests, then drop `organization.locations`, the amenity `geoUnitId`, and organisation contact identifiers once counts match.

## 11. Revised dependency-ordered plan

1. **Decisions** (this document, section 8).
2. **Contracts and migration for shared capabilities**: place tree, occupancy and links, expectation, contact points, attribution target kinds. Acceptance: Dryv check and drift clean; scenarios 1 to 8 expressible in tests.
3. **Governance generalisation**: relationships across subjects, office scope, institution to entity link, units. Reconciles with TSK-5C5192D034B2 (institutions and offices wave 2).
4. **Migration of existing location and contact data**; drop obsolete columns and tables.
5. **Catalogue seeds**: extend `ke-governance-structure.json` with units, offices, facilities, expectations (one contract, not a parallel catalogue).
6. **Pattern engine**: offices with scope, variable cardinality (executive committee size, nominated seats), unit patterns, expectation patterns. Reconciles with TSK-84B0D19A895B (IEBC offices) and TSK-3E3CCB7B291D (people).
7. **Research and reinforcement**: refill expectations from documents; claims and conflicts task in the content-sections group.
8. **Enrichment and validation**: structures, spaces, contacts, integrity jobs (every occupancy target exists, no place generated without attribution).

## 12. Recommendation

Approve design after decisions 1 to 9. Do not start the old five-task group as written.
