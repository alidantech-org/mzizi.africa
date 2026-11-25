/** Generated registry of all product HTTP operations. Safe to import in client code. */
export const routes = {
  auth: {
    /** GET /v1/account */
    getMyAccount: "/v1/account",
    /** GET /v1/admin/accounts */
    listAccounts: "/v1/admin/accounts",
  },
  civic: {
    /** GET /v1/civic/projects/{code} */
    getProject: (params: { code: string }) =>
      `/v1/civic/projects/${encodeURIComponent(params.code)}`,
    /** GET /v1/civic/tenders/{code} */
    getTender: (params: { code: string }) => `/v1/civic/tenders/${encodeURIComponent(params.code)}`,
    /** GET /v1/civic/facilities */
    listFacilities: "/v1/civic/facilities",
    /** GET /v1/civic/projects */
    listPlaceProjects: "/v1/civic/projects",
    /** GET /v1/civic/tenders */
    listTenders: "/v1/civic/tenders",
  },
  community: {
    /** GET /v1/community/posts */
    listPosts: "/v1/community/posts",
    /** POST /v1/community/views */
    recordView: "/v1/community/views",
  },
  election: {
    /** GET /v1/election/elections/{code} */
    getElection: (params: { code: string }) =>
      `/v1/election/elections/${encodeURIComponent(params.code)}`,
    /** GET /v1/election/elections */
    listElections: "/v1/election/elections",
    /** GET /v1/election/tallies */
    listTallies: "/v1/election/tallies",
  },
  event: {
    /** GET /v1/event/occurrences */
    listOccurrences: "/v1/event/occurrences",
  },
  finance: {
    /** GET /v1/finance/appropriations */
    listAppropriations: "/v1/finance/appropriations",
    /** GET /v1/finance/budgets */
    listBudgets: "/v1/finance/budgets",
    /** GET /v1/finance/findings */
    listFindings: "/v1/finance/findings",
  },
  frontend: {
    /** GET /v1/frontend/copy */
    getCopyBundle: "/v1/frontend/copy",
    /** GET /v1/frontend/home */
    getHomeScreen: "/v1/frontend/home",
    /** GET /v1/frontend/institution */
    getInstitutionScreen: "/v1/frontend/institution",
    /** GET /v1/frontend/place */
    getPlaceScreen: "/v1/frontend/place",
    /** GET /v1/frontend/ranking */
    getRankingScreen: "/v1/frontend/ranking",
    /** GET /v1/frontend/search */
    searchScreen: "/v1/frontend/search",
  },
  geography: {
    /** GET /v1/geography/at */
    findPlacesAtPoint: "/v1/geography/at",
    /** GET /v1/geography/outlines */
    getOutline: "/v1/geography/outlines",
    /** GET /v1/geography/places/{code} */
    getPlace: (params: { code: string }) =>
      `/v1/geography/places/${encodeURIComponent(params.code)}`,
    /** GET /v1/geography/child-outlines */
    listChildOutlines: "/v1/geography/child-outlines",
    /** GET /v1/geography/children */
    listChildren: "/v1/geography/children",
    /** GET /v1/geography/places */
    listPlaces: "/v1/geography/places",
  },
  governance: {
    /** GET /v1/governance/institutions/{code} */
    getInstitution: (params: { code: string }) =>
      `/v1/governance/institutions/${encodeURIComponent(params.code)}`,
    /** GET /v1/governance/offices/{code} */
    getOffice: (params: { code: string }) =>
      `/v1/governance/offices/${encodeURIComponent(params.code)}`,
    /** GET /v1/governance/institutions */
    listInstitutions: "/v1/governance/institutions",
    /** GET /v1/governance/members */
    listMembers: "/v1/governance/members",
    /** GET /v1/governance/offices */
    listPlaceOffices: "/v1/governance/offices",
    /** GET /v1/governance/powers */
    listPowers: "/v1/governance/powers",
  },
  history: {
    /** GET /v1/history/eras */
    listEras: "/v1/history/eras",
    /** GET /v1/history/occurrences */
    listHistory: "/v1/history/occurrences",
  },
  identity: {
    /** GET /v1/identity/things/{code} */
    getIdentity: (params: { code: string }) =>
      `/v1/identity/things/${encodeURIComponent(params.code)}`,
    /** GET /v1/identity/addresses */
    resolveAddress: "/v1/identity/addresses",
    /** GET /v1/identity/search */
    searchNames: "/v1/identity/search",
  },
  legal: {
    /** GET /v1/legal/instruments/{code} */
    getInstrument: (params: { code: string }) =>
      `/v1/legal/instruments/${encodeURIComponent(params.code)}`,
    /** GET /v1/legal/effects */
    listEffects: "/v1/legal/effects",
    /** GET /v1/legal/instruments */
    listInstruments: "/v1/legal/instruments",
    /** GET /v1/legal/provisions */
    listProvisions: "/v1/legal/provisions",
  },
  legislature: {
    /** GET /v1/legislature/bills/{code} */
    getBill: (params: { code: string }) =>
      `/v1/legislature/bills/${encodeURIComponent(params.code)}`,
    /** GET /v1/legislature/bills */
    listBills: "/v1/legislature/bills",
    /** GET /v1/legislature/votes */
    listVotes: "/v1/legislature/votes",
  },
  media: {
    /** GET /v1/media/articles/{code} */
    getArticle: (params: { code: string }) =>
      `/v1/media/articles/${encodeURIComponent(params.code)}`,
    /** GET /v1/media/articles */
    listArticles: "/v1/media/articles",
    /** GET /v1/media/assets */
    listAssets: "/v1/media/assets",
  },
  politics: {
    /** GET /v1/politics/parties/{code} */
    getParty: (params: { code: string }) =>
      `/v1/politics/parties/${encodeURIComponent(params.code)}`,
    /** GET /v1/politics/commitments */
    listCommitments: "/v1/politics/commitments",
    /** GET /v1/politics/parties */
    listParties: "/v1/politics/parties",
  },
  product: {
    /** GET /v1/product/site */
    getSite: "/v1/product/site",
    /** GET /v1/product/messages */
    listMessages: "/v1/product/messages",
    /** GET /v1/product/releases */
    listReleases: "/v1/product/releases",
  },
  reference: {
    /** GET /v1/reference/countries/{code} */
    getCountry: (params: { code: string }) =>
      `/v1/reference/countries/${encodeURIComponent(params.code)}`,
    /** GET /v1/reference/countries */
    listCountries: "/v1/reference/countries",
    /** GET /v1/reference/currencies */
    listCurrencies: "/v1/reference/currencies",
    /** GET /v1/reference/hierarchies */
    listHierarchies: "/v1/reference/hierarchies",
    /** GET /v1/reference/languages */
    listLanguages: "/v1/reference/languages",
    /** GET /v1/reference/units */
    listUnits: "/v1/reference/units",
  },
  source: {
    /** GET /v1/source/evidence */
    listEvidence: "/v1/source/evidence",
    /** GET /v1/source/sources */
    listSources: "/v1/source/sources",
  },
  statistics: {
    /** GET /v1/statistics/indicators/{code} */
    getIndicator: (params: { code: string }) =>
      `/v1/statistics/indicators/${encodeURIComponent(params.code)}`,
    /** GET /v1/statistics/indicator-figures */
    listIndicatorFigures: "/v1/statistics/indicator-figures",
    /** GET /v1/statistics/indicators */
    listIndicators: "/v1/statistics/indicators",
    /** GET /v1/statistics/observations */
    listObservations: "/v1/statistics/observations",
    /** GET /v1/statistics/figures */
    listPlaceFigures: "/v1/statistics/figures",
  },
  vocabulary: {
    /** GET /v1/vocabulary/schemes/{code} */
    getScheme: (params: { code: string }) =>
      `/v1/vocabulary/schemes/${encodeURIComponent(params.code)}`,
    /** GET /v1/vocabulary/terms */
    listTerms: "/v1/vocabulary/terms",
  },
} as const;
export default routes;
