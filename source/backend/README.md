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
