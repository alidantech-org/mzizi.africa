/**
 * Ledger API routes: one entry per HTTP operation. Routes with path parameters
 * are typed functions; static routes are strings.
 */
export const ledgerRoutes = {
  /** GET /v1/coverage */
  getCoverage: "/v1/coverage",
  /** GET /v1/budgets */
  listBudgets: "/v1/budgets",
  /** GET /v1/coalitions */
  listCoalitions: "/v1/coalitions",
  /** GET /v1/funds */
  listFunds: "/v1/funds",
  /** GET /v1/manifestos */
  listManifestos: "/v1/manifestos",
} as const;
