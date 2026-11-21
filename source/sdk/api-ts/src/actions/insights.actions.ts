"use server";
/** Generated HTTP request helpers. Endpoint spelling belongs exclusively to routes.ts. */
import { type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import { api } from "#sdk/helpers/api.ts";
import { routes } from "#sdk/routes.ts";
import type { InsightsBrowseInput } from "#sdk/types/insights/dto/browse-input.ts";
import type { InsightsCompareOptionsInput } from "#sdk/types/insights/dto/compare-options-input.ts";
import type { InsightsCompareOptions } from "#sdk/types/insights/dto/compare-options.ts";
import type { InsightsComparisonInput } from "#sdk/types/insights/dto/comparison-input.ts";
import type { InsightsComparison } from "#sdk/types/insights/dto/comparison.ts";
import type { InsightsContentInput } from "#sdk/types/insights/dto/content-input.ts";
import type { InsightsContentListInput } from "#sdk/types/insights/dto/content-list-input.ts";
import type { InsightsContentList } from "#sdk/types/insights/dto/content-list.ts";
import type { InsightsContentPage } from "#sdk/types/insights/dto/content-page.ts";
import type { InsightsElectionDetail } from "#sdk/types/insights/dto/election-detail.ts";
import type { InsightsElectionList } from "#sdk/types/insights/dto/election-list.ts";
import type { InsightsGovTreeInput } from "#sdk/types/insights/dto/gov-tree-input.ts";
import type { InsightsGovernanceTabs } from "#sdk/types/insights/dto/governance-tabs.ts";
import type { InsightsGovernanceTree } from "#sdk/types/insights/dto/governance-tree.ts";
import type { InsightsIndicatorMap } from "#sdk/types/insights/dto/indicator-map.ts";
import type { InsightsIndicatorSeries } from "#sdk/types/insights/dto/indicator-series.ts";
import type { InsightsInstitutionDetail } from "#sdk/types/insights/dto/institution-detail.ts";
import type { InsightsInstitutionList } from "#sdk/types/insights/dto/institution-list.ts";
import type { InsightsInstitutionsInput } from "#sdk/types/insights/dto/institutions-input.ts";
import type { InsightsLawInput } from "#sdk/types/insights/dto/law-input.ts";
import type { InsightsLawList } from "#sdk/types/insights/dto/law-list.ts";
import type { InsightsLeaderProfile } from "#sdk/types/insights/dto/leader-profile.ts";
import type { InsightsLeaderTree } from "#sdk/types/insights/dto/leader-tree.ts";
import type { InsightsLeaderboardMetricList } from "#sdk/types/insights/dto/leaderboard-metric-list.ts";
import type { InsightsLeaderboard } from "#sdk/types/insights/dto/leaderboard.ts";
import type { InsightsLegalBasisInput } from "#sdk/types/insights/dto/legal-basis-input.ts";
import type { InsightsLegalBasis } from "#sdk/types/insights/dto/legal-basis.ts";
import type { InsightsMotionDetail } from "#sdk/types/insights/dto/motion-detail.ts";
import type { InsightsMotionList } from "#sdk/types/insights/dto/motion-list.ts";
import type { InsightsMotionsInput } from "#sdk/types/insights/dto/motions-input.ts";
import type { InsightsNearbyInput } from "#sdk/types/insights/dto/nearby-input.ts";
import type { InsightsNearbyProjects } from "#sdk/types/insights/dto/nearby-projects.ts";
import type { InsightsPartyDetail } from "#sdk/types/insights/dto/party-detail.ts";
import type { InsightsPartyList } from "#sdk/types/insights/dto/party-list.ts";
import type { InsightsPlaceAt } from "#sdk/types/insights/dto/place-at.ts";
import type { InsightsPlaceBrowse } from "#sdk/types/insights/dto/place-browse.ts";
import type { InsightsPlaceCivic } from "#sdk/types/insights/dto/place-civic.ts";
import type { InsightsPlaceElections } from "#sdk/types/insights/dto/place-elections.ts";
import type { InsightsPlaceStatistics } from "#sdk/types/insights/dto/place-statistics.ts";
import type { InsightsProjectDetail } from "#sdk/types/insights/dto/project-detail.ts";
import type { InsightsSearchQuery } from "#sdk/types/insights/dto/search-query.ts";
import type { InsightsSearchResults } from "#sdk/types/insights/dto/search-results.ts";
import type { InsightsTenderInput } from "#sdk/types/insights/dto/tender-input.ts";
import type { InsightsTenderList } from "#sdk/types/insights/dto/tender-list.ts";
import type { InsightsTreeInput } from "#sdk/types/insights/dto/tree-input.ts";
/** GET /v1/browse */
export type InsightsBrowsePlacesActionInput = ActionInput<never, InsightsBrowseInput, never>;

export async function insightsBrowsePlaces(input: InsightsBrowsePlacesActionInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.insights.browsePlaces;
  return api.get<InsightsPlaceBrowse>(path, options);
}
/** GET /v1/compare/options */
export type InsightsGetCompareOptionsActionInput = ActionInput<
  never,
  InsightsCompareOptionsInput,
  never
>;

export async function insightsGetCompareOptions(input: InsightsGetCompareOptionsActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.insights.getCompareOptions;
  return api.get<InsightsCompareOptions>(path, options);
}
/** GET /v1/compare */
export type InsightsGetComparisonActionInput = ActionInput<never, InsightsComparisonInput, never>;

export async function insightsGetComparison(input: InsightsGetComparisonActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.insights.getComparison;
  return api.get<InsightsComparison>(path, options);
}
/** GET /v1/content */
export type InsightsGetContentActionInput = ActionInput<never, InsightsContentInput, never>;

export async function insightsGetContent(input: InsightsGetContentActionInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.insights.getContent;
  return api.get<InsightsContentPage>(path, options);
}
/** GET /v1/elections/{electionId} */
export type InsightsGetElectionActionInput = ActionInput<
  { electionId: string },
  { parentFeatureId?: string; contestKind?: string },
  never
>;

export async function insightsGetElection(input: InsightsGetElectionActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.insights.getElection(input.params);
  return api.get<InsightsElectionDetail>(path, options);
}
/** GET /v1/governance/tabs */
export type InsightsGetGovernanceTabsActionInput = ActionInput<never, never, never>;

export async function insightsGetGovernanceTabs(input: InsightsGetGovernanceTabsActionInput = {}) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.insights.getGovernanceTabs;
  return api.get<InsightsGovernanceTabs>(path, options);
}
/** GET /v1/governance/tree */
export type InsightsGetGovernanceTreeActionInput = ActionInput<never, InsightsGovTreeInput, never>;

export async function insightsGetGovernanceTree(input: InsightsGetGovernanceTreeActionInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.insights.getGovernanceTree;
  return api.get<InsightsGovernanceTree>(path, options);
}
/** GET /v1/statistics/indicators/{indicatorCode}/map */
export type InsightsGetIndicatorMapActionInput = ActionInput<
  { indicatorCode: string },
  { parentFeatureId?: string; kindCode?: string },
  never
>;

export async function insightsGetIndicatorMap(input: InsightsGetIndicatorMapActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.insights.getIndicatorMap(input.params);
  return api.get<InsightsIndicatorMap>(path, options);
}
/** GET /v1/statistics/indicators/{indicatorCode}/series */
export type InsightsGetIndicatorSeriesActionInput = ActionInput<
  { indicatorCode: string },
  { featureId: string },
  never
>;

export async function insightsGetIndicatorSeries(input: InsightsGetIndicatorSeriesActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.insights.getIndicatorSeries(input.params);
  return api.get<InsightsIndicatorSeries>(path, options);
}
/** GET /v1/institutions/{code} */
export type InsightsGetInstitutionActionInput = ActionInput<{ code: string }, never, never>;

export async function insightsGetInstitution(input: InsightsGetInstitutionActionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.insights.getInstitution(input.params);
  return api.get<InsightsInstitutionDetail>(path, options);
}
/** GET /v1/leaders/{code} */
export type InsightsGetLeaderProfileActionInput = ActionInput<{ code: string }, never, never>;

export async function insightsGetLeaderProfile(input: InsightsGetLeaderProfileActionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.insights.getLeaderProfile(input.params);
  return api.get<InsightsLeaderProfile>(path, options);
}
/** GET /v1/leaders/tree */
export type InsightsGetLeaderTreeActionInput = ActionInput<never, InsightsTreeInput, never>;

export async function insightsGetLeaderTree(input: InsightsGetLeaderTreeActionInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.insights.getLeaderTree;
  return api.get<InsightsLeaderTree>(path, options);
}
/** GET /v1/leaderboards/{metricCode} */
export type InsightsGetLeaderboardActionInput = ActionInput<
  { metricCode: string },
  { kindCode?: string; parentFeatureId?: string; limit?: number },
  never
>;

export async function insightsGetLeaderboard(input: InsightsGetLeaderboardActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.insights.getLeaderboard(input.params);
  return api.get<InsightsLeaderboard>(path, options);
}
/** GET /v1/legal-basis */
export type InsightsGetLegalBasisActionInput = ActionInput<never, InsightsLegalBasisInput, never>;

export async function insightsGetLegalBasis(input: InsightsGetLegalBasisActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.insights.getLegalBasis;
  return api.get<InsightsLegalBasis>(path, options);
}
/** GET /v1/motions/{code} */
export type InsightsGetMotionActionInput = ActionInput<{ code: string }, never, never>;

export async function insightsGetMotion(input: InsightsGetMotionActionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.insights.getMotion(input.params);
  return api.get<InsightsMotionDetail>(path, options);
}
/** GET /v1/projects/near */
export type InsightsGetNearbyProjectsActionInput = ActionInput<never, InsightsNearbyInput, never>;

export async function insightsGetNearbyProjects(input: InsightsGetNearbyProjectsActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.insights.getNearbyProjects;
  return api.get<InsightsNearbyProjects>(path, options);
}
/** GET /v1/parties/{code} */
export type InsightsGetPartyActionInput = ActionInput<{ code: string }, never, never>;

export async function insightsGetParty(input: InsightsGetPartyActionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.insights.getParty(input.params);
  return api.get<InsightsPartyDetail>(path, options);
}
/** GET /v1/civic/places/{featureId} */
export type InsightsGetPlaceCivicActionInput = ActionInput<{ featureId: string }, never, never>;

export async function insightsGetPlaceCivic(input: InsightsGetPlaceCivicActionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.insights.getPlaceCivic(input.params);
  return api.get<InsightsPlaceCivic>(path, options);
}
/** GET /v1/elections/places/{featureId} */
export type InsightsGetPlaceElectionsActionInput = ActionInput<{ featureId: string }, never, never>;

export async function insightsGetPlaceElections(input: InsightsGetPlaceElectionsActionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.insights.getPlaceElections(input.params);
  return api.get<InsightsPlaceElections>(path, options);
}
/** GET /v1/statistics/places/{featureId} */
export type InsightsGetPlaceStatisticsActionInput = ActionInput<
  { featureId: string },
  never,
  never
>;

export async function insightsGetPlaceStatistics(input: InsightsGetPlaceStatisticsActionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.insights.getPlaceStatistics(input.params);
  return api.get<InsightsPlaceStatistics>(path, options);
}
/** GET /v1/statistics/place */
export type InsightsGetPlaceStatisticsAtActionInput = ActionInput<never, InsightsPlaceAt, never>;

export async function insightsGetPlaceStatisticsAt(input: InsightsGetPlaceStatisticsAtActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.insights.getPlaceStatisticsAt;
  return api.get<InsightsPlaceStatistics>(path, options);
}
/** GET /v1/projects/{code} */
export type InsightsGetProjectActionInput = ActionInput<{ code: string }, never, never>;

export async function insightsGetProject(input: InsightsGetProjectActionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.insights.getProject(input.params);
  return api.get<InsightsProjectDetail>(path, options);
}
/** GET /v1/search */
export type InsightsGlobalSearchActionInput = ActionInput<never, InsightsSearchQuery, never>;

export async function insightsGlobalSearch(input: InsightsGlobalSearchActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.insights.globalSearch;
  return api.get<InsightsSearchResults>(path, options);
}
/** GET /v1/content/list */
export type InsightsListContentActionInput = ActionInput<never, InsightsContentListInput, never>;

export async function insightsListContent(input: InsightsListContentActionInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.insights.listContent;
  return api.get<InsightsContentList>(path, options);
}
/** GET /v1/elections */
export type InsightsListElectionsActionInput = ActionInput<never, never, never>;

export async function insightsListElections(input: InsightsListElectionsActionInput = {}) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.insights.listElections;
  return api.get<InsightsElectionList>(path, options);
}
/** GET /v1/institutions */
export type InsightsListInstitutionsActionInput = ActionInput<
  never,
  InsightsInstitutionsInput,
  never
>;

export async function insightsListInstitutions(input: InsightsListInstitutionsActionInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.insights.listInstitutions;
  return api.get<InsightsInstitutionList>(path, options);
}
/** GET /v1/law */
export type InsightsListLawActionInput = ActionInput<never, InsightsLawInput, never>;

export async function insightsListLaw(input: InsightsListLawActionInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.insights.listLaw;
  return api.get<InsightsLawList>(path, options);
}
/** GET /v1/leaderboards */
export type InsightsListLeaderboardMetricsActionInput = ActionInput<never, never, never>;

export async function insightsListLeaderboardMetrics(
  input: InsightsListLeaderboardMetricsActionInput = {},
) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.insights.listLeaderboardMetrics;
  return api.get<InsightsLeaderboardMetricList>(path, options);
}
/** GET /v1/motions */
export type InsightsListMotionsActionInput = ActionInput<never, InsightsMotionsInput, never>;

export async function insightsListMotions(input: InsightsListMotionsActionInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.insights.listMotions;
  return api.get<InsightsMotionList>(path, options);
}
/** GET /v1/parties */
export type InsightsListPartiesActionInput = ActionInput<never, never, never>;

export async function insightsListParties(input: InsightsListPartiesActionInput = {}) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.insights.listParties;
  return api.get<InsightsPartyList>(path, options);
}
/** GET /v1/tenders */
export type InsightsListTendersActionInput = ActionInput<never, InsightsTenderInput, never>;

export async function insightsListTenders(input: InsightsListTendersActionInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.insights.listTenders;
  return api.get<InsightsTenderList>(path, options);
}
