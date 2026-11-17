/**
 * Governance API routes: one entry per HTTP operation. Routes with path parameters
 * are typed functions; static routes are strings.
 */
export const governanceRoutes = {
  /** GET /v1/governance/institutions */
  browseInstitutions: "/v1/governance/institutions",
  /** GET /v1/governance/institutions/{institutionId} */
  getInstitution: (params: { institutionId: string }) =>
    `/v1/governance/institutions/${params.institutionId}`,
  /** GET /v1/governance/offices/{officeId} */
  getOffice: (params: { officeId: string }) => `/v1/governance/offices/${params.officeId}`,
} as const;
