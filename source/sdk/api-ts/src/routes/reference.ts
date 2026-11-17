/**
 * Reference API routes: one entry per HTTP operation. Routes with path parameters
 * are typed functions; static routes are strings.
 */
export const referenceRoutes = {
  /** GET /v1/reference/values */
  browseSchemeMembers: "/v1/reference/values",
  /** GET /v1/reference/schemes */
  browseSchemes: "/v1/reference/schemes",
  /** GET /v1/reference/lookup */
  lookupMember: "/v1/reference/lookup",
} as const;
