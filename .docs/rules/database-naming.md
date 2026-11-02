---
{id: RULE-DATABASE-NAMING,name: Database naming,type: rule,tags: [database,naming,contracts]}
---

# Database naming

Applies to every table the Dryv contracts define. The contract audit (`dryv/tools/audit-contracts.ts`) enforces it. The design behind it is in `.docs/docs/DATABASE_DESIGN.md`.

## Rules

1. **Nothing lives in `public`.** Every table belongs to a domain schema.
2. **Full words, never short forms.** `geography`, `organization`, `statistical`; not `geo`, `org`, `stat`. The audit accepts only the approved schema list below.
3. **Schemas are singular**, one word, no underscore, named for the domain.
4. **Tables are plural**, one word where possible. Use an underscore only when two words are really needed (none today). Uncountable words (`evidence`) are allowed.
5. **Never repeat the schema in the table name.** `geography.units`, not `geography.geography_units`.
6. A table name is unique within its schema; the same word may be reused across schemas (`geography.changes`, `legal.changes`).
7. **No foreign key crosses a schema.** Inside a schema tables may use real foreign keys; between schemas a record refers to another by plain id. Integrity across schemas is checked by the database engine, not the database. This keeps every schema separable into its own database.
8. **Provenance is not a column.** Data tables carry valid time, record time and version; where a record came from is in the `source` schema.
9. Columns, enums and index names are unchanged by this rule. Entity classes keep descriptive names (`GeoUnitEntity` is `geography.units`).
10. Audit target kinds are schema-qualified table names (`geography.units`).

## Map

| Schema | Domain | Tables (old name in brackets) |
| --- | --- | --- |
| `reference` | jurisdictions and vocabularies | `jurisdictions`, `classifications` (classification_records) |
| `geography` | places | `units` (geo_units), `relationships` (geo_relationships), `boundaries` (geo_boundary_versions), `names` (geo_unit_name_versions), `changes` (geo_unit_changes) |
| `legal` | law | `instruments` (legal_instruments), `provisions` (legal_provisions), `amendments` (legal_amendments), `changes` (legal_amendment_changes), `links` (legal_authority_links) |
| `person` | real humans | `individuals`, `names`, `profiles`, `contacts`, `handles` (from governance people and person_names, now richer) |
| `identity` | platform accounts | `accounts`, `grants` |
| `governance` | institutions and offices | `institutions`, `relationships` (institution_relationships), `offices`, `rules` (office_rules), `procedures` (selection_procedures), `stages` (selection_stages), `holders` (office_holders) |
| `electoral` | elections | `elections`, `seats`, `candidates`, `results` (election_results), `manifestos`, `commitments` (manifesto_commitments) |
| `political` | parties | `parties`, `memberships` (party_memberships), `units` (party_units), `ideologies`, `positions` (party_positions), `alignments` (party_ideologies), `holders` (party_position_holders) |
| `calendar` | events | `events`, `links` (event_links) |
| `organization` | legal entities | `entities` (legal_entities), `identifiers` (entity_identifiers), `ownerships` (entity_ownerships), `locations` (entity_locations) |
| `finance` | public finance | `years` (fiscal_years), `units` (budgetary_units), `budgets`, `transfers`, `revenues` (revenue_records), `expenditures`, `entries` (ledger_entries) |
| `debt` | borrowing | `loans`, `disbursements` (loan_disbursements), `repayments` (loan_repayments) |
| `procurement` | tenders and contracts | `tenders`, `bids`, `contracts`, `milestones` (contract_milestones), `variations` (contract_variations) |
| `statistical` | statistics | `periods`, `categories` (indicator_categories), `indicators`, `fields` (indicator_columns), `datasets` (statistics_tables), `observations` |
| `civic` | public services | `services` (public_services), `amenities`, `posts` (amenity_offices), `deliveries` (service_deliveries) |
| `filesystem` | files and media | `stores`, `formats`, `folders`, `objects`, `files`, `versions`, `variants`, `attachments`, `uploads`, `events` (replaces the archived files, directories and file_types) |
| `source` | where claims come from | `publishers`, `documents`, `captures`, `methods`, `attributions`, `verifications` |
| `website` | known sites and their structures | `sites`, `domains`, `site_publishers`, `structures`, `structure_versions`, `structure_files`, `checks`, `families`, `domain_patterns`, `members`, `subjects`, `traits`, `relations`, `fingerprints`, `assessments`, `dossiers` |
| `place` | physical places and presence | `places`, `occupancies`, `occupancy_links`, `expectations` |
| `contact` | contact points at any scope | `points` |
| `audit` | discussion and review | `comments`, `evidence` (evidence_references), `decisions` (review_decisions) |

Choices worth knowing: `electoral` and `civic` avoid the stutter of `election.elections` and `service.services`; `fields` avoids a table called `columns`; `organization` replaces the short `org`.
