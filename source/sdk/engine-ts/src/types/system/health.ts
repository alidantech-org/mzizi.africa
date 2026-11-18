import type { SystemPackageHealth } from "#sdk/types/system/package-health.ts";

/** Health */
export interface SystemHealth {
  active_jobs: number;
  auth: string;
  capabilities: number;
  packages: SystemPackageHealth[];
  runtime: string;
  service: string;
  status: string;
  store: string;
  version: string;
}
