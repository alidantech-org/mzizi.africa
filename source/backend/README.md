# Backend

The backend holds two projects: the NestJS product API in [`api/`](api/README.md) (decisions, UI contract and canonical database writes) and the Python orchestration engine in [`engine/`](engine/README.md) (jobs, workers, events). Reusable capabilities are under [`../packages`](../packages/README.md); input schemas are in [`../schema`](../schema/README.md); prepared inputs are in [`../../seed`](../../seed/README.md).

Earlier implementations (the inherited FastAPI service, the old data and database engines, the file and intelligence scaffolds) are archived and non-executable: `.docs/_archives/2026-11-08-rewrite-snapshot/`.
