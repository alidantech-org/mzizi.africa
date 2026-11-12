---
id: DOC-8A6317C2E5B0
name: MZIZI data schema storage and pipelines redesign planning register
type: documentation
tags: [improvements, planning, architecture, database, schema, data-quality, generation, storage, pipelines]
extra: {status: planning_only, recorded_on: "2026-11-07", task_creation: user_directed_only}
---

# MZIZI — Data, schema, storage, and pipeline improvements: comprehensive planning register

## Current schema organization — 12 November 2026

The [phased schema catalogue](../schema-redesign/README.md) supersedes earlier schema assignments and review sequencing in this background register: seven Operational schemas in Operations, twelve Phase 01 civic accountability schemas in Main, and fourteen retained Phase 02 proposals. Every other schema belongs in Phase 02 now, deferred and unapproved; this does not start planning. Official consolidates Person/Organization, Politics consolidates Political/Electoral with distinct record types, and Accountability includes Participation. Management is Operations-only, Reference alone links to Legal for domain legal relationships, and geography/geospatial querying is in Phase 01. Finance and Procurement remain separate. Historical inventories below describe their original context; no SQL, application, seed or database change occurs in this documentation pass.

**Reference/Geography update — 12 November 2026:** Only Reference's existing inventory and Geography's nine table names/responsibilities are accepted. Detailed fields and proposed Reference classification extensions remain under review. Modern country identities belong to `reference.countries`; Geography owns territorial entities and spatial representations, and historic/cross-border features may lack a country. The current baseline and proposal are in [Reference](../schema-redesign/mzizi-db/phase-01/reference.md), [Geography](../schema-redesign/mzizi-db/phase-01/geography.md), and the [classification plan](../schema-redesign/mzizi-db/phase-01/reference-geography-classification.md). Historical material below must not be used as a current schema specification.

**Status: PLANNING ONLY — NOT APPROVED FOR IMPLEMENTATION.**

**Date recorded:** 2026-11-07.  
**Repository:** `alidantech-org/mzizi.africa`; design review of `develop`, then observed at commit `f5e46e4d14d1ca946aacca357ac8755356626500`.  
**Scope:** Preserve the user's decisions, words/concerns in substance, open questions, and the assistant's recommendations from the current architectural discussion. This is a **living planning document**, not a migration specification, Taskcode task group, work order, or authority to make structural changes.

> **Mandatory handoff instruction to every future AI agent:** Do not create Taskcode tasks, task groups, implement migrations, alter the database, edit schemas/contracts, restructure packages, change infrastructure, or run deployment actions on the basis of this document alone. The user will **personally instruct the agent how to create and order tasks one by one**, after the planning is sufficiently clear. Record further user decisions here first. Once the user directs task creation, use the repository's Taskcode workflow and follow the existing `develop` branch rules. Never create or modify `.github/**` without explicit approval. This documentation-only commit does not imply approval to implement the proposals below.

## 1. Purpose, interpretation, and decision labels

The user wants to redesign how MZIZI understands and stores public/governance/historical data, how records relate to geography, jurisdiction and law, how datasets are seeded/generated/collected/derived, how incorrect or duplicate claims are corrected, how media and source artifacts are managed with an **already deployed external S3-compatible service**, and how ingestion is decomposed into **independent concurrent pipelines and reusable packages**.

The goal is an understandable, queryable, strongly related, evidence-based system with a practical path to obtaining enough reliable data to make the product useful. This must be a **whole-system pass through every schema, every table, every column**, including internal engine and workflow tables. Consider preservation of existing records and historical meaning from the start.

Interpret every statement using these labels:

- **USER REQUIREMENT:** User expressly directed a design outcome; implementation still requires a later explicit go-ahead.
- **USER LEAN / DIRECTION:** User prefers an approach but wants evaluation before final approval.
- **ASSISTANT RECOMMENDATION:** A reasoned option from the assistant; **not** the user's accepted architectural decision.
- **OPEN DECISION:** User explicitly deferred, or necessary design/verification remains incomplete.
- **CURRENT REPOSITORY:** Observed implementation in `develop`, not a promise that the deployed database matches it.

**Priority rule:** Later explicit user instructions override conflicting historical documentation. However, until a future implementation approval, keep the old files untouched and identify contradictions for the eventual documentation migration. This planning document is an exception explicitly requested in advance of Taskcode planning.

## 2. The user's guiding principles — no loss of intent

1. Inspect the whole schema/table/column tree before deciding compression, merges, removal, renaming, or structural redesign. **Do not decide how many schemas to retain in advance.**
2. Prefer **short, understandable schema/table names and descriptive column names**; document schemas, tables, and columns with PostgreSQL comments, complemented by Markdown files.
3. **Remove the old no-cross-schema-foreign-keys rule.** The user says: "FIX AND REMOVE THE OLD RULE AN AI INVENTED THAT SAYS OR AVOIDS CROSS SCHEMA FOREIGN KEYS, WE NEED TO HAVE HARD TABLES AND FOREIGN KEYS CONNECTIONS OKAY??" Real, enforced database references are expected, including across schemas where appropriate.
4. Preserve trustworthy geography and legal linkages. National/jurisdiction-wide scope should resolve to the correct root geography unit (e.g., Kenya, not null), while physical location, registration jurisdiction, operation and service/delivery territory must not be conflated.
5. Evaluate relationships carefully before forcing FK fields onto every record. Legal provisions can often connect to rules/pattern definitions rather than being redundantly stamped on every generated office; assess query tradeoffs and both directions of geographic hierarchy traversal.
6. Pattern-generated expectations **must not be treated as observed facts**. Expected offices exist by rule; the office holder, address, coordinates or current status need independent evidence.
7. Every data class remains identifiable and traceable; pattern support must be designed across eligible schemas, supported by backend and eventually UI, not isolated in one bespoke seed script.
8. Reduce unnecessary confusion introduced by past AI decisions, particularly mixing `website`, `source`, `filesystem`, `staging`, generic reference values, and similar responsibilities. Simplify **thoughtfully, not recklessly**.
9. Preserve the ability to correct, edit, amend, and revise information as new research proves earlier expectations/claims wrong. Differentiate corrected errors from actual historical change.
10. Reduce repeated research, repeat downloads/extraction, and duplicates through stable identifiers, content hashing, change detection, caching, entity resolution, and clear rules defining what is safe to regenerate or overwrite.
11. File management should stay robust and gain tags, folders, content hashing and complex logical management, but **should not rebuild functions already provided by the deployed object store**.
12. Most legitimately public source files should be consumable through public URLs; private access only when justified, using capabilities of the existing service. Do not reflexively make originally public material private.
13. Build **independently runnable, concurrent pipelines**, capable of a shared goal or completely different goals, with reusable packages for agents, scraping, extraction, file access, classification, generation, etc. The user has **not chosen** the exact process/service/package architecture and asked for explanation of what the code would look like.
14. Combine `identity` and `access` into a clearer `auth` concern; keep real-world `person`, `organization` and `governance` separate. Distinguish `participation` from operational `audit`; group processing/review/runtime concerns in a simpler `engine` where justified. Possible future dedicated engine database is a later scalability decision, **not a current requirement**.
15. Stay neutral for Africa and globally: legal rules, state structures, political mechanisms, geographical hierarchies and legislative procedures differ across jurisdictions and time. Do not hard-code Kenya's legal structure as universal.

## 3. Two main acquisition classes and four subcategories — FOUNDATIONAL, spans ALL workstreams

The user's earlier classification is **not optional or a pipeline-only detail**. It applies to schema modeling, columns, patterns, file metadata, extraction, automation, corrections, research priorities, admin interfaces, and documentation.

| Class | Subcategory | What it means | Examples | Critical guardrail |
|---|---|---|---|---|
| **1. Seeded** | **1A. Static / manually enumerated** | Finite, rarely changing, tractable for human or AI-assisted manual research and deliberate review, one record at a time | Counties, administrative classification levels, certain legal frameworks, canonical known institutions and rules | "Static" does not mean absolutely immutable; corrections need evidence and history |
| **1. Seeded** | **1B. Pattern-based / structured** | Definitional rules applied to existing seeded records; deterministic expansion into expected structures | Governor/deputy-governor offices per applicable county; local offices per geography level; legally expected presence | A pattern establishes expectation, **not** a verified occupant or address |
| **2. Automated / generated** | **2A. Collected / independently extracted** | Scheduled/repeatable collection, downloading, extraction and resolution from known/approved sources, often iterating over seeded units | County executives, appointed officials, published procurement, voters/results, KNBS data, legal publications | Capture and preserve evidence; validate and review according to risk; do not invent missing facts |
| **2. Automated / generated** | **2B. Derived / computed** | Reproducible calculations, aggregates, or analytical outputs from validated existing inputs | Turnout rates, county comparisons, time series, spending summaries | Save formula/version/dependencies and invalidate derived results when upstream inputs change |

The user calls for:

- A schema-level category/tag to help prioritize redesign and coverage work.
- A **comment on each table** specifying eligible acquisition categories (and documented scope/meaning), with equivalent maintained Markdown documentation.
- Traceable per-record acquisition provenance where needed. **Do not confuse a table's eligible acquisition classes with a particular row's actual origin.**
- Explicit pattern-capable tables **in each eligible domain**, with definitions, parameters, sources/authority, versions, input types, cardinalities and validity.
- Clear method of tracing output rows back to a pattern and a generation/sync execution.
- Database-managed patterns as a major direction, with local CSV/folders or versioned file objects for big or complex pattern payloads (such as site structure specifications).
- Administrative capabilities to **view, create, edit, version, generate, regenerate and synchronize** patterns, preferably with dry-run previews/diffs, exceptions and logs. Backend and UI are part of the future design.
- Consider PostgreSQL functions/procedures for simple deterministic generation; assess whether complex work belongs to independent workers.
- Count expected records by jurisdiction/geo scope; compare expected, discovered, verified, missing and retired; do not fabricate values to fill coverage.
- Track actual seed source/quality and "AI curated but not independently official" separately from verified claims.

**Assistant recommendation (not final):** Maintain a central pattern registry/run/lineage capability plus domain-specific pattern semantics where necessary. Store small structured rules in PostgreSQL; use versioned `filesystem` files for large rule documents. Prefer field- or record-level provenance in appropriate shared tables, rather than adding four redundant Boolean columns to every domain table. Approve physical design only after querying real use cases.

**Example end-to-end chain:** Curated Kenya country/root geo → 47 county units → approved county office pattern → expected governor office per county → independent research of county executive/published appointment → candidate person/office-holder evidence → review and canonical promotion → downstream histories/statistics. A later legal change invalidates the applicable expectation/pattern version and triggers a review, not a blind rewrite.

## 4. Actual current schema inventory and scope of the pass

At `develop` observed 2026-11-07, there are **21 active domain/application PostgreSQL schemas, 124 TypeORM entity tables**; **3 additional runtime schemas** (`engine`, `staging`, `access`) and **16 additional tables**, plus engine-created `geography.boundary_shapes`, totaling **24 intended application/runtime schemas and 141 tables** in the repository-defined inventory. `access.account_permissions` is a view. There are 24 TypeScript migration files. These are **code definitions, not audited live-deployment counts**. Check the running DB and pending migrations before making any row-level or DDL claims.

Each table must receive a **full column-by-column audit**: purpose, naming, type, nullability, natural/stable key, PK, explicit cross-schema FK, referenced target/scope semantics, unique and check constraints, indexes, historical validity, versioning, legal/geographic relationships, allowed data classes, pattern eligibility, provenance requirements, data ownership, correction rules, migration impact, and decision **keep/rename/merge/split/remove/add**.

### Complete currently active table catalogue (not a target design)

| Current schema | Current active tables | Count |
|---|---|---:|
| `reference` | `jurisdictions`, `classifications` | 2 |
| `geography` | `units`, `relationships`, `boundaries`, `names`, `changes` | 5 |
| `legal` | `instruments`, `provisions`, `amendments`, `changes`, `links` | 5 |
| `person` | `individuals`, `names`, `profiles`, `contacts`, `handles` | 5 |
| `identity` | `accounts`, `grants` | 2 |
| `governance` | `institutions`, `relationships`, `offices`, `rules`, `procedures`, `stages`, `holders` | 7 |
| `electoral` | `elections`, `seats`, `candidates`, `results`, `manifestos`, `commitments`, `electorates`, `referendum_questions`, `referendum_options`, `referendum_results`, `seat_allocations` | 11 |
| `political` | `parties`, `memberships`, `units`, `ideologies`, `positions`, `alignments`, `holders` | 7 |
| `calendar` | `events`, `links` | 2 |
| `organization` | `entities`, `identifiers`, `ownerships` | 3 |
| `finance` | `years`, `units`, `budgets`, `transfers`, `revenues`, `expenditures`, `entries` | 7 |
| `debt` | `loans`, `disbursements`, `repayments` | 3 |
| `procurement` | `tenders`, `bids`, `contracts`, `milestones`, `variations` | 5 |
| `statistical` | `periods`, `categories`, `indicators`, `fields`, `datasets`, `observations`, `dimensions`, `dimension_members`, `observation_dimensions`, `observation_derivations`, `vintages` | 11 |
| `civic` | `services`, `amenities`, `posts`, `deliveries` | 4 |
| `filesystem` | `stores`, `formats`, `folders`, `objects`, `files`, `versions`, `variants`, `attachments`, `uploads`, `events` | 10 |
| `source` | `publishers`, `documents`, `captures`, `methods`, `attributions`, `verifications`, `document_classifications` | 7 |
| `website` | `sites`, `domains`, `site_publishers`, `structures`, `structure_versions`, `structure_files`, `checks`, `families`, `domain_patterns`, `members`, `subjects`, `traits`, `relations`, `fingerprints`, `assessments`, `dossiers`, `domain_zones`, `dns_snapshots`, `document_sightings`, `section_visits` | 20 |
| `place` | `places`, `occupancies`, `occupancy_links`, `expectations` | 4 |
| `contact` | `points` | 1 |
| `audit` | `comments`, `evidence`, `decisions` | 3 |
| **`engine`** | **`migrations`, `jobs`, `match_candidates`, `match_clusters`, `gaps`, `gap_attempts`, `claims`, `claim_standings`, `quality_findings`** | **9** |
| **`staging`** | **`runs`, `candidates`, `issues`, `promotions`** | **4** |
| **`access`** | **`roles`, `permissions`, `role_permissions`** | **3** |

Extra engine-managed table: `geography.boundary_shapes`. Extra view: `access.account_permissions`. **Deprecated:** `organization.locations` was retired; an older document still lists it. Beware other documentation tables counts lag active contracts. A DB inventory query and migration/status reconciliation are required.

Repositories/docs that must inform subsequent work: `AGENTS.md`; `.docs/README.md`; `.docs/rules/branching-and-task-usage.md`; `.docs/rules/task-writing.md`; `.docs/rules/database-naming.md`; `.docs/design/data/DATABASE_DESIGN.md`; `.docs/docs/DOMAINS.md`; `.docs/design/architecture/DATA_LIFECYCLE.md`; `.docs/docs/ARCHITECTURE.md`; `.docs/design/acquisition/WEBSITE_DESIGN.md`; `.docs/design/geography/geography-model.md`; `.docs/design/data/PLACES_AND_PRESENCE_ASSESSMENT.md`; `dryv/contracts/`; `source/backend/api/src/modules/`; `.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/engine/database/migrations/`; and current pipeline/source mappings.

## 5. Recorded answers to all 18 architectural questions — preserve uncertainty

| # | Topic | User's expressed choice | Important qualification / status |
|---|---|---|---|
| 1 | Compression | **Decide individually after inspecting all tables and columns** | **USER REQUIREMENT** to remove invented prohibition on cross-schema FKs and introduce real enforced connections. No target schema count approved. |
| 2 | Names | **Short, understandable schema/table names; descriptive columns** | **USER REQUIREMENT:** comments on schemas, tables and columns. |
| 3 | Geography/place/contact | **Custom answer** | Geography and places **can be joined** (**USER LEAN**); determine where contact belongs (**OPEN**). |
| 4 | Person/org/governance/identity | Keep `person`, `organization`, `governance` and account concerns conceptually distinct | Follow-up specifically combines account `identity` with RBAC `access` into `auth`. **USER REQUIREMENT**. |
| 5 | Finance/debt/procurement | Move `debt` into `finance`; retain `procurement` separate | **USER DIRECTION** pending table-level audit. |
| 6 | Politics/elections/civic | Keep `political` and `electoral` separate; move civic services closer to governance | **USER DIRECTION**; do not blindly flatten all services or political data. |
| 7 | Events/news | Rename `calendar` to `activity`; include events, actions, news updates and links | **USER DIRECTION**; design publication and news provenance distinct from real-world events. |
| 8 | Legal | Keep `legal`; neutral, explainable worldwide model of constitutions, laws and lawmaking | **USER REQUIREMENT**, exact process model **OPEN**. |
| 9 | Website/source/audit | Link or consolidate appropriate `source`/`website` concerns; simplify confusion | **USER LEAN:** not aggressively; clean overlaps with `filesystem` and `staging`. |
| 10 | Reference/statistics | Both are confusing; make both clearer and more queryable while keeping and extending power | **USER REQUIREMENT**; exact split of taxonomies and statistical dimensions **OPEN**. |
| 11 | Geo/jurisdiction/legal columns | Explicit links in relevant tables, but **careful evaluation of alternative lookup tables and query behavior required** | **USER LEAN, NOT FINAL**. Evaluate high-to-low and low-to-high geographic querying; link legislation to high-level definitions where possible, avoid redundant instance-level legal links. |
| 12 | Procuring parties | Lean toward canonical `organization` identities and procurement participant roles | **EXPLICITLY NOT APPROVED**; user wants further discussion of procurer/supplier columns, contract types, dates and detail. |
| 13 | Storage | Keep `filesystem` metadata; connect a **shared, existing, independently deployed S3-compatible service** | **USER REQUIREMENT:** no new bespoke Docker object-storage service, no unnecessary duplication of object-store features. |
| 14 | File access | Use existing S3 service URLs/public and private URL facilities | **USER REQUIREMENT:** most publicly sourced files should be public when appropriate; no unjustified blanket privacy. |
| 15 | Acquisition classes | Eligible schemas need pattern tables and traceable classes; comments + Markdown; backend/UI create/edit/generate/sync | **USER REQUIREMENT**, exact metadata/table layout **OPEN** and must be evaluated carefully. |
| 16 | Pattern storage | Hybrid DB registry + execution outcomes + files/CSV for large definitions | **USER LEAN:** patterns are *mostly database-managed*; backend procedures/functions possible; exact approach **OPEN**. |
| 17 | Pipelines | Wants more explanation of how package/process architecture looks and works | **OPEN, NOT DECIDED**. Parallel independent pipelines, reusable agent/scrape/extract/file management features are requirements; microservice choice is not. |
| 18 | Correction/dedup | Different automatic-review rules by acquisition class, sensitivity, evidence quality and correction type | **USER DIRECTION**; field-level policy details **OPEN**. |

### User's additional decisions (outside the 18)

- `identity` + `access` → one understandable `auth` schema for authentication and RBAC; do **not** merge real-world people into user accounts.
- Separate operational `audit` from a **new `participation`** domain: government-official participation, public participation, received feedback, consultations and related participation concerns.
- Keep engine decisions, provenance and RBAC **conceptually separate** while permitting explicit FKs; no auth or audit clutter disguised as engine state.
- Consider gathering `staging`, jobs, data pipeline activities and processing state under a simplified `engine` schema if justified, to make operational review/auditing understandable and scalable. Dedicated engine database is a **much later** possibility, not a demand to split now.
- User controls when and how tasks are created **one by one in order**. No automatic task decomposition or implementation now.

## 6. Geography, jurisdiction, place and meaningful geographic connections

**User concern:** All important data must be geographically identifiable as appropriate, including jurisdiction-wide entities such as IEBC or national ministries. Previous behavior wrongly treated "country-wide" as "no geo unit"; only genuinely non-geographic or out-of-jurisdiction concepts may lack applicable geographic scope. Country-wide scope is a **root geography unit** (e.g., Kenya).

Model distinct facts separately:

1. **Jurisdiction:** the legal/administrative authority under which a record is established or registered.
2. **Scope/coverage:** territory served, regulated, represented or governed by a record.
3. **Location:** building/place/address where an office or actor physically sits.
4. **Presence:** branches or operational footprint in multiple areas over time.
5. **Activity/project delivery area:** where a procurement, service, intervention or event occurs.
6. **Representation/electoral geography:** electoral constituency/ward/seat represented.
7. **Statistical observation geography:** the geography **measured**, not automatically inherited by an organization.
8. **Historical geographic validity:** boundary changes, overlapping electoral/administrative hierarchies, polities not aligned to modern countries.

**Tradeoff raised by user:** If an observation belongs to a ward, can a Kenya query retrieve it? If a ministry belongs to Kenya, can county views discover it? Geographic hierarchy must support both *descendant→ancestor* and *ancestor→descendant* traversal; **do not equate "relevant in subarea" with "numeric observation can be disaggregated to subarea."**

Design candidates (none approved):

- Explicit `geo_unit_id` / `scope_geo_unit_id` and `jurisdiction_id` FKs on tables with singular semantics; structured junction tables for multiple roles/areas.
- Authoritative parent/child and typed relationships, with recursive SQL as baseline.
- Optionally maintain a date-aware `geography.unit_paths` closure/lookup (ancestor, descendant, kind, depth, valid time, with FKs) for frequent upward/downward queries; **benchmark first**, particularly overlapping historical hierarchies and maintenance complexity.
- Distinguish `geography.units` from physical `geography.places` even if merging PostgreSQL schemas.
- Resolve cardinality, expected presence and actual occupancy without fabricating locations or office occupants.
- Evaluate exact place/subject/contact ownership; do not duplicate contact values across person, source, organization and geographic place indiscriminately.

**Open questions:** Jurisdiction identity table location; whether one current root geo unit per modern jurisdiction is always valid; legal geography vs statistical geography; multiple overlapping unit systems; when to use junction tables rather than direct scope columns; how historical boundary changes affect queries.

## 7. Legal authority, legal processes, rules and patterns

**User concern:** The system must trace how laws, constitutions, Acts, Bills and other legal instruments establish institutions, offices, activities and pattern rules; how legislation is passed, enacted, amended, repealed and applied; and how different legal systems globally work **without making Kenya the universal template**.

The existing `legal.instruments`, `legal.provisions`, `legal.amendments`, `legal.changes` and `legal.links` should be examined first. Consider, but do **not preapprove**, structured support for `proposals`/Bills, `processes`, `proceedings`/stages, enactments, gazettes, commencement/effective dates, legal rules and applicability. The names and table split are open.

Necessary distinctions:

- Instrument **identity** vs edition/version; provision identity vs version.
- Constitutions, laws/Acts, regulations, orders, treaties, local legislation, other formal instruments and relevant historical/customary frameworks.
- A proposal or Bill is not an enacted Act; a gazetted notice, assent and commencement are distinct events where law requires them.
- Legislative processes vary by jurisdiction, institution, date and applicable law. A configurable legal procedure should describe stages; actual proceedings record what happened.
- Relations such as `established_by`, `authorized_by`, `appoints`, `regulated_by`, `amended_by`, `repealed_by` and `implements` need explicit, explainable semantics.
- Link provisions to `governance.rules`, patterns, institutions and legally controlled activities; prefer linking a common legal basis to a rule/pattern instead of redundantly copying the provision ID onto hundreds of generated instances. Keep exceptions where instance-level legal proof is meaningful.
- A legal basis is **not** proof of compliance; procurement compliance must be evaluated from evidence.
- Preserve amendment dates, validity, temporal context, dispute/source, and jurisdiction-specific hierarchy of legal authority.

**Assistant preference:** A neutral rule/process model with typed legal links and FK-backed relevant relationships; keep `legal` independent. **OPEN:** actual new tables, process vocabulary, law hierarchy and how to express one rule applicable to many patterns.

## 8. Procurement and public/private entities — priority vertical, NOT approved design

**User concern:** Kenyan public procurement sources identify procuring entities and suppliers, but often lack direct geo unit IDs. MZIZI must place **both** in a correct geographic and organizational context; extend tender/contract information; connect applicable law, institution, finance unit, procurement parties, award and delivery geography.

Current repository evidence: `.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/engine/data/src/mzizi_data/imports/procurement.py` imports public-procurement portal entities (including county/city/address where available), OCDS parties, tenders, suppliers and contracts into staged canonical candidates. `organization.entities`, `organization.identifiers`, `finance.units`, `place.places` and `place.occupancies` already participate. The importer links county where it has information; it does **not** establish verified supplier county coverage from a mere supplier name.

**Critical different facts:** buyer, procuring entity, finance/contracting unit, bidder, awardee, supplier, registered legal entity, headquarters location, contract implementation site, service area, legal jurisdiction and procurement-law applicability. A supplier registered in Nairobi may fulfill a contract in Turkana; a Nairobi-based national ministry's activity may be nationwide. Do not impose company headquarters on its procurement/project geography.

**User lean:** Both procuring entities and suppliers should reuse canonical `organization.entities` identities; `procurement` should store roles and processes rather than duplicate organization identities. User expressly said: **"more discussion here do not mark as approved I will need to think about this"** and wants explicit consideration of columns for procurer/supplier, contract types, dates and all important details.

**Assistant suggestions for evaluation, NOT decided:** `procurement.processes`, `tenders`, `bids`, `awards`, `contracts`, `parties`, `items`, `locations`, `milestones`, `variations`. Keep direct `procuring_entity_id`, `buyer_id` or `supplier_id` FKs where singular and predictable; use role junction tables when multiple parties or roles are possible. Use external identifiers including OCIDs when available; preserve history of identifier aliases and supplier entity matching. Do not assume a single awarded supplier per contract.

Research candidate linkage hierarchy:

1. Verified direct geographic evidence (official address, stated jurisdiction/scope, delivery place).
2. Verified identity/structural relationship to a scoped institution or local office.
3. Plausible text/name/address/geocoding inference **as an unverified proposal only**.
4. Unresolved, rather than inventing a county.

**OPEN:** canonical identity vs role tables; which direct party columns; public vs supplier identifiers/contact treatment; contract details and variants; award/cardinality; location resolution; PPIP/e-GP/OCDS mapping; what receives legal scope and geo link; how to repair already imported disconnected rows.

## 9. Correction, historical truth, entity matching, hashing and redundant research avoidance

Data must be safely editable when research changes. This is **not** permission for silent overwrite.

Differentiate:

- **Correction of an erroneous assertion:** an old statement was wrong.
- **Real-world transition:** an official leaves, a boundary changes or a law is amended; the earlier statement can still be historically correct.
- **Expectation revision:** a pattern's predicted office or location is contradicted, withdrawn or superseded.
- **Duplicate-identity resolution:** two source records represent one canonical identity, with reversible alias/merge history and preserved evidence.
- **Contradictory evidence:** keep rival claims and review status rather than arbitrarily selecting one.

Required metadata where applicable: valid time (when true), recorded/researched time (when known), original and corrected values, source captures, method/tool/version, review actor, rationale, confidence, policy/decision and prior canonical version. Different fields may have different correction thresholds; never delete source evidence to disguise an error.

Current foundations to reuse rather than re-create:

- `engine.jobs` with input hash, generation, retries and concurrent worker claiming.
- `staging.candidates` with natural-key and payload hashes and superseding candidate mechanism.
- `engine.match_candidates` and `match_clusters` with evidence-weighted deduplication for people/orgs.
- `engine.quality_findings` for reproducible quality anomalies.
- `engine.claims` and `claim_standings` for proposed field values, competing assertions and dispute status.
- `source.attributions`/`verifications` and `audit.decisions` for review/provenance.
- `filesystem.objects` hashes, `filesystem.versions`, `source.captures` for evidence custody.
- `website.fingerprints` for page structural similarity (not equivalent to file content hash).
- Statistical derived-value lineage and stale-input detection.

**Known design limit:** Current `engine/database/src/claims.ts` supports a narrow approved list of *annotation-fill* fields and refuses overwriting conflicting non-empty values. A new **review-controlled factual correction/supersession pathway** is needed, not a blanket change of that safe default.

Hash/dedup stages to evaluate:

| Level | Proposed stable key/change detector | Skip/reprocess rules |
|---|---|---|
| Site/resource | Source identity, canonical URL, provider record ID, retrieval status/headers | Revalidate per refresh policy; URLs can change content |
| Immutable object bytes | SHA-256 of bytes + relevant storage identity | Reuse matching safe object; preserve all capture/link metadata |
| Relevant extracted content | Normalized/segmented content hash | Detect semantic-relevant change vs HTML boilerplate change |
| Extractor result | Input object/version + extractor version + config hash | Reuse compatible results, rerun if tool/config improves |
| Imported candidate | Target table + natural key + normalized payload hash | Skip exact repeat, stage meaningful differences as new versions |
| Domain identity | Authoritative identifier(s) + cross-evidence match | Never merge on name only; flag ambiguity |
| Derived record | Input version set + formula code/version/options | Recompute only when dependency/recipe changes |
| Generation | Pattern version + input identities/versions + scope + execution policy | Deterministic compare/sync; do not duplicate generated rows |

Do not confuse hash equality with entity identity, or matching websites with legal permission to collect. Refresh and retention schedules and required authorizations are **OPEN**.

**User policy direction:** Different automation/review rules by data class, field sensitivity, source quality and correction type. Propose a clear per-domain/per-field policy matrix before enabling autonomous canonical edits.

## 10. Source, website, evidence, staging, review and audit simplification

**User concern:** Website/source/filesystem/staging are currently confusing and in some places overlap. Reduce AI-added complexity without losing needed website structure, provenance, legal collection approval, document capture or review correctness.

Separation to preserve conceptually, even if schema names change:

- **Website registry:** site identity, domains, verified relationship to publisher/institution, site family, structure definitions, domain/DNS monitoring and source discovery.
- **Source/evidence:** publishers, logical documents, captures/sightings, extraction provenance, claims, attributions and verifications.
- **Filesystem:** logical files, blobs referenced in the existing object store, versions, tags/folders and attachments; **not** legal or semantic ownership of claims.
- **Pipeline/execution/staging:** jobs, runs, extraction outcomes, candidate validation and promotion state; **not** published canonical truth.
- **Audit:** durable record of review decisions and system/user actions; **not** public feedback.
- **Participation:** public/officer interaction and consultations; **not** internal pipeline reviews.

**Assistant proposal, not approved:** Streamline or partially consolidate `website` and `source`, classifying each of the existing 20 website tables as source-discovery data, domain identity, processing state or derived monitoring. Remove duplication only after checking APIs and migration paths. Keep collection-authorization / legal source assessments and immutable raw captures in place.

Unresolved: where site patterns/structures live; whether crawler visits/checks/DNS snapshots belong to source or engine; source document vs filesystem file semantics; whether one publication has many captures, formats and sites; how to enforce typed FKs for generic attribution targets without a gigantic generic entity table.

## 11. Statistics and reference classification clarity — maintain power

**User concern:** `statistical` and `reference` are difficult to understand. Simplify their concepts and query experience, **without making statistical modeling less powerful**. Jurisdiction and reference linkage must be traceable, queryable and FK-enforced.

For statistics, preserve and revisit explicit:

- Indicators, categories, datasets and source/publication editions.
- Time periods and date/calendar semantics.
- Unit-of-measure, measurement kind, count vs rate vs percentage and denominator.
- Geographic unit of the observation and different spatial/reporting hierarchies.
- Dimensions and dimension members, with clean join tables; multiple applicable dimensions (age, sex, urban/rural, etc.).
- Survey/census/projection/administrative/derived estimates.
- Vintages, revisions, confidence/uncertainty, margins/standard error where available.
- Aggregation and compatibility: a rate cannot simply be summed; differing vintages should not be compared without explaining them.
- Formula and input lineage for derived outputs.
- Historical geography/version and producer/source differences.
- Coverage matrices, missing vs zero vs unknown, validation and refresh methods.

For reference, audit the overloaded `reference.classifications` scheme/key patterns, consider `schemes` and `values` with domain-specific tables where classification has real behavior. **A FK to a generic classification value alone does not ensure it belongs to the expected scheme.** Consider composite FK/check designs or explicit per-domain lookup tables; do not scatter meaningless/unvalidated `type_id` values.

**Sources/data goals:** KNBS and other government statistics; IEBC candidates, voters, elections and results; national/county government leadership; Cabinet Secretaries; SAGAs/state corporations; public funds; procurement; people/public figures; geographic unit relationships and historical changes. Define source and scope for each domain without claiming every external dataset is present already.

## 12. Additional domain-by-domain restructuring directions

| Existing domain | User direction / audit requirement | Assistant option to evaluate — not yet approved |
|---|---|---|
| `reference` | Clearer vocabularies and jurisdictions with hard FKs | Separate schemes/values and important domain-specific types |
| `geography` + `place` | May consolidate; geography must support all jurisdictions and scope types | Retain distinct unit/physical place tables under one schema; hierarchical traversal/closure |
| `contact` | Find where it truly belongs | Consider shared contacts or explicit typed owners; don't force merge blindly |
| `person` | Keep a distinct domain | Stable human identity, names, profile, handles and history |
| `organization` | Keep distinct, canonical public and supplier identities | Strong external IDs, aliases, affiliation vs legal identity |
| `governance` + `civic` | Move services closer to governing organizations | Keep service-delivery concepts distinct from offices and office holders |
| `political` | Separate from electoral | Parties, internal offices, memberships; temporal affiliation |
| `electoral` | Separate from political | Seats, voters, candidates, results, ballot data; geo/legal temporal consistency |
| `legal` | Neutral law/constitution process modeling worldwide | Procedure versions, proposals, provisions, enactment relationships |
| `finance` + `debt` | Move debt into finance | Evaluate budgets, borrowing, funds, transfers, accounts and public projects |
| `procurement` | Keep independent, representation **OPEN** | Processes, party roles, awards, contracts, sites |
| `calendar` | Rename to `activity`, add news/actions | Events, actions, updates and typed links; source article remains evidence |
| `statistical` | Clarify while improving analytic power | Enhance reusable dimensions, vintages and derivation provenance |
| `filesystem` | Keep, improve; existing external S3 store | Tags, folders, logical files, versions and reusable attachments |
| `source` + `website` | Simplify carefully; remove ambiguous overlap | Group source discovery vs verified source/capture vs operation |
| `identity` + `access` | Merge into understandable `auth` | Accounts, credentials/subject identity, roles, permissions, grants |
| `audit` | Separate from participation | Append-only decisions/actions with authorized actor context |
| **new `participation`** | Government officials, public participants and feedback | Consultations, submissions, responses, comments, links and moderation; exact tables OPEN |
| `engine` + `staging` | Explore clearer unified execution/process concern | Orchestration, runs, candidates, reviews, claims, patterns; don't merge blindly |

**Assistant-only suggestions not accepted as fixed scope:** an eventual `planning` domain for official plans/programmes/objectives connecting laws, institutions, spending, procurement and measured results; a broad typed relationship model; any final target number like "18–19 schemas". Only consider after full schema/column audit and user discussion.

## 13. Filesystem and the existing external S3-compatible storage

**User requirement:** The object-storage service is **already deployed** and shared. MZIZI should **connect** to it, **not install another service/container** or create custom object-storage machinery.

**Object store owns:** bytes, object read/write/delete mechanics, bucket storage, service-side access and public/private URL mechanisms, and any supported storage-native functions.

**MZIZI `filesystem` owns:** logical folder structure, tags, ownership/attachment to records, names and aliases, current and historical file versions, metadata, logical visibility/access intent, hash/duplicate tracking, legal custody associations as references, media classification, search, clean lifecycle, and mapping objects to the remote store. Avoid duplicate uploader/multipart/retention logic already supplied by the existing service unless MZIZI-specific workflow requires it.

**Current tables for deliberate review:** `stores`, `formats`, `folders`, `objects`, `files`, `versions`, `variants`, `attachments`, `uploads`, `events`; proposed `tags` and `file_tags`. Review whether logs/events/uploads live in `filesystem` or `engine`; preserve immutable source artifact versions.

**Visibility preference:** Public documents downloaded from public official sources should usually be accessible via public URLs **where reuse/publication is lawful**; do not impose blanket privacy. Private/restricted content gets the deployed service's private access URL mechanism as needed. Do not expose object-store credentials to frontends. Access, licensing, PII and copyright still need explicit policy, not assumptions.

**Open integration facts:** remote endpoint and SDK compatibility; auth method; bucket names/namespace; URL origin/redirect/CDN; upload and download contracts; public and private URLs and TTL; object versioning support; access review; expected file sizes; soft/hard deletion and retention; cross-app usage. Do not invent service details.

## 14. Independent concurrent pipelines; reusable standalone feature packages

**User wants:** Instead of a monolithic current data engine, have multiple data pipelines, each independently runnable and concurrently working toward the **same shared goal** or completely **different goals**. Reusable packages should implement standalone capabilities such as **agent orchestration/AI, scraping, file management client, extraction, normalization, geographic matching, deduplication, pattern generation, legal/source compliance and validation**. User said exact architecture was **not decided** and needs explanation, examples and alternatives.

Current repo: `.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/engine/data` is Python with many importers and extractors; `.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/engine/database` is Bun/TypeScript with migrations/seeding/validation/promotion; `.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/files` and `.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/intelligence` are largely README scaffolds. `engine.jobs` already provides hash-based idempotency, worker claims and retries. Preserve working capabilities in any reorganization.

Concepts to separate:

- **Pipeline**: complete domain workflow, e.g. county leadership, procurement, statistics, law publications, website registry.
- **Reusable package**: focused step such as fetch, file upload, PDF/HTML extractor, entity matcher, agent evaluation, policy validator.
- **Orchestrator/scheduler**: selects goals, expands inputs, manages dependencies, concurrency/rate limits, retries, progress and cancellation.
- **Worker**: independently running processor executing a pipeline or step.
- **Canonical promotion**: independently governed database boundary; not an arbitrary scraper write.

**Illustrative only, not approved code layout:**

```text
source/backend/
  pipelines/
    kenya-county-leadership/
    kenya-procurement/
    statistics/
    law-publications/
    website-discovery/
  packages/
    pipeline-sdk/
    source-client/
    file-client/
    scraper/
    extractor/
    agent/
    matcher/
    validator/
    pattern-generator/
  workers/
    scheduler/
    runner/
  engine/
    database/
  api/
```

Example flow: for each of 47 counties independently discover approved sources → fetch only when required → store/reuse content-addressed artifact → extract/reuse result if same input + tool version → match person/office → candidate → validate → review → promote. County leadership and procurement can run in parallel, but shared inputs/artifacts must not be duplicated. Steps can depend on other pipelines' outputs without forcing all pipelines into one synchronous transaction.

**Assistant leaning:** Begin with modular packages and independently runnable workers, shared durable PostgreSQL orchestration and clear contracts; split into separately deployed microservices only when throughput/failure/isolation demands it. **Not approved.**

**Alternatives to compare later:**
1. Independent in-process plugin pipelines with a shared job queue.
2. Independent workers/processes using shared library packages and DB.
3. Multiple deployed services communicating via queue/events.
4. Hybrid modular packages/workers with central run ledger and optional external message broker.

**Architecture questions OPEN:** Python vs Bun/TypeScript package boundaries; reusable contract format; command/CLI and UI API; sub-task granularity; pipeline definitions stored as code vs DB; concurrency quotas per publisher; resource budgets; shared run goals and dependencies; pause/retry/resume/cancel; partial failure; deterministic testing; provenance of AI prompts and model versions; metrics/alerts; user approval gates; idempotency and consistency model; backfill strategy.

## 15. Auth, audit, engine, staging and participation concerns

- **`auth`:** merge account `identity` and RBAC `access` (accounts, grants, roles, permissions, role-permission links, account permissions). Keep real-world `person` separate. Consider explicit FK from `auth` account to optional person only when relationship is valid; not every public official has an app account.
- **`participation`:** new domain for meaningful participation by the public, public officials and other authorized participants. Explore consultations, submissions, questionnaires, replies, official responses, feedback, attachments, statuses and moderation. Preserve original participant statements, time and geographical/legal subject. **Do not confuse participation feedback with a pipeline reviewer deciding whether a scraped record is canonical.**
- **`audit`:** immutable, traceable review decisions, corrections and system actions with FKs to identities and relevant records where enforceable. Do not mix with public comments merely because both are "comments".
- **`engine`:** simplify operation state: pipeline definitions/versions, goals, runs/jobs/dependencies, patterns, generation outcomes, gaps, candidates, issues, review state, quality findings, match suggestions, claims and promotion outcomes. Do not assume every listed object needs a standalone table; start with existing `engine`/`staging` objects and remove duplication.
- **Future**: if performance/security demands another engine database later, that is a distinct, separately approved architectural change. Strong cross-schema FKs inside today's canonical DB mean such separation is **not** free.

## 16. Hard FKs, generic references, schema/column comments, and migration design

**USER REQUIREMENT:** Legacy "no FK between schemas" doctrine must be removed in the **future approved redesign**; current `.docs/rules/database-naming.md` section 7, `.docs/design/data/DATABASE_DESIGN.md` principle 2, generated Dryv relationships, integrity engine, `AGENTS.md`/architecture references and any resulting assumptions must all be audited and updated together. **Do not edit those older files now:** this document is the only authorized change.

Assistant recommended default:

- Known target table → **real PostgreSQL FK**, including `governance.institutions.jurisdiction_id` → `reference.jurisdictions(id)` and `scope_geo_unit_id` → `geography.units(id)` where semantics are correct.
- Important historical rows should not be deleted by indiscriminate cascading; choose `NO ACTION`/`RESTRICT` and planned soft retirement/versioning.
- Composite FKs/checks when scope/jurisdiction/type compatibility matters. Index referring columns as justified by query plans.
- Explicit junction tables for many-to-many associations and relationships with their own attributes.
- Evaluate true exceptions for flexible target kinds; `target_kind + target_id` is **not** a hard FK. Compare domain-specific typed association tables with a strongly maintained canonical-record registry. A registry alone cannot magically prove the specific domain row exists without transactional/integrity enforcement.
- Keep stable entity identity separate from version identity if required; ensure FKs do not point at historical versions accidentally.
- PostgreSQL comments for every schema/table/column, plus documented meaning and allowed acquisition classes. Machine-readable registry/Markdown should stay synchronized with generated entities and migrations.
- Verify that Dryv/TypeORM can express cross-schema relations before implementation. If generator limitations exist, plan support explicitly; do not silently mix generated and drifted constraints.
- Before adding FKs to populated tables: find orphans, duplicate natural keys, mismatched types, invalid geo links, historical ID collisions. Use staged backfill and validated constraints; reconcile row counts and links.
- Every destructive rename/merge needs data migration, API contract updates, version/lineage preservation, backwards compatibility assessment and a recovery plan. No production reset.

**OPEN:** policy for nullable geo/legal references; all generic attribution/link/attachment designs; FK on polymorphic claims; stable ID/version design; how deeply to enforce reference scheme compatibility; exact handling of hierarchy, historical validity and cyclic relations.

## 17. Proposed directions, explicitly NOT final schema approval

An earlier assistant sketched **about 18–19** target schemas with `reference`, `geography` (possibly absorbing `place`), `legal`, `person`, `organization`, `governance` (possibly absorbing `civic`), `political`, `electoral`, `finance` (absorbing `debt`), `procurement`, `statistical`, `activity`, `filesystem`, simplified `source`/`website`, `auth`, `audit`, `participation`, `engine`, and possibly `contact` pending placement.

**This number and catalogue are a discussion aid only**, expressly subordinate to user's primary decision: **audit every schema/table/column before choosing how much to compress**. Do not write code or task acceptance criteria assuming a number of schemas, a merged `source`, a particular `contact` home, a final `legal` taxonomy or a chosen procurement party design.

Prior assistant suggestions the user appeared receptive to, but did **not** approve as specifics:

- One geography schema with distinct geo units and physical places, plus well-typed scope/location and possibly closure paths.
- Neutral legal procedure/rule model that drives patterns.
- Strong FKs for known relationships, typed junction tables for many-to-many.
- Canonical organization identity reused for suppliers and public bodies; flexible procurement participant roles, but user explicitly reserved judgment.
- Central pattern registry with per-domain definitions, versioned executions and admin management.
- Evidence, files, audit and execution as separate responsibilities despite possible schema compression.
- Content-aware reprocessing instead of unconditional re-download and duplicate imports.
- Modules/worker packages first, rather than premature independently deployed microservices.
- Small `planning` domain later for public objectives and measured outcomes (assistant idea only; not requested as an immediate change).

## 18. Explicit future decisions / research questions register

The items below are **unresolved and must not be silently decided by an implementing agent**.

| ID | Area | Decision required | Suggested way to decide |
|---|---|---|---|
| D01 | Inventory | Which tables/columns actually exist in deployed PostgreSQL, and which migrations drift from Dryv? | Read-only schema/constraint/row-count audit |
| D02 | Compression | Final schema list and exact keep/merge/rename/split/remove decisions | Full per-column audit and domain ownership matrix |
| D03 | FK strategy | Typed junctions vs constrained canonical registry for evidence/files/audit; historical version FKs | Prototype real cross-schema constraints and representative queries |
| D04 | Jurisdiction | Where `jurisdictions` belongs; how legal root geo is related; nonmodern/historical cases | National/region/historical worked examples |
| D05 | Geography | Parent/recursive queries vs temporal closure table; overlapping hierarchies | Real query plans for country/county/constituency/ward and history |
| D06 | Geo usage | Which tables need jurisdiction/scope/place/delivery geography vs junctions? | Column semantics matrix and coverage report |
| D07 | Contact | Independent shared contact or domain-specific contact tables? | Trace all current callers and PII/access requirements |
| D08 | Legal | Proposals, process steps, provisions, links, gazettes, rule table design | Cross-jurisdiction case studies; historical-law validity |
| D09 | Procurement | Supplier/procurer direct FK columns vs participant roles, awards, multi-party contracts | Official PPIP/OCDS examples, exact contract schema requirements |
| D10 | Source/website | Retained sites/domain families, structures and source assessment; monitoring ownership | Table-by-table overlap audit |
| D11 | References | Schemes/values vs strong typed lookup tables; FK scheme validation | Examine all `type_id`/`kind_id` fields and queries |
| D12 | Statistics | Dataset/series/dimension/vintage/derivation representation and aggregation rules | KNBS/IEBC real dimensional datasets |
| D13 | Patterns | Registry/table storage vs file-backed rules; domain pattern extensibility | Sample county offices, ministry roles, web structures |
| D14 | Pattern execution | SQL procedures vs workers; safe dry-run/preview/sync and retirement | Deterministic prototype and correction tests |
| D15 | Classification | Per-table comments/docs vs per-record lineage and schema tags; enforcement | Metadata contract and audited UI examples |
| D16 | File access | Existing S3 endpoint/URL/API contracts, public/private policies and tags/folders | Integrate against deployed service's actual documentation |
| D17 | Pipelines | Worker/package/service topology, programming languages, orchestration and concurrency | Two independent verticals running simultaneously |
| D18 | Correction | Automatic/reviewer rules by domain, sensitivity, confidence and action | Policy matrix with wrong fact, historical change, merge examples |
| D19 | Auth/audit | Where authentication actions, review decisions, participation and engine actions live | FK/permissions/access matrix |
| D20 | Participation | Official/public participant identity, moderation, statuses, public visibility and filing | Use cases for legislation, county services, public feedback |
| D21 | Migration | Drift checks, deployed data safety, temporary compatibility and rollback | Dry-run/backfill plan before any real migration |
| D22 | Tasking | When user wants task group and each ordered task created/started | **Wait for direct user's instruction** |

## 19. Proposed review sequence — guidance, not created tasks

This section documents possible **future task boundaries** only. It must **not** be automatically imported as tasks or treated as a backlog ready for execution.

1. **Ground truth and terminology:** inspect deployed DB/schema, Dryv contracts, migrations, docs and data volumes; prepare full per-schema, per-table and per-column inventory; identify stale documentation and illegal/unconstrained references.
2. **User-led per-domain sessions:** discuss `reference` and `geography/place/jurisdiction` first (foundational IDs and scope), then `organization/person/auth`, `governance/civic`, `legal`, and downstream domains; record options and user decisions for each table and column.
3. **Data acquisition across all domains:** map static seeds, pattern seeds, automated collections and derived data, plus expected coverage, source readiness, lineage and change handling.
4. **Cross-domain integrity:** compare direct FK, junction and generic reference alternatives; plan geography, legal and procurement linking with representative real queries.
5. **Historical/versioning/correction policy:** define stable identities, temporal semantics, claims and evidence workflows, dedup and safe correction classes.
6. **Approve target database structure:** only when user agrees on table moves, naming, comments, FK policy, patterns, participation and engine boundaries; design non-destructive migrations.
7. **Filesystem/existing S3 integration design:** first inventory current file tables and deployed storage contract; plan logical file features, public/private access and dedup.
8. **Pipelines design:** assess independent pipeline packages and worker options; design concurrent example verticals; define shared contracts/orchestration and observability.
9. **Later user-directed implementation:** create Taskcode group/tasks **only as directed one by one**; make narrow, reviewable changes on `develop`; keep `main` production-ready; do not alter GitHub workflows without explicit consent.
10. **Verification and rollout:** only after implementation approval, perform agreed tests, drift checks, FK/backfill validation, API compatibility checks, data coverage/quality checks, rollback preparation and staged deployment.

Within a future *per-table audit*, document: existing table and column list → current meaning/problems → acquisition classes and patterns → proposed table/column/FK shape → relationships/queries → correction/versioning/access → data migration implications → alternatives/tradeoffs → **user approval status**. No individual "recommended" field may be interpreted as accepted without later confirmation.

## 20. Constraints, risks, and explicit non-goals for this document

- **No implementation authorization.** Do not edit old database rules yet, even though the user has rejected their no-cross-schema-FK principle; its removal is a planned future change requiring coordinated migration/contracts work.
- **No Taskcode tasks or task group now.** The user expressly chose a stand-alone improvements document instead. The project's normal Taskcode requirements resume when the user directs task creation; do not quietly backfill automatic tasks.
- **No database writes, migration execution, data reseeding or destructive correction.** Deployed database was not accessed for this planning document.
- **No new object-storage Docker service.** Connect the existing user-supplied service once details are obtained.
- **No automatic assumption that everything is private or that every public website is freely republishable.** Access and legal capture permissions still matter.
- **No artificial data filling** merely to satisfy expected counts, and no automatic merging identities on names alone.
- **No blind merging of all tables or premature separate databases/microservices** for their own sake.
- **No hard-coded global rule derived only from Kenya**, especially for jurisdiction, law, elections, public administration and history.
- **No unverifiable live row counts or schema statements.** Counts in this doc are from code at the stated reference, not a production DB inspection.
- **No edits to `.github/**` or new branches. Documentation work (this file) is the only currently requested repo change.

Risks to revisit: constraint creation on existing orphans, ongoing ingest concurrency, breaking API clients, source licensing, historical identity changes, closure-table correctness with overlapping temporal hierarchies, object-storage URL semantics, generation changing verified records, mixing public participation with audit, and exploding generic schema references into unmaintainable tables.

## 21. Assistant's official design assessment and preferences — distinguish from approvals

1. **Agreement with strong cross-schema FK goal.** PostgreSQL relationships should be real wherever targets are structurally known. Earlier schema independence rule created needless soft-reference fragility for today's integrated database. Retain documented exceptions only where an actual FK cannot express the relation.
2. **Do not optimize solely for fewer schemas.** Consolidation is useful when domain ownership becomes easier to explain, not when unrelated table semantics get hidden together. Review every column first as the user required.
3. **Geography needs role-aware scope plus efficient hierarchy queries.** A nation-scoped institution is visible to the relevant county view, but geography inheritance is not automatic numerical disaggregation. Consider closure tables only with benchmarked value.
4. **Law should explain structure and history.** Legal links typically belong to the establishing rule/pattern, with generation lineage to outputs; actual legal events and compliance claims require independent evidence.
5. **Canonical organizations and procurement roles** reduce entity duplication. However, mixed direct role columns plus participant junction tables is a suggestion pending explicit procurement discussion.
6. **Pattern generation must be inspectable and reversible.** Database-managed registry, immutable versions/runs, dry-run diff, human overrides and approved propagation to canonical records are more important than automatically maximizing record counts.
7. **Keep evidence, byte custody, operation and participation separate** conceptually even if some schemas are consolidated. Reuse one canonical source artifact instead of copying blobs or conflating a site with a file.
8. **Use the existing S3-compatible deployment.** MZIZI should be a rich logical file manager on top of it, not another object storage implementation.
9. **Prefer modular packages plus independently runnable workers first**, compared with many premature microservices. This reduces coordination cost while supporting concurrent data workflows and stronger reuse; still subject to user selection.
10. **Build correction policies that separate error correction from history.** Safe defaults: immutable source captures, versioned canonical history, review of consequential replacements and strong identity-resolution evidence.
11. **Make the schema understandable to humans and machines.** Consistent comments, clear names, FK constraints, schema inventory, acquisition-class documentation, and examples of common queries are core requirements, not cosmetic additions.
12. **Defer major migrations and task creation** until the user approves the granular design and directs the next step.

## 22. How to use and maintain this register

This file is the **discussion and planning record**. It captures decisions up through the 2026-11-07 conversation. It is **not a replacement for future official decisions, migration specifications, Taskcode groups or per-table design docs**. When the user returns:

1. Read this register and the current `develop` code/docs first; confirm whether branch/schema/engine details have changed.
2. Ask only for truly unresolved decisions relevant to the **next user-selected domain**; do not re-ask settled questions.
3. When user offers a new proposal, label it as user requirement, user lean, recommendation or open; keep historical rationale and flag superseded assumptions.
4. Keep this document updated as a planning record when explicitly asked. Do not automatically create tasks from its sequence.
5. **Wait for the user's explicit instruction about how and when to make Taskcode tasks one by one.**
6. Only after separate implementation approval, update the actual rule/docs/contracts/migrations and run permitted verification. Apply changes directly on `develop`, never `main`.

**Final handoff status: PLANNED / UNDER DISCUSSION / NOT READY FOR IMPLEMENTATION.**


## 23. Subsequent user clarification (2026-11-07): keep the documentation compact; website-to-Markdown and semantic change detection

**User's newer direction, after this master register was written:** They like a dedicated `schema-redesign/` folder for individual database designs, but explicitly **do not want too many documentation files**. The remaining cross-cutting concerns should fit into a **few** coherent planning documents. They also reiterated that the discussion contained many other important hotspots and must not be reduced to only one topic.

The user now specifically wants:

- A clearly documented **two-category / four-subcategory classification** including table eligibility, schema planning tags, domain patterns, generation/sync lineage, correction and review.
- A file manager integrating their **already deployed self-hosted S3-compatible instance**: clear logical files/folders, grouped tags, metadata and hashing, public URLs where appropriate, private access only when justified, no home-made replacement of the storage provider.
- A materially stronger **site structure and extraction design**. Convert useful site/page content from HTML/JavaScript-rendered pages into **well-structured, human/agent-readable Markdown** rather than treating huge HTML/CSS/JS source files as the primary research output. Preserve accurate dates, headings, tables, links, attachments and citations. CSS and JavaScript inform visible/rendered content; they are not themselves mechanically rewritten as Markdown.
- **Site-level, page-level and DOM/section/tree-level hashing** to detect meaningful changes, avoid repeated downloads and processing of unchanged content, and correctly remap changed sections into Markdown and structured candidates.
- Independently executable/concurrent pipelines with reusable agent, scraper, renderer, file-client, extraction, matching, validation and pattern-generation features. The exact architecture still awaits the user's decision.
- **No wholesale creation of Taskcode groups/tasks or schema-specific placeholder files.** The user will guide the detailed reviews and tasks one at a time, in sequence.

The master register remains the **complete archive of prior decisions and concerns**. Focused documents were added instead of splitting every paragraph into separate files:

1. [Planning index](../README.md): explanation and compact cross-reference.
2. [Schema redesign folder](../schema-redesign/README.md): per-schema/table/column review template; add new schema files **only when selected by user**.
3. [Data classes and patterns](data-categories-and-patterns.md): seeded/static, seeded/pattern, collected, derived and their controlled life cycles.
4. [Filesystem and external S3](file-management-and-s3.md): logical folder/tag/file management and integration boundaries.
5. [Website structure, hashing and Markdown extraction](site-structure-and-markdown-extraction.md): content/rendering/tree hashes, conversion, evidence and change-aware mapping.
6. [Independent data pipelines](independent-data-pipelines.md): concurrent goals, reusable packages, orchestration, workers and competing architecture options.

**Status unchanged:** Documents are proposals. The user has not approved the final table/column designs, pattern storage model, procurement roles, live S3 integration, Markdown extraction implementation, worker topology, task creation or repository code changes.


## 24. User-directed creation of all 18 schema planning documents

The user subsequently requested that `.docs/_plan/schema-redesign/` actually contain the **full named set of 18 detailed schema design documents** (reference, geography, legal, person, organization, governance, political, electoral, finance, procurement, statistical, activity, filesystem, source, auth, participation, audit and engine). Those are now present and linked from [schema redesign README](../schema-redesign/README.md).

This **supersedes** the earlier documentation-file preference to create domain-specific review files only when each schema is selected. It does **not** supersede the user's restrictions on implementation: they have requested documentation, **not** a final approved schema DDL, task group, automated Taskcode tasks, migrations, code or deployment. The files deliberately distinguish current table inventories, suggestions, confirmed direction and pending user approval. Column details based on old migrations are explicitly baseline evidence rather than a verified live-current column-by-column audit.

The user's preference for **only a few non-schema cross-cutting documents** remains in effect.

## Related source redesign planning

See [source redesign and adaptive website intelligence](../source-redesign/README.md) for the consolidated planning-only review of unknown-site discovery, link/URL deduplication, optional YAML structures, semantic retrieval/ML, incremental processing, the dedicated vector index alternatives and the shared pattern-schema option. **No source/website collapse, new pattern schema or target table set has been approved.**


## 25. Human pattern decisions: reference ownership, cascaded canonical data and DB watchers (2026-11-07)

Newest user input qualifies the prior suggestion of a dedicated `pattern` schema. **USER LEAN:** manage shared, DB-backed **pattern and watcher definitions in `reference`** alongside jurisdictional/classification data. **USER DIRECTION:** patterns derive from existing verified jurisdiction/geography/legal and other relevant records, can produce **real incomplete canonical rows** instead of default `expectations` output, and those outputs may become prerequisites for further pattern applications. These dependencies need versioning, verified establishment thresholds, stable IDs, non-destructive reconciliation and traceable provenance.

**OPEN:** exact hard-FK mechanism linking generated rows and multiple contributing patterns; real physical place/presence row versus an unresolved address/occupancy gap; whether a separate `pattern` schema is still justified after reference-domain review. The user prefers **mostly database-managed manifests with approved immutable filesystem versions**.

**USER REQUIREMENT:** generic pattern/watch code must be country-neutral: IEBC, KNBS, ORPP, Kenya law and country counts are **manifest/seed/source-adapter context**, not hardcoded branches in universal scheduling, gap-checking, pattern evaluation or repair. Existing `reinforcement.py`, `gapclose.py` and `patterns.ts` are concrete code points to assess in a future approved refactor.

No schema-count change is implied by placing patterns in `reference`. No code change, migration or Taskcode task is authorized. Detailed plan: [Data classes and pattern DAG](data-categories-and-patterns.md); [reference schema review](../schema-redesign/mzizi-db/phase-01/reference.md), [geography schema review](../schema-redesign/mzizi-db/phase-01/geography.md), and [engine schema review](../schema-redesign/mzizi-operational-db/engine.md).


## 26. User requirement: remove unjustified temporal/precision/current columns; consider selective soft deletion (2026-11-07)

The user explicitly rejects automatically inserting `valid_from`, `valid_to`, `valid_from_precision`, `valid_to_precision` and `is_current` into every domain record. These attributes should be present **only where the particular entity, relationship, evidence or business rule actually requires them**. The same design test applies to other rigid, templated flags/status/version/audit columns: adding a field requires a clear reason. **USER REQUIREMENT** for the redesign, **not permission to drop anything in the deployed DB yet**.

**Illustrative user examples:** `governance.holders` needs its own actual appointment/term dates. `governance.offices` often derives legal applicability from a versioned pattern established by `legal` rather than repeating the pattern's effective period; independent office closure/opening/abolition may still need separate lifecycle facts. Precision fields are usually unnecessary for precise modern appointment and contract dates. A pattern's validity and an office's actual operational history must not be conflated.

**Original migration survey (not live DB):** `1793607856459-initial.ts` originally creates 103 tables: 73 have both generic validity dates, 70 have date precision pairs, 70 have `is_current`, 103 have `created_at`/`updated_at`/`version`, none have `deleted_at`. Review current entity/migration/live metadata before any removal; numerous later migrations alter the catalogue.

**Soft deletion:** The user asks whether `deleted_at` would be better than such rigid fields. **Open design choice, with assistant recommending opt-in, not universal use**: eligible draft/user-managed files/folders or draft patterns may benefit from trash/restore; real-world public history, elected office holders, legal instruments, verified geography, contracts, official statistics, source captures and audit trail should use genuine termination/supersession/correction/retention semantics rather than being hidden as "deleted". Privacy-driven erasure is a separate case; soft delete alone does not remove personal data.

**Mandatory per-table review:** Record an explicit **KEEP / REMOVE / DERIVE / MOVE / RENAME / ADD** decision for each existing/proposed temporal, precision, current, status, version, timestamp and deletion-related field; distinguish historical truth, pattern legal applicability, real-world status, source/research certainty and operational state. Require meaningful named dates and as-of query examples. A table does not qualify for implementation simply because its current columns appear in a generated entity. Preserve real FKs, evidence and existing data in a staged migration only after the user reviews and authorizes the design.

The [schema redesign index and mandatory review policy](../schema-redesign/README.md) contains the full rules and per-domain examples; all 18 [schema planning documents](../schema-redesign/README.md) now explicitly include this review obligation. Legacy documentation such as `.docs/design/data/DATABASE_DESIGN.md` ("dates carry a precision") remains unchanged until the user approves coordinated rule/code/migration updates. **No Taskcode tasks or application/database changes are authorized.**


## 27. User discussion: semantic column names, hot data and continuous verification (2026-11-07)

**Planning status: requirements and recommendations recorded, NOT approved column DDL or implementation.** The user asked that date columns in each table use understandable terms matching **the actual domain fact** rather than copying generic `valid_from`/`valid_to`. Examples raised: **party membership**, office holders and others throughout all schemas. They also proposed categorizing records/fields by how **hot** (changeable/outdated) they are, recording **last verification** on particular tables or columns, identifying which facts require revalidation, and triggering continual research/refreshes so the MZIZI platform remains accurate.

### User requirements and assistant advice

- **USER REQUIREMENT — semantic naming:** Every retained or added field must tell the reader what it means *on that table*. Use `joined_on`/`left_on` for political membership if the underlying data represents joining and leaving; `appointed_on`/`assumed_office_on`/`left_office_on` for distinct governance tenure events; `commenced_on`/`repealed_on` for legal acts; `published_at`/`closes_at` for tenders; `signed_on`/`effective_from`/`expires_on` for contracts. **These are illustrative alternatives, not approved final columns.** Do not merely find-and-replace generic dates; some facts have independent real-world event times and other records inherit law/pattern applicability. `_on` conventionally dates, `_at` precise instants, `_from` and `_until` actual intervals with documented boundary semantics.
- **USER IDEA — hotness:** Classify which data changes frequently, remains stable or requires source-event monitoring. **ASSISTANT REFINEMENT:** Table-level defaults are insufficient; within one table, canonical identity may remain stable while an office holder, contact address, active tender, disputed claim or external source changes frequently. Model `hot`/`warm`/`cold`/`event-driven` (candidate vocabulary) at default table/type and field-group/relationship level, with exceptional row/source overrides. This is **not the same classification** as seeded static, seeded pattern, collected and derived.
- **USER IDEA — verify data and specific table columns:** Track `last_checked_at` (attempt), `last_verified_at` (successful evidence-backed confirmation), `last_source_seen_at` (source availability), `last_changed_at` (precisely defined canonical or source change) and `next_check_at` (due from policy) **as conceptual metadata**. **ASSISTANT RECOMMENDATION:** Centralize verification/check history and rule state rather than add all five columns to every domain table. A table-wide refreshed watermark cannot prove each field was verified; a record may have mixed field-group freshness.
- **USER GOAL — automatic revalidation:** Use approved source profiles, versioned watcher/freshness policies and `engine` jobs to trigger relevant verification from elapsed freshness, changing website/Markdown sections, source announcements, dependency changes or high-risk events. Stale is **not** automatically incorrect, a download is **not** verification, and an unchanged verified fact should advance verification history without fictitious canonical modification.
- **ASSISTANT RECOMMENDATION — adaptive policy:** Prioritize check cadence using expected change rate, impact of being wrong, source availability/reliability, upcoming official schedule, recent successful/failed checks, cost and resource quotas; don't establish universally fixed intervals now. Public UI may distinguish verified, overdue/stale, disputed, never checked and unavailable with last genuinely successful verification.
- **Integrity/safety:** Keep genuine domain lifecycle (appointed/retired/dissolved), research quality (unknown/verified/disputed), operational state (queued/failed), deletion status and data hotness separate. Use hard FKs for structurally known verification targets; scoped field-group monitoring may need typed target associations. Preserve correction/version/source history.

### Repo observations grounding the proposal

The current TypeORM model historically uses generic temporal/current flags broadly (as recorded in section 26). In particular, `calendar.events` contains `starts_on`, `ends_on`, `is_recurring`, `status`, `is_current` and generic `valid_from/to`/precision fields; `statistical.periods` and `finance.years` already have explicit period start/end dates **plus** duplicated generic validity/current fields. `source.verifications` already exists, with verification state and generic `target_kind`/`target_id`, but that alone is not an enforceable FK to any arbitrary fact or a per-field historical freshness ledger. These are **code observations on `develop`, not verified deployed DB row/DDL findings**.

**Cross-references:** [schema-wide column/freshness rule](../schema-redesign/README.md); [reference policy/schedules](../schema-redesign/mzizi-db/phase-01/reference.md); [engine verification](../schema-redesign/mzizi-operational-db/engine.md); [source verification](../schema-redesign/mzizi-db/phase-01/source.md); [data classes/patterns](data-categories-and-patterns.md). **OPEN:** actual field names, old→new migration, monitoring policy hierarchy and frequency, verification threshold/evidence, ledger physical ownership and hard FK design, UI status words and privacy/retention.

## 28. User discussion: activity and reference schedules trigger event-driven research (2026-11-07)

**Planning status: new architecture direction to review, NOT an approved table/schema/API or task.**

The user asked if `activity` can model official and scheduled happenings—**new elections, census events and releases, parliamentary timetables, budgeting and similar activities**—while `reference` manages reusable schedule definitions and connects them to data-freshness watchers. They also want **manual and automated input**: an agent can be instructed to research news/announcements on particular authorized sites and trigger relevant refreshes; an authorized administrator can log in, record information about an event/announcement, or explicitly request a data check/refill.

### Proposed ownership and three-layer distinction

| Domain | What it should do | What it should not infer |
|---|---|---|
| `reference` | Versioned schedule/recurrence/trigger definitions, applicable legal and geo rules, freshness policies, watch conditions and approved tools/source profiles | That an expected event occurred or that a canonical data value changed |
| `activity` | Actual schedule instances, sourced announcements, official date changes, cancellations, verified occurrences/actions and related source links | Duplicate independently conflicting election/budget/observation identities and values |
| `engine` | One authoritative scheduler/lease/host admission, source-change/manual/event trigger evaluation, idempotent jobs, verification outcomes, field-group freshness, gaps and review promotion | Canonical truth without sufficient source verification |
| `source`/`filesystem` | Original announcement evidence, site capture, Markdown/DOM section hashes, file versions and document provenance | Treat a fetched page as proof a claimed event happened |
| `electoral`/`statistical`/`finance`/`governance`/`legal`/`procurement` | Domain facts and historical versions, with real FKs to approved activity and evidence associations | Interpret a deadline as an official outcome or sum incompatible releases |
| `auth`/`audit` | Actor permissions and durable accountability of user/agent submission, approvals, monitor activation and canonical corrections | Give any logged-in admin unrestricted mutation powers |

**Examples:** A legally scheduled election may trigger checking nominations and voter registers, but must not create fabricated results or assume a polling day was held. An announced census/release triggers monitoring and, once a real publication appears, dataset/vintage validation and derived refresh. A parliamentary session calendar triggers agenda/proceedings research, but a scheduled bill reading is not a passed law. A budget submission deadline triggers a research check, not automatic appropriation/expenditure. An official government appointment announcement triggers holder verification; a tender award notice triggers procurement review.

### Repo observations to account for

- `source/backend/api/src/modules/events/entities/event.entity.ts` uses `calendar.events`, `starts_on`, `ends_on`, `is_recurring`, `status`, `jurisdiction_id` and other generic validity flags. `calendar.links` uses `target_kind` and `target_id` (weak polymorphic links).
- `source/backend/api/src/modules/elections/entities/election.entity.ts` already has `scheduled_date` and `held_date`. Avoid separate unrelated copies of an authoritative election date in `activity` and `electoral`; the design should specify an FK and single update/reconciliation path.
- `source/backend/api/src/modules/finance/entities/fiscal-year.entity.ts` and `source/backend/api/src/modules/statistics/entities/period.entity.ts` represent periods with `starts_on`/`ends_on`.
- Existing source processing and structure manifests (including dedicated site pilots) can provide authorized source discovery; the engine/job/source verification model and earlier HTML→Markdown/site hashing plan should be reused. These are code/planning observations, **not claims of operationally deployed event-driven capabilities**.

### Full trigger flow and admin/agent behavior to design

1. A **versioned reference schedule** or approved watcher policy says an event/refresh should be expected in a jurisdiction and domain, subject to law and source assessment. Some schedules are recurring; others require an explicit official announcement or are relative to earlier events.
2. An expected event, official announcement, source content change, legal/geo dependency change or authorized human/agent request becomes a **typed trigger**. The system must distinguish **expected**, **announced**, **postponed**, **cancelled**, **verified occurred**, **reported/disputed** and source status. A past scheduled time does **not** prove completion.
3. An admin may (a) submit a sourced event candidate, (b) request a scoped one-time verification without asserting a change, (c) create a bounded recurring monitor/exception, (d) approve a verified event/canonical promotion only with permission. Agent tasks such as "watch these sites for official announcements" become persisted, bounded and authorized source/watch definitions, not unbounded chat promises.
4. Official site agents should preserve raw and readable Markdown evidence, relevant source URL/timestamp/section, differentiate announcement from fact/rumor, deduplicate multiple source publications about one real occurrence and link to the right canonical subject.
5. The engine evaluates **target-specific watcher conditions**, affected rows/field groups, permissions and budgets; deduplicates jobs using rule/version, subject, trigger/source version and time window. Source-host admission, retries, cooldowns, ancestry/fan-out limits and loop prevention are required.
6. Research uses independent pipeline packages/source adapters, returning verified unchanged, supported changed fact, conflicting evidence, known absence, unknown or unavailable. Canonical data changes **only** under domain verification/review policy, with source/verification history and hard FK constraints. Derived values re-evaluate on real accepted dependency changes, not every recheck.
7. Public-facing activity/freshness status stays explainable: when event was scheduled vs officially announced vs confirmed, which source and legal rule apply, which fields were last verified and when, and what remains unknown.

### Explicitly unresolved, for future human review

- `reference.schedules` vs schedule type integrated into pattern versions; recurrence/dependency calendar grammar, timezone and exceptions.
- `activity.events` versus `actions`/`updates` and scheduled-versus-actual representation; existing `is_recurring`/`status` fields and semantic dates.
- How `activity` links via **real FKs** to election, budget, census dataset, legal process and procurement subject without generic unvalidated target pointers; authoritative date source and correction/supersession path.
- One verification ledger versus engine/source split; field-group/row monitoring granularity; legal gate and evidence sufficiency.
- Which agents/admins may submit, approve, activate monitors or promote canonical facts; manual input review and public/private visibility.
- Idempotent trigger key, schedules and rechecks, bounded polling costs, no multi-scheduler conflict, agent model/capability selection and safe country-neutral manifests.
- Which table/column additions or removals are actually justified; full live DB/contract audit and user-by-user schema sign-off **before** DDL.

**Related planning details:** [activity](../schema-redesign/mzizi-db/phase-02/activity.md), [reference](../schema-redesign/mzizi-db/phase-01/reference.md), [engine](../schema-redesign/mzizi-operational-db/engine.md), [electoral](../schema-redesign/mzizi-db/phase-01/politics.md), [finance](../schema-redesign/mzizi-db/phase-01/finance.md), [statistical](../schema-redesign/mzizi-db/phase-02/statistical.md), [independent pipelines](independent-data-pipelines.md). **No Taskcode tasks or implementation authorized by these notes.**

## 2026-11-11 — Accepted connected foundation; task 03 ready for detailed design

The user accepted the November reference/geography/legal/domain explanation and requested recording it and preparing the local agent. The controlling account is [connected reference, geography, legal and domain foundation](connected-reference-geography-legal-foundation.md); it consolidates decisions, candidate tables, legal links, regional/historical areas, statistical semantics, patterns, UI interpretation and primary research. The same task-03 record is expanded; no parallel task set is created.

Superseded: using jurisdiction as country + vocabulary scope + legal authority; a fictional world legal jurisdiction; legacy ID/data-preservation requirements for the disposable `mzizi_new`; one geographic parent tree; generic statistics without domain meaning; reference as an obligatory bridge between all entities. Retained: explicit cross-schema FKs, scoped RBAC, source/evidence/version integrity, per-table semantic dates, reference-owned pattern definitions, engine-owned execution and existing S3 protection.

Candidate physical tables and exact implementation remain subject to detailed design. Task 03 establishes minimal legal/domain connection contracts; task 04 finalizes downstream schemas. Review the current Task records for accepted contracts and implementation status. The current filesystem task's final notes report seven tables/file_relations and completed publication/live checks; older planning/upload-pending statements do not override that later account.

## 2026-11-11 — Broader Mzizi knowledge-system expansion

The [advancement and system-expansion proposal](advancement-and-system-expansion.md) records a wider evidence-first African knowledge system organized for product exploration across Civic and Society; Geography and Nature; History and Heritage; Statistics and Demographics; and Economics and Production. These are product-level exploration areas, not five required database schemas.

### New candidate domain work

The proposal explores expanded Geography, Civic infrastructure and services, Environment, Biology, Agriculture, Economy, Statistical, History and Heritage. Education, Health, Linguistics and Migration remain subjects to evaluate, not automatically admitted schemas. Candidate responsibilities and tables appear in the vision and seven new domain briefs in `schema-redesign/`.

### Ownership and cross-domain relationships

The proposal retains single canonical ownership and typed relationships. Geography owns geographic identities and geometry; Civic owns infrastructure function and networks. Environment owns original sensor readings; Statistical owns published/derived comparable series. Biology owns taxa and biodiversity occurrences; Agriculture owns managed cultivation and actual harvest facts. Economy owns products, markets and individual prices, while Statistical owns price indices. Activity retains event identity and History interprets events and curates chronology; Geography retains boundary identity and History links to it; Heritage owns artifacts/custody and History owns interpretation. Person retains individuals while Statistical retains aggregate population measurements. Finance and Procurement remain distinct from Economy.

### Spatial, temporal, evidence and product implications

Preserve original geospatial files through the existing filesystem, use PostGIS for curated canonical geometry, and record exact lineage for derived assets, map layers and statistical aggregations. Boundary editions and crosswalks remain explicit. Distinguish historical validity, event time, observation time, publication time, retrieval time and record/review time where meaningful. Keep evidence, source versions, methods, uncertainty, disagreement and correction history attached to claims. Product queries should use place, time and registered topic/capability and return coverage, boundary, method, evidence and unavailable/fallback context; they must not expose arbitrary database table traversal.

### Statistical ownership clarification

Not every number belongs in Statistical. Raw environmental readings, agricultural harvest quantities, Economy price quotes, Electoral results and Finance transactions remain owned by their originating domains. Statistical owns defined comparable series, published measurement sets, official indices and reproducible derived observations. Derivations pin source inputs, method/version, units, temporal coverage and geography/boundary interpretation.

### Reconcile prior assumptions without erasing history

The old 24-schema/141-table repository inventory is retained as a 7 November pre-rewrite historical baseline, not the current SQL implementation count. The active ordered SQL tree on 11 November contains six schemas (`auth`, `engine`, `filesystem`, `geography`, `legal`, `reference`) and 13 migration files; Dryv defines additional contracts without implying their full databases or product capabilities are implemented. The 18 original design documents remain in the folder and this expansion adds seven briefs. The prior possible 18-to-21 target schema count remains unresolved; new domains may add to, split or be represented within existing domains after review.

Retained: evidence-first modeling, provenance, real cross-schema FKs, first-class time/place, distinct source/extraction/intelligence/filesystem/database/API responsibilities, and the accepted connected foundation. Refined: five exploration areas guide user experience rather than schema count; spatial geometry and functional infrastructure have separate owners; raw source-domain measurements are separated from statistical series. Requires reconciliation: older Civic-to-Governance mapping; Geography/Place/Contact arrangement; Statistical relationship to domain-native numeric facts; History versus Activity; and Heritage artifact identity versus filesystem custody. These are open design questions, not silent replacements.

### Standards and unresolved decisions

Evaluate SDMX for statistical exchange; Darwin Core/GBIF for biodiversity records; FAOSTAT definitions/data for agricultural concepts; UN CPC for products with explicit version status; OGC APIs and STAC for geospatial discovery/services; and CF conventions for multidimensional environmental data. Treat them as versioned exchange/metadata references, not database schemas. Open questions include geographic feature/place/geometry ownership; network and reservoir identity; environmental readings versus gridded products; taxonomic versioning and sensitive occurrences; harvest/product modeling; historical currencies and comparable prices; Statistical dimensions/revisions; History's enforceable typed links; heritage custody and intangible culture; schema boundaries; public access and capability resolution.


## 2026-11-11 — Superseding database direction: Main and Operations

The user has directed two logical databases. Main holds accepted domain knowledge, verified sources/evidence, published file records and approved products. Operations holds authentication, acquisition state, pipelines/runs, staging, analytics work and operational audit. S3 stores file bytes and large scientific data. Python-native vector indexes support disposable scraping/NLP/mapping. Rust exclusively owns relational reads, writes, seeds and migrations; Dryv is authoritative for contracts. This supersedes older four/five/eight/nine database layouts, not the schema approvals. The detailed schema catalogue and user gate are in [schema-redesign](../schema-redesign/README.md). Current SQL/Dryv/runtime inventories diverge; fresh target creation and selective verified imports follow individual user approvals. Preserve existing database and S3 state.
