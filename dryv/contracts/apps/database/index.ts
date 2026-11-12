import { dryv } from "@dryvcode/author";

import { shared } from "../../schemas/_shared.ts";
import { acquisition } from "../../schemas/operational/acquisition.ts";
import { analytics } from "../../schemas/operational/analytics.ts";
import { audit } from "../../schemas/operational/audit.ts";
import { auth } from "../../schemas/operational/auth.ts";
import { engine } from "../../schemas/operational/engine.ts";
import { management } from "../../schemas/operational/management.ts";
import { staging } from "../../schemas/operational/staging.ts";

import "./operations.ts";
import { vocabulary } from "../../schemas/mzizi/reference.ts";
import { referenceLegal } from "../../schemas/mzizi/reference.ts";
import { geography } from "../../schemas/mzizi/geography.ts";
import { legal } from "../../schemas/mzizi/legal.ts";
import { official } from "../../schemas/mzizi/official.ts";
import { governance } from "../../schemas/mzizi/governance.ts";
import { politics } from "../../schemas/mzizi/politics.ts";
import { civic } from "../../schemas/mzizi/civic.ts";
import { finance } from "../../schemas/mzizi/finance.ts";
import { source } from "../../schemas/mzizi/source.ts";
import { filesystem } from "../../schemas/mzizi/filesystem.ts";
import { accountability } from "../../schemas/mzizi/accountability.ts";

/**
 * Mzizi database foundation application.
 *
 * Compiled by its own authoring source (`sources.authoring.database` in `dryv.yaml`) and consumed
 * by the Rust packs (`dryv/packs/rust-models`, `dryv/packs/rust-sql`), separately from the NestJS
 * API application in `contracts/index.ts`. Schema-to-database assignment lives in
 * `./persistence.ts`; the packs reject unassigned namespaces and cross-database foreign keys.
 *
 * This database source composes the persisted Main and Operations groups explicitly. Contract
 * compilation validates the graph; generation remains gated by the SQL enforcement gaps documented
 * in the six-domain decision and handoff.
 */
export default dryv
  .app({ name: "mzizi-database" })
  .info({ title: "Mzizi database foundation", version: "0.1.0" })
  .groups(
    shared,
    auth,
    acquisition,
    engine,
    staging,
    analytics,
    audit,
    management,
    vocabulary,
    referenceLegal,
    geography,
    legal,
    official,
    governance,
    politics,
    civic,
    finance,
    source,
    filesystem,
    accountability,
  );

export { databaseAssignments } from "./persistence.ts";
