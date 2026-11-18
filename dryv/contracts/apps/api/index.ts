/**
 * The Mzizi product API application (NestJS).
 *
 * A user-facing surface: the signed-in account and feedback, and read operations over the verified data.
 * It is not a mirror of the database. Promoted facts are written by the engine, never here.
 *
 * It lists only the groups it serves (and the groups those point at).
 */
import { dryv } from "@dryvcode/author";
import { civic } from "#/schemas/postgres/civic.ts";
import { shared } from "#/schemas/_shared.ts";
import { auth } from "#/schemas/postgres/auth.ts";
import { event } from "#/schemas/postgres/event.ts";
import { filesystem } from "#/schemas/postgres/filesystem.ts";
import { finance } from "#/schemas/postgres/finance.ts";
import { geography } from "#/schemas/postgres/geography.ts";
import { governance } from "#/schemas/postgres/governance.ts";
import { legal } from "#/schemas/postgres/legal.ts";
import { official } from "#/schemas/postgres/official.ts";
import { reference } from "#/schemas/postgres/reference.ts";
import { source } from "#/schemas/postgres/source.ts";
import { authOperations } from "./auth.ts";
import { experience, experienceOperations } from "./experience.ts";
import { geographyOperations } from "./geography.ts";
import { governanceOperations } from "./governance.ts";
import { insightOperations, insights } from "./insights.ts";
import { locality, localityOperations } from "./locality.ts";
import { referenceOperations } from "./reference.ts";

export default dryv
  .app({ name: "mzizi-api" })
  .info({ title: "Mzizi API", version: "0.1.0" })
  .stores({ main: { description: "Verified knowledge, evidence metadata, platform access." } })
  .accessStore("main", { write: true })
  .provides(
    ...Object.values(authOperations),
    ...Object.values(referenceOperations),
    ...Object.values(geographyOperations),
    ...Object.values(governanceOperations),
    ...Object.values(localityOperations),
    ...Object.values(insightOperations),
    ...Object.values(experienceOperations),
  )
  .groups(
    shared,
    reference,
    auth,
    geography,
    official,
    legal,
    finance,
    event,
    governance,
    civic,
    source,
    filesystem,
    locality,
    insights,
    experience,
  );
