---
id: DOC-EVENTS-INFRASTRUCTURE-SPENDING-MODEL-20261118
name: EVENTS_INFRASTRUCTURE_AND_SPENDING_MODEL
type: documentation
tags: [events, calendar, infrastructure, facilities, polling-stations, procurement, spending, analytics, classification, proposal]
extra: {status: proposal_for_owner_agreement, date: 2026-11-18, code_changes: none}
---

# Events, infrastructure and spending: one model for analytics

**Status: proposal, no code.** Owner goal (2026-11-18): world-class money and analytics. Listing data is not the point; comparison, contrast and insight are. That needs three things the system can classify and join: **events** (what happens and when), **infrastructure** (what exists, where, how big, who runs it, who uses it) and **spending** (who bought what, from whom, for whom, with what money, and whether they reported it). This document records what the schema already has (verified in `dryv/contracts/schemas`), what is missing, and the proposed model. The address and navigation consequences are in [UI_INFORMATION_ARCHITECTURE](../architecture/UI_INFORMATION_ARCHITECTURE.md).

## 1. What already exists (verified)

| Need | What exists | Where |
| --- | --- | --- |
| One identity for any geographic thing, including rivers, dams and roads | `geography.features` with a kind scheme and dated period | `geography.ts` |
| Several dated answers about a feature (nature, **function such as hospital, school, market**, reality) | `geography.classifications`: feature, scheme value, from and to year | `geography.ts` |
| External ids of a feature | `geography.identifiers` (scheme, namespace, external id) | `geography.ts` |
| Geometry, names, relationships over time, changes | `geometries`, `names`, `relationships`, `changes` | `geography.ts` |
| A figure about a place per period with sex, age group, residence, ethnicity, language | `statistics.observations` (indicator, **any feature**, period, value, estimated flag, citation) | `statistics.ts` |
| Provider, place and period of a service | `civic.services` (provider entity, responsible institution, place or coverage unit, dates) | `civic.ts` |
| Project with sponsor, implementing entity, institution, scope unit, point location, status | `civic.projects`, plus typed links to features in `civic.project_features` | `civic.ts` |
| Procurement with buyer, procedure kind, status, dates; bids; contracts with contractor and amount; deliveries | `civic.procurements`, `bids`, `contracts`, `deliveries` | `civic.ts` |
| Money trail: budget, appropriation, fund, flow, with **links to contract, project, institution, scope unit and expenditure class** | `finance.budgets`, `budget_versions`, `appropriations`, `funds`, `flows`, `debts`, `fiscal_periods` | `finance.ts` |
| Derived analytics rows (budget execution, procurement and project performance, service coverage, promises, oversight signals) | `accountability.*` | `accountability.ts` |
| Organisations and people, institutions, offices, holders | `official.entities`, `individuals`; `governance.institutions`, `offices`, `holders` | `official.ts`, `governance.ts` |
| Text and media about any subject | `filesystem.contents` (markdown by language) and `filesystem.media`, both by subject reference | `filesystem.ts` |
| Legal basis for a thing | `legal.instruments`, `provisions`, `effects` (by subject reference) | `legal.ts` |
| Evidence and verification | `source.*` (citations, artifacts, verifications) | `source.ts` |

**Not present** (searched the schemas, API contracts and seed): an events or calendar table (the only "events" are the operational `audit.events` and `politics.elections` with one date), public holidays, recurrence, rescheduling or adjournment, notifications and subscriptions, a facility or amenity concept (only a classification comment mentions hospital and school), polling stations, capacity or size of a facility, a beneficiary link on projects or procurements, a procurement category (works, goods, services), what a contractor is expected to do, reporting obligations and whether they were met, coverage ("which sources and places we have data for").

## 2. Events

### 2.1 Why one events model

Public holidays, constitutional dates, general elections, by-elections, parliamentary sittings, NG-CDF visits, office visits, deadlines and commemorations are the same thing seen at different scopes: **something that happens, planned or actual, with a legal or administrative basis, at a place or nationwide, that people may follow.** A single model gives the calendar on the home page, the election countdown, push notifications on subscribed events and the event history, with no separate tables per feature. Election key dates (registration, nominations, polling, results) become events attached to the election instead of a separate "key dates" table; this replaces the earlier proposal to add key-date rows to `politics`.

### 2.2 Tables (proposed; homed in the `activities` schema, which already holds sittings, motions and votes, so no new domain; owner to confirm)

| Table | Holds | Notes |
| --- | --- | --- |
| `events` | the series or definition: code, kind, scope, country, basis, recurrence | kind from scheme (public holiday, national day, election, election milestone, sitting, visit, deadline, commemoration, court date, other); scope: national, county, constituency, ward or a specific place (`scopeFeatureId` plus level) |
| `event_names` | name per language | same pattern as `geography.names`; keeps names out of the main row |
| `event_rules` | how dates are produced | fixed date; nth weekday of a month (second Tuesday of August); every n years from an anchor; none (one-off). Adjustment rule when the date falls on a day the law moves (a Sunday holiday observed on the Monday) |
| `occurrences` | one dated instance: planned and actual start and end, status, venue place, format, organiser entity | status: projected (from the rule), announced, confirmed, rescheduled, postponed, adjourned, cancelled, held. Planned and actual dates are separate columns so history is never overwritten |
| `occurrence_changes` | each reschedule, postponement or adjournment: from, to, reason, authority, legal basis, citation | reason from scheme (falls on a rest day, court order, emergency, declared by authority, weather, security); links to the superseded and the replacing occurrence; an adjournment continues the same occurrence |
| `event_subjects` | what the event is about, via the standard subject reference | an election, a project visit to a facility, an institution, a person, a bill; lets an election row own its milestones |
| `event_participants` | organiser, attendees, roles | entities and holders; a visit by an institution (NG-CDF, a registrar) to a place level |

Content and media attach through the existing subject mechanism: the event, occurrence or change is added to the `SubjectTable` enum so `filesystem.contents` (descriptions, explainers per language) and `filesystem.media` (photos, video) can describe it.

### 2.3 How we know (basis and knowledge status)

Every event has a **basis**: a legal provision (the Constitution fixes the general election date and term), an executive notice, a statute (a public holidays act), a published schedule or an authority announcement, held as a subject reference to `legal.provisions` or a `source.citation`. Each occurrence has a **knowledge status**: `projected` (computed from the recurrence rule, shown as "expected, not yet announced"), `announced` (an authority published a date), `confirmed` (the date is final), `held` (it happened, with actual details). The next general election appears as projected from the rule until the electoral commission announces it, and the countdown says so. The legal reason is shown beside it ("Constitution, Article 101: second Tuesday of August every fifth year", wording to be verified against the legal text in the system).

### 2.4 Calendar, countdown and notifications

- **Calendar on the home page:** a composed read `GetCalendar` with the visitor's context: national events, events for the home place and its parents, and subscribed events, for a date range.
- **Countdown:** the next occurrence of a chosen kind in the context country; shows status, basis, key dates and a link to content about it.
- **Subscriptions** (mobile): the same subject-based subscription as other push topics; an event series or a single occurrence is a subject. A change record triggers a notification ("rescheduled to Monday because the date falls on a Sunday").
- **Addresses:** `/calendar`, `/calendar/2027-08` (month), `/events/{slug}` (a series, such as `mashujaa-day`), `/events/{slug}/{year}` (an occurrence), place-scoped `/nairobi-county/calendar`.
- **Where it happens:** venue as a feature (Nyayo Stadium is a facility feature), so the event appears on the map and in the infrastructure record.

## 3. Infrastructure and amenities

### 3.1 One pattern for every kind of facility

The system already has the parts; the missing piece is naming the pattern and one small table. A facility is **not** many tables, it is:

1. **Identity:** a `geography.features` row (kind `facility`, `road`, `bridge`, ...), with geometry (point, line or polygon), names and external identifiers (national registry codes).
2. **What it is:** dated `geography.classifications` against schemes (section 3.2).
3. **How big and how well:** `statistics.observations` with the facility as the feature: beds, classrooms, enrolment, teachers, capacity, length in km, lanes, surface condition; each with period, source and estimated flag. Capacity changes over time and is evidenced, which is why it is an observation and not a column.
4. **Who runs and owns it:** a thin proposed table `civic.facilities` (one row per civic feature: facility class, operator entity, owner entity, ownership kind, operational status, opened and closed dates, responsible institution). Strongly typed handles for the common questions; everything else stays in classifications and observations.
5. **What it hosts or provides:** `civic.services` for services provided at it (a clinic service at a hospital), and dated `geography.relationships` for physical relations ("hosted at", "part of", "serves").
6. **What was spent on it:** `civic.project_features` links projects to the facility; contracts and flows reach it through the project.
7. **Specialised extension tables only where analytics need typed fields** (education: curriculum and boarding; health: facility level and services; roads: class, surface, width): add later, same key (the feature), no duplicated identity.

### 3.2 Classification, from super-high level to deep

Schemes (reference values, hierarchical through `reference.value_relations`, translated through `value_labels`), so categories are data:

- **Super classes** (scheme `civ.facility.domain`): government office, education, health, security and justice, water and sanitation, transport, energy, markets and trade, social and community, sport and recreation, electoral, environment.
- **Classes and types** below each super class (scheme `civ.facility.class`): for example under health: hospital, health centre, dispensary, clinic, laboratory; under government office: county headquarters, sub-county office, ward office, registry; under security and justice: police station, court, prison; under transport: road, bridge, airstrip, bus terminus.
- **Education levels:** use the global classification (UNESCO's ISCED: early childhood, primary, lower secondary, upper secondary, post-secondary, tertiary) as the shared level scheme, and map Kenyan terms to it through value relations. Kenyan terms to support: pre-primary (PP1, PP2), the Competency Based Curriculum (CBC) stages (Grade 1-6 primary, Grade 7-9 junior school, Grade 10-12 senior school), the legacy 8-4-4 structure (primary, secondary), TVET and universities. Level is a dated classification, so a school that moves between curricula keeps its history.
- **Health levels:** global primary, secondary, tertiary mapped to the national six-level system (community, dispensary, health centre, sub-county hospital, county referral, national referral).
- **Ownership:** public, private, faith-based, community, public-private.
- **Institution:** offices and stations by the institution that runs them (`governance.institutions`), so "police stations", "IEBC offices" and "county government offices" are one filter by institution.

Kenyan names above are from my own recollection and must be confirmed from the education and health registers and the curriculum documents before seeding. Global terms come first; national terms are added as mapped values.

### 3.3 Polling stations (reuse of a school)

A polling station has its own identity (its electoral commission code, registered voters, streams, the area of voters it serves) and is **not** the school. One school can host several polling stations, a station can move to another school between elections, and not every station is in a school. Model:

- `geography.features` row of kind `polling-station` with the commission's code as an identifier;
- a dated `geography.relationship` `hosted at` to the facility feature (a school, church hall, community centre, tent);
- registered voters per election as `statistics.observations` on the station, tied to the election by period, with the election linked through the event subject;
- the service view: `civic.services` can say the commission provides an electoral service at the school feature for the dates of the election, if useful.

Result: "this school is a polling station in 2022 and 2027", "this station moved", and "the facility hosting the largest stations" are plain queries. The same relationship pattern covers a school used as an exam centre or an emergency shelter.

### 3.4 Search and map

Facilities are searched by super class, class, level, ownership, institution, place and distance. The map offers layers per super class and class; clusters at low zoom; a facility page shows identity, classification, capacity over time, who operates it, projects and money, nearby facilities and the population around it. Composed reads: `ListFacilities` (filters and bounds), `GetFacility`, `GetFacilityCoverage`.

### 3.5 Roads

Roads are line features with: road class (international or national trunk, primary, secondary, tertiary, feeder, urban street), the authority responsible (an institution), surface and condition (classification or observation over time), length in kilometres (derived from geometry and stored as an observation for reporting), and segments for projects (a project may rehabilitate only a section). Proximity and coverage use the geometry: distance from a settlement or population cell to the nearest road class, kilometres of road per area and per population.

### 3.6 Data sources and caution

Candidate sources are national facility registers (health master facility list, education register), open map data (OpenStreetMap, which has a share-alike licence requiring attribution), national statistics geography and population grids from research programmes. Each has licence and collection rules the project's source and compliance policy must check before collection. Coverage will be uneven; see section 6.

## 4. Spending model: buyer, supplier, beneficiary, funder

### 4.1 A correction of terms

In procurement the **procuring entity (buyer)** is the organisation that runs the purchase and pays. It is **not** the thing that benefits. Mixing them makes analytics wrong. Four separate roles, each classified:

| Role | Question it answers | Existing | Add |
| --- | --- | --- | --- |
| **Buyer / procuring entity** | who ran the procurement and pays | `civic.procurements.buyerEntityId`, `governance.institutions` | classification of buyer kind (national agency, county government, constituency fund committee, school board, state corporation) |
| **Supplier / contractor** | who delivers | `civic.bids.bidderEntityId`, `civic.contracts.contractorEntityId` | **what they are expected to do**: a scheme `civ.contract.nature` (build new, rehabilitate, maintain, supply goods, deliver services, consult, supervise, empower or train) on the procurement and contract |
| **Beneficiary** | who or what benefits | project to feature links only | a generic beneficiary link (subject reference: a facility, a place, an entity, a group such as youth or women, a population segment) with a scheme `civ.benefit.kind` (infrastructure, works, equipment and supplies, services, empowerment or enterprise support, education support or bursary, environment such as tree planting, health, relief, capacity building) |
| **Funder / source of money** | where the money came from | `finance.funds`, `appropriations`, `flows` | funder classification (exchequer, a devolved fund, donor, loan) through the fund |

Also add **procurement category** (works, goods, services, consultancy, non-consulting services; the standard open-contracting vocabulary) to procurements and contracts, so classification works across countries.

### 4.2 The chain that makes spending traceable

Budget, then appropriation, then fund, then flow (money moves, with links to contract, project, institution, scope unit and expenditure class), then procurement, bid, contract, delivery, then project and the facility it concerns, then the observed result (capacity, condition, coverage). The links mostly exist already in `finance.flows` and `civic.*`. What is missing is the beneficiary link, the nature and category classifications, and the facility record.

### 4.3 Analytics this enables

- Projects per facility, spend per facility, spend per capita and per beneficiary; facilities with **no recorded** project or spend.
- Facilities per 10,000 people, by class and level; population in an age band per school of the matching level (using the age dimension in observations); population per hospital bed; people beyond a distance from a facility or road.
- Needs ranking: places with the largest gap between population and facilities, weighted by distance and by recent spending.
- Unit costs: cost per kilometre of road, per classroom, per bed, compared across places, years and suppliers.
- Supplier concentration, repeat awards and award timing, shown as **signals with their evidence**, not accusations.
- Execution: budget versus spent versus delivered, per institution and per place (`accountability.BudgetExecution` and `ProjectPerformance` are the derived homes).
- Maintenance: facilities that receive maintenance contracts versus those that only receive new works.

### 4.4 Reporting and disclosure

Track whether the expected reports exist: a table of **obligations** (who must report what, how often, to whom, under which legal basis) and a table of **reports** (the filed item with its citation or artifact, period and date), with status (due, filed on time, late, missing, found elsewhere). Applies to procuring entities (procurement plans and award notices), suppliers (contract delivery reports where required), and institutions (expenditure explanations and audit responses). Derived indicators give disclosure completeness per institution and place. Obligations come from legal provisions through `legal.effects`, so the basis is shown.

## 5. How analytics become possible (summary of the rule)

Every analytic is a join of: **place** (feature), **thing** (facility or event), **class** (scheme value), **measure** (observation with period), **money** (flow, contract, project) and **evidence** (citation). Keep each as data, not columns, and every comparison is generic across countries and years.

## 6. The honest limit: absence of a record is not absence of a thing

"No recorded project for this school" can mean there is none, or that the sources we hold do not cover it. Every analytic that says "none" must carry **coverage**: a table that states, per source or dataset, the places, years and kinds it covers and its completeness. Pages then say "no project recorded in the sources covering this period (list)" and rankings mark low-coverage places instead of ranking them as zero. Without this the analytics will mislead.

## 7. Suggested features beyond the request

1. **Coverage ledger** (section 6), shown publicly as data quality.
2. **Nearest and catchment lookups:** "closest hospital, school, police station to me", with distance and travel difficulty.
3. **Ground-truth reports in the mobile app:** residents confirm a project or facility exists, its condition and photos, with GPS proof, as reviewable proposals under the interaction model.
4. **Unit-cost benchmarks and price fairness signals** across contracts.
5. **Maintenance and stalled-project tracking:** projects past their planned end, facilities with deteriorating condition and no maintenance spend.
6. **Promise tracker tied to events:** manifesto promises linked to projects, with dates.
7. **Open data exports and an API** with licences, per country.
8. **Alerts on subscribed things:** a new tender at my county, a contract awarded to a supplier I follow, a rescheduled event.
9. **Place report card:** one page per place that scores access (facilities, roads), money received and disclosure, with comparison to similar places.
10. **"Why is this number what it is" explainers** from `filesystem.contents`, per indicator.

## 8. Questions for the owner

1. Events in the `activities` schema (recommended) or a new `calendar` schema?
2. Facilities: the thin `civic.facilities` table plus classifications and observations (recommended), or only classifications?
3. Do you accept the four-role split (buyer, supplier, beneficiary, funder), with beneficiary as a separate link and not a property of the buyer?
4. Which facility classes and which countries' registers do we collect first (health, education, police, courts, roads, polling stations)?
5. Do we model the polling station as its own feature hosted at a facility (recommended)?
6. Reporting obligations: which are the first obligations to track and which law provides them?
7. May the coverage ledger be public and drive "no data" wording?
8. Which of the suggested features in section 7 do you want in the first plan?

## 9. Owner answers (2026-11-18) and amendments

Agreed: events live in the **`activities`** schema; infrastructure uses the thin **`civic.facilities`** table plus classifications and observations; the **four-role split** (buyer, supplier, beneficiary, funder) with beneficiary as a separate link; **all nine suggested features are in the first plan** (coverage ledger, nearest-facility lookup, mobile ground-truth reports with GPS proof, unit-cost benchmarks, stalled-project and maintenance tracking, supplier concentration and repeat-award signals shown as evidence not accusations, place report card, alerts on subscribed things, open data exports and API licensed per country).

### 9.1 Scope of registration

Register every kind of public infrastructure and office we can source: health, education, police, courts, prisons, roads and bridges, markets, water, polling stations, and **public offices** such as the offices of governors, county executives, sub-county and ward administrators, constituency development fund offices, electoral commission offices, registrars and every institution's offices. Public offices are a super class (`government office`) whose classes follow the institution that runs them (`governance.institutions`), so one filter finds "all offices of institution X in place Y".

### 9.2 Polling stations belong to the election model

Polling stations are modelled with the elections, linked to places and to the facility that hosts them. Findings from the current schema (`politics.ts`): `electorates` (registered voters, ballots cast, valid and rejected ballots) and `results` (candidate votes) are already keyed by **any geographic unit** (`unitFeatureId`), so once a polling station is a feature, station-level voter counts and results need no new result tables. Proposed additions:

- **`politics.polling_stations`**: one row per station identity, extending its feature: the commission's station code, the registration centre it belongs to, streams, kind (polling station, registration centre, tallying centre), accessibility notes, opened and closed dates. The feature carries geometry, names and the `hosted at` relationship to the facility (a school, hall or tent).
- **Per election and contest, at station grain:** registered voters, ballots cast, valid, rejected and spoilt ballots in `electorates`; candidate votes in `results`, with the unit being the station.
- **Roll-up:** station, then ward or electoral area, then constituency, then county, then national, through the dated geography relationships, with a derived total per level and a **consistency check** (the sum of stations against the published total at the next level) recorded as a verification.
- **Provisional versus final results:** `results` is currently unique on candidate and unit, which cannot hold a provisional and a final figure for the same unit. The key must include the result status (or results must be versioned). This is a required change.
- **Evidence:** the result form or declaration artifact for each station is attached as a source artifact and citation, so any figure shows its original.
- **Station history:** stations move between hosts, merge, split and close between elections. Dated relationships and a station-to-station `succeeded by` relationship keep that history, so turnout comparisons across elections follow the station.

### 9.3 Reporting obligations, explained

My question was: which duties to report or publish should the system track, and under which law? Examples: a procuring entity must publish its annual procurement plan and award notices; a county government must publish its budget and quarterly expenditure; a constituency fund committee must publish allocations and project lists; a supplier may owe delivery or completion reports; an institution must respond to audit queries; the electoral commission must publish results. For each duty the system records the **obligation** (who must report what, how often, to whom, with the legal provision that creates it) and each **report** actually found (period, date, link or artifact), and derives status: filed on time, late, missing, or found elsewhere. The owner's direction is to track every obligation we can identify. Plan: start from the laws already loaded in the system (`legal.*`), extract the reporting duties each creates (as `legal.effects` of a reporting kind), and add obligations as they are sourced. The list of laws and duties is a research task, not something to decide now.

### 9.4 Coverage and the "no data" explainer (public, driving wording)

The coverage ledger is public and decides the wording. Every "no data" or "none recorded" message must say what it can mean and what the visitor can do. Required content:

- **Meaning:** "Nothing is recorded here. That can mean no project exists, or that the information was not published, or that we have not collected it yet. Missing data is not evidence that nothing happened."
- **Which sources** were checked for this place and period, and when.
- **Actions the visitor can take:** report an incorrect fact or classification; send or link official data they found (a place where the real data is published); ask their leader or the responsible office to publish or send the data (a prepared request with the right office and contact, from the institution and office records); comment with details and a link; ask us to collect it.
- The wording is a generated component driven by the coverage record, not copied text on each page; its copy is stored per language like all copy.

### 9.5 Required new data (summary)

Events (section 2), facilities and classes (section 3), polling stations (9.2), beneficiary and funder links and classifications (section 4), obligations and reports (9.3), coverage ledger (9.4), data corrections and data requests as interactions (see the interactions document), nearest-facility lookups, unit-cost benchmarks and place report cards as derived indicators.
