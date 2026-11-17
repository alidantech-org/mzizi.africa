/**
 * Auth API routes: one entry per HTTP operation. Routes with path parameters
 * are typed functions; static routes are strings.
 */
export const authRoutes = {
  /** GET /v1/account */
  getMyAccount: "/v1/account",
  /** GET /v1/admin/accounts */
  listAccounts: "/v1/admin/accounts",
} as const;
