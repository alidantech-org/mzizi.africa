---
{id: DOC-1C377D1FAAA5,name: Repository Map,type: documentation}
---

# Repository Map

| Path | Responsibility |
| --- | --- |
| `apps/www` | Public-facing atlas, heritage, history, and exploration site. |
| `apps/dashboard` | Research and evidence stewardship workflows. |
| `apps/mobile` | Flutter mobile application and embedded Cesium map. |
| `apps/docs` | Application contracts, including the mobile geography API contract. |
| `services/api` | Legacy Python/FastAPI behavior, schema, migrations, seeds, and migration input. |
| `services/data-engine` | Target owner for discovery, ingestion, and extraction. |
| `services/db-engine` | Target owner for migrations, seeds, imports, and database lifecycle. |
| `services/files` | Target owner for raw and derived evidence artifact custody. |
| `services/intelligence` | Target owner for reviewable AI/tool-assisted classification and evaluation. |
| `.docs` | Product purpose, domains, architecture, lifecycle, and migration guidance. |
| `.tasks` | Task groups, implementation activities, project docs, rules, and agent guidance. |

The target product API is NestJS. Confirm actual service/package presence before planning implementation work; do not infer that a target directory exists just because it appears in architecture documentation.
