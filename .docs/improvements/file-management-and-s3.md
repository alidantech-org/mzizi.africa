---
id: DOC-9A4B7C218D36
name: File management folders tags and existing S3 integration plan
type: documentation
tags: [improvements, planning, filesystem, s3, objects, files, folders, tags]
extra: {status: planning_only, storage_service: existing_external}
---

# Logical file manager, folders/tags, hashes and existing self-hosted S3

**PLANNING ONLY — user has an existing deployed S3-compatible service. Do not provision or containerize another.**

## User's requirements and stated preferences

- Keep `filesystem` as a meaningful data-management domain, not merely a cloud-storage wrapper; improve logical **files, folders, nested organization, tags, grouping, search, hashing, dedup, versions and attachments**.
- The S3-compatible instance already exists; **connect to the supplied endpoint and URL/access capabilities** when the user is ready. Do not write a new S3 service, Docker Compose stack, public CDN or infrastructure.
- The existing S3 service will manage public/private access URL features. The backend exposes an appropriate URL to frontends; private artifacts may use access URLs according to remote-service behavior.
- Many official, publicly obtained files are intended for public access. Do not make them private merely because a past implementation defaulted to restricted; preserve lawful access restrictions and privacy when actually required.
- Avoid overlapping `filesystem`, `source`, `website` and `engine/staging` responsibilities. The physical stored object, logical file, source publication, retrieval capture, extraction result and record attribution are **different things**.
- Support Markdown derivatives of webpages, site structure bundles, CSV/JSON/PDFs, media and other research artifacts without copying the exact same binary content for every source URL.

## Design principle: physical object != logical file != source document

| Concept | Proposed owner | Meaning |
|---|---|---|
| Stored object | S3 instance, referenced by `filesystem.objects` | Immutable byte content with object key, content hash, length, media type, backend and integrity checks |
| Logical file | `filesystem.files` | User/research-facing named file, lifecycle, visibility, folder and metadata |
| File version | `filesystem.versions` | A logical file at a particular version pointing to a stored object |
| Folder | `filesystem.folders` | Human-organized logical hierarchy and useful paths; **not** a separate S3 bucket for every folder |
| Tag | Proposed `filesystem.tags` / `file_tags` | Reusable classification across folders, sites, topics, counties and artifact kinds |
| Attachments | `filesystem.attachments` and domain-specific associations | Links file version(s) to a source, institution, place, event, research record, site structure or claim as appropriate |
| Source document | `source.documents` | Published/work/source identity, title, publisher and external identifiers, potentially several files/formats |
| Capture | `source.captures` | Particular source retrieval, URL/time/status/source assessment and immutable evidence-version reference |
| Extraction output | Pipeline/engine result + derived file version | Structured/Markdown output from an input artifact with extractor and version |
| Site structure | Website/source definition + versioned files | Instructions for finding and mapping site content, not a stored website duplicate |

**Crucial:** `source` should not own S3 bytes, and `filesystem` should not decide legal truth about a scraped statement. `engine` owns extraction run progress, not the identity of the captured publication.

## Candidate logical hierarchy — illustration, not mandated paths

```text
MZIZI files
├── sources/
│   ├── kenya/
│   │   ├── knbs/
│   │   │   ├── census/
│   │   │   └── statistics/
│   │   ├── iebc/
│   │   │   ├── elections/
│   │   │   └── gazettes/
│   │   └── ppra/
│   │       └── procurement/
│   └── shared-global-sources/
├── research/
│   ├── geography/
│   ├── governance/
│   └── legal/
├── websites/
│   ├── site-structures/
│   ├── markdown-pages/
│   └── attachments/
├── generations/
│   └── pattern-bundles/
├── derived/
│   ├── extracted-tables/
│   └── computed-datasets/
└── media/
    ├── images/
    └── documents/
```

These are user-facing **virtual folders**, not physical S3 object keys or hard-coded political categories. A single content-addressed object may be surfaced through multiple logical files/attachments without copying its bytes. Model jurisdiction, publisher, year, record ID, artifact type, language and acquisition method as **metadata/tags**, not only folder names. Do not make one tree encode every dimension; tags and relations carry cross-cutting groupings.

### Folder semantics to decide

- Stable folder IDs and parent FKs; unique path or sibling names with normalized slugs and path updates on moves.
- Multiple logical aliases/collections: a file may relate to one primary folder and several tagged/smart collections; decide whether shortcuts are needed.
- Display hierarchy vs actual object keys; relocating a file should not rewrite its S3 object.
- Folder permissions, bulk actions, sorting/search, folder count/size views or derived metrics; avoid hot counters on every upload.
- Tags with optional group, meaning, category, jurisdiction validity and permissions; FK-backed many-to-many `file_tags`.
- Versioned naming, deletion/restore, retention, legal hold, audit and source evidence immutability.
- Media variants such as preview, thumbnail, extracted text and Markdown conversion linked to source version and pipeline configuration.

## External S3 adapter contract (proposal only)

The backend/service should support operations such as: `put_object`, `get/read`, `head/check`, `delete_if_allowed`, `public_url`, `temporary_access_url` and `verify_content`. Exact methods must match the existing deployed service—**do not invent service-specific APIs**.

Record the bucket/store identity and object key separate from display URL; store only durable object references. Public URL may be constructed through the configured S3/custom public origin if supported, while private access links may expire and should not be treated as persistent database identifiers. Keep credentials server-side; frontends consume authorized URLs and metadata.

Determine with user: endpoint and auth (without exposing secrets in docs); bucket layout, existing URL format, presign/ACL behavior, public URL, retention/versioning, upload limits, images, available metadata, compression, CDN/reverse proxy, multipart capability and delete semantics. The user does **not** need another S3 container installed.

### File hashing and dedup

- SHA-256 raw bytes of stored content; use content-addressed object key where compatible with existing service; check length and optionally service checksum/ETag, which should not always be assumed to be a SHA-256.
- Reusing an identical stored object is not merging distinct **published source documents**; preserve each document URL, retrieval event and provenance.
- Derivative files have their own hash and `derived_from` links to input file versions and extractor/tool/config version. Don't overwrite evidence when Markdown output improves.
- A raw webpage, a normalized/rendered DOM snapshot, the readable Markdown page and extracted structured records can each have different hashes and provenance.
- Keep source artifacts once by content hash, but allow many logical aliases, tags, versions and source citations.
- User's future data classification must cover file roles: seeded pattern bundle, automated capture, generated Markdown derivative, computed report, curated manual material.

## Present implementation notes / gaps

Existing `filesystem` models already include `stores`, `formats`, `folders`, `objects`, `files`, `versions`, `variants`, `attachments`, `uploads` and `events`. `.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/engine/data/src/mzizi_data/files.py` currently uses `LocalDirectoryStore`, hash-based keys and logical file versions, and its local file creation path defaults to `restricted` visibility. User rejects unjustified universal restriction for public documents; the correct public/private policy should be agreed before changing defaults. `.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/files/README.md` is primarily architecture scaffolding, so integration work must first inventory all actual writers/readers and current data.

## Unresolved user decisions / acceptance questions

1. Existing S3 service endpoint/SDK/public URL/private access contract; file service deployment boundary.
2. Folder taxonomy vs tags vs saved queries/collections; single-parent/multi-parent? Which default folder structure should appear in UI?
3. Visibility policy by source license, PII sensitivity, official/public status, derived artifact, user upload and site access.
4. How `source.documents`, `source.captures`, `filesystem.attachments` and generic targets use **real cross-schema FKs**.
5. Exact file types, previews, thumbnails, derivative relations, file version/persistence policies.
6. Retention/cleanup: what can be deduplicated, archived, deleted and what immutable evidentiary files must persist.
7. Whether to track per-file acquisition category and research/publication state directly or through lineage.
8. Migration from local directory store to existing S3 without losing references or versions.
9. What operations remain the S3 provider's responsibility, rather than recreating it in MZIZI.

**No integration or filesystem migrations are authorized. Future Taskcode planning requires explicit user direction.**

## Related source redesign planning

See [source redesign and adaptive website intelligence](source-redesign/README.md) for the consolidated planning-only review of unknown-site discovery, link/URL deduplication, optional YAML structures, semantic retrieval/ML, incremental processing, the dedicated vector index alternatives and the shared pattern-schema option. **No source/website collapse, new pattern schema or target table set has been approved.**

## Research artifact integration (planning)

See [source artifact lifecycle](source-redesign/12-artifact-lifecycle-and-lineage.md) and [integration contracts](source-redesign/11-tool-integration-and-contracts.md). Preserve the deployed S3 backend: raw bytes, logical filesystem file/version, URL capture, derived Markdown/table, reusable YAML and vector index point have different lifecycles, but need not each receive their own SQL table. Review manifest fields, provenance, replay, public/private URL policy and retention against existing source/filesystem implementation before deciding changes. **No second storage service approved.**

## Person portraits and CSS-discovered media

Person portraits are already represented by `filesystem.attachments` with a portrait role; image bytes belong in the existing S3-backed files service. The website extractor should discover images in HTML attributes, responsive/lazy-loading attributes, inline CSS, linked stylesheets and optional rendered DOM, preserving the page/CSS locator and source capture. Relative CSS URLs resolve against the stylesheet URL. Download only within the existing source assessment and publication/rights scope.

Exact byte hashes can reuse identical objects while preserving each source sighting. Perceptual hashes may suggest duplicate image files but do not establish person identity. The reviewed person-to-portrait relationship belongs in the existing attachment mechanism, not a new avatar URL or media schema. See [person identity/media/community refinement](person-identity-media-and-community-refinement.md) and [artifact lineage](source-redesign/12-artifact-lifecycle-and-lineage.md).

## 2026-11-08 — Root seed convention and folder/file-type design

The user now requires all manually or AI-prepared seed inputs, including auth baselines and site-structure YAML/JSON/CSV/code artifacts, under repository-root `seed/`. The authoritative convention and design proposal are in [seed/README.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/seed/README.md). Use global file types without jurisdiction linkage, jurisdiction-specific fixed folder CSVs, and system/jurisdiction pattern definitions producing concrete folders from actual resources. Shared pattern definitions belong in reference, execution in engine. Files link to concrete folder and physical type; exact versions retain their actual format. Global/system/jurisdiction files are separated locally, and manifests identify dependencies, keys, recognized loaders/targets, hashes and S3 destination for each adopted artifact. Generated/reproducible outputs may be ignored but require replay or fetch metadata.

Existing SeaweedFS configuration is fixed: bucket `mzizi`, region `us-east-1`, existing environment credentials, laptop endpoint `http://192.168.100.13:18333`, Docker endpoint `http://object-storage:8333` on `home-services`, public origin `https://res.alidantech.org/mzizi/`. Only `public/` allows anonymous reads; every other prefix is private. Do not provision storage, regenerate credentials, use per-object public ACLs or change infrastructure. Local logical folder paths need not mirror object keys. Seed CSV bytes normally go under `internal/seeds/` even when their rows define public folders.

This approves documentation and the directory convention; bulk legacy relocation, actual catalog content, production folder generation, runtime manifest support and S3 uploads remain future work. Existing objects require inspection; disposable `mzizi_new` does not imply disposable S3. No backward compatibility is needed for the approved database rewrite. Earlier per-service seed locations and preservation/compatibility statements are historical and are superseded for this rewrite by the newer user direction.
