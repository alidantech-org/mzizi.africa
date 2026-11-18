/**
 * Scripts API routes: one entry per HTTP operation. Routes with path parameters
 * are typed functions; static routes are strings.
 */
export const scriptsRoutes = {
  /** POST /v1/research/scripts/{jobId}/cancel */
  cancelScript: (params: { jobId: string }) => `/v1/research/scripts/${params.jobId}/cancel`,
  /** GET /v1/research/scripts/{jobId} */
  getScript: (params: { jobId: string }) => `/v1/research/scripts/${params.jobId}`,
  /** POST /v1/research/scripts */
  submitScript: "/v1/research/scripts",
} as const;
