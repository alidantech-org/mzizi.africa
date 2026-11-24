---
id: DOC-SCHEMA-PHASE-01-20261112
name: Schema redesign phase-01 index
type: documentation
extra: {status: scope_agreed, implementation: contracts_authored_not_generation_ready}
---

# phase-01

The Main Phase 01 contract set is authored in Dryv: Reference, Geography, Legal, Official, Governance, Politics, Civic, Finance, Source and Filesystem. The six domain contracts were implemented under the 12 November authorization; Accountability is a read-only analytical surface with no persisted tables. This authoring does not generate or apply migrations. Review the specific contract and capability notes in each schema document.

[Full catalogue and relocation inventory](../../README.md)

## Schema documents

| Schema | Scope |
|---|---|
| [reference](reference.md) | Shared definitions and classifications; the only schema that links to Legal on behalf of domain records. |
| [geography](geography.md) | Administrative and electoral units, places, dated relationships, boundary versions, spatial representations and geographic history. |
| [legal](legal.md) | Legal instruments, provisions, amendments, versions and applicability; kept separate from Reference and Governance. |
| [official](official.md) | Officially identified people and organizations, including schools and institutions; names, identifiers, profiles and contact details. |
| [governance](governance.md) | Government structures, institutional mandates, offices, officeholders, appointments, tenure and responsibility. |
| [politics](politics.md) | Parties, memberships, affiliations, elections, contests, candidates, electorates, results and representation. |
| [finance](finance.md) | Public budgets, allocations, revenue, expenditure, transfers, public funds and debt. |
| [civic](civic.md) | Public infrastructure and assets, facilities, projects and services, with responsibility, location, funding and delivery links. |
| [accountability](accountability.md) | Read-only derived performance and oversight views; no persisted tables. |
| [source](source.md) | Publishers, sources, captures, citations, attribution and provenance for claims and records. |
| [filesystem](filesystem.md) | Logical files, immutable versions, hashes, storage references and derivatives; separate from Source. |

## Shared boundaries

Domain schemas link to Reference; **Reference is the only schema that links to Legal**. Keep Legal separate. Official owns person/organization identity, while Governance owns authority, offices and tenure. Politics contains political relationships and election records in distinct tables. Accountability exposes derived analytical outputs and persists no domain entities. Civic owns procurement records; Finance remains separate, as do Source and Filesystem. Accountability has no persisted domain facts.

Where a domain record requires countrywide geographic scope, it resolves to the whole-country Geography unit; a missing unit does not mean national scope. Spatial runtime/API capability remains outside these contracts. Identity, location, authority and actual service delivery must not be conflated.

Phase 02 is not a hidden prerequisite for the pilot. Earlier language/release links to Linguistics or Statistical remain historical inputs; current candidate alternatives are explained in Geography, Official and Politics and still require detailed review. Scientific/statistical redesign does not start in this reorganization. Every meaningful accepted record retains evidence, appropriate time/place, method, uncertainty and version history.
