---
id: DEC-MAIN-EVIDENCE-CONTRACTS-20261112
name: Author Main evidence contracts and preserve database boundaries
type: decision
tags: [database, source, filesystem, legal, publication]
extra: {status: contract_design_authorized, decided_on: 2026-11-12, migrations: not_authorized, deployment: not_authorized}
---

# Main evidence and publication contract direction

## Decision

Contract design is authorized for Main `source`, `filesystem`, and `legal`, necessary `reference` updates, and integration review of all seven approved Operational schemas. Source owns publication identities, evidence and exact citations; Filesystem owns logical files, immutable versions, hashes and derivatives; Legal owns versioned instrument/provision wording; Operations owns acquisition through review and delivery reconciliation. Main remains the authoritative acceptance boundary. The handoff expressly names `official.entities` as the issuing organization identity, so its minimum typed dependency slice is authored to make Source/Legal relations enforceable; the six-table Official identity schema is now implemented under the later six-domain authorization.

Operations-to-Main references use explicitly named external IDs and application-side validation. No cross-database PostgreSQL foreign keys or distributed transactions are used. Main publication must atomically persist accepted records, provenance and an idempotent receipt. Same idempotency key plus same request hash returns the prior result; a changed hash conflicts.

Reference is the only domain schema allowed to mediate domain relationships to Legal. Do not use generic polymorphic target IDs. Each legal support assertion identifies an exact provision version and a controlled basis role. Exact typed domain association contracts require the target schemas to be registered and composed.

## Implementation and exclusions

At the time this decision was recorded, only the Main evidence foundation was authorized. The later [six-domain decision](DEC-MAIN-SIX-DOMAIN-CONTRACTS-20261112.md) extends the application graph and authorizes Official, Governance, Politics, Civic, Finance and analytical Accountability contracts. The database application now composes these groups with the foundation schemas. The Rust SQL pack does not faithfully enforce every constraint; generated SQL, migrations, provisioning, live data changes, seed imports, S3 mutation and deployment remain unauthorized.


## Typed Reference bridge draft

`reference.ts` defines `reference.legal_basis_links` with direct relations to exact `legal.provision_versions`, Reference basis-role values and Source citations, plus typed Geography-change and Official-entity association tables. This bridge is part of the active database authoring graph, with Governance associations targeting `reference.legal_basis_links`. The association remains subject to the recorded SQL-pack enforcement gates; it is not a live database change.
