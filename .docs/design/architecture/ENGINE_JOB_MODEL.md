---
id: DOC-ENGINE-JOB-MODEL-20261113
name: ENGINE_JOB_MODEL
type: documentation
tags: [engine, packages, staging, agent, proposal]
---

# Engine Job Model

**Superseded, 16 November 2026.** This 13 November proposal described pure packages and an engine that does all I/O, a Rust database service and a Mongo staging store. The design that replaced it is [ENGINE_RUNTIME_AND_PACKAGES](ENGINE_RUNTIME_AND_PACKAGES.md) (one runtime, capabilities in packages) and [ENGINE_PERSISTENCE](../data/ENGINE_PERSISTENCE.md) (the engine owns PostgreSQL, MongoDB and vector persistence). The job vocabulary it introduced (runs, jobs, events, the callback outbox) is implemented in `runtime/executor/`. The decision record [DEC-ENGINE-JOB-MODEL-20261113](../../decisions/DEC-ENGINE-JOB-MODEL-20261113.md) is kept as history. See [developer portal](DEVELOPER_PORTAL.md) for the agreed HTTP and future agent direction.
