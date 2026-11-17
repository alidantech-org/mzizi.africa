---
id: DOC-SOURCE-FILESYSTEM-GEOGRAPHY
name: Source, Filesystem and geographic asset ownership
type: documentation
---

# Source, Filesystem and geographic asset ownership

## Status, authority and scope

The owner approved the corrected target described in chat on 17 November 2026, after reviewing and correcting the earlier table proposal. This guide consolidates that agreement. It records the accepted target table responsibilities and the detailed design work needed to make contracts and migrations reviewable. It does not claim the target is implemented.

The owner now authorizes implementation through the [implementation handoff](../../handoffs/HANDOFF-IMPLEMENT-SCHEMA-OWNERSHIP.md), including contract/generator/runtime changes and affected existing seed repairs. The contracts, generated SQL, engine adapters and seed conversion for this target were implemented on 17 November 2026 and verified on a disposable PostgreSQL database; see the [implementation record](#implementation-record) at the end. Deployed state is unchanged: only local disposable databases were recreated. Live database writes and remote publication require the environment/scope checks stated in that handoff. Detailed field names below are design candidates unless explicitly identified as current columns. Nullability, keys, lifecycle, target enforcement and SQL generation must be specified before implementation. Existing versioning rules continue to apply: approved edition identity does not authorize invented version fields or version-suffixed paths.

Source and Filesystem are the immediate redesign scope. Geography is included for the agreed media and GIS associations and removal of its duplicate dataset catalogue. The owner subsequently approved the separate [nine-table Legal target](LEGAL_SCHEMA.md); retain its ownership of legal effects and coordinate affected interfaces. That target is documented, not implemented. Reference and Official retain their responsibilities, with consumer migration where this redesign requires it.

The latest owner corrections supersede earlier suggestions to move media into Source, create authority_assessments, merge domains into addresses, or retain configuration/publication tables pending relocation. None of those rejected structures belongs in the target.

## Ownership rules

| Information | Primary owner | Boundary |
|---|---|---|
| Logical file and exact immutable bytes | Filesystem | No source URL, publisher or derivation registry |
| Storage key, hash, byte size, media type, access, retention | Filesystem | Other records reference exact file versions |
| Media attached to a subject, kind, caption, description and purpose | Filesystem | Media mentions the subject; subjects do not carry media_id pointers |
| Publishers, acquisition channels, classification and credibility | Source | Officialness is a source property, never intrinsic to document bytes |
| Domains, addresses, discovery and retrieval history | Source | No parallel acquisition URL registries in domains |
| Document/dataset identities, editions and representations | Source | No separate dataset identity in Geography |
| Input/output derivation and contribution/provenance | Source | No required engine processing-event model |
| Exact supporting locations, verification, credit and rights | Source | Distinct origin, correctness, attribution and legal force |
| Geographic features, geometries and their spatial relationships | Geography | Refer to central information products or exact files |
| GIS asset association and feature/geometry purpose | Geography | Association, not a dataset catalogue or storage system |
| Controlled kinds, roles, statuses and languages | Reference | Use reviewed scheme values; do not hard-code source/classification knowledge |
| Legal bases, amendments, applicability and effects | Legal | Affected entities stay in their own domains |

Source provenance may describe a Filesystem media row or a geographic asset association. Those rows describe use/subject; Source describes origin. The two relationships must not be confused.

## Target inventories

### Filesystem: seven tables

| Table | Meaning of one row | Change |
|---|---|---|
| folders | Logical organization and folder access | Retain |
| files | Logical file, folder, name, retention and current version | Retain |
| file_versions | One exact byte representation and its verified storage metadata | Retain |
| file_extensions | Technical extension and media-type definition | Retain |
| tags | Reusable tag definition | Retain |
| taggings | One tag association to a file or folder | Retain |
| media | One classified media use mentioning its subject and exact file | Retain and redesign |

Remove `filesystem.file_relations` after its records and callers migrate into Source's input/output model. Do not recreate it under another Filesystem name or hide the same responsibility in JSON.

### Source: thirteen tables

| Table | Meaning of one row | Main relationships |
|---|---|---|
| publishers | Publishing person/organization and classification | Optional existing identity; classified using Reference |
| sources | Acquisition channel with source classification and credibility | Publisher and channel kind |
| domains | Separate host/domain identity and source association | Source; validity/history where required |
| addresses | Page, download resource or endpoint identity | Domain when resolved, request/address components |
| discoveries | Observation of an address being found | Target address, origin/context and discovery time |
| captures | One retrieval/observation and acquired content | Source/address, exact artifact and observation evidence |
| products | Logical document or dataset independent of download origin | Product kind and publishing context |
| editions | Meaningfully distinct content release/wording | Product and applicable descriptive dates |
| artifacts | Exact representation of an edition | Edition and Filesystem file version |
| relationships | Classified input/output, contribution or support connection | Validated inputs/outputs/subjects and supporting citations |
| citations | Exact location in supporting content | Artifact/file version and locator |
| verifications | Attributable assessment of a claim or relationship | Reviewed subject, outcome, explanation and review evidence |
| attributions | Credit, licence or rights statement | Relevant artifact/publisher and assessed rights context |

These are the agreed target responsibilities and working table names, not executable contracts. Do not add `authority_assessments`. Do not add a mandatory evidence-bundle layer as a prerequisite for citation or provenance.

Exclude `manifests`, `manifest_releases`, `manifest_bindings` and `publication_receipts`. Resolve their current consumers and foreign keys, then remove them from this target. Do not automatically relocate or recreate equivalents elsewhere. Any later genuine requirement receives a new design.

### Geography: eight tables

| Table | Responsibility | Change |
|---|---|---|
| features | Geographic entity identity | Retain |
| names | Geographic names, language and default/preferred behavior | Retain |
| classifications | Geographic classification assignments | Retain |
| identifiers | Geographic identifiers and namespaces | Retain |
| geometries | Spatial representations and their required coordinate interpretation | Retain; review legacy external-file reference |
| relationships | Geographic relationships between features | Retain |
| changes | Geographic transformations and historical changes | Retain |
| assets | Classified spatial-data-file association to a feature or geometry | Add |

Remove `geography.datasets` after migrating identity and incoming references into Source products/editions/artifacts. Do not create `dataset_profiles` or another Geography dataset catalogue.

Reference keeps its current countries, schemes, values, value_labels, languages, language_names, units, topics, patterns and value_relations. Official retains identities, names, identifiers, contacts and identity relationships; its media pointers must be migrated. Legal retains its current implementation until its approved [nine-table target](LEGAL_SCHEMA.md) is implemented; preserve and rewire evidence references rather than silently changing legal semantics.

## Filesystem details

### Exact files and versions

Keep `file_versions` authoritative for file_id, the existing revision, object key, SHA-256, byte size, media type, extension reference, original filename, access, pinning and storage verification. A later version of one logical file differs from an artifact derived from another file. File membership and current-version selection remain here; derivation moves to Source.

Equal hashes identify equal bytes, not equal products, source credibility or legal force. Multiple observations may reference the same bytes. Existing files may have distinct logical identities despite identical bytes; deduplication must respect access/retention and existing identity rather than blindly merging them.

Inspect `file_versions.provenance` before migration. Retain necessary creation/verification audit but move acquisition and derivation information into Source relationships/captures. Preserve original evidence; do not silently discard processing metadata because engine events are not required in the new model.

### Media becomes a subject association

The owner explicitly rejected the entity-to-media pointer pattern. `filesystem.media` mentions a subject and exact file; the subject does not require a media_id column. One subject may have many photographs, avatars, logos, symbols, marks, recordings, project evidence images or videos. Kinds are Reference values, not a closed list embedded in generic code.

Candidate fields:

| Field | Meaning |
|---|---|
| file_version_id | Exact stored media bytes |
| subject_table | Required shared SubjectTable enum identifying the subject table |
| subject_id | Required UUID from the shared SubjectReference base |
| kind_id | Reference media kind |
| title | Human-readable title |
| description | Natural description of the media |
| purpose | Free-text explanation of its relationship/use |
| alt_text | Accessible description |
| position | Optional display ordering |

The agreed subject-pointer shape is generic; it is not automatically a SQL foreign key. The detailed contract must specify a registered set of target tables, typed IDs, existence checks, authorization and handling of subject deletion. A table-qualified business code may support seed/import resolution; it must resolve to the same target, not create an independent identity system. Final naming, requiredness and seed aliases remain to be specified.

One row represents a media association/use. To mention several subjects, several rows may share a file version. Bytes are not duplicated. Description/purpose may differ by subject. Do not add a uniqueness rule that wrongly allows only one item of each kind per subject. Ordering does not imply a unique default unless separately specified.

Remove `source_url`. Source can retain discovery and provenance before storage. If the existing workflow allows a media record before file registration, specify a pending association policy without putting a URL back into media. Whether the final file reference can be absent during preparation is a field-level decision still to settle.

## Source details

### Publishers and sources are distinct

A publisher is responsible for publishing information. A source is the channel/origin used to acquire it. A publisher can have several channels. An Official entity association identifies a real organization; it must not be interpreted as a credibility score or blanket officialness assertion.

Sources carry their classification and credibility directly. Publishers also use Reference classification values. Keep channel kind separate from authority/research/community classification and from credibility. A dataset is a product, not a source channel. Unassessed credibility must not be coerced into unreliable or unofficial.

The separate `authority_assessments` table is rejected. The detailed source contract must decide whether single value links or multiple classification assignments are needed, how supporting notes and correction history are preserved, and how classifications are scoped without recreating the rejected assessment subsystem. No document-level is_official flag.

### Domains remain separate

`domains` remains a first-class table. `addresses` replaces `paths`; do not merge the domain inventory into a universal address table. Addresses represent pages, downloadable resources and API endpoints with appropriate domain association, path/query, method and other identity components.

Do not assume a domain is a publisher, or that everything hosted on a domain has one authority. Review shared hosts, domain moves and source/domain association cardinality against real sources. Existing global host uniqueness and single-source ownership must be assessed explicitly before carrying them forward.

Discovery can encounter an external target before its Source/domain association is accepted. Preserve the raw observed address and resolve it later; do not invent an approved source merely to store a link. Request identity must distinguish meaningful method/query differences. Fragment identifiers may identify in-document locations even though they are not sent to the server. Credentials are not public provenance.

### Discoveries and captures

A discovery records where/when an address was found, including anchor/context where relevant. A capture records retrieval/observation, requested and final URLs, time, response and resulting content. Several discoveries may lead to one address, and several captures may observe it over time. Do not overwrite an old capture with the latest download.

Normalize address identities only under explicit rules; preserve original and redirected URL observations as evidence. Source is the only acquisition-address owner, although the same observed URL may appear on different Source observations with different meanings.

Crawler `LinkRecord`, links.csv and activity site_links are current acquisition inputs, not a competing canonical source registry. The implementation must define admission/deduplication and migration to discoveries without pretending operational records do not exist. Preserve failure observations or operational references as appropriate; do not falsely associate failed captures with acquired bytes.

### Products, editions and artifacts

A product is one logical document/dataset. An edition represents meaningful content differences. An artifact is an exact representation linked to a Filesystem version. Different formats/scans need not create different products; genuinely changed wording must remain distinguishable. Changing storage metadata is not a new content edition.

One product can have many editions; one edition can have several representations. Repeated captures can refer to the same exact representation. A file can be associated with more than one product only where the semantic association is justified; identical hashes alone cannot determine all product membership.

Current hash-unique `documents` cannot simply be renamed to products. Migration needs explicit product resolution and ambiguity handling. Hash equality establishes byte equality; a title match does not establish the same work. Preserve attribution when identical content arrives from another publisher/channel.

Edition identity does not mean engine run identity. Model-assisted matches are proposals for review. Preserve meaningful language, publication/observation dates, disagreement and correction history; legal effect is still Legal-owned.

Media descriptions stay in Filesystem, not these products merely because the bytes are an image. A published photographic work or report may have a legitimate product identity, but do not require duplicate Source product records for every media association.

### Relationships replace fragmented lineage

`relationships` consolidates derivation and record provenance currently split across file_relations, dataset_lineage and provenance. It records valid typed endpoints and a meaningful kind: extracted from, prepared from, built from, translated from, supports and other reviewed relations. Kinds live in Reference schemes or an explicitly justified technical enum; exact vocabulary is not approved seed data yet.

Fix a documented direction convention. For example: output --prepared from--> input. A prepared result has one relationship per contributing input; one input can contribute to several outputs. Do not require a single source_id on the result. Preserve exact editions/artifacts/file versions for byte-dependent derivation; do not point at a mutable current file and claim reproducibility.

Endpoints may be Source identities, captures, exact files or registered domain records, as justified by relationship kind. The detailed contract must define an allowed endpoint matrix and enforce type/existence/integrity, avoiding an unchecked table/id catch-all. Column-level provenance, CSV line and finer locators must survive through exact citations or reviewed scope fields.

Engine event/run records, execution parameters, processor, actor and execution time are not mandatory lineage structure. Optional external execution IDs are loose references only. Preparation outside Mzizi or by a human must be representable. Existing execution evidence can be retained without making every relationship a processing event.

Cycle rules depend on meaning: derivation must not derive an artifact from itself or create cycles; support/relatedness cannot blindly inherit all derivation constraints. Preserve useful ancestry/derivative queries. Filesystem packages must not import Source persistence; engine composition wires registration and provenance as separate responsibilities.

### Citations, verifications and attributions

A citation identifies an exact supporting artifact and locator (page/paragraph, CSV line/column, JSON path, region or timestamp). It is not merely a URL. Citations attach supporting locations to relationships or reviewed subjects without requiring a separate evidence-bundle row. Reconcile old evidence IDs and every Legal/Official consumer before removing the old mandatory bundle layer.

A verification records assessment, explanation, reviewer and uncertainty for a claim/relationship. It does not classify a whole source as official, and cannot silently promote extracted content into canonical truth. Preserve contradictory assessments and supersession/history as required.

An attribution records credit and rights in its artifact/publisher context. Equal bytes obtained from several places do not authorize overwriting licence assertions or erasing conflicting rights evidence. File access and source authority are separate concerns.

## Geography assets and media are different associations

A photograph of a county belongs in media mentioning the feature. A GeoTIFF elevation surface, vector boundary, raster mosaic or GeoPackage layer belongs in a geographic asset association. A preview image can have a media use while the underlying spatial data has a GIS use. Do not force every image into the same role because both have image media types.

Candidate `geography.assets` fields:

| Field | Meaning |
|---|---|
| feature_id | Required, NOT NULL foreign key to geography.features(id); every asset belongs to a feature |
| geometry_id | Optional, nullable foreign key to geography.geometries(id); when set it must belong to feature_id |
| file_version_id | Exact immutable GIS file |
| kind_id | Reference classification of spatial data/asset |
| purpose_id | Reference classification of its use for this target |
| description | Natural explanation |
| subresource selector | Typed layer, band or member identification where needed |

The table links existing identities; it is not a dataset catalogue. The owner requires two separate columns: feature_id is mandatory and geometry_id is optional. A feature-only asset leaves geometry_id NULL; a geometry-specific asset supplies both. Do not use an exactly-one-target constraint. Enforce feature_id -> geography.features(id) as a foreign key. Enforce the optional geometry association with a composite foreign key (geometry_id, feature_id) -> geography.geometries(id, feature_id), backed by an explicit unique key on geometries(id, feature_id). PostgreSQL MATCH SIMPLE allows a NULL geometry_id while the separate feature FK still validates the required feature. A non-null geometry must match that feature. Ordinary independent FKs alone do not enforce this ownership condition. Verify this composite relationship and referenced key survive Dryv generation before implementation; do not silently fall back to an untyped UUID. file_version_id also references filesystem.file_versions(id). Specify history-preserving delete/update behavior before implementation. One file may relate to many targets, and one target to many files. Avoid uniqueness by file alone. Source provenance describes the asset row or underlying data acquisition/derivation without another URL field.

A GeoPackage file can contain several layers; a TIFF can contain bands; an archive can contain multiple members. Exact selector shape and supported formats require contract review. An ambiguous free-text selector must not be claimed executable. CRS, coordinate resolution and coverage belong at the appropriate representation/asset interpretation scope; do not create geography.dataset_profiles to house them. Geometry coordinates and their SRID remain in geometries. Define where file/layer-specific interpretation metadata is authoritative before implementation.

Established patterns support the distinction: the OGC GeoPackage Related Tables Extension associates geographic records and multimedia with mapping relationships; STAC describes spatial assets with roles and related/sidecar files. These inform Mzizi's design; they do not require copying their database layout or putting source URLs outside Source.

- [OGC GeoPackage Related Tables Extension](https://www.geopackage.org/spec/related-tables/)
- [OGC STAC Community Standard](https://docs.ogc.org/cs/25-004/25-004.html)

## Worked examples

### Constitution from several places

1. Create/resolve one Constitution product and its particular wording edition.
2. Preserve captures from source A and source B, each with its original/final URLs and time.
3. If their PDFs have identical bytes, reuse byte identity where safe and retain both acquisitions. If files differ, preserve distinct artifacts without automatically declaring a new product.
4. Extract text or prepare structured content. Connect the exact result to every contributing input with classified relationships; no engine event is required.
5. Cite the exact pages/locations supporting a provision or field. Classify sources/publishers on the Source side. Legal determines legal force and effects separately.
6. A translation or later consolidation remains distinguishable; do not treat disagreement as a format difference and merge it silently.

### Institution and project media

A logo media row mentions an Official entity; several photograph/video rows mention a project. Different purposes/kinds are Reference values and natural descriptions. All rows reference exact Filesystem versions. No media_id column is required on each subject table. Source relates each media/file to its capture or supporting origin. One file can be reused by several subject associations without duplicating stored bytes.

### County GIS assets

A feature has several photographs through media. An assets row links that feature to a boundary GeoPackage file and named layer; another identifies both the feature and its specific geometry and links them to the exact file used to reconstruct that geometry. A GeoTIFF can concern many counties through several associations. Source models the dataset product, its edition/artifact and origin/contribution evidence. No Geography dataset table is involved.

### Seed provenance

A seeded row is traceable to the exact CSV artifact and line used, including when the CSV later changes. The prepared CSV can depend on several captures/files through relationships. Preserve old artifact links and provenance, rather than linking only to a mutable dataset identity. Seed cells use approved code aliases; loaders resolve identities without hand-copied UUIDs. No seed additions or vocabulary changes occur without owner review.

## Current-to-target migration map

| Current object | Target action |
|---|---|
| filesystem.file_relations | Migrate classified I/O connections and useful evidence to source.relationships; remove table and old runtime/package lineage ownership |
| filesystem.media | Retain; remove source_url; add subject association, description/purpose and reviewed ordering fields |
| Consumer media_id columns | Migrate to media mentions; update queries and generated clients before removal |
| source.domains | Retain as separate table; review host/source cardinality |
| source.paths | Replace with addresses, preserving endpoint/request meaning and capture references |
| source.documents | Resolve into product/edition/artifact identities while retaining exact acquired content and publisher evidence |
| source.datasets | Resolve into the same product/edition/artifact structure, retaining exact prepared CSV evidence |
| source.dataset_lineage and provenance | Consolidate into relationships and exact citations; preserve all contributing inputs and row/column scope |
| source.evidence | Remove mandatory bundle layer after mapping citations, assessments and all incoming references |
| source.citations | Retain/revise for exact artifacts and supporting relationships |
| source.verifications and attributions | Retain/revise without mixing source classification or storage ownership |
| source.manifests, manifest_releases, manifest_bindings, publication_receipts | Remove from target after resolving current dependencies; no automatic replacement elsewhere |
| geography.datasets | Migrate products/artifacts to Source and geographic file uses to assets; remove duplicate catalogue |
| geography.geometries.file_version_ref_id | Resolve legacy untyped pointer into the agreed asset association; avoid retaining an unexplained duplicate link |
| legal/official incoming evidence/content pointers | Inventory and explicitly rewire; no silent loss or Legal semantic redesign |

Immutable migrations already applied must not be edited as an implementation shortcut. Establish actual database release/deployment state before proposing the migration mechanism; do not assume a live database is synchronized with generated schema.sql.

## Implementation preparation and validation

Before implementation, produce a per-table contract dictionary: fields/types, nullability, identities/codes, uniqueness, lifecycle, delete/update behavior, exact targets, indexes, invariants, approval status and supported Dryv output. In particular settle generic media/Source target enforcement, relationship direction/endpoint matrix, edition equality, acquisition-before-registration, classification cardinality, citation target structure and GIS selectors. Geography assets already has the owner-decided mandatory feature FK and optional same-feature geometry FK; implement and verify that decision rather than reopening its target shape. These are implementation details to resolve, not reasons to reopen the owner's settled ownership decisions.

Inspect current consumers across dryv/contracts, source/schema/database, generated SDK/API/models, database SQL/migrations, engine PostgreSQL adapters, registration/seed composition, filesystem package, crawler admission and UI queries. Update owning docs and links alongside eventual behavior changes. Keep packages storage-agnostic and placement caller-controlled.

Meaningful validation must cover: multi-source same-byte acquisition; different-format same-edition artifacts; changed wording as a distinct edition; many-input derivation without engine events; derivation cycle rejection; exact historical CSV-line provenance; many media per subject and file reuse across subjects; invalid subject targets; GIS layer/band selection; rights/verification disagreement; removal of stale pointers and foreign keys; deterministic generation and migration preservation.

Run task validate for documentation. Implementation additionally requires relevant package/loader/database checks and bun run check, reporting pre-existing failures accurately. No test pass or generator compilation proves the design is deployed or the data migrated.

## Explicitly rejected structures

- Media moved out of Filesystem merely to centralize sourcing.
- Entity/project/feature media_id pointers as the general media attachment model.
- A Source authority_assessments table or document is_official flag.
- Domains swallowed into addresses.
- Dataset used as both product kind and acquisition-channel kind.
- Geography datasets or dataset_profiles as an independent catalogue.
- Filesystem derivation/file_relations retained in parallel with Source lineage.
- Mandatory engine processing events behind Source I/O connections.
- Preserving configuration/publication tables just in case, or relocating them without a newly justified requirement.
- Declaring target contracts or migrations implemented because this design is approved.

## Mandatory subject-reference standard

Apply [SubjectReference](SUBJECT_REFERENCES.md) everywhere this design concerns one generic subject. Exact SQL keys are subject_table and subject_id, backed by the shared closed SubjectTable enum and reusable authored base contract. Refactor current source.provenance subject handling into source.relationships without creating another table merely to preserve the old name. Fixed Geography FK columns stay explicit; two-ended input/output connections retain distinct roles. Break old payloads/headers together, repair all consumers and seeds, and retain data integrity without compatibility shims.

## Implementation record

Implemented on 17 November 2026 under task TSK-A41C603B94BE.

- **Contracts**: `dryv/contracts/schemas/postgres/{filesystem,source,geography,legal}.ts`, with `SubjectTable`/`SubjectReference` in `_subjects.ts` and the subject-carrying bases in `_base.ts`.
- **Source relationships**: each end of a relationship is exactly one real foreign key (capture, artifact, edition, product or file version) for the input, and for the output either one of those or a domain record named by `subject_table`/`subject_id`. Acyclic derivation is not yet enforced by the database; Dryv has no expression for it.
- **Artifacts**: `file_version_id` is optional because acquisition precedes registration; `sha256` is always set. A seed CSV is one product, one edition per content hash and one artifact per edition.
- **Addresses**: `query` is nullable with a partial unique key on `(domain_id, method, path)` for addresses without one. Domains keep a globally unique host with a validity period.
- **Citations** may cite an artifact, a capture or an address (at least one), and name the row they support with the optional subject keys.
- **Captures** may have no source: a link that belongs to no accepted channel is never given an invented one.
- **Geography assets**: `feature_id` is required; `(geometry_id, feature_id)` references `geometries(id, feature_id)` (backed by that unique key); `file_version_id` is required.
- **Subject integrity** (existence, enum membership, RESTRICT on deletion) is the generated release `0002_subject_integrity.sql`.
- **Seed**: the conversion script `scripts/seed/migrate_schema_ownership.py` (plan by default, `--apply` to write, idempotent) holds the mapping rules; the old-to-new identity mapping it writes is `.dev/reports/schema-ownership-seed-migration.json`. The reference vocabulary changed minimally: `src.document.kind` became `src.product.kind`, `src.dataset.category` was removed with the dataset table, and the schemes `src.relationship.kind`, `src.locator.kind`, `leg.name.kind` and `leg.effect.kind` were added with only the values the converted rows use.
- **Filesystem lineage** left the filesystem package; the engine records promotion lineage as a `source.relationships` row (`persistence/postgres/source.py`).
