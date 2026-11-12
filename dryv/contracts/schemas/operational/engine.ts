/**
 * Schema: engine | Database: mzizi_operations
 * Design: .docs/_plan/schema-redesign/mzizi-operational-db/engine.md
 * Scope: agreed. Detailed table contracts: pending individual review.
 * Inventory below records proposals, not approval or executable definitions.
 * Existing definitions, where present, remain drafts requiring reconciliation.
 * No new generation activation is authorized by this file.
 */

/*---------------- Candidate table inventory: review required ----------------*/

/** engine.pipeline_releases — Immutable pipeline definitions.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End engine.pipeline_releases ----------------*/

/** engine.runs — Pipeline invocation.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End engine.runs ----------------*/

/** engine.jobs — Retryable unit of execution.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End engine.jobs ----------------*/

/** engine.events — Operational execution history.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End engine.events ----------------*/

/** engine.outbox — Durable delivery obligations.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End engine.outbox ----------------*/

/** engine.artifacts — Temporary operational object references.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End engine.artifacts ----------------*/

// No tables are activated until their detailed contracts are agreed.
export {};
