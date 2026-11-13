import { dryv } from "@dryvcode/author";

import { shared } from "#/schemas/_shared.ts";
import { accountability } from "#/schemas/mzizi/accountability.ts";
import { civic } from "#/schemas/mzizi/civic.ts";
import { filesystem } from "#/schemas/mzizi/filesystem.ts";
import { finance } from "#/schemas/mzizi/finance.ts";
import { geography } from "#/schemas/mzizi/geography.ts";
import { governance } from "#/schemas/mzizi/governance.ts";
import { legal } from "#/schemas/mzizi/legal.ts";
import { official } from "#/schemas/mzizi/official.ts";
import { politics } from "#/schemas/mzizi/politics.ts";
import { reference } from "#/schemas/mzizi/reference.ts";
import { source } from "#/schemas/mzizi/source.ts";
import { acquisition } from "#/schemas/operational/acquisition.ts";
import { analytics } from "#/schemas/operational/analytics.ts";
import { audit } from "#/schemas/operational/audit.ts";
import { auth } from "#/schemas/operational/auth.ts";
import { engine } from "#/schemas/operational/engine.ts";
import { management } from "#/schemas/operational/management.ts";
import { staging } from "#/schemas/operational/staging.ts";
import { authOperations } from "#/apps/database/auth.ts";
import { filesystemOperations } from "#/apps/database/filesystem.ts";
import { referenceOperations } from "#/apps/database/reference.ts";

/** Compose domain capabilities and grant the service access to its two stores. */
export default dryv
  .app({ name: "mzizi-database" })
  .info({ title: "Mzizi database service", version: "0.1.0" })
  .stores({
    main: { description: "Accepted knowledge and evidence metadata." },
    operations: { description: "Platform access, research processing, and operational records." },
  })
  .accessStore("main", { write: true })
  .accessStore("operations", { write: true })
  .provides(...Object.values(authOperations), ...Object.values(referenceOperations), ...Object.values(filesystemOperations))
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
