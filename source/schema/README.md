# Input, exchange and database schemas

`source/schema/` stores machine-readable input shapes and ordered PostgreSQL SQL. It does not own the authored product API/database contracts; those are maintained in repository-root [`dryv/`](../../dryv/README.md) and exported or consumed here where appropriate.

| Directory | Contents |
|---|---|
| [`contracts/`](contracts/README.md) | Layer-exchange JSON Schema, target catalog and example validator. |
| [`database/`](database/migrations.yaml) | Ordered SQL for the disposable rewrite database, organized by schema. The TypeScript owner is [`source/backend/database/`](../backend/database/README.md). `engine/` includes provisional and runtime-service migrations. |
| `pipeline/v1/` | Versioned pipeline-manifest input schema. |
| `seed/` | Root seed-manifest schema. Prepared inputs and their records live in repository-root [`seed/`](../../seed/README.md). |
| `site/v1/` | Versioned site-structure manifest, module, mapping, section, tag and common schemas. |

Change contract-derived files through `dryv/` and the root Dryv commands. Change SQL through reviewed releases and the database owner. Do not copy publisher- or country-specific values into these generic schemas.
