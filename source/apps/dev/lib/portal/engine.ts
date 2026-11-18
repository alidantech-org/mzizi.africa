/** Typed reads the portal makes through the generated engine SDK (server actions; the service key stays on the server). */
import { listCapabilities } from "@mzizi/engine-client/actions/engine/list-capabilities.actions.ts";
import { listJobs } from "@mzizi/engine-client/actions/engine/list-jobs.actions.ts";
import { getSeedCatalog } from "@mzizi/engine-client/actions/catalog/get-seed-catalog.actions.ts";
import { getHealth } from "@mzizi/engine-client/actions/system/get-health.actions.ts";
import type { EngineCapabilityList } from "@mzizi/engine-client/types/engine/capability-list.ts";
import type { EngineJobList } from "@mzizi/engine-client/types/engine/job-list.ts";
import type { CatalogSeedCatalog } from "@mzizi/engine-client/types/catalog/seed-catalog.ts";
import type { SystemHealth } from "@mzizi/engine-client/types/system/health.ts";

async function body<T>(pending: Promise<{ success: boolean; message: string; status: number; body: T | null }>): Promise<T> {
  const response = await pending;
  if (!response.success || response.body === null) {
    const detail = response.body as { message?: string; detail?: string } | null;
    throw new Error(detail?.message ?? detail?.detail ?? `${response.status} ${response.message}`);
  }
  return response.body;
}

export const capabilities = (): Promise<EngineCapabilityList> => body(listCapabilities());
export const jobs = (): Promise<EngineJobList> => body(listJobs());
export const seedTables = (): Promise<CatalogSeedCatalog> => body(getSeedCatalog());

/** The engine's `/health` document, typed by the contract. */
export const health = (): Promise<SystemHealth> => body(getHealth());
