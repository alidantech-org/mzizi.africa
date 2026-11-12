/**
 * Schema: filesystem | Database: mzizi
 * Design: .docs/_plan/schema-redesign/mzizi-db/phase-01/filesystem.md
 * Scope: agreed. Detailed table contracts: pending individual review.
 * Inventory below records proposals, not approval or executable definitions.
 * Existing definitions, where present, remain drafts requiring reconciliation.
 * No new generation activation is authorized by this file.
 */

/*---------------- Candidate table inventory: review required ----------------*/

/** filesystem.folders — Logical published artifact hierarchy.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End filesystem.folders ----------------*/

/** filesystem.files — Stable logical file identity.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End filesystem.files ----------------*/

/** filesystem.file_versions — Exact immutable content version.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End filesystem.file_versions ----------------*/

/** filesystem.file_relations — Typed derivative lineage.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End filesystem.file_relations ----------------*/

/** filesystem.tags — Controlled file catalog labels.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End filesystem.tags ----------------*/

/** filesystem.taggings — File or folder classification.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End filesystem.taggings ----------------*/

// No tables are activated until their detailed contracts are agreed.
export {};
