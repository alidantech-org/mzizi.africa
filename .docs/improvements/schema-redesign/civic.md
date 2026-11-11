---
id: DOC-EXP-CIVIC-20261111
name: Civic domain expansion brief
type: documentation
tags: [system-expansion, hypothetical, schema-design, civic]
extra: {status: hypothetical, approval: not_approved, implementation: not_authorized, recorded_on: 2026-11-11}
---

# Civic — infrastructure, networks and public services

> **Status: HYPOTHETICAL DOMAIN BRIEF.** Candidate responsibilities and tables are under investigation, not approved for SQL. Read alongside [the expansion proposal](../advancement-and-system-expansion.md), [governance design](governance.md), and [geography design](geography.md).

## 1. Purpose and exploration areas

Civic describes built infrastructure and services that people use. It primarily serves Civic and Society and connects Geography and Nature, Statistics, Economy, History and Heritage.

## 2. Domain ownership

Candidate Civic ownership: infrastructure identity and function, transport/utility networks, component segments/nodes, public facilities, service delivery and construction/maintenance projects.

## 3. Exclusions

Geography owns geographic unit/place identity and canonical spatial representations. Governance owns institutions, offices, authority and office holders. Organization owns legal entities/operators. Finance and Procurement own budgets/transactions and purchasing processes. Activity owns event occurrences. Civic must not clone those records.

## 4. Existing schema and contract inventory

No Civic SQL schema exists in the active ordered migration tree. Current `dryv/contracts/domains/statistics` groups statistics and services with civic concepts. The previous 24-schema inventory included `civic.services`, `amenities`, `posts` and `deliveries`; those are a pre-rewrite historical inventory, not this target proposal. Current Governance design previously mapped public services into governance; that decision requires explicit reconciliation.

## 5. Candidate tables

| Candidate | Responsibility |
|---|---|
| `assets` | Stable identity and functional class for built infrastructure (bridges, dams, stations, plants). |
| `networks` | A connected transport, utility or communications system. |
| `segments` | Dated linear sections belonging to a network, with geometry reference and operational attributes. |
| `nodes` | Network junctions, terminals and interchanges. |
| `facilities` | Facility function such as school, clinic, library or public service point; physical site belongs to Geography. |
| `services` | Defined service offer and responsible provider, separate from a particular delivery/measurement. |
| `projects` | Construction, rehabilitation or maintenance project identity and lifecycle. |
| `project_assets` | Explicit association between projects and affected infrastructure assets. |

Each is a candidate requiring table-by-table justification. A single facility can deliver several services; a network can have many segments/nodes; one project can affect many assets.

## 6. Primary and foreign-key relationships

Prefer real FKs to Geography units/places/boundary representations, Organization entities, Governance institutions, source evidence, Finance records, Procurement contracts and Activity events. Exact target contracts and cardinalities require review. Avoid `subject_type + subject_id` without enforced target identity.

## 7. Cross-domain relationships

The [system-expansion proposal](../advancement-and-system-expansion.md#16-cross-domain-ownership-rules-to-carry-into-detailed-designs) resolves provisional ownership: a road/railway is a Civic network with segments/nodes; its geometry is a geographic representation. A dam is built infrastructure; the reservoir is a geographic water feature. One physical facility identity must not be duplicated in Civic and Geography.

## 8. Geographic responsibilities

Use a Geography place for physical location and geography units for service/mandate coverage. Linear network geometry should be versioned and tied to source/derived assets. Jurisdiction, location, operator territory and service coverage are distinct.

## 9. Temporal responsibilities

Model commissioning, closure, operation, construction, maintenance and service-delivery periods only where those dates describe Civic facts. Keep event time separate from validity and retrieval time. Network segments may be realigned while identity or route continuity is retained through explicit relationships.

## 10. Evidence and provenance

Link asset/service/project claims to source artifacts and exact versions, source locators, acquisition method, verification, uncertainty and corrections. A planned project is not evidence that construction completed or a service operates.

## 11. Acquisition categories

Potentially seeded/static: curated network or facility classifications. Seeded/pattern: expected public service locations only where a reviewed rule establishes expectation. Automated/collected: sourced asset registers and project notices. Derived: coverage and connectivity measures. Each row retains actual origin; eligibility is not provenance.

## 12. Derived data

Civic may produce network topology and service coverage inputs. Statistical owns comparable published indicators such as population served or road density. Store derived geometry/tiles in filesystem artifacts with exact versioned inputs and method.

## 13. Example queries

- Which bridges connect the road network serving a selected area as of a date?
- Which health facilities deliver a selected service, and what evidence supports their operating status?
- Which contracts and projects are linked to a railway segment?

## 14. UI/API requirements

Capabilities should expose map layers, network traversal, facility/service profiles, project timelines and evidence links through stable queries. Do not expose generic table traversal or present expected facilities as verified.

## 15. Integrity constraints to investigate

Network membership, segment endpoint validity, spatial geometry compatibility, asset identity, operator intervals, facility-to-place uniqueness, project status transitions, non-overlapping active segments where appropriate, and explicit evidence for claimed service availability.

## 16. Technical standards to evaluate

PostGIS and OGC API – Features/Tiles; GeoPackage/GeoParquet; routing graph formats/engines; infrastructure-specific vocabularies and national asset registers. Standards are exchange references, not copied schema designs.

## 17. Open questions

Should Civic be a separate schema or a domain within Governance? Should public services remain Civic or be split by education/health? Is a road identity a whole route, authority asset or network segment? How are shared facilities and multi-operator infrastructure represented?

## 18. Review and approval status

Not reviewed or approved for implementation. Review against Governance, Geography, Organization, Procurement and Finance before any DDL planning.
