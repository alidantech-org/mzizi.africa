/**
 * Staging API routes: one entry per HTTP operation. Routes with path parameters
 * are typed functions; static routes are strings.
 */
export const stagingRoutes = {
  /** POST /v1/candidates/{candidateId}/decision */
  decideCandidate: (params: { candidateId: string }) =>
    `/v1/candidates/${params.candidateId}/decision`,
  /** GET /v1/candidates/{candidateId} */
  getCandidate: (params: { candidateId: string }) => `/v1/candidates/${params.candidateId}`,
  /** GET /v1/captures/{captureId} */
  getCapture: (params: { captureId: string }) => `/v1/captures/${params.captureId}`,
  /** GET /v1/candidates */
  listCandidates: "/v1/candidates",
  /** GET /v1/captures */
  listCaptures: "/v1/captures",
} as const;
