/**
 * Schema: procurement | Database: mzizi
 * Design: .docs/_plan/schema-redesign/mzizi-db/phase-01/procurement.md
 * Scope: agreed. Detailed table contracts: pending individual review.
 * Inventory below records proposals, not approval or executable definitions.
 * Existing definitions, where present, remain drafts requiring reconciliation.
 * No new generation activation is authorized by this file.
 */

/*---------------- Candidate table inventory: review required ----------------*/

/** procurement.tenders — Published procurement opportunity.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End procurement.tenders ----------------*/

/** procurement.bids — Published tender bids.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End procurement.bids ----------------*/

/** procurement.contracts — Awarded contract.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End procurement.contracts ----------------*/

/** procurement.milestones — Contractual delivery obligations.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End procurement.milestones ----------------*/

/** procurement.variations — Authorized changes to contract.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End procurement.variations ----------------*/

// No tables are activated until their detailed contracts are agreed.
export {};
