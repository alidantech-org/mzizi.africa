/** Logical stores only. Group storage facets select them; deployment names live in root dryv.yaml. */
export const databaseStores = {
  main: { description: "Accepted, versioned domain knowledge and evidence metadata." },
  operations: { description: "Authorization, acquisition, processing, staging, analytics and operational audit." },
} as const;
