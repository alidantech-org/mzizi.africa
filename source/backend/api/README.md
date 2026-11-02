# Mzizi API (NestJS)

The Mzizi product API. It reads and serves canonical data and has only three kinds of writes: comments, evidence references and role-gated review decisions. It does not scrape, clean, extract, migrate or seed; those belong to `source/backend/data-engine`, `intelligence`, `files` and `db-engine` (see `.docs/docs/ARCHITECTURE.md` section 7).

Controllers, DTOs and TypeORM entities are generated from the Dryv contracts in the repository-root `dryv/` folder; only service implementations are hand-written. The inherited Python service now lives in `source/backend/api-legacy` as migration source material.

## Run

```bash
bun install
cp .env.example .env
bun run dev        # http://localhost:3000/health
bun test
bun run typecheck
bun run lint
```

## Database access

Two TypeORM connections are configured: `read` (read-only role, all domain reads) and `write` (restricted writer for comment, evidence and review tables). `synchronize` and `migrationsRun` are fixed to false and no migrations path exists, so the API cannot change schema.
