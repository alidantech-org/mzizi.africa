import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { PlaceCrumb } from "#/modules/insights/schema/interface/place-crumb.interface.ts";

/** Governance Tree */
export interface GovernanceTree {
  edges: Record<string, unknown>[];
  gaps: NonEmptyString500[];
  legend: Record<string, unknown>[];
  nodes: Record<string, unknown>[];
  place?: PlaceCrumb | null;
  rail: Record<string, unknown>[];
  tab: Record<string, unknown>;
}
