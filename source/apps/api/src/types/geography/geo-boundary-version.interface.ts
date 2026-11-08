
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { GeoJson } from "#/types/geography/geo-json.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { GeoUnit } from "#/types/geography/geo-unit.interface.ts";
import type { HistoricalEntity } from "#/types/shared/historical-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Geo Boundary Version */
export interface GeoBoundaryVersion {
  createdAt: DateTime;
  geometry: GeoJson;
  id: Id;
  isCurrent: Flag;
  labelPoint?: GeoJson | null;
  referenceYear?: Version | null;
  unitId: Id;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
  versionNumber: Version;
}