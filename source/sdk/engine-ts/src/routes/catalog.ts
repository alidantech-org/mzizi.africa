/**
 * Catalog API routes: one entry per HTTP operation. Routes with path parameters
 * are typed functions; static routes are strings.
 */
export const catalogRoutes = {
  /** GET /v1/catalog/seed-tables */
  getSeedCatalog: "/v1/catalog/seed-tables",
} as const;
