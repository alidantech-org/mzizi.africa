---
id: DOC-DATABASE-ACCESS-AND-LIFECYCLE-20261113
name: DATABASE_ACCESS_AND_LIFECYCLE
type: documentation
tags: [database, python, rust, nestjs, mongo, vector, lifecycle]
---

# Database Access And Lifecycle

**Superseded, 15 and 16 November 2026.** The Rust database service, the two-database layout and the exclusive database service this guide described were removed. Current design: [DATABASE_ARCHITECTURE](../data/DATABASE_ARCHITECTURE.md) (one PostgreSQL database, Mongo staging, direct access, Bun CLI) and [ENGINE_PERSISTENCE](../data/ENGINE_PERSISTENCE.md) (how the engine reaches each store). The decision record [DEC-DATABASE-ACCESS-LIFECYCLE](../../decisions/DEC-DATABASE-ACCESS-LIFECYCLE.md) is kept as history.
