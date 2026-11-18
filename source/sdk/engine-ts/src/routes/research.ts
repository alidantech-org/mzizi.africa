/**
 * Research API routes: one entry per HTTP operation. Routes with path parameters
 * are typed functions; static routes are strings.
 */
export const researchRoutes = {
  /** POST /v1/research/inspect */
  inspectArtifact: "/v1/research/inspect",
} as const;
