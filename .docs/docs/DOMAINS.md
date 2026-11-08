---
{id: DOC-D1CE78CB8902,name: DOMAINS,type: documentation}
---

# DOMAINS — What Mzizi Researches and Why

Mzizi is intentionally multi-domain because African history and present-day governance cannot be understood through one category of data.

The platform should connect these domains through shared concepts such as **place, time, people, institutions, evidence and version history**.

## 1. Heritage and culture

### Includes

- material culture;
- artifacts and museum objects;
- architecture;
- traditions and practices;
- oral traditions;
- belief systems;
- festivals and rituals;
- historical place names;
- cultural institutions;
- heritage sites;
- artistic traditions.

### Why it belongs

Culture provides the lived context behind political and historical records. Heritage also creates an accessible public entry point into deeper research.

Mzizi should behave partly as a digital heritage museum, but every object or story should be linkable to people, places, languages, periods and evidence.

## 2. Historical chronology

### Includes

- periods;
- events;
- eras;
- transitions;
- major political changes;
- wars and conflicts;
- treaties;
- independence movements;
- institutional creation and dissolution.

### Why it belongs

Chronology is what turns isolated records into history. The system must be able to explain not just what exists, but how it changed.

## 3. Geography and historical boundaries

### Includes

- present-day countries;
- regions;
- counties/provinces/states;
- constituencies and wards;
- historical administrative units;
- kingdoms and polities;
- spheres of influence;
- colonial territories;
- protectorates;
- disputed areas;
- approximate boundaries;
- historical names and aliases.

### Contracts

Neutral geography contracts live in `dryv/contracts/foundation/geography/index.ts`; see `.docs/docs/geography-model.md`.

### Why it belongs

Modern borders are not timeless. Geography must change with the timeline so the platform can represent the political reality of a historical period rather than forcing all data into today's map.

### Places, occupancy, expected presence and contact points (shared capability)

Where something physically is, who uses it, where a presence is expected to exist, and how to reach it are domain-neutral, so they live in two small schemas used by governance, civic, organization and any later domain. Contracts: `dryv/contracts/domains/place/index.ts`; design and the eight worked scenarios: `.docs/docs/PLACES_AND_PRESENCE_ASSESSMENT.md`.

| Table | Meaning |
|---|---|
| `place.places` | One self-referencing tree. `kind` (site, structure, floor, wing, room, unit, service_point), `parent_id` (null only for a site), `name`, optional building type (classification id), optional `address_text`, optional point (`latitude` and `longitude` together), the containing geography unit `located_in_unit_id` (containment, never jurisdiction), `available_from`, and the place's own `status` (planned, in_use, vacant, closed, demolished). |
| `place.occupancies` | A subject (`subject_kind` as `schema.table` plus `subject_id`) uses a place, structure or space for a role (classification id), with status (expected, active, moved, closed) and `valid_from`/`valid_to`. Ending an occupancy never changes the place. |
| `place.occupancy_links` | Predecessor to successor with kind move, split or merge. One predecessor with several links is a split, several predecessors into one successor is a merge. |
| `place.expectations` | A subject should have a presence with a role in a scope geography unit (and optionally a facility type), `min_count`/`max_count`, `basis` (legal_rule, plan, pattern) and `status` (expected, researching, identified, no_details_found, not_applicable, ceased). It never holds an address or a place; once identified it points at the resolving occupancy. |
| `contact.points` | A channel (phone, email, fax, postal, messaging) with value, visibility (public, restricted, internal) and validity, at any scope (`scope_kind`, `scope_id`). Lookup falls back from a place to its ancestors and then to the occupant (`resolveContact` in the database engine). |

Catalogue and patterns: `seed/ke/governance/ke-governance-structure.json` (version 2) is the single catalogue of public bodies with offices, cardinality, appointing authority, legal basis and expected headquarters; `seed/ke/patterns/ke-office-patterns.json` generates scoped posts, regional units and placement expectations per geography unit with deterministic codes and versions (`DEC-OFFICE-PATTERNS`, `bun src/cli.ts generate-offices`). Both are source documents of "Mzizi curated research".

Scope: every institution, office, finance unit and statistical dataset of a jurisdiction carries the jurisdiction's root geography unit when it applies to the whole jurisdiction (see `geography-model.md`, DEC-JURISDICTION-WIDE-SCOPE); the scope-gap check is in integrity and in the coverage report.

Rules: no `source` columns anywhere. Evidence is `source.attributions` and `source.verifications` on the target kinds `place.places`, `place.occupancies`, `place.occupancy_links`, `place.expectations` and `contact.points` (listed in `access-rules.generated.ts`). Subjects, scopes, geography units and classifications are plain ids; only `place.occupancies.place_id` and `place.occupancy_links.predecessor_id` are real foreign keys, both inside `place`. The database engine checks the rest (`integrity.ts`): every occupancy and contact scope target exists, the tree has no cycles or parentless non-sites, points are complete and in range, moved occupancies have a successor link, splits and merges have several links, an identified expectation is resolved by an occupancy of the same subject and role, and an expectation holds no address columns. `organization.locations` has since been retired: its 1,747 rows became places and occupancies and the organisation contact identifiers became hidden contact points (see MIGRATION.md, 3 November 2026).

## 4. Pre-colonial political systems

### Includes

- kingdoms;
- empires;
- city-states;
- federations;
- chiefdoms;
- councils;
- lineage-based political systems;
- community institutions;
- rulers and offices;
- tributary or alliance relationships.

### Why it belongs

African political history predates colonial administration. Mzizi must preserve and model indigenous political systems on their own terms and connect them to later transformations where evidence supports that connection.

## 5. Linguistics and languages

### Includes

- languages;
- language families;
- dialects;
- historical forms;
- alternate names;
- endonyms/exonyms;
- language distribution;
- language contact;
- loanwords and influence;
- official-language policy;
- writing systems where relevant.

### Why it belongs

Language can reveal contact, identity, movement and historical relationships. It also carries cultural memory and helps explain how names, identities and institutions changed.

## 6. Migration, settlement and mobility

### Includes

- migration events;
- settlement patterns;
- population movement;
- diaspora;
- displacement;
- labor migration;
- pastoral mobility;
- urbanization;
- migration hypotheses and competing interpretations.

### Why it belongs

People and languages do not remain fixed in place. Migration links geography, culture, politics, trade and demography across time.

## 7. Trade, resources and economic networks

### Includes

- trade routes;
- ports and market centers;
- commodities;
- resource regions;
- caravan networks;
- maritime networks;
- currency and exchange systems;
- trade relationships;
- economic influence.

### Why it belongs

Trade often explains political power, cultural exchange, migration and external influence. Historical economic networks also provide context for modern infrastructure and resource politics.

## 8. Colonial influence and administration

### Includes

- colonial powers;
- protectorates and colonies;
- administrative units;
- colonial offices;
- indirect/direct rule systems;
- land policies;
- labor systems;
- legal changes;
- language/education policy;
- infrastructure;
- taxation;
- resistance and collaboration;
- border creation/change.

### Why it belongs

Colonial rule transformed many institutions and boundaries that still shape present-day African states. This domain connects pre-colonial history to independence and modern governance without treating colonialism as the beginning of African history.

## 9. Independence and post-colonial state formation

### Includes

- independence negotiations;
- constitutional transitions;
- liberation movements;
- early governments;
- state reorganization;
- coups and regime changes;
- administrative reforms;
- decentralization/devolution.

### Why it belongs

The transition from colonial administration to modern states is one of the most important bridges between historical and contemporary Mzizi data.

## 10. Constitutions and law

### Includes

- constitutions;
- constitutional versions;
- chapters/articles/clauses;
- amendments;
- statutes and acts;
- regulations;
- legal authority relationships;
- court or interpretive references where relevant.

### Why it belongs

Law defines much of the formal structure of modern government. Versioning allows users to ask what legal authority existed at a particular time.

## 11. Governance structures and institutions

### Includes

- branches of government;
- ministries;
- agencies;
- commissions;
- local government structures;
- public offices;
- powers and responsibilities;
- appointments;
- institutional lineage;
- office-holder tenure.

### Why it belongs

Governance explains how formal authority is organized and exercised. It connects law to people and public actions.

## 12. Politics and political organization

### Includes

- political parties;
- coalitions;
- movements;
- ideologies;
- party structures;
- leadership;
- membership where lawfully/publicly available and justified;
- alliances;
- political transitions.

### Why it belongs

Formal government structures do not explain competition for power. Political organization explains how groups mobilize, contest authority and influence institutions.

## 13. People and historical actors

### Includes

- rulers;
- politicians;
- office holders;
- activists;
- diplomats;
- public officials;
- scholars or historical figures relevant to sourced narratives;
- aliases and names;
- roles and affiliations;
- life dates/status where appropriate.

### Why it belongs

Institutions act through people. Person records also connect otherwise separate domains such as politics, governance, heritage, conflict and diplomacy.

## 14. Elections and representation

### Includes

- elections;
- electoral systems;
- seats;
- candidates;
- parties/coalitions;
- results;
- constituencies;
- turnout;
- manifestos;
- election disputes and official outcomes.

### Why it belongs

Elections are one pathway into formal power. They connect political competition, geography, people and governance offices.

## 15. Manifestos and political commitments

### Includes

- manifesto documents;
- pledges;
- themes;
- geographic promises;
- sector promises;
- later policy/action linkage where evidence supports it.

### Why it belongs

Manifestos provide a structured bridge from political campaigning to later governance evaluation.

## 16. Public finance and budgets

### Includes

- fiscal years;
- budgets;
- budget lines;
- revenue;
- expenditure;
- transfers;
- public spending;
- government financial workflows.

### Why it belongs

Budgets show how formal political authority allocates resources. This gives material meaning to governance and policy.

## 17. Public debt

### Includes

- debt instruments;
- lenders;
- borrowing entities;
- terms;
- disbursement;
- repayment;
- guarantees;
- debt sustainability indicators;
- historical debt position.

### Why it belongs

Debt affects sovereignty, development priorities, fiscal capacity and geopolitical relationships. It belongs at the intersection of finance and geopolitics.

## 18. Procurement, tenders and contracts

### Includes

- procurement entities;
- tenders;
- bids;
- awards;
- contracts;
- vendors;
- project links;
- procurement timelines.

### Why it belongs

Procurement shows how budget decisions become contracts and real-world projects. It supports transparency and accountability.

## 19. Diplomacy, international relations and geopolitics

### Includes

- bilateral relationships;
- treaties;
- regional blocs;
- diplomatic events;
- foreign military/economic influence;
- alliances;
- sanctions;
- major infrastructure/economic agreements;
- cross-border disputes.

### Why it belongs

African political systems are influenced by regional and global relationships. Geopolitics is strongest when grounded in the platform's historical, economic and governance data rather than treated as commentary alone.

## 20. Conflict, security and political violence

### Includes

- wars;
- insurgencies;
- coups;
- political violence;
- peace agreements;
- security incidents;
- conflict actors;
- territorial effects.

### Why it belongs

Conflict can reshape borders, institutions, migration, political authority and public finance. It requires careful sourcing, temporal modeling and sensitivity to contested claims.

## 21. Statistics and development indicators

### Includes

- population;
- education;
- health;
- economic indicators;
- infrastructure;
- demographic indicators;
- regional development measures.

### Why it belongs

Statistics provide measurable context for political and historical narratives and enable comparison across place and time.

## 22. Sources, evidence and provenance

### Includes

- source records;
- publishers/authors;
- archival identifiers;
- URLs;
- retrieved files;
- hashes;
- citations;
- extraction records;
- claim evidence;
- confidence;
- review history;
- disagreements;
- superseded versions.

### Why it belongs

Without evidence, the other domains become an attractive but untrustworthy collection of claims. Provenance is therefore a cross-cutting foundation rather than merely one domain among many.

## 23. Current-world relevance

Mzizi should explicitly support links from historical material to present-day structures where evidence justifies them.

Examples:

```text
historical polity -> colonial administrative change -> modern boundary
language movement -> settlement history -> modern distribution
colonial office -> independence institution -> current government office
historical trade port -> colonial infrastructure -> modern economic hub
manifesto -> election winner -> budget/program -> procurement/project
```

The goal is not to claim simplistic causality. The goal is to make documented continuity, discontinuity and transformation explorable.

## 24. Sites, structures and source access

**Why it exists.** Evidence comes from places that move, change layout, change owners and sometimes restrict access. Mzizi must know which sites publish what, under which names over time, how to read them, and under what legal conditions, or its provenance stops at "a URL".

**Owns (schema `website`).** Known sites, their dated domains, publisher links, structure versions and files, drift and reachability checks, families, domain patterns, memberships, subjects, traits, relations, fingerprints, legal and source assessments and jurisdiction dossiers. It does not own the evidence itself (`source`, `filesystem`) or the claims extracted from it.

**Content sections.** A site structure may declare content sections (`sections.yml`): a semantic label such as publications, tenders or notices, path rules (exact or regex with named slots like year or page), expected file types and pagination hints, with each rule's origin held as provenance. Crawling follows modelled meaning, not a universal `/downloads` path. See `SITE_STRUCTURE_SPEC.md`; visit tracking per section is a recorded schema gap.

## Shared cross-domain dimensions

Every domain should reuse a small set of common concepts instead of inventing incompatible structures:

- **time** — when a claim/event/relationship is valid;
- **place** — where it applies;
- **entity identity** — stable identity plus names/aliases;
- **relationships** — typed, temporal links;
- **sources** — evidence supporting the record;
- **confidence** — certainty/quality state;
- **versioning** — what changed and when;
- **review status** — extracted, candidate, reviewed, canonical, superseded;
- **method** — manual, direct extraction, algorithmic or AI-assisted.

## Domain admission rule

A new top-level domain should be added only when:

1. it represents a durable class of knowledge rather than a single feature;
2. it connects meaningfully to existing Mzizi entities;
3. there are credible source types for it;
4. its provenance and temporal behavior can be modeled;
5. it advances Mzizi's purpose of explaining African history, heritage, geography, culture, governance or present-day political reality.


---

# Contract catalog

Each domain's API contract lives in `dryv/contracts`. Tables live in per-domain schemas with full-word names, never in `public` (`.docs/rules/database-naming.md`); the design is in `.docs/docs/DATABASE_DESIGN.md`. Domains without a row here have no contract yet and must not get one without reading this file and `AGENTS.md` section 8.

| Domain | Contract group (path under `dryv/contracts`) | Database schema | Notes |
| --- | --- | --- | --- |
| Time and jurisdiction | `foundation/shared`, `foundation/reference` | `reference` | Valid time, record time, business codes, jurisdictions and jurisdiction-scoped classification records (levels, institution types, election types, fiscal stages are records, not enums). |
| Geography | `foundation/geography` | `geography` | Units, versioned boundaries, name history, lineage, hierarchy, map context, mobile geography contract. |
| Constitutions and law | `domains/legal` | `legal` | Legal instruments, provisions with pinpoint citation, amendments, authority links used as legal basis by other domains. |
| People | `domains/person` | `person` | Real humans: individuals, names, profiles, contacts and social handles with an exposure level (`PEOPLE_DESIGN.md`). |
| Accounts | `domains/person` (group identity) | `identity` | Platform accounts and grants. Private, no endpoints. |
| Governance | `domains/governance` | `governance` | Institutions, typed relationships, offices, dated office rules, selection procedures and stages, office holders (people are in `person`). |
| Politics and elections | `domains/elections` (groups elections, political, events) | `electoral`, `political`, `calendar` | Elections, seats, candidates, results, manifestos, parties, membership, ideologies, calendar events. |
| Finance, debt, procurement | `domains/finance` (groups entities, finance, debt, procurement) | `organization`, `finance`, `debt`, `procurement` | Neutral legal identity with jurisdiction-scoped identifiers, budgets, transfers, revenue, expenditure, ledger, loans, tenders, bids, contracts. Every amount carries a currency. |
| Statistics and services | `domains/statistics` (groups statistics, services) | `statistical`, `civic` | Periods, indicators, observations; public services, amenities (boards and leaders are governance office links). |
| Files and media | `domains/filesystem` | `filesystem` | Stores, formats, folders, content-addressed objects, files, versions, variants, attachments (the one place media links from), uploads, events (`FILESYSTEM_DESIGN.md`). |
| Sources and provenance | `domains/source` | `source` | Publishers, documents, captures, methods, attributions that point at any record, verification ledger (`SOURCING_DESIGN.md`). |
| Review and discussion | `domains/audit` | `audit` | The API's only writes: comments, evidence submissions (a file reference), review decisions. |

Not yet contracted: heritage and culture, linguistics, migration and settlement, trade and resources, colonial administration, pre-colonial political systems, land, and the justice system. The inventory (`.docs/docs/audits/LEGACY_MODEL_INVENTORY.md`) lists archived justice and land models to review first.


### Governance generalisation (3 November 2026)

`governance.relationships` joins any two subjects by kind and id (`subject kind object`): institution, entity, amenity or unit, with kinds has_component, has_office, appoints, funds, oversees, accountable_to, delegates_to, owned_by, operated_by, funded_by, regulated_by, overseen_by and part_of. Institutions have an optional soft `entity_id` (the legal person) and `scope_geo_unit_id` (territory served; a whole-jurisdiction body points at the root unit, DEC-JURISDICTION-WIDE-SCOPE). Offices carry `scope_geo_unit_id` (the unit a seat represents) and `definition_code` (the reusable pattern). Branches are institution children through has_component with types regional-office and operational-unit. `civic.amenities` is the facility identity with no geography column: position is a place occupancy, operator and owner are relationships.
