---
id: DOC-DATABASE-CHANGES-20261119
name: DATABASE_CHANGES_20261119
type: documentation
tags: [database, schema, postgres, dryv, review]
extra: {status: authored_and_generated_for_review, date: 2026-11-19, generated: schema.sql and engine models only}
---

# Database changes of 2026-11-19 (for review)

Authored in the Dryv contracts and generated with `bun run dryv:database:generate` (the `pgsql` app). The generated snapshot is `source/backend/database/sql/schema.sql`; the engine row models were regenerated with it. **Not generated yet:** the NestJS API modules, the SDKs and the frontend contracts. **No seed, no migration release and no database reset has been done.** The result is **139 tables in 14 schemas** (was 110 in 15 schemas), 570 indexes (160 unique), 536 foreign keys.

## Tables by schema

| Schema | Tables | New or changed this round |
| --- | --- | --- |
| activities (11) | contributions, motions, sittings, votes, **events, event_names, event_rules, occurrences, occurrence_changes, event_subjects, event_participants** | events and calendar, planned versus actual dates, reschedules and adjournments |
| auth (11) | unchanged | |
| civic (9) | bids, contracts, deliveries, procurements, project_features, projects, services, **facilities, beneficiaries** | procurements and contracts gain `category` and `nature`; facilities and beneficiaries new |
| **community (14, new)** | actors, devices, push_tokens, consents, preferences, saved_places, reactions, views, location_proofs, interactions, moderation_cases, subscriptions, notifications, notification_deliveries | device actors, consent, home and labelled places, likes, daily-hash views, mobile posts with location proof and moderation, push |
| filesystem (9) | unchanged (fun facts are `contents` rows of a new category value) | |
| finance (7) | funds gains `funding_source` | |
| geography (9) | **levels** | per-country ladders and the routing hierarchy |
| governance (8) | **obligations, reports** | reporting duties and filings |
| legal (9) | unchanged | |
| official (7) | unchanged (abbreviations are name rows of the existing abbreviation kind) | |
| politics (15) | **electoral_terms, polling_stations**; elections gain status, parent election, term, authority; contests gain vacancy reason, previous holder, seat count; electorates gain spoilt ballots and status; electorates and results unique per status | election model and polling stations |
| reference (11) | **copy**; values gain `icon_code` and `color_token`; countries gain `default_language_id`, `subdomain`, `is_served` | copy per language, display hints, country context |
| source (16) | **slugs, slug_relations, coverage** | slug registry with history and relations; coverage ledger |
| statistics (3) | **metrics** | ranking and comparison measures as data |
| ~~audit~~, ~~facts~~ | **removed** (audit.events, audit.decisions; facts.facts, facts.fact_places) | owner decision |

## Design points worth checking

- **Everything new is a normal table with code or id, foreign keys and indexes** from the same bases as existing tables; subject-carrying tables use the standard `subject_table` and `subject_id` pair, now covering **128 subject tables**. `0002_subject_integrity.sql` was rewritten by the tool (existence, enum and delete-restrict checks).
- **Polling stations** are their own table over a geography feature; voter counts and results are the existing electorates and results with the station feature as the unit; provisional and final results can both be held.
- **Events** keep planned and actual dates separate and record every change; election milestones are events attached to the election through `event_subjects`.
- **Facilities** are a thin role on a feature; capacity and size are observations on the feature; classes and levels are classification values.
- **Buyer, supplier, beneficiary, funder:** `procurements.buyer_entity_id`, `contracts.contractor_entity_id`, `beneficiaries`, `funds.funding_source_id`, plus category and nature.
- **Slugs:** parent is the parent's own slug row; uniqueness is among active rows; no title column.
- **Community tables hold no name, email or phone.** Fingerprints are hashes; location proofs keep a matched place and a coarse cell, not raw coordinates.

## Needs from the owner (seed) before the database can be used

Every classification column points at a scheme that does not exist yet in `seed/`, which is rebuilt only with the owner's approval file by file. New or still-missing schemes (all classification columns point at one): civ.benefit.kind, civ.contract.nature, civ.facility.class, civ.facility.ownership, civ.facility.status, civ.procurement.category, civ.procurement.status, com.consent.purpose, com.interaction.kind, com.moderation.decision, com.notification.kind, com.place.label, com.reaction.kind, com.subscription.kind, evt.calendar.kind, evt.change.kind, evt.change.reason, evt.event.kind, evt.occurrence.format, evt.occurrence.knowledge, evt.occurrence.status, evt.participant.role, evt.rule.adjustment, evt.rule.kind, evt.schedule.kind, evt.schedule.status, evt.season.kind, evt.subject.role, fil.content.category, fil.content.classification, fil.media.platform, fin.expenditure.class, fin.fund.source, geo.asset.kind, geo.asset.purpose, geo.hierarchy.kind, gov.agenda.kind, gov.arm, gov.bill.kind, gov.bill.status, gov.establishment.basis, gov.motion.kind, gov.motion.outcome, gov.obligation.frequency, gov.obligation.kind, gov.obligor.kind, gov.report.status, gov.sitting.kind, gov.speech.kind, gov.stage.kind, gov.term.kind, gov.vote.position, pol.election.kind, pol.election.status, pol.result.status, pol.station.kind, pol.vacancy.reason, src.coverage.level, src.coverage.subject, src.slug.namespace, src.slug.relation, sta.dimension.agegroup, sta.dimension.ethnicity, sta.dimension.residence, sta.dimension.sex, and the content category value `fun-fact` in fil.content.category.

## Consequences still open

- The NestJS API, SDKs and frontend contracts still reflect the old schema (facts and audit, no new tables). Regenerating them removes `ListFacts` and its hand-written consumers must move to fun-fact content.
- A migration release for the new schema has not been cut and the development database has not been reset.
- Typed sections (replacing `dynamic()`), the generation manifest and the routable-table subset are not part of this round.
- A fix was needed in the Dryv template server (request bodies over 1 MiB were rejected); see the plan note.

## 10. Applied after review (2026-11-19): single-word tables, `events` schema, parliament in `governance`

Owner decisions: single-word names for the tables added this round only; `activities` renamed to **`events`** and holding only things with actual dates; electoral terms move to **`governance.terms`**; parliamentary sittings are an **`events.occurrence` plus a `governance.sittings` record**; parliament and law-making live in **`governance`**. Generated again; `dryv:database:verify`, `database:check`, `subjects:check` and `tables:check` pass. **147 tables in 14 schemas** (`audit`, `facts` and `activities` are gone; `events` and `community` are new).

| Schema (tables) | Tables |
| --- | --- |
| events (11) | calendars, events, names, rules, occurrences, changes, subjects, participants, schedules, items, seasons |
| governance (17) | institutions, offices, holders, mandates, relationships, authority_scopes, **terms, sittings, bills, stages, motions, votes, hansards, speeches, agenda, obligations, reports** |
| community (14) | actors, devices, tokens, consents, preferences, places, reactions, views, proofs, posts, cases, subscriptions, notifications, deliveries |
| politics (14) | elections, contests, candidates, electorates, results, parties, memberships, coalitions, alignments, manifestos, manifesto_items, referendum_options, option_results, **stations** |
| source (16) | ..., **slugs, links, coverage** |
| civic (9) | ..., **facilities, beneficiaries** |
| others | unchanged from the table above (geography gains `levels`, reference gains `copy`, statistics gains `metrics`) |

Renames: interactions to **posts**, moderation_cases to **cases**, push_tokens to **tokens**, notification_deliveries to **deliveries**, saved_places to **places**, location_proofs to **proofs**, polling_stations to **stations**, slug_relations to **links**, electoral_terms to **governance.terms**, event_names/event_rules/event_subjects/event_participants/occurrence_changes to **names, rules, subjects, participants, changes** inside `events`; the old `activities.sittings, motions, votes, contributions` became `governance.sittings, motions, votes, speeches`. Scheme prefixes follow the schema: `evt.*` for events and `gov.*` for parliament and law-making.

Event features added: **calendars** (civil, lunar, fiscal, school; observed versus computed), **schedules and items** (an election timetable placed by offset from polling day), **seasons** (natural and human yearly windows), occurrence time zone and all-day flag. Law-making: **bills and stages** (readings, committee, assent, publication), **hansards** (the published verbatim record), **speeches** (extracted contributions with page references), **agenda** (order paper), motions tied to bills, mandates tied to terms.

## 11. Venues, iCalendar rules, polling stations as facilities (2026-11-19, applied)

**Result: 148 tables in 14 schemas**; verify, `database:check`, `subjects:check` and `tables:check` pass.

- **`events.venues`**: an occurrence can have many places (role: main venue, additional venue, area covered, broadcast point). A national election is one occurrence with a venue row per county or polling place.
- **`events.rules.rrule`**: the same recurrence as an iCalendar RRULE, so calendars export and import; the `.ics` export is an API feature still to be authored.
- **Committees** need no new tables: a committee is an institution (kind committee, parent the house); its chair and members are holders of committee offices; its meetings are sittings of that institution; a bill stage of kind committee points at the committee's sitting; its reports are motions of kind report and appear in the Hansard.
- **Polling stations are not a separate table.** The earlier `politics.stations` was removed. A polling station is:
  1. a **geographic feature** (a point, optionally with a catchment polygon as a second geometry) so it is on every map and in every geo query;
  2. a **civic facility** (`civic.facilities`) of an electoral class (polling station, registration centre, tallying centre, out-of-country station), operated by the electoral commission entity, so it is searchable with all other infrastructure;
  3. identified by the commission's code through **`geography.identifiers`** (a scheme for station codes), not a hard-coded column;
  4. **hosted at** a school, hall or tent through a dated `geography.relationships` row (kind located-on, system electoral), and **contained in** its ward, constituency and county through dated electoral-system relationships; a move, merge or split is a dated relationship and a `replaced-by` relationship;
  5. described **per election** by **`politics.polls`**: the station's operation in one election (host that day, registered voters, streams, opening and closing, status operated, relocated, merged, split, cancelled, failed);
  6. counted through the existing **`politics.electorates`** (ballots cast, valid, rejected, spoilt) and **`politics.results`** (votes per candidate) with the **station feature as the unit**, per result status (provisional, tallied, declared, final), so station totals roll up through the electoral relationships to ward, constituency, county and nation, and a consistency check against the declared totals is a verification record.
- **Maps and geolocation:** stations are points (and catchments) in `geography.geometries`; "my polling station" is a point-in-polygon or nearest-point query from a place or device position; map layers by facility class show stations, with registered voters from `polls`; a poster's location proof can be checked against a station feature; the school's page lists the elections for which it hosted stations.
- **Process links:** registration centres, nominations, polling, counting, tallying, declaration and petitions are events (occurrences with venues) attached to the election through `events.subjects` and to its timetable (`events.schedules` and `items`); result forms are source artifacts cited on the result rows.
