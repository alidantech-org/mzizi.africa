/**
 * The PostgreSQL application: the one place that lists every persisted group.
 *
 * It exists only to generate the SQL snapshot (the `postgres-sql` pack, bound in `dryv.yaml`). It has no
 * operations and no HTTP surface; the API and engine apps do not own the store.
 * Groups follow FOUNDATION_REDESIGN section 2 (approved 2026-11-25).
 */
import { dryv } from "@dryvcode/author";
import { shared } from "#/schemas/_shared.ts";
import { auth } from "#/schemas/postgres/auth.ts";
import { civic } from "#/schemas/postgres/civic.ts";
import { community } from "#/schemas/postgres/community.ts";
import { economy } from "#/schemas/postgres/economy.ts";
import { election } from "#/schemas/postgres/election.ts";
import { event } from "#/schemas/postgres/event.ts";
import { filesystem } from "#/schemas/postgres/filesystem.ts";
import { finance } from "#/schemas/postgres/finance.ts";
import { geography } from "#/schemas/postgres/geography.ts";
import { governance } from "#/schemas/postgres/governance.ts";
import { history } from "#/schemas/postgres/history.ts";
import { identity } from "#/schemas/postgres/identity.ts";
import { legal } from "#/schemas/postgres/legal.ts";
import { legislature } from "#/schemas/postgres/legislature.ts";
import { media } from "#/schemas/postgres/media.ts";
import { official } from "#/schemas/postgres/official.ts";
import { politics } from "#/schemas/postgres/politics.ts";
import { product } from "#/schemas/postgres/product.ts";
import { reference } from "#/schemas/postgres/reference.ts";
import { source } from "#/schemas/postgres/source.ts";
import { statistics } from "#/schemas/postgres/statistics.ts";
import { template } from "#/schemas/postgres/template.ts";
import { vocabulary } from "#/schemas/postgres/vocabulary.ts";

export default dryv
  .app({ name: "mzizi-pgsql" })
  .info({ title: "Mzizi PostgreSQL", version: "0.1.0" })
  .stores({ main: { description: "Verified knowledge, evidence metadata, platform access." } })
  .accessStore("main", { write: true })
  .groups(
    shared,
    vocabulary,
    reference,
    identity,
    template,
    product,
    filesystem,
    media,
    geography,
    history,
    official,
    source,
    legal,
    governance,
    legislature,
    politics,
    election,
    civic,
    finance,
    economy,
    statistics,
    event,
    community,
    auth,
  );
