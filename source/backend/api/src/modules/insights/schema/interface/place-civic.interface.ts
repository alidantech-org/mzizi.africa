import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { PlaceCrumb } from "#/modules/insights/schema/interface/place-crumb.interface.ts";

/** Place Civic */
export interface PlaceCivic {
  chain: PlaceCrumb[];
  classes: Record<string, unknown>[];
  fund?: Record<string, unknown> | null;
  gaps: NonEmptyString500[];
  infrastructure: Record<string, unknown>;
  leadership: Record<string, unknown>[];
  place: PlaceCrumb;
  projects: Record<string, unknown>[];
  years: Record<string, unknown>[];
}
