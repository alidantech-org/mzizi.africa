# Mzizi Dryv contracts

Contracts for the canonical Mzizi model, authored in Python with `dryv_author`. Dryv compiles them to Runtime IR, and template packs generate the NestJS controllers, DTOs and TypeORM entities in `source/backend/api`. Only service implementations are hand-written. See `.docs/decisions/dryv-pack-source.md`.

## Layout

- `dryv.yaml`: sources and the pinned Dryv ref (`6dba3100f02ada9dfd061e5100112c1d01760e3b`).
- `contracts/app.py`: composes the application from group modules.
- `contracts/shared.py`: shared provenance, valid time, record time, verification, business code, jurisdiction, classification record, failures and page contracts.
- One module per domain group (geography, legal, governance and so on) is added as each domain task lands.

## Shared contract rules

- Every claim-bearing record embeds `Provenance`, `ValidTime`, `RecordTime` and `Verification`. Provenance is not optional.
- Valid time (when the claim is true historically) is separate from record time (when Mzizi observed or stored it).
- Business codes are hierarchical and lowercase, such as `ke/nairobi/westlands`. The first segment is the jurisdiction code.
- Levels, institution types, election types, selection methods and fiscal stages are `ClassificationRecord` rows scoped by jurisdiction and period, never enums or columns.
- Contracts never name a country. Kenya is data.

## Compile

```bash
cd dryv
uv sync
uv run dryv-py compile contracts/app.py
```

The command prints JSONL; a final `end` message with an item count means success, and any `diagnostic` or `error` message is a failure.
