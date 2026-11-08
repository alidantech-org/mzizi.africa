---
id: DOC-15FC8B06ED43
name: Filesystem schema redesign and external object storage mapping
type: documentation
tags: [improvements, schema-redesign, filesystem, s3, planning]
extra: {status: planning_only, object_store: existing_external}
---

# Filesystem — logical files, folders, tags, versions, storage and access

**PLANNING ONLY. The user already has a deployed self-hosted S3-compatible object-storage service. Do not add another S3 container or implement a second object store.**

## User's requirements, ownership and boundaries

Retain a powerful `filesystem` schema, with clear user-facing organization of logical **files, nested folders, tags, groups, searches, metadata, variants, content hashes, versions, attachments and access URLs**. Existing remote S3 service owns bytes/object operations and supported public/private URL/access functions; MZIZI owns logical organization, relationships to canonical records, artifact identity, provenance references and user experience. Do not make every publicly sourced document private by default; public access should be the normal outcome where the source's reuse rights and sensitivity allow it.

A logical file may be named and arranged differently from its remote S3 object key. Moving a folder must not duplicate or rewrite the bytes; one content-addressed object may back several logical file versions/source captures. Do not conflate `source.documents` and `filesystem.files`, or a website page's extracted Markdown version with its raw captured HTML.

## Current ten tables and recommendations

| Current table | Responsibility; audit and potential action |
|---|---|
| `filesystem.stores` | Registered external/local storage backends: configuration name, kind, tier and current state. Connect to existing S3 instance, not credentials embedded in row. |
| `filesystem.formats` | MIME/format dictionary; determine whether table is necessary versus standardized metadata. |
| `filesystem.folders` | Logical tree with stable IDs, parent, path, visibility and folder metadata; support folders without creating an S3 bucket per folder. |
| `filesystem.objects` | Physical remote object ref: store FK, object key, SHA-256/content hash, length, MIME/scan status and technical metadata. |
| `filesystem.files` | Human-facing logical file identity, name, folder FK, version selection, visibility, lifecycle and legal hold. |
| `filesystem.versions` | Immutable logical file revision → object FK; uploaded/created time and version number. |
| `filesystem.variants` | Generated thumbnail/preview/converted derivative, linked to input/output versions and rendering recipe. |
| `filesystem.attachments` | Associate a logical file/version with a canonical record; current flexible targets must be evaluated against hard-FK requirement. |
| `filesystem.uploads` | Upload-session metadata; keep only if MZIZI needs a workflow beyond what existing S3 service already provides. |
| `filesystem.events` | Immutable file lifecycle/audit events; decide whether these belong in filesystem operations or unified `audit`, without losing evidence. |

**Suggested candidate tables only where needed:** `tags`, `file_tags` for reusable tagged collections; `folder_permissions` or accessible collections; `derivations` if variants cannot express file lineage; `file_aliases` only if multiple virtual placements are required. Do not add all of these by default.

## Proposed logical folder/tag model

Example of **virtual** hierarchy: `sources/kenya/knbs/census`, `sources/kenya/iebc/elections`, `websites/site-structures`, `websites/markdown-pages`, `research/legal`, `generations/pattern-bundles` and `derived/validated-tables`. These are readable *examples*, not mandated S3 object keys or hard-coded classification. Allow tags like `jurisdiction:ke`, `source:knbs`, `content:statistics`, `acquisition:collected`, `artifact:markdown` and `year:2026`; tags should have an FK-controlled registry rather than unbounded free-text labels masquerading as reliable categories.

Folder hierarchy must preserve parent FKs and path resolution, unique sibling/path rules, rename/move behavior, policy-inheritance tradeoffs, restored/archived files and stable IDs. No expensive hot file counters should be updated on each upload unless measured necessity warrants them. Folder and tags should complement one another: folders answer "where should humans browse?", tags answer "what is this and where else is it relevant?"

## Object identity, hashing, files and dependencies

`filesystem.objects` must identify the remote content, not an ephemeral signed URL. A complete hash/length store key determines whether the bytes are already present; two distinct published `source.documents` can share identical bytes and still remain different source identities. `filesystem.versions` are immutable; later Markdown conversion is a **new derived version/artifact**, not overwrite of original evidence.

Plan at least: raw SHA-256, logical file version, source capture link, extraction/derivative version, content/semantic section hashes stored in appropriate execution/source metadata, uploader/publisher relation, declared/public access intent and last integrity check. ETag is not always SHA-256; verify service checksum capabilities. Keep signed/private URLs transient. Never give clients object-store secret credentials.

## FKs, visibility and source relations

Require actual FKs for `file.folder_id`, `version.file_id`, `version.object_id`, `object.store_id`, `variant` origins, `tags` junction, and well-typed references to `source.documents/captures`, institution, person, activity, project and legal source where structurally known. Generic `target_kind + target_id` in attachments lacks ordinary PostgreSQL FK integrity; evaluate typed attachments or constrained canonical record registry first. Authorization/RBAC uses `auth` rather than designing filesystem-specific users.

Public files: backend supplies public URL supported by existing remote service where lawful; private files use remote service access mechanisms and may have limited-expiry URLs; restricted source licenses, personally sensitive information and user uploads still need explicit policy. Do not store private session tokens in schema comments/docs.

## Four acquisition classes and generation

1A: curated uploads and static rule bundles. 1B: structured pattern files/site family bundles saved as versioned files. 2A: immutable crawled PDFs/HTML/CSV/images and the Markdown extracted from them. 2B: computed tables/visual previews/derivatives with input-file and tool version lineage. A file's **contents classification** (PDF vs Markdown) and **origin classification** (seed/pattern/collected/derived) are separate axes.

## Queries, migrations and unresolved decisions

Queries: show all KNBS census PDFs for 2019 and their Markdown/table derivatives; group websites by family and last content change; deduplicate identical bytes across URLs without merging source publications; show complete version history; find public URLs vs authorized private access; browse files via folders and tags independent of remote object key.

Current Python `source/backend/engine/data/src/mzizi_data/files.py` uses `LocalDirectoryStore` and defaults created logical files to restricted. Migrate its adapter/access policy **only after inspecting** actual deployed S3 endpoint, bucket namespace, public URL rules, sign URL API, object versions and retention. No new storage service. Audit 10 table's current columns/FKs and clients; preserve all IDs, versions and hashes on backfill.

**OPEN:** exact S3 API/URL configuration; folder multiple placements vs one parent; tag schema; file retention and legal hold; attachment FK model; `formats/uploads/events` ownership; cache and integrity checks; default public/private policy by source classification; UI operations; migration of existing local objects. See [file-management plan](../file-management-and-s3.md), [site Markdown plan](../site-structure-and-markdown-extraction.md), and [master register](../mzizi-data-schema-storage-and-pipelines-redesign.md).

**Status: proposals, no approved DDL.**

## Human review — editable user notes and design sign-off

**Review status:** `NOT REVIEWED` — AI-authored proposals in this document are not final approval.

**In my own words, what this schema should represent and exclude:**

> _My understanding and questions:_

**Tables/columns I want to keep, rename, move, merge, split, remove or add (and why):**

> _My proposed changes and alternative names:_

**Hard foreign keys, geographical and legal scope, pattern generation, classification and evidence I want changed or explained:**

> _My technical feedback, disagreements and alternatives:_

**Real data and queries I want to use to validate this design:**

> _My examples and expected results:_

**Unresolved decisions I want to discuss further:**

> _My remaining questions:_

**Final user decision:** `NOT DECIDED` / `NEEDS CHANGES` / `DESIGN VALIDATED BY USER` / `APPROVED FOR TASK PLANNING`.

**Approval reference and date:** _None. Only record explicit later user authorization. Even design validation does not authorize code, migration or Taskcode task creation._

## Mandatory per-table temporal, rigid-column and deletion review (2026-11-07)

**USER REQUIREMENT; planning only.** Examine every existing/proposed field and expressly record **KEEP / REMOVE / DERIVE / MOVE / RENAME / ADD** for `valid_from`, `valid_to`, `valid_from_precision`, `valid_to_precision`, `is_current`, `status`, `version`, `created_at`, `updated_at` and other copied/rigid flags. These fields are **opt-in by justified meaning**, not blanket schema conventions. Assess `deleted_at` only for recoverable soft deletion where appropriate. The full policy and migration/approval checklist is in [schema redesign README](README.md).

**Domain-specific guidance:** Immutable objects and versions have content identity and creation times, not real-world validity. Files and logical folders are candidates for selective deleted_at trash/restore, with FK and partial unique-index design; do not delete source evidence or remote S3 bytes by implication. Uploads/events have operational timestamps, not a copied is_current/precision bundle.

**OPEN for human review:** exact per-table/column disposition, derived status and as-of queries, pattern/legal links, justified precision, recoverable deletion versus domain lifecycle, history/identity preservation and hard-FK impact. No code or migration is authorized.

## 2026-11-08 — Root seed convention and folder/file-type design

The user now requires all manually or AI-prepared seed inputs, including auth baselines and site-structure YAML/JSON/CSV/code artifacts, under repository-root `seed/`. The authoritative convention and design proposal are in [seed/README.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/seed/README.md). Use global file types without jurisdiction linkage, jurisdiction-specific fixed folder CSVs, and system/jurisdiction pattern definitions producing concrete folders from actual resources. Shared pattern definitions belong in reference, execution in engine. Files link to concrete folder and physical type; exact versions retain their actual format. Global/system/jurisdiction files are separated locally, and manifests identify dependencies, keys, recognized loaders/targets, hashes and S3 destination for each adopted artifact. Generated/reproducible outputs may be ignored but require replay or fetch metadata.

Existing SeaweedFS configuration is fixed: bucket `mzizi`, region `us-east-1`, existing environment credentials, laptop endpoint `http://192.168.100.13:18333`, Docker endpoint `http://object-storage:8333` on `home-services`, public origin `https://res.alidantech.org/mzizi/`. Only `public/` allows anonymous reads; every other prefix is private. Do not provision storage, regenerate credentials, use per-object public ACLs or change infrastructure. Local logical folder paths need not mirror object keys. Seed CSV bytes normally go under `internal/seeds/` even when their rows define public folders.

This approves documentation and the directory convention; bulk legacy relocation, actual catalog content, production folder generation, runtime manifest support and S3 uploads remain future work. Existing objects require inspection; disposable `mzizi_new` does not imply disposable S3. No backward compatibility is needed for the approved database rewrite. Earlier per-service seed locations and preservation/compatibility statements are historical and are superseded for this rewrite by the newer user direction.

## 2026-11-08 — Seed relocation completed; folder-level provenance requirements

Task `TSK-0F4398B91D38` relocated the real system seeds to root `seed/` (inventory: `.docs/docs/SEED_RELOCATION_INVENTORY.md`), added `_folder.yaml` folder descriptors (artifact role, acquisition class, preparation method, access class, scope, review state, with deterministic nearest-folder inheritance and explicit file overrides), a functional `seed/manifest.yaml` and a generated `seed/manifest.lock.json` that maps each file to a durable S3 key (`internal/seeds/...`) without uploading it. The filesystem design must persist this: folder-level metadata and inheritance, effective provenance captured when a seed artifact is registered (manifest release, checksum, descriptor source, generator/tool, intended access, S3 reference), historical origin kept apart from current placement, S3 prefixes consistent with effective access, and folders generated from reference-owned patterns. File formats come from the authoritative `seed/global/reference/media-formats.json`; the global file-type CSV, extension aliases and the Kenyan folder CSV are still to be derived and designed in this milestone. Implementation remains unauthorized.
