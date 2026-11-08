
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { MediaMarker } from "#/types/shared/media-marker.enum.ts";
import type { ClassificationScheme } from "#/types/reference/classification-scheme.type.ts";
import type { Label } from "#/types/reference/label.type.ts";
import type { Order } from "#/types/reference/order.type.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Jurisdiction } from "#/types/reference/jurisdiction.interface.ts";
import type { HistoricalEntity } from "#/types/shared/historical-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Classification Record */
export interface ClassificationRecord {
  code: BusinessCode;
  createdAt: DateTime;
  emblemExpected?: MediaMarker | null;
  flagExpected?: MediaMarker | null;
  id: Id;
  isCurrent: Flag;
  jurisdictionId: Id;
  label: Label;
  legalBasis?: Description | null;
  order?: Order | null;
  scheme: ClassificationScheme;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}