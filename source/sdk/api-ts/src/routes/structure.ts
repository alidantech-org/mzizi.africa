/**
 * Structure API routes: one entry per HTTP operation. Routes with path parameters
 * are typed functions; static routes are strings.
 */
export const structureRoutes = {
  /** GET /v1/structure/context */
  getCountryContext: "/v1/structure/context",
  /** GET /v1/structure */
  getStructureScreen: "/v1/structure",
} as const;
