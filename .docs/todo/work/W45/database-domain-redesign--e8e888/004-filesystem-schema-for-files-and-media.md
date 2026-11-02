---
{id: TSK-1E47CD72A745,name: Filesystem schema for files and media,type: task,status: planned,priority: medium,created_at: 2026-11-02T06:41:22.631Z,updated_at: 2026-11-02T06:41:22.631Z,due_at: 2026-11-02,order: 4096}
---

# Filesystem schema for files and media

## Goal

Create the filesystem schema (stores, formats, folders, objects, files, versions, variants, attachments, uploads, events) designed for heavy traffic, and make it the single place any media or document links through, including source documents, evidence and avatars.

## Context

.docs/docs/FILESYSTEM_DESIGN.md has the model and the lessons from the archived api-legacy files service (directories with counters, one row conflating file and bytes, no versions, string status). Objects are immutable and content addressed so identical bytes are stored once; files are logical with versions; variants are derived renditions; attachments link a file to any record by schema.table and id so other schemas hold no file columns. Folders store a materialised path and no counters. Public reads expose file metadata only, never object keys, buckets or store configuration; the audit evidence table points at a file instead of copying checksum, media type and size.

## Acceptance checklist

- [ ] Author the filesystem contracts and public metadata reads for formats, folders, files, versions, variants and attachments.
- [ ] Keep stores, objects, uploads and events entities without public endpoints.
- [ ] Repoint audit evidence and source captures at filesystem files by id.
- [ ] Seed the media formats from the archived file types.
- [ ] Test that object keys and store details never appear in public responses.
