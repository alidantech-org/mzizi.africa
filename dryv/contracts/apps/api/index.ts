/**
 * The Mzizi product API application (NestJS). Modules are named after the schemas they own
 * (`.docs/rules/api-modules.md`); the `frontend` module composes them into screen shapes.
 * It lists every persisted group because operations reference rows across schemas.
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
import { vocabulary } from "#/schemas/postgres/vocabulary.ts";
import { authOperations } from "./auth.ts";
import { civicOperations } from "./civic.ts";
import { communityOperations } from "./community.ts";
import { electionOperations } from "./election.ts";
import { eventOperations } from "./event.ts";
import { financeOperations } from "./finance.ts";
import { frontend, frontendOperations } from "./frontend.ts";
import { geographyOperations } from "./geography.ts";
import { governanceOperations } from "./governance.ts";
import { historyOperations } from "./history.ts";
import { identityOperations } from "./identity.ts";
import { legalOperations } from "./legal.ts";
import { legislatureOperations } from "./legislature.ts";
import { mediaOperations } from "./media.ts";
import { politicsOperations } from "./politics.ts";
import { productOperations } from "./product.ts";
import { referenceOperations } from "./reference.ts";
import { sourceOperations } from "./source.ts";
import { statisticsOperations } from "./statistics.ts";
import { vocabularyOperations } from "./vocabulary.ts";

export const apiOperations = {
  ...authOperations,
  ...civicOperations,
  ...communityOperations,
  ...electionOperations,
  ...eventOperations,
  ...financeOperations,
  ...frontendOperations,
  ...geographyOperations,
  ...governanceOperations,
  ...historyOperations,
  ...identityOperations,
  ...legalOperations,
  ...legislatureOperations,
  ...mediaOperations,
  ...politicsOperations,
  ...productOperations,
  ...referenceOperations,
  ...sourceOperations,
  ...statisticsOperations,
  ...vocabularyOperations,
};

export default dryv
  .app({ name: "mzizi-api" })
  .info({ title: "Mzizi API", version: "0.1.0" })
  .stores({ main: { description: "Verified knowledge, evidence metadata, platform access." } })
  .accessStore("main", { write: true })
  .provides(...Object.values(apiOperations))
  .groups(
    shared,
    vocabulary,
    reference,
    identity,
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
    frontend,
  );
