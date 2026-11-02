---
{id: DEC-EVIDENCE-VIA-FILES,name: Decision - evidence uploads go through the files service,type: decision,tags: [api,files,evidence]}
---

# Decision: evidence uploads through the files service

Date: 2026-11-02.

## Decision

The API never stores file bytes. A contributor uploads to the files service (`source/backend/files`) and the API stores an evidence record that references the resulting file artifact descriptor (identifier, checksum, size, media type), plus the claim or record it supports, the actor and the time. Raw artifacts are never overwritten, in line with AGENTS.md section 5.

## Why

File storage is not database record storage, and the files service owns object storage and checksums. A reference-only evidence record keeps the API inside its boundary.

## Consequences

An evidence reference contract is shared between files and the API. Evidence records are append-only; corrections are new records.
