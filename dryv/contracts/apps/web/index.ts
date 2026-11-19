/**
 * The Mzizi public website application (generated frontend).
 *
 * The public Next.js website. It talks only to the main product API.
 * The views of the site are hand-written server pages (see `source/apps/web/app`); this contract owns the operations it consumes and the theme.
 */
import { dryv, surface } from "@dryvcode/author";
import { shared } from "#/schemas/_shared.ts";
import { geography } from "#/schemas/postgres/geography.ts";
import { reference } from "#/schemas/postgres/reference.ts";
import api from "#/apps/api/index.ts";
import { brand, themes } from "#/schemas/theme.ts";
import { geographyOperations } from "#/apps/api/geography.ts";
import { insightOperations, insights } from "#/apps/api/insights.ts";
import { experience, experienceOperations } from "#/apps/api/experience.ts";
import { interactionOperations, interactions } from "#/apps/api/interactions.ts";
import { ledger, ledgerOperations } from "#/apps/api/ledger.ts";
import { locality, localityOperations } from "#/apps/api/locality.ts";

const web = dryv.group({ name: "web" }).description("The public website: its surface and views.");
const surfaces = web.surfaces({ Main: surface.web() });
const features = web.feature("Features");

const web_app = dryv
  .app({ name: "mzizi-web" })
  .info({ title: "Mzizi public website", version: "0.1.0" })
  .groups(shared, reference, geography, locality, insights, experience, interactions, ledger, brand, web)
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
    insightOperations.ListLaw,
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
    experienceOperations.GetContext,
    experienceOperations.GetCopy,
    experienceOperations.GetCalendar,
    experienceOperations.ListFacilities,
    experienceOperations.GetFacility,
    experienceOperations.ListFacts,
    interactionOperations.GetEngagement,
    interactionOperations.Like,
    interactionOperations.Unlike,
    interactionOperations.RecordView,
    ledgerOperations.ListBudgets,
    ledgerOperations.ListFunds,
    ledgerOperations.GetCoverage,
    ledgerOperations.ListCoalitions,
    ledgerOperations.ListManifestos,
  );

export default dryv.project({ name: "mzizi-web" }).apps(api, web_app);
