# mzizi-database-client

Typed async HTTP client for the Rust database service's named operations (`source/backend/database`). One async method per operation, matching the Dryv-authored contract in `dryv/contracts/apps/database/operations.ts`. No SQL, no table or schema name, no database credential — only the service's own bearer token.

Hand-written today: the official Dryv `python-client-sdk` pack fails to load against the running Dryv engine (and its server-side counterpart, `axum-backend`, fails the same way). See [DEC-DATABASE-ACCESS-LIFECYCLE](../../../.docs/decisions/DEC-DATABASE-ACCESS-LIFECYCLE.md). Every model and method mirrors the Dryv contract so swapping in generated code later changes nothing a caller sees.

See [../README.md](../README.md) for the package map and workspace commands. Tests: `uv run pytest source/packages/database_client`.
