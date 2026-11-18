import { SystemHealthState } from "#sdk/types/enums/system/health-state.ts";
import type { SystemDependency } from "#sdk/types/system/dependency.ts";

/** Readiness */
export interface SystemReadiness {
  dependencies: SystemDependency[];
  state: SystemHealthState;
}
