import { dryv } from "@dryvcode/author";

import { shared } from "../../schemas/_shared.ts";
import { accountability } from "../../schemas/mzizi/accountability.ts";
import { civic } from "../../schemas/mzizi/civic.ts";
import { filesystem } from "../../schemas/mzizi/filesystem.ts";
import { finance } from "../../schemas/mzizi/finance.ts";
import { geography } from "../../schemas/mzizi/geography.ts";
import { governance } from "../../schemas/mzizi/governance.ts";
import { legal } from "../../schemas/mzizi/legal.ts";
import { official } from "../../schemas/mzizi/official.ts";
import { politics } from "../../schemas/mzizi/politics.ts";
import { reference } from "../../schemas/mzizi/reference.ts";
import { source } from "../../schemas/mzizi/source.ts";
import { acquisition } from "../../schemas/operational/acquisition.ts";
import { analytics } from "../../schemas/operational/analytics.ts";
import { audit } from "../../schemas/operational/audit.ts";
import { auth } from "../../schemas/operational/auth.ts";
import { engine } from "../../schemas/operational/engine.ts";
import { management } from "../../schemas/operational/management.ts";
import { staging } from "../../schemas/operational/staging.ts";
import { authAccessOperations, filesystemWriteOperations, vocabularyReadOperations } from "./operations.ts";
import { databaseStores } from "./persistence.ts";

/** Database owns both logical stores and explicitly provides its named service operations.
 * Group facets own store placement. The legacy API remains an independent authoring source.
 */
export default dryv
  .app({ name: "mzizi-database" })
  .info({ title: "Mzizi database foundation", version: "0.1.0" })
  .stores(databaseStores)
  .accessStore("main", { write: true })
  .accessStore("operations", { write: true })
  .provides(
    ...Object.values(authAccessOperations),
    ...Object.values(vocabularyReadOperations),
    ...Object.values(filesystemWriteOperations),
  )
  .groups(
    shared,
    auth,
    acquisition,
    engine,
    staging,
    analytics,
    audit,
    management,
    reference,
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
