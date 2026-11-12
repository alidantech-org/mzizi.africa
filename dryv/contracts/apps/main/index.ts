// Legacy pre-foundation contracts: groups now live under contracts/_archive/ and keep
// generating the existing NestJS API until its migration to the new schemas/apps design.
import { dryv } from "@dryvcode/author";

import { pipeline } from "../../_archive/domains/pipeline/index.ts";
import { contact, place } from "../../_archive/domains/place/index.ts";
import { website } from "../../_archive/domains/website/index.ts";
import { exchange } from "../../_archive/domains/exchange/index.ts";
import { filesystem } from "../../_archive/domains/filesystem/index.ts";
import { identity, person } from "../../_archive/domains/person/index.ts";
import { source } from "../../_archive/domains/source/index.ts";
import { audit } from "../../_archive/domains/audit/index.ts";
import { elections, events, political } from "../../_archive/domains/elections/index.ts";
import { services, statistics } from "../../_archive/domains/statistics/index.ts";
import { debt, entities, finance, procurement } from "../../_archive/domains/finance/index.ts";
import { governance } from "../../_archive/domains/governance/index.ts";
import { legal } from "../../_archive/domains/legal/index.ts";
import { geography } from "../../_archive/foundation/geography/index.ts";
import { reference } from "../../_archive/foundation/reference/index.ts";
import { frontendSurfaces, shared } from "../../_archive/foundation/shared/index.ts";

/**
 * Mzizi Dryv application. Domain groups are added as each domain task lands:
 * geography (pilot), legal, governance, elections, finance and the rest.
 */
export default dryv
  .app({ name: "mzizi-api" })
  .info({ title: "Mzizi API", version: "0.1.0" })
  .groups(
    shared,
    reference,
    geography,
    legal,
    governance,
    elections,
    political,
    events,
    entities,
    finance,
    debt,
    procurement,
    statistics,
    services,
    person,
    identity,
    filesystem,
    source,
    website,
    place,
    contact,
    audit,
    exchange,
    pipeline,
  )
  .surfaces(frontendSurfaces.Web, frontendSurfaces.Mobile, frontendSurfaces.AdminWeb);
