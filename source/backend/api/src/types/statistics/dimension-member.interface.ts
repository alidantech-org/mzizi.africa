
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { SortOrder } from "#/types/statistics/sort-order.type.ts";
import type { HistoricalEntity } from "#/types/shared/historical-entity.interface.ts";
import type { Dimension } from "#/types/statistics/dimension.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Dimension Member */
export interface DimensionMember {
  code: BusinessCode;
  createdAt: DateTime;
  dimensionId: Id;
  id: Id;
  isCurrent: Flag;
  label: Label;
  parentId?: Id | null;
  referenceCode?: BusinessCode | null;
  sortOrder?: SortOrder | null;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}