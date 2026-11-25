/**
 * The Mzizi mobile app application (generated frontend). It talks only to the main product API.
 * Views use the schema modules' reads; screen composition comes from the `frontend` module.
 */
import { dryv, inputFrom, outputFrom, part, surface, view } from "@dryvcode/author";
import { shared } from "#/schemas/_shared.ts";
import { sharedProperties as p } from "#/schemas/_shared.ts";
import { geography } from "#/schemas/postgres/geography.ts";
import { reference } from "#/schemas/postgres/reference.ts";
import api, { apiOperations } from "#/apps/api/index.ts";
import { frontend } from "#/apps/api/frontend.ts";
import { brand, themes } from "#/schemas/theme.ts";

const app = dryv.group({ name: "app" }).description("The mobile app: its surface and views.");
const surfaces = app.surfaces({ Main: surface.mobile() });
const features = app.feature("Features");
const views = features.views({
  PlaceBrowse: view()
    .role("list")
    .description("Browse places, narrowed by code prefix.")
    .parts({
      filters: part.collect(inputFrom(apiOperations.ListPlaces.in, ["codePrefix"])).flow("inline"),
      places: part.present(outputFrom(apiOperations.ListPlaces.out, ["places"])).collection("table"),
    })
    .presentation("mobile", surfaces.Main),
  PlaceDetail: view()
    .role("detail")
    .description("One place with its parent links.")
    .context("code", p.IdentityCode)
    .parts({ place: part.present(outputFrom(apiOperations.GetPlace.out)).context({ code: "code" }) })
    .presentation("mobile", surfaces.Main),
  SourceBrowse: view()
    .role("list")
    .description("The data sources behind the platform.")
    .parts({ sources: part.present(outputFrom(apiOperations.ListSources.out, ["sources"])).collection("table") })
    .presentation("mobile", surfaces.Main),
});

const app_app = dryv
  .app({ name: "mzizi-app" })
  .info({ title: "Mzizi mobile app", version: "0.1.0" })
  .groups(shared, reference, geography, frontend, brand, app)
  .surfaces(surfaces.Main)
  .theme(themes.Mzizi)
  .consumes(api, ...Object.values(apiOperations))
  .destination("places", views.PlaceBrowse)
  .destination("place", views.PlaceDetail)
  .destination("sources", views.SourceBrowse)
  .transition("openPlace", "places", "place", { operation: apiOperations.GetPlace });

export default dryv.project({ name: "mzizi-app" }).apps(api, app_app);
