import { dryv } from "@dryvcode/author";

import { shared } from "#/schemas/_shared.ts";
import { accountability } from "#/schemas/postgres/accountability.ts";
import { civic } from "#/schemas/postgres/civic.ts";
import { filesystem } from "#/schemas/postgres/filesystem.ts";
import { finance } from "#/schemas/postgres/finance.ts";
import { geography } from "#/schemas/postgres/geography.ts";
import { governance } from "#/schemas/postgres/governance.ts";
import { legal } from "#/schemas/postgres/legal.ts";
import { official } from "#/schemas/postgres/official.ts";
import { politics } from "#/schemas/postgres/politics.ts";
import { reference } from "#/schemas/postgres/reference.ts";
import { source } from "#/schemas/postgres/source.ts";
import { acquisition } from "#/schemas/postgres/acquisition.ts";
import { analytics } from "#/schemas/postgres/analytics.ts";
import { audit } from "#/schemas/postgres/audit.ts";
import { auth } from "#/schemas/postgres/auth.ts";
import { engine } from "#/schemas/postgres/engine.ts";
import { management } from "#/schemas/postgres/management.ts";
import { staging } from "#/schemas/postgres/staging.ts";
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
