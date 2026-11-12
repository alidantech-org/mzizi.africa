---
id: HANDOFF-MAIN-SIX-DOMAIN-CONTRACTS-20261112
name: Main six domain contract implementation handoff
type: handoff
tags: [database, dryv, main, implementation]
extra: {status: implemented_and_checked, synthetic_fixtures_only: true, migrations_authorized: false}
---

# Main six domain contracts — implementation handoff

## Current contract files

The authorized contracts are in the existing six files: [Official](../../dryv/contracts/schemas/mzizi/official.ts), [Governance](../../dryv/contracts/schemas/mzizi/governance.ts), [Politics](../../dryv/contracts/schemas/mzizi/politics.ts), [Civic](../../dryv/contracts/schemas/mzizi/civic.ts), [Finance](../../dryv/contracts/schemas/mzizi/finance.ts) and [Accountability](../../dryv/contracts/schemas/mzizi/accountability.ts). The database application composes the ten persisted Main groups and a non-storage Accountability group; the namespace mapping keeps Main separate from the seven Operations groups.

Accountability defines `budget_execution`, `procurement_performance`, `project_performance`, `service_coverage`, `institutional_performance`, `promise_progress` and `oversight_signals` as intended read-only outputs. The current Dryv app has no aggregate-query executor, so these names describe analytical products rather than callable database operations.

## Source and evidence model

Source families below are research targets, not claims that an API exists or that a publication is complete. Illustrative extraction uses manual document review or a deterministic parser for a synthetic fixture. Each candidate is checked against its exact cited document/file version, page/table/row locator and captured source. A second reviewer verifies identity joins, date/period interpretation, reported geographic level, totals and corrections. Conflicting or missing evidence remains explicit; a variance alone never establishes misconduct.

| Domain | Expected source families | Typical extraction and evidence grain | What evidence can establish; what it cannot establish alone |
|---|---|---|---|
| Official | Business Registration Service, official registries, Kenya Gazette | Registry/API or reviewed gazette; one registry entry, identifier, dated name or contact fact | Identity and the exact published fact; name similarity does not prove two identities are one |
| Governance | Constitution, legislation, Kenya Gazette, official institution sites | Legal-text parsing and manual review; instrument clause, office notice, appointment or scope statement | Published mandate/tenure/scope; an office title or website alone does not prove a holder's dates |
| Politics | IEBC, ORPP, declared results and party publications | Table extraction and review; one contest/unit count, candidate result, membership notice or manifesto item | Declared data and publication time; overlapping units must not be summed, and party history is not current membership |
| Civic | PPRA, PPIP, procurement notices, county development plans and project reports | Structured notice parsing plus document review; one tender, bid, signed contract, milestone or service provision | Published process and reported delivery; award value is not a payment or proof of completion |
| Finance | National Treasury, Controller of Budget, Auditor-General, budgets and debt publications | Document/table extraction and reconciliation; one appropriation or source-grain reported flow | Authorized/reported/paid amounts as labeled; an appropriation is not expenditure and an aggregate is not a transaction |
| Accountability | Derived from all domains, especially audit and oversight publications | Read-only joins/aggregations plus cited oversight passages; one indicator result and its inputs | Signals, gaps and sourced findings; a difference does not itself prove corruption, fraud or liability |

## Synthetic cross-domain fixture

All IDs, values, names and documents below are synthetic and are not seed data or claims about real institutions, people, elections, projects or money. Let `org:roads`, `org:health`, `org:treasury`, `person:director`, `country:xx`, `unit:national`, `unit:county-a`, `feature:road-a`, `place:clinic-a`, `project:road-a`, `tender:road-a`, `contract:road-a`, and `budget:fy-x` denote fixture keys. Citations `cite:*` refer to invented local fixture documents. A logical join connects one Official identity to Governance, Politics, Civic and Finance through UUID foreign keys; cross-schema edges remain in Main.

### Official — one row per table

| Table | Synthetic illustrative row | Query enabled |
|---|---|---|
| `official.entities` | `org:roads`, kind `public_body`, registered in `country:xx` | Find all records tied to one stable public body |
| `official.individuals` | `person:director`, birth/death dates absent | Join a reported officeholder without duplicating their name |
| `official.names` | `org:roads`, name `Roads Authority`, kind `official`, preferred | Resolve sourced names by owner and language |
| `official.identifiers` | `org:roads`, scheme `registry`, issuer `org:registry`, exact value `REG-X-1` | Locate an entity by identifier scheme/issuer/value |
| `official.contacts` | `org:roads`, kind `official_email`, visibility `public`, synthetic address | Retrieve only contact channels permitted by visibility policy |
| `official.relationships` | `org:roads` → `org:treasury`, kind `reports_to`, dated | Traverse a typed, time-bound organization relationship |

### Governance — one row per table

| Table | Synthetic illustrative row | Query enabled |
|---|---|---|
| `governance.institutions` | `institution:roads`, Official entity `org:roads`, kind `agency` | Find offices and mandates for a known entity |
| `governance.offices` | `office:director`, institution `institution:roads`, unit `unit:national` | Find the established office independent of its holder |
| `governance.holders` | `person:director` holds `office:director` for a dated interval | Reconstruct who held an office at a historical date |
| `governance.mandates` | `institution:roads`, legal-basis link `basis:roads-law`, kind `road_maintenance` | Retrieve sourced responsibilities and their legal basis |
| `governance.relationships` | `institution:roads` → `institution:treasury`, kind `reports_to` | Trace dated institutional reporting relationships |
| `governance.authority_scopes` | `institution:roads`, country `country:xx`, required unit `unit:national`, period | Identify the geographic unit over which authority is recorded |

### Politics — one row per table

| Table | Synthetic illustrative row | Query enabled |
|---|---|---|
| `politics.parties` | Official entity `org:party-a`, kind `political_party` | Resolve party identity through Official |
| `politics.memberships` | `person:director` joins `party-a` for a dated period | Query historical party membership |
| `politics.coalitions` | `coalition:change`, named synthetic coalition | Find parties aligned to a coalition |
| `politics.alignments` | `party-a` aligns with `coalition:change` for a period | Reconstruct coalition membership over time |
| `politics.elections` | `election:x`, country `country:xx`, date, citation `cite:results` | List elections and their evidence |
| `politics.contests` | `contest:director`, election `election:x`, office `office:director`, unit `unit:county-a` | Find candidates for a contest and its reporting unit |
| `politics.candidates` | `person:director`, contest `contest:director`, party-at-election `party-a` | Compare candidacies without substituting current affiliation |
| `politics.electorates` | contest/unit row with registered, cast, valid and rejected counts | Compare turnout inputs by contest and geographic unit |
| `politics.results` | candidate `person:director`, unit `unit:county-a`, reported votes/status/citation | Compare candidate totals geographically |
| `politics.manifestos` | `party-a` manifesto for `election:x`, Source document `doc:manifesto` | Retrieve a party's cited published programme |
| `politics.manifesto_items` | manifesto item `road access`, topic `reference.topic:transport` | Compare attributed promises by topic |
| `politics.referendum_options` | `yes` option in synthetic `contest:referendum-x` | Query actual ballot options independently of people/candidates |
| `politics.option_results` | `yes`, unit `unit:county-a`, reported votes and citation | Compare referendum option votes by geographic unit |

### Civic — one row per table

| Table | Synthetic illustrative row | Query enabled |
|---|---|---|
| `civic.services` | provider `org:health`, responsible institution, place `place:clinic-a`, coverage `unit:county-a`, period | Find a service by place, provider, responsible institution or coverage area |
| `civic.projects` | `project:road-a`, responsible institution `institution:roads`, unit `unit:county-a` | Track project status and responsibility |
| `civic.project_features` | project `project:road-a` links `feature:road-a`, role `rehabilitated` | Find projects affecting a geographic feature |
| `civic.procurements` | `tender:road-a`, buyer `org:roads`, project `project:road-a`, citation `cite:tender` | List public tenders by buyer/project |
| `civic.bids` | bidder `org:builder`, tender `tender:road-a`, bid outcome and currency minor units | Compare submissions and recorded outcomes |
| `civic.contracts` | `contract:road-a`, contractor `org:builder`, amount in currency minor units | Link an award/contract to a project and later reported flows |
| `civic.deliveries` | contract `contract:road-a`, milestone `section-opened`, unit `unit:county-a`, cited report | Track sourced milestone reports without asserting full completion |

### Finance — one row per table

| Table | Synthetic illustrative row | Query enabled |
|---|---|---|
| `finance.fiscal_periods` | `period:fy-x`, country `country:xx`, explicit start/end dates | Select the fiscal period covering a source transaction |
| `finance.budgets` | `budget:fy-x`, government entity, period `period:fy-x`, classification | Find budget releases for an institution and period |
| `finance.budget_versions` | version 1 original and version 2 supplementary, each separately cited | Compare original and revised authorizations without summing them |
| `finance.appropriations` | version 1 amount 100000 minor units, currency `currency:xx`, project `project:road-a` | Query authorized amounts by project, unit, classification or version |
| `finance.funds` | `fund:roads`, manager `org:treasury`, optional Reference legal basis | Trace public funds to reported flows |
| `finance.flows` | payment flow to `contract:road-a`, 25000 minor units, date, citation, period | Distinguish actual reported payment from award and appropriation |
| `finance.debts` | debt `debt:x`, borrower/lender, principal in currency minor units, maturity | Find public instruments and their terms |

### Accountability — no table rows

Accountability stores no fixture rows. A logical `project_performance` output can join `project:road-a`, its Geography feature, cited milestone, contract amount, matching Finance flows, and source versions. `budget_execution` compares each budget version with appropriately scoped flows. `service_coverage` links services to place and coverage unit. `promise_progress` can relate manifesto items to projects only when an explicit reviewed relation exists; no such relation is fabricated by this contract. `oversight_signals` can surface a sourced discrepancy with inputs and uncertainty, but does not label it misconduct.

## Known enforcement and query limits

- Dryv/SQL currently lacks faithful database CHECK generation for code-shape rules, shared numeric ranges (including percentages), exactly-one ownership in Official neutral tables, one-owner mandate/authority relationships, self-link prevention and all temporal comparisons.
- Preferred-name uniqueness needs partial unique indexes; identifier uniqueness needs exact scheme/issuer/namespace semantics and null-safe behavior. These are not inferred from ordinary lookup indexes.
- Contact visibility classification does not itself implement row/column authorization. Private values must not be exposed until access control is enforced in the serving path.
- Reference scheme membership for generic controlled values and currency scale interpretation are not enforced by the FK to `reference.values` alone. `AmountMinorUnits` stores exact integer minor units and requires currency-specific scale knowledge.
- Current app compilation does not execute aggregate queries, spatial intersections, nearby searches, or PostGIS index semantics. Accountability outputs and Geography-dependent service queries need query/runtime work.
- The repository contains no approved generic Source target registry. Contracts use typed citation FKs where the source model provides them; they do not add a polymorphic `{target_type,target_id}` bypass or invent a target registry.

Therefore Main contract generation and migrations remain gated. No generated output, database, seed or object-storage content was changed by this task.
