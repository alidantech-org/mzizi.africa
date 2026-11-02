
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Occupation } from "#/types/person/occupation.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Person } from "#/types/person/person.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Person Profile Public */
export interface PersonProfilePublic {
  biography?: LongText | null;
  createdAt: DateTime;
  id: Id;
  isCurrent: Flag;
  language?: Label | null;
  nationalityId?: Id | null;
  occupation?: Occupation | null;
  personId: Id;
  summary?: Description | null;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}