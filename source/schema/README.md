# System input artifact schemas and database definitions

Machine-readable schemas and shared contracts for Mzizi system inputs, plus the SQL definitions of the rewrite database schemas.

| Path | Contents |
|---|---|
| `site/v1/` | JSON Schemas for site-structure bundles (manifest, module, mapping, sections, common), read by `mzizi-manifest` |
| `contracts/` | Layer exchange schema (`exchange.schema.json`, exported from Dryv by `dryv/tools/export-json-schema.ts`), `targets.json` and `validate_examples.py` (examples live in `seed/fixtures/contracts`) |
| `database/` | Ordered SQL for the disposable rewrite database: `auth/` (active, with seed in `seed/global/auth`) and `engine/` (PROVISIONAL, not final); order in `database/migrations.yaml`, applied by `mzizi-db init` |

Canonical API/database modeling contracts remain under `dryv/`. Credentials are never schema examples or seed values. See the [root seed registry](../../seed/README.md) and [source design](../../.docs/_plan/schema-redesign/phase-01/source.md).
