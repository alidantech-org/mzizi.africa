/**
 * The Mzizi product API application (NestJS).
 *
 * A user-facing surface: the signed-in account and feedback, and read operations over the verified data.
 * It is not a mirror of the database. Promoted facts are written by the engine, never here.
 *
 * It lists only the groups it serves (and the groups those point at). The SQL snapshot is generated from
 * the separate pgsql app, which lists every persisted group.
 */
import { dryv } from "@dryvcode/author";
import { shared } from "#/schemas/_shared.ts";
import { auth } from "#/schemas/postgres/auth.ts";
import { filesystem } from "#/schemas/postgres/filesystem.ts";
import { geography } from "#/schemas/postgres/geography.ts";
import { governance } from "#/schemas/postgres/governance.ts";
import { official } from "#/schemas/postgres/official.ts";
import { reference } from "#/schemas/postgres/reference.ts";
import { source } from "#/schemas/postgres/source.ts";
import { authOperations } from "./auth.ts";
import { geographyOperations } from "./geography.ts";
import { governanceOperations } from "./governance.ts";
import { referenceOperations } from "./reference.ts";

export default dryv
  .app({ name: "mzizi-api" })
  .info({ title: "Mzizi API", version: "0.1.0" })
  .stores({ main: { description: "Verified knowledge, evidence metadata, platform access and audit records." } })
  .accessStore("main", { write: true })
  .provides(
    ...Object.values(authOperations),
    ...Object.values(referenceOperations),
    ...Object.values(geographyOperations),
    ...Object.values(governanceOperations),
  )
  .groups(shared, reference, auth, geography, official, governance, source, filesystem);
