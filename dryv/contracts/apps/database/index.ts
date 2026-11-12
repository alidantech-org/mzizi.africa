import { dryv } from "@dryvcode/author";

import { shared } from "../../schemas/_shared.ts";
import { auth } from "../../schemas/operational/auth.ts";

import "./operations.ts";
import { vocabulary } from "../../schemas/mzizi/reference.ts";

/**
 * Mzizi database foundation application.
 *
 * Compiled by its own authoring source (`sources.authoring.database` in `dryv.yaml`) and consumed
 * by the Rust packs (`dryv/packs/rust-models`, `dryv/packs/rust-sql`), separately from the NestJS
 * API application in `contracts/index.ts`. Schema-to-database assignment lives in
 * `./persistence.ts`; the packs reject unassigned namespaces and cross-database foreign keys.
 *
 * Activating this source's packs requires the Dryv multi-authoring enhancement
 * (.docs/_plan/database-foundation/DRYV_MULTI_AUTHORING.md).
 */
export default dryv
  .app({ name: "mzizi-database" })
  .info({ title: "Mzizi database foundation", version: "0.1.0" })
  .groups(shared, auth, vocabulary);

export { databaseAssignments } from "./persistence.ts";
