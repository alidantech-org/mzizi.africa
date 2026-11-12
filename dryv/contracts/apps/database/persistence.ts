/**
 * Schema-to-database catalogue for the Rust database foundation.
 *
 * Every storage namespace is registered up front; the foundation generates tables only for the
 * groups composed in this app's entrypoint. Cross-database foreign keys are forbidden: the Rust
 * packs reject a relation whose source and target namespaces map to different databases.
 * Each database also carries a reserved `_mzizi` technical schema (target identity and migration
 * ledger) owned by the CLI, not by contracts.
 */
export type TargetDatabase = "mzizi" | "mzizi_operations";

export const databaseAssignments: Record<string, TargetDatabase> = {
  // mzizi: canonical domain data
  reference: "mzizi",
  geography: "mzizi",
  legal: "mzizi",
  official: "mzizi",
  governance: "mzizi",
  politics: "mzizi",
  finance: "mzizi",
  procurement: "mzizi",
  civic: "mzizi",
  accountability: "mzizi",
  source: "mzizi",
  filesystem: "mzizi",
  // mzizi_operations: platform operations
  auth: "mzizi_operations",
  acquisition: "mzizi_operations",
  engine: "mzizi_operations",
  staging: "mzizi_operations",
  analytics: "mzizi_operations",
  audit: "mzizi_operations",
  management: "mzizi_operations",
};
