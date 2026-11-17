/** Typed reads the portal makes over the generated engine clients, plus the health document (not yet in the contract). */
import { getSeedCatalog, getSeedCatalogRequest } from "#/lib/api/catalog/get-seed-catalog.ts";
import { listCapabilities } from "#/lib/api/engine/list-capabilities.ts";
import { listJobs, listJobsRequest } from "#/lib/api/engine/list-jobs.ts";
import type { ClientResponse } from "#/lib/dryv/transport.ts";
import type { CapabilityList } from "#/lib/types/capability-list.ts";
import type { JobList } from "#/lib/types/job-list.ts";
import type { SeedCatalog } from "#/lib/types/seed-catalog.ts";

async function body<T>(pending: Promise<ClientResponse<T>>): Promise<T> {
  const response = await pending;
  if (!response.success || response.body === null) {
    const detail = response.body as { message?: string; detail?: string } | null;
    throw new Error(detail?.message ?? detail?.detail ?? `${response.status} ${response.message}`);
  }
  return response.body;
}

export const capabilities = (): Promise<CapabilityList> => body(listCapabilities());
export const jobs = (): Promise<JobList> => body(listJobs(listJobsRequest()));
export const seedTables = (): Promise<SeedCatalog> => body(getSeedCatalog(getSeedCatalogRequest()));

/** One package the engine hosts, as `/health` reports it. */
export interface PackageHealth {
  readonly name: string;
  readonly exposure: string;
  readonly in_flight: number;
  readonly max_concurrency: number;
}

/** The engine's `/health` document. */
export interface EngineHealth {
  readonly status: string;
  readonly service: string;
  readonly version: string;
  readonly store: string;
  readonly auth: string;
  readonly runtime: string;
  readonly capabilities: number;
  readonly active_jobs: number;
  readonly packages: readonly PackageHealth[];
}

export async function health(): Promise<EngineHealth> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? ""}/health`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`The engine answered ${response.status}.`);
  return (await response.json()) as EngineHealth;
}
