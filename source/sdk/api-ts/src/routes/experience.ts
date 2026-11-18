/**
 * Experience API routes: one entry per HTTP operation. Routes with path parameters
 * are typed functions; static routes are strings.
 */
export const experienceRoutes = {
  /** GET /v1/calendar */
  getCalendar: "/v1/calendar",
  /** GET /v1/context */
  getContext: "/v1/context",
  /** GET /v1/copy */
  getCopy: "/v1/copy",
  /** GET /v1/facilities/{code} */
  getFacility: (params: { code: string }) => `/v1/facilities/${params.code}`,
  /** GET /v1/facilities */
  listFacilities: "/v1/facilities",
  /** GET /v1/facts */
  listFacts: "/v1/facts",
} as const;
