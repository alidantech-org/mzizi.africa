import { dryv } from "@dryvcode/author";

import { geography } from "./foundation/geography/index.ts";
import { reference } from "./foundation/reference/index.ts";
import { frontendSurfaces, shared } from "./foundation/shared/index.ts";

/**
 * Mzizi Dryv application. Domain groups are added as each domain task lands:
 * geography (pilot), legal, governance, elections, finance and the rest.
 */
export default dryv
  .app({ name: "mzizi-api" })
  .info({ title: "Mzizi API", version: "0.1.0" })
  .groups(shared, reference, geography)
  .surfaces(frontendSurfaces.Web, frontendSurfaces.Mobile, frontendSurfaces.AdminWeb);
