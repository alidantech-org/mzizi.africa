---
id: HANDOFF-SCHEMA-OWNERSHIP
name: Files, sourcing, reference and legal ownership
type: handoff
---

# Schema ownership handoff

## Status and authority

This consolidates and amends the owner's pasted “MZIZI AFRICA — Schema Ownership, Files, Sources, Datasets, Links & Languages” handoff, its repository evaluation and the owner's follow-up of 17 November 2026.

The owner has directed the ownership boundaries below. Exact table designs, relationship cardinalities, migrations and runtime changes still require investigation and review. This handoff authorizes documentation and investigation only. Do not edit contracts, seeds, generated outputs or runtime behavior, run database changes, commit or push as part of carrying it out.

Work directly on `develop`, use Task, preserve unrelated changes and follow `AGENTS.md`. No branches or worktrees. Read the core documents and relevant design guides required there. Planning documents and descriptive comments are not proof of implementation or approval.

## Owner's requirements

1. Files have one home: Filesystem.
2. Sources, sourcing, external addresses, discovery, captures and provenance have one home: Source. Stop adding URL and sourcing infrastructure to individual domains.
3. Shared schemes, controlled values and language identities have one home: Reference.
4. Legal bases and legal effects on other records stay in Legal. The affected records retain their own domain identity.
5. Official or unofficial source status belongs to Source, not to a document. It describes the source's authority in context, not a property of bytes.
6. One result can have many contributing sources. Preserve every contribution and its role; do not force one source onto the result or let the latest contribution replace the others.
7. Canonical/default names must not silently acquire English language attribution. No language asserted is different from a positive assertion that a form is shared by several languages.

These directions are requirements. Table names and structural alternatives below remain proposals for review.

## One primary owner per responsibility

| Responsibility | Owner | How other schemas use it |
|---|---|---|
| Logical files, folders, exact versions, hashes, object keys, size and media type | Filesystem | Reference a file/version; do not recreate storage fields or lifecycle |
| File access, retention and tags | Filesystem | Caller supplies placement and policy; domain meaning remains outside Filesystem |
| Exact input/output derivation and processing history | Source | Reference immutable Filesystem versions; record transformation and contributors centrally |
| Publishers, source identities and contextual source authority | Source | Reference the source and its recorded assessment |
| External URLs, domains, paths, endpoints, redirects and discovery observations | Source | Reference the Source address/discovery record |
| Retrievals, captures and acquired content identity | Source | Reference a capture or content document |
| Dataset identity, acquisition lineage, contributing inputs and record provenance | Source | Reference a dataset or its evidence; domain-specific metadata stays with its domain |
| Evidence bundles, exact citations, verification, credit and rights assessments | Source | Use a citation/evidence relationship |
| Shared classifications, schemes, values, languages and language names | Reference | Reference the shared record by a typed relationship |
| Instruments, provisions, legal wording, amendments, applicability, bases and legal effects | Legal | Legal owns the relationship to the affected domain record |
| Geographic features, names, geometries and geographic relationships | Geography | Use Source for origins and Legal for legal effects |
| Organization/person identities and their names | Official | Use Reference languages and Source evidence; source officialness remains in Source |

Central ownership does not mean one giant table. Source needs distinct entities for an address, discovery observation, retrieval event, content and evidence. Internal foreign keys and geographic relationships are not external URLs and remain with their domain owner.

## Files and source content

Filesystem owns the stored artifact and its technical lifecycle. Source owns how information was obtained and what supports a result. A source capture references acquired content, and that content references an exact Filesystem version. A legal provision or geographic fact refers to its Source evidence rather than carrying a download URL, object key or independent source metadata.

Direct file references are not automatically ownership violations. A geometry representation may legitimately need an exact file version. Review each reference by meaning; convert untyped UUIDs into declared relationships where appropriate, and avoid duplicating download origins or storage metadata.

Distinguish these identities explicitly:

- A logical file and its immutable byte versions.
- A captured content document: currently identified by SHA-256 in `source.documents`.
- A publication/work spanning editions or representations: do not claim the current hash-based document table implements this identity.
- A legal instrument and its legally meaningful wording/history.
- A logical dataset and its exact representations or prepared inputs.

Equal hashes establish identical bytes, not equal authority, legal force or publisher identity. Different bytes can represent the same legal instrument. Do not collapse different files merely because their titles match, or overwrite attribution when identical bytes arrive through another source.

## Sources, URLs, captures and multiple contributions

The target has a single Source-owned path from external address to provenance. Other schemas must not introduce general `url`, `downloadUrl`, publisher, retrieval-time or source-location fields as a second sourcing system. Inventory existing fields and propose explicit dispositions rather than silently dropping useful evidence.

Within Source, distinguish an address identity from the exact URL observed on an individual discovery or request. Original and redirected URLs on captures are historical evidence; centralization must preserve them. Decide normalization, deduplication and redirect rules in Source. Credentials must not be copied into public provenance.

Crawler observations are operational inputs, not independent canonical source registries. The crawler already exports `links.csv`, has a typed `LinkRecord`, and writes `site_links` through the activity store. Investigate how accepted discoveries enter Source while retaining run and observation evidence. A new `source.links` table is an option, not a prerequisite or proof that link functionality is absent.

For the Constitution, the proposed trace is:

```text
Publisher A -> Source A -> URL A -> Capture A -> Content A -> File version A
Publisher B -> Source B -> URL B -> Capture B -> Content B -> File version B
Publisher C -> Source C -> URL C -> Capture C -> Content C -> File version C
                                  |
                 Source-owned contribution/evidence relationships
                                  |
                   Constitution wording / prepared dataset
                                  |
                  Source provenance for accepted records
```

Each capture keeps its own URL, observation time and source identity. If A and B deliver identical bytes, they may share one content document while their captures and source assessments stay distinct. An English text, a translation and a later consolidation remain distinguishable inputs.

Contribution roles might include original wording, comparison, translation, correction or extraction input. These are examples to review, not approved classifications. Preserve the contribution's scope (whole result, provision or field), exact content/citation, method, uncertainty and disagreement. Do not merge conflicting wording silently. Evidence of origin does not itself establish that wording has legal effect.

Review whether existing dataset lineage, provenance and citations cover each use case before proposing new association tables. Contribution relationships must be many-to-many where the evidence requires it; do not reduce them to one `sourceId` column.

## Official and unofficial sources

Official/unofficial sourcing status belongs in Source. A document must not gain an intrinsic `isOfficial` flag. The same bytes can be delivered by an official source and an unofficial mirror without changing the bytes or erasing either acquisition path.

Source authority must have an attributable basis and applicable scope/time. Being official for one publisher, publication or period does not make every item on a host authoritative for every purpose. Exact representation and enforcement of this contextual assessment remain for design review.

Keep three separate questions:

1. Is this a source acting with official authority in this context? Source owns the assessment.
2. Has this extraction or translation been reviewed/accepted? Preserve workflow and method independently of source authority.
3. What legal force does this wording have, and when/where? Legal owns that conclusion and its basis, supported by Source evidence.

The current `legal.TranslationKind` includes official/unofficial alongside proposed/machine categories. Flag this mixture for review under the new direction: source officialness must be represented in Source; legal force and review status must not be lost or inferred from it. Do not change those fields during this handoff work.

## Reference, languages and names

The original handoff's comparison between scheme values and a dedicated language table is superseded by the current implementation: `reference.languages` and `reference.language_names` exist, the five originally identified consumer tables use `languageId`, and seed cells use `language_code`. Generated SQL includes language foreign keys. This is repository evidence, not proof that every deployed database has been migrated.

Continue reviewing the implemented registry rather than restarting the choice without a concrete reason. Schemes and controlled values remain in Reference. A domain-specific relationship may use a Reference classification without transferring ownership of that relationship to Reference.

The registry has special records `und`, `mul` and `zxx`; current contracts require language references. Use no asserted language deliberately rather than treating a blank/default as English. `mul` is a positive multiple-language assertion and requires justification; a canonical name alone does not establish it. The Kenya seed still marks “Kenya” as English and non-default, which requires owner review against the original requirement.

Geography now has `isDefault` and a generated partial unique index per feature and language. Review whether this satisfies the owner's desired root/default selection across languages and historical periods. Review Official preferred-name constraints separately, including nullable entity/person ownership columns. Preserve distinct domain name tables and legal translation review states.

Language identity, script and regional variation still need explicit handling where required; do not assume the existing language table supplies a full locale model. Add no locale fields or version markers without review.

## Legal effects on other records

Legal owns “this provision establishes/governs/changes this thing,” including the affected target, legal authority, effect kind, applicable scope/time and supporting evidence. Geography owns the place; Official owns the institution/person; their names, identities and non-legal relationships remain with those domains.

For example, a county remains a Geography feature. Its constitutional establishment is a Legal-owned basis/effect relationship to that feature and the relevant provision. Its boundary dataset and acquisition evidence belong to Source and Filesystem. Never put constitutional wording, download URLs or an independent legal-effects subsystem into Geography.

Existing `legal.bases` already has generic target information. Inspect its actual contract, loader resolution, integrity and history before proposing another effect table. A generic table/record pointer is not a database-enforced foreign key; document how valid targets and corrections will be checked. Do not assume every legal effect is an executable command or automatically mutate accepted domain data from extracted text.

Some older proposed documents describe Reference as the incoming mediator for Legal. The owner's current direction takes precedence: Legal owns legal effects and their affected-record relationships. Reference retains classification values, not a second legal-effects registry. Report conflicting documentation for subsequent alignment; do not claim those documents or contracts have already changed.

## Datasets and exact provenance

The overlap between `source.datasets` and `geography.datasets` remains an investigation item. Design Source-owned logical datasets and exact artifact associations. Do not add Geography datasets or dataset profiles. Establish which attributes describe a dataset, a representation or an individual artifact: CRS, resolution and coverage may vary across representations. Geography features and geometries link to the central information products or exact files through relationships that state their purpose.

Every seed CSV is currently catalogued as a Source dataset; the loader writes dataset-and-line provenance and derives identifiers deterministically from table/natural identity. A redesign must trace an accepted row to the exact CSV content and line used, even after that CSV changes. A link to the current dataset alone is insufficient. Preserve old evidence; do not invent new version fields as a shortcut.

Review `source.datasets.location` by actual use: repository input placement differs from an S3 key or acquisition URL. Decide whether it is needed without eliminating the ability to locate a prepared input. Filesystem remains the authority for registered stored objects.

## Required investigation and deliverables

Inspect authored contracts, composition, generated schema catalogues/SQL, immutable migrations, loader and registration code, crawler/activity behavior, current seeds and relevant guides. Separate declared structure from enforced SQL and executed runtime behavior. Never build or import archived code.

Produce the original eight deliverables with the amendments above:

1. A complete inventory of tables in the six relevant schemas, with detailed ownership analysis for those touching files, sourcing, languages, datasets or legal effects.
2. A current data-flow diagram distinguishing implemented paths, gaps and proposed paths.
3. An ownership matrix applying the owner's directions, with explicit cross-schema relationship purposes.
4. A dataset comparison covering central logical identities, artifacts, purpose-bearing feature/geometry associations, exact historical provenance and multiple contributors; no Geography dataset catalogue or dataset profiles.
5. A review of the implemented language registry, default names, special codes, locale needs and SQL constraints.
6. An exact seed impact inventory, including draft files and the scripts that generate affected CSVs. Show proposed headers and code resolution without changing files.
7. Verified conflicts and unresolved decisions, including source authority versus legal force, document identity, generic targets and stale guidance.
8. A phased implementation proposal listing affected contracts, columns, relationships, generated outputs, loaders, seeds, migration needs, documentation and validation. Separate independent decisions for owner review.

For each finding, identify evidence and whether it comes from authored definitions, generated output, runtime code, seed contents or an executed check. Do not claim live migration status without verifying it. Do not run migrations during the investigation.

Seed CSVs must match their generated table seed contracts, use stable codes rather than manually copied UUIDs, and retain the owner's per-file approval requirement. Preserve raw bytes, historical and observation times, evidence, uncertainty, review and disagreements throughout.

## Completion and next action

Explain the existing gaps and proposed changes using a multi-source Constitution example and a geographic dataset example. Return the audit and specific design decisions for review. The owner has settled the primary ownership directions; seek decisions on remaining structural alternatives rather than asking permission again for those directions.

No implementation is authorized by this amended handoff. Contracts, seeds, generated files, migrations and runtime behavior remain unchanged by this documentation task.

## Revised goal following owner review

The owner rejected the conservative table-retention proposal as insufficient reform of Source and Legal, and explicitly rejected `geography.dataset_profiles` and any independent Geography dataset catalogue. This section supersedes the earlier table-disposition proposal, which has been removed to avoid presenting rejected structures as the next implementation plan.

The new goal is a coherent redesign of Source, a responsibility review of Legal, and meaningful links from geographic records to centrally managed information products and files. Do not preserve an existing table merely because it exists, or add associations over overlapping concepts without first resolving their meaning. No implementation is authorized; this records direction for the next design investigation.

### Source: redesign by concepts before selecting tables

Explain and distinguish these concepts before proposing a replacement schema:

| Concept | Meaning |
|---|---|
| Publisher | Person or organization responsible for publishing information |
| Source | Origin/channel from which information is obtained, with contextual authority and access assessment |
| Capture | One retrieval, with exact observed/requested/final URL, time, response and acquired content |
| Information product | Document or dataset identity independent of where it was acquired, with distinguishable editions/wording and representations |
| Contribution | How exact acquired content supports or produces a product, dataset or domain record |

Filesystem remains the sole physical file/version owner. Reference owns shared classifications and languages. Source owns external addresses, acquisition and supporting provenance. Official/unofficial assessments belong to Source and their relevant context, never an intrinsic flag on a document.

Review overlaps among the current `provenance`, `dataset_lineage`, `evidence`, `citations`, `verifications` and `attributions` tables. Retain separate tables only where their distinct identity, lifecycle, integrity and queries justify them. Likewise review whether manifests, releases, bindings and publication receipts belong to Source or another existing owner. Do not move them without reviewing actual consumers and obtaining approval for the detailed design.

Do not assume the existing hash-based `source.documents` table represents a publication across formats or editions. The model must distinguish one logical product, different meaningful wording/editions, exact byte representations and repeated retrievals. Identical bytes can share content identity while preserving every source/capture. Different hashes do not automatically mean different Constitutions. Matching titles do not establish equivalent wording.

Several sources can contribute original wording, translation, correction or corroboration. Contribution scope may be a product, provision, field or other domain record. Preserve exact supporting artifacts/citations, methods, uncertainty, disagreements and reviewer decisions. Do not force every origin through a seed dataset or one `source_id`. A new universal contribution table is an option to evaluate, not a settled requirement or a rejected option solely because current tables exist.

### Legal: review structure and effects

Legal must represent instrument identity, wording/language, structure, internal legal relationships, historical applicability and legal effects on other records. Source provides supporting artifacts, captures and citations; Reference supplies language and classification identities.

Review all eight current Legal tables rather than asserting they remain unchanged. Specifically examine whether `bases` adequately represents legal effects, whether translations require their current separate structure, and how provision wording relates to instrument editions and exact legal authority. Keep source authority, production method, review state and legal force distinct. Removing a translation category must not erase a supported legal distinction.

Legal owns a provision's establishment/governance/change relationship to an affected record. Geography owns a county and Official owns an institution; neither needs a separate legal-effects subsystem. Extracted legal text remains a reviewable proposal, never an instruction to silently mutate domain records.

### Geography: no dataset tables or profiles

Do not create `geography.dataset_profiles`, a replacement Geography dataset catalogue, or another geographic dataset identity system. Existing `geography.datasets` must be assessed for migration into the central model rather than preserved as a second catalogue. No deletion is authorized before mapping its data, identifiers and incoming references.

Features and geometries relate to centrally owned datasets, documents or exact file versions through associations that state what the linked item is for. One feature can have many related items; one item can concern many features. A geometry must be able to identify the exact artifact used for its representation or reconstruction.

| Geographic target | Related information | Relationship purpose |
|---|---|---|
| County feature | Boundary dataset | Supplies boundary information |
| Geometry | Exact GeoJSON file version | Contains the geometry used |
| Historical feature | Scanned map | Supports reconstruction |
| Feature | Survey report | Describes or measures the feature |
| Feature | Photograph | Depicts the feature |

Investigate the exact association owner and typed targets. The concept needs a target feature or geometry, a centrally managed product/artifact or exact file, relationship kind/purpose, and supporting provenance. Do not settle table names, nullable target combinations or generic polymorphic pointers without explicit integrity rules. This association is not a dataset catalogue. Geometry coordinates and the SRID required to interpret them remain geographic representation data; acquisition URLs and general dataset identity do not move into Geography.

### Required next design result

Present a smaller, justified concept-to-table proposal with every retained, merged, relocated, added or removed table explained. For each changed column show its meaning, destination, data preservation/migration, references, constraints, consumer impact and approval boundary. Include multi-source Constitution and feature-to-artifact examples. New table names and exact cardinalities remain open until that proposal is reviewed.

The previous promise to retain nearly every Source and Legal table is withdrawn. The owner has chosen the ownership direction, not approved a final replacement schema. Continue investigation and discussion; no contracts, runtime code, seed files or migrations are authorized by this goal.

## Source and Filesystem boundary: removal of file relationships

The owner now directs removal of `filesystem.file_relations` in the target model. Source owns all input/output lineage, including file transformations; Filesystem owns stored identities and versions. This is a design direction, not permission to drop the current table immediately.

Current implementation still uses `file_relations`: the filesystem package has relation/ancestry/derivative behavior, the engine PostgreSQL adapter reads and writes the table, and runtime operations expose lineage. Current Source `dataset_lineage` only targets datasets with dataset/document/capture inputs, and `provenance` requires a dataset; neither currently replaces arbitrary exact file-to-file derivation. Do not claim relocation is already supported.

The Source redesign must represent input/output derivation relationships, including exact file versions where applicable, classified by their meaning: extracted from, prepared from, built from and similar relations. The owner explicitly rejected requiring engine processing events, processor parameters or execution time/actor as the Source model. An external execution identifier may be retained optionally as a loose reference; it must not be required for lineage or import engine lifecycle semantics. Several inputs may contribute to the same output, and an input may support several outputs. Preserve existing useful processing evidence during migration without making its execution structure a prerequisite for a relationship. Preserve cycle protection and ancestry/derivative queries. File revision membership remains in Filesystem and must not be confused with derivation.

Inventory and move current callers and package/runtime responsibilities when implementing this boundary. Filesystem packages must remain reusable without knowing a database exists or importing Source storage. Source persistence and engine composition will wire provenance separately from byte registration.

A fresh contract inspection also found `filesystem.media`, containing `source_url` as well as an optional `file_version_id`, kind/title/caption/alt text. This is an additional source-address ownership leak. Its acquisition URL must become Source-owned with an explicit association, including before bytes are stored. The owner subsequently approved moving media descriptions into Source’s information-product model; Filesystem retains the exact stored files. Detailed target tables and consumer migration still require design review. Update the earlier seven-table inventory: current Filesystem has eight tables including media, and the target removes file_relations.

Keep Filesystem creation/verification audit distinct from sourcing metadata. Inspect `file_versions.provenance` for acquisition or transformation fields that must move to Source rather than maintaining a hidden parallel lineage registry.

## Owner decisions from the Source/Filesystem questions

The owner answered the first three design questions as follows:

1. The immediate design phase covers Source and Filesystem only. Legal redesign is deferred; identify affected interfaces without implementing Legal changes in this phase.
2. Distinguish all three conceptual identities: logical document/dataset, meaningful edition or release, and exact file representation. This approves the distinction, not table names or new generic version fields.
3. Source models input/output connections rather than mandatory processing/execution events. Inputs can be sources or files; outputs identify what was prepared. Relationship classifications express extracted from, prepared from, built from and similar meanings. Many contributing inputs must be supported. Optional external execution references are loose identifiers; Source does not own an engine run/event model. Whether classifications use Reference scheme values or a technical enum remains for the detailed proposal; the owner allowed either.

Illustration: two captured source files can each be linked as inputs to one prepared output with an extracted-from/prepared-from relationship. The links explain origin even if preparation happened manually, outside Mzizi, or without a retained engine run. Exact file representations and source observations must remain distinguishable so later downloads cannot silently alter the recorded inputs.

The owner subsequently replied “Approve all recommendations” to the remaining five questions. The approved directions are:

4. Source authority assessments are contextual: official/unofficial status applies to a stated subject and time period. A source can be official for some material while unassessed for other material; unassessed is distinct from unofficial.
5. Source retains discovered URLs before retrieval. Discovery observations and subsequent captures are separate concepts; repeated retrievals preserve their own evidence.
6. Media kind, title, caption and alternative text move from `filesystem.media` into Source’s information-product model. Filesystem retains the exact files. Propose target tables and migration of existing media references before implementation.
7. Dataset classifies an information product, not an acquisition channel. Website, API, manual submission and other origins describe channels separately. Revise the existing dataset source-kind usage through an explicit migration proposal.
8. Review manifests, releases, bindings and publication receipts separately from research-source design. Inspect consumers and identify the appropriate existing owner before proposing relocation. This approval does not choose a destination or require automatic relocation.

All eight answers approve design direction. Exact tables, columns, constraints and migration plans still require the resulting schema proposal to be reviewed. No code, seed changes, generation or database migration is authorized by these answers. The next work is the concrete Source/Filesystem design, incorporating input/output relationships rather than mandatory engine events.
