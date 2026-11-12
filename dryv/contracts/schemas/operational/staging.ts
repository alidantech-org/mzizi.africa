/**
 * Schema: staging | Database: mzizi_operations
 * Design: .docs/_plan/schema-redesign/mzizi-operational-db/staging.md
 * Scope: agreed. Detailed table contracts: pending individual review.
 * Inventory below records proposals, not approval or executable definitions.
 * Existing definitions, where present, remain drafts requiring reconciliation.
 * No new generation activation is authorized by this file.
 */

/*---------------- Candidate table inventory: review required ----------------*/

/** staging.candidates — Candidate identity scoped to target contract.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End staging.candidates ----------------*/

/** staging.revisions — Immutable candidate payload versions.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End staging.revisions ----------------*/

/** staging.findings — Validation warnings/errors.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End staging.findings ----------------*/

/** staging.reviews — Operational review decision.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End staging.reviews ----------------*/

/** staging.promotion_requests — Idempotent request to publish a revision.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End staging.promotion_requests ----------------*/

// No tables are activated until their detailed contracts are agreed.
export {};
