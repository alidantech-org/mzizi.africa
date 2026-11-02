
import type { UnitKind } from "#/types/geography/unit-kind.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { MediaMarker } from "#/types/shared/media-marker.enum.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { WikidataId } from "#/types/shared/wikidata-id.type.ts";
import type { HistoricalEntity } from "#/types/shared/historical-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Geo Unit */
export interface GeoUnit {
  code: BusinessCode;
  createdAt: DateTime;
  emblemMarker?: MediaMarker | null;
  flagMarker?: MediaMarker | null;
  id: Id;
  isActive: Flag;
  isCurrent: Flag;
  jurisdictionId: Id;
  kind: UnitKind;
  levelId: Id;
  name: Name;
  parentId?: Id | null;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
  wikidataId?: WikidataId | null;
}