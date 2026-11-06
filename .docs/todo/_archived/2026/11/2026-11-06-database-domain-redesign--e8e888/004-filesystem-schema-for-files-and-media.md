---
{id: TSK-1E47CD72A745,name: Filesystem schema for files and media,type: task,status: completed,priority: medium,created_at: 2026-11-02T06:41:22.631Z,updated_at: 2026-11-02T06:59:00.813Z,due_at: 2026-11-02,order: 1152,extra: {status_history: [{from: planned,to: completed,at: 2026-11-02T06:59:00.813Z}]},archived_at: 2026-11-06T12:50:48.210Z}
---

# Filesystem schema for files and media

## Goal

Create the filesystem schema (stores, formats, folders, objects, files, versions, variants, attachments, uploads, events) designed for heavy traffic, and make it the single place any media or document links through, including source documents, evidence and avatars.

## Context

.docs/docs/FILESYSTEM_DESIGN.md has the model and the lessons from the archived api-legacy files service (directories with counters, one row conflating file and bytes, no versions, string status). Objects are immutable and content addressed so identical bytes are stored once; files are logical with versions; variants are derived renditions; attachments link a file to any record by schema.table and id so other schemas hold no file columns. Folders store a materialised path and no counters. Public reads expose file metadata only, never object keys, buckets or store configuration; the audit evidence table points at a file instead of copying checksum, media type and size.

## Acceptance checklist

- [x] Author the filesystem contracts and public metadata reads for formats, folders, files, versions, variants and attachments.
- [x] Keep stores, objects, uploads and events entities without public endpoints.
- [x] Repoint audit evidence and source captures at filesystem files by id.
- [x] Seed the media formats from the archived file types.
- [x] Test that object keys and store details never appear in public responses.

## Progress

New filesystem schema: stores, formats, folders, content-addressed objects, files, versions, variants, attachments, uploads and events, designed from the archived files service (no folder counters, logical file versus immutable bytes, versions, one attachment table that links media to any record). Public reads cover formats, folders, files, versions and attachments with public-only constraints in the use cases; a test proves restricted files, their versions and attachments are hidden and that object keys, hashes and store details never appear. audit.evidence now points at a file id; source.captures point at file versions. 44 media formats seeded from the archived file types.
