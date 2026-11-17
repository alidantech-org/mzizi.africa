/**
 * Engine API routes: one entry per HTTP operation. Routes with path parameters
 * are typed functions; static routes are strings.
 */
export const engineRoutes = {
  /** GET /capabilities */
  listCapabilities: '/capabilities',
} as const;