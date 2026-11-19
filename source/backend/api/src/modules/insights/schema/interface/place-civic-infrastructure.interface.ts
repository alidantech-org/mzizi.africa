import type { Number } from "#/modules/shared/schema/type/number.type.ts";

/** Place Civic Infrastructure */
export interface PlaceCivicInfrastructure {
  areaKm2?: Number | null;
  completed: Number;
  completionRate?: Number | null;
  per100k?: Number | null;
  perKm2?: Number | null;
  population?: Number | null;
  projectShare?: Number | null;
  projects: Number;
  staffShare?: Number | null;
}
