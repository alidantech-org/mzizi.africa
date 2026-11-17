/**
 * The Mzizi administrative portal application (generated frontend).
 *
 * The Next.js portal for administrators. It talks only to the main product API.
 * First slice only: the shared theme, one surface and one destination, to inspect what generation produces.
 */
import { dryv, outputFrom, part, surface, view } from "@dryvcode/author";
import { shared } from "#/schemas/_shared.ts";
import { geography } from "#/schemas/postgres/geography.ts";
import { reference } from "#/schemas/postgres/reference.ts";
import api from "../api/index.ts";
import { brand, themes } from "#/schemas/theme.ts";
import { geographyOperations } from "../api/geography.ts";

const admin = dryv.group({ name: "admin" }).description("The administrative portal: its surface and views.");
const surfaces = admin.surfaces({ Main: surface.web() });
const features = admin.feature("Features");
const views = features.views({
  FeatureList: view()
    .role("list")
    .parts({ features: part.present(outputFrom(geographyOperations.BrowseFeatures.out, ["features"])) })
    .presentation("web", surfaces.Main),
});

const admin_app = dryv
  .app({ name: "mzizi-admin" })
  .info({ title: "Mzizi administrative portal", version: "0.1.0" })
  .groups(shared, reference, geography, brand, admin)
  .surfaces(surfaces.Main)
  .theme(themes.Mzizi)
  .consumes(api, geographyOperations.BrowseFeatures)
  .destination("features", views.FeatureList);

export default dryv.project({ name: "mzizi-admin" }).apps(api, admin_app);
