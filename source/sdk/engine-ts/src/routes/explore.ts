/**
 * Explore API routes: one entry per HTTP operation. Routes with path parameters
 * are typed functions; static routes are strings.
 */
export const exploreRoutes = {
  /** GET /v1/explore/db/lists/{domain}/{code} */
  getDataListPage: (params: { domain: string; code: string }) =>
    `/v1/explore/db/lists/${params.domain}/${params.code}`,
  /** GET /v1/explore/file */
  getFile: "/v1/explore/file",
  /** GET /v1/explore/jobs/{jobId} */
  getJobDetail: (params: { jobId: string }) => `/v1/explore/jobs/${params.jobId}`,
  /** GET /v1/explore/file/data */
  getRawFile: "/v1/explore/file/data",
  /** GET /v1/explore/db/tables/{domain}/{table} */
  getTablePage: (params: { domain: string; table: string }) =>
    `/v1/explore/db/tables/${params.domain}/${params.table}`,
  /** GET /v1/explore/db/lists */
  listDataLists: "/v1/explore/db/lists",
  /** GET /v1/explore/db/domains */
  listDatabaseDomains: "/v1/explore/db/domains",
  /** GET /v1/explore/roots */
  listFileRoots: "/v1/explore/roots",
  /** GET /v1/explore/files */
  listFiles: "/v1/explore/files",
  /** GET /v1/explore/terms */
  listTermGroups: "/v1/explore/terms",
  /** POST /v1/explore/csv/prepare */
  prepareCsv: "/v1/explore/csv/prepare",
  /** PUT /v1/explore/file */
  saveFile: "/v1/explore/file",
  /** POST /v1/explore/terms/tag */
  tagTexts: "/v1/explore/terms/tag",
} as const;
