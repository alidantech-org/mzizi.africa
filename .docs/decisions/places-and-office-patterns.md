---
{id: DEC-PLACES-AND-OFFICE-PATTERNS,name: Decision - places and structures are physical and separate from organisations; offices come from patterns and seeds,type: decision,tags: [places,governance,organisations,patterns,seeds]}
---

# Decision: places, structures and expected offices

Date: 2 November 2026. Set by the product owner. No compatibility with the old design is needed: the migration moves the data, then drops the old tables and the incorrectly designed columns.

## Layers

- **Logical.** An organisation entity (`organization.entities`) or a governance institution is an identity defined by law or registration. It is never a building.
- **Posts.** An office is a post or seat inside an institution; a holder is a person's dated term. Seats tied to geography (MP, MCA, governor) carry the geography unit they represent. The post exists even when no holder is known.
- **Physical.** A **place** is a real site (a compound, a campus, a plot). A place contains **structures** (buildings), and a structure contains **spaces** (floor, wing, room, unit) in a tree. A place or structure is never assumed to belong to exactly one body. Many bodies may occupy a place; one body may occupy a whole place or structure; each occupancy may have its own room or floor, postal address and contacts.
- **Occupancy.** A dated link from an organisation, institution or office to a place, structure or space, with a role (headquarters, branch, service point, official residence, mailing address) and a status (expected, active, moved, closed). A move never deletes the old occupancy: it becomes `moved` and a new one starts, with a link to its successor.

## Facts on places

Name, kind (county headquarters, constituency office, school, hospital, court, market), building type when known, a point or footprint when known, address text, postal address (box, code, town), contacts, `available_from` (since when it can be used), status and source. All nullable except identity and status. Contacts of public offices are identifiers hidden from the public API where policy requires.

## Expected places

A place may be created as `expected` from a pattern or seed even when its real location is unknown. Reinforcement later adds coordinates, addresses and contacts from sources, recording each claim and its source (DEC claims rule: keep all, rank by trust).

## Offices and patterns

- An institution has many offices. A county government is the parent of the County Executive and the County Assembly; the governor and deputy governor are offices of the executive, one per county. Staff who are not public figures are counts, not offices.
- Office patterns work like site patterns: for every geography unit at a level, expect an institution type with named offices, cardinality, legal basis and selection procedure. They create `expected` rows with no holder.
- Seeds: every ministry, state corporation and SAGA, constitutional commission and independent body with public data (TSC, DCI, NTSA, KeNHA and others) gets an institution and its known offices in JSON files under `fixtures/seed`, labelled as custom-prepared from manual research, written by a coding agent or the user. Automated fetching uses them as the list of what to look for.
