---
{id: RULE-DATABASE-NAMING,name: Database naming,type: rule,tags: [database,naming,contracts]}
---

# Database naming

Applies to every table the Dryv contracts define. The contract audit (`dryv/tools/audit-contracts.ts`) enforces it.

## Rules

1. **Nothing lives in `public`.** Every table belongs to a domain schema.
2. **Schemas are singular**, one word where possible, no underscore, named for the domain (`geo`, `legal`, `finance`).
3. **Tables are plural**, one word where possible. Use an underscore only when two words are really needed.
4. **Never repeat the schema in the table name.** `geo.units`, not `geo.geo_units`.
5. A table name is unique within its schema; the same word may be reused across schemas (`geo.names`, `legal.changes`).
6. Columns, enums and index names are unchanged by this rule. Entity classes keep their descriptive names (`GeoUnitEntity` is `geo.units`).
7. Target kinds in the audit API are schema-qualified table names (`geo.units`).

## Map

| Schema | Domain | Tables (old name in brackets) |
| --- | --- | --- |
| `reference` | jurisdictions and vocabularies | `jurisdictions`, `classifications` (classification_records) |
| `geo` | geography | `units` (geo_units), `relationships` (geo_relationships), `boundaries` (geo_boundary_versions), `names` (geo_unit_name_versions), `changes` (geo_unit_changes) |
| `legal` | law | `instruments` (legal_instruments), `provisions` (legal_provisions), `amendments` (legal_amendments), `changes` (legal_amendment_changes), `links` (legal_authority_links) |
| `governance` | institutions and people | `institutions`, `relationships` (institution_relationships), `offices`, `rules` (office_rules), `procedures` (selection_procedures), `stages` (selection_stages), `people`, `aliases` (person_names), `holders` (office_holders) |
| `electoral` | elections | `elections`, `seats`, `candidates`, `results` (election_results), `manifestos`, `commitments` (manifesto_commitments) |
| `political` | parties | `parties`, `memberships` (party_memberships), `units` (party_units), `ideologies`, `positions` (party_positions), `alignments` (party_ideologies), `holders` (party_position_holders) |
| `calendar` | events | `events`, `links` (event_links) |
| `org` | legal entities | `entities` (legal_entities), `identifiers` (entity_identifiers), `ownerships` (entity_ownerships), `locations` (entity_locations) |
| `finance` | public finance | `years` (fiscal_years), `units` (budgetary_units), `budgets`, `transfers`, `revenues` (revenue_records), `expenditures`, `entries` (ledger_entries) |
| `debt` | borrowing | `loans`, `disbursements` (loan_disbursements), `repayments` (loan_repayments) |
| `procurement` | tenders and contracts | `tenders`, `bids`, `contracts`, `milestones` (contract_milestones), `variations` (contract_variations) |
| `statistic` | statistics | `periods`, `categories` (indicator_categories), `indicators`, `fields` (indicator_columns), `datasets` (statistics_tables), `observations` |
| `civic` | public services | `services` (public_services), `amenities`, `posts` (amenity_offices), `deliveries` (service_deliveries) |
| `audit` | comments, evidence, decisions | `comments`, `evidence` (evidence_references), `decisions` (review_decisions) |

Choices worth knowing: `electoral` and `civic` avoid the stutter of `election.elections` and `service.services`; `statistic` is singular by rule; `fields` avoids a table called `columns`.
