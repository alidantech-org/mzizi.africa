/**
 * The Mzizi mobile app application (generated frontend).
 *
 * The public Flutter app. It talks only to the main product API.
 * First slice only: the shared theme, one surface and one destination, to inspect what generation produces.
 */
import { dryv, outputFrom, part, surface, view } from "@dryvcode/author";
import { shared } from "#/schemas/_shared.ts";
import { geography } from "#/schemas/postgres/geography.ts";
import { reference } from "#/schemas/postgres/reference.ts";
import api from "../api/index.ts";
import { brand, themes } from "#/schemas/theme.ts";
import { geographyOperations } from "../api/geography.ts";

const app = dryv.group({ name: "app" }).description("The mobile app: its surface and views.");
const surfaces = app.surfaces({ Main: surface.mobile() });
const features = app.feature("Features");
const views = features.views({
  FeatureList: view()
    .role("list")
    .parts({ features: part.present(outputFrom(geographyOperations.BrowseFeatures.out, ["features"])) })
    .presentation("mobile", surfaces.Main),
});

const app_app = dryv
  .app({ name: "mzizi-app" })
  .info({ title: "Mzizi mobile app", version: "0.1.0" })
  .groups(shared, reference, geography, brand, app)
  .surfaces(surfaces.Main)
  .theme(themes.Mzizi)
  .consumes(api, geographyOperations.BrowseFeatures)
  .destination("features", views.FeatureList);

export default dryv.project({ name: "mzizi-app" }).apps(api, app_app);
