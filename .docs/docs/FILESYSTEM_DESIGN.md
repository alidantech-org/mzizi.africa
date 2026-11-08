---
{id: DOC-FILESYSTEM-DESIGN,name: FILESYSTEM_DESIGN,type: documentation,tags: [filesystem,media,files,scale]}
---

# Filesystem design

The `filesystem` schema is the single place that knows about files and media: source PDFs, scans, avatars, logos, gallery images, derived text and thumbnails. It stores metadata and addresses only; bytes live in an S3-compatible object store (or a local directory behind the same interface). The files service (`.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/files`) owns the bytes and is the writer of this schema; the product API reads it.

## What the legacy model taught

`.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/api-legacy/_archives/files` had `directories` (self-referencing tree with `path`, `depth`, and per-directory `file_count`, `total_size_bytes`, `last_file_at`), `files` (one row per upload with `s3_key`, `s3_bucket`, `checksum`, `status` of uploaded, processing, failed or completed, and a free JSON `file_metadata`) and `file_types` (mime type, extension, category, previewable flag, maximum size, processing strategy). Endpoints: search, types, analytics, folders, upload, delete by key.

Problems carried forward and fixed: one row conflates the logical file with its stored bytes, so replacing a file or deduplicating is impossible; no versions; per-folder counters that every upload would update (a write hot spot); the object key is derived from the name instead of the content; processing state is a string on the file row; JSON metadata with no typed home for media dimensions or pages; no link from a file to the records that use it.

## Model

```text
stores        where bytes are kept (kind, bucket or root, region, tier)
formats       controlled media formats (mime type, extension, category, previewable, limits, processing strategy)
folders       the tree: parent, name, materialised path, depth
objects       immutable stored bytes: content hash, size, store, object key, format, media facts
files         the logical file: folder, name, current version, status, owner
versions      each upload of a file: number, object, uploader, note
variants      derived renditions of an object: thumbnail, preview, text extract, ocr
attachments   links a file to any record in any schema: target, role, order
uploads       in-flight upload sessions: expected size and hash, state, expiry
events        append-only access and change log
```

- **Content addressing and deduplication.** `objects` is unique on (`store`, `content_hash`, `size_bytes`); the object key is derived from the hash (`sha256/ab/cd/<hash>`), so identical bytes are stored once however many files or versions use them. An object never changes; a changed file is a new version pointing at a new object.
- **Logical file versus bytes.** `files` is what users and records see; `versions` is its history; `objects` is the bytes. Deleting a file marks it trashed; a purge job removes unreferenced objects after the retention period, and a legal hold flag blocks the purge.
- **Folders.** A folder stores `parent_id`, `name`, a materialised `path` and `depth`, so listings and breadcrumbs need no recursive query. Moving a folder rewrites the paths of its subtree in one transaction (rare). A file's name is unique within its folder among non-trashed files.
- **Media facts.** `objects` carries typed columns for what clients need without opening the file: `media_width`, `media_height`, `media_duration_seconds`, `page_count`, plus `format_id`. Open-ended extractor output stays in the data engine, not here.
- **Variants.** Thumbnails, resized images, web previews and extracted text are `variants` of an object (kind, parameters, derived object). The original is never modified.
- **Attachments.** `attachments` is the one link table for media: (`target_kind` as `schema.table`, `target_id`, `file_id`, `role`, `position`). Roles are vocabulary values such as portrait, logo, gallery, document, scan. A person's portrait, a party's symbol and an institution's seal all use it. The table lives in `filesystem`, so records elsewhere hold no file columns and no foreign keys to this schema; lookups go by (`target_kind`, `target_id`).
- **Source evidence.** A source document's preserved copy is a file; `source.captures` points at the file version it fetched. Contributor evidence references (`audit.evidence`) also point at a file.
- **Uploads.** A client asks for an upload session (`uploads`: expected size and hash, multipart parts handled by the object store), uploads straight to the store with presigned URLs, then completes it; completion creates the object (if the hash is new), the file and version, and an event in one transaction. Expired sessions are swept. Large uploads never pass through the API.
- **Events.** `events` records created, downloaded, versioned, moved, trashed, purged; it is append-only and the biggest table in the schema.

## Scale

The hot path is reading metadata and issuing a download URL; bytes go from the object store or CDN, not through PostgreSQL or the API. Writes are inserts (objects, versions, events); the only updates are a file's `current_version_id` and status. No counters on folders. `events` is partitioned monthly. The schema has no foreign keys out, and the files service can run against its own database.

## Safety

Filenames are sanitised on the way in and the stored name is separate from the object key. Each object carries a scan status (`pending`, `clean`, `infected`, `skipped`); downloads of anything not clean are refused. Public exposure is explicit: `files.visibility` is `public` or `restricted`, and the API serves only public file metadata and never object keys, bucket names or store configuration.

## Not in this task

Presigned download and upload endpoints belong to the files service. The API exposes read-only metadata for public files, versions, attachments, formats and variants.
