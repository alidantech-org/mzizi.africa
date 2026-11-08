---
{id: DOC-ARCHIVE-291AF3E266,name: "archived: source/backend/engine/README.md",type: documentation,tags: [archive,historical]}
---

> **ARCHIVED, HISTORICAL, NON-AUTHORITATIVE.** Preserved from commit 3e2f8c5 for learning only; see the archive README. Frontmatter above was added only so document validation accepts the file.

# Engine

Groups the two engines. This is a grouping, not a merge, and it holds no shared code.

| Package | Language | Owns |
| --- | --- | --- |
| [`data/`](data/README.md) | Python | source discovery, fetching, extraction, site structures, normalisation, candidate production |
| [`database/`](database/README.md) | TypeScript (Bun) | schema lifecycle, migrations, seeds, imports, integrity, staging validation, canonical promotion |

The packages are separately runnable with their own toolchain and tests and talk only through documented contracts. `../files` (file custody) and `../intelligence` (AI evaluation) are siblings of `engine/`, not part of it. See `.docs/decisions/engine-layout.md`.
