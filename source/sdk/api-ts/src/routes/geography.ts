/**
 * Geography API routes: one entry per HTTP operation. Routes with path parameters
 * are typed functions; static routes are strings.
 */
export const geographyRoutes = {
  /** GET /v1/geography/feature-kinds */
  browseFeatureKinds: "/v1/geography/feature-kinds",
  /** GET /v1/geography/features */
  browseFeatures: "/v1/geography/features",
  /** GET /v1/geography/geometries */
  browseGeometries: "/v1/geography/geometries",
  /** GET /v1/geography/features/{featureId} */
  getFeature: (params: { featureId: string }) => `/v1/geography/features/${params.featureId}`,
  /** GET /v1/geography/features/{featureId}/geometries */
  listFeatureGeometries: (params: { featureId: string }) =>
    `/v1/geography/features/${params.featureId}/geometries`,
} as const;
