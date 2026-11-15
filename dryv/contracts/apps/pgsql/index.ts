/**
 * The PostgreSQL application: the one place that lists every persisted group.
 *
 * It exists only to generate the SQL snapshot (the `postgres-sql` pack, bound in `dryv.yaml`). It has no
 * operations and no HTTP surface; the API and engine apps do not own the store.
 */
import { dryv } from "@dryvcode/author";
import { shared } from "#/schemas/_shared.ts";
import { accountability } from "#/schemas/postgres/accountability.ts";
import { audit } from "#/schemas/postgres/audit.ts";
import { auth } from "#/schemas/postgres/auth.ts";
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

export default dryv
  .app({ name: "mzizi-pgsql" })
  .info({ title: "Mzizi PostgreSQL", version: "0.1.0" })
  .stores({ main: { description: "Verified knowledge, evidence metadata, platform access and audit records." } })
  .accessStore("main", { write: true })
  .groups(
    shared,
    audit,
    auth,
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
