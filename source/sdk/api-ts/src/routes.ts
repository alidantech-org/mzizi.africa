/** Generated registry of all product HTTP operations. Safe to import in client code. */
export const routes = {
  auth: {
    /** GET /v1/account */
    getMyAccount: "/v1/account",
    /** GET /v1/admin/accounts */
    listAccounts: "/v1/admin/accounts",
  },
  experience: {
    /** GET /v1/calendar */
    getCalendar: "/v1/calendar",
    /** GET /v1/context */
    getContext: "/v1/context",
    /** GET /v1/copy */
    getCopy: "/v1/copy",
    /** GET /v1/facilities/{code} */
    getFacility: (params: { code: string }) => `/v1/facilities/${encodeURIComponent(params.code)}`,
    /** GET /v1/facilities */
    listFacilities: "/v1/facilities",
    /** GET /v1/facts */
    listFacts: "/v1/facts",
  },
  explorer: {
    /** GET /v1/explorer/copy */
    getCopyBundle: "/v1/explorer/copy",
    /** GET /v1/explorer/boundaries */
    getExplorerBoundaries: "/v1/explorer/boundaries",
    /** GET /v1/explorer/context */
    getExplorerContext: "/v1/explorer/context",
    /** GET /v1/explorer/location */
    getExplorerLocation: "/v1/explorer/location",
    /** GET /v1/explorer/navigation */
    getExplorerNavigation: "/v1/explorer/navigation",
    /** GET /v1/explorer/overview */
    getExplorerOverview: "/v1/explorer/overview",
    /** GET /v1/explorer/setup */
    getSetupBootstrap: "/v1/explorer/setup",
    /** GET /v1/explorer/children */
    listExplorerChildren: "/v1/explorer/children",
    /** POST /v1/explorer/addresses */
    resolveExplorerAddresses: "/v1/explorer/addresses",
    /** POST /v1/explorer/resolve */
    resolveExplorerCoordinates: "/v1/explorer/resolve",
    /** GET /v1/explorer/search */
    searchExplorerPlaces: "/v1/explorer/search",
  },
  geography: {
    /** GET /v1/geography/feature-kinds */
    browseFeatureKinds: "/v1/geography/feature-kinds",
    /** GET /v1/geography/features */
    browseFeatures: "/v1/geography/features",
    /** GET /v1/geography/geometries */
    browseGeometries: "/v1/geography/geometries",
    /** GET /v1/geography/features/{featureId} */
    getFeature: (params: { featureId: string }) =>
      `/v1/geography/features/${encodeURIComponent(params.featureId)}`,
    /** GET /v1/geography/features/{featureId}/geometries */
    listFeatureGeometries: (params: { featureId: string }) =>
      `/v1/geography/features/${encodeURIComponent(params.featureId)}/geometries`,
  },
  governance: {
    /** GET /v1/governance/institutions */
    browseInstitutions: "/v1/governance/institutions",
    /** GET /v1/governance/institutions/{institutionId} */
    getInstitution: (params: { institutionId: string }) =>
      `/v1/governance/institutions/${encodeURIComponent(params.institutionId)}`,
    /** GET /v1/governance/offices/{officeId} */
    getOffice: (params: { officeId: string }) =>
      `/v1/governance/offices/${encodeURIComponent(params.officeId)}`,
  },
  insights: {
    /** GET /v1/browse */
    browsePlaces: "/v1/browse",
    /** GET /v1/compare/options */
    getCompareOptions: "/v1/compare/options",
    /** GET /v1/compare/options/at */
    getCompareOptionsAt: "/v1/compare/options/at",
    /** GET /v1/compare */
    getComparison: "/v1/compare",
    /** GET /v1/compare/at */
    getComparisonAt: "/v1/compare/at",
    /** GET /v1/content */
    getContent: "/v1/content",
    /** GET /v1/elections/{electionId} */
    getElection: (params: { electionId: string }) =>
      `/v1/elections/${encodeURIComponent(params.electionId)}`,
    /** GET /v1/election-at */
    getElectionAt: "/v1/election-at",
    /** GET /v1/governance/tabs */
    getGovernanceTabs: "/v1/governance/tabs",
    /** GET /v1/governance/tree */
    getGovernanceTree: "/v1/governance/tree",
    /** GET /v1/statistics/indicators/{indicatorCode}/map */
    getIndicatorMap: (params: { indicatorCode: string }) =>
      `/v1/statistics/indicators/${encodeURIComponent(params.indicatorCode)}/map`,
    /** GET /v1/statistics/indicators/{indicatorCode}/series */
    getIndicatorSeries: (params: { indicatorCode: string }) =>
      `/v1/statistics/indicators/${encodeURIComponent(params.indicatorCode)}/series`,
    /** GET /v1/institutions/{code} */
    getInstitution: (params: { code: string }) =>
      `/v1/institutions/${encodeURIComponent(params.code)}`,
    /** GET /v1/leaders/{code} */
    getLeaderProfile: (params: { code: string }) =>
      `/v1/leaders/${encodeURIComponent(params.code)}`,
    /** GET /v1/leaders/tree */
    getLeaderTree: "/v1/leaders/tree",
    /** GET /v1/leaderboards/{metricCode} */
    getLeaderboard: (params: { metricCode: string }) =>
      `/v1/leaderboards/${encodeURIComponent(params.metricCode)}`,
    /** GET /v1/legal-basis */
    getLegalBasis: "/v1/legal-basis",
    /** GET /v1/motions/{code} */
    getMotion: (params: { code: string }) => `/v1/motions/${encodeURIComponent(params.code)}`,
    /** GET /v1/projects/near */
    getNearbyProjects: "/v1/projects/near",
    /** GET /v1/parties/{code} */
    getParty: (params: { code: string }) => `/v1/parties/${encodeURIComponent(params.code)}`,
    /** GET /v1/civic/places/{featureId} */
    getPlaceCivic: (params: { featureId: string }) =>
      `/v1/civic/places/${encodeURIComponent(params.featureId)}`,
    /** GET /v1/civic/place */
    getPlaceCivicAt: "/v1/civic/place",
    /** GET /v1/elections/places/{featureId} */
    getPlaceElections: (params: { featureId: string }) =>
      `/v1/elections/places/${encodeURIComponent(params.featureId)}`,
    /** GET /v1/statistics/places/{featureId} */
    getPlaceStatistics: (params: { featureId: string }) =>
      `/v1/statistics/places/${encodeURIComponent(params.featureId)}`,
    /** GET /v1/statistics/place */
    getPlaceStatisticsAt: "/v1/statistics/place",
    /** GET /v1/projects/{code} */
    getProject: (params: { code: string }) => `/v1/projects/${encodeURIComponent(params.code)}`,
    /** GET /v1/tender/{code} */
    getTender: (params: { code: string }) => `/v1/tender/${encodeURIComponent(params.code)}`,
    /** GET /v1/search */
    globalSearch: "/v1/search",
    /** GET /v1/content/list */
    listContent: "/v1/content/list",
    /** GET /v1/elections */
    listElections: "/v1/elections",
    /** GET /v1/institutions */
    listInstitutions: "/v1/institutions",
    /** GET /v1/law */
    listLaw: "/v1/law",
    /** GET /v1/leaderboards */
    listLeaderboardMetrics: "/v1/leaderboards",
    /** GET /v1/motions */
    listMotions: "/v1/motions",
    /** GET /v1/parties */
    listParties: "/v1/parties",
    /** GET /v1/tenders */
    listTenders: "/v1/tenders",
    /** GET /v1/tenders/at */
    listTendersAt: "/v1/tenders/at",
  },
  interactions: {
    /** GET /v1/engagement */
    getEngagement: "/v1/engagement",
    /** POST /v1/likes */
    like: "/v1/likes",
    /** POST /v1/views */
    recordView: "/v1/views",
    /** POST /v1/likes/remove */
    unlike: "/v1/likes/remove",
  },
  ledger: {
    /** GET /v1/coverage */
    getCoverage: "/v1/coverage",
    /** GET /v1/budgets */
    listBudgets: "/v1/budgets",
    /** GET /v1/coalitions */
    listCoalitions: "/v1/coalitions",
    /** GET /v1/funds */
    listFunds: "/v1/funds",
    /** GET /v1/manifestos */
    listManifestos: "/v1/manifestos",
  },
  locality: {
    /** GET /v1/sources */
    browseSources: "/v1/sources",
    /** GET /v1/evidence/{citationId} */
    getEvidence: (params: { citationId: string }) =>
      `/v1/evidence/${encodeURIComponent(params.citationId)}`,
    /** GET /v1/locality/{featureId} */
    getLocality: (params: { featureId: string }) =>
      `/v1/locality/${encodeURIComponent(params.featureId)}`,
    /** GET /v1/languages */
    listLanguages: "/v1/languages",
    /** GET /v1/locality/at */
    resolveLocality: "/v1/locality/at",
    /** GET /v1/locality/search */
    searchLocalities: "/v1/locality/search",
  },
  reference: {
    /** GET /v1/reference/values */
    browseSchemeMembers: "/v1/reference/values",
    /** GET /v1/reference/schemes */
    browseSchemes: "/v1/reference/schemes",
    /** GET /v1/reference/lookup */
    lookupMember: "/v1/reference/lookup",
  },
  structure: {
    /** GET /v1/structure/context */
    getCountryContext: "/v1/structure/context",
    /** GET /v1/structure */
    getStructureScreen: "/v1/structure",
  },
} as const;
export default routes;
