/**
 * Schema: legal | Database: mzizi
 * Design: .docs/_plan/schema-redesign/mzizi-db/phase-01/legal.md
 * Scope: agreed. Detailed table contracts: pending individual review.
 * Inventory below records proposals, not approval or executable definitions.
 * Existing definitions, where present, remain drafts requiring reconciliation.
 * No new generation activation is authorized by this file.
 */

/*---------------- Candidate table inventory: review required ----------------*/

/** legal.instruments — Stable legal instrument identity.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End legal.instruments ----------------*/

/** legal.instrument_versions — Exact source-backed legal releases.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End legal.instrument_versions ----------------*/

/** legal.provisions — Stable sections within an instrument.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End legal.provisions ----------------*/

/** legal.provision_versions — Versioned provision wording.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End legal.provision_versions ----------------*/

/** legal.amendments — Changes made by legal authority.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End legal.amendments ----------------*/

// No tables are activated until their detailed contracts are agreed.
export {};
