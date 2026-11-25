/**
 * The Mzizi public website application (generated frontend).
 *
 * The public Next.js website. It talks only to the main product API.
 * The views of the site are hand-written server pages (see `source/apps/web/app`); this contract owns the operations it consumes and the theme.
 */
import { addresses } from "./address.ts";
import { dryv, surface } from "@dryvcode/author";
import { shared } from "#/schemas/_shared.ts";
import { geography } from "#/schemas/postgres/geography.ts";
import { reference } from "#/schemas/postgres/reference.ts";
import api, { apiOperations } from "#/apps/api/index.ts";
import { frontend } from "#/apps/api/frontend.ts";
import { brand, themes } from "#/schemas/theme.ts";

const web = dryv.group({ name: "web" }).description("The public website: its surface and views.");
const surfaces = web.surfaces({ Main: surface.web() });
const features = web.feature("Features");

const web_app = dryv
  .app({ name: "mzizi-web" })
  .info({ title: "Mzizi public website", version: "0.1.0" })
  .groups(addresses, shared, reference, geography, frontend, brand, web)
  .surfaces(surfaces.Main)
  .theme(themes.Mzizi)
  .consumes(api, ...Object.values(apiOperations));

export default dryv.project({ name: "mzizi-web" }).apps(api, web_app);
