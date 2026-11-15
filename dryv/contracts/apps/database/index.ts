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
import { audit } from "#/schemas/postgres/audit.ts";
import { auth } from "#/schemas/postgres/auth.ts";
import { authOperations } from "#/apps/database/auth.ts";
import { filesystemOperations } from "#/apps/database/filesystem.ts";
import { referenceOperations } from "#/apps/database/reference.ts";

/** Compose domain capabilities and grant the service access to its single store. */
export default dryv
  .app({ name: "mzizi-database" })
  .info({ title: "Mzizi database service", version: "0.1.0" })
  .stores({
    main: { description: "Verified knowledge, evidence metadata, platform access and audit records." },
  })
  .accessStore("main", { write: true })
  .provides(...Object.values(authOperations), ...Object.values(referenceOperations), ...Object.values(filesystemOperations))
  .groups(
    shared,
    auth,
    audit,
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
