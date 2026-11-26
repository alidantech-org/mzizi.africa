# PostgreSQL desired database objects

Activate this pack with an explicit canonical store and PostgreSQL connection. Its generated
module contains `pack.database` projections of query-backed views and explicitly bound native
routines. Apply views through the persistence pack's `PostgresDatabaseObjects` adapter after
foundation tables exist. Migration execution belongs to the Client/application integration;
templates never connect to a database or touch workspace files.

View reconciliation records catalog-normalized definitions, detects drift and rejects unmanaged
name collisions. Creation is transactional. Replacement or removal requires explicit destructive
intervention. Materialized results refresh only on an explicit `refresh(view)` call; schedule that
call through a workflow/custom operation when desired. Existing narrow SQL migration views stay
supported; choose one lifecycle owner for any physical object and never deploy it twice.

Native function/procedure bindings compile existing same-store operation plans to PL/pgSQL.
The initial ABI takes canonical JSON input and trusted execution context; functions return JSON
and procedures expose an INOUT JSON result. The application runtime validates policies before
invocation, and generated bodies recheck required policies, input and output shape. Generated
routines are SECURITY INVOKER, set a controlled search path and revoke PUBLIC execution.
Application deployment owns explicit execution grants and trusted-context creation.

Native compilation rejects unsupported custom bodies, effects without a native outbox mapping,
pagination and typed-savepoint recovery. These requirements cannot silently move to application
execution. Invalidations are queued transactionally in `_dryv.invalidations`; an application
relay must process those committed records. This source milestone is not complete native-feature
coverage; the linked tasks track those additional adapters and validation separately.

## Initial SQL snapshots and project release assemblers

The generated object module also exports `compilePostgresObjects`. A Bun release CLI can call
`compilePostgresObjects(databaseObjects, { snake: false })` and append the returned SQL to its
initial `schema.sql` after foundation tables and project-provided routine bodies. This pure
compiler opens no database connection, performs no workspace I/O and creates no lifecycle ledger.
It generates supported routines, views and all-write row triggers from the same canonical plans.
The release assembler owns the file, transaction and deployment. This initial snapshot exporter
is not an upgrade/drift planner; use the observed lifecycle adapter or reviewed migrations later.
Managed-write hooks require application execution and are rejected by native snapshot export.
After-commit jobs still require the durable worker and explicit authorization adapter.

Project-owned SQL may remain ordinary SQL/Jinja snippets in a project pack. A schema can carry
`.tags("routine:generate_dependents")`; a pack requests `schema.tags` and chooses its known
snippet. Tags convey metadata and never make arbitrary SQL portable or validated business logic.
A `provided: true` native binding records an external routine's contract/placement; its body is
not emitted by Dryv. Include that body explicitly in the release assembly. Loops and INSERT SELECT
remain handwritten there until compatible authored lowering is implemented. Do not encode SQL
source into tags or silently replace a managed-write guarantee with an all-write trigger.
