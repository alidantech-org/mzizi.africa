/**
 * System API routes: one entry per HTTP operation. Routes with path parameters
 * are typed functions; static routes are strings.
 */
export const systemRoutes = {
  /** GET /health */
  getHealth: "/health",
  /** GET /ready */
  getReadiness: "/ready",
} as const;
