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
import { insightOperations, insights } from "#/apps/api/insights.ts";
import { locality, localityOperations } from "#/apps/api/locality.ts";

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
      // The detail view shows GetFeature for the identifier it holds as context.
      feature: part.present(outputFrom(geographyOperations.GetFeature.out)).context({ featureId: "featureId" }),
    })
    .presentation("mobile", surfaces.Main),

  PlaceSearch: view()
    .role("list")
    .description("Find a place by name and open its profile.")
    .parts({
      filters: part.collect(inputFrom(localityOperations.SearchLocalities.in, ["query"])).flow("inline"),
      places: part.present(outputFrom(localityOperations.SearchLocalities.out, ["places"])).collection("table"),
    })
    .presentation("mobile", surfaces.Main),

  PlaceProfile: view()
    .role("detail")
    .description("Who serves a place: officials, procurement, media and the evidence for each claim.")
    .context("featureId", p.Id)
    .parts({
      profile: part.present(outputFrom(localityOperations.GetLocality.out)).context({ featureId: "featureId" }),
    })
    .presentation("mobile", surfaces.Main),

  SourceBrowse: view()
    .role("list")
    .description("The data sources behind the platform.")
    .parts({
      filters: part.collect(inputFrom(localityOperations.BrowseSources.in, ["query"])).flow("inline"),
      sources: part.present(outputFrom(localityOperations.BrowseSources.out, ["sources"])).collection("table"),
    })
    .presentation("mobile", surfaces.Main),

  EvidenceView: view()
    .role("detail")
    .description("One citation with its source and files.")
    .context("citationId", p.Id)
    .parts({
      evidence: part.present(outputFrom(localityOperations.GetEvidence.out)).context({ citationId: "citationId" }),
    })
    .presentation("mobile", surfaces.Main),
});

const app_app = dryv
  .app({ name: "mzizi-app" })
  .info({ title: "Mzizi mobile app", version: "0.1.0" })
  .groups(shared, reference, geography, locality, insights, brand, app)
  .surfaces(surfaces.Main)
  .theme(themes.Mzizi)
  .consumes(
    api,
    localityOperations.GetLocality,
    localityOperations.SearchLocalities,
    localityOperations.BrowseSources,
    localityOperations.GetEvidence,
    localityOperations.ListLanguages,
    localityOperations.ResolveLocality,
    geographyOperations.BrowseFeatures,
    geographyOperations.GetFeature,
    geographyOperations.BrowseFeatureKinds,
    geographyOperations.ListFeatureGeometries,
    insightOperations.GlobalSearch,
    insightOperations.BrowsePlaces,
    insightOperations.GetPlaceStatistics,
    insightOperations.GetIndicatorSeries,
    insightOperations.GetIndicatorMap,
    insightOperations.ListLeaderboardMetrics,
    insightOperations.GetLeaderboard,
    insightOperations.GetPlaceElections,
    insightOperations.ListElections,
    insightOperations.GetElection,
    insightOperations.ListParties,
    insightOperations.GetParty,
    insightOperations.ListMotions,
    insightOperations.GetMotion,
    insightOperations.GetLeaderProfile,
    insightOperations.GetPlaceCivic,
    insightOperations.GetProject,
    insightOperations.ListTenders,
    insightOperations.GetNearbyProjects,
    insightOperations.GetLeaderTree,
    insightOperations.ListInstitutions,
    insightOperations.GetInstitution,
    insightOperations.GetGovernanceTabs,
    insightOperations.GetGovernanceTree,
    insightOperations.GetContent,
    insightOperations.ListContent,
    insightOperations.GetLegalBasis,
    insightOperations.GetCompareOptions,
    insightOperations.GetComparison,
  )
  .destination("places", views.PlaceSearch)
  .destination("sources", views.SourceBrowse)
  .destination("browse", views.FeatureBrowse)
  .destination("detail", views.FeatureDetail)
  .destination("place", views.PlaceProfile)
  .destination("evidence", views.EvidenceView)
  .transition("openPlace", "places", "place", { operation: localityOperations.GetLocality })
  .transition("openFeature", "browse", "detail", { operation: geographyOperations.GetFeature });

export default dryv.project({ name: "mzizi-app" }).apps(api, app_app);
