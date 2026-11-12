/**
 * Schema: acquisition | Database: mzizi_operations
 * Design: .docs/_plan/schema-redesign/mzizi-operational-db/acquisition.md
 * Scope: agreed. Detailed table contracts: pending individual review.
 * Inventory below records proposals, not approval or executable definitions.
 * Existing definitions, where present, remain drafts requiring reconciliation.
 * No new generation activation is authorized by this file.
 */

/*---------------- Candidate table inventory: review required ----------------*/

/** acquisition.targets — Collection targets under policy.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End acquisition.targets ----------------*/

/** acquisition.frontier — Retryable crawl queue state.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End acquisition.frontier ----------------*/

/** acquisition.observations — Observed page/link fingerprints.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End acquisition.observations ----------------*/

/** acquisition.mappings — Candidate extraction-to-domain field maps.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End acquisition.mappings ----------------*/

// No tables are activated until their detailed contracts are agreed.
export {};
