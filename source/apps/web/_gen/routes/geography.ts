/**
 * Geography API routes: one entry per HTTP operation. Routes with path parameters
 * are typed functions; static routes are strings.
 */
export const geographyRoutes = {
  /** GET /v1/geography/features */
  browseFeatures: '/v1/geography/features',
} as const;