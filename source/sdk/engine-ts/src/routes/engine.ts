/**
 * Engine API routes: one entry per HTTP operation. Routes with path parameters
 * are typed functions; static routes are strings.
 */
export const engineRoutes = {
  /** POST /v1/jobs/{jobId}/cancel */
  cancelJob: (params: { jobId: string }) => `/v1/jobs/${params.jobId}/cancel`,
  /** GET /v1/jobs/{jobId} */
  getJob: (params: { jobId: string }) => `/v1/jobs/${params.jobId}`,
  /** GET /capabilities */
  listCapabilities: "/capabilities",
  /** GET /v1/jobs */
  listJobs: "/v1/jobs",
  /** POST /v1/jobs */
  submitJob: "/v1/jobs",
} as const;
