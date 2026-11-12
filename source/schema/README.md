# Input and exchange schemas

`source/schema/` stores machine-readable input shapes. It does not own the authored product API/database contracts (maintained in repository-root [`dryv/`](../../dryv/README.md)) and it holds no SQL: generated database artefacts live with their owner, [`source/backend/database/`](../backend/database/README.md), per `.docs/decisions/DEC-DATABASE-FOUNDATION-OWNERSHIP.md`.

| Directory | Contents |
|---|---|
| [`contracts/`](contracts/README.md) | Layer-exchange JSON Schema, target catalog and example validator. |
| `pipeline/v1/` | Versioned pipeline-manifest input schema. |
| `seed/` | Root seed-manifest schema. Prepared inputs and their records live in repository-root [`seed/`](../../seed/README.md). |
| `site/v1/` | Versioned site-structure manifest, module, mapping, section, tag and common schemas. |

Change contract-derived files through `dryv/` and the root Dryv commands. Change SQL through reviewed releases and the database owner. Do not copy publisher- or country-specific values into these generic schemas.
