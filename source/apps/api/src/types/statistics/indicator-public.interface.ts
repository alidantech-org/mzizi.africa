
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { UnitOfMeasure } from "#/types/statistics/unit-of-measure.type.ts";
import type { IndicatorCategory } from "#/types/statistics/indicator-category.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Indicator Public */
export interface IndicatorPublic {
  categoryId: Id;
  code: BusinessCode;
  createdAt: DateTime;
  definition?: Description | null;
  id: Id;
  isCurrent: Flag;
  name: Name;
  parentId?: Id | null;
  unitOfMeasure?: UnitOfMeasure | null;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}