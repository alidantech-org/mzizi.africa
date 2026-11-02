# Mzizi Dryv contracts

TypeScript contracts (`@dryvcode/author`) for the canonical Mzizi model. Dryv compiles them to Runtime IR and the packs generate the NestJS API in `source/backend/api`, using the same structure and packs as the Alidantech backend. Only the project-owned use cases and service implementations are hand-written.

## Layout

- `../dryv.yaml`: the Dryv project file. It lives at the repository root because generation destinations may not leave the project root. It pins the engine (`6dba3100f02ada9dfd061e5100112c1d01760e3b`) and the packs repository (`7fdaa6f0d0d35f0522aabcd2699e48cabf31b46a`).
- `contracts/index.ts`: composes the application from groups.
- `contracts/foundation/shared`: provenance, valid time, record time, verification, business code, transport and failures.
- `contracts/foundation/reference`: jurisdictions and jurisdiction-scoped classification records.
- `contracts/foundation/geography`: the pilot domain.
- `packs/type-files`, `packs/use-cases`: project packs that scaffold shared types and per-operation use cases.

Generated output lands in `source/backend/api/src/modules/<group>/...`, `src/types/<group>/...`, `src/app.module.ts` and `src/database/`. Do not edit managed files; files marked "Scaffolded by Dryv once" belong to the project.

## Contract rules

- Every claim-bearing entity extends `EvidencedEntity` (provenance, verification) over `HistoricalEntity` (valid time) over `BaseEntity` (identity and record time).
- Business codes are hierarchical and lowercase, such as `ke/nairobi/westlands`.
- Levels, institution types, election types, selection methods and fiscal stages are `ClassificationRecord` rows scoped by jurisdiction, never enums or columns. Contracts never name a country.
- Strings with a maximum length become `varchar(max)`; leave out the maximum for unbounded text such as GeoJSON.
- The entity pack names a relation property after its target, so two relations to one entity collide; keep the second reference a plain id.

## Workflow

```bash
cd dryv
bun install && bun run link          # link the local Dryv checkout (set DRYV_HOME if not in the default place)
bun run check                        # typecheck, doctor, compile
# start the Dryv API (from the Dryv checkout): uv run --project source/engine/python/api dryv-api serve --port 8750 --template-server source/engine/python/api/dryv.server.yaml
cd .. && bun $DRYV_HOME/source/apps/cli/bin/dryv.ts --api http://127.0.0.1:8750 generate
cd source/backend/api && bun run typecheck && bun run test
```

`bun run test` in the API runs the generated specs. The PostgreSQL integration test runs when `TEST_DATABASE_URL` points at a scratch PostGIS database, for example `postgres://postgres:test@localhost:55432/mzizi`.
