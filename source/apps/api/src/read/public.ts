import { Raw } from "typeorm";

/**
 * What the public API may serve. These constraints are applied inside the use cases, so a client
 * cannot ask for restricted data by changing a query parameter.
 */
export const PUBLIC_EXPOSURE = { exposure: "public" } as const;
export const PUBLIC_FILE = { visibility: "public", status: "active" } as const;
export const PUBLIC_FOLDER = { visibility: "public" } as const;

/** Rows that belong to a public, active file (versions and attachments). */
export const OF_PUBLIC_FILE = {
  fileId: Raw((alias) => `${alias} IN (SELECT id FROM filesystem.files WHERE visibility = 'public' AND status = 'active')`),
} as const;
