/**
 * Insights API routes: one entry per HTTP operation. Routes with path parameters
 * are typed functions; static routes are strings.
 */
export const insightsRoutes = {
  /** GET /v1/browse */
  browsePlaces: "/v1/browse",
  /** GET /v1/compare/options */
  getCompareOptions: "/v1/compare/options",
  /** GET /v1/compare */
  getComparison: "/v1/compare",
  /** GET /v1/content */
  getContent: "/v1/content",
  /** GET /v1/elections/{electionId} */
  getElection: (params: { electionId: string }) => `/v1/elections/${params.electionId}`,
  /** GET /v1/governance/tabs */
  getGovernanceTabs: "/v1/governance/tabs",
  /** GET /v1/governance/tree */
  getGovernanceTree: "/v1/governance/tree",
  /** GET /v1/statistics/indicators/{indicatorCode}/map */
  getIndicatorMap: (params: { indicatorCode: string }) =>
    `/v1/statistics/indicators/${params.indicatorCode}/map`,
  /** GET /v1/statistics/indicators/{indicatorCode}/series */
  getIndicatorSeries: (params: { indicatorCode: string }) =>
    `/v1/statistics/indicators/${params.indicatorCode}/series`,
  /** GET /v1/institutions/{code} */
  getInstitution: (params: { code: string }) => `/v1/institutions/${params.code}`,
  /** GET /v1/leaders/{id} */
  getLeaderProfile: (params: { id: string }) => `/v1/leaders/${params.id}`,
  /** GET /v1/leaders/tree */
  getLeaderTree: "/v1/leaders/tree",
  /** GET /v1/leaderboards/{metricCode} */
  getLeaderboard: (params: { metricCode: string }) => `/v1/leaderboards/${params.metricCode}`,
  /** GET /v1/legal-basis */
  getLegalBasis: "/v1/legal-basis",
  /** GET /v1/motions/{code} */
  getMotion: (params: { code: string }) => `/v1/motions/${params.code}`,
  /** GET /v1/projects/near */
  getNearbyProjects: "/v1/projects/near",
  /** GET /v1/parties/{code} */
  getParty: (params: { code: string }) => `/v1/parties/${params.code}`,
  /** GET /v1/civic/places/{featureId} */
  getPlaceCivic: (params: { featureId: string }) => `/v1/civic/places/${params.featureId}`,
  /** GET /v1/elections/places/{featureId} */
  getPlaceElections: (params: { featureId: string }) => `/v1/elections/places/${params.featureId}`,
  /** GET /v1/statistics/places/{featureId} */
  getPlaceStatistics: (params: { featureId: string }) =>
    `/v1/statistics/places/${params.featureId}`,
  /** GET /v1/projects/{code} */
  getProject: (params: { code: string }) => `/v1/projects/${params.code}`,
  /** GET /v1/search */
  globalSearch: "/v1/search",
  /** GET /v1/content/list */
  listContent: "/v1/content/list",
  /** GET /v1/elections */
  listElections: "/v1/elections",
  /** GET /v1/facts */
  listFacts: "/v1/facts",
  /** GET /v1/institutions */
  listInstitutions: "/v1/institutions",
  /** GET /v1/leaderboards */
  listLeaderboardMetrics: "/v1/leaderboards",
  /** GET /v1/motions */
  listMotions: "/v1/motions",
  /** GET /v1/parties */
  listParties: "/v1/parties",
  /** GET /v1/tenders */
  listTenders: "/v1/tenders",
} as const;
