---
{id: DOC-ARCHIVE-9B45C87A27,name: "archived: source/backend/README.md",type: documentation,tags: [archive,historical]}
---

> **ARCHIVED, HISTORICAL, NON-AUTHORITATIVE.** Preserved from commit 3e2f8c5 for learning only; see the archive README. Frontmatter above was added only so document validation accepts the file.

# Mzizi Services

Mzizi services are separated by responsibility so evidence ingestion, AI processing, database lifecycle and product API concerns do not collapse into one backend.

## Target services (under `source/backend/`)

```text
source/backend/
├── files/          # Evidence artifact custody and file lifecycle
├── engine/
│   ├── data/       # Source discovery, extraction, OCR and parsing
│   └── database/   # Database schema, migrations, seeds and canonical promotion
├── intelligence/   # AI/tool-assisted classification, cleaning and evaluation
└── api/            # Future NestJS product API
```

## Current transition state

`source/backend/api-legacy` contains the inherited Python FastAPI political-governance backend. It is valuable migration source material but is **not** the target API architecture.

Useful responsibilities from that service will be decomposed according to `.docs/MIGRATION.md`.

## Ownership test

| Question | Owner |
| --- | --- |
| Where is the exact source PDF/map/dataset preserved? | `files` |
| How is text/table/metadata extracted from it? | `engine/data` |
| How is it classified, cleaned, linked or evaluated with AI/tools? | `intelligence` |
| Who owns migrations, seeds, integrity and candidate promotion? | `engine/database` |
| How do applications query approved canonical knowledge? | NestJS `api` |

## Shared rule

Services should exchange versioned contracts and references, not import one another's internal ORM or storage implementation.

See:

- `../.docs/ARCHITECTURE.md`
- `../.docs/SYSTEM.md`
- `../.docs/DATA_LIFECYCLE.md`
- `../.docs/MIGRATION.md`

## 2026-11-08 — Package-first rewrite direction

The user authorizes structure/package extraction and historical archiving now. Target: reusable capabilities under source/packages/, one Python orchestrator/API project under source/backend/engine/, preserved NestJS product API relocated to source/apps/api/, input schemas in source/schema/, and prepared inputs in seed/. Archive old engine/data, engine/database and api-legacy under .docs/_archives/<dated-rewrite-snapshot>/ after preserving active auth rewrite work; remove obsolete backend/files and backend/intelligence active scaffolds. Follow [the controlling structure and publication requirements](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/independent-data-pipelines.md#2026-11-08--approved-package-first-layout-and-single-python-engine).

Filesystem package APIs must support seed manifest/folder provenance, registry upload and hash deduplication, immutable releases and conflict-safe updates to explicitly non-versioned logical items. Keep evidence/run snapshots immutable. This authorization covers restructuring foundations, not all later schema/source/pipeline features. Update all active build/Dryv/auth consumers and maintain focused checks. Existing S3 objects remain protected. Historical paths above are superseded for the rewrite as the local agent carries out the relocation.
