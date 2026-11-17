export const SCRAPER = {
  // === QUERIES ENDPOINTS ===
  QUERIES: {
    GET: {
      list: '/scraper/queries',
      byId: (id: string) => `/scraper/queries/${id}`,
    },
    POST: {
      create: '/scraper/queries',
    },
    PUT: {
      update: (id: string) => `/scraper/queries/${id}`,
    },
    DELETE: {
      delete: (id: string) => `/scraper/queries/${id}`,
    },
    ACTION: {
      run: (id: string) => `/scraper/queries/${id}/run`,
      pause: (id: string) => `/scraper/queries/${id}/pause`,
      resume: (id: string) => `/scraper/queries/${id}/resume`,
    },
  },

  // === SOURCES ENDPOINTS ===
  SOURCES: {
    GET: {
      list: '/scraper/sources',
      byId: (id: string) => `/scraper/sources/${id}`,
    },
    POST: {
      create: '/scraper/sources',
    },
    PUT: {
      update: (id: string) => `/scraper/sources/${id}`,
    },
    DELETE: {
      delete: (id: string) => `/scraper/sources/${id}`,
    },
  },

  // === RUNS ENDPOINTS ===
  RUNS: {
    GET: {
      list: '/scraper/runs',
      byId: (id: string) => `/scraper/runs/${id}`,
    },
    POST: {
      create: '/scraper/runs',
    },
  },

  // === RESULTS ENDPOINTS ===
  RESULTS: {
    GET: {
      list: '/scraper/results',
      byId: (id: string) => `/scraper/results/${id}`,
    },
  },

  // === STATS ENDPOINTS ===
  STATS: {
    GET: {
      overview: '/scraper/stats',
      byQuery: (id: string) => `/scraper/stats/queries/${id}`,
      bySource: (id: string) => `/scraper/stats/sources/${id}`,
    },
  },
} as const;
