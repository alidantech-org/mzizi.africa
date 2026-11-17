/**
 * Locality API routes: one entry per HTTP operation. Routes with path parameters
 * are typed functions; static routes are strings.
 */
export const localityRoutes = {
  /** GET /v1/sources */
  browseSources: "/v1/sources",
  /** GET /v1/evidence/{citationId} */
  getEvidence: (params: { citationId: string }) => `/v1/evidence/${params.citationId}`,
  /** GET /v1/locality/{featureId} */
  getLocality: (params: { featureId: string }) => `/v1/locality/${params.featureId}`,
  /** GET /v1/languages */
  listLanguages: "/v1/languages",
  /** GET /v1/locality/at */
  resolveLocality: "/v1/locality/at",
  /** GET /v1/locality/search */
  searchLocalities: "/v1/locality/search",
} as const;
