---
id: PLAN-NEW-MZIZI-DATABASE-BOUNDARIES
name: Database and storage ownership revisit
type: planning-proposal
tags: [database, storage, schemas, ownership]
extra: {status: discussion_only, approval: not_approved, observed_on: 2026-11-23}
---

# Database boundaries: what owns what?

## The owner's concern

The database is becoming difficult to reason about. A revisit must help us understand how tables connect, why each exists, which information is canonical and which is merely working material. The purpose is **not** to delete, combine or add schemas by default.

## Verified repository baseline

The generated `source/backend/database/sql/schema.sql` at the reviewed `develop` commit declares **165 tables in 14 PostgreSQL schemas**:

| Schema | Tables | Broad responsibility (verify table by table before change) |
| --- | ---: | --- |
| `auth` | 11 | Account identities, roles and permissions |
| `civic` | 12 | Public projects, services, facilities and procurement |
| `community` | 15 | Community participation and preferences |
| `event` | 12 | Dated events and their occurrences |
| `filesystem` | 9 | Logical files, immutable versions, media uses and tags |
| `finance` | 7 | Budgets, flows, funds and debt |
| `geography` | 9 | Feature identities, names, geometries and spatial/administrative relations |
| `governance` | 24 | Institutions, authority, offices, holders and institutional processes |
| `legal` | 9 | Legal instruments and their representations and effects |
| `official` | 7 | Individuals, entities, names and identifiers |
| `politics` | 15 | Parties, electoral contests, candidacies and results |
| `reference` | 13 | Countries, languages, values, controlled vocabularies and units |
| `source` | 18 | Publishers, discoveries, evidence, citations, artifacts and web addressing |
| `statistics` | 4 | Statistical indicators and observations |

These counts describe **authored and generated SQL**, not a verified live row count. Older documentation has 94- or 139-table snapshots; it should not be used as a current inventory without checking code.

## Existing storage decision

The approved foundation is **one main PostgreSQL database**, **MongoDB for staging/run activity**, and **S3-compatible storage for immutable bytes**:

- PostgreSQL owns accepted, validated domain records and their structured identities and evidence links; a limited set of operational/auth records also lives there.
- MongoDB carries acquisition activity, run state, working extractions and candidate/review material where implemented. It is **not** a second canonical fact store.
- S3-compatible storage holds original and derived bytes. Filesystem registers files/versions; Source describes who published or supplied evidence and how it was observed.

The engine and NestJS API connect directly to PostgreSQL with different roles. The architecture states that the engine promotes facts and the API writes its own authorized areas. The current role definition is broad enough to warrant a later permissions audit; do not infer per-schema enforcement solely from the intended boundaries.

## A single identity, different questions

Use Nairobi County only as an illustration:

| Question | Owning data |
| --- | --- |
| What geographical thing is Nairobi County? | `geography.features` |
| What are its recorded names, geometry and hierarchy? | `geography.names`, `geography.geometries`, `geography.relationships` |
| How is it addressed online? | `source.slugs` |
| Which country is associated with it? | `reference.countries` and related geographic context |
| Which government has authority there, and when? | Governance records linked to geographic scope |
| What projects or expenditure are associated with it? | Civic, Finance and Statistics, linked through geography |
| What evidence supports any assertion? | Source citations/relationships, exact file versions in Filesystem |

Do not copy Nairobi's entire identity into Governance, Finance or each UI answer. A *read model* may combine fields for speed, but it is not a competing canonical owner.

## Questions still open — no decision yet

- Do current relationships encode territory, administrative authority, electoral hierarchy and web routing distinctly enough?
- Where do multiple claims or revisions of one fact live, especially when sources disagree?
- Are Source, Filesystem and Geography completely free of duplicate ownership for data products and artifacts?
- Which fields are actually used for the hottest reads, and which indexes become write overhead?
- Which operational records should be retained in PostgreSQL under the existing single-database decision?

**Review constraint:** evaluate a concrete table and query at a time. A database split, new generalized entity table or wholesale schema normalization is not approved here.

## Inspect first

- [Current generated SQL](../../../source/backend/database/sql/schema.sql)
- [Dryv Postgres contracts](../../../dryv/contracts/schemas/postgres/)
- [Database design](../../design/data/DATABASE_ARCHITECTURE.md)
- [Original accepted storage decision](../../decisions/DEC-SINGLE-POSTGRES-MONGO-STAGING-20261115.md)
- [Ownership design and implementation notes](../../design/data/SOURCE_FILESYSTEM_GEOGRAPHY.md)
