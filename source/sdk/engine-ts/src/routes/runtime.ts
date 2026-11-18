/**
 * Runtime API routes: one entry per HTTP operation. Routes with path parameters
 * are typed functions; static routes are strings.
 */
export const runtimeRoutes = {
  /** GET /v1/runs/{runId} */
  getRun: (params: { runId: string }) => `/v1/runs/${params.runId}`,
  /** GET /v1/run-events */
  listRunEvents: "/v1/run-events",
  /** GET /v1/runs */
  listRuns: "/v1/runs",
} as const;
