/**
 * Interactions API routes: one entry per HTTP operation. Routes with path parameters
 * are typed functions; static routes are strings.
 */
export const interactionsRoutes = {
  /** GET /v1/engagement */
  getEngagement: "/v1/engagement",
  /** POST /v1/likes */
  like: "/v1/likes",
  /** POST /v1/views */
  recordView: "/v1/views",
  /** POST /v1/likes/remove */
  unlike: "/v1/likes/remove",
} as const;
