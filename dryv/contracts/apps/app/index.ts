/**
 * The Mzizi mobile app application (generated frontend).
 *
 * The public Flutter app. It talks only to the main product API.
 * First slice only: the shared theme, one surface and one destination, to inspect what generation produces.
 */
import { dryv, inputFrom, outputFrom, part, surface, view } from "@dryvcode/author";
import { shared, sharedProperties as p } from "#/schemas/_shared.ts";
import { geography } from "#/schemas/postgres/geography.ts";
import { reference } from "#/schemas/postgres/reference.ts";
import api from "#/apps/api/index.ts";
import { brand, themes } from "#/schemas/theme.ts";
import { geographyOperations } from "#/apps/api/geography.ts";

const app = dryv.group({ name: "app" }).description("The mobile app: its surface and views.");
const surfaces = app.surfaces({ Main: surface.mobile() });
const features = app.feature("Features");
const views = features.views({
  FeatureBrowse: view()
    .role("list")
    .description("Browse geographic features, narrowed by feature kind or code prefix.")
    .parts({
      filters: part
        .collect(inputFrom(geographyOperations.BrowseFeatures.in, ["featureTypeId", "codePrefix"]))
        .flow("inline"),
      features: part.present(outputFrom(geographyOperations.BrowseFeatures.out, ["features"])).collection("table"),
    })
    .presentation("mobile", surfaces.Main),

  FeatureDetail: view()
    .role("detail")
    .description("One geographic feature with its names.")
    .context("featureId", p.Id)
    .parts({
      // Context can bind an operation's input only through an invoke part (a collect needs at least one
      // collected path). The tag tells the assembler this one runs when the view opens, not on a tap.
      load: part.invoke(geographyOperations.GetFeature, { featureId: "featureId" }).tags("run:on-open"),
      feature: part.present(outputFrom(geographyOperations.GetFeature.out)),
    })
    .presentation("mobile", surfaces.Main),
});

const app_app = dryv
  .app({ name: "mzizi-app" })
  .info({ title: "Mzizi mobile app", version: "0.1.0" })
  .groups(shared, reference, geography, brand, app)
  .surfaces(surfaces.Main)
  .theme(themes.Mzizi)
  .consumes(api, geographyOperations.BrowseFeatures, geographyOperations.GetFeature, geographyOperations.BrowseFeatureKinds)
  .destination("browse", views.FeatureBrowse)
  .destination("detail", views.FeatureDetail)
  .transition("openFeature", "browse", "detail", { operation: geographyOperations.GetFeature });

export default dryv.project({ name: "mzizi-app" }).apps(api, app_app);
