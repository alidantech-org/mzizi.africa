/**
 * The Mzizi public website application (generated frontend).
 *
 * The public Next.js website. It talks only to the main product API.
 * First slice only: the shared theme, one surface and one destination, to inspect what generation produces.
 */
import { dryv, outputFrom, part, surface, view } from "@dryvcode/author";
import { shared } from "#/schemas/_shared.ts";
import { geography } from "#/schemas/postgres/geography.ts";
import { reference } from "#/schemas/postgres/reference.ts";
import api from "#/apps/api/index.ts";
import { brand, themes } from "#/schemas/theme.ts";
import { geographyOperations } from "#/apps/api/geography.ts";

const web = dryv.group({ name: "web" }).description("The public website: its surface and views.");
const surfaces = web.surfaces({ Main: surface.web() });
const features = web.feature("Features");
const views = features.views({
  FeatureList: view()
    .role("list")
    .parts({ features: part.present(outputFrom(geographyOperations.BrowseFeatures.out, ["features"])) })
    .presentation("web", surfaces.Main),
});

const web_app = dryv
  .app({ name: "mzizi-web" })
  .info({ title: "Mzizi public website", version: "0.1.0" })
  .groups(shared, reference, geography, brand, web)
  .surfaces(surfaces.Main)
  .theme(themes.Mzizi)
  .consumes(api, geographyOperations.BrowseFeatures)
  .destination("features", views.FeatureList);

export default dryv.project({ name: "mzizi-web" }).apps(api, web_app);
