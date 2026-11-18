import { SystemHealthState } from "#sdk/types/enums/system/health-state.ts";

/** Dependency */
export interface SystemDependency {
  detail?: string;
  name: string;
  state: SystemHealthState;
}
