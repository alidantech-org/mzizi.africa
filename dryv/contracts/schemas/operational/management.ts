/**
 * Schema: management | Database: mzizi_operations
 * Design: .docs/_plan/schema-redesign/mzizi-operational-db/management.md
 * Scope: agreed. Detailed table contracts: pending individual review.
 * Inventory below records proposals, not approval or executable definitions.
 * Existing definitions, where present, remain drafts requiring reconciliation.
 * No new generation activation is authorized by this file.
 */

/*---------------- Candidate table inventory: review required ----------------*/

/** management.schema_releases — Applied immutable Dryv migration release history.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End management.schema_releases ----------------*/

/** management.publications — Operations publication coordination record.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End management.publications ----------------*/

/** management.publication_items — Requested or confirmed targets covered by coordination record.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End management.publication_items ----------------*/

/** management.delivery_receipts — Operations reconciliation of Main commits.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End management.delivery_receipts ----------------*/

// No tables are activated until their detailed contracts are agreed.
export {};
