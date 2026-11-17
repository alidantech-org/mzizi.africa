---
id: HANDOFF-IMPLEMENT-SCHEMA-OWNERSHIP
name: Implement agreed ownership, subject references and Legal redesign
type: handoff
---

# Implement the agreed schema ownership redesign

## Authorization: act on the complete plan

The owner explicitly requested an implementation handoff on 17 November 2026: implement all of the agreed plan, make coordinated hard changes without compatibility concerns, repair existing affected seed CSVs with scripts, and regenerate/repair Dryv outputs. This authorization supersedes earlier investigation-only restrictions for the scope below. Do not ask again whether the agreed removals, renames, shared keys or translation separation are wanted.

The receiving agent must implement the full coherent change, not stop after a proposal, schema skeleton, generator run or partial seed migration. Resolve ordinary engineering choices using current contracts and the approved meaning; record decisions as part of the task. Ask only if evidence exposes a genuinely new product decision, irrecoverable missing source information or destructive external action outside this authorization. Do not preserve obsolete structures merely because changing consumers is substantial work.

This handoff authorizes implementation by the receiving agent. The current documentation turn is not executing it and must not claim it is complete.

## Working rules and reading order

Repository: `/home/alidante/Projects/research/alidantech-org/mzizi-africa/mzizi.africa`. Work directly on develop in the existing checkout; no branches/worktrees, no .github edits. Preserve unrelated work. Inspect status first. Follow AGENTS.md and mandatory Task usage; inspect the existing task before creating related work, update the same task for follow-ups and record implementation progress/decisions there.

Read required product core docs, relevant local ownership maps and these authoritative targets:

1. [Subject reference standard](../design/data/SUBJECT_REFERENCES.md).
2. [Source, Filesystem and Geography target](../design/data/SOURCE_FILESYSTEM_GEOGRAPHY.md).
3. [Legal target](../design/data/LEGAL_SCHEMA.md).
4. [Consolidated ownership handoff](HANDOFF-SCHEMA-OWNERSHIP.md).
5. seed/README.md, scripts/README.md, code/typed-contract/versioning rules, current Dryv packs/composition and database release documentation.

These guides contain field-level design requirements to finish, not a mandate to pause for another blanket approval. Latest owner decisions in this handoff win over older conflicting examples or approval gates. Archived code must not be imported, built, generated or executed.

## Mandatory target

### Filesystem: seven tables

Keep folders, files, file_versions, file_extensions, tags, taggings and media. Filesystem owns bytes, object keys, size/hash/media type, version membership, retention/access and storage verification. No acquisition URL registry or parallel derivation graph.

Remove file_relations after migration of data and callers. Source models classified I/O; do not require engine events. Preserve original metadata and ancestry/derivative behavior where used.

Retain media with exact file_version_id, media kind, natural description/title, alt text, purpose and reviewed ordering. Every generic media subject uses SubjectReference. Remove source_url and entity/project/feature media_id-style attachment pointers; media mentions the subject. Multiple media per kind/subject and reuse of a file across several subjects must work without duplicate bytes. Source owns provenance for both file and media record. Support acquisition-before-registration through Source rather than reintroducing URLs in media.

### Source: thirteen tables

Target publishers, sources, domains, addresses, discoveries, captures, products, editions, artifacts, relationships, citations, verifications and attributions.

- Keep domains separate; addresses replaces paths.
- Source and publisher classifications/credibility use Reference values as appropriate. No authority_assessments table or intrinsic document is_official flag.
- Dataset is a product kind, not an acquisition-channel kind.
- Preserve discoveries before retrieval, exact original/final URL observations and repeated captures.
- Separate logical product, meaningful publication edition and exact representation/artifact linked to immutable Filesystem bytes. Identical downloads from many sources must not multiply logical products.
- Consolidate dataset_lineage, file_relations and provenance responsibilities into classified relationships, with exact citations and legitimate typed endpoints/subjects. Do not create an extra source.provenance table merely because the old implementation has one. SubjectReference applies to the single-subject portion of this replacement.
- I/O kinds describe extracted-from, prepared-from, built-from, translated-from and other reviewed meanings. Many inputs/outputs are supported via connections, not mandatory processing-event entities. Optional external execution references are loose IDs only.
- Remove mandatory evidence-bundle dependency after preserving all support and consumers. Citations, verification and attribution retain their separate meanings.
- Remove manifests, manifest_releases, manifest_bindings and publication_receipts from the target. Repair current references and jobs/consumers rather than leaving dangling imports or automatically recreating them elsewhere. Later needs require a new design.

### Geography: eight tables

Keep features, names, classifications, identifiers, geometries, relationships and changes; add assets. Remove geography.datasets after mapping identity into Source and file-use associations into assets. No dataset_profiles or second dataset catalogue.

Assets requires feature_id NOT NULL FK to features(id), optional geometry_id, and exact file_version_id FK. Enforce optional (geometry_id, feature_id) -> geometries(id, feature_id), backed by a declared referenced unique key, so a geometry cannot belong to a different feature. With geometry_id NULL the separate feature FK still enforces feature existence. This is not an exclusive feature-or-geometry choice.

Retain asset kind, purpose, description and typed layer/band/member selectors where relevant. One GIS file may concern many features; one feature may have many files. Filesystem media handles depicting photographs/video; assets handles GIS usage. Acquisition and provenance stay Source-owned.

### Legal: nine tables

Target instruments, names, editions, provisions, wordings, translations, references, relationships and effects.

- names is the exact short table name. Multiple language names, formal/short/alternative kinds, preferred display and no-asserted-language canonical selection refer to the central registry. Migrate instruments.title; do not keep two authoritative naming stores or silently label all text English.
- Instrument kinds (Constitution, Act, Bill etc.) are Reference-controlled and distinct from status. Preserve Bill/Act identities joined by enacted-as. Legal hierarchy uses meaningful subject-to/made-under/implements/part-of relationships, not a mandatory parent instrument.
- Legal editions are legal content states, not Source publication editions or downloaded PDFs.
- wordings contains authority-bearing exact text with provision/edition/language consistency. effects.wording_id and legal authority pointers refer to wordings.
- translations is a separate table with required wording_id FK and language_id FK, exact text, method, producer/date, review status/reviewer/date and notes. Several translations into the same language are valid. Amendment must not silently relink old translations to new wording. Preserve independently authoritative language forms as wordings when evidenced; a reviewed translation is not automatically legal authority.
- references must distinguish originating wording from originating translation with real FKs/checks; verify exact character spans and historical targets.
- relationships holds substantive legal operations and hierarchy, not Source derivation. Preserve exact authority, affected and resulting wording as needed.
- effects holds legal authority, effect kind, SubjectReference, applicable validity, explanation and reviewed interpretation. Reuse existing validity conventions rather than duplicate date systems. Effects describe legal meaning and do not automatically mutate domain data.

### Shared subject contract: mandatory breaking standard

Implement one shared closed SubjectTable enum and reusable SubjectReference base with exact authored keys subjectTable/subjectId and SQL keys subject_table/subject_id. Both required; shared ID scalar is UUID where eligible subjects use UUID. Base contributes no unrelated lifecycle fields.

Enumerate known supported SQL tables from the authoritative contract inventory; no arbitrary strings, inconsistent local enums, subject/target aliases or runtime unknown-table registration. Validate generated enum output values and table coverage. Implement common target resolution plus robust existence/deletion integrity; enum membership alone is insufficient.

Apply throughout all generic single-subject associations, not just the three examples. Fixed-target FKs, particularly Geography assets and Legal authority wordings, remain direct FKs. Distinct I/O endpoints retain input/output roles using common typed shapes and an allowed endpoint matrix; do not collapse them into one subject. Determine concrete constraints within the approved design and verify Dryv emits them.

## Implementation sequence

### 1. Baseline and map dependencies

Inspect current contracts/SQL/catalogues, pack templates and app composition, database migration state, engine repositories, filesystem package operations, crawler ingestion, SDKs/API/UI, seed loaders and preparation scripts. Capture pre-change check failures and current CSV/file/row inventories. Identify every removed name and incoming FK, not just the named tables. Keep exact old-to-new identity mappings.

### 2. Author shared and domain contracts coherently

Implement SubjectTable/SubjectReference, target structures and full keys/constraints. Use supported Dryv features. Keep code typed; no free dict/Any beyond parsing. Define relationship direction/kind rules, fixed versus generic integrity, citation/subject attachment, historical dates, edition/artifact matching and seed natural keys. Record choices in the guide/task rather than silently weakening invariants.

If required semantics expose a generator/pack gap, inspect its owning extension and repair within authorized local scope where possible. Do not hand-patch generated files, invent fluent APIs or report a comment as a constraint. Continue independent implementation while identifying any actual external dependency precisely.

### 3. Rewire runtime and consumers

Update engine composition/persistence, registration, loaders, filesystem orchestration, API projections, generated client consumers and UI queries. Move lineage ownership cleanly without making filesystem packages know Source storage or a database exists. Repair obsolete imports/endpoints/type names, not just SQL. No stale evidence/document/media pointer should be hidden behind old-format fallback readers.

### 4. Script-driven seed repair: owner authorization

The owner explicitly authorized repair of every affected existing CSV under:

`/home/alidante/Projects/research/alidantech-org/mzizi-africa/mzizi.africa/seed/data`

This authorizes coordinated schema-driven rename/split/merge, header/link conversion and replacement files needed to preserve existing approved data. Do not stop for per-file approval of these mechanical existing-data repairs; this session authorization takes precedence over the default seed workflow for this scope. New unrelated curated datasets or invented real-world facts are not authorized.

Use reproducible typed scripts, not mass handwritten CSV editing or unreviewed regex replacements. Extend scripts/seed tooling where appropriate; respect root Bun orchestration/Python uv execution and project registration. Read and update preparation generators (especially Constitution generation), so a later rebuild does not restore old schemas.

Required script properties:

- Dry-run/plan report of every affected path, source/destination table, header, row count and identity mapping before applying the transformation.
- Idempotent rerun behavior, CSV-safe parsing/quoting/newlines, deterministic output and atomic writes where feasible.
- Preservation of exact legal texts, translations, spans, language identities, review evidence, source locators, dates and geographic identifiers.
- Stable code resolution and mapping of renamed table-dependent deterministic IDs; no hand-copied UUID seed cells or guessed mappings.
- Conversion of paths/documents/datasets/lineage/provenance/evidence rows into the agreed target; remove obsolete CSVs only after validating mapped replacements.
- Conversion of original legal text to wordings and existing translations to translations with exact wording links; names from titles with supported language attribution, not blanket English.
- Standard subject columns/seed aliases across media, effects and provenance replacement. Target enum values must match actual SQL table names.
- Exact CSV artifact/line provenance preserved across transformations; do not make old evidence point to the newly edited CSV bytes as if they were the original.
- Explicit unmapped/ambiguous rows and reconciliation of all counts. Never discard legal text or fabricate a publisher/authority just to make validation pass.

Repair supporting manifests/locks, _source metadata and mappings that actually depend on changed files. Inspect seed/drafts and fixtures as consumers, but do not promote unapproved drafts into executable seed/data. Required reference vocabulary edits must be narrowly justified by the approved schema/classifications and documented in the report; do not invent new facts or bulk-import new sources. Respect seed file-size/code rules.

### 5. Dryv regeneration and repair

Discover exact current root commands with bun run help and scripts/README.md; do not use stale paths. Generate from authored contracts/packs, never hand-edit generated SQL/models/SDKs/schema JSON to hide drift.

Relevant existing command families include bun run dryv:check, dryv:generate, dryv:verify, dryv:database:plan/generate/verify/check/typecheck, schemas:sync and catalog. Select supported ones based on current runner implementation. schemas:sync has remote upload behavior: use its local/dry-run form for this work unless publication is separately authorized. catalog is the API/dashboard catalogue command; do not assume it alone regenerates PostgreSQL table schemas.

Repair every affected generated database schema/SQL/catalogue/model, engine/API binding, SDK and generated consumer, and remove stale generated outputs through the owning generator's supported cleanup. Inspect before pruning; do not delete unrelated artifacts. Verify a second generation produces no drift. Any generator limitation that breaks required schema semantics is a real task defect, not permission to silently omit a constraint.

### 6. Migrations and actual data preservation

Create an explicit database migration plan for renamed/removed tables and relationships, using immutable release rules. Preserve existing records and incoming references through mappings. Do not edit an already-applied migration or assume the database can simply be dropped because the product is pre-release.

Use isolated/disposable local test databases for apply/reapply and migration verification. This handoff does not authorize production resets, deleting existing research databases, modifying remote data, publishing schemas, or deleting S3 objects. S3 archives/originals remain intact. Local schema/seed validation and disposable test migrations are required implementation verification, not proof of deployed production state.

## Required acceptance checks

- All target tables implemented with no rejected tables left in active composition/consumers.
- Shared subject enum/base/keys consistent across every generic association; invalid table/ID and orphaning operations rejected under documented enforcement.
- Required feature FK and optional same-feature geometry FK emitted and tested.
- Multi-source same-byte acquisition and many-input I/O without engine events work.
- Exact product/edition/artifact distinction; no duplicate logical Constitution for each download.
- Many media per kind/subject, one file reused across subjects, no acquisition URLs in media.
- Nine-table Legal target, multilingual names, authoritative wordings and separate translations; effect authority cannot accidentally select a translation.
- Multiple translations into one language, historical amendments, co-authoritative language evidence, reference spans and unchanged legal text verified.
- Every affected seed CSV reconciled, generator scripts repaired, no dangling codes/IDs or obsolete table headers.
- Source provenance remains attributable to exact old/current artifacts and CSV locations.
- Dryv output complete, deterministic and constraint-faithful; generated and handwritten consumers compile/test together.
- Documentation and README links accurate; no obsolete investigation-only gate blocks this authorized implementation.

Run task validate, relevant Python tests via uv, affected Bun checks, and bun run check. Run uv run mzizi-manifest check, refs seed and data seed as supported by the current CLI, and refresh/validate locks when changed. Verify command availability rather than assuming old docs are current. A dry-run loader may execute writes in a transaction before rollback; point it at the disposable test database, not an arbitrary configured research database.

Report pre-existing failures separately with actual outputs. Fix introduced failures; do not weaken tests/schema rules/quality gates to force green. External missing inputs must be named with the exact affected checks; continue other work and do not claim full completion if mandatory acceptance remains unmet.

## Delivery

Deliver the implemented design, full seed migration report/scripts, old-to-new identities, generation/validation results, remaining external blockers if any and clear deployed-versus-tested status. Inspect final diff for unrelated edits, generated drift, archived imports and secrets. No automatic commit/push or deployment is requested by this handoff; follow any explicit later owner instruction for those actions. Archive Task only when its recorded scope is truly complete.
